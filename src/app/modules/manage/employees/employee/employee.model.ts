import { MatChipInputEvent } from '@angular/material/chips';
import { FuseUtils } from '@fuse/utils';

export class Employee {
    _id: string;
    active: boolean;

    // Personal info
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    photo: string;

    // Contact info
    address: string;
    phone: string;
    alternatePhone: string;
    email: string;
    emergencyPhone: string;

    // Medical info
    bloodGroup: string;
    insuranceName: string;
    insuranceNumber: string;
    insurancePremium: number;
    insuranceAmount: number;

    // Banking detail
    bankName: string;
    ifscCode: string;
    accountNumber: number;
    upiId: string

    // Office detail
    designation: string;
    dateOfJoin: Date;
    wageType: string;
    wagePerDay: number;
    wagePerMonth: number;
    wagePerYear: number;
    incentive: number;
    weekendOff: string;

    /**
     * Constructor
     *
     * @param employee
     */
    constructor(employee?) {
        this._id = employee._id || null;
        this.active = employee.active || true;

        this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.gender = employee.gender;
        this.dateOfBirth = employee.dateOfBirth;
        this.photo = employee.photo;

        this.address = employee.address;
        this.phone = employee.phone;
        this.alternatePhone = employee.alternatePhone;
        this.emergencyPhone = employee.emergencyPhone;
        this.email = employee.email;

        this.bloodGroup = employee.bloodGroup;
        this.insuranceName = employee.insuranceName;
        this.insuranceNumber = employee.insuranceNumber;
        this.insurancePremium = employee.insurancePremium;
        this.insuranceAmount = employee.insuranceAmount;

        this.bankName = employee.bankName;
        this.ifscCode = employee.ifscCode;
        this.accountNumber = employee.accountNumber;
        this.upiId = employee.upiId;

        this.designation = employee.designation;
        this.dateOfJoin = employee.dateOfJoin;
        this.wageType = employee.wageType;
        this.wagePerDay = employee.wagePerDay;
        this.wagePerMonth = employee.wagePerMonth;
        this.wagePerYear = employee.wagePerYear;
        this.incentive = employee.incentive;
        this.weekendOff = employee.weekendOff;
    }

    /**
     * Add category
     *
     * @param {MatChipInputEvent} event
     */
    /* addCategory(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add category
        if ( value )
        {
            this.categories.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }
    } */

    /**
     * Remove category
     *
     * @param category
     */
    /* removeCategory(category): void
    {
        const index = this.categories.indexOf(category);

        if ( index >= 0 )
        {
            this.categories.splice(index, 1);
        }
    } */

    /**
     * Add tag
     *
     * @param {MatChipInputEvent} event
     */
    /* addTag(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add tag
        if ( value )
        {
            this.tags.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }
    } */

    /**
     * Remove tag
     *
     * @param tag
     */
    /* removeTag(tag): void
    {
        const index = this.tags.indexOf(tag);

        if ( index >= 0 )
        {
            this.tags.splice(index, 1);
        }
    } */
}
