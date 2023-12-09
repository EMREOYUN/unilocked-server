import { getModelForClass } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose/lib/prop";
import { User } from "./user";

enum WorkingType {
  office,
  remote,
  hybrid,
}

export class ProjectPosting {
  @prop()
  author: User;
  @prop()
  description: string;
  @prop()
  location: string;
  @prop()
  sector: string;
  @prop()
  title: string;
  @prop()
  educationLevel: string;
  @prop()
  typeOfProject: string;
  @prop()
  workingType: WorkingType;
  @prop()
  language: string;
  @prop({default: () => new Date()})
  created_at: Date;
}

