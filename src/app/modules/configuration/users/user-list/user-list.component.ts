import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { UsersService } from '../users.service';
import { UserFormDialogComponent } from '../user-form/user-form.component';
import { AppService } from 'app/app.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class UserListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    users: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['avatar', 'name', 'role', 'designation', 'email', 'phone', 'designation', 'active', 'actions'];
    // selectedUsers: any[];
    // checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _usersService: UsersService,
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
        this.dataSource = new FilesDataSource(this._usersService);

        this._usersService.onUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(users => {
                this.users = users.docs;
                console.log({ users });
                /* this.checkboxes = {};
                users.map(user => {
                    this.checkboxes[user._id] = false;
                }); */
            });

        /* this._usersService.onSelectedUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsers => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedUsers.includes(id);
                }
                this.selectedUsers = selectedUsers;
            }); */

        /* this._usersService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            }); */

        /* this._usersService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._usersService.deselectUsers();
            }); */

        console.log('this.users : ', this.users, 'dataSource: ', this.dataSource);
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
     * Edit user
     *
     * @param user
     */
    editUser(user): void {
        this.dialogRef = this._matDialog.open(UserFormDialogComponent, {
            panelClass: 'user-form-dialog',
            data: {
                user: user,
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

                //         this._usersService.updateUser(formData.getRawValue());

                //         break;
                //     /**
                //      * Delete
                //      */
                //     case 'delete':

                //         this.deleteUser(user);

                //         break;
                // }
            });
    }

    /**
     * Delete User
     */
    deleteUser(user): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._usersService.deleteUser(user);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param userId
     */
    /* onSelectedChange(userId): void {
        this._usersService.toggleSelectedUser(userId);
    } */

    /**
     * Toggle star
     *
     * @param userId
     */
    toggleStar(userId): void {
        if (this.user.starred.includes(userId)) {
            this.user.starred.splice(this.user.starred.indexOf(userId), 1);
        }
        else {
            this.user.starred.push(userId);
        }

        this._usersService.updateUserData(this.user);
    }

    disableUser(user): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                user.is_active = false;
                user.updated_by = this._appService.user._id;
                user.updated_date = new Date();
                this._usersService.updateUser(user);
            }
            this.confirmDialogRef = null;
        });

    }


    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._usersService.getUsers({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {UsersService} _usersService
     */
    constructor(
        private _usersService: UsersService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._usersService.onUsersChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
