import { DocumentType, Ref, prop } from "@typegoose/typegoose";
import { User } from "../user";
import { ObjectId } from "mongoose";
import { Profile } from "../profile";

export const ONLINE = "ONLINE";
export const OFFLINE = "OFFLINE";

export class MessageMemberStatus {
  @prop({ required: true, index: true })
  memberType: string;

  @prop({ required: true, index: true })
  memberId: ObjectId;

  @prop({
    ref: () => (doc: DocumentType<MessageMemberStatus>) => doc.memberType,
    foreignField: "_id",
    localField: "memberId",
  })
  member: Ref<Profile>;

  @prop()
  autoChangeStatus: boolean;

  @prop()
  status: string;

  @prop({ default: () => new Date(), index: true })
  createdAt?: Date;

  @prop({ default: () => new Date(), index: true })
  updatedAt?: Date;
}
