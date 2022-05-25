import { FuseUtils } from '@fuse/utils';

export class FuelResource {

    _id: string;
    place: string;
    name: string;
    owner: string;
    phone: string;

    /**
     * Constructor
     *
     * @param resource
     */
    constructor(resource) {
        this._id = resource._id;
        this.name = resource.name || '';
        this.place = resource.place || '';
        this.owner = resource.owner;
        this.phone = resource.phone;
    }
}
