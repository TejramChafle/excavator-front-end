import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { CalendarEventFormDialogComponent } from 'app/main/apps/calendar/event-form/event-form.component';
import { CalendarService } from './calendar.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'app/data.service';
import { AttendanceFormComponent } from '../attendance-form/attendance-form.component';
import { AttendanceModel } from '../attendance.model';
import { AttendanceMultipleComponent } from '../attendance-multiple/attendance-multiple.component';

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class CalendarComponent implements OnInit {
    actions: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    events: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    viewDate: Date;
    employee: any;
    employees: any[];

    constructor(
        private _matDialog: MatDialog,
        private _calendarService: CalendarService,
        private _activatedRoute: ActivatedRoute,
        private _dataService: DataService
    ) {
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = { date: startOfDay(new Date()) };

        this.actions = [
            /* {
                label: '<i class="material-icons s-16">edit</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            }, */
            {
                label: '<i class="material-icons s-16">delete</i>',
                onClick: ({ event }: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];

        /**
         * Get events from service/server
         */
        this.setEvents();
 
        this.employees = this._dataService.employees || JSON.parse(localStorage.getItem('employees'));
        console.log(this.employees);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        /**
         * Watch re-render-refresh for updating db
         */
        this.refresh.subscribe(updateDB => {
            if (updateDB) {
                this._calendarService.updateEvents(this.events);
            }
        });

        this._calendarService.onEventsUpdated.subscribe(events => {
            this.setEvents();
            this.refresh.next();
        });

        // Subscribe to route change
        this._activatedRoute.paramMap.subscribe((param) => {
            this._dataService.getRecordData('employee', param.get('id')).then((response) => {
                this.employee = response;
            })
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set events
     */
    setEvents(): void {
        // filter the list to avoid the null employees
        const filtered = this._calendarService.events.filter((event) => {
            return event.employee !== null;
        })
        this.events = filtered.map(item => {
            item.actions = this.actions;
            return new AttendanceModel({
                start: new Date(item.startDate),
                end: new Date(item.endDate),
                title: item.employee.firstName + ' ' + item.employee.lastName,
                allDay: item.allDay,
                meta: {
                    location: item.location,
                    notes: item.notes,
                    _id: item._id
                },
                color: {
                    primary: '#' + item.employee._id.substr(6, 6)
                },
                actions: this.actions
            });
        });
    }

    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({ header, body }): void {
        /**
         * Get the selected day
         */
        const _selectedDay = body.find((_day) => {
            return _day.date.getTime() === this.selectedDay.date.getTime();
        });

        if (_selectedDay) {
            /**
             * Set selected day style
             * @type {string}
             */
            _selectedDay.cssClass = 'cal-selected';
        }

    }

    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: CalendarMonthViewDay): void {
        const date: Date = day.date;
        const events: CalendarEvent[] = day.events;

        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            }
            else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        this.refresh.next();
    }

    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        // console.warn('Dropped or resized', event);
        this.refresh.next(true);
    }

    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteRecord('employee/attendance', event.meta).then((response) => {
                    this.refresh.next(true);
                })
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
    editEvent(action: string, event: CalendarEvent): void {
        const eventIndex = this.events.indexOf(event);

        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: event,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                        this.refresh.next(true);
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteEvent(event);
                        break;
                }
            });
    }

    /**
     * Add Event
     */
    addEvent(): void {
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                action: 'new',
                date: this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }
                const newEvent = response.getRawValue();
                newEvent.actions = this.actions;
                this.events.push(newEvent);
                this.refresh.next(true);
            });
    }

    // Add the attendace of employee
    onClickAdd() {
        let attendanceFormRef = this._matDialog.open(AttendanceFormComponent, {
            disableClose: false,
            panelClass: 'event-form-dialog',
            data: {
                employee: this.employee
            }
        });

        attendanceFormRef.afterClosed().subscribe(result => {
            if (result) {
                attendanceFormRef = null;
            }
        });
    }

    // This will mark the attence of multiple selected employees for day
    markAttendance() {
        let attendanceFormRef = this._matDialog.open(AttendanceMultipleComponent, {
            disableClose: false,
            panelClass: 'event-form-dialog',
            data: {
                employees: this._dataService.employees || JSON.parse(localStorage.getItem('employees'))
            }
        });

        attendanceFormRef.afterClosed().subscribe(result => {
            if (result) {
                attendanceFormRef = null;
                this.refresh.next(true);
            }
        });
    }

    // Based on selection of the employee from dropdown options, get the attendance records for the selected month
    onChangeEmployee(event) {
        this._calendarService.getEvents(event.value._id);
    }
}


