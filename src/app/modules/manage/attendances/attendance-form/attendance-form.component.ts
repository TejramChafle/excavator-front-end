import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';

import { MatColors } from '@fuse/mat-colors';
import { AttendanceModel } from '../attendance.model';

@Component({
    selector: 'attendance-form',
    templateUrl: './attendance-form.component.html',
    styleUrls: ['./attendance-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AttendanceFormComponent {
    action: string;
    event: CalendarEvent;
    eventForm: FormGroup;
    dialogTitle: string;
    presetColors = MatColors.presets;

    /**
     * Constructor
     *
     * @param {MatDialogRef<AttendanceFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<AttendanceFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        this.event = _data.event;
        this.action = _data.action;

        console.log({_data});

        if (this.action === 'edit') {
            this.dialogTitle = this.event.title;
        }
        /* else {
            this.dialogTitle = 'New Event';
            this.event = new AttendanceModel({
                start: _data.date,
                end: _data.date
            });
        } */

        if (_data.employee) {
            this.event = new AttendanceModel({
                start: new Date(),
                end: new Date(),
                title: _data.employee.firstName + ' ' + _data.employee.lastName,
                allDay: false
            });
        }

        this.eventForm = this.createEventForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createEventForm(): FormGroup {
        return new FormGroup({
            title: new FormControl(this.event.title),
            start: new FormControl(this.event.start),
            end: new FormControl(this.event.end),
            allDay: new FormControl(this.event.allDay),
            color: this._formBuilder.group({
                primary: new FormControl(this.event.color.primary),
                secondary: new FormControl(this.event.color.secondary)
            }),
            meta:
                this._formBuilder.group({
                    location: new FormControl(this.event.meta.location),
                    notes: new FormControl(this.event.meta.notes)
                }),
            startTime: new FormControl('08:00'),
            endTime: new FormControl('18:00')
        });
    }

    // Set the end date by default to same date on change of start date
    onChangeStartDate(event) {
        this.eventForm.patchValue({
            end: new Date(event.value.toDate())
        });
    }
}
