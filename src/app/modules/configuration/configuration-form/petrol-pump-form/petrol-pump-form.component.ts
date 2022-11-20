import { Component, ViewEncapsulation, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PetrolPump } from './petrol-pump.model';

@Component({
    selector: 'petrol-pump-form',
    templateUrl: './petrol-pump-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class PetrolPumpFormDialogComponent implements OnInit {
    petrolPump: PetrolPump;
    petrolPumpForm: FormGroup;
    @Input('data') data: any;
    @Input('action') action: string;
    @Output() formChanged: EventEmitter<any> = new EventEmitter();
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
     * Create petrolPump form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup {
        return this._formBuilder.group({
            _id: [this.petrolPump._id],
            name: [this.petrolPump.name],
            place: [this.petrolPump.place],
            petrolRate: [this.petrolPump.petrolRate],
            dieselRate: [this.petrolPump.dieselRate],
            isActive: [this.petrolPump.isActive]
        });
    }


    // Do save/update petrolPump information on click of add/save button
    onSubmit(formData): void {
        console.log({formData});
        this.formChanged.emit(formData);
    }

    /**
     * On page initialize get the list of tags of the purpose CONTACT
     */
    ngOnInit(): void {
        if (this.action === 'edit') {
            this.petrolPump = this.data;
        } else {
            this.petrolPump = new PetrolPump({});
        }
        this.petrolPumpForm = this.createUserForm();
        console.log('this.petrolPump : ', this.petrolPump);
    }
}
