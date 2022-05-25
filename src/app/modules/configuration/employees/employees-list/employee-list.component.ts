import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EmployeesService } from '../employees.service';
import { EmployeeFormDialogComponent } from '../employees-form/employee-form.component';
import { AppService } from 'app/app.service';

@Component({
    selector: 'employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class EmployeeListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    employees: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['firstname', 'gender', 'email', 'mobile', 'phone', 'designation', 'company', 'buttons'];
    selectedEmployees: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EmployeesService} _employeesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _employeesService: EmployeesService,
        public _matDialog: MatDialog,
        public _appService: AppService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this._employeesService);

        this._employeesService.onEmployeesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(employees => {
                this.employees = employees;

                this.checkboxes = {};
                employees.map(employee => {
                    this.checkboxes[employee._id] = false;
                });
            });

        this._employeesService.onSelectedEmployeesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedEmployees => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedEmployees.includes(id);
                }
                this.selectedEmployees = selectedEmployees;
            });

        /* this._employeesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            }); */

        this._employeesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._employeesService.deselectEmployees();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit employee
     *
     * @param employee
     */
    editEmployee(employee): void {
        this.dialogRef = this._matDialog.open(EmployeeFormDialogComponent, {
            panelClass: 'form-dialog',
            data: {
                employee: employee,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                // const actionType: string = response[0];
                // const formData: FormGroup = response[1];
                // switch (actionType) {
                //     /**
                //      * Save
                //      */
                //     case 'save':

                //         this._employeesService.updateEmployee(formData.getRawValue());

                //         break;
                //     /**
                //      * Delete
                //      */
                //     case 'delete':

                //         this.deleteEmployee(employee);

                //         break;
                // }
            });
    }

    /**
     * Delete Employee
     */
    deleteEmployee(employee): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._employeesService.deleteEmployee(employee);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param employeeId
     */
    onSelectedChange(employeeId): void {
        this._employeesService.toggleSelectedEmployee(employeeId);
    }

    /**
     * Toggle star
     *
     * @param employeeId
     */
    toggleStar(employeeId): void {
        if (this.user.starred.includes(employeeId)) {
            this.user.starred.splice(this.user.starred.indexOf(employeeId), 1);
        }
        else {
            this.user.starred.push(employeeId);
        }

        this._employeesService.updateUserData(this.user);
    }

    disableEmployee(employee): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                employee.is_active = false;
                employee.updated_by = this._appService.user._id;
                employee.updated_date = new Date();
                this._employeesService.updateEmployee(employee);
            }
            this.confirmDialogRef = null;
        });

    }

    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._employeesService.getEmployees({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {EmployeesService} _employeesService
     */
    constructor(
        private _employeesService: EmployeesService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._employeesService.onEmployeesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
