import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { TagService } from './tag.service';
import { TagFormDialogComponent } from './tag-form/tag-form.component';

@Component({
    selector: 'tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.theme.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class TagComponent implements OnInit, OnDestroy {
    dialogRef: any;
    hasSelectedTag: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TagService} _tagService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _tagService: TagService,
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
        this._tagService.onSelectedTagChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTag => {
                this.hasSelectedTag = selectedTag.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._tagService.onSearchTextChanged.next(searchText);
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
     * New tag
     */
    newTag(): void {
        this.dialogRef = this._matDialog.open(TagFormDialogComponent, {
            panelClass: 'form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this._tagService.updateTag(response.getRawValue());
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
