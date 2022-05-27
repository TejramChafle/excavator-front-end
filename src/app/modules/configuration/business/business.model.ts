import { MatChipInputEvent } from '@angular/material/chips';
import { FuseUtils } from '@fuse/utils';

export class Business
{
    _id?: string;
    name: string;
    tagline: string;
    about: string;
    logo: string;
    owner: {
        _id?: string,
        name: string,
        email: string,
        phone: string
    };
    panNo: string;
    gstNo: string;
    email: string;
    phone: string;
    alternatePhone: string;
    address: string;
    isActive: boolean;

    /**
     * Constructor
     *
     * @param business
     */
    constructor(business?) {
        business = business || {};
        this._id = business._id;
        this.name = business.name;
        this.tagline = business.tagline;
        this.about = business.about;
        this.logo = business.logo;
        this.owner = business.owner;
        this.panNo = business.panNo;
        this.gstNo = business.gstNo;
        this.email = business.email;
        this.phone = business.phone;
        this.alternatePhone = business.alternatePhone;
        this.address = business.address;
    }
}
