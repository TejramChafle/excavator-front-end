export class Work {
    _id: string;
    active: boolean;

    service: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    customer: string;
    supervisor: string;

    site: string;
    workers: Array<string>;
    rate: number;
    quantity: string;
    total: string;
    description: string;
    invoice: string;

    /**
     * Constructor
     *
     * @param work
     */
    constructor(work?) {
        this._id = work._id || null;
        this.active = work.active || true;

        this.service = work.service;
        this.date = work.date;
        this.startTime = work.startTime;
        this.endTime = work.endTime;
        this.customer = work.customer;
        this.supervisor = work.supervisor;

        this.site = work.site;
        this.workers = work.workers;
        this.rate = work.rate;
        this.quantity = work.quantity;
        this.total = work.total;
        this.description = work.description;
        this.invoice = work.invoice;
    }
}
