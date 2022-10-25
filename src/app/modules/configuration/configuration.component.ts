import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DataService } from 'app/data.service';
import { MODULE } from 'app/app.config';
import { ConfigurationFormDialogComponent } from './configuration-form/configuration-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'configuration',
    templateUrl: './configuration.component.html',
    styleUrls: ['./configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ConfigurationComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedServices: boolean;
    searchInput: FormControl;
    module: string;
    pageTitle: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ServicesService} _servicesService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _dataService: DataService,
        private _activatedRoute: ActivatedRoute
    ) {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Read module from route
        this._activatedRoute.params.subscribe((params) => {
            this.module = params.module;
            this.pageTitle = MODULE[params.module].pageTitle;
            console.log('params.module: ' + params.module);
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._dataService.onSearchTextChanged.next(searchText);
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
     * New configuration
     */
     newConfiguration(): void {
        this.dialogRef = this._matDialog.open(ConfigurationFormDialogComponent, {
            panelClass: 'configuration-form-dialog',
            data: {
                action: 'new',
                module: this.module
            }
        });
        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            console.log({response});
            if (!response) {
                return;
            }
        });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
