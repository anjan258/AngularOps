import { CreateEmployeeComponent } from './create-employee.component';
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()

// this sservice guard checks if the employee form on create component is dirty and if so
// it alerts the userd while navigating.
// this guard doesnt work when we change the url or close the broswer or when we navigate to external user from the site
// (google.com, youtube.com , etc)
export class CreateEmployeeCanDeactivateGuardService implements CanDeactivate<CreateEmployeeComponent> {
    canDeactivate(component: CreateEmployeeComponent): boolean{
        if (component.createEmployeeForm.dirty)
        {
            return confirm('Are you sure you want to discard your changes');
        }
        return true;
    }

}
