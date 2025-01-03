import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';

import { Work } from './work.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';
import { takeUntil } from 'rxjs/operators';
import { AppCache } from 'app/app.cache';

@Component({
    selector: 'work',
    templateUrl: './work.component.html',
    styleUrls: ['./work.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class WorkComponent implements OnInit, OnDestroy {
    work: Work;
    pageType: string;
    workForm: FormGroup;

    customers: Array<any>;
    contacts: Array<any>;
    services: Array<any>;
    vehicles: Array<any>;
    service: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _dataService: DataService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _activatedRoute: ActivatedRoute,
        private _appService: AppService,
        private _appCache: AppCache
    ) {
        // Set the default
        this.work = new Work({});

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        const id = this._activatedRoute.snapshot.params['id'];
        if (id) {
            const work = history.state;
            console.log({work});
            this.work = new Work(work);
            this.service = work.service;
            this.work.service = work.service._id;
            // this.work.contact = work.contact._id;
            this.work.customer = work.customer._id;
            console.log('this.work: ', this.work);
            this.pageType = 'edit';
        } else {
            this.pageType = 'new';
            this.work = new Work({});
        }
        this.workForm = this.createWorkForm();

        // Get the required metadata
        this.getCustomers();
        this.getServices();
        this.getSupervisor();
        this.getVehicles();
    }

    async getCustomers() {
        this.customers =  await this._appCache.getCustomers();
    }

    async getServices() {
        this.services = await this._appCache.getServices();
    }

    async getSupervisor() {
        this.contacts = await this._appCache.getSupervisor();
    }

    async getVehicles() {
        this.vehicles = await this._appCache.getVehicles();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create work form
     *
     * @returns {FormGroup}
     */
    createWorkForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.work._id],
            service: [this.work.service],
            date: [this.work.date],
            startTime: [this.work.startTime],
            endTime: [this.work.endTime],
            customer: [this.work.customer],
            supervisor: [this.work.supervisor],

            site: [this.work.site],
            workers: [this.work.workers],
            rate: [this.work.rate],
            quantity: [this.work.quantity],
            total: [this.work.total],
            description: [this.work.description],
            active: [this.work.active],
            vehicle: [this.work.vehicle]
        });
    }

    /**
     * Create/Update work
     */
    onSubmit(): void {
        const data = this.workForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        console.log({ data });
        data.business = this._appService.user.business._id;
        data.updatedBy = this._appService.user._id;

        if (data._id) {
            this._dataService.updateRecord('work', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Work information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecord('work', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Work added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        }
    }

    // Update the rate of the service on change of service from dropdown
    onChangeService(event) {
        this.service = this.services.find((service) => service._id === event.value);
        this.workForm.patchValue({ rate: this.service.rate });
    }

    // Calculate and update the total work amount
    onChangeQuantity(event) {
        if (this.workForm.value.rate && this.workForm.value.quantity) {
            const total = this.workForm.value.rate * this.workForm.value.quantity;
            this.workForm.patchValue({ total });
        }
    }
    
    // Assign the place by default for the selected customer
    onChangeCustomer(event) {
        const customer = this.customers.find((customer) => customer._id === event.value);
        console.log(event, customer);
        this.workForm.patchValue({ site: customer.place });
    }
}
