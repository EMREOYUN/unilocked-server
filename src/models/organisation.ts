import { ObjectId } from "mongodb";
import { prop } from '@typegoose/typegoose';

export class Organisation {
    @prop()
    profileId: ObjectId;

    @prop()
    profileType: string;
}