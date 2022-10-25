import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Tag } from './tag.model';
import { AppService } from 'app/app.service';
import { TAG_PURPOSE } from 'app/app.config';

@Component({
    selector: 'tag-form-dialog',
    templateUrl: './tag-form.component.html',
    // styleUrls: ['./tag-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TagFormDialogComponent {
    action: string;
    tag: Tag;
    tagForm: FormGroup;
    dialogTitle: string;
    purposes: Array<string>;
    /**
     * Constructor
     *
     * @param {MatDialogRef<TagFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<TagFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _appService: AppService
    ) {
        // Set the defaults
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit Tag';
            this.tag = _data.tag;
        }
        else {
            this.dialogTitle = 'New Tag';
            this.tag = new Tag({});
        }

        this.tagForm = this.createTagForm();

        // Set the purpose options
        // this.purposes = TAG_PURPOSE;
        this.purposes = [];
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
    }
}
