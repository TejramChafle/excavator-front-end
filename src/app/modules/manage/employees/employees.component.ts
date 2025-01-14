import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, Subject } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { MODULE } from 'app/app.config';
import { DataService } from 'app/data.service';
import { Router } from '@angular/router';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppService } from 'app/app.service';
import { AttendanceFormComponent } from '../attendances/attendance-form/attendance-form.component';

@Component({
    selector: 'employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class EmployeesComponent implements OnInit {
    dataSource: Array<any>;
    tableColumns: Array<string>;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    attendanceFormRef: MatDialogRef<AttendanceFormComponent>;

    constructor(
        public _dataService: DataService,
        public _matDialog: MatDialog,
        private _router: Router,
        private _appService: AppService
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
        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if ( !this.dataSource )
                {
                    return;
                }
                this._dataService.onSearchTextChanged.next(this.filter.nativeElement.value);
            });

        this.tableColumns = MODULE.employees.tableColumns;
        this._dataService.onRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.dataSource = response.docs;
                this._dataService.employees = this.dataSource;
                localStorage.setItem('employees', JSON.stringify(this.dataSource));
                console.log('dataSource: ', this.dataSource);
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
     * Edit Employee
     *
     * @param employee
     */
    editEmployee(employee) {
        this._router.navigate(['/manage/employee/', employee._id], { state: employee });
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
                this._dataService.deleteRecord(MODULE.employees.backendRoute, employee);
            }
            this.confirmDialogRef = null;
        });
    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._dataService.getRecords(MODULE.customers.backendRoute, { page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }

    /**
     * Update the enable/disable status of employee
     */
     updateEnableDisable(employee): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

         this.confirmDialogRef.componentInstance.confirmMessage = employee.active
             ? 'Are you sure you want to disable? The disabled employee will not appear is attendance and payment list.'
             : 'Are you sure you want to enable. The enabled employee will appear on attendance and payment list.';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (employee.active) {
                    employee.disabledOn = new Date();
                } else {
                    employee.enabledOn = new Date();
                }
                employee.updatedBy = this._appService.user._id;
                employee.active = !employee.active;
                this._dataService.updateRecord(MODULE.employees.backendRoute, employee);
            }
            this.confirmDialogRef = null;
        });
    }


    markAttendace(employee) {
        this.attendanceFormRef = this._matDialog.open(AttendanceFormComponent, {
            disableClose: false,
            panelClass: 'event-form-dialog',
            data: {
                employee
            }
        });

        this.attendanceFormRef.afterClosed().subscribe(result => {
            console.log({'attendance result': result});
            if (result) {
                this.attendanceFormRef = null;
            }
        });
    }

    // For view attendance, navigate to calender to show the attendance in calender view
    onViewAttendace(employee) {
        this._router.navigate(['/manage/attendances', employee._id]);
    }
}
