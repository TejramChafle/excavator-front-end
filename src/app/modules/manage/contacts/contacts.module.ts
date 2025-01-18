import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ContactsComponent } from './contacts.component';
import { ContactsListComponent } from './contact-list/contact-list.component';
import { ContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from './sidebars/main/main.component';
import { ContactFormDialogComponent } from './contact-form/contact-form.component';
import { MaterialModule } from 'app/material.module';
import { DataService } from 'app/data.service';

const routes: Routes = [
    {
        path: '',
        component: ContactsComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data: { module: 'contacts' }
    }
];

@NgModule({
    declarations: [
        ContactsComponent,
        ContactsListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ContactFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MaterialModule
    ],
    providers: [],
    entryComponents: [
        ContactFormDialogComponent
    ]
})
export class ManageContactsModule {
}
