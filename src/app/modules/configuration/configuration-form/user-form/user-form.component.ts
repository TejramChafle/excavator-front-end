import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from './user.model';
import { AppService } from 'app/app.service';

@Component({
    selector: 'users-user-form-dialog',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UserFormDialogComponent implements OnInit {
    action: string;
    user: User;
    userForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<UserFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<UserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _appService: AppService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit User';
            this.user = _data.user;
        }
        else {
            this.dialogTitle = 'New User';
            this.user = new User({});
        }

        this.userForm = this.createUserForm();

        console.log('this.user : ', this.user);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create user form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.user._id],
            name: [this.user.name],
            role: [this.user.role],
            avatar: [this.user.avatar],
            email: [this.user.email],
            phone: [this.user.phone],
            password: [null],
            designation: [this.user.designation],
            otp: [this.user.otp],
            token: [this.user.token],
            isActive: [this.user.isActive]
        });
    }


    // Do save/update user information on click of add/save button
    onSubmit(formData): void {
        console.log({formData});
    }


    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
        /* this._tagService.getTag({purpose: 'User'}).then(tags => {
            // console.log('Tags : ', tags);
        }); */
    }
}
