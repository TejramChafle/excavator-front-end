import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactsService } from '../contacts.service';
import { ContactFormDialogComponent } from '../contact-form/contact-form.component';
import { AppService } from 'app/app.service';

@Component({
    selector: 'contact-list',
    templateUrl: './contact-list.component.html',
    // styleUrls: ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ContactListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    contacts: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['firstname', 'gender', 'email', 'mobile', 'phone', 'designation', 'company', 'type', 'buttons'];
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
        public _appService: AppService
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
        this.dataSource = new FilesDataSource(this._contactsService);

        this._contactsService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;

                this.checkboxes = {};
                contacts.map(contact => {
                    this.checkboxes[contact._id] = false;
                });
            });

        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedContacts.includes(id);
                }
                this.selectedContacts = selectedContacts;
            });

        /* this._contactsService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            }); */

        this._contactsService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._contactsService.deselectContacts();
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
     * Edit contact
     *
     * @param contact
     */
    editContact(contact): void {
        this.dialogRef = this._matDialog.open(ContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                contact: contact,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                // const actionType: string = response[0];
                // const formData: FormGroup = response[1];
                // switch (actionType) {
                //     /**
                //      * Save
                //      */
                //     case 'save':

                //         this._contactsService.updateContact(formData.getRawValue());

                //         break;
                //     /**
                //      * Delete
                //      */
                //     case 'delete':

                //         this.deleteContact(contact);

                //         break;
                // }
            });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._contactsService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void {
        this._contactsService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void {
        if (this.user.starred.includes(contactId)) {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else {
            this.user.starred.push(contactId);
        }

        this._contactsService.updateUserData(this.user);
    }

    disableContact(contact): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                contact.is_active = false;
                contact.updated_by = this._appService.user._id;
                contact.updated_date = new Date();
                this._contactsService.updateContact(contact);
            }
            this.confirmDialogRef = null;
        });

    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._contactsService.getContacts({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     */
    constructor(
        private _contactsService: ContactsService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._contactsService.onContactsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
