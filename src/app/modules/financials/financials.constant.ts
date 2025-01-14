
// Type of transaction: INCOME, SPENDING, BORROWING, LENDING
export const TYPE_OF_TRANSACTION = {
    INCOME: 'Income',
    SPENDING: 'Spending',
    BORROWING: 'Borrowing',
    LENDING: 'Lending'
};

// Payment mode: CASH | ONLINE ACCOUNT TRANSFER | BANK ACCOUNT TRANSFER, UPI, CREDIT/DEBIT CARD, PAYTM, CHEQUE, RTGS, NEFT, DD, OTHER-EWALLET
export const PAYMENT_MODE = {
    CASH: 'Cash',
    UPI:'UPI (Unified Payments Interface)',
    CHEQUE: 'Cheque',
    RTGS: 'RTGS (Real Time Gross Settlement)',
    BANK_ACCOUNT_TRANSFER: 'Bank transfer',
    ONLINE_BANKING: 'Online Transfer',
    CREDIT_DEBIT_CARD: 'Debit/Credit Card',
    E_WALLET: 'Mobile wallets (PayTM/PhonePay etc.)',
    NEFT: 'NEFT (National Electronic Funds Transfer)',
    IMPS: 'IMPS (Immediate Payment Service)',
    DD: 'Demad Draft',
    OTHER: 'Other'
};

// Payment status: PAID | PDC | FAILED | IN PROGRESS | AWAITING | CANCELED | PARTIALLY PAID | SCHEDULED | UNPAID
export const PATMENT_STATUS = {
    PAID: 'Paid',
    CANCELED: 'Canceled',
    PARTIALLY_PAID: 'Partially Paid',
    SCHEDULED: 'Scheduled',
    UNPAID: 'Unpaid',
    IN_PROGRESS: 'In progress',
    AWAITING: 'Awaiting'
};

