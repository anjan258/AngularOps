import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Employee } from '../models/employee.model';
import { EmployeeService } from './employee.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()

// the purpose of this service is to prefetch the data , avoidin the user to wait forloading data.
// so when this service is consumed in any component to get the list of employees,
// it loads the data in the background without user having to see any delay in the page
// so it doesnt load th epage until the list is ready and then url changes nad navigate to the page
// finally wee ned to add this resolver in the routing module so the respective link
// in this case its  --- { path: 'list', component: ListEmployeesComponent , resolve: EmployeeListResolverService },

export class EmployeeListResolverService implements Resolve<Employee[]> {
    constructor(private empService: EmployeeService){}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee[]>{
        return this.empService.getEmployees();
    }
}
