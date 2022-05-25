import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { FuelResourceComponent } from './fuel-resource.component';
import { FuelResourceService } from './fuel-resource.service';
import { FuelResourceListComponent } from './fuel-resource-list/fuel-resource-list.component';
import { FuelResourceFormDialogComponent } from './fuel-resource-form/fuel-resource-form.component';
import { AuthGuard } from '../../authentication/guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'configuration/fuel-resource',
        component: FuelResourceComponent,
        resolve: {
            resources: FuelResourceService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        FuelResourceComponent,
        FuelResourceListComponent,
        FuelResourceFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers: [
        FuelResourceService
    ],
    entryComponents: [
        FuelResourceFormDialogComponent
    ],
    exports: [
        FuelResourceComponent
    ]
})

export class FuelResourceModule {
}
