import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactFormDialogComponent } from '../contact-form/contact-form.component';
import { DataService } from 'app/data.service';
import { MODULE } from '../../../../app.config';
import { AppService } from 'app/app.service';

@Component({
    selector: 'contacts-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ContactsListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    contacts: any;
    user: any;
    // dataSource: FilesDataSource | null;
    dataSource;
    // displayedColumns = ['checkbox', 'avatar', 'name', 'email', 'phone', 'jobTitle', 'buttons'];
    tableColumns: Array<string>;
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _matDialog: MatDialog,
        private _dataService: DataService,
        private _appService: AppService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.tableColumns = MODULE['contacts'].tableColumns;
        // console.log('this.tableColumns: ', this.tableColumns);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._dataService.onRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {

                this.checkboxes = {};
                response.docs.map(contact => {
                    this.checkboxes[contact.id] = false;
                });

                this.dataSource = response.docs;
                console.log('dataSource: ', this.dataSource);
            });

        this._dataService.onSelectedRecordsChanged
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

        this._dataService.onRecordDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._dataService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._dataService.deselectRecords();
            });
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
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        const data = {
                            ...formData.getRawValue(),
                            updatedBy: this._appService.user._id
                        }
                        this._dataService.updateRecord(MODULE.contacts.backendRoute, data);
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteContact(contact);
                        break;
                }
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
                this._dataService.deleteRecord(MODULE.contacts.backendRoute, contact);
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
        this._dataService.toggleSelectedRecord(contactId);
    }

    /**
     * Toggle star
     *
     * @param contact
     */
    toggleStar(contact): void {
        contact.isStarred = !contact.isStarred;
        this._dataService.updateRecord(MODULE.contacts.backendRoute, contact);
    }
}
