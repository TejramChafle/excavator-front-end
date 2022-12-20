import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../material.module';
import { DataService } from 'app/data.service';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionFormComponent } from './transactions/transaction-form/transaction-form.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ExpenseComponent } from './expenses/expense/expense.component';
import { BorrowingComponent } from './borrowings/borrowing/borrowing.component';
import { BorrowingsComponent } from './borrowings/borrowings.component';

const routes: Routes = [
    {
        path: 'transactions',
        component: TransactionsComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'transactions' }
    },
    {
        path: 'expenses',
        component: ExpensesComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'expenses' }
    },
    {
        path: 'expense',
        component: ExpenseComponent
    },
    {
        path: 'expense/:id',
        component: ExpenseComponent
    },
    {
        path: 'borrowings',
        component: BorrowingsComponent,
        resolve: {
            recordsWithPagination: DataService
        },
        data : { module : 'borrowings' }
    },
    {
        path: 'borrowing',
        component: BorrowingComponent
    },
    {
        path: 'borrowing/:id',
        component: BorrowingComponent
    }
];

@NgModule({
    declarations: [
        TransactionsComponent,
        TransactionFormComponent,
        ExpensesComponent,
        ExpenseComponent,
        BorrowingComponent,
        BorrowingsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule
    ],
    entryComponents: [
        TransactionFormComponent
    ]
})

export class FinancialsModule {
}
