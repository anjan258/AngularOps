import { Validator, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
    selector: '[appConfirmEqualValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: ConfirmEqualValidatorDirective,
        multi: true
    }]

})



// custom directive to match password and confirm password

// { } | null -- the validate methods returns these
// if success then it returns null else {} with error;
// if fails it ({ }) returns a key-value pait like -- so we specify { [key: string] : any }
// where key is string and value is of any type
// we can use -- control.parent.get(this.appConfirmEqualValidator) -- get the passowrd filed value to compare against the confirm password
// so control gets the current coonfirmpassword control and parent-- get the room form
// and the finding the password field by appConfirmEqualValidator
// we can pass a group of controls, as we can see in tmeplate view we have password and confirm password
// in a group. so here we get password and confirm password to compare
export class ConfirmEqualValidatorDirective implements Validator {

    // @Input() appConfirmEqualValidator: string;
    validate(passwordGroup: AbstractControl): { [key: string]: any } | null {
        const passwordField = passwordGroup.get('password');
        const confirmPasswordField = passwordGroup.get('confirmPassword');
        if (passwordField &&  confirmPasswordField && passwordField.value !== confirmPasswordField.value) {
            return { notEqual: true };
        }
        return null;
    }
}
