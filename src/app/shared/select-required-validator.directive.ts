import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';


// as we creating a directive (which can be re-usable), we import and decorate it with direective
// providers -- for registering our custom validator to the list of existing angular validators
// NG_VALIDATORS contains all angular validators
// selector: '[appSelectValidator]' -- wrapped in [] -- because we want to use it as attribute in our template view as custom validator

@Directive({
    selector: '[appSelectValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: SelectRequiredValidatorDirective,
            multi: true
        }
    ]

})

// AbstractControl -- is the parent class of all forms and formgroups
// so to pass the angular forms/form groups we use its parent class -  AbstractControl
// defaultSelected -  can be any string, here im using it indicating that the default is selected from the ddl
// control.value === '-1'  -- to check if the slected value from ddl is -1 and if so return the defaultSelected indicating the error
// else null, thereby no errors in the deprtmentControl.errors property in template view and validation is success
// this validation works with any select list items (dropdownlist(ddl)) whose default slected value is :'-1'

// export class SelectRequiredValidatorDirective implements Validator {
//     validate(control: AbstractControl): { [key: string]: any } | null {
//         return control.value === '-1' ? { defaultSelected : true } : null ;
//     }
// }


//  to make it work for any default value (may be -1, null or any)
// now the default value is taken from select list in template view appSelectValidator="select",
// so that it works for any default value not just '-1'
// @Input -- used to pass the value from template to component,
// in our case we are passing the select list default value from template appSelectValidator="select") to this directive
// to the input vaariable here @Input() appSelectValidator, which should be same name

export class SelectRequiredValidatorDirective implements Validator {

    @Input() appSelectValidator: string; // appSelectValidator should be same as selector name ( selector: '[appSelectValidator]')
    validate(control: AbstractControl): { [key: string]: any } | null {
        return control.value === this.appSelectValidator ? { defaultSelected : true } : null ;
    }
}
