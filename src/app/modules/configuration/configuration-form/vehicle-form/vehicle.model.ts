export class Vehicle {
    _id?: string;
    name: string;
    type: string;
    capacity: string;
    fuel: string;
    number: string;
    isActive: boolean;
    /**
     * Constructor
     *
     * @param vehicle
     */
    constructor(vehicle) {
        {
            this._id = vehicle._id;
            this.name = vehicle.name || '';
            this.type = vehicle.type || '';
            this.capacity = vehicle.capacity || '';
            this.fuel = vehicle.fuel || '';
            this.number = vehicle.number || '';
            this.isActive = vehicle.isActive;
        }
    }
}
