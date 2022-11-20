export class Customer {
    _id?: string;
    name: string;
    place: string;
    email: string;
    phone: string;
    owner: string;
    isActive: boolean;
    /**
     * Constructor
     *
     * @param customer
     */
    constructor(customer) {
        {
            this._id = customer._id;
            this.name = customer.name;
            this.place = customer.place;
            this.email = customer.email;
            this.phone = customer.phone;
            this.owner = customer.owner;
            this.isActive = customer.isActive;
        }
    }
}
