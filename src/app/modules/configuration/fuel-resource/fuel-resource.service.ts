import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { FuelResource } from './fuel-resource.model';

import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class FuelResourceService implements Resolve<any> {
    onFuelResourceChanged: BehaviorSubject<any>;
    onSelectedFuelResourceChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    resources: any = {};
    user: any;
    selectedFuelResource: string[] = [];

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
        this.onFuelResourceChanged = new BehaviorSubject([]);
        this.onSelectedFuelResourceChanged = new BehaviorSubject([]);
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
                this.getFuelResource(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getFuelResource();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getFuelResource();
                    });

                    // resolve();

                },
                reject
            );
        });
    }

    /**
     * Get resource
     *
     * @returns {Promise<any>}
     */
    getFuelResource(params?: any): Promise<any> {
        let url = apiBaseUrl + 'fuel-resource/';
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

        return new Promise((resolve, reject) => {
            this._httpClient.get(url, this._appService.httpOptions)
                .subscribe((response: any) => {
                    this.resources = response;

                    /* this.resources.docs = this.resources.docs.map(resource => {
                        return new FuelResource(resource);
                    }); */

                    this.onFuelResourceChanged.next(response.docs);
                    resolve(this.resources);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Toggle selected resource by id
     *
     * @param id
     */
    toggleSelectedFuelResource(id): void {
        // First, check if we already have that resource as selected...
        if (this.selectedFuelResource.length > 0) {
            const index = this.selectedFuelResource.indexOf(id);

            if (index !== -1) {
                this.selectedFuelResource.splice(index, 1);

                // Trigger the next event
                this.onSelectedFuelResourceChanged.next(this.selectedFuelResource);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedFuelResource.push(id);

        // Trigger the next event
        this.onSelectedFuelResourceChanged.next(this.selectedFuelResource);
    }

    /**
     * Select resource
     *
     * @param filterParameter
     * @param filterValue
     */
    selectFuelResource(filterParameter?, filterValue?): void {
        this.selectedFuelResource = [];

        // If there is no filter, select all resource
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedFuelResource = [];
            this.resources.docs.map(resource => {
                this.selectedFuelResource.push(resource._id);
            });
        }

        // Trigger the next event
        this.onSelectedFuelResourceChanged.next(this.selectedFuelResource);
    }

    /**
     * Create a new resource
     *
     * @param resource
     * @returns {Promise<any>}
     */
    createFuelResource(resource): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'fuel-resource/', { ...resource }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getFuelResource();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update resource
     *
     * @param resource
     * @returns {Promise<any>}
     */
    updateFuelResource(resource): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'fuel-resource/' + resource._id, { ...resource }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getFuelResource();
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
            this._httpClient.post('api/resource-user/' + this.user._id, { ...userData })
                .subscribe(response => {
                    this.getFuelResource();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect resource
     */
    deselectFuelResource(): void {
        this.selectedFuelResource = [];

        // Trigger the next event
        this.onSelectedFuelResourceChanged.next(this.selectedFuelResource);
    }


    /**
     * Delete resource
     *
     * @param resource
     * @returns {Promise<any>}
     */
    deleteFuelResource(resource): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(apiBaseUrl + 'fuel-resource/' + resource._id, this._appService.httpOptions)
                .subscribe(response => {
                    this.getFuelResource();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete selected resource
     */
    deleteSelectedFuelResource(): void {
        for (const resourceId of this.selectedFuelResource) {
            const resource = this.resources.docs.find(_resource => {
                return _resource._id === resourceId;
            });
            const resourceIndex = this.resources.docs.indexOf(resource);
            this.resources.docs.splice(resourceIndex, 1);
        }
        this.onFuelResourceChanged.next(this.resources.docs);
        this.deselectFuelResource();
    }

}
