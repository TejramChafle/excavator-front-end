import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from '../user.model';
import { UsersService } from '../users.service';
import { AppService } from 'app/app.service';
import { TagService } from '../../tag/tag.service';

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
        private _usersService: UsersService,
        private _appService: AppService,
        public _tagService: TagService,
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
        // If the user id exist then update and save the user
        if (formData._id) {
            // formData.updated_by = this._appService.user._id;
            formData.password = formData.phone;
            formData.updated_date = new Date();
            this._usersService.updateUser(formData).then((response) => {
                this._appService.handleMessage(response.message || 'User information updated successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        } else {
            // formData.created_by = this._appService.user._id;
            // formData.updated_by = this._appService.user._id;
            // formData.created_date = new Date();
            // formData.updated_date = new Date();
            formData.password = formData.phone;
            this._usersService.createUser(formData).then((response) => {
                this._appService.handleMessage(response.message || 'New user created successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        }
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
