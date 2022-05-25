import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { AuthService } from '../auth.service';
import { AppService } from './../../../app.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _appService: AppService,
        private _router: Router
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
        this.loginForm = this._formBuilder.group({
            // email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }





    // -----------------------------------------------------------------------------------------------------
    // Public methods
    // -----------------------------------------------------------------------------------------------------

    // Login on submit of the login form
    onSubmit(form): void {
        this._authService.login(form).subscribe((response) => {

            console.log(response);

            // Save the login information in local storage
            localStorage.setItem('auth', JSON.stringify(response));

            // Initialize the application user information and http header options
            this._appService.initApplication();

            // Navigate the the home page of the application
            this._router.navigate(['/dashboards/project']);
        });
    }
}
