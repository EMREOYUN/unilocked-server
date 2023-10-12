import { Ref, modelOptions, prop } from "@typegoose/typegoose";
import { Followers } from "./relations/followers";
import { Members } from "./relations/members";
import { Post } from "./post";
import { FeaturedContent } from "./relations/profiles/featured-content";
import { ContactInfo } from "./relations/profiles/contact-info";
import { type } from "os";

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
  },
})
export class Profile {
  @prop()
  name: string;

  @prop()
  avatar?: string;

  @prop()
  description: string;

  @prop()
  city: string;

  @prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @prop({
    type: [String],
    default: [],
  })
  links: string[];

  @prop()
  type: string;

  @prop({ default: Date.now() })
  createdAt: Date;

  @prop({ default: Date.now() })
  updatedAt: Date;

  @prop({
    ref: () => () => "Followers", // This need to be written this way, because since typegoose "7.1", deferred function are supported
    foreignField: () => "followingId", // no "doc" parameter provided here
    localField: () => "_id", // no "doc" parameter provided here
    justOne: false,
  })
  public followers?: Ref<Followers>[];

  @prop({
    ref: () => () => "Members", // This need to be written this way, because since typegoose "7.1", deferred function are supported
    foreignField: () => "profileId", // no "doc" parameter provided here
    localField: () => "_id", // no "doc" parameter provided here
    justOne: false,
  })
  public members?: Ref<Members>[];

  @prop()
  followerCount?: number;

  @prop()
  website?: string;

  @prop()
  phone?: string;

  @prop()
  contactEmail?: string;

  @prop()
  address?: string;

  @prop({
    type: () => ContactInfo,
    default: [],
  })
  contactList?: ContactInfo[];

  @prop({
    ref: () => Post,
    foreignField: () => "postedById",
    localField: () => "_id",
    justOne: false,
  })
  public posts?: Ref<Post>[];

  @prop({
    ref: () => FeaturedContent,
    foreignField: () => "profileId",
    localField: () => "_id",
    justOne: false,
  })
  public featuredContent?: Ref<FeaturedContent>[];

  public get contact() {
    const obj: any = {};
    for (let info of this.contactList) {
      obj[info.name] = info.data;
    }
    return obj;
  }
}
