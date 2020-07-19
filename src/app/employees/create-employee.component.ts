import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Department } from '../models/department.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Employee } from '../models/employee.model';  // importing employee model class to bind to the template view
import {  EmployeeService } from './employee.service'; // importing employee service
import { Router  } from '@angular/router';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  // to get the the template view form reference variable (EmployeeForm) name and make it public to access in other components
  // purpose of accessing this tmeplate form variable is to check if the form is dirty (and fields are filled by the user)
  // then with reference variable we can check for dirty proprty
  // NgForm -- N- should be capital

  @ViewChild('employeeForm') public createEmployeeForm: NgForm;

  // Partial because, we are not setting all the properties of BsDatepickerConfig
  // in this case , we are just setting one property - containerClass
  datePickerConfig: Partial<BsDatepickerConfig>;
  departments: Department[] = [
    { id: -1, name: 'Select' },
    { id: 1, name: 'Help Desk' },
    { id: 2, name: 'IT' },
    { id: 3, name: 'HR' },
    { id: 4, name: 'Payroll' }
  ];

employee: Employee = {
  id : null,
  name: null,
  gender: null,
  contactPreference: null,
  phoneNumber: null,
  email: null,
  dateOfBirth: null,
  department: '-1',
  isActive: null,
  photoPath: null,
  password: null,
  confirmPassword: null
};

previewPhoto = false;

  // commented because we are binding employee model to the view template
  // name: string;
  // email: string;
  // gender = 'male';  // sets default value to radio button
  // phone: number;
  // contactPreference = 'phone';
  // isActive: boolean;
  // department = '0';
  // dateOfBirth = new Date(2020, 0, 1); // setting default date
  // photoPath: string;

  constructor(private empService: EmployeeService, private router: Router) {
    // Object.assign -- assigns the values from source to destination
    // in this case, as we want to change the theme of the datepicker, we have created the instace of BsDatepickerConfig
    // and assigning the property value of containerClass to required theme value
    // so this will assign the theme value to the instance -  this.datePickerConfig and can be used in template view
    this.datePickerConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue',
         showWeekNumbers: false,
         minDate: new Date(2020, 0, 1), // set min date
         maxDate: new Date(2020, 11, 31), // set max date
         dateInputFormat: 'YYYY/MM/DD'
      });

  }

  ngOnInit(): void {
  }

  // to get the form values from template view
  // saveEmployee(empForm: NgForm): void{
  //   console.log(empForm.value);
  // }

  // to get the employee model values from template view
    saveEmployee(): void{
    // console.log(newEmp);
    // as the model is bind to the template view, we can directly pass model call to the save method
    // because the two-way data binding updates the model property values when the correspoding fields are filled on the form
    this.empService.saveEmployee(this.employee);
    this.router.navigate(['list']);
  }

  showHidePhotoPreview(): void {
    this.previewPhoto = !this.previewPhoto;
  }

}
