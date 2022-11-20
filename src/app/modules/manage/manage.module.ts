import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';
import { DataService } from 'app/data.service';
import { EmployeesComponent } from './employee-management/employees/employees.component';
import { EmployeeComponent } from './employee-management/employee/employee.component';

const routes: Routes = [
    {
        path: 'contacts',
        loadChildren: './contacts/contacts.module#ManageContactsModule',
    },
    {
        path: 'employees',
        component: EmployeesComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'employees' }
    },
    {
        path: 'employee/:id',
        component: EmployeeComponent,
        /* resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'employees' } */
    },
    {
        path: 'employee',
        component: EmployeeComponent
    }
];

@NgModule({
    declarations: [
        EmployeeComponent,
        EmployeesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule
    ]
})

export class ManageModule {
}
