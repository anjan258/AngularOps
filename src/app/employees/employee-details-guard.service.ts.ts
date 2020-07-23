import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { EmployeeService } from './employee.service';



@Injectable()
// this service (CanActivate guard service ) helps in checking if a resource exists of not
// also helps in checking if the user is authorized or not and grants/deny access and redeirect to the appropriate pages
// specify this service in the app-routinng to the required route.
// in our case its --  {  { path: 'employees/:id', component: EmployeeDetailsComponent , canActivate: [EmployeeDetailsGuardService] }  }
// so whenever, someone tries to acces the employee details with an id , then this guard is invoked
// and it checks if an emp exists, if exists then shows emp details else redirects to pageNotFound - component page
export class EmployeeDetailsGuardService implements CanActivate {

    constructor(private empService: EmployeeService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        // '!!' -- to return boolean value and  '+' conevrt to int
        // here we are checking to see if the employee exists by reading the 'id' -param value from th eurl
        // if emp exists show emp detail else return to the pageNotFound page
       const empExists = !!this.empService.getEmployeeById(+route.paramMap.get('id'));

       if (empExists)
       {
        return true;
       }

       else
       {
         this.router.navigate(['notFound']); // redirecting the user to 'notFound' - componenet if emp doesnt exists
         return false;
       }

    }

}
