// import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

// import { FuseUtils } from '@fuse/utils';
// import { Record } from './record.model';

import { BASE_URL, MODULE } from './app.config';
import { AppService } from './app.service';

@Injectable()
export class DataService implements Resolve<any> {
    onRecordsChanged: BehaviorSubject<any>;
    // onSelectedRecordsChanged: BehaviorSubject<any>;
    onRecordDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    records: Array<any>;
    pagination: any = {};
    record: any;
    selectedRecords: string[] = [];

    searchText: string;
    filterBy: string;
    recordsWithPagination: {
        docs: Array<any>,
        limit: number,
        page: number,
        pages: number,
        total: number
    };

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
        this.onRecordsChanged = new BehaviorSubject([]);
        // this.onSelectedRecordsChanged = new BehaviorSubject([]);
        this.onRecordDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        const route = MODULE[_route.url[1].path].backendRoute;
        console.log({route});
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getRecords(route),
                // this.getRecordData()
            ]).then(
                ([response]) => {
                    console.log(response);
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getRecords(route);
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getRecords(route);
                    });
                    this.recordsWithPagination = response;
                    resolve(response);

                },
                reject
            );
        });
    }

    /**
     * Get records
     *
     * @returns {Promise<any>}
     */
    getRecords(route, params?: any): Promise<any> {
        let url = BASE_URL + route;
        if (params && params.page) {
            url += '?page=' + params.page + '&limit=' + params.limit;
        } else {
            url += '?page=1&limit=10';
        }
        if (params && params.name) {
            url += '&name=' + params.name;
        } else if (this.searchText && this.searchText.trim().length) {
            url += '&name=' + this.searchText.trim();
        }
        url += '&businessId=' + this._appService.user.business._id;
        url += '&sort_order=desc';
        return new Promise((resolve, reject) => {
            this._httpClient.get(url)
                .subscribe((response: any) => {
                    console.log({response});
                    // this.records = response.docs;
                    // delete response.docs;
                    this.pagination = response;

                    this.onRecordsChanged.next(response);
                    // resolve(this.records);
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Get record data
     *
     * @returns {Promise<any>}
     */
    getRecordData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/records-record/5725a6802d10e277a0f35724')
                .subscribe((response: any) => {
                    this.record = response;
                    this.onRecordDataChanged.next(this.record);
                    resolve(this.record);
                }, reject);
        });
    }


    /**
     * Create a new record
     *
     * @param record
     * @returns {Promise<any>}
     */
    createRecord(route, record): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(BASE_URL + route, { ...record })
                .subscribe(response => {
                    this.getRecords(route);
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update record
     *
     * @param record
     * @returns {Promise<any>}
     */
    updateRecord(route, record): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(BASE_URL + route + '/' + record._id, { ...record })
                .subscribe(response => {
                    this.getRecords(route);
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete record
     *
     * @param record
     * @returns {Promise<any>}
     */
    deleteRecord(route, record): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(BASE_URL + route + '/' + record._id)
                .subscribe(response => {
                    this.getRecords(route);
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

}
