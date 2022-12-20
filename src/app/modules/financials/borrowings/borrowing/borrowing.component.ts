import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { Borrowing } from './borrowing.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';
import { BORROWING_TYPES, EXPENSE_PURPOSES, MODULE, PAYMENT_METHODS } from 'app/app.config';

@Component({
    selector: 'borrowing',
    templateUrl: './borrowing.component.html',
    styleUrls: ['./borrowing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class BorrowingComponent implements OnInit, OnDestroy {
    borrowing: Borrowing;
    pageType: string;
    borrowingForm: FormGroup;
    methods = PAYMENT_METHODS;
    purposes = EXPENSE_PURPOSES;
    types = BORROWING_TYPES;
    maxDate: Date;
    contacts: [];

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
        this.borrowing = new Borrowing({});

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
            this.borrowing = new Borrowing(history.state);
            this.pageType = 'edit';
        } else {
            this.pageType = 'new';
            this.borrowing = new Borrowing({});
        }
        this.borrowingForm = this.createBorrowingForm();

        // Set the max date for datepicker
        this.maxDate = new Date();

        // Get the contacts for persons list
        this.getContacts();
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
     * Create borrowing form
     *
     * @returns {FormGroup}
     */
    createBorrowingForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.borrowing._id],
            purpose: [this.borrowing.purpose],
            type: [this.borrowing.type],
            date: [this.borrowing.date],
            scheduledReturnDate: [this.borrowing.scheduledReturnDate],
            description: [this.borrowing.description],
            person: [this.borrowing.person ? this.borrowing.person._id: null],
            transaction: [this.borrowing.transaction],
            active: [this.borrowing.active],
            amount: [this.borrowing.amount],
            mode: [this.borrowing.mode]
        });
    }

    /**
     * Create/Update borrowing
     */
    onSubmit(): void {
        const formdata = this.borrowingForm.getRawValue();
        const data = { 
            ...formdata,
            transaction: {
                _id: formdata.transaction,
                amount: formdata.amount,
                mode: formdata.mode,
                source: 'EXPENSE',
                category: 'SPENDING',
                date: formdata.date,
                status: 'PAID'
            },
            business: this._appService.user.business._id,
            updatedBy: this._appService.user._id
        };
        delete data.amount, data.mode;
        console.log({ data });

        if (data._id) {
            this._dataService.updateRecord(MODULE.borrowings.backendRoute, data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Borrowing information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecordButNoRefresh(MODULE.borrowings.backendRoute, data)
                .then(() => {

                    // Trigger the subscription with new data
                    // this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Borrowing added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        }
    }

    getContacts() {
        this._dataService.records('contact', {}).subscribe((response) => {
            console.log({ contacts: response });
            this.contacts = response.docs;
        });
    }
}
