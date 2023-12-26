import { prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class Setting {
  @prop({ required: true, index: true,unique: true })
  id!: number;

  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  value!: mongoose.Mixed;

  @prop({ required: true })
  created_at!: Date;

  @prop({ required: true })
  updated_at!: Date;

  @prop({ required: true })
  private!: boolean;
}
