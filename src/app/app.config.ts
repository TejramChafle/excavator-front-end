export const BASE_URL = 'http://localhost:3000/';
// export const BASE_URL = 'https://excavator-back-end.herokuapp.com/';

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
            'createdBy',
            'createdAt',
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
            'createdBy',
            'createdAt',
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
            'createdBy',
            'createdAt',
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
            'createdBy',
            'createdAt',
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
            'createdBy',
            'createdAt',
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
            'createdBy',
            'createdAt',
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
            'service',
            'date',
            'startime',
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
