import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from 'app/app.config';
import { Invoice } from '../invoice/invoice.model';
import { InvoiceService } from '../invoice/invoice.service';
import { invoiceStatuses } from '../invoice/invoice-statuses';

@Component({
    selector: 'invoice-print',
    templateUrl: './invoice-print.component.html',
    styleUrls: ['./invoice-print.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InvoicePrintComponent implements OnInit, OnDestroy {
    invoice: Invoice;
    invoiceStatuses: any;
    customer: any;
    business: any;
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
        private _appService: AppService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _invoiceService: InvoiceService
    ) {
        // Set the defaults
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
        this.business = this._appService.user.business;
        const id = this._activatedRoute.snapshot.params['id'];
        if (history.state.invoice) {
            this.invoice = history.state.invoice;
            this.customer = history.state.invoice.invoiceTo;
            this.calculateInvoice();
            console.log('invoice: ', this.invoice);
            setTimeout(() => {
                print()
            }, 1000)
        } else if (id) {
            this._invoiceService.onInvoiceChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                console.log('invocie response', response);
                this.invoice = new Invoice(response);
                this.customer = response.invoiceTo;
                this.calculateInvoice();
                console.log('invoice: ', this.invoice);
                setTimeout(() => {
                    print()
                }, 1000)
            });
        } else {
            // Close window
            window.close();
        }
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

    calculateInvoice() {
        let amount: number = 0;
        this.invoice.works.forEach((work) => {
            amount += parseFloat(work.total);
        })
        this.invoice.invoicedAmount = amount;
    }

    print(): void {
        // implement print
        window.print();
    }
}
