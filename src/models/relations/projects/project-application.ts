import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export class ProjectApplication {
  @prop({ required: true, index: true })
  projectId: Types.ObjectId;

  @prop({ required: true })
  userId: Types.ObjectId;

  @prop({ required: true })
  roleId: Types.ObjectId;

  @prop({ default: false })
  accepted: boolean;

  @prop({ default: false })
  rejected: boolean;

  @prop({ default: false })
  pending: boolean;

  @prop({ required: false })
  rejected_reason?: string;

  @prop({ required: true })
  description: string;

  @prop({ default: () => new Date() })
  created_at: Date;
}
