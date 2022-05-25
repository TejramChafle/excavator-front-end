import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Employee } from '../employee.model';
import { EmployeesService } from '../employees.service';
import { AppService } from 'app/app.service';

@Component({
    selector: 'employees-employee-form-dialog',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class EmployeeFormDialogComponent {
    action: string;
    employee: Employee;
    employeeForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<EmployeeFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<EmployeeFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _employeesService: EmployeesService,
        private _appService: AppService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit Employee';
            this.employee = _data.employee;
        }
        else {
            this.dialogTitle = 'New Employee';
            this.employee = new Employee({});
        }

        this.employeeForm = this.createEmployeeForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create employee form
     *
     * @returns {FormGroup}
     */
    createEmployeeForm(): FormGroup {
        return this._formBuilder.group({
            _id:        [this.employee._id],
            firstname:  [this.employee.firstname],
            lastname:   [this.employee.lastname],
            // avatar:     [this.employee.avatar],
            gender:     [this.employee.gender],
            email:      [this.employee.email],
            mobile:     [this.employee.mobile],
            phone:      [this.employee.phone],
            company:    [this.employee.company],
            designation: [this.employee.designation],
            address:    [this.employee.address],
            birthday:   [this.employee.birthday],
            description: [this.employee.description],
            tag: [this.employee.tag]
        });
    }


    // Do save/update employee information on click of add/save button
    onSubmit(formData): void {
        // If the employee id exist then update and save the employee
        if (formData._id) {
            formData.updated_by = this._appService.user._id;
            formData.updated_date = new Date();
            this._employeesService.updateEmployee(formData).then((response) => {
                this._appService.handleMessage(response.message || 'Employee information updated successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        } else {
            formData.created_by = this._appService.user._id;
            formData.updated_by = this._appService.user._id;
            formData.created_date = new Date();
            formData.updated_date = new Date();
            this._employeesService.createEmployee(formData).then((response) => {
                this._appService.handleMessage(response.message || 'New employee created successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        }
    }
}
