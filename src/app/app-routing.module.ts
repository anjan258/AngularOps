import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './employees/list-employees.component';
import { CreateEmployeeComponent } from './employees/create-employee.component';
import { EmployeeDetailsComponent } from './employees/employee-details.component';
import { CreateEmployeeCanDeactivateGuardService } from './employees/create-employee-can-deactivate-guard.service';
import { EmployeeListResolverService } from './employees/employee-list-resolver.service.ts';


// optional route parameters cant be apart of this routes
// that is we cant specify a route having optional paramters
// empList -- used to access data from Resolover from any component
const routes: Routes = [
  { path: 'list', component: ListEmployeesComponent , resolve: { empList : EmployeeListResolverService } },

  // setting the guard to create link, so that whenever we try we navigate from create link, we get confirm alert
  // canDeactivate: [CreateEmployeeCanDeactivateGuardService] -- calls the guard service
  {
    path: 'create', component: CreateEmployeeComponent,
    canDeactivate: [CreateEmployeeCanDeactivateGuardService]
  },
  // creating a route url with id parameter
  // we can also specify multiple parameters like 'employees/:param1/:param2
  { path: 'employees/:id', component: EmployeeDetailsComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
