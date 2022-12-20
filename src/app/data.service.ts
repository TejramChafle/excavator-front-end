// import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';

// import { FuseUtils } from '@fuse/utils';
// import { Record } from './record.model';

import { BASE_URL, MODULE } from './app.config';
import { AppService } from './app.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DataService implements Resolve<any> {
    onRecordsChanged: BehaviorSubject<any>;
    onSelectedRecordsChanged: BehaviorSubject<any>;
    onRecordDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

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
        this.onSelectedRecordsChanged = new BehaviorSubject([]);
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
        console.log({ _route });
        const route = MODULE[_route.data['module'] ? _route.data['module'] : _route.url[1].path].backendRoute;
        console.log({ route });
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
                    console.log({ response });
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
    getRecordData(route, _id): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(BASE_URL + route + '/'+_id)
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


    records(route, params?: any): Observable<any> {
        let url = BASE_URL + route;
        if (params && params.page) {
            url += '?page=' + params.page + '&limit=' + params.limit;
        } else {
            url += '?page=1&limit=20';
        }
        if (params && params.name) {
            url += '&name=' + params.name;
        } else if (this.searchText && this.searchText.trim().length) {
            url += '&name=' + this.searchText.trim();
        }
        url += '&businessId=' + this._appService.user.business._id;
        url += '&sort_order=desc';
        return this._httpClient.get(url).pipe(
            catchError((error) => {
                this._appService.handleError(error);
                return throwError(error);
            })
        )
    }

    /**
     * Toggle selected record by id
     *
     * @param id
     */
     toggleSelectedRecord(id): void {
        // First, check if we already have that record as selected...
        if (this.selectedRecords.length > 0) {
            const index = this.selectedRecords.indexOf(id);

            if (index !== -1) {
                this.selectedRecords.splice(index, 1);

                // Trigger the next event
                this.onSelectedRecordsChanged.next(this.selectedRecords);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedRecords.push(id);

        // Trigger the next event
        this.onSelectedRecordsChanged.next(this.selectedRecords);
    }

    /**
     * Select records
     *
     * @param filterParameter
     * @param filterValue
     */
     selectRecords(filterParameter?, filterValue?): void {
        this.selectedRecords = [];

        // If there is no filter, select all records
         if (filterParameter === undefined || filterValue === undefined) {
             this.selectedRecords = [];
             this.recordsWithPagination.docs.map(record => {
                 if (!record.invoiceId) {
                     this.selectedRecords.push(record._id);
                 }
             });
         }

        // Trigger the next event
        this.onSelectedRecordsChanged.next(this.selectedRecords);
    }

    /**
     * Deselect records
     */
     deselectRecords(): void {
        this.selectedRecords = [];

        // Trigger the next event
        this.onSelectedRecordsChanged.next(this.selectedRecords);
    }

    /**
     * Create a new record
     *
     * @param record
     * @returns {Promise<any>}
     */
     createRecordButNoRefresh(route, record): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(BASE_URL + route, { ...record })
                .subscribe(response => {
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update record but no refresh
     *
     * @param record
     * @returns {Promise<any>}
     */
    updateRecordButNoRefresh(route, record): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(BASE_URL + route + '/' + record._id, { ...record })
                .subscribe(response => {
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

}
