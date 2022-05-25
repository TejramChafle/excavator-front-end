import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from 'app/modules/authentication/login/login.component';
import { LockComponent } from 'app/modules/authentication/lock/lock.component';
import { MailConfirmComponent } from 'app/modules/authentication/mail-confirm/mail-confirm.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../../material.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes = [
    {
        path: 'auth/login',
        component: LoginComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'auth/register',
        component: RegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'auth/mail-confirm',
        component: MailConfirmComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'auth/lock',
        component: LockComponent,
        canActivate: [AuthGuard]
    },
    {
        path     : 'auth/forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'auth/reset-password',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        LockComponent,
        MailConfirmComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    providers: [
        AuthService
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule
    ]
})

export class AuthModule {}
