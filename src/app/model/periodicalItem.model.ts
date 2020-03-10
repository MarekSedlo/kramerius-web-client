import { Metadata } from './metadata.model';

export class PeriodicalItem {
    date: string;
    name: string;
    number: string;
    doctype: string;
    public: boolean;
    uuid: string;
    thumb: string;
    virtual = false;
    metadata: Metadata;
    dnnt = false;

    constructor() {
    }

    getPath(): string {
        if (this.doctype === 'periodicalvolume') {
            return 'periodical/' + this.uuid;
        } else {
            return 'view/' + this.uuid;
        }
    }

    getTitle(): string {
        const title = this.doctype === 'monographunit' ? this.name : this.date;
        return title || '-';
    }


    getPart(): string {
        if (!this.number) {
            return '';
        }
        return this.number;
    }

}
