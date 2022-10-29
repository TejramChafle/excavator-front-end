import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AppService } from 'app/app.service';
import { DataService } from 'app/data.service';
import { MODULE } from '../../../app.config';

@Component({
    selector: 'configuration-form-dialog',
    templateUrl: './configuration-form.component.html',
    styleUrls: ['./configuration-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ConfigurationFormDialogComponent implements OnInit {
    action: string;
    serviceForm: FormGroup;
    dialogTitle: string;
    billingTypes = [
        { title: 'Day', value: 'Day' },
        { title: 'Hour', value: 'Hour' },
        { title: 'Day', value: 'Day' },
        { title: 'Ton', value: 'Ton' },
        { title: 'Sqft', value: 'Sqft' },
        { title: 'Trip', value: 'Trip' }
    ];
    formData: any;
    module: string;
    configForm: any;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ConfigurationFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ConfigurationFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dataService: DataService,
        private _appService: AppService
    ) {
        // Set the defaults
        this.action = _data.action;
        this.module = _data.module;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit ' + MODULE[this.module].pageTitle;
            this.formData = _data.data;
        } else {
            this.dialogTitle = 'Add ' + MODULE[this.module].pageTitle;
        }
        console.log('this._data : ', this._data, 'this.formData', this.formData, 'this.module', this.module);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------



    // Do save/update service information on click of add/save button
    onSubmit(formData): void {
        console.log({formData});
        formData.business = this._appService.user.business._id;
        formData.updatedBy = this._appService.user._id;
        // If the service id exist then update and save the service
        if (formData._id) {
            this._dataService.updateRecord(MODULE[this.module].backendRoute, formData).then((response) => {
                this._appService.handleMessage(response.message || 'Service information updated successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        } else {
            formData.createdBy = this._appService.user._id;
            this._dataService.createRecord(MODULE[this.module].backendRoute, formData).then((response) => {
                this._appService.handleMessage(response.message || 'New service created successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        }
    }


    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
    }

    onFormChange(event) {
        console.log(event);
        this.configForm = event;
    }
}
