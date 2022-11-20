import { Component, ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'app/data.service';
import { Customer } from './customer.model';

@Component({
    selector: 'customer-form',
    templateUrl: './customer-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class CustomerFormDialogComponent implements OnInit {
    customer: Customer;
    customerForm: FormGroup;
    @Input('data') data: any;
    @Input('action') action: string;
    @Output() formChanged: EventEmitter<any> = new EventEmitter();
    owners: Array<any>;

    /**
     * Constructor
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _dataService: DataService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create customer form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.customer._id],
            name: [this.customer.name],
            place: [this.customer.place],
            phone: [this.customer.phone],
            email: [this.customer.email],
            owner: [this.customer.owner],
            isActive: [this.customer.isActive]
        });
    }


    // Do save/update customer information on click of add/save button
    onSubmit(formData): void {
        console.log({ formData });
        this.formChanged.emit(formData);
    }

    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
        if (this.action === 'edit') {
            this.customer = this.data;
        } else {
            this.customer = new Customer({});
        }
        this.customerForm = this.createUserForm();
        console.log('this.customer : ', this.customer);

        this.getOwners();
    }

    getOwners() {
        this._dataService.records('contact', { contactType: 'Customer' }).subscribe((response) => {
            console.log({ response });
            this.owners = response.docs;
        });
    }
}
