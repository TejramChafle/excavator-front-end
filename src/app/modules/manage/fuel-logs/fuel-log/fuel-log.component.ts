import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { FuelLog } from './fuel-log.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';
import { AppCache } from 'app/app.cache';

@Component({
    selector: 'fuel-log',
    templateUrl: './fuel-log.component.html',
    styleUrls: ['./fuel-log.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class FuelLogComponent implements OnInit, OnDestroy {
    fuelLog: FuelLog;
    pageType: string;
    fuelLogForm: FormGroup;
    
    petrolPumps: Array<any>;
    vehicles: Array<any>;
    employees: Array<any>;

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
        this.fuelLog = new FuelLog({});

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
            this.fuelLog = new FuelLog(history.state);
            this.pageType = 'edit';
        } else {
            this.pageType = 'new';
            this.fuelLog = new FuelLog({});
        }
        this.fuelLogForm = this.createFuelLogForm();
        this.initOptionListValues();
    }

    async initOptionListValues() {
        this.petrolPumps = await this._appCache.getFuelPumps();
        this.vehicles = await this._appCache.getVehicles();
        this.employees = await this._appCache.getEmployees();
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
     * Create fuelLog form
     *
     * @returns {FormGroup}
     */
    createFuelLogForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.fuelLog._id],
            fuel: [this.fuelLog.fuel],
            petrolPump: [this.fuelLog.petrolPump],
            date: [this.fuelLog.date],
            invoiceId: [this.fuelLog.invoiceId],
            // invoicePhoto: [this.fuelLog.invoicePhoto],

            rate: [this.fuelLog.rate],
            volume: [this.fuelLog.volume],
            total: [this.fuelLog.total],
            employee: [this.fuelLog.employee],
            vehicle: [this.fuelLog.vehicle],
            active: [this.fuelLog.active]
        });
    }

    /**
     * Create/Update fuel log
     */
    onSubmit(): void {
        const data = this.fuelLogForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        console.log({ data });
        data.business = this._appService.user.business._id;
        data.updatedBy = this._appService.user._id;

        if (data._id) {
            this._dataService.updateRecord('fuel', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Fuel information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecord('fuel', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Fueling information added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        }
    }

    onChangePetrolPump(event) {
        const fuel = this.fuelLogForm.get('fuel').value;
        if (fuel) {
            const pump = this.petrolPumps.find((pump) => pump._id === event.value);
            switch (fuel) {
                case 'PETROL':
                    this.fuelLogForm.patchValue({ rate: pump.petrolRate });
                    break;
                case 'DIESEL':
                    this.fuelLogForm.patchValue({ rate: pump.dieselRate });
                    break;
                default:
                    break;
            }

        }
    }

    // Calculate and update the total work amount
    onChangeQuantity(event) {
        if (this.fuelLogForm.value.rate && this.fuelLogForm.value.volume) {
            const total = this.fuelLogForm.value.rate * this.fuelLogForm.value.volume;
            this.fuelLogForm.patchValue({ total });
        }
    }
}
