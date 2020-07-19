         DECLARE @startdate_x DATETIME, @enddate_x DATETIME;
		 DECLARE @IsOwnerTax BIT 
		 DECLARE @STOREID INT

		 DECLARE @DATABASENAME VARCHAR(50) =( SELECT DB_NAME())
		 IF(@DATABASENAME LIKE 'EngageAndGrowUS%')
		 begin
		  set @isownertax = 0
		  set @storeid = 34
		 end
		 else
		 begin
		  set @isownertax = 1
		  set @storeid = 33
		 end

/* local variables - for performance improvement (parameter sniffing) */
	IF EXISTS(SELECT name FROM ..sysobjects WHERE name = N'promotionclaims' AND xtype='U')
	BEGIN
	DROP TABLE promotionclaims
	END

	IF EXISTS(SELECT name FROM ..sysobjects WHERE name = N'CBMReportData' AND xtype='U')
	BEGIN
	DROP TABLE CBMReportData
	END

             SET @startdate_x = '01/01/2019' --DATEADD(YEAR,-@YearOfData,GETDATE());
        
             SET @enddate_x = '12/31/2019';

             SELECT PromotionForm.id AS [PromotionId],
                    r.name AS [PartnerName],
                    r.PartnerNumber 'PartnerNumber',
					UT.Type 'User Type Name',
                    r.LocationId 'LocationId',
                    c.email AS 'Email',
                    c.FirstName AS 'FirstName',
                    c.lastname AS 'LastName',
                    syncUser.externalid AS [UserId],
                    Promotion.name AS 'PromotionName',
					(SELECT TOP 1 pff.Value
						from ChannelManager_HPE_QA.dbo.PromotionFormField pff
						join ChannelManager_HPE_QA.dbo.PromotionFormTemplateField pftf
						on pff.PromotionFormTemplateFieldId = pftf.id
						and pftf.LabelText like 'End User Company Name%'
						where pff.promotionformid = PromotionForm.Id
						and pff.deleted = 0 ) as 'End User Company Name',
					(SELECT TOP 1 pff.Value
						from ChannelManager_HPE_QA.dbo.PromotionFormField pff
						join ChannelManager_HPE_QA.dbo.PromotionFormTemplateField pftf
						on pff.PromotionFormTemplateFieldId = pftf.id
						and pftf.LabelText like 'End User City%'
						where pff.promotionformid = PromotionForm.Id
						and pff.deleted = 0 ) as 'End User City',
					(SELECT TOP 1 pff.Value
						from ChannelManager_HPE_QA.dbo.PromotionFormField pff
						join ChannelManager_HPE_QA.dbo.PromotionFormTemplateField pftf
						on pff.PromotionFormTemplateFieldId = pftf.id
						and pftf.LabelText like 'End User Invoice Date%'
						where pff.promotionformid = PromotionForm.Id
						and pff.deleted = 0 ) as 'End User Invoice Date',
					(SELECT TOP 1 pff.Value
						from ChannelManager_HPE_QA.dbo.PromotionFormField pff
						join ChannelManager_HPE_QA.dbo.PromotionFormTemplateField pftf
						on pff.PromotionFormTemplateFieldId = pftf.id
						and pftf.LabelText like 'End User Invoice Number%'
						where pff.promotionformid = PromotionForm.Id
						and pff.deleted = 0 ) as 'End User Invoice Number',
					(SELECT TOP 1 pff.Value
						from ChannelManager_HPE_QA.dbo.PromotionFormField pff
						join ChannelManager_HPE_QA.dbo.PromotionFormTemplateField pftf
						on pff.PromotionFormTemplateFieldId = pftf.id
						and pftf.LabelText like 'Qty Spiff based on%'
						where pff.promotionformid = PromotionForm.Id
						and pff.deleted = 0 ) as 'Qty Spiff based on',
					skulistprice.listprice as 'SKU List Price Total',
                    IsNull(points.Points, 0) AS 'Points',
                    CASE
                        WHEN(c.UserTypeId = 4)
                        THEN 0.00
                        ELSE ChannelManager_HPE_QA.dbo.RoundNumber((Isnull(points.Points, 0)) * r.Surcharge)
                    END AS 'AvailableSurcharge',
                    CASE
                        WHEN(c.UserTypeId = 3)
                        THEN ChannelManager_HPE_QA.dbo.RoundNumber((Isnull(points.Points, 0))) + ChannelManager_HPE_QA.dbo.RoundNumber((Isnull(points.Points, 0)) * r.Surcharge)
                        WHEN(@IsOwnerTax = 1
                             AND c.UserTypeId = 4)
                        THEN CAST(((ROUND((IsNull(points.Points, 0) +
(
    SELECT IsNull(TaxAmount, 0)
    FROM ChannelManager_HPE_QA.dbo.[Select_ResellerTaxAmount](c.StoreID, c.resellerid, Points.Points)
)), 2))) AS NUMERIC(36, 2))
                        ELSE IsNull(points.Points, 0)
                    END AS 'TotalPromotion',
                    PromotionForm.StatusUpdateOnUtc AS 'ApprovalDate',
                    CONVERT(VARCHAR(10), RIGHT('0'+CONVERT(VARCHAR, DATEPART(MM, PromotionForm.StatusUpdateOnUtc)), 2))+'/'+CONVERT(VARCHAR(10), RIGHT(DATENAME(YY, PromotionForm.StatusUpdateOnUtc), 2)) AS 'YY/MM Code',
                    ProductLine.Name 'PLCode',
					'Q'+CAST(ChannelManager_HPE_QA.dbo.PE_FUNCT_GetQuartersByMonth(DATENAME(MONTH,PromotionForm.StatusUpdateOnUtc)) AS VARCHAR)+right(cast(year(PromotionForm.StatusUpdateOnUtc) as varchar),2) as [Quarter],
                    c.UserTypeId,
                    c.id,
                    c.ResellerId,
                    c.StoreID,
                    CASE
                        WHEN(@IsOwnerTax = 1
                             AND c.UserTypeId = 4)
                        THEN
(
    SELECT IsNull(TaxAmount, 0)
    FROM ChannelManager_HPE_QA.dbo.[Select_ResellerTaxAmount](c.StoreID, c.resellerid, Points.Points)
)
                        ELSE 0.00
                    END AS 'OwnerTax',
					vendor.Name as [Business Unit],
					PromotionForm.CreatedBy as Claimant,
					c.id as internalid
				into promotionclaims	
             FROM ChannelManager_HPE_QA.dbo.pointsentity pentity
                  INNER JOIN ChannelManager_HPE_QA.dbo.PointsEntity_Customer_Mapping points ON pentity.id = points.pointsentityid
                  INNER JOIN ChannelManager_HPE_QA.dbo.PromotionForm ON pentity.EntityId = PromotionForm.Id
                                              AND pentity.[EntityTypeId] = 13
                  INNER JOIN ChannelManager_HPE_QA.dbo.Promotion ON PromotionForm.PromotionId = Promotion.Id
                  
                  INNER JOIN ChannelManager_HPE_QA.dbo.customer c ON c.id = points.customerid
				  JOIN ChannelManager_HPE_QA.dbo.UserType UT ON UT.Id = C.UserTypeId
                  INNER JOIN ChannelManager_HPE_QA.dbo.reseller r ON r.id = c.resellerid
                                           AND r.istestaccount = 0
                  INNER JOIN ChannelManager_HPE_QA.dbo.SyncMapping syncUser ON syncUser.InternalId = c.Id
                                                     AND syncUser.SyncMappingTypeId = 1
                                                     AND c.StoreID = syncUser.StoreId
                  INNER JOIN ChannelManager_HPE_QA.dbo.SyncMapping syncReseller ON syncReseller.InternalId = r.Id
                                                         AND syncReseller.SyncMappingTypeId = 2
                                                         AND r.StoreID = syncReseller.StoreId
				  LEFT OUTER JOIN ChannelManager_HPE_QA.dbo.ProductLine 
				  join ChannelManager_HPE_QA.dbo.Vendor on ProductLine.VendorId = Vendor.Id
				  ON ProductLine.Id = points.ProductLineId
				  left join (select 
					PromotionFormId,sum(Quantity*tsku.Price) listprice
					from ChannelManager_HPE_QA.dbo.PromotionFormSku formsku
					join ChannelManager_HPE_QA.dbo.PromotionFormTemplateSku tsku
					on formsku.PromotionFormTemplateSkuId = tsku.Id
					group by PromotionFormId) skulistprice on skulistprice.PromotionFormId = PromotionForm.Id
             WHERE c.deleted = 0
                   AND c.istestaccount = 0
                   AND PromotionForm.statusid = 30
                   AND c.storeid = @StoreId                 
                   AND PromotionForm.StatusUpdateOnUtc >= @startdate_x
                   AND PromotionForm.StatusUpdateOnUtc <= @enddate_x
				 
             ORDER BY PromotionForm.id;
select * into CBMReportData from
(
select 
CASE WHEN [Type of Claim] = 'Bulk Claim' THEN '2-Claims - Bulk' ELSE '1-Claims - Individual' END [Reward Type]								  ,
[Claim #]									  ,
[Purchase Order#]							  ,
[Invoice Numbers]							  ,
[Date Claim Entered]						  ,
[Purchase Order Date]						  ,
[Type Of User]						,
PE_ClaimDetailsReport.[User ID]									  ,
PE_ClaimDetailsReport.[Email]										  ,
PE_ClaimDetailsReport.[First Name]								  ,
PE_ClaimDetailsReport.[Last Name]									  ,
[Company]									  ,
PE_ClaimDetailsReport.[Partner Number]							  ,
PE_ClaimDetailsReport.[Location ID]								  ,
[Sku Description]							  ,
[SKU]										  ,
[ClaimDetailType]				as [Sales ClaimDetailType],
[ClaimBonusID]					as [Sales ClaimBonusID],
[Claim Product Type]						  ,
[Product Line]								  ,
[Business Unit]								  ,
[Purchase Order Contact]					  ,
[Purchase Order Company]					  ,
[Address 1]									  ,
[Address 2]									  ,
[City]										  ,
[Province/State]							  ,
[Postal/Zip Code]							  ,
[Country]									  ,
[Claim Note]								  ,
[Status]									  ,
[Date Processed]							  ,
Email as Claimant,
[Share %]									  ,
sum([Share Reward Dollars])		[Share Reward Dollars]  ,
[Bulk Upload Period]						  ,
[Type of Claim]								  ,
[List Price]								  ,
PE_ClaimDetailsReport.[User Type Name]	as [Partners Membership Level],
[Category]									  ,
[Sub-Category]								  ,
[Serial Number Required]					  ,
[Cap]										  ,
count(*) as Qty,
ISNULL(part.[Is Partner EFT],'No') as [EFT Flag],
sum([Reward Company Total]	)		[SUM - Reward Company Total]	,
sum([User Reward Dollars]	)		[SUM - User Reward Dollars]	,
sum([Applicable Surcharge]	)		[SUM - Applicable Surcharge]	,
sum([Reward Dollar Total]	)		[SUM - Reward Dollar Total]	,
null as [Users Partner Security Group],
[Claim Billing Date]						  ,
[Claim Billing YY/MM]						  ,
[Claim Billing Quarter]						  ,
[Date Claim YY/MM]							  ,
[Date Claim Quarter]						  ,
[Purchase Order YY/MM]						  ,
[Purchase Order Quarter]					  ,
[PointsId]									  ,
[PointsTypeID]								  ,
[PointsType]								  ,
[Description]								  ,
[Points Type Desc]							  ,
[ApprovalDate]								  ,
[CatalogItem Reward Company Total]			  ,
[CatalogItem User Reward Dollars]			  ,
[SalesClaimItem User Reward Dollars]		  ,

[Sales Manager Reward Dollars]				  ,
[Applicable Sales Manager Surcharge]		  ,
[Reward Company Tax]						  ,
[Reward Company Tax Note]					  ,

[SalesClaimStatusDescription]				  ,
[Date Processed YY/MM]						  ,
[Date Processed Quarter]					  ,
[Approver Name]								  ,
[iQuote ID]									  ,
[BulkID]									  ,
[ClaimID]									  ,
[Claim Bonus Product Line Percentage]		  ,
[Claim Bonus Percentage Order]				  ,
[Claim Bonus Percentage Count]				  ,
[Sales Manager User ID]						  ,
[Sales Manager Email]						  ,
[Sales Manager First Name]					  ,
[Sales Manager Last Name]					  ,
[End User Invoice Total Amount]				  ,
[Distributors]								  ,
[Participant Education Bonus Points]		  ,
[Owner Education Bonus Points]				  ,
[Total Education Bonus Points]				  ,
[Education Bonus Name]						  ,
[Education Bonus SKU]						  ,
null [Test Name]									  ,
null [StartDate]									  ,
null [StartDateMonth]							  ,
null [StartDateQuarter]							  ,
null [EndDate]									  ,
null [EndDateMonth]								  ,
null [EndDateQuarter]							  ,
null [Enabled]									  ,
null [IsLive]									  ,
null [MaxEarnablePoints]							  ,
null [MaxRewardedTests]							  ,
null [Score]										  ,
null [Mark]										  ,
null [Pass]										  ,
null [Bonus]										  ,
null [TestAttempt ID]							  ,
null [Legacy]									  ,
null [EntityId]									  ,
null [EducationType]								  ,
null [FormResponseId]							  ,
null [ChapterId]									  ,
null [AdjustmentDescription]								  ,
null [AdjustmentTypeID]							  ,
null [AdjustmentType]							  ,
null [PromotionCode]								  ,
null [PromotionTitle]							  ,
null [AdminAdjustmentID]							  ,
null [PromotionClaim #],
null [PromotionName]								  ,
null [End User Company Name]						  ,
null [End User City]								  ,
null [End User Invoice Date]						  ,
null [End User Invoice Number]					  ,
null [Qty Spiff based on]
from PE_ClaimDetailsReport
left join PE_UsersPartnersReport part
on PE_ClaimDetailsReport.[User ID] = part.[User ID]
and PE_ClaimDetailsReport.[Location ID] = part.[Location ID]
where [Date Processed] between @startdate_x and @enddate_x
group by 
[Type of Claim],
[Claim #]									  ,
[Purchase Order#]							  ,
[Invoice Numbers]							  ,
[Date Claim Entered]						  ,
[Purchase Order Date]						  ,
[Type Of User]						,
PE_ClaimDetailsReport.[User ID]									  ,
PE_ClaimDetailsReport.[Email]										  ,
PE_ClaimDetailsReport.[First Name]								  ,
PE_ClaimDetailsReport.[Last Name]									  ,
[Company]									  ,
PE_ClaimDetailsReport.[Partner Number]							  ,
PE_ClaimDetailsReport.[Location ID]								  ,
[Sku Description]							  ,
[SKU]										  ,
[ClaimDetailType]				,
[ClaimBonusID]					,
[Claim Product Type]						  ,
[Product Line]								  ,
[Business Unit]								  ,
[Purchase Order Contact]					  ,
[Purchase Order Company]					  ,
[Address 1]									  ,
[Address 2]									  ,
[City]										  ,
[Province/State]							  ,
[Postal/Zip Code]							  ,
[Country]									  ,
[Claim Note]								  ,
[Status]									  ,
[Date Processed]							  ,
Email,
[Share %]									  ,
[Bulk Upload Period]						  ,
[Type of Claim]								  ,
[List Price]								  ,
PE_ClaimDetailsReport.[User Type Name],
[Category]									  ,
[Sub-Category]								  ,
[Serial Number Required]					  ,
[Cap]										  ,
ISNULL(part.[Is Partner EFT],'No') ,
[Claim Billing Date]						  ,
[Claim Billing YY/MM]						  ,
[Claim Billing Quarter]						  ,
[Date Claim YY/MM]							  ,
[Date Claim Quarter]						  ,
[Purchase Order YY/MM]						  ,
[Purchase Order Quarter]					  ,
[PointsId]									  ,
[PointsTypeID]								  ,
[PointsType]								  ,
[Description]								  ,
[Points Type Desc]							  ,
[ApprovalDate]								  ,
[CatalogItem Reward Company Total]			  ,
[CatalogItem User Reward Dollars]			  ,
[SalesClaimItem User Reward Dollars]		  ,

[Sales Manager Reward Dollars]				  ,
[Applicable Sales Manager Surcharge]		  ,
[Reward Company Tax]						  ,
[Reward Company Tax Note]					  ,

[SalesClaimStatusDescription]				  ,
[Date Processed YY/MM]						  ,
[Date Processed Quarter]					  ,
[Approver Name]								  ,
[iQuote ID]									  ,
[BulkID]									  ,
[ClaimID]									  ,
[Claim Bonus Product Line Percentage]		  ,
[Claim Bonus Percentage Order]				  ,
[Claim Bonus Percentage Count]				  ,
[Sales Manager User ID]						  ,
[Sales Manager Email]						  ,
[Sales Manager First Name]					  ,
[Sales Manager Last Name]					  ,
[End User Invoice Total Amount]				  ,
[Distributors]								  ,
[Participant Education Bonus Points]		  ,
[Owner Education Bonus Points]				  ,
[Total Education Bonus Points]				  ,
[Education Bonus Name]						  ,
[Education Bonus SKU]						  
union
select '3-Education' [Reward Type]								  ,
null [Claim #]									  ,
null [Purchase Order#]							  ,
null [Invoice Numbers]							  ,
null [Date Claim Entered]						  ,
null [Purchase Order Date]						  ,
null [Type Of User]						,
education.[user id]						,
education.[Email]						,
education.[First Name]					,
education.[Last Name]					,
[Company Name] [Company]				,
part.[Partner Number] [Partner Number]	,
education.[Location ID]					,
null [Sku Description]							  ,
null [SKU]										  ,
null [Sales ClaimDetailType],
null [Sales ClaimBonusID],
null [Claim Product Type]						  ,
[Product Line]								  ,
[BusinessUnit]								  ,
null [Purchase Order Contact]					  ,
null [Purchase Order Company]					  ,
null [Address 1]									  ,
null [Address 2]									  ,
null [City]										  ,
null [Province/State]							  ,
null [Postal/Zip Code]							  ,
null [Country]									  ,
null [Claim Note]								  ,
 [Status]									  ,
AttemptDate [Date Processed]							  ,
null Claimant,
null [Share %]									  ,
null [Share Reward Dollars]						  ,
null [Bulk Upload Period]						  ,
null [Type of Claim]								  ,
null [List Price]								  ,
part.[User Security Group] [Partners Membership Level],
null [Category]									  ,
null [Sub-Category]								  ,
null [Serial Number Required]					  ,
null [Cap]										  ,
null Qty,
ISNULL(part.[Is Partner EFT],'No') as [EFT Flag],
[Owner Dollars] [Reward Company Total]						  ,
[Reward Dollars] [User Reward Dollars]						  ,
 [Applicable Surcharge]						  ,
[Total Reward Dollars] [Reward Dollar Total]					  ,
part.UserTypeDefault [Users Partner Security Group],
null [Claim Billing Date]						  ,
null [Claim Billing YY/MM]						  ,
null [Claim Billing Quarter]						  ,
null [Date Claim YY/MM]							  ,
null [Date Claim Quarter]						  ,
null [Purchase Order YY/MM]						  ,
null [Purchase Order Quarter]					  ,
null [PointsId]									  ,
null [PointsTypeID]								  ,
null [PointsType]								  ,
null [Description]								  ,
null [Points Type Desc]							  ,
null [ApprovalDate]								  ,
null [CatalogItem Reward Company Total]			  ,
null [CatalogItem User Reward Dollars]			  ,
null [SalesClaimItem User Reward Dollars]		  , 
null [Sales Manager Reward Dollars]				  ,
null [Applicable Sales Manager Surcharge]		  ,
[Owner Tax] [Reward Company Tax]						  ,
[Owner Tax Note] [Reward Company Tax Note]					  ,
null [SalesClaimStatusDescription]				  ,
null [Date Processed YY/MM]						  ,
null [Date Processed Quarter]					  ,
null [Approver Name]								  ,
null [iQuote ID]									  ,
null [BulkID]									  ,
null [ClaimID]									  ,
null [Claim Bonus Product Line Percentage]		  ,
null [Claim Bonus Percentage Order]				  ,
null [Claim Bonus Percentage Count]				  ,
null [Sales Manager User ID]						  ,
null [Sales Manager Email]						  ,
null [Sales Manager First Name]					  ,
null [Sales Manager Last Name]					  ,
null [End User Invoice Total Amount]				  ,
null [Distributors]								  ,
null [Participant Education Bonus Points]		  ,
null [Owner Education Bonus Points]				  ,
null [Total Education Bonus Points]				  ,
null [Education Bonus Name]						  ,
null [Education Bonus SKU]						  ,
[Test Name]									  ,
[StartDate]									  ,
[StartDateMonth]							  ,
[StartDateQuarter]							  ,
[EndDate]									  ,
[EndDateMonth]								  ,
[EndDateQuarter]							  ,
[Enabled]									  ,
[IsLive]									  ,
[MaxEarnablePoints]							  ,
[MaxRewardedTests]							  ,
[Score]										  ,
[Mark]										  ,
[Pass]										  ,
[Bonus]										  ,
[TestAttempt ID]							  ,
[Legacy]									  ,
[EntityId]									  ,
[EducationType]								  ,
[FormResponseId]							  ,
[ChapterId]									  ,
null [AdjustmentDescription]								  ,
null [AdjustmentTypeID]							  ,
null [AdjustmentType]							  ,
null [PromotionCode]								  ,
null [PromotionTitle]							  ,
null [AdminAdjustmentID]							  ,
null [PromotionClaim #],
null [PromotionName]								  ,
null [End User Company Name]						  ,
null [End User City]								  ,
null [End User Invoice Date]						  ,
null [End User Invoice Number]					  ,
null [Qty Spiff based on]
from PE_EducationReport education
left join PE_UsersPartnersReport part
on education.[User ID] = part.[User ID]
and education.[Location ID] = part.[Location ID]
where AttemptDate between @startdate_x and @enddate_x
union
select '5-Promotions' [Reward Type]								  ,
null [Claim #]									  ,
null [Purchase Order#]							  ,
promotion.[End User Invoice Number] [Invoice Numbers]							  ,
null [Date Claim Entered]						  ,
null [Purchase Order Date]						  ,
null [Type Of User]						,
promotion.[userid]						,
promotion.[Email]						,
promotion.[FirstName]					,
promotion.[LastName]					,
part.[Partner Name] [Company]				,
part.[Partner Number] [Partner Number]	,
promotion.[LocationID]					,
null [Sku Description]							  ,
null [SKU]										  ,
null [Sales ClaimDetailType],
null [Sales ClaimBonusID],
null [Claim Product Type]						  ,
promotion.PLCode [Product Line]								  ,
promotion.[Business Unit] [Business Unit]								  ,
null [Purchase Order Contact]					  ,
null [Purchase Order Company]					  ,
null [Address 1]									  ,
null [Address 2]									  ,
null [City]										  ,
null [Province/State]							  ,
null [Postal/Zip Code]							  ,
null [Country]									  ,
null [Claim Note]								  ,
null [Status]									  ,
promotion.ApprovalDate [Date Processed]							  ,
null Claimant,
null [Share %]									  ,
null [Share Reward Dollars]						  ,
null [Bulk Upload Period]						  ,
null [Type of Claim]								  ,
promotion.[SKU List Price Total] [List Price]								  ,
part.UserTypeDefault	as [Partner Membership Level],
null [Category]									  ,
null [Sub-Category]								  ,
null [Serial Number Required]					  ,
null [Cap]										  ,
null Qty,
ISNULL(part.[Is Partner EFT],'No') as [EFT Flag],
case when promotion.internalid = promotion.Claimant then ownerclaim.Points else 0 end [Reward Company Total]						  ,
promotion.Points [User Reward Dollars]							  ,
promotion.[AvailableSurcharge] [Applicable Surcharge]						  ,
case when promotion.internalid = promotion.Claimant then ownerclaim.Points else 0 end + promotion.TotalPromotion [Reward Dollar Total]					  ,
null [Users Partner Security Group],
null [Claim Billing Date]						  ,
null [Claim Billing YY/MM]						  ,
null [Claim Billing Quarter]						  ,
null [Date Claim YY/MM]							  ,
null [Date Claim Quarter]						  ,
null [Purchase Order YY/MM]						  ,
null [Purchase Order Quarter]					  ,
null [PointsId]									  ,
null [PointsTypeID]								  ,
null [PointsType]								  ,
null [Description]								  ,
null [Points Type Desc]							  ,
null [ApprovalDate]								  ,
null [CatalogItem Reward Company Total]			  ,
null [CatalogItem User Reward Dollars]			  ,
null [SalesClaimItem User Reward Dollars]		  , 
null [Sales Manager Reward Dollars]				  ,
null [Applicable Sales Manager Surcharge]		  ,
promotion.OwnerTax [Reward Company Tax]						  ,
null [Reward Company Tax Note]					  ,
null [SalesClaimStatusDescription]				  ,
promotion.[YY/MM Code] [Date Processed YY/MM]						  ,
promotion.Quarter [Date Processed Quarter]					  ,
null [Approver Name]								  ,
null [iQuote ID]									  ,
null [BulkID]									  ,
null [ClaimID]									  ,
null [Claim Bonus Product Line Percentage]		  ,
null [Claim Bonus Percentage Order]				  ,
null [Claim Bonus Percentage Count]				  ,
null [Sales Manager User ID]						  ,
null [Sales Manager Email]						  ,
null [Sales Manager First Name]					  ,
null [Sales Manager Last Name]					  ,
null [End User Invoice Total Amount]				  ,
null [Distributors]								  ,
null [Participant Education Bonus Points]		  ,
null [Owner Education Bonus Points]				  ,
null [Total Education Bonus Points]				  ,
null [Education Bonus Name]						  ,
null [Education Bonus SKU]						  ,
null [Test Name]									  ,
null [StartDate]									  ,
null [StartDateMonth]							  ,
null [StartDateQuarter]							  ,
null [EndDate]									  ,
null [EndDateMonth]								  ,
null [EndDateQuarter]							  ,
null [Enabled]									  ,
null [IsLive]									  ,
null [MaxEarnablePoints]							  ,
null [MaxRewardedTests]							  ,
null [Score]										  ,
null [Mark]										  ,
null [Pass]										  ,
null [Bonus]										  ,
null [TestAttempt ID]							  ,
null [Legacy]									  ,
null [EntityId]									  ,
null [EducationType]								  ,
null [FormResponseId]							  ,
null [ChapterId]									  ,
null [AdjustmentDescription]								  ,
null [AdjustmentTypeID]							  ,
null [AdjustmentType]							  ,
null [PromotionCode]								  ,
null [PromotionTitle]							  ,
null [AdminAdjustmentID]							  ,
promotion.PromotionId as [PromotionClaim #],
promotion.[PromotionName]								  ,
promotion.[End User Company Name]						  ,
promotion.[End User City]								  ,
promotion.[End User Invoice Date]						  ,
promotion.[End User Invoice Number]					  ,
promotion.[Qty Spiff based on]
from promotionclaims promotion 
left join promotionclaims ownerclaim
on promotion.PromotionId = ownerclaim.PromotionId
and ownerclaim.[User Type Name] = 'ResellerOwner'
left join PE_UsersPartnersReport part
on promotion.[UserID] = part.[User ID]
and promotion.[LocationID] = part.[Location ID]
where promotion.ApprovalDate between @startdate_x and @enddate_x
and promotion.[User Type Name] = 'ResellerRep'

union
select '4-Adjustments' [Reward Type]								  ,
null [Claim #]									  ,
null [Purchase Order#]							  ,
null [Invoice Numbers]							  ,
null [Date Claim Entered]						  ,
null [Purchase Order Date]						  ,
null [Type Of User]						,
adjustment.[user id]						,
adjustment.[Email]						,
adjustment.[First Name]					,
adjustment.[Last Name]					,
adjustment.[Partner Name] [Company]				,
part.[Partner Number] [Partner Number]	,
adjustment.[Location ID]					,
null [Sku Description]							  ,
null [SKU]										  ,
null [Sales ClaimDetailType],
null [Sales ClaimBonusID],
null [Claim Product Type]						  ,
adjustment.[PL Code]							  ,
adjustment.[Business Unit]								  ,
null [Purchase Order Contact]					  ,
null [Purchase Order Company]					  ,
null [Address 1]									  ,
null [Address 2]									  ,
null [City]										  ,
null [Province/State]							  ,
null [Postal/Zip Code]							  ,
null [Country]									  ,
null [Claim Note]								  ,
 [Status]									  ,
adjustment.[Approval Date] [Date Processed]							  ,
null Claimant,
null [Share %]									  ,
null [Share Reward Dollars]						  ,
null [Bulk Upload Period]						  ,
null [Type of Claim]								  ,
null [List Price]								  ,
part.[User Security Group] [Partners Membership Level],
null [Category]									  ,
null [Sub-Category]								  ,
null [Serial Number Required]					  ,
null [Cap]										  ,
null Qty,
ISNULL(part.[Is Partner EFT],'No') as [EFT Flag],
NULL [Reward Company Total]						  ,
adjustment.Points [User Reward Dollars]						  ,
adjustment.[Applicable Surcharge] [Applicable Surcharge]						  ,
adjustment.Points [Reward Dollar Total]						  ,
part.UserTypeDefault [Users Partner Security Group],
null [Claim Billing Date]						  ,
null [Claim Billing YY/MM]						  ,
null [Claim Billing Quarter]						  ,
null [Date Claim YY/MM]							  ,
null [Date Claim Quarter]						  ,
null [Purchase Order YY/MM]						  ,
null [Purchase Order Quarter]					  ,
null [PointsId]									  ,
null [PointsTypeID]								  ,
null [PointsType]								  ,
null [Description]								  ,
null [Points Type Desc]							  ,
null [ApprovalDate]								  ,
null [CatalogItem Reward Company Total]			  ,
null [CatalogItem User Reward Dollars]			  ,
null [SalesClaimItem User Reward Dollars]		  , 
null [Sales Manager Reward Dollars]				  ,
null [Applicable Sales Manager Surcharge]		  ,
adjustment.OwnerTax [Reward Company Tax]						  ,
adjustment.OwnerTaxNote [Reward Company Tax Note]					  ,
null [SalesClaimStatusDescription]				  ,
null [Date Processed YY/MM]						  ,
null [Date Processed Quarter]					  ,
null [Approver Name]								  ,
null [iQuote ID]									  ,
null [BulkID]									  ,
null [ClaimID]									  ,
null [Claim Bonus Product Line Percentage]		  ,
null [Claim Bonus Percentage Order]				  ,
null [Claim Bonus Percentage Count]				  ,
null [Sales Manager User ID]						  ,
null [Sales Manager Email]						  ,
null [Sales Manager First Name]					  ,
null [Sales Manager Last Name]					  ,
null [End User Invoice Total Amount]				  ,
null [Distributors]								  ,
null [Participant Education Bonus Points]		  ,
null [Owner Education Bonus Points]				  ,
null [Total Education Bonus Points]				  ,
null [Education Bonus Name]						  ,
null [Education Bonus SKU]						  ,
null [Test Name]									  ,
null [StartDate]									  ,
null [StartDateMonth]							  ,
null [StartDateQuarter]							  ,
null [EndDate]									  ,
null [EndDateMonth]								  ,
null [EndDateQuarter]							  ,
null [Enabled]									  ,
null [IsLive]									  ,
null [MaxEarnablePoints]							  ,
null [MaxRewardedTests]							  ,
null [Score]										  ,
null [Mark]										  ,
null [Pass]										  ,
null [Bonus]										  ,
null [TestAttempt ID]							  ,
null [Legacy]									  ,
null [EntityId]									  ,
null [EducationType]								  ,
null [FormResponseId]							  ,
null [ChapterId]									  ,
adjustment.[Description]	[AdjustmentDescription]		  ,
adjustment.[AdjustmentTypeID]							  ,
adjustment.[AdjustmentType]							  ,
adjustment.[PromotionCode]								  ,
adjustment.[PromotionTitle]							  ,
adjustment.[AdminAdjustmentID]							  ,
null [PromotionClaim #],
null [PromotionName]								  ,
null [End User Company Name]						  ,
null [End User City]								  ,
null [End User Invoice Date]						  ,
null [End User Invoice Number]					  ,
null [Qty Spiff based on]
from PE_AdminAdjustmentsReport adjustment 
left join PE_UsersPartnersReport part
on adjustment.[User ID] = part.[User ID]
and adjustment.[Location ID] = part.[Location ID]
where adjustment.[Approval Date] between @startdate_x and @enddate_x

)a