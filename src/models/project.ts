import { User } from "./user";
import { getModelForClass, Ref } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose/lib/prop";
import { Post } from "./post";
import { Types } from "mongoose";

export class Project {
  @prop()
  name: string;
  @prop()
  summary: string;
  @prop()
  description: string;
  //Target
  @prop()
  currency: string;
  @prop()
  amount: number;
  @prop()
  tags: string[];
  @prop()
  daysRemaining: number;
  @prop()
  numberOfFollowers: number;
  @prop({ ref: () => User })
  likes: Ref<User>[];
  @prop({ type: () => [String] })
  links: string[];

  @prop({ required: true })
  ownerType: "User" | "Company" | "University" | "Community";

  @prop({ required: true })
  ownerId: Types.ObjectId;

  @prop({
    ref: () => (doc: Project) => doc.ownerType,
    foreignField: "_id",
    localField: "ownerId",
    justOne: true,
    autopopulate: true,
  })
  owner: Ref<User>;
}
