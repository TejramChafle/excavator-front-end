import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FuelResourceService } from './fuel-resource.service';
import { FuelResourceFormDialogComponent } from './fuel-resource-form/fuel-resource-form.component';

@Component({
    selector: 'fuel-resource',
    templateUrl: './fuel-resource.component.html',
    styleUrls: ['./fuel-resource.theme.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class FuelResourceComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedFuelResource: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuelResourceService} _resourceService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _resourceService: FuelResourceService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    ) {
        // Set the defaults
        this.searchInput = new FormControl('');

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
        this._resourceService.onSelectedFuelResourceChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedFuelResource => {
                this.hasSelectedFuelResource = selectedFuelResource.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._resourceService.onSearchTextChanged.next(searchText);
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
     * New resource
     */
    newFuelResource(): void {
        this.dialogRef = this._matDialog.open(FuelResourceFormDialogComponent, {
            panelClass: 'form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            // this._resourceService.updateFuelResource(response.getRawValue());
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
