import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { PAYMENT_METHODS, PAYMENT_STATUSES } from 'app/app.config';
import { invoiceStatuses } from '../invoice/invoice-statuses';
import { AppService } from 'app/app.service';

@Component({
    selector: 'invoice-section',
    templateUrl: './invoice-section.component.html',
    styleUrls: ['./invoice-section.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InvoiceSectionComponent implements OnInit, OnDestroy {
    @Input() invoice;
    @Input() customer: any;
    @Input() business: any;
    invoiceStatuses: any;
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
        public _appService: AppService
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
