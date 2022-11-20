import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';
import { DataService } from 'app/data.service';
import { WorkComponent } from './works/work/work.component';
import { WorksComponent } from './works/works/works.component';

const routes: Routes = [
    {
        path: 'works',
        component: WorksComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'works' }
    },
    {
        path: 'work/:id',
        component: WorkComponent,
        /* resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'works' } */
    },
    {
        path: 'work',
        component: WorkComponent
    }
];

@NgModule({
    declarations: [
        WorkComponent,
        WorksComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule
    ]
})

export class WorkAndInvoiceModule {
}
