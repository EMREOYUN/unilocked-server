import { prop } from "@typegoose/typegoose/lib/prop";
import { University } from "./university";
import { User } from "./user";
import { ContactInfo } from "./contact-info";
import { Post } from "./post";
import { SubEvent } from "./sub-event";
import { Organisation } from "./organisation";
import { Ref, getModelForClass } from "@typegoose/typegoose";

export class Event {
    @prop()
    name: string;

    @prop()
    description: string;

    @prop({ ref: () => User })
    creator: Ref<User>

    @prop({ ref: () => University })
    organizator: Ref<University>[];

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

