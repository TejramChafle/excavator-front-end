import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../../../../../data.service';
import { AppService } from '../../../../../app.service';

@Component({
    selector: 'contacts-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})

export class ContactsMainSidebarComponent implements OnInit, OnDestroy {
    user: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     */
    constructor(
        private _dataService: DataService,
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
        this.filterBy = this._dataService.filterBy || 'all';

        this._dataService.onRecordDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
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
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void {
        this.filterBy = filter;
        let data: any = {};
        switch (filter) {
            case 'all' || null:
                data.contactType = null;
                break;
            case 'business':
                data.contactType = 'Business';
                break;
            case 'employee':
                data.contactType = 'Employee';
                break;
            case 'starred':
                data.isStarred = true;
                break;
            default:
                data.contactType = null;
        }
        this._dataService.onFilterChanged.next(data);
    }
}
