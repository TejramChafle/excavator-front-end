
import { DataSource } from '@angular/cdk/collections';
import { DataService } from 'app/data.service';
import { Observable } from 'rxjs';

export class FilesDataSource extends DataSource<any> {
    /**
     * Constructor
     *
     * @param {DataService} _dataService
     */
    constructor(
        private _dataService: DataService
    ) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._dataService.onRecordsChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}