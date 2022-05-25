import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { FuelResourceService } from '../../fuel-resource/fuel-resource.service';
import { FuelResourceFormDialogComponent } from '../../fuel-resource/fuel-resource-form/fuel-resource-form.component';
import { AppService } from 'app/app.service';

@Component({
    selector: 'fuel-resource-list',
    templateUrl: './fuel-resource-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class FuelResourceListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    resources: any;
    user: any;
    dataSource: FilesDataSource | null;
    // 'updatedby', ,'createdon', 'updatedon', 
    displayedColumns = ['name', 'place', 'created_by', 'created_date', 'updated_by', 'updated_date', 'buttons'];
    selectedFuelResource: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuelResourceService} _resourceService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _resourceService: FuelResourceService,
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
        this.dataSource = new FilesDataSource(this._resourceService);

        this._resourceService.onFuelResourceChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(resources => {
                this.resources = resources;

                this.checkboxes = {};
                resources.map(resource => {
                    this.checkboxes[resource._id] = false;
                });
            });

        this._resourceService.onSelectedFuelResourceChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedFuelResource => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedFuelResource.includes(id);
                }
                this.selectedFuelResource = selectedFuelResource;
            });

        /* this._resourceService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            }); */

        this._resourceService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._resourceService.deselectFuelResource();
            });

        console.log('this.dataSource : ', this.dataSource);    
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
     * Edit resource
     *
     * @param resource
     */
    editFuelResource(resource): void {
        this.dialogRef = this._matDialog.open(FuelResourceFormDialogComponent, {
            panelClass: 'form-dialog',
            data: {
                resource: resource,
                action: 'edit'
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
     * Delete Fuel Resource
     */
    deleteFuelResource(resource): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._resourceService.deleteFuelResource(resource);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param resourceId
     */
    onSelectedChange(resourceId): void {
        this._resourceService.toggleSelectedFuelResource(resourceId);
    }

    /**
     * Toggle star
     *
     * @param resourceId
     */
    toggleStar(resourceId): void {
        if (this.user.starred.includes(resourceId)) {
            this.user.starred.splice(this.user.starred.indexOf(resourceId), 1);
        }
        else {
            this.user.starred.push(resourceId);
        }

        this._resourceService.updateUserData(this.user);
    }

    disableFuelResource(resource): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                resource.is_active = false;
                resource.updated_by = this._appService.user._id;
                resource.updated_date = new Date();
                this._resourceService.updateFuelResource(resource);
            }
            this.confirmDialogRef = null;
        });

    }

    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._resourceService.getFuelResource({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {FuelResourceService} _resourceService
     */
    constructor(
        private _resourceService: FuelResourceService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._resourceService.onFuelResourceChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
