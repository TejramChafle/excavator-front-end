import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { AppService } from 'app/app.service';

@Component({
    selector: 'client-form-dialog',
    templateUrl: './client-form.component.html',
    // styleUrls: ['./client-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ClientFormDialogComponent {
    action: string;
    client: Client;
    clientForm: FormGroup;
    dialogTitle: string;
    purposes: Array<string>;
    /**
     * Constructor
     *
     * @param {MatDialogRef<ClientFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ClientFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _clientService: ClientService,
        private _appService: AppService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit Client';
            this.client = _data.client;
        }
        else {
            this.dialogTitle = 'New Client';
            this.client = new Client({});
        }

        this.clientForm = this.createClientForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create client form
     *
     * @returns {FormGroup}
     */
    createClientForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.client._id],
            name: [this.client.name],
            contact_person: [this.client.contact_person],
            phone: [this.client.phone],
            email: [this.client.email],
            address: [this.client.address],
            description: [this.client.description],
        });
    }


    // Do save/update client information on click of add/save button
    onSubmit(formData): void {        
        // If the client id exist then update and save the client
        if (formData._id) {
            formData.updated_by = this._appService.user._id;
            formData.updated_date = new Date();
            this._clientService.updateClient(formData).then((response) => {
                this._appService.handleMessage(response.message || 'Client information updated successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        } else {
            formData.created_by = this._appService.user._id;
            formData.updated_by = this._appService.user._id;
            formData.created_date = new Date();
            formData.updated_date = new Date();
            this._clientService.createClient(formData).then((response) => {
                this._appService.handleMessage(response.message || 'New client created successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        }
    }
}
