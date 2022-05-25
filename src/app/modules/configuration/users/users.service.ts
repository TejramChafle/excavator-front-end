import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { User } from './user.model';

import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class UsersService implements Resolve<any> {
    onUsersChanged: BehaviorSubject<any>;
    // onSelectedUsersChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    users: User[];
    pagination: any = {};
    user: any;
    selectedUsers: string[] = [];

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
        this.onUsersChanged = new BehaviorSubject([]);
        // this.onSelectedUsersChanged = new BehaviorSubject([]);
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
                this.getUsers(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getUsers();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUsers();
                    });

                    resolve(this.users);

                },
                reject
            );
        });
    }

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getUsers(params?: any): Promise<any> {
        let url = apiBaseUrl + 'auth/users';
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
        url += '&sort_order=desc';
        return new Promise((resolve, reject) => {
            this._httpClient.get(url, this._appService.httpOptions)
                .subscribe((response: any) => {
                    this.users = response.docs;
                    delete response.docs;
                    this.pagination = response;
                    /* if (this.filterBy === 'starred') {
                        this.users = this.users.filter(_user => {
                            return this.user.starred.includes(_user._id);
                        });
                    }

                    if (this.filterBy === 'frequent') {
                        this.users = this.users.filter(_user => {
                            return this.user.frequentUsers.includes(_user._id);
                        });
                    }

                    if (this.searchText && this.searchText !== '') {
                        this.users = FuseUtils.filterArrayByString(this.users, this.searchText);
                    } */

                    /* this.users = this.users.map(user => {
                        return new User(user);
                    }); */

                    this.onUsersChanged.next(this.users);
                    resolve(this.users);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/users-user/5725a6802d10e277a0f35724')
                .subscribe((response: any) => {
                    this.user = response;
                    this.onUserDataChanged.next(this.user);
                    resolve(this.user);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected user by id
     *
     * @param id
     */
    /* toggleSelectedUser(id): void {
        // First, check if we already have that user as selected...
        if (this.selectedUsers.length > 0) {
            const index = this.selectedUsers.indexOf(id);

            if (index !== -1) {
                this.selectedUsers.splice(index, 1);

                // Trigger the next event
                this.onSelectedUsersChanged.next(this.selectedUsers);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUsers.push(id);

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    } */

    /**
     * Toggle select all
     */
    /* toggleSelectAll(): void {
        if (this.selectedUsers.length > 0) {
            this.deselectUsers();
        }
        else {
            this.selectUsers();
        }
    } */

    /**
     * Select users
     *
     * @param filterParameter
     * @param filterValue
     */
    /* selectUsers(filterParameter?, filterValue?): void {
        this.selectedUsers = [];

        // If there is no filter, select all users
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedUsers = [];
            this.users.map(user => {
                this.selectedUsers.push(user._id);
            });
        }

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    } */

    /**
     * Create a new user
     *
     * @param user
     * @returns {Promise<any>}
     */
    createUser(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'auth/signup', { ...user }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getUsers();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update user
     *
     * @param user
     * @returns {Promise<any>}
     */
    updateUser(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'user/' + user._id, { ...user }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getUsers();
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
            this._httpClient.post('api/users-user/' + this.user._id, { ...userData })
                .subscribe(response => {
                    this.getUserData();
                    this.getUsers();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect users
     */
    /* deselectUsers(): void {
        this.selectedUsers = [];

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    } */

    /**
     * Delete user
     *
     * @param user
     */
    /* deleteUser(user): void {
        const userIndex = this.users.indexOf(user);
        this.users.splice(userIndex, 1);
        this.onUsersChanged.next(this.users);
    } */


    /**
     * Delete user
     *
     * @param user
     * @returns {Promise<any>}
     */
    deleteUser(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(apiBaseUrl + 'user/' + user._id, this._appService.httpOptions)
                .subscribe(response => {
                    this.getUsers();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete selected users
     */
    /* deleteSelectedUsers(): void {
        for (const userId of this.selectedUsers) {
            const user = this.users.find(_user => {
                return _user._id === userId;
            });
            const userIndex = this.users.indexOf(user);
            this.users.splice(userIndex, 1);
        }
        this.onUsersChanged.next(this.users);
        this.deselectUsers();
    } */

}
