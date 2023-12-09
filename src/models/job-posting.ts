import { DocumentType, Ref, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Event } from "./event";
import { Profile } from "./profile";

export class JobPosting {
  @prop({ required: true })
  creatorId: ObjectId;

  @prop({ required: true })
  creatorType: "User" | "Company" | "University";

  @prop({
    ref: () => (doc: DocumentType<Event>) => doc.organizatorType,
    foreignField: "_id",
    localField: "organizatorId",
    justOne: true,
  })
  creator: Ref<Profile>;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  location: string;

  @prop({ required: true })
  jobType: string;

  @prop({ required: true })
  department: string;

  @prop({ required: true })
  yearsOfExperience: number;

  @prop({ required: true })
  educationLevel: string;
}
