import { Component, Inject, ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from './user.model';

@Component({
    selector: 'user-form',
    templateUrl: './user-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class UserFormDialogComponent implements OnInit {
    user: User;
    userForm: FormGroup;
    @Input('data') data: any;
    @Input('action') action: string;
    @Output() formChanged: EventEmitter<any> = new EventEmitter()
    /**
     * Constructor
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    ) {
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
        this.formChanged.emit(formData);
    }

    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
        if (this.action === 'edit') {
            this.user = this.data;
        } else {
            this.user = new User({});
        }
        this.userForm = this.createUserForm();
        console.log('this.user : ', this.user);
    }
}
