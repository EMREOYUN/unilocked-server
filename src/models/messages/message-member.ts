import { Ref, modelOptions, plugin, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Profile } from "../profile";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { MessageRoom } from "./message-room";

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
export class MessageMember {
  @prop()
  memberId: ObjectId;

  @prop()
  memberType: string;

  @prop({
    ref: () => (doc: any) => doc.memberType,
    foreignField: "_id",
    localField: "memberId",
    justOne: true,
    autopopulate: true,
  })
  member: Ref<Profile>;

  @prop({ ref: () => MessageRoom, index: true })
  room: Ref<MessageRoom>;
}
