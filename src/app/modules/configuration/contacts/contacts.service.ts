import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Contact } from './contact.model';

import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';

@Injectable()
export class ContactsService implements Resolve<any> {
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    // contacts: Contact[];
    contacts: any = {};
    user: any;
    selectedContacts: string[] = [];

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
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
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
                this.getContacts(),
                // this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts();
                    });

                    // resolve();

                },
                reject
            );
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(params?: any): Promise<any> {
        let url = apiBaseUrl + 'contact/';
        if (params && params.page) {
            url += '?page=' + params.page + '&limit=' + params.limit;
        } else {
            url += '?page=1&limit=10';
        }
        if (params && params.firstname) {
            url += '&firstname=' + params.firstname;
        } else if (this.searchText && this.searchText.trim().length) {
            url += '&firstname=' + this.searchText.trim();
        }

        return new Promise((resolve, reject) => {
            this._httpClient.get(url, this._appService.httpOptions)
                .subscribe((response: any) => {
                    this.contacts = response;

                    /* if (this.filterBy === 'starred') {
                        this.contacts = this.contacts.filter(_contact => {
                            return this.user.starred.includes(_contact._id);
                        });
                    }

                    if (this.filterBy === 'frequent') {
                        this.contacts = this.contacts.filter(_contact => {
                            return this.user.frequentContacts.includes(_contact._id);
                        });
                    }

                    if (this.searchText && this.searchText !== '') {
                        this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                    } */

                    /* this.contacts = this.contacts.map(contact => {
                        return new Contact(contact);
                    }); */

                    this.onContactsChanged.next(this.contacts.docs);
                    resolve(this.contacts);
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
            this._httpClient.get('api/contacts-user/5725a6802d10e277a0f35724')
                .subscribe((response: any) => {
                    this.user = response;
                    this.onUserDataChanged.next(this.user);
                    resolve(this.user);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void {
        // First, check if we already have that contact as selected...
        if (this.selectedContacts.length > 0) {
            const index = this.selectedContacts.indexOf(id);

            if (index !== -1) {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        }
        else {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedContacts = [];
            this.contacts.map(contact => {
                this.selectedContacts.push(contact._id);
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Create a new contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    createContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'contact/', { ...contact }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'contact/' + contact._id, { ...contact }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getContacts();
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
            this._httpClient.post('api/contacts-user/' + this.user._id, { ...userData })
                .subscribe(response => {
                    this.getUserData();
                    this.getContacts();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    /* deleteContact(contact): void {
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
    } */


    /**
     * Delete contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    deleteContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(apiBaseUrl + 'contact/' + contact._id, this._appService.httpOptions)
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void {
        for (const contactId of this.selectedContacts) {
            const contact = this.contacts.find(_contact => {
                return _contact._id === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.contacts);
        this.deselectContacts();
    }

}
