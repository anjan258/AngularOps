import { PipeTransform, Pipe } from '@angular/core';
import { Employee } from '../models/employee.model';

@Pipe({
    name: 'employeeSearchFilter'  // to refer in the view tmeplates
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
