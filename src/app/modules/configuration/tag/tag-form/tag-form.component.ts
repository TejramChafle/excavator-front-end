import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Tag } from '../tag.model';
import { TagService } from '../tag.service';
import { AppService } from 'app/app.service';
import { tagPurpose } from 'app/app.config';

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
        private _tagService: TagService,
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
        this.purposes = tagPurpose;
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
        // If the tag id exist then update and save the tag
        if (formData._id) {
            formData.updated_by = this._appService.user._id;
            formData.updated_date = new Date();
            this._tagService.updateTag(formData).then((response) => {
                this._appService.handleMessage(response.message || 'Tag information updated successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        } else {
            formData.created_by = this._appService.user._id;
            formData.updated_by = this._appService.user._id;
            formData.created_date = new Date();
            formData.updated_date = new Date();
            this._tagService.createTag(formData).then((response) => {
                this._appService.handleMessage(response.message || 'New tag created successfully.', 'Success');
                this.matDialogRef.close(true);
            });
        }
    }
}
