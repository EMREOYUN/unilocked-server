import { ObjectId } from "mongodb";
import { plugin, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

@plugin(mongooseAutoPopulate)
export class FeaturedContent {
  @prop()
  contentId: Types.ObjectId;

  @prop()
  contentType: string;

  @prop()
  profileId: Types.ObjectId;

  @prop()
  profileType: string;

  @prop({
    ref: () => (doc: FeaturedContent) => doc.contentType,
    foreignField: () => "_id",
    localField: () => "contentId",
    justOne: true,
    autopopulate:true
  })
  content?: Types.ObjectId;

  @prop({
    ref: () => (doc: FeaturedContent) => doc.profileType,
    foreignField: () => "_id",
    localField: () => "profileId",
    justOne: true,
  })
  profile?: Types.ObjectId;
}
