import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactsService } from '../contacts.service';
import { AppService } from 'app/app.service';

@Component({
    selector: 'contact-list-dialog',
    templateUrl: './contact-list-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ContactListDialogComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    contacts: any;
    user: any;
    // dataSource: FilesDataSource | null;
    dataSource: any = {};
    displayedColumns = ['checkbox', 'name', 'gender', 'type'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _contactsService: ContactsService,
        public _matDialog: MatDialog,
        public _appService: AppService,
        public matDialogRef: MatDialogRef<ContactListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.dataSource = new FilesDataSource(this._contactsService);

        this._contactsService.getContacts({page: 1, limit: 10}).then((resp)=>{
            this.dataSource = resp;
            this.contacts = resp;
        });
        console.log('this.contacts : ', this.contacts);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void {
        this._contactsService.toggleSelectedContact(contactId);
        console.log('this._contactsService.selectedContacts : ', this._contactsService.selectedContacts);
    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._contactsService.getContacts({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }

    // Send the selected contacts to the parent component
    onSubmit() {
        this.matDialogRef.close(this._contactsService.selectedContacts);
    }
}
