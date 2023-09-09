import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { Revenue } from './revenue.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';
import { REVENUE_SOURCES, MODULE, PAYMENT_METHODS } from 'app/app.config';

@Component({
    selector: 'revenue',
    templateUrl: './revenue.component.html',
    styleUrls: ['./revenue.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class RevenueComponent implements OnInit, OnDestroy {
    revenue: Revenue;
    pageType: string;
    revenueForm: FormGroup;
    methods = PAYMENT_METHODS;
    sources = REVENUE_SOURCES;
    maxDate: Date;
    customers = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _dataService: DataService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _activatedRoute: ActivatedRoute,
        private _appService: AppService
    ) {
        // Set the default
        this.revenue = new Revenue({});

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
        const id = this._activatedRoute.snapshot.params['id'];
        if (id) {
            this.revenue = new Revenue(history.state);
            this.pageType = 'edit';
        } else {
            this.pageType = 'new';
            this.revenue = new Revenue({});
        }
        this.revenueForm = this.createRevenueForm();

        // Set the max date for datepicker
        this.maxDate = new Date();

        // Get customer list
        this.getCustomers();
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
     * Create revenue form
     *
     * @returns {FormGroup}
     */
    createRevenueForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.revenue._id],
            source: [this.revenue.source],
            date: [this.revenue.date],
            description: [this.revenue.description],
            customer: [this.revenue.customer ? this.revenue.customer._id : null],
            transaction: [this.revenue.transaction],
            active: [this.revenue.active],
            amount: [this.revenue.amount],
            mode: [this.revenue.mode]
        });
    }

    /**
     * Create/Update revenue
     */
    onSubmit(): void {
        const formdata = this.revenueForm.getRawValue();
        const data = { 
            ...formdata,
            transaction: {
                _id: formdata.transaction,
                amount: formdata.amount,
                mode: formdata.mode,
                source: 'REVENUE',
                category: 'INCOME',
                date: formdata.date,
                status: 'PAID'
            },
            business: this._appService.user.business._id,
            updatedBy: this._appService.user._id
        };
        delete data.amount, data.mode;
        console.log({ data });

        if (data._id) {
            this._dataService.updateRecord(MODULE.revenues.backendRoute, data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Revenue information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecordButNoRefresh(MODULE.revenues.backendRoute, data)
                .then(() => {

                    // Trigger the subscription with new data
                    // this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Revenue added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        }
    }

    getCustomers() {
        this._dataService.records('customer', {}).subscribe((response) => {
            console.log({ customers: response });
            this.customers = response.docs;
        });
    }
}
