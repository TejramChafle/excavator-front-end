import { FuseUtils } from '@fuse/utils';

export class Tag {

    _id: string;
    purpose: string;
    name: string;

    /**
     * Constructor
     *
     * @param tag
     */
    constructor(tag) {
        this._id = tag._id;
        this.purpose = tag.purpose || '';
        this.name = tag.name || '';
    }
}
