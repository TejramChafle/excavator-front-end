import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DataService } from 'app/data.service';
import { AppService } from 'app/app.service';
import { Router } from '@angular/router';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class RecordsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedRecords: boolean;
    isIndeterminate: boolean;
    selectedRecords: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

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
        private _router: Router
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._dataService.onSelectedRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRecords => {
                this.selectedRecords = selectedRecords;
                setTimeout(() => {
                    this.hasSelectedRecords = selectedRecords.length > 0;
                    this.isIndeterminate = (selectedRecords.length !== this._dataService.recordsWithPagination.docs.length && selectedRecords.length > 0);
                }, 0);
            });
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
        console.log({selected});
        if (selected.length) {
            this._router.navigate(['/work-and-invoice/invoice/'], { state: {
                works: selected,
                customer
            } });
        }
    }
}
