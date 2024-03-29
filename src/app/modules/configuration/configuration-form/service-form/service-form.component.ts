import { Component, ViewEncapsulation, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Service } from './service.model';

@Component({
    selector: 'service-form',
    templateUrl: './service-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ServiceFormDialogComponent implements OnInit {
    service: Service;
    serviceForm: FormGroup;
    billingTypes = [
        { title: 'Day', value: 'Day' },
        { title: 'Hour', value: 'Hour' },
        { title: 'Day', value: 'Day' },
        { title: 'Ton', value: 'Ton' },
        { title: 'Sqft', value: 'Sqft' },
        { title: 'Trip', value: 'Trip' }
    ];
    @Input('data') data: any;
    @Input('action') action: string;
    @Output() formChanged: EventEmitter<any> = new EventEmitter()

    /**
     * Constructor
     * @param formData
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create service form
     *
     * @returns {FormGroup}
     */
    createServiceForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.service._id],
            name: [this.service.name],
            rate: [this.service.rate],
            billingType: [this.service.billingType],
            description: [this.service.description],
            isActive: [this.service.isActive]
        });
    }

    // Do save/update service information on click of add/save button
    onSubmit(formData): void {
        // console.log({formData});
        this.formChanged.emit(formData);
    }

    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
        if (this.action === 'edit') {
            this.service = this.data;
        } else {
            this.service = new Service({});
        }
        this.serviceForm = this.createServiceForm();
        // console.log('this.service : ', this.service, 'this.action'+this.action);
        // console.log(this.serviceForm);
    }
}
