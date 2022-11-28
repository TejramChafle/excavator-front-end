import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';
import { DataService } from 'app/data.service';
import { WorkComponent } from './works/work/work.component';
import { WorksComponent } from './works/works/works.component';
import { RecordsSelectedBarComponent } from './works/selected-bar/selected-bar.component';
import { InvoiceComponent } from './invoices/invoice/invoice.component';
import { InvoicesComponent } from './invoices/invoices/invoices.component';
import { InvoiceService } from './invoices/invoice/invoice.service';

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
    },
    {
        path: 'work',
        component: WorkComponent
    },{
        path: 'invoices',
        component: InvoicesComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'invoices' }
    },
    {
        path: 'invoice/:id',
        component: InvoiceComponent,
        resolve: {
            invoice: InvoiceService
        }
    },
    {
        path: 'invoice',
        component: InvoiceComponent
    }
];

@NgModule({
    declarations: [
        WorkComponent,
        WorksComponent,
        RecordsSelectedBarComponent,
        InvoiceComponent,
        InvoicesComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule
    ],
    providers: [
        InvoiceService
    ]
})

export class WorkAndInvoiceModule {
}
