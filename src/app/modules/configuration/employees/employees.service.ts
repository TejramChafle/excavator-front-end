import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Employee } from './employee.model';

import { apiBaseUrl } from 'app/app.config';
import { AppService } from 'app/app.service';
import { TagService } from '../tag/tag.service';


@Injectable()
export class EmployeesService implements Resolve<any> {
    onEmployeesChanged: BehaviorSubject<any>;
    onSelectedEmployeesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    // employees: Employee[];
    employees: any = {};
    user: any;
    selectedEmployees: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _appService: AppService,
        private _tagService: TagService
    ) {
        // Set the defaults
        this.onEmployeesChanged = new BehaviorSubject([]);
        this.onSelectedEmployeesChanged = new BehaviorSubject([]);
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
                // this.getEmployees(),
                // this.getUserData()
                
            ]).then(
                ([files]) => {

                    this._tagService.getTag({purpose: 'Contact'}).then(tags=>{
                        this.getEmployees();
                    });

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getEmployees();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getEmployees();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get employees
     *
     * @returns {Promise<any>}
     */
    getEmployees(params?: any): Promise<any> {
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

        if (this._tagService.tags && this._tagService.tags.docs) {
            let tag = this._tagService.tags.docs.find(doc=>{
                return doc.name = 'Employee';
            });
            url += '&tag=' +tag._id;
        }

        return new Promise((resolve, reject) => {
            this._httpClient.get(url, this._appService.httpOptions)
                .subscribe((response: any) => {
                    this.employees = response;
                    this.onEmployeesChanged.next(this.employees.docs);
                    resolve(this.employees);
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
            this._httpClient.get('api/contact-user/5725a6802d10e277a0f35724')
                .subscribe((response: any) => {
                    this.user = response;
                    this.onUserDataChanged.next(this.user);
                    resolve(this.user);
                }, reject);
        }
        );
    }

    /**
     * Toggle selected employee by id
     *
     * @param id
     */
    toggleSelectedEmployee(id): void {
        // First, check if we already have that employee as selected...
        if (this.selectedEmployees.length > 0) {
            const index = this.selectedEmployees.indexOf(id);

            if (index !== -1) {
                this.selectedEmployees.splice(index, 1);

                // Trigger the next event
                this.onSelectedEmployeesChanged.next(this.selectedEmployees);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedEmployees.push(id);

        // Trigger the next event
        this.onSelectedEmployeesChanged.next(this.selectedEmployees);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedEmployees.length > 0) {
            this.deselectEmployees();
        }
        else {
            this.selectEmployees();
        }
    }

    /**
     * Select employees
     *
     * @param filterParameter
     * @param filterValue
     */
    selectEmployees(filterParameter?, filterValue?): void {
        this.selectedEmployees = [];

        // If there is no filter, select all employees
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedEmployees = [];
            this.employees.map(employee => {
                this.selectedEmployees.push(employee._id);
            });
        }

        // Trigger the next event
        this.onSelectedEmployeesChanged.next(this.selectedEmployees);
    }

    /**
     * Create a new employee
     *
     * @param employee
     * @returns {Promise<any>}
     */
    createEmployee(employee): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post(apiBaseUrl + 'contact/', { ...employee }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getEmployees();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }

    /**
     * Update employee
     *
     * @param employee
     * @returns {Promise<any>}
     */
    updateEmployee(employee): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.put(apiBaseUrl + 'contact/' + employee._id, { ...employee }, this._appService.httpOptions)
                .subscribe(response => {
                    this.getEmployees();
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
            this._httpClient.post('api/contact-user/' + this.user._id, { ...userData })
                .subscribe(response => {
                    this.getUserData();
                    this.getEmployees();
                    resolve(response);
                });
        });
    }

    /**
     * Deselect employees
     */
    deselectEmployees(): void {
        this.selectedEmployees = [];

        // Trigger the next event
        this.onSelectedEmployeesChanged.next(this.selectedEmployees);
    }

    /**
     * Delete employee
     *
     * @param employee
     */
    /* deleteEmployee(employee): void {
        const employeeIndex = this.employees.indexOf(employee);
        this.employees.splice(employeeIndex, 1);
        this.onEmployeesChanged.next(this.employees);
    } */


    /**
     * Delete employee
     *
     * @param employee
     * @returns {Promise<any>}
     */
    deleteEmployee(employee): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(apiBaseUrl + 'contact/' + employee._id, this._appService.httpOptions)
                .subscribe(response => {
                    this.getEmployees();
                    resolve(response);
                }, (error) => {
                    this._appService.handleError(error);
                    return reject;
                });
        });
    }


    /**
     * Delete selected employees
     */
    deleteSelectedEmployees(): void {
        for (const employeeId of this.selectedEmployees) {
            const employee = this.employees.find(_employee => {
                return _employee._id === employeeId;
            });
            const employeeIndex = this.employees.indexOf(employee);
            this.employees.splice(employeeIndex, 1);
        }
        this.onEmployeesChanged.next(this.employees);
        this.deselectEmployees();
    }

}
