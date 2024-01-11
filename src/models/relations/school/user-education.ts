import { Ref, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Talent } from "../../talent";
import { FeaturedContent } from "../profiles/featured-content";

export enum EducationType {
  University = "university",
  HighSchool = "high-school",
}

export class UserEducation {
  @prop({
    required: true,
  })
  userId: Types.ObjectId;

  @prop({
    required: true,
    default: "university",
  })
  educationType: string;

  @prop({
    required: true,
  })
  departmentId: Types.ObjectId;

  @prop({
    default: Date.now,
  })
  joinedAt: Date;

  @prop({
    required: false,
  })
  graduationDate?: Date;

  @prop()
  description?: string;

  @prop({
    ref: () => Talent,
  })
  talents?: Ref<Talent>[];

  @prop()
  schoolName: string;

  @prop({
    required: true,
  })
  schoolId: Types.ObjectId;

  @prop({
    required: true,
    default: 0,
  })
  gpa: number;

  @prop({
    ref: () => "User",
    foreignField: () => "_id",
    localField: () => "userId",
    justOne: true,
  })
  user?: Types.ObjectId;

  @prop({
    ref: () => "Department",
    foreignField: () => "_id",
    localField: () => "departmentId",
    justOne: true,
  })
  department?: Types.ObjectId;

  @prop({
    ref: () => "University",
    foreignField: () => "_id",
    localField: () => "jobId",
    justOne: true,
  })
  school?: Types.ObjectId;

  @prop({
    required: true,
  })
  current: boolean;

  @prop({
    ref: () => FeaturedContent,
  })
  featuredContent?: Ref<FeaturedContent>;
}
