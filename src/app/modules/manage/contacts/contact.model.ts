import { FuseUtils } from '@fuse/utils';

export class Contact {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    contactType: string;
    alternatePhone: string;
    isStarred: string;
    gender: string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this._id = contact._id;
            this.firstName = contact.firstName;
            this.lastName = contact.lastName;
            this.gender = contact.gender;
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = contact.nickname;
            this.company = contact.company;
            this.jobTitle = contact.jobTitle;
            this.email = contact.email;
            this.phone = contact.phone;
            this.address = contact.address;
            this.birthday = contact.birthday;
            this.notes = contact.notes;
            this.isStarred = contact.isStarred;
            this.contactType = contact.contactType;
        }
    }
}
