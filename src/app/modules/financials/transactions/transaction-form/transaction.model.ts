
export class TransactionModel {
    _id: string;
    category: string;
    source: string;
    sourceId: string;
    mode: string;
    date: Date;
    amount: number;
    status: string;

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?) {
        this._id = data._id;
        this.category = data.category;
        this.source = data.source;
        this.sourceId = data.sourceId;
        this.mode = data.mode;
        this.date = new Date(data.date) || new Date();
        this.amount = data.amount;
        this.status = data.status;
    }
}
