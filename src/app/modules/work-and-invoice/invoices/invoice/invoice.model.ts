
export class Invoice {
    _id: string;
    works: Array<any>;
    invoiceTo: string;
    invoiceToName: string;
    business: string;
    invoiceFromName: string;
    date: string;
    invoiceBrief: string;
    discount: number;
    gstPercent: number;
    gstAmount: number;
    tdsPercent: number;
    tdsAmount: number;
    invoicedAmount: number;
    description: string;
    status: string;
    expectedClearanceDate: Date;
    transaction: any;
    statusHistory: [];
    /**
     * Constructor
     *
     * @param invoice
     */
    constructor(invoice?) {
        this._id = invoice._id;
        this.works = invoice.works;
        this.invoiceTo = invoice.invoiceTo;
        this.invoiceToName = invoice.invoiceToName;
        this.business = invoice.business;
        this.invoiceFromName = invoice.invoiceFromName;
        this.invoiceBrief = invoice.invoiceBrief;
        this.discount = invoice.discount;
        this.gstPercent = invoice.gstPercent;
        this.gstAmount = invoice.gstAmount;
        this.tdsPercent = invoice.tdsPercent;
        this.tdsAmount = invoice.tdsAmount;
        this.invoicedAmount = invoice.invoicedAmount;
        this.description = invoice.description;
        this.status = invoice.status;
        this.expectedClearanceDate = invoice.expectedClearanceDate;
        this.transaction = invoice.transaction;
        this.statusHistory = invoice.statusHistory;
        this.date = invoice.date;
    }
}
