
export class Borrowing {
    _id: string;
    active: boolean;
    date: Date;
    scheduledReturnDate: Date;
    purpose: string;
    type: string;
    description: string;
    person: any;
    transaction: string;
    amount: string;
    mode: string;

    /**
     * Constructor
     *
     * @param borrowing
     */
    constructor(borrowing?) {
        this._id = borrowing._id || null;
        this.active = borrowing.hasOwnProperty('active') ? borrowing.active : true;

        this.date = borrowing.date;
        this.scheduledReturnDate = borrowing.scheduledReturnDate;
        this.purpose = borrowing.purpose;
        this.type = borrowing.type;
        this.description = borrowing.description;
        this.person = borrowing.person;
        if (borrowing.transaction) {
            this.transaction = borrowing.transaction._id;
            this.amount = borrowing.transaction.amount;
            this.mode = borrowing.transaction.mode;
        }
    }
}
