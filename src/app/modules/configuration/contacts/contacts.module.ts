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

import { ContactsComponent } from './contacts.component';
import { ContactsService } from './contacts.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from './sidebars/main/main.component';
import { ContactFormDialogComponent } from './contact-form/contact-form.component';
import { ContactListDialogComponent } from './contact-list-dialog/contact-list-dialog.component';
import { AuthGuard } from '../../authentication/guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'configuration/contacts',
        component: ContactsComponent,
        resolve: {
            contacts: ContactsService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        ContactsComponent,
        ContactListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ContactFormDialogComponent,
        ContactListDialogComponent
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
        ContactsService
    ],
    entryComponents: [
        ContactFormDialogComponent,
        ContactListDialogComponent
    ]
})

export class ContactsModule {
}
