import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Contact } from '../contact.model';
import { CONTACT_TYPE } from 'app/app.config';

@Component({
    selector: 'contacts-contact-form-dialog',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactFormDialogComponent {
    action: string;
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;
    contactTypes = Object.values(CONTACT_TYPE);
    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit Contact';
            this.contact = _data.contact;
        }
        else {
            this.dialogTitle = 'New Contact';
            this.contact = new Contact({});
        }

        this.contactForm = this.createContactForm();
        
        console.log({contactType: this.contactTypes});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.contact._id],
            firstName: [this.contact.firstName],
            lastName: [this.contact.lastName],
            avatar: [this.contact.avatar],
            nickname: [this.contact.nickname],
            company: [this.contact.company],
            jobTitle: [this.contact.jobTitle],
            email: [this.contact.email],
            phone: [this.contact.phone],
            alternatePhone: [this.contact.alternatePhone],
            address: [this.contact.address],
            birthday: [this.contact.birthday],
            notes: [this.contact.notes],
            isStarred: [this.contact.isStarred],
            contactType: [this.contact.contactType]
        });
    }
}
