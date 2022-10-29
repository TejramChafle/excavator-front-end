import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Tag } from './tag.model';
import { TAG_PURPOSE } from 'app/app.config';

@Component({
    selector: 'tag-form',
    templateUrl: './tag-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class TagFormDialogComponent implements OnInit {
    tag: Tag;
    tagForm: FormGroup;
    @Input('data') data: any;
    @Input('action') action: string;
    @Output() formChanged: EventEmitter<any> = new EventEmitter()
    purposes = TAG_PURPOSE;
    /**
     * Constructor
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder
    ) {
        console.log({purposes: this.purposes});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create tag form
     *
     * @returns {FormGroup}
     */
    createTagForm(): FormGroup {
        return this._formBuilder.group({
            _id:        [this.tag._id],
            name:  [this.tag.name],
            purpose:   [this.tag.purpose],
        });
    }


    // Do save/update tag information on click of add/save button
    onSubmit(formData): void {
        console.log(formData);
        this.formChanged.emit(formData);
    }

    ngOnInit(): void {
        if (this.action === 'edit') {
            this.tag = this.data;
        } else {
            this.tag = new Tag({});
        }
        this.tagForm = this.createTagForm();
    }
}
