import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DataService } from 'app/data.service';
import { AppService } from 'app/app.service';
import { AppCache } from 'app/app.cache';
import { invoiceStatuses } from '../invoices/invoice/invoice-statuses';

@Component({
    selector   : 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls  : ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedRecords: boolean;
    isIndeterminate: boolean;
    selectedRecords: string[];
    @Output() backIsClicked = new EventEmitter<Boolean>();

    // Private
    private _unsubscribeAll: Subject<any>;

    form: FormGroup;
    customers: Array<any>;
    contacts: Array<any>;
    services: Array<any>;
    vehicles: Array<any>;

    statuses = invoiceStatuses;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _dataService: DataService,
        public _matDialog: MatDialog,
        private _appService: AppService,
        private _formBuilder: FormBuilder,
        private _appCache: AppCache
    )
    {
        // Reactive Form
        this.form = this._formBuilder.group({
            customer : new FormControl(),
            service  : new FormControl(),
            status   : new FormControl(),
            vehicle  : new FormControl(),
            date: new FormControl(),
            toDate: new FormControl(),
            site: new FormControl(),
            worker: new FormControl(),
            paymentStatus  : new FormControl(),
            invoiceDate: new FormControl(),
            invoiceNumber: [null, Validators.maxLength(6)],
            total   : [null, Validators.maxLength(8)]
        });

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        
        // Get the required metadata
        this.getCustomers();
        this.getServices();
        this.getSupervisor();
        this.getVehicles();
    }

    async getCustomers() {
        this.customers =  await this._appCache.getCustomers();
    }

    async getServices() {
        this.services = await this._appCache.getServices();
    }

    async getSupervisor() {
        this.contacts = await this._appCache.getSupervisor();
    }

    async getVehicles() {
        this.vehicles = await this._appCache.getVehicles();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select all
     */
    selectAll(): void
    {
        this._dataService.selectRecords();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._dataService.deselectRecords();
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedRecords(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected contacts?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    // this._dataService.deleteSelectedRecords();
                }
                this.confirmDialogRef = null;
            });
    }

    generateInvoice() {
        let customer;
        let selected = [];
        // Validate selection for generating invoice. The selected work record must belong to same customer
        this._dataService.recordsWithPagination.docs.forEach((record) => {
            if (this.selectedRecords.includes(record._id)) {
                if (!customer) {
                    customer = record.customer._id
                }
                if (customer !== record.customer._id) {
                    this._appService.handleMessage('Please select records of same customer for invoice', 'Error!');
                    return false;
                } else {
                    selected.push(record);
                }
            }
        });
    }

    deleteSelectedContacts() {
        console.log('deleteSelectedContacts');
    }

    search() {
        console.log(this.form.getRawValue());
        this._dataService.onFilterChanged.next(this.form.getRawValue());
    }

    clearForm() {
        this.form.reset();
    }

    onClickBack() {
        this.backIsClicked.emit(true);
    }


}
