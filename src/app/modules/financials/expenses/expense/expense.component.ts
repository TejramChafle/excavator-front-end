import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { Expense } from './expense.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';
import { EXPENSE_PURPOSES, MODULE, PAYMENT_METHODS } from 'app/app.config';

@Component({
    selector: 'expense',
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ExpenseComponent implements OnInit, OnDestroy {
    expense: Expense;
    pageType: string;
    expenseForm: FormGroup;
    methods = PAYMENT_METHODS;
    purposes = EXPENSE_PURPOSES;
    maxDate: Date;

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
        this.expense = new Expense({});

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
            this.expense = new Expense(history.state);
            this.pageType = 'edit';
        } else {
            this.pageType = 'new';
            this.expense = new Expense({});
        }
        this.expenseForm = this.createExpenseForm();

        // Set the max date for datepicker
        this.maxDate = new Date();
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
     * Create expense form
     *
     * @returns {FormGroup}
     */
    createExpenseForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.expense._id],
            purpose: [this.expense.purpose],
            place: [this.expense.place],
            date: [this.expense.date],
            description: [this.expense.description],
            // employee: [this.expense.employee],
            transaction: [this.expense.transaction],
            active: [this.expense.active],
            amount: [this.expense.amount],
            mode: [this.expense.mode]
        });
    }

    /**
     * Create/Update expense
     */
    onSubmit(): void {
        const formdata = this.expenseForm.getRawValue();
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
            this._dataService.updateRecord(MODULE.expenses.backendRoute, data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Expense information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecordButNoRefresh(MODULE.expenses.backendRoute, data)
                .then(() => {

                    // Trigger the subscription with new data
                    // this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Expense added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        }
    }
}
