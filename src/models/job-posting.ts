import { DocumentType, Ref, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { Event } from "./event";
import { Profile } from "./profile";
import { Talent } from "./talent";
import { Partner } from "./relations/partner";

export enum JobType {
  FullTime = "Full time",
  PartTime = "Part time",
  Internship = "Internship",
  Freelance = "Freelance",
}

export enum WorkType {
  Office = "Office",
  Remote = "Remote",
  Hybrid = "Hybrid",
}

export class JobPosting {
  @prop({ required: true })
  title: string;

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
  jobType: JobType;

  @prop({ required: true })
  workType: WorkType;

  @prop({ required: true })
  department: string;

  @prop({ required: true })
  workingTime: number;

  @prop({ required: false })
  startTime?: Date;

  @prop({ required: false })
  endTime?: Date;

  @prop({ ref: () => Talent, default: [] })
  talents: Ref<Talent>[] | Talent[];

  @prop({ required: true })
  yearsOfExperience: number;

  @prop({ required: true })
  educationLevel: string;

  @prop({
    ref: () => Partner,
    foreignField: "parentId",
    localField: "_id",
    justOne: false,
    autopopulate: true,
  })
  partners: Ref<Partner>[] | Partner[];
}
