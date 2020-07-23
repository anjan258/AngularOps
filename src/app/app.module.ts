import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; // for datepicker
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // for datepicker
import { SelectRequiredValidatorDirective } from './shared/select-required-validator.directive';  // importing custom validator
import { ConfirmEqualValidatorDirective } from './shared/confim-equal-validator.directive';  // importing custom validator
import { EmployeeService } from './employees/employee.service';
import { CreateEmployeeCanDeactivateGuardService } from './employees/create-employee-can-deactivate-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListEmployeesComponent } from './employees/list-employees.component';
import { CreateEmployeeComponent } from './employees/create-employee.component';
import { DisplayEmployeesComponent } from './employees/display-employees.component';
import { EmployeeDetailsComponent } from './employees/employee-details.component';
import { EmployeeFilterPipe } from './employees/employee-filter.pipe';
import { EmployeeListResolverService } from './employees/employee-list-resolver.service.ts';
import { PageNotFoundComponent } from './page-not-found.component';
import {EmployeeDetailsGuardService} from './employees/employee-details-guard.service.ts';

@NgModule({
  declarations: [
    AppComponent,
    ListEmployeesComponent,
    CreateEmployeeComponent,
    SelectRequiredValidatorDirective,
    ConfirmEqualValidatorDirective,
    DisplayEmployeesComponent,
    EmployeeDetailsComponent,
    EmployeeFilterPipe,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [EmployeeService, CreateEmployeeCanDeactivateGuardService , EmployeeListResolverService , EmployeeDetailsGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
