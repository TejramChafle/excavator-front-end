import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';
import { TagComponent } from './tag/tag.component';
import { TagService } from './tag/tag.service';
import { AuthGuard } from '../authentication/guards/auth/auth.guard';
import { TagListComponent } from './tag/tag-list/tag-list.component';
import { TagFormDialogComponent } from './tag/tag-form/tag-form.component';
import { FuelResourceComponent } from './fuel-resource/fuel-resource.component';
import { FuelResourceService } from './fuel-resource/fuel-resource.service';
import { FuelResourceFormDialogComponent } from './fuel-resource/fuel-resource-form/fuel-resource-form.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeesService } from './employees/employees.service';
import { EmployeeFormDialogComponent } from './employees/employees-form/employee-form.component';
import { ClientComponent } from './client/client.component';
import { ClientService } from './client/client.service';
import { ClientFormDialogComponent } from './client/client-form/client-form.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { FuelResourceListComponent } from './fuel-resource/fuel-resource-list/fuel-resource-list.component';
import { EmployeeListComponent } from './employees/employees-list/employee-list.component';
import { ContactFormDialogComponent } from './contacts/contact-form/contact-form.component';
import { ContactListDialogComponent } from './contacts/contact-list-dialog/contact-list-dialog.component';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactsService } from './contacts/contacts.service';
import { ContactsSelectedBarComponent } from './contacts/selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from './contacts/sidebars/main/main.component';
import { UsersComponent } from './users/users.component';
import { UsersService } from './users/users.service';
import { UserFormDialogComponent } from './users/user-form/user-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { BusinessComponent } from './business/business.component';
import { BusinessService } from './business/business.service';

const routes: Routes = [
    {
        path: 'configuration/tag',
        component: TagComponent,
        resolve: {
            tags: TagService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/fuel-resource',
        component: FuelResourceComponent,
        resolve: {
            resources: FuelResourceService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/employees',
        component: EmployeesComponent,
        resolve: {
            employees: EmployeesService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/client',
        component: ClientComponent,
        resolve: {
            clients: ClientService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/contacts',
        component: ContactsComponent,
        /* resolve: {
            contacts: ContactsService
        }, */
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/users',
        component: UsersComponent,
        resolve: {
            users: UsersService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/business-detail',
        component: BusinessComponent,
        resolve: {
            business: BusinessService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        TagComponent,
        TagListComponent,
        TagFormDialogComponent,
        FuelResourceComponent,
        FuelResourceListComponent,
        FuelResourceFormDialogComponent,
        ClientComponent,
        ClientListComponent,
        ClientFormDialogComponent,
        EmployeesComponent,
        EmployeeListComponent,
        EmployeeFormDialogComponent,
        ContactsComponent,
        ContactListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ContactFormDialogComponent,
        ContactListDialogComponent,
        UsersComponent,
        UserListComponent,
        UserFormDialogComponent,
        BusinessComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule,
    ],
    providers: [
        TagService,
        FuelResourceService,
        EmployeesService,
        ClientService,
        ContactsService,
        UsersService,
        BusinessService
    ],
    entryComponents: [
        TagFormDialogComponent,
        FuelResourceFormDialogComponent,
        EmployeeFormDialogComponent,
        ClientFormDialogComponent,
        ContactFormDialogComponent,
        ContactListDialogComponent,
        UserFormDialogComponent
    ]
})

export class ConfigurationModule {
}
