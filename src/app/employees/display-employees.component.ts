import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Employee } from '../models/employee.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-employees',
  templateUrl: './display-employees.component.html',
  styleUrls: ['./display-employees.component.css']
})
export class DisplayEmployeesComponent implements OnInit, OnChanges {


  @Input() emp: Employee;
   selectedEmployeeId: number;
  // ouput paramter to pass data from child (current component) to parent componenet(list-employees.component.ts)
  // so here we trying to achieve wheneever someone click on the user profile,
  //  we will pass the emp name from child to parent component and display on parent template view
  // EventEmitter<string> -- used to emit data ans string because we are passing employee name
  // we can pass model to the EventEmitter<> too like EventEmitter<Employee> = new EventEmitter<Employee>()
  // and pass/emit multiple value to the parent component
  @Output() alert: EventEmitter<string> = new EventEmitter<string>();

  // with setter and getter properties
  // we either directly access the pareent compoent values as -- @Input() emp: Employee
  // or we can use setter and getter properties as below
  // sp we can get the previous and current values either ffrom ngOnChanges life cylce hook
  // or from the getter and setter properties
  // uncomment below code and and ngOnChanges method to use the following below code and also uncomment   @Input() emp: Employee,
  // as we are setting the properties below

  //   private employee: Employee;
  // @Input()
  //   set emp(val: Employee){

  //     console.log('Previous employee :' + (this.employee ? this.employee.name : 'No employee found'));
  //     console.log('Current employee :' + (val.name));

  //     this.employee = val;
  //   }

  //   get emp(): Employee{
  //     return this.employee;
  //   }

  currentEmployee: Employee;
  previousEmployee: Employee;

  constructor(private activeRoute: ActivatedRoute) { }

    ngOnInit(): void {
      // reading params from url
      this.selectedEmployeeId = + this.activeRoute.snapshot.paramMap.get('id');

  }


  // this event is triggered when change event occurs
  // for example, in this when we click on next employye, this change event saves the previous and current values
  ngOnChanges(changes: SimpleChanges): void {

    this.previousEmployee = changes.emp.previousValue?.name as Employee;
    this.currentEmployee = changes.emp.currentValue?.name as Employee;
  }

  // this method id called when we click on the emp profile div ( <div class="panel-heading" (click)="notify()">)
  // so whenwe want to send the data from child to parent component , we emit the data required as  -- this.alert.emit(this.emp.name)
  // this.alert.emit(this.emp.name) -- this.emp.name -- also called payload
  // so, here we are emitting emp name which is passed from parent to this component in "emp" as input parameter
  notify(): void{
    this.alert.emit(this.emp.name);
  }

}
