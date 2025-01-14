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
    selector: 'fuellogs',
    templateUrl: './fuel-logs.component.html',
    styleUrls: ['./fuel-logs.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class FuelLogsComponent implements OnInit {
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
        this.tableColumns = MODULE.fuelLogs.tableColumns;
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
     * Edit Fuel Log
     *
     * @param fuelLog
     */
    editFuelLog(fuelLog) {
        this._router.navigate(['/manage/fuel-log/', fuelLog._id], { state: fuelLog });
    }

    /**
     * Delete Fuel Log
     */
    deleteFuelLog(fuelLog): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteRecord(MODULE.fuelLogs.backendRoute, fuelLog);
            }
            this.confirmDialogRef = null;
        });
    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._dataService.getRecords(MODULE.fuelLogs.backendRoute, { page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}
