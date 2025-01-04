import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from 'app/data.service';
import { MODULE } from 'app/app.config';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'invoices',
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class InvoicesComponent implements OnInit, OnDestroy {
    dataSource: any;
    tableColumns = [];

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    // Private
    private _unsubscribeAll: Subject<any>;
    isSearching = false;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     */
    constructor(
        private _dataService: DataService,
        private _router: Router,
        public _appService: AppService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        // Assign columns to table
        this.tableColumns = MODULE.invoices.tableColumns;
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
                this.dataSource = response.docs;
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

    editInvoice(invoice) {
        this._router.navigate(['/work-and-invoice/invoice', invoice._id], { state: invoice });
    }

    deleteInvoice(invoice) {
        //TODO
    }

    onClickBack() {
        this.isSearching = false;
    }

    // Load data on page change
    onPageChange(page) {
        this._dataService.getRecords(MODULE.invoices.backendRoute, { page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            // console.log('on page change : ', result);
        });
    }
}
