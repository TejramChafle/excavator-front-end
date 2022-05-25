import { FuseUtils } from '@fuse/utils';

export class Client {

    _id: string;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    description: string;

    /**
     * Constructor
     *
     * @param client
     */
    constructor(client) {
        this._id = client._id;
        this.name = client.name;
        this.contact_person = client.contact_person;
        this.phone = client.phone;
        this.email = client.email;
        this.address = client.address;
        this.description = client.description;
    }
}
