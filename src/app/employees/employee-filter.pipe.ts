import { PipeTransform, Pipe } from '@angular/core';
import { Employee } from '../models/employee.model';


// we have pure and impure pipes, by default its pure pipe
@Pipe({
    name: 'employeeSearchFilter',  // to refer in the view tmeplates
    pure : true // by default its true(pure), but we can set it as false to make it impure
})

export class EmployeeFilterPipe implements PipeTransform {
    transform(employess: Employee[], searchText: string): Employee[] {
        if (!employess || !searchText) {
            return employess;
        }
        return employess.filter(emp => emp.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
    }
}


// its not recommended to use pipes to filter and sort data in Angular for performance issues
// should be implemented carefully condisering the app performance

// Pure pipe -- executed only when a pure change to the input is detected.
// A pure changes is either a change to a primitive input value (string, number, boolean)
// or a changed object reference(array, date, object)

// pure pipe is fast compared impure pipe
// impure pipes should be handled carefully, because unlike pure pipes, impure pipes trigger on every event
// so its recommmended not use pipes either for filtering/sorting, and alternative is to move filtering/sorting code to component
