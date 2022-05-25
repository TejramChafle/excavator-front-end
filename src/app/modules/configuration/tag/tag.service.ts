import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Tag } from './tag.model';

import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class TagService implements Resolve<any> {
    onTagChanged: BehaviorSubject<any>;
    onSelectedTagChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    tags: any = {};
    user: any;
    selectedTag: string[] = [];

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
        this.onTagChanged = new BehaviorSubject([]);
        this.onSelectedTagChanged = new BehaviorSubject([]);
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
                this.getTag(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getTag();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getTag();
                    });

                    // resolve();

                },
                reject
            );
        });
    }

    /**
     * Get tag
     *
     * @returns {Promise<any>}
     */
    getTag(params?: any): Promise<any> {
        let url = apiBaseUrl + 'tag/';
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
                    this.tags = response;

                    /* this.tags.docs = this.tags.docs.map(tag => {
                        return new Tag(tag);
                    }); */

                    this.onTagChanged.next(response.docs);
                    resolve(this.tags);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Toggle selected tag by id
     *
     * @param id
     */
    toggleSelectedTag(id): void {
        // First, check if we already have that tag as selected...
        if (this.selectedTag.length > 0) {
            const index = this.selectedTag.indexOf(id);

            if (index !== -1) {
                this.selectedTag.splice(index, 1);

                // Trigger the next event
                this.onSelectedTagChanged.next(this.selectedTag);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedTag.push(id);

        // Trigger the next event
        this.onSelectedTagChanged.next(this.selectedTag);
    }

    /**
     * Select tag
     *
     * @param filterParameter
     * @param filterValue
     */
    selectTag(filterParameter?, filterValue?): void {
        this.selectedTag = [];

        // If there is no filter, select all tag
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedTag = [];
            this.tags.docs.map(tag => {
                this.selectedTag.push(tag._id);
            });
        }

        // Trigger the next event
        this.onSelectedTagChanged.next(this.selectedTag);
    }

    /**
     * Create a new tag
     *
     * @param tag
     * @returns {Promise<any>}
     */
    createTag(tag): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'tag/', { ...tag }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getTag();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update tag
     *
     * @param tag
     * @returns {Promise<any>}
     */
    updateTag(tag): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'tag/' + tag._id, { ...tag }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getTag();
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
            this._httpClient.post('api/tag-user/' + this.user._id, { ...userData })
                .subscribe(response => {
                    this.getTag();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect tag
     */
    deselectTag(): void {
        this.selectedTag = [];

        // Trigger the next event
        this.onSelectedTagChanged.next(this.selectedTag);
    }


    /**
     * Delete tag
     *
     * @param tag
     * @returns {Promise<any>}
     */
    deleteTag(tag): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(apiBaseUrl + 'tag/' + tag._id, this._appService.httpOptions)
                .subscribe(response => {
                    this.getTag();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete selected tag
     */
    deleteSelectedTag(): void {
        for (const tagId of this.selectedTag) {
            const tag = this.tags.docs.find(_tag => {
                return _tag._id === tagId;
            });
            const tagIndex = this.tags.docs.indexOf(tag);
            this.tags.docs.splice(tagIndex, 1);
        }
        this.onTagChanged.next(this.tags.docs);
        this.deselectTag();
    }

}
