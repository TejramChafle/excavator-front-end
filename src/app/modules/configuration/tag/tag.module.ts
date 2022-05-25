import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { TagComponent } from './tag.component';
import { TagService } from './tag.service';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagFormDialogComponent } from './tag-form/tag-form.component';
import { AuthGuard } from '../../authentication/guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'configuration/tag',
        component: TagComponent,
        resolve: {
            tags: TagService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        TagComponent,
        TagListComponent,
        TagFormDialogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers: [
        TagService
    ],
    entryComponents: [
        TagFormDialogComponent
    ],
    exports: [
        TagComponent
    ]
})

export class TagModule {
}
