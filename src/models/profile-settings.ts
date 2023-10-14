import { DocumentType, Ref, prop } from "@typegoose/typegoose";
import { Profile } from "./profile";

export class ProfileSettings {
    @prop()
    profileType: string;

    @prop()
    profileId: string;

    @prop()
    name: string;

    @prop()
    value: any;

    @prop({
        ref: () => (doc:DocumentType<ProfileSettings>) => doc.profileType,
        foreignField: '_id',
        localField: 'profileId',
        justOne: true
    })
    profile: Ref<Profile>
}