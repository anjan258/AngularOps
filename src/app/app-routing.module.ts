import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeesComponent } from './employees/list-employees.component';
import { CreateEmployeeComponent } from './employees/create-employee.component';
import { EmployeeDetailsComponent } from './employees/employee-details.component';
import { CreateEmployeeCanDeactivateGuardService } from './employees/create-employee-can-deactivate-guard.service';
import { EmployeeListResolverService } from './employees/employee-list-resolver.service.ts';
import { PageNotFoundComponent } from './page-not-found.component';
import { EmployeeDetailsGuardService } from './employees/employee-details-guard.service.ts';


// all the routes are case-sensitive {list,create,notFound, employees}
// optional route parameters cant be apart of this routes
// that is we cant specify a route having optional paramters
// empList -- used to access data from Resolover from any component
const routes: Routes = [
  { path: 'list', component: ListEmployeesComponent , resolve: { empList : EmployeeListResolverService } },

  // setting the guard to create link, so that whenever we try we navigate from create link, we get confirm alert
  // canDeactivate: [CreateEmployeeCanDeactivateGuardService] -- calls the guard service

  // trying to use same component for both create/ edit and so we use - { 'create/:id' , 'edit/:id' }
  // so if id is zero then create if not show edit page with  emp details
  {
    path: 'create/:id', component: CreateEmployeeComponent,
    canDeactivate: [CreateEmployeeCanDeactivateGuardService]
  },
  {
    path: 'edit/:id', component: CreateEmployeeComponent,
    canDeactivate: [CreateEmployeeCanDeactivateGuardService]
  },
  // creating a route url with id parameter
  // we can also specify multiple parameters like 'employees/:param1/:param2
  { path: 'employees/:id', component: EmployeeDetailsComponent , canActivate: [EmployeeDetailsGuardService] },
  { path: '', redirectTo: '/list', pathMatch: 'full' },

  { path: 'notFound', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // to enable tracing : [RouterModule.forRoot(routes, { enableTracing : true })]
  exports: [RouterModule]
})
export class AppRoutingModule { }
