import {
  getModelForClass,
  modelOptions,
  plugin,
  Ref,
} from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose/lib/prop";
import { User } from "../user";
import { ObjectId } from "mongoose";
import { MessageRoom } from "./message-room";
import { Profile } from "../profile";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { File } from "../file";

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
export class Message {
  @prop()
  text?: string;

  @prop({ ref: () => MessageRoom, index: true })
  room: Ref<MessageRoom>;

  @prop({ required: true })
  senderId: ObjectId;

  @prop({ required: true })
  senderType: string;

  @prop({
    ref: () => (doc: any) => doc.senderType,
    foreignField: "_id",
    localField: "senderId",
    justOne: true,
    autopopulate: true,
  })
  sender: Ref<Profile>;

  @prop({ default: [], ref: () => File })
  files?: Ref<File>[];

  @prop({ ref: () => Message, index: true })
  replyTo?: Ref<Message>;

  @prop({ default: Date.now, index: true })
  createdAt?: Date;

  @prop({ default: Date.now, index: true })
  updatedAt?: Date;
}
