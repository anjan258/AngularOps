import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';

// its required if this service has injected dependent service
// usualy we make service calls to API's then we inject HTTP service to get data from remote server
// but its recommended to declare this @Injectable() even if we dont inject any service to this custom service
@Injectable()

export class EmployeeService {
    private listEmployees: Employee[] = [
        {
            id: 101, name: 'Test1', gender: 'Male', email: 'test1@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1981'), department: '2',
            isActive: true, photoPath: 'assets/images/user1.png'
        },

        {
            id: 102, name: 'Test2', gender: 'Female', email: 'test2@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1984'), department: '2',
            isActive: false, photoPath: 'assets/images/user4.png'
        },

        {
            id: 103, name: 'Test3', gender: 'Male', email: 'test3@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1970'), department: '3',
            isActive: true, photoPath: 'assets/images/user2.png'
        },


        {
            id: 104, name: 'Test4', gender: 'Male', email: 'test4@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('10/10/1995'), department: '4',
            isActive: false, photoPath: 'assets/images/user3.png'
        },


        {
            id: 105, name: 'Test5', gender: 'Female', email: 'test5@test.com', contactPreference: 'Email',
            dateOfBirth: new Date('05/05/1990'), department: '1',
            isActive: true, photoPath: 'assets/images/user5.png'
        }
    ];

    getEmployees(): Employee[] {
        return this.listEmployees;
    }

    getEmployeeById(empId: number): Employee {
        return this.listEmployees.find(i => i.id === empId);
    }

    saveEmployee(newEmp): void {
        this.listEmployees.push(newEmp);
    }
}
