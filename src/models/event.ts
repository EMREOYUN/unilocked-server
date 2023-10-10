import { prop } from "@typegoose/typegoose/lib/prop";
import { University } from "./university";
import { User } from "./user";
import { ContactInfo } from "./contact-info";
import { Post } from "./post";
import { SubEvent } from "./sub-event";
import { Organisation } from "./organisation";
import { DocumentType, Ref, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Profile } from "./profile";

@modelOptions({
    schemaOptions: {
        toJSON: {
            virtuals: true,
            getters: true
        },
        toObject: {
            virtuals: true,
            getters: true
        },
    }
})
export class Event {
    @prop()
    name: string;

    @prop()
    description: string;

    @prop({ ref: () => User })
    creator: Ref<User>

    @prop()
    organizatorId: ObjectId;

    @prop()
    organizatorType: string;

    @prop({
        ref: (doc:DocumentType<Event>) => doc.organizatorType,
        foreignField: "_id",
        localField: "organizatorId",
        justOne: true
    })
    organizator: Ref<Profile>;

    @prop()
    eventDate: Date;

    @prop()
    location: string;

    @prop({ ref: () => User })
    participants?: Ref<User>[];

    @prop({ ref: () => User })
    permissionedUsers?: Ref<User>[];

    @prop()
    partOf: string;

    @prop({ ref: () => ContactInfo})
    contactName: Ref<ContactInfo>;

    @prop()
    image?: string;

    @prop()
    themeColor: string;

    @prop()
    sponsorCount: number;

    @prop({ ref: () => Organisation })
    sponsors?: Ref<Organisation>[];

    @prop({ ref: () => Organisation })
    partners?: Ref<Organisation>[];

    @prop({ ref: () => Post })
    featuredPosts?: Ref<Post>[];

    @prop({ ref: () => SubEvent })
    subEvents?: Ref<SubEvent>[];
}

