import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { Profile } from "./profile";
import { Community } from "./community";
import { Project } from "./project";
import { UserEducation } from "./relations/school/user-education";

export class University extends Profile {
  @prop()
  city: string;
  @prop()
  address: string;
  @prop({ ref: () => Event, select: false })
  events?: Ref<Event>[];

  @prop({required : true})
  slug: string;

  @prop({ ref: () => Community })
  communities?: Ref<Community>[];

  @prop({ ref: () => Project })
  projects?: Ref<Project>[];

  @prop({ default: "University" })
  type: string;

  @prop({ default: [], type: () => String })
  domains?: string[];

  @prop({
    ref: () => UserEducation,
    foreignField: () => "schoolId",
    localField: () => "_id",
    match: { graduationDate: { $lt: Date.now() } },
  })
  graduates?: Ref<UserEducation>[]; //
}
