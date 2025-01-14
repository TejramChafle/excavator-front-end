import { MatChipInputEvent } from '@angular/material/chips';
import { FuseUtils } from '@fuse/utils';

export class FuelLog {
    _id: string;
    active: boolean;

    // log info
    fuel: string;
    petrolPump: string;
    date: Date;
    invoiceId: string;
    invoicePhoto: string;

    // Volume info
    rate: number;
    volume: number;
    total: number;

    // Other info
    vehicle: string;
    employee: string;
    // transaction: string;

    /**
     * Constructor
     *
     * @param log
     */
    constructor(log?) {
        this._id = log._id || null;
        this.active = log.active || true;

        this.fuel = log.fuel;
        this.petrolPump = log.petrolPump ? log.petrolPump._id : null;
        this.date = log.date;
        this.invoiceId = log.invoiceId;
        this.invoicePhoto = log.invoicePhoto;

        this.rate = log.rate;
        this.volume = log.volume;
        this.total = log.total;
        this.vehicle = log.vehicle ? log.vehicle._id : null;
        this.employee = log.employee ? log.employee._id : null;

        // this.transaction = log.transaction;
    }
}
