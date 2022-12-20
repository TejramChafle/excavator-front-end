
export class Expense {
    _id: string;
    active: boolean;
    date: Date;
    purpose: string;
    place: string;
    description: string;
    employee: string;
    transaction: string;
    amount: string;
    mode: string;

    /**
     * Constructor
     *
     * @param expense
     */
    constructor(expense?) {
        this._id = expense._id || null;
        this.active = expense.active || true;

        this.date = expense.date;
        this.purpose = expense.purpose;
        this.place = expense.place;
        this.description = expense.description;
        this.employee = expense.employee;
        if (expense.transaction) {
            this.transaction = expense.transaction._id;
            this.amount = expense.transaction.amount;
            this.mode = expense.transaction.mode;
        }
    }
}
