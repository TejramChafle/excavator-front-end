import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ClientService } from '../client.service';
import { ClientFormDialogComponent } from '../client-form/client-form.component';
import { AppService } from 'app/app.service';

@Component({
    selector: 'client-list',
    templateUrl: './client-list.component.html',
    // styleUrls: ['./client-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class ClientListComponent implements OnInit, OnDestroy {
    @ViewChild('dialogContent', { static: false })
    dialogContent: TemplateRef<any>;

    clients: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['name', 'address', 'description', 'created_by', 'created_date', 'updated_by', 'updated_date', 'buttons'];
    selectedClient: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ClientService} _clientService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _clientService: ClientService,
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
        this.dataSource = new FilesDataSource(this._clientService);

        this._clientService.onClientChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(clients => {
                this.clients = clients;

                this.checkboxes = {};
                clients.map(client => {
                    this.checkboxes[client._id] = false;
                });
            });

        this._clientService.onSelectedClientChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedClient => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedClient.includes(id);
                }
                this.selectedClient = selectedClient;
            });

        /* this._clientService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            }); */

        this._clientService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._clientService.deselectClient();
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
     * Edit client
     *
     * @param client
     */
    editClient(client): void {
        this.dialogRef = this._matDialog.open(ClientFormDialogComponent, {
            panelClass: 'form-dialog',
            data: {
                client: client,
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
     * Delete Client
     */
    deleteClient(client): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._clientService.deleteClient(client);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param clientId
     */
    onSelectedChange(clientId): void {
        this._clientService.toggleSelectedClient(clientId);
    }

    /**
     * Toggle star
     *
     * @param clientId
     */
    toggleStar(clientId): void {
        if (this.user.starred.includes(clientId)) {
            this.user.starred.splice(this.user.starred.indexOf(clientId), 1);
        }
        else {
            this.user.starred.push(clientId);
        }

        this._clientService.updateUserData(this.user);
    }

    disableClient(client): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to disable?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                client.is_active = false;
                client.updated_by = this._appService.user._id;
                client.updated_date = new Date();
                this._clientService.updateClient(client);
            }
            this.confirmDialogRef = null;
        });

    }

    // Load data on page change
    onPageChange(page) {
        console.log(page);
        this._clientService.getClient({ page: page.pageIndex + 1, limit: page.pageSize }).then(result => {
            console.log('on page change : ', result);
        });
    }
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ClientService} _clientService
     */
    constructor(
        private _clientService: ClientService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._clientService.onClientChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
