import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[];
  empToDisplay: Employee;
  private currentIndex = 1;
  childEventData: string;
  private search: string;

  // set and get properties
  // implementing filtering/sorting data from the here instead of custom pipe filter
  // created a temp list (filteredEmployees) which holds the list of employees
  // so when the property value is set in the textbox from view template, we then filter the employees based on the searchterm
  // this.filteredEmployees = this.filterEmployeesList(value); --receives a search test from user and we the filter in the list

  get searchText(): string { // search text ngModel ([(ngModel)]="searchText") from  view template
    return this.search;
  }

  set searchText(value: string) {
    this.search = value;
    this.filteredEmployees = this.filterEmployeesList(value);
  }

  filterEmployeesList(searchValue: string): Employee[] {
    return this.employees.filter(emp => emp.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
  }



  // initializing the employee service in the constructor
  // which in the background, dependency injection happens
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }



  // fetching data using resolver
  // empList -- should be same the key specified in app-routing module
  // with routes which is  -- { path: 'list', component: ListEmployeesComponent , resolve: { empList : EmployeeListResolverService } },
  ngOnInit(): void {

    this.employees = this.activatedRoute.snapshot.data.empList;
    if (this.activatedRoute.snapshot.queryParamMap.has('searchText')) {
      this.searchText = this.activatedRoute.snapshot.queryParamMap.get('searchText');
    }
    else{
      this.filteredEmployees = this.employees;
    }

    this.empToDisplay = this.employees[0];
  }


  // normal porcess of fetching the data
  // ngOnInit(): void {
  //   // for static list of employees list we as follows
  //   // this.employees = this.empService.getEmployees();

  //   // but for the dynamic data fetched over http which returns Observable data,
  //   // we write as follows
  //   this.empService.getEmployees().subscribe((empList) => {
  //     this.employees = empList;

  //     // so here, we are checking if the query param exists and if exists,
  //     // we capture the value an assign to the searchText - property to get the filtered employees
  //     // if doesnt exist then we show all the employees
  //     if (this.activatedRoute.snapshot.queryParamMap.has('searchText')) {
  //       this.searchText = this.activatedRoute.snapshot.queryParamMap.get('searchText');
  //     }
  //     else {
  //       this.filteredEmployees = this.employees;
  //     }
  //     this.empToDisplay = this.employees[0];

  //   });


    // also can be done by Observable approach

    // this.activatedRoute.queryParamMap.subscribe ( (queryParams) =>
    // {
    //     if(queryParams.has('searchText'))
    //     {
    //       this.searchText = queryParams.get('searchText');
    //     }
    //     else{
    //       this.filteredEmployees = this.employees;
    //     }
    // });

    // // to read the query string params from the url

    // // checks if the query string exists
    // console.log(this.activatedRoute.snapshot.queryParamMap.has('searchText'));

    // // gets the query param value with provided key
    // console.log(this.activatedRoute.snapshot.queryParamMap.get('searchText'));

    // // gets the array of query string params values
    // console.log(this.activatedRoute.snapshot.queryParamMap.getAll('searchText'));

    // // gets all the keys of query strings/names without values available
    // console.log(this.activatedRoute.snapshot.queryParamMap.keys);

    // //  to read from other than query strings we use  "ParamMap" as which has all the above properties
    // console.log(this.activatedRoute.snapshot.paramMap.keys);
  // }

  nextEmployee(): void {

    if (this.currentIndex < this.employees.length) {
      this.empToDisplay = this.employees[this.currentIndex];
      this.currentIndex++;
      this.childEventData = null;
    }
    else {
      this.empToDisplay = this.employees[0];
      this.currentIndex = 1;
      this.childEventData = null;
    }
  }

  // storing the received child data into a variable
  handleNotify(eventData: string): void {
    this.childEventData = eventData;
  }

  // on the click employye, we are navigating to details page
  // so here we are creating a navigation link
  // navigate(['/employees', empId]) -- the first param  is route and second is the value
  // to pass as querystring params in th nav link - { queryParams : {searchText: this.search, testParam : 'testValue , ... }

  onClick(empId: number): void {
    this.router.navigate(['/employees', empId], { queryParams: { searchText: this.searchText, testParam: 'testValue' } });
  }


  changeEmpName(): void {
    // as we are changing the name of first employee, we are binding the list again with search term as
    // this.filteredEmployees = this.filterEmployeesList(this.search);
    this.employees[0].name = 'Bane';
    this.filteredEmployees = this.filterEmployeesList(this.search);
  }

}
