import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Employee } from './employee.model';
import { DataService } from 'app/data.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class EmployeeComponent implements OnInit, OnDestroy {
    employee: Employee;
    pageType: string;
    employeeForm: FormGroup;

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
        private _appService: AppService
    ) {
        // Set the default
        this.employee = new Employee({});

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
        // Subscribe to update employee on changes
        /* this._dataService.onRecordDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(employee => {
                console.log({employee});
                if (employee) {
                    this.employee = new Employee(employee);
                    this.pageType = 'edit';
                }
                else {
                    this.pageType = 'new';
                    this.employee = new Employee();
                }
            }); */
        const id = this._activatedRoute.snapshot.params['id'];
        if (id) {
            this.employee = new Employee(history.state);
            this.pageType = 'edit';
        } else {
            this.pageType = 'new';
            this.employee = new Employee({});
        }
        this.employeeForm = this.createEmployeeForm();
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
     * Create employee form
     *
     * @returns {FormGroup}
     */
    createEmployeeForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.employee._id],
            firstName: [this.employee.firstName],
            lastName: [this.employee.lastName],
            gender: [this.employee.gender],
            dateOfBirth: [this.employee.dateOfBirth],
            photo: [this.employee.photo],

            address: [this.employee.address],
            phone: [this.employee.phone],
            alternatePhone: [this.employee.alternatePhone],
            emergencyPhone: [this.employee.emergencyPhone],
            email: [this.employee.email],

            bloodGroup: [this.employee.bloodGroup],
            insuranceName: [this.employee.insuranceName],
            insuranceNumber: [this.employee.insuranceNumber],
            insurancePremium: [this.employee.insurancePremium],
            insuranceAmount: [this.employee.insuranceAmount],

            bankName: [this.employee.bankName],
            ifscCode: [this.employee.ifscCode],
            upiId: [this.employee.upiId],
            accountNumber: [this.employee.accountNumber],

            designation: [this.employee.designation],
            dateOfJoin: [this.employee.dateOfJoin],
            wageType: [this.employee.wageType],
            wagePerDay: [this.employee.wagePerDay],
            wagePerMonth: [this.employee.wagePerMonth],
            wagePerYear: [this.employee.wagePerYear],
            incentive: [this.employee.incentive],
            weekendOff: [this.employee.weekendOff],
            active: [this.employee.active]
        });
    }

    /**
     * Create/Update employee
     */
    onSubmit(): void {
        const data = this.employeeForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        console.log({ data });
        data.business = this._appService.user.business._id;
        data.updatedBy = this._appService.user._id;

        if (data._id) {
            this._dataService.updateRecord('employee', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Employee information saved', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        } else {
            data.createdBy = this._appService.user._id;
            this._dataService.createRecord('employee', data)
                .then(() => {

                    // Trigger the subscription with new data
                    this._dataService.onRecordDataChanged.next(data);

                    // Show the success message
                    this._matSnackBar.open('Employee added', 'OK', {
                        verticalPosition: 'top',
                        duration: 2000
                    });

                    // Go back to previous page
                    this._location.back();
                });
        }
    }
}
