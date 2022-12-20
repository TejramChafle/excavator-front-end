import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { FakeDbService } from 'app/fake-db/fake-db.service';
import { AppComponent } from 'app/app.component';
import { AppStoreModule } from 'app/store/store.module';
import { LayoutModule } from 'app/layout/layout.module';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthModule } from './modules/authentication/auth.module';
import { AppService } from './app.service';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { AppInterceptor } from './app.interceptor';
import { DataService } from './data.service';
import { ManageContactsModule } from './modules/manage/contacts/contacts.module'; 
import { AuthGuard } from './modules/authentication/guards/auth/auth.guard';
import { WorkAndInvoiceModule } from './modules/work-and-invoice/work-and-invoice.module';
import { FinancialsModule } from './modules/financials/financials.module';

const appRoutes: Routes = [
    {
        path      : '',
        pathMatch: 'full',
        redirectTo: 'apps/dashboards/project'
    },
    {
        path        : 'apps',
        loadChildren: './main/apps/apps.module#AppsModule'
    },
    {
        path        : 'pages',
        loadChildren: './main/pages/pages.module#PagesModule'
    },
    {
        path        : 'ui',
        loadChildren: './main/ui/ui.module#UIModule'
    },
    {
        path        : 'documentation',
        loadChildren: './main/documentation/documentation.module#DocumentationModule'
    },
    {
        path        : 'angular-material-elements',
        loadChildren: './main/angular-material-elements/angular-material-elements.module#AngularMaterialElementsModule'
    },
    {
        path: 'configuration',
        loadChildren: './modules/configuration/configuration.module#ConfigurationModule',
        canActivate: [ AuthGuard ]
    },
    {
        path: 'manage',
        loadChildren: './modules/manage/manage.module#ManageModule',
        canActivate: [ AuthGuard ]
    },
    {
        path: 'work-and-invoice',
        loadChildren: './modules/work-and-invoice/work-and-invoice.module#WorkAndInvoiceModule',
        canActivate: [ AuthGuard ]
    },
    {
        path: 'financials',
        loadChildren: './modules/financials/financials.module#FinancialsModule',
        canActivate: [ AuthGuard ]
    },
    {
        path      : '**',
        redirectTo: 'apps/dashboards/project'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),
        InMemoryWebApiModule.forRoot(FakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true
        }),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        // App modules
        LayoutModule,
        AppStoreModule,
        AuthModule,
        ConfigurationModule,
        ManageContactsModule,
        WorkAndInvoiceModule,
        FinancialsModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers   : [
        AppService,
        DataService,
        { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }
    ]
})
export class AppModule
{
}
