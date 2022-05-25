import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar'; */

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { EmployeesComponent } from './employees.component';
import { EmployeesService } from './employees.service';
import { EmployeeListComponent } from './employees-list/employee-list.component';
import { EmployeeFormDialogComponent } from './employees-form/employee-form.component';
import { AuthGuard } from '../../authentication/guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'configuration/employees',
        component: EmployeesComponent,
        resolve: {
            employees: EmployeesService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        EmployeesComponent,
        EmployeeListComponent,
        EmployeeFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        /* MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule, */

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers: [
        EmployeesService
    ],
    entryComponents: [
        EmployeeFormDialogComponent
    ]
})

export class EmployeesModule {
}
