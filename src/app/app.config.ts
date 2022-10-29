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
            'avatar',
            'name',
            'role',
            'designation',
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
            'firstname',
            'gender',
            'email',
            'mobile',
            'phone',
            'designation',
            'company',
            'type',
            'createdBy',
            'createdAt',
            'updatedBy',
            'updatedAt',
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
            'createdBy',
            'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    },
    clients: {
        backendRoute: 'petrolPump',
        frontendRoute: 'petrolPumps',
        pageTitle: 'Petrol Pumps',
        tableColumns: [
            'name',
            'address',
            'description',
            'createdBy',
            'createdAt',
            'updatedBy',
            'updatedAt',
            'actions'
        ]
    }
}

// Vehicle Types
/*  
    Mover (Dozer)
    Excavator (Large)
    Excavator (Small)
    Tractor
    Bike
    Car
    Thresher Machine
    Harvestor Machine
 */
