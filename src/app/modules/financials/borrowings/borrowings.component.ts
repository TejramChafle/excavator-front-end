import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/internal/operators';
import { MODULE } from 'app/app.config';
import { DataService } from 'app/data.service';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppService } from 'app/app.service';

@Component({
    selector: 'borrowings',
    templateUrl: './borrowings.component.html',
    styleUrls: ['./borrowings.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class BorrowingsComponent implements OnInit {
    dataSource: Array<any>;
    tableColumns: Array<string>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        public _dataService: DataService,
        public _matDialog: MatDialog,
        private _router: Router,
        private _appService: AppService
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
        this.tableColumns = MODULE.borrowings.tableColumns;
        this._dataService.onRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.dataSource = response.docs;
                console.log('dataSource: ', this.dataSource);
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
     * Edit Borrowing
     *
     * @param borrowing
     */
    editBorrowing(borrowing) {
        this._router.navigate(['/financials/borrowing/', borrowing._id], { state: borrowing });
    }

    /**
     * Delete Borrowing
     */
    deleteBorrowing(borrowing): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteRecord(MODULE.borrowings.backendRoute, borrowing);
            }
            this.confirmDialogRef = null;
        });
    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._dataService.getRecords(MODULE.borrowings.backendRoute, { page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}
