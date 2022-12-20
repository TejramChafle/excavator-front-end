import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MODULE, PAYMENT_METHODS, PAYMENT_STATUSES } from 'app/app.config';
import { AppService } from 'app/app.service';
import { DataService } from 'app/data.service';
import { TransactionModel } from './transaction.model';

@Component({
    selector: 'transaction-form',
    templateUrl: './transaction-form.component.html',
    styleUrls: ['./transaction-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TransactionFormComponent {
    action: string;
    transactionForm: FormGroup;
    dialogTitle: string;
    transaction: TransactionModel;
    methods = PAYMENT_METHODS;
    statuses = PAYMENT_STATUSES;

    /**
     * Constructor
     *
     * @param {MatDialogRef<TransactionFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<TransactionFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _appService: AppService,
        private _dataService: DataService
    ) {
        this.action = _data.action;

        console.log({_data});

        if (this.action === 'edit') {
            this.dialogTitle = '';
        }

        if (_data.transaction) {
            this.transaction = _data.transaction;
        }

        this.transactionForm = this.createPaymentForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the transaction form
     *
     * @returns {FormGroup}
     */
    createPaymentForm(): FormGroup {
        return new FormGroup({
            date: new FormControl(this.transaction.date ? this._appService.dateInString(new Date(this.transaction.date)) : null),
            mode: new FormControl(this.transaction.mode),
            amount: new FormControl(this.transaction.amount),
            status: new FormControl(this.transaction.status)
        });
    }

    onSubmit() {
        const data = this.transactionForm.getRawValue();
        console.log({ data });
        const param = {
            _id: this.transaction._id,
            updatedBy: this._appService.user._id,
            ...data
        }
        this._dataService.updateRecordButNoRefresh('transaction', param).then((response) => {
            console.log({ response });
            this._appService.handleMessage(
                'Payment information updated successfully.',
                'Success!'
            );
            this.matDialogRef.close({
                response: { ...response, ...data },
                status: true
            });
        });
    }
}
