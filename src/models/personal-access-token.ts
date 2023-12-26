import { prop, getModelForClass, Ref, modelOptions } from "@typegoose/typegoose";
import { User } from "./user";

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class PersonalAccessToken {
  @prop({ type: () => Number })
  public id!: number;

  // user
  @prop({
    ref: () => "User",
    foreignField: "id",
    localField: "tokenable_id",
    justOne: true,
  })
  public user: Ref<User>;

  @prop({ type: () => String })
  public tokenable_type!: string;

  @prop({ type: () => Number })
  public tokenable_id!: number;

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
