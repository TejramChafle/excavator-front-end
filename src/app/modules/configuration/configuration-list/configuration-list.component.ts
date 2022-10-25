import { Component, Input, OnChanges, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

// import { ServiceFormDialogComponent } from '../service-form/service-form.component';
import { AppService } from 'app/app.service';
import { DataService } from 'app/data.service';
import { MODULE } from 'app/app.config';
import { ConfigurationFormDialogComponent } from '../configuration-form/configuration-form.component';

@Component({
    selector: 'configuration-list',
    templateUrl: './configuration-list.component.html',
    styleUrls: ['./configuration-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ConfigurationListComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;
    
    service: any;
    dataSource: Array<any>;
    tableColumns: Array<string>;
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    @Input('module') module: string;

    /**
     * Constructor
     *
     * @param {DataService} _dataService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _matDialog: MatDialog,
        public _appService: AppService,
        public _dataService: DataService
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
        this._dataService.onRecordsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.dataSource = response.docs;
                console.log('dataSource: ', this.dataSource);
            });
        // Set the columns for the rendered module
        this.tableColumns = MODULE[this.module].tableColumns;
    }
    
    /**
     * On changes
     */
    ngOnChanges(changes): void {
        this.tableColumns = MODULE[changes.module.currentValue].tableColumns;
        console.log('tableColumns: ', this.tableColumns);
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
     * Edit Configuration
     *
     * @param configuration
     */
    editConfiguration(configuration): void {
        this.dialogRef = this._matDialog.open(ConfigurationFormDialogComponent, {
            panelClass: 'configuration-form-dialog',
            data: {
                data: configuration,
                action: 'edit',
                module: this.module
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
            });
    }

    /**
     * Delete Configuration
     */
    deleteConfiguration(configuration): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._dataService.deleteRecord(MODULE[this.module].backendRoute, configuration);
            }
            this.confirmDialogRef = null;
        });

    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._dataService.getRecords(MODULE[this.module].backendRoute, { page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}
