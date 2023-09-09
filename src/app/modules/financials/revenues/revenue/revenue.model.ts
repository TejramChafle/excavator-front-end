
export class Revenue {
    _id: string;
    active: boolean;
    date: Date;
    source: string;
    description: string;
    customer: any;
    transaction: string;
    amount: string;
    mode: string;

    /**
     * Constructor
     *
     * @param revenue
     */
    constructor(revenue?) {
        this._id = revenue._id || null;
        this.active = revenue.active || true;

        this.date = revenue.date;
        this.source = revenue.source;
        this.description = revenue.description;
        this.customer = revenue.customer;
        if (revenue.transaction) {
            this.transaction = revenue.transaction._id;
            this.amount = revenue.transaction.amount;
            this.mode = revenue.transaction.mode;
        }
    }
}
