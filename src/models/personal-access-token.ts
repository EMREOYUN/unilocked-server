import { prop, getModelForClass, Ref, modelOptions } from "@typegoose/typegoose";
import { User } from "./user";
import { ObjectId } from "mongoose";

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class PersonalAccessToken {

  // user
  @prop({
    ref: () => "User",
    foreignField: "_id",
    localField: "tokenable_id",
    justOne: true,
  })
  public user: Ref<User>;

  @prop({ type: () => String })
  public tokenable_type!: string;

  @prop({ type: () => Number })
  public tokenable_id!: ObjectId;

  @prop({ type: () => String })
  public name!: string;

  @prop({ type: () => String, index: true })
  public token!: string;

  @prop({ type: () => [String] })
  public abilities?: string[];

  @prop({ type: () => Date })
  public last_used_at?: Date;

  @prop({ type: () => Date,default: Date.now })
  public created_at?: Date;

  @prop({ type: () => Date,default: Date.now })
  public updated_at?: Date;
}
