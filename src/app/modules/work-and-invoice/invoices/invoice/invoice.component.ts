import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { invoiceStatuses } from './invoice-statuses';
import { Invoice } from './invoice.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from 'app/app.config';
import { InvoiceService } from './invoice.service';

@Component({
    selector: 'invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InvoiceComponent implements OnInit, OnDestroy {
    invoice: Invoice;
    invoiceStatuses: any;
    invoiceForm: FormGroup;
    customer: any;
    business: any;
    updateCustomerInfo = false;
    updatePaymentInfo = false;
    updateStatusInfo = false;
    paymentForm: FormGroup;
    paymentMethods = PAYMENT_METHODS;
    paymentStatuses = PAYMENT_STATUSES;
    isTaxEnabled = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _dataService: DataService,
        private _appService: AppService,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _invoiceService: InvoiceService
    ) {
        // Set the defaults
        // this.invoice = new Invoice();
        this.invoiceStatuses = invoiceStatuses;

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
        // Subscribe to update invoice on changes
        /* this._dataService.onRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(invoice => {
                this.invoice = new Invoice(invoice);
            });

        this.statusForm = this._formBuilder.group({
            newStatus: ['']
        }); */
        // console.log('history.state: ', history.state);
        // // Check if invoice contain works, if not navigate back to works page
        // if (history.state.works === undefined) {
        //     this._router.navigate(['/work-and-invoice/works']);
        // }
        this.paymentForm = this.createPaymentForm();
        this.business = this._appService.user.business;
        const id = this._activatedRoute.snapshot.params['id'];
        if (id) {
            // const invoice = history.state;
            // console.log({invoice});

            /* this._dataService.getRecordData('invoice', id).then((response) => {
                console.log('getRecordData', response);
                this.invoice = new Invoice(response);
                console.log('invoice: ', this.invoice);
                this.customer = response.invoiceTo;
                this.invoiceForm = this.createInvoiceForm();
                this.invoiceForm.patchValue({
                    invoiceToName: this.customer.name,
                    invoiceFromName: this.business.name
                });
                this.calculateInvoice();
            }); */

            this._invoiceService.onInvoiceChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                console.log('invocie response', response);
                this.invoice = new Invoice(response);
                console.log('invoice: ', this.invoice);
                this.customer = response.invoiceTo;
                this.invoiceForm = this.createInvoiceForm();
                this.invoiceForm.patchValue({
                    invoiceToName: this.customer.name,
                    invoiceFromName: this.business.name,
                    date: response.date ? this._appService.dateInString(new Date(response.date)) : null,
                    expectedClearanceDate: response.expectedClearanceDate ? this._appService.dateInString(new Date(response.expectedClearanceDate)) : null
                });
                this.calculateInvoice();
            });

        } else {
            // this.pageType = 'new';
            this.customer = history.state.works[0].customer;
            const invoice = {
                works: history.state.works,
                invoiceTo: this.customer._id,
                invoiceToName: this.customer.name,
                business: history.state.business,
                date: new Date()
            }
            this.invoice = new Invoice(invoice);
            console.log('invoice: ', this.invoice);
            this.invoiceForm = this.createInvoiceForm();

            // Set default values while creating invoice
            this.invoiceForm.patchValue({
                date: this._appService.dateInString(new Date()),
                expectedClearanceDate: this._appService.dateInString(new Date(), 15),
                status: 'ENTERED',
                invoiceToName: this.customer.name,
                invoiceFromName: this.business.name
            });
            this.calculateInvoice();
        }
        console.log('business', this.business);
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
     * Update status
     */
    updateStatus(): void {
        /* const newStatusId = Number.parseInt(this.statusForm.get('newStatus').value);

        if (!newStatusId) {
            return;
        }

        const newStatus = this.invoiceStatuses.find((status) => {
            return status.id === newStatusId;
        });

        newStatus['date'] = new Date().toString();
 */
        // this.invoice.status.unshift(newStatus);
    }

    /**
     * Create invoice form
     *
     * @returns {FormGroup}
     */
     createInvoiceForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.invoice._id],
            works: [this.invoice.works],
            date: [this.invoice.date],
            invoiceTo: [this.invoice.invoiceTo],
            invoiceToName: [this.invoice.invoiceToName],
            business: [this.invoice.business],
            invoiceFromName: [this.invoice.invoiceFromName],

            invoiceBrief: [this.invoice.invoiceBrief],
            discount: [this.invoice.discount],
            gstPercent: [this.invoice.gstPercent],
            gstAmount: [this.invoice.gstAmount],
            tdsPercent: [this.invoice.tdsPercent],
            tdsAmount: [this.invoice.tdsAmount],
            invoicedAmount: [this.invoice.invoicedAmount],
            description: [this.invoice.description],
            status: [this.invoice.status],
            expectedClearanceDate: [this.invoice.expectedClearanceDate]
        });
    }

    /**
     * Create payment form
     *
     * @returns {FormGroup}
     */
     createPaymentForm(): FormGroup {
        return this._formBuilder.group({
            _id: new FormControl(),
            method: new FormControl(),
            date: new FormControl(),
            amount: new FormControl(),
            status: new FormControl()
        });
    }

    calculateInvoice() {
        let amount: number = 0;
        this.invoice.works.forEach((work) => {
            amount += parseFloat(work.total);
        })
        this.invoiceForm.patchValue({
            invoicedAmount: amount
        });
        this.invoice.invoicedAmount = amount;
        console.log(this.invoiceForm.getRawValue());
    }

    onEditWork(work) {
        this._router.navigate(['/work-and-invoice/work', work._id], { state: work });
    }

    onDeleteWork(work, index) {
        if (confirm('Are you sure you want to delete?')) {
            // If updaing invoice, we need to remove work and save changes
            if (this.invoice._id) {

            } else {
                this.invoice.works.splice(index, 1);
            }
        }
    }

    onUpdateCustomerInfo() {
        this.updateCustomerInfo = !this.updateCustomerInfo;
    }

    onUpdatePaymentInfo() {
        this.updatePaymentInfo = !this.updatePaymentInfo;
    }

    onUpdateStatusInfo() {
        this.updateStatusInfo = !this.updateStatusInfo;
    }

    onChangePaymentMethod() {
        this.paymentForm.patchValue({
            amount: 5667
        });
    }

    

    onSubmit() {
        const data = this.invoiceForm.getRawValue();
        console.log('formdata:', data);

        data.business = this._appService.user.business._id;
        data.updatedBy = this._appService.user._id;

        if (data._id) {
            this._dataService.updateRecord('invoice', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    /* this._matSnackBar.open('Work information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back(); */
                    this._appService.handleMessage('Invoice updated successfully.', 'Success');
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecord('invoice', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    /* // Show the success message
                    this._matSnackBar.open('Work added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back(); */
                    this._appService.handleMessage('Invoice created successfully.', 'Success');
                });
        }
    }

    print(): void {
        let printContents, popupWin;
        printContents = document.getElementById('invoice-print').innerHTML;
        popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write(printContents);
        popupWin.document.close();
    }
}
