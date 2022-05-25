import { FuseUtils } from '@fuse/utils';

export class Employee {
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
     * @param employee
     */
    constructor(employee) {
        {
            /* this.id = employee.id || FuseUtils.generateGUID();
            this.name = employee.name || '';
            this.lastName = employee.lastName || '';
            this.avatar = employee.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = employee.nickname || '';
            this.company = employee.company || '';
            this.jobTitle = employee.jobTitle || '';
            this.email = employee.email || '';
            this.phone = employee.phone || '';
            this.address = employee.address || '';
            this.birthday = employee.birthday || '';
            this.notes = employee.notes || ''; */

            this._id = employee._id;
            this.firstname = employee.firstname || '';
            this.lastname = employee.lastname || '';
            // this.avatar = employee.avatar || 'assets/images/avatars/profile.jpg';
            this.gender = employee.gender || '';
            this.mobile = employee.mobile || '';
            this.phone = employee.phone || '';
            this.email = employee.email || '';
            this.company = employee.company || '';
            this.designation = employee.designation || '';
            this.address = employee.address || '';
            this.birthday = employee.birthday || '';
            this.description = employee.description || '';
            this.tag = employee.tag;
        }
    }
}
