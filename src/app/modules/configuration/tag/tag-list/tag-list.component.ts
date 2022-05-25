import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { TagService } from '../tag.service';
import { TagFormDialogComponent } from '../tag-form/tag-form.component';
import { AppService } from 'app/app.service';

@Component({
    selector: 'tag-list',
    templateUrl: './tag-list.component.html',
    // styleUrls: ['./tag-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class TagListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    tags: any;
    user: any;
    dataSource: FilesDataSource | null;
    // 'updatedby', ,'createdon', 'updatedon', 
    displayedColumns = ['name', 'purpose', 'created_by', 'created_date', 'updated_by', 'updated_date', 'buttons'];
    selectedTag: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {TagService} _tagService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _tagService: TagService,
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
        this.dataSource = new FilesDataSource(this._tagService);

        this._tagService.onTagChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(tags => {
                this.tags = tags;

                this.checkboxes = {};
                tags.map(tag => {
                    this.checkboxes[tag._id] = false;
                });
            });

        this._tagService.onSelectedTagChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedTag => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedTag.includes(id);
                }
                this.selectedTag = selectedTag;
            });

        /* this._tagService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            }); */

        this._tagService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._tagService.deselectTag();
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
     * Edit tag
     *
     * @param tag
     */
    editTag(tag): void {
        this.dialogRef = this._matDialog.open(TagFormDialogComponent, {
            panelClass: 'form-dialog',
            data: {
                tag: tag,
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                // const actionType: string = response[0];
                // const formData: FormGroup = response[1];
                // switch (actionType) {
                //     /**
                //      * Save
                //      */
                //     case 'save':

                //         this._tagService.updateTag(formData.getRawValue());

                //         break;
                //     /**
                //      * Delete
                //      */
                //     case 'delete':

                //         this.deleteTag(tag);

                //         break;
                // }
            });
    }

    /**
     * Delete Tag
     */
    deleteTag(tag): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._tagService.deleteTag(tag);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param tagId
     */
    onSelectedChange(tagId): void {
        this._tagService.toggleSelectedTag(tagId);
    }

    /**
     * Toggle star
     *
     * @param tagId
     */
    toggleStar(tagId): void {
        if (this.user.starred.includes(tagId)) {
            this.user.starred.splice(this.user.starred.indexOf(tagId), 1);
        }
        else {
            this.user.starred.push(tagId);
        }

        this._tagService.updateUserData(this.user);
    }

    disableTag(tag): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                tag.is_active = false;
                tag.updated_by = this._appService.user._id;
                tag.updated_date = new Date();
                this._tagService.updateTag(tag);
            }
            this.confirmDialogRef = null;
        });

    }

    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._tagService.getTag({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {TagService} _tagService
     */
    constructor(
        private _tagService: TagService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._tagService.onTagChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
