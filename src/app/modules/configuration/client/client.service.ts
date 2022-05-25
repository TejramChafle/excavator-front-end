import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Client } from './client.model';

import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class ClientService implements Resolve<any> {
    onClientChanged: BehaviorSubject<any>;
    onSelectedClientChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    clients: any = {};
    user: any;
    selectedClient: string[] = [];

    searchText: string;
    filterBy: string;

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
        this.onClientChanged = new BehaviorSubject([]);
        this.onSelectedClientChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getClient(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getClient();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getClient();
                    });

                    // resolve();

                },
                reject
            );
        });
    }

    /**
     * Get client
     *
     * @returns {Promise<any>}
     */
    getClient(params?: any): Promise<any> {
        let url = apiBaseUrl + 'client/';
        if (params && params.page) {
            url += '?page=' + params.page + '&limit=' + params.limit;
        } else {
            url += '?page=1&limit=100';
        }

        if (params && params.name) {
            url += '&name=' + params.name;
        } else if (this.searchText && this.searchText.trim().length) {
            url += '&name=' + this.searchText.trim();
        }

        if (params && params.purpose) {
            url += '&purpose=' + params.purpose;
        }

        return new Promise((resolve, reject) => {
            this._httpClient.get(url, this._appService.httpOptions)
                .subscribe((response: any) => {
                    this.clients = response;

                    /* this.clients.docs = this.clients.docs.map(client => {
                        return new Client(client);
                    }); */

                    this.onClientChanged.next(response.docs);
                    resolve(this.clients);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Toggle selected client by id
     *
     * @param id
     */
    toggleSelectedClient(id): void {
        // First, check if we already have that client as selected...
        if (this.selectedClient.length > 0) {
            const index = this.selectedClient.indexOf(id);

            if (index !== -1) {
                this.selectedClient.splice(index, 1);

                // Trigger the next event
                this.onSelectedClientChanged.next(this.selectedClient);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedClient.push(id);

        // Trigger the next event
        this.onSelectedClientChanged.next(this.selectedClient);
    }

    /**
     * Select client
     *
     * @param filterParameter
     * @param filterValue
     */
    selectClient(filterParameter?, filterValue?): void {
        this.selectedClient = [];

        // If there is no filter, select all client
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedClient = [];
            this.clients.docs.map(client => {
                this.selectedClient.push(client._id);
            });
        }

        // Trigger the next event
        this.onSelectedClientChanged.next(this.selectedClient);
    }

    /**
     * Create a new client
     *
     * @param client
     * @returns {Promise<any>}
     */
    createClient(client): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'client/', { ...client }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getClient();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update client
     *
     * @param client
     * @returns {Promise<any>}
     */
    updateClient(client): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'client/' + client._id, { ...client }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getClient();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/client-user/' + this.user._id, { ...userData })
                .subscribe(response => {
                    this.getClient();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect client
     */
    deselectClient(): void {
        this.selectedClient = [];

        // Trigger the next event
        this.onSelectedClientChanged.next(this.selectedClient);
    }


    /**
     * Delete client
     *
     * @param client
     * @returns {Promise<any>}
     */
    deleteClient(client): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(apiBaseUrl + 'client/' + client._id, this._appService.httpOptions)
                .subscribe(response => {
                    this.getClient();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete selected client
     */
    deleteSelectedClient(): void {
        for (const clientId of this.selectedClient) {
            const client = this.clients.docs.find(_client => {
                return _client._id === clientId;
            });
            const clientIndex = this.clients.docs.indexOf(client);
            this.clients.docs.splice(clientIndex, 1);
        }
        this.onClientChanged.next(this.clients.docs);
        this.deselectClient();
    }

}
