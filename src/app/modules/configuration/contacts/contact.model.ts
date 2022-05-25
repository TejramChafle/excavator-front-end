import { FuseUtils } from '@fuse/utils';

export class Contact {
    /* id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string; */

    _id: string;
    firstname: string;
    lastname: string;
    // avatar: string;
    gender: string;
    mobile: string;
    phone: string;
    email: string;
    company: string;
    designation: string;
    birthday: Date;
    address: string;
    description: string;
    tag: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            /* this.id = contact.id || FuseUtils.generateGUID();
            this.name = contact.name || '';
            this.lastName = contact.lastName || '';
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = contact.nickname || '';
            this.company = contact.company || '';
            this.jobTitle = contact.jobTitle || '';
            this.email = contact.email || '';
            this.phone = contact.phone || '';
            this.address = contact.address || '';
            this.birthday = contact.birthday || '';
            this.notes = contact.notes || ''; */

            this._id = contact._id;
            this.firstname = contact.firstname || '';
            this.lastname = contact.lastname || '';
            // this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
            this.gender = contact.gender || '';
            this.mobile = contact.mobile || '';
            this.phone = contact.phone || '';
            this.email = contact.email || '';
            this.company = contact.company || '';
            this.designation = contact.designation || '';
            this.address = contact.address || '';
            this.birthday = contact.birthday || '';
            this.description = contact.description || '';
            this.tag = contact.tag;
        }
    }
}
