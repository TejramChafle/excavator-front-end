export class PetrolPump {
    _id?: string;
    name: string;
    place: string;
    petrolRate: number;
    dieselRate: number;
    isActive: boolean;
    /**
     * Constructor
     *
     * @param petrolPump
     */
    constructor(petrolPump) {
        {
            this._id = petrolPump._id;
            this.name = petrolPump.name || '';
            this.place = petrolPump.place || '';
            this.isActive = petrolPump.isActive;
        }
    }
}
