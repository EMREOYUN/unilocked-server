import { Ref, modelOptions, plugin, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Profile } from "../profile";
import { MessageMember } from "./message-member";
import mongooseAutoPopulate from "mongoose-autopopulate";

export enum RoomType {
  DIRECT_MESSAGE = "DIRECT_MESSAGE",
  GROUP = "GROUP",
  CHANNEL = "CHANNEL",
  ORGANIZATION = "ORGANIZATION",
  OTHER = "OTHER",
}

@plugin(mongooseAutoPopulate)
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
export class MessageRoom {
  @prop()
  name?: string;

  @prop()
  description?: string;

  @prop()
  isPrivate?: boolean;

  @prop()
  roomType?: RoomType;

  @prop()
  createdByType?: string;

  @prop()
  createdById?: ObjectId;

  @prop({
    ref: () => (doc: any) => doc.createdByType,
    foreignField: "_id",
    localField: "createdById",
    justOne: true,
  })
  createdBy?: Ref<Profile>;

  @prop({
    ref: () => MessageMember,
    foreignField: "room",
    localField: "_id",
    justOne: false,
    autopopulate: true,
  })
  members?: Ref<MessageMember>[];
}
