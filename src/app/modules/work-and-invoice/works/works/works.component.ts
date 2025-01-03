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
    selector: 'works',
    templateUrl: './works.component.html',
    styleUrls: ['./works.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class WorksComponent implements OnInit {
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
    hasSelectedRecords: boolean;
    selectedRecords: any[];
    checkboxes: {};
    isSearching = false;

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

        // Assign columns to table
        this.tableColumns = MODULE.works.tableColumns;

        // Keep track of change in records and update
        this._dataService.onRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.dataSource = response.docs;
                console.log('dataSource: ', this.dataSource);

                this.checkboxes = {};
                response.docs.map(record => {
                    this.checkboxes[record._id] = false;
                });
            });

        // Keep track of checkbox selections and update record
        this._dataService.onSelectedRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedRecords => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }
                    this.checkboxes[id] = selectedRecords.includes(id);
                }
                this.hasSelectedRecords = selectedRecords.length > 0;
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
     * Edit Work
     *
     * @param work
     */
    editWork(work) {
        this._router.navigate(['/work-and-invoice/work/', work._id], { state: work });
    }

    /**
     * Delete Work
     */
    deleteWork(work): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteRecord(MODULE.works.backendRoute, work);
            }
            this.confirmDialogRef = null;
        });
    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._dataService.getRecords(MODULE.works.backendRoute, { page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }

    /**
     * Disable Work
     */
    disableWork(work): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable? The disabled work will not appear is attendance and payment list.';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                work.isActive = false;
                work.disabledOn = new Date();
                work.updatedBy = this._appService.user._id;
                this._dataService.updateRecord(MODULE.works.backendRoute, work);
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * On selected change
     *
     * @param recordId
     */
    onSelectedChange(recordId): void {
        this._dataService.toggleSelectedRecord(recordId);
    }


    onSearch(data) {
        console.log({searching: data});
    }

    onClickBack() {
        this.isSearching = false;
        console.log('back')
    }
}
