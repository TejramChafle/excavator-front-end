import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AppService } from 'app/app.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'lock',
    templateUrl: './lock.component.html',
    styleUrls: ['./lock.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class LockComponent implements OnInit {
    lockForm: FormGroup;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _appService: AppService,
        public _router: Router,
        public _authService: AuthService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.lockForm = this._formBuilder.group({
            username: new FormControl({ value: this._appService.user.username, disabled: true }, Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    // Unlock the application for the provided username & password form data
    unlock(form): any {
        const loginComp = new LoginComponent(this._fuseConfigService, this._formBuilder, this._authService, this._appService, this._router);
        loginComp.onSubmit({username: this.lockForm.controls.username.value, password: this.lockForm.controls.password.value});
    }
}
