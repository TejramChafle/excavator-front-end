import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatRippleModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTableModule } from '@angular/material/table';
// import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ContactsComponent } from './contacts.component';
import { ContactsService } from './contacts.service';
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

        // MatButtonModule,
        // MatCheckboxModule,
        // MatDatepickerModule,
        // MatFormFieldModule,
        // MatIconModule,
        // MatInputModule,
        // MatMenuModule,
        // MatRippleModule,
        // MatTableModule,
        // MatToolbarModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MaterialModule
    ],
    providers: [
        ContactsService
    ],
    entryComponents: [
        ContactFormDialogComponent
    ]
})
export class ManageContactsModule {
}
