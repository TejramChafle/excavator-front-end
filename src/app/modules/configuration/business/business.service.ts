import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class BusinessService implements Resolve<any>
{
    routeParams: any;
    business: any;
    onBusinessChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _appService: AppService
    ) {
        // Set the defaults
        this.onBusinessChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getBusiness()
            ]).then(() => {
                resolve(this.business);
            }, reject);
        });
    }

    /**
     * Get business
     *
     * @returns {Promise<any>}
     */
    getBusiness(): Promise<any> {
        const bId = this._appService.user.business._id;
        return new Promise((resolve, reject) => {
            this._httpClient.get(apiBaseUrl + 'business/' + bId)
                .subscribe((response: any) => {
                    this.business = response;
                    this.onBusinessChanged.next(this.business);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Save business
     *
     * @param business
     * @returns {Promise<any>}
     */
    updateBusiness(business): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'business/' + business.id, business)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add business
     *
     * @param business
     * @returns {Promise<any>}
     */
    addBusiness(business): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'business/register', business)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
