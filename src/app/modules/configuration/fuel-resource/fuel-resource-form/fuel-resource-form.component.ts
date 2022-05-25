import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FuelResource } from '../../fuel-resource/fuel-resource.model';
import { FuelResourceService } from '../fuel-resource.service';
import { AppService } from 'app/app.service';

@Component({
    selector: 'fuel-resource-form-dialog',
    templateUrl: './fuel-resource-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class FuelResourceFormDialogComponent {
    action: string;
    resource: FuelResource;
    resourceForm: FormGroup;
    dialogTitle: string;
    purposes: Array<string>;
    /**
     * Constructor
     *
     * @param {MatDialogRef<FuelResourceFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<FuelResourceFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _resourceService: FuelResourceService,
        private _appService: AppService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit Fuel Resource';
            this.resource = _data.resource;
        }
        else {
            this.dialogTitle = 'New Fuel Resource';
            this.resource = new FuelResource({});
        }

        this.resourceForm = this.createFuelResourceForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create resource form
     *
     * @returns {FormGroup}
     */
    createFuelResourceForm(): FormGroup {
        return this._formBuilder.group({
            _id:    [this.resource._id],
            name:   [this.resource.name],
            place:  [this.resource.place],
            owner:  [this.resource.owner],
            phone:  [this.resource.phone],
        });
    }


    // Do save/update resource information on click of add/save button
    onSubmit(formData): void {        
        // If the resource id exist then update and save the resource
        if (formData._id) {
            formData.updated_by = this._appService.user._id;
            formData.updated_date = new Date();
            this._resourceService.updateFuelResource(formData).then((response) => {
                this._appService.handleMessage(response.message || 'Fuel resource information updated successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        } else {
            formData.created_by = this._appService.user._id;
            formData.updated_by = this._appService.user._id;
            formData.created_date = new Date();
            formData.updated_date = new Date();
            this._resourceService.createFuelResource(formData).then((response) => {
                this._appService.handleMessage(response.message || 'New fuel resource created successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        }
    }
}
