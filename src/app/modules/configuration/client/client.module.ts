import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ClientComponent } from './client.component';
import { ClientService } from './client.service';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormDialogComponent } from './client-form/client-form.component';
import { AuthGuard } from './../../authentication/guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'configuration/client',
        component: ClientComponent,
        resolve: {
            clients: ClientService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        ClientComponent,
        ClientListComponent,
        ClientFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers: [
        ClientService
    ],
    entryComponents: [
        ClientFormDialogComponent
    ],
    exports: [
        ClientComponent
    ]
})

export class ClientModule {
}
