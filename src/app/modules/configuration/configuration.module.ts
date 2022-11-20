import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';

import { AuthGuard } from '../authentication/guards/auth/auth.guard';
import { DataService } from 'app/data.service';

import { BusinessComponent } from './business/business.component';
import { BusinessService } from './business/business.service';

import { ConfigurationComponent } from './configuration.component';
import { ConfigurationFormDialogComponent } from './configuration-form/configuration-form.component';
import { ConfigurationListComponent } from './configuration-list/configuration-list.component';
import { ServiceFormDialogComponent } from './configuration-form/service-form/service-form.component';
import { TagFormDialogComponent } from './configuration-form/tag-form/tag-form.component';
import { UserFormDialogComponent } from './configuration-form/user-form/user-form.component';
import { VehicleFormDialogComponent } from './configuration-form/vehicle-form/vehicle-form.component';
import { PetrolPumpFormDialogComponent } from './configuration-form/petrol-pump-form/petrol-pump-form.component';
import { CustomerFormDialogComponent } from './configuration-form/customer-form/customer-form.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'configuration/business',
        pathMatch: 'full'
    },
    {
        path: 'configuration/business',
        component: BusinessComponent,
        resolve: {
            business: BusinessService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'configuration/:module',
        component: ConfigurationComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        BusinessComponent,
        
        ConfigurationComponent,
        ConfigurationListComponent,
        ConfigurationFormDialogComponent,

        ServiceFormDialogComponent,
        TagFormDialogComponent,
        UserFormDialogComponent,
        VehicleFormDialogComponent,
        PetrolPumpFormDialogComponent,
        CustomerFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule
    ],
    providers: [
        BusinessService
    ],
    entryComponents: [
        ConfigurationFormDialogComponent
    ]
})

export class ConfigurationModule {
}
