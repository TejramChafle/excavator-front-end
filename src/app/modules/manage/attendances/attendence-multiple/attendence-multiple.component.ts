import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MODULE } from '../../../../app.config';
import { AppService } from 'app/app.service';
import { DataService } from 'app/data.service';

@Component({
    selector: 'attendence-multiple',
    templateUrl: './attendence-multiple.component.html',
    styleUrls: ['./attendence-multiple.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AttendanceMultipleComponent {
    employees: any[];

    /**
     * Constructor
     *
     * @param {MatDialogRef<AttendanceMultipleComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<AttendanceMultipleComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _appService: AppService,
        private _dataService: DataService
    ) {
        this.employees = _data.employees;

        console.log({_data});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onSubmit(selectedEmployees) {
        console.log(selectedEmployees);

        let param = [];
        selectedEmployees.forEach((emp) => {
            param.push({
                employee: emp._id,
                startDate: new Date(),
                endDate: new Date(),
                startTime: "8:00",
                endTime: "18:00",
                allDay: false,
                location: null,
                notes: null,
                business: this._appService.user.business._id,
                createdBy: this._appService.user._id,
                updatedBy: this._appService.user._id
            });
        })
        this._dataService.createRecordButNoRefresh(MODULE.attendances.backendRoute + MODULE.attendances.path.multiAttendence, { attendence: param }).then((response) => {
            console.log({ response });
            this._appService.handleMessage(
                'Marked attendance of selected employees',
                'Success!'
            );
            this.matDialogRef.close(true);
        });
    }
}
