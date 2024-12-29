export const BASE_URL = 'http://localhost:3000/';
// export const BASE_URL = 'https://excavator-back-end.herokuapp.com/';
// export const BASE_URL = 'https://excavator-back-end.onrender.com/';

export const WORKING_SHIFT = [
    'Day',
    'Night'
];

export const TAG_PURPOSE = [
    'Contact',
    'Reminder',
    'Task',
    'Bill',
    'Payment',
    'Maintenance'
];

// Application modules/pages
export const MODULE = {
    services: {
        backendRoute: 'service',
        frontendRoute: 'services',
        pageTitle: 'Services',
        tableColumns: [
            'name',
            'rate',
            'billingType',
            'description',
            // 'createdBy',
            // 'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    users: {
        backendRoute: 'user',
        frontendRoute: 'users',
        pageTitle: 'Users',
        tableColumns : [
            // 'avatar',
            'name',
            'role',
            // 'designation',
            'email',
            'phone',
            'active',
            // 'createdBy',
            // 'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    tags: {
        backendRoute: 'tag',
        frontendRoute: 'tags',
        pageTitle: 'Tags',
        tableColumns: [
            'name',
            'purpose',
            // 'createdBy',
            // 'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    vehicles: {
        backendRoute: 'vehicle',
        frontendRoute: 'vehicle',
        pageTitle: 'Vehicles',
        tableColumns: [
            'name',
            'type',
            'number',
            'capacity',
            'fuel',
            // 'createdBy',
            // 'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    contacts: {
        backendRoute: 'contact',
        frontendRoute: 'contacts',
        pageTitle: 'Contacts',
        tableColumns: [
            // 'checkbox',
            // 'avatar',
            'name',
            // 'gender',
            // 'email',
            'phone',
            // 'alternatePhone',
            // 'designation',
            // 'company',
            'type',
            'important',
            // 'createdBy',
            // 'createdAt',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    petrolPumps: {
        backendRoute: 'petrol-pump',
        frontendRoute: 'petrolPumps',
        pageTitle: 'Petrol Pumps',
        tableColumns: [
            'name',
            'place',
            'petrolRate',
            'dieselRate',
            // 'createdBy',
            // 'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    customers: {
        backendRoute: 'customer',
        frontendRoute: 'customers',
        pageTitle: 'Client/Customers/Site',
        tableColumns: [
            'name',
            'place',
            'email',
            'phone',
            'contact',
            // 'createdBy',
            // 'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    employees: {
        backendRoute: 'employee',
        frontendRoute: 'employees',
        pageTitle: 'Employees',
        tableColumns: [
            'photo',
            'name',
            'gender',
            'phone',
            'designation',
            'disabledon',
            'joiningdate',
            'status',
            // 'createdBy',
            // 'createdAt',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    works: {
        backendRoute: 'work',
        frontendRoute: 'works',
        pageTitle: 'Works',
        tableColumns: [
            'checkbox',
            'service',
            'date',
            // 'startime',
            // 'endtime',
            'customer',
            // 'site',
            // 'workers',
            // 'rate',
            'quantity',
            'amount',
            'invoiced',
            // 'supervisor'
            // 'createdBy',
            // 'createdAt',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    invoices: {
        backendRoute: 'invoice',
        frontendRoute: 'invoices',
        pageTitle: 'Invoices',
        tableColumns: [
            'id',
            'invoiceTo',
            'date',
            'invoicedAmount',
            'status',
            // 'expectedClearanceDate',
            // 'paymentStatus',
            'actions'
        ]
    },
    attendances: {
        backendRoute: 'employee/attendance',
        frontendRoute: 'attendances',
        pageTitle: 'Attendances',
        tableColumns: [
            'date',
            'total', // total employee present
            'updatedBy',
            'updatedAt',
            'actions'
        ],
        path: {
            multiAttendence: '/multiple'
        }
    },
    transactions: {
        backendRoute: 'transaction',
        frontendRoute: 'transactions',
        pageTitle: 'Transactions',
        tableColumns: [
            'source', // INVOICE, EMPLOYEE_PAYMENT, FUEL_LOG, FARM_INCOME, OTHER_INCOME, MAINTENANCE, EXPENDITURE
            'category', // INCOME, SPENDING, BORROWING, LENDING
            'mode', // Payment mode: CASH | ONLINE ACCOUNT TRANSFER | BANK ACCOUNT TRANSFER, UPI, CREDIT/DEBIT CARD, PAYTM, CHEQUE, RTGS, NEFT, DD, OTHER-EWALLET
            'amount',
            'date',
            'status', // Payment status: PAID | PDC | FAILED | IN PROGRESS | AWAITING | CANCELED | PARTIALLY PAID | SCHEDULED | UNPAID
            'employee',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    expenses: {
        backendRoute: 'expenditure',
        frontendRoute: 'expenses',
        pageTitle: 'Expenses',
        tableColumns: [
            'date',
            'place',
            'purpose',
            'amount',
            'transaction',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    borrowings: {
        backendRoute: 'borrowing',
        frontendRoute: 'borrowings',
        pageTitle: 'Borrowings',
        tableColumns: [
            'person',
            'date',
            'type',
            'purpose',
            'amount',
            'transaction',
            'scheduledReturnDate',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    revenues: {
        backendRoute: 'revenue',
        frontendRoute: 'revenues',
        pageTitle: 'Revenues',
        tableColumns: [
            'source',
            'date',
            'customer',
            'amount',
            'transaction',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    },
    fuels: {
        backendRoute: 'fuel',
        frontendRoute: 'fuels',
        pageTitle: 'Fuel Log',
        tableColumns: [
            'date',
            'fuel',
            'petrolPump',
            'rate',
            'volume',
            'total',
            'vehicle',
            'employee',
            'invoice',
            'transaction',
            // 'updatedBy',
            // 'updatedAt',
            'actions'
        ]
    }
}

export const CONTACT_TYPE = {
    BUSINESS: 'Business',
    RELATIVE: 'Relative',
    FRIEND: 'Friend',
    ASSOCIATE: 'Associate',
    CLIENT: 'Client',
    CUSTOMER: 'Customer',
    PARTY: 'Party',
    EMPLOYEE: 'Employee'
};

export const VEHICLE_TYPE = {
    CAR: 'Car',
    BIKE: 'Bike',
    TRACTOR: 'Tractor',
    TRACK: 'Truck',
    THRESHER: 'Thresher Machine',
    DOZER:'Dozer',
    POCLAIN: 'Poclain'
};

export const PAYMENT_METHODS = [
    {
        code: 'CHEQUE',
        name: 'Cheque'
    },
    {
        code: 'CASH',
        name: 'Cash'
    },
    {
        code: 'ACCOUNT_TRANSFER',
        name: 'Account Transfer'
    },
    {
        code: 'RTGS',
        name: 'RTGS'
    },
    {
        code: 'NEFT',
        name: 'NEFT'
    },
    {
        code: 'CREDIT/DEBIT_CARD',
        name: 'Credit/Debit Card'
    },
    {
        code: 'UPI',
        name: 'UPI'
    },
    {
        code: 'PAYTM_OTHER_WALLET',
        name: 'PayTM/Other Wallet'
    },
];

export const PAYMENT_STATUSES = [
    {
        code: 'PAID',
        name: 'Paid',
        color: 'green-500'
    },
    {
        code: 'PDC',
        name: 'PDC - Post Dated Cheque',
        color: 'pink-500'
    },
    {
        code: 'FAILED',
        name: 'Failed',
        color: 'red-500'
    },
    {
        code: 'IN_PROGRESS',
        name: 'In Progress'
    },
    {
        code: 'AWAITING',
        name: 'Awaiting',
        color: 'orange-500'
    },
    {
        code: 'CANCELED',
        name: 'Canceled',
        color: 'red-500'
    },
    {
        code: 'PARTIALLY_PAID',
        name: 'Partially Paid',
        color: 'blue-500'
    },
    {
        code: 'SCHEDULED',
        name: 'Scheduled',
        color: 'pink-500'
    },
    {
        code: 'UNPAID',
        name: 'Unpaid',
        color: 'red-900'
    }
];

export const EXPENSE_PURPOSES = [
    {
        name: 'Farm',
        code: 'FARM'
    },
    {
        name: 'Vehicle Maintanance',
        code: 'VEHICLE_MAINTANCE'
    },
    {
        name: 'Household',
        code: 'HOUSEHOLD'
    },
    {
        name: 'Grocery',
        code: 'GROCERY'
    },
    {
        name: 'Market',
        code: 'MARKET'
    },
    {
        name: 'Pocket Money',
        code: 'POCKET_MONEY'
    },
    {
        name: 'Insurance',
        code: 'INSURANCE'
    },
    {
        name: 'Electric Bill',
        code: 'ELECTRIC_BILL'
    },
    {
        name: 'Hospital',
        code: 'HOSPITAL'
    }
];

export const BORROWING_TYPES = [
    {
        name: 'Borrowed',
        code: 'BORROWED'
    },
    {
        name: 'Lend',
        code: 'LEND'
    }
];

export const REVENUE_SOURCES = [
    {
        name: 'Farm',
        code: 'FARM'
    },
    {
        name: 'Rent',
        code: 'RENT'
    },
    {
        name: 'Invoice',
        code: 'INVOICE'
    },
    {
        name: 'Other',
        code: 'OTHER'
    }
];



