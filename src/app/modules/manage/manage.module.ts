import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';
import { DataService } from 'app/data.service';
import { EmployeesComponent } from './employee-management/employees/employees.component';
import { EmployeeComponent } from './employee-management/employee/employee.component';
import { AttendanceFormComponent } from './attendances/attendance-form/attendance-form.component';
import { AttendancesComponent } from './attendances/attendances.component';
import { CalendarComponent } from './attendances/calendar/calendar.component';
import { CalendarService } from './attendances/calendar/calendar.service';
import { CalendarModule } from './attendances/calendar/calendar.module';

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
    },
    /* {
        path: 'attendances',
        component: AttendancesComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'attendances' }
    } */
    {
        path: 'attendances',
        loadChildren: './attendances/calendar/calendar.module#CalendarModule'
    }
];

@NgModule({
    declarations: [
        EmployeeComponent,
        EmployeesComponent,
        AttendanceFormComponent,
        AttendancesComponent,
        // CalendarComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule,
        CalendarModule
    ],
    entryComponents: [
        AttendanceFormComponent
    ]
})

export class ManageModule {
}
