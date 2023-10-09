import { prop } from '@typegoose/typegoose';

export class ContactInfo {
    @prop()
    description: string;

    @prop()
    data: string;
}