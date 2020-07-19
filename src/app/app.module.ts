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


const routes: Routes = [
  { path: 'list', component: ListEmployeesComponent },

  // setting the guard to create link, so that whenever we try we navigate from create link, we get confirm alert
  // canDeactivate: [CreateEmployeeCanDeactivateGuardService] -- calls the guard service 
  {
    path: 'create', component: CreateEmployeeComponent,
    canDeactivate: [CreateEmployeeCanDeactivateGuardService]
  },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    ListEmployeesComponent,
    CreateEmployeeComponent,
    SelectRequiredValidatorDirective,
    ConfirmEqualValidatorDirective,
    DisplayEmployeesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [EmployeeService, CreateEmployeeCanDeactivateGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
