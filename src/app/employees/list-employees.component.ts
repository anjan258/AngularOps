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
  empToDisplay: Employee;
  private currentIndex = 1;
  childEventData: string;
  searchText: string;

    // initializing the employee service in the constructor
    // which in the background, dependency injection happens
  constructor(private empService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.employees = this.empService.getEmployees();
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

}
