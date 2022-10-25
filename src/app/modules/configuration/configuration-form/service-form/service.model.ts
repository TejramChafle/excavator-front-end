export class Service {
    _id?: string;
    name: string;
    rate: string;
    description: string;
    billingType: 'Hour' | 'Day' | 'KM' | 'Trip' | 'Sqft' | 'Sqmt';
    isActive: boolean;
    /**
     * Constructor
     *
     * @param user
     */
    constructor(user) {
        {
            this._id = user._id;
            this.name = user.name;
            this.rate = user.rate;
            this.billingType = user.billingType;
            this.description = user.description;
            this.isActive = user.isActive;
        }
    }
}
