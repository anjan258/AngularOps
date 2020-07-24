import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';
import { of } from 'rxjs';  // operator of rxjs
import { delay } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';


// its required if this service has injected dependent service
// usualy we make service calls to API's then we inject HTTP service to get data from remote server
// but its recommended to declare this @Injectable() even if we dont inject any service to this custom service
@Injectable()

export class EmployeeService {
    private listEmployees: Employee[] = [
        {
            id: 101, name: 'John', gender: 'Male', email: 'test1@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1981'), department: '2',
            isActive: true, photoPath: 'assets/images/user1.png'
        },

        {
            id: 102, name: 'Sara', gender: 'Female', email: 'test2@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1984'), department: '2',
            isActive: false, photoPath: 'assets/images/user4.png'
        },

        {
            id: 103, name: 'Sam', gender: 'Male', email: 'test3@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1970'), department: '3',
            isActive: true, photoPath: 'assets/images/user2.png'
        },


        {
            id: 104, name: 'Bam', gender: 'Male', email: 'test4@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1995'), department: '4',
            isActive: false, photoPath: 'assets/images/user3.png'
        },


        {
            id: 105, name: 'Julie', gender: 'Female', email: 'test5@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('05/05/1990'), department: '1',
            isActive: true, photoPath: 'assets/images/user5.png'
        }
    ];


    //  Observable<Employee[]> -- because when we get fetch data from api over http
    //  the result is returned as Observable and we us 'of' to retutn its type
    getEmployees(): Observable<Employee[]> {
        return of(this.listEmployees).pipe(delay(2000)); // to introduce delay while loading  data
    }

    getEmployeeById(empId: number): Employee {
        return this.listEmployees.find(i => i.id === empId);
    }

    // modified this method such that it will create a new employee if id=0
    // else it will replace the employee matching with the existing emp id

    saveEmployee(newEmp): void {

        // if its new employee, we need to find the last emp id and get next emp id
        // so we use the following "reduce" -- function which loosp through list of all employees left to righ and gets the next empId
        if (newEmp.id == null)
        {
            const newEmpId = this.listEmployees.reduce(function(e1, e2) { return (e1.id > e2.id) ? e1 : e2; }).id;
            newEmp.id = newEmpId + 1;
            this.listEmployees.push(newEmp);
        }
        else{

            const existingEmpId = this.listEmployees.findIndex(e =>e.id === newEmp.id);
            this.listEmployees[existingEmpId] = newEmp; /// if its existing employee, we find the emp id and update with new values

        }
    }
}
