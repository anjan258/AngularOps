import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  emp: Employee;
  private id: number;
  constructor(private activatedRoute: ActivatedRoute,
              private empService: EmployeeService, private route: Router) { }


  // to read the params from the url ( http://localhost:4200/employees/2 )
  // params.id/-- paramter name specified in the routing module path  { path: 'employees/:id', component: EmployeeDetailsComponent }
  // as it return a string , we convert to int by '+'
  // to read the params from url, we either use snapshot or observable approaches. below is the snapshot approach

  // ngOnInit(): void {
  //   this.id =  +this.activatedRoute.snapshot.params.id; // or  this.activatedRoute.snapshot.paramMap.get('id');
  //   this.emp = this.empService.getEmployeeById(this.id);
  // }


// this the subscriber approach to read the values from the url
/// the difference is when we want to see th en ext employee on the same , the id in the url changes
// and the snapshot approach cant catch those dynamc changing values. so , we use this approach
// paramMap -- introduced in Angular 4

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {

        this.id = +params.get('id');
        this.emp = this.empService.getEmployeeById(this.id);
    });
  }

  viewNextEmployee(): void {
      this.id = this.id + 1;
      this.route.navigate(['/employees', this.id]);
  }
}


// snapshot vs observable  --- use snapshot when we the route param doesnt change
// and when we want to read only initial route param
// on the other hand, use observable - when the route param changes and if you want to
// react and execute some code in response to the change
