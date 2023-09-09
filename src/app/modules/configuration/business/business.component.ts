import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Business } from './business.model';
import { BusinessService } from './business.service';

@Component({
    selector     : 'business-detail',
    templateUrl  : './business.component.html',
    styleUrls    : ['./business.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class BusinessComponent implements OnInit, OnDestroy {
    business: Business;
    pageType: string;
    businessForm: FormGroup;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {BusinessService} _businessService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _businessService: BusinessService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.business = new Business();

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
        // Subscribe to update business on changes
        this._businessService.onBusinessChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(business => {
                console.log({ business });
                if (business && business._id) {
                    this.business = new Business(business);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.business = new Business();
                }
                console.log('this.business: ', this.business);
                this.businessForm = this.createBusinessForm();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create business form
     *
     * @returns {FormGroup}
     */
    createBusinessForm(): FormGroup {
        this.business.owner = this.business.owner || { name: null, email: null, phone: null };
        return this._formBuilder.group({
            id: [this.business._id],
            name: [this.business.name],
            owner: new FormGroup({
                name: new FormControl(this.business.owner.name, [Validators.required, Validators.maxLength(50)]),
                email: new FormControl(this.business.owner.email, Validators.required),
                phone: new FormControl(this.business.owner.phone, Validators.required)
            }),
            about: [this.business.about],
            tagline: [this.business.tagline],
            logo: [this.business.logo],
            panNo: [this.business.panNo],
            gstNo: [this.business.gstNo],
            email: [this.business.email],
            phone: [this.business.phone],
            alternatePhone: [this.business.alternatePhone],
            address: [this.business.address]
        });
    }

    /**
     * Save business
     */
    updateBusiness(): void {
        const data = this.businessForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        this._businessService.updateBusiness(data).then(() => {
            // Trigger the subscription with new data
            this._businessService.onBusinessChanged.next(data);
            // Show the success message
            this._matSnackBar.open('Business updated', 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        });
    }

    /**
     * Add business
     */
    addBusiness(): void {
        const data = this.businessForm.getRawValue();
        // data.handle = FuseUtils.handleize(data.name);
        this._businessService.addBusiness(data).then(() => {
            // Trigger the subscription with new data
            this._businessService.onBusinessChanged.next(data);
            // Show the success message
            this._matSnackBar.open('Business added', 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        });
    }
}
