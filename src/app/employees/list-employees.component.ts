import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EmployeeService } from './employee.service'; // importing the employee service
import { Router, RouterLink } from '@angular/router';

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

  get searchText(): string{ // search text ngModel ([(ngModel)]="searchText") from  view template
    return this.search;
  }

  set searchText(value: string){
    // tslint:disable-next-line: no-debugger
    debugger;
    this.search = value;
    this.filteredEmployees = this.filterEmployeesList(value);
  }

filterEmployeesList(searchValue: string): Employee[] {
    return this.employees.filter(emp => emp.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)
  }



    // initializing the employee service in the constructor
    // which in the background, dependency injection happens
  constructor(private empService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    // tslint:disable-next-line: no-debugger
    debugger;
    this.employees = this.empService.getEmployees();
    this.filteredEmployees = this.employees;
    this.empToDisplay = this.employees[0];
  }

  nextEmployee(): void{

    if (this.currentIndex < this.employees.length)
    {
        this.empToDisplay = this.employees[this.currentIndex];
        this.currentIndex++;
        this.childEventData = null;
    }
    else{
      this.empToDisplay = this.employees[0];
      this.currentIndex = 1;
      this.childEventData = null;
    }
  }

  // storing the received child data into a variable
  handleNotify(eventData: string): void{
    this.childEventData = eventData;
  }

  // on the click employye, we are navigating to details page
  // so here we are creating a navigation link
  onClick(empId: number): void {
this.router.navigate(['/employees', empId]);  // navigate(['/employees', empId]) -- the first param  is route and second is the value
  }


  changeEmpName(): void{
    // as we are changing the name of first employee, we are binding the list again with search term as
  // this.filteredEmployees = this.filterEmployeesList(this.search);
    this.employees[0].name = 'Bane';
    this.filteredEmployees = this.filterEmployeesList(this.search);
  }

}
