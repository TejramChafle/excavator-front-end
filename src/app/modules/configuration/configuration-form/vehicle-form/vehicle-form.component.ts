import { Component, Inject, ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Vehicle } from './vehicle.model';

@Component({
    selector: 'vehicle-form',
    templateUrl: './vehicle-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class VehicleFormDialogComponent implements OnInit {
    vehicle: Vehicle;
    vehicleForm: FormGroup;
    @Input('data') data: any;
    @Input('action') action: string;
    @Output() formChanged: EventEmitter<any> = new EventEmitter()
    /**
     * Constructor
     * @param _data
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
     * Create vehicle form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.vehicle._id],
            name: [this.vehicle.name],
            type: [this.vehicle.type],
            fuel: [this.vehicle.fuel],
            number: [this.vehicle.number],
            capacity: [this.vehicle.capacity],
            isActive: [this.vehicle.isActive]
        });
    }


    // Do save/update vehicle information on click of add/save button
    onSubmit(formData): void {
        console.log({formData});
        this.formChanged.emit(formData);
    }

    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
        if (this.action === 'edit') {
            this.vehicle = this.data;
        } else {
            this.vehicle = new Vehicle({});
        }
        this.vehicleForm = this.createUserForm();
        console.log('this.vehicle : ', this.vehicle);
    }
}
