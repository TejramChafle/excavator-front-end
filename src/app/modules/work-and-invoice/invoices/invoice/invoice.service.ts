import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from 'app/app.config';

@Injectable()
export class InvoiceService implements Resolve<any>
{
    routeParams: any;
    invoice: any;
    onInvoiceChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onInvoiceChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getInvoice()
            ]).then(
                (response) => {
                    console.log({response});
                    resolve(response);
                },
                reject
            );
        });
    }

    /**
     * Get invoice
     *
     * @returns {Promise<any>}
     */
    getInvoice(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(BASE_URL + 'invoice/' + this.routeParams.id)
                .subscribe((response: any) => {
                    this.invoice = response;
                    this.onInvoiceChanged.next(this.invoice);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Save invoice
     *
     * @param invoice
     * @returns {Promise<any>}
     */
    saveInvoice(invoice): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('invoice' + invoice.id, invoice)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add invoice
     *
     * @param invoice
     * @returns {Promise<any>}
     */
    addInvoice(invoice): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('invoice', invoice)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
