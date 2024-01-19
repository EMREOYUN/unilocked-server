import { Organisation } from './organisation';
import { Project } from "./project";
import { University } from "./university";
import { Post } from "./post";
import { Role } from "./role";
import { DocumentType, getModelForClass, modelOptions, plugin, prop, Ref } from "@typegoose/typegoose";
import { Profile } from "./profile";
import { Followers } from "./relations/followers";
import { Types } from "mongoose";
import { Department } from "./university/department";
import { UserJob } from "./relations/jobs/user-job";
import { UserEducation } from "./relations/school/user-education";
import { FollowersModel } from '../resolved-models';
import mongooseAutoPopulate from 'mongoose-autopopulate';

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
  },
})
@plugin(mongooseAutoPopulate)
export class User extends Profile {
  @prop()
  first_name?: string;
  @prop()
  last_name?: string;
  @prop()
  avatar_url?: string;
  @prop()
  gender?: string;
  @prop({ select: false })
  email?: string; //!
  @prop({ select: false })
  password?: string; //!
  @prop({ select: false })
  created_at?: Date; //!
  @prop({ select: false })
  updated_at?: Date; //!
  

  @prop({ default: "User" })
  type: string;

  @prop({ select: false })
  available_space?: string; //!;
  @prop({ select: false })
  email_verified_at?: Date; //!;
  @prop()
  display_name?: string;
  @prop({ select: false })
  has_password?: boolean; //!;
  @prop({ ref: () => Role, autopopulate: true })
  roles?: Ref<Role>[];

  @prop({ ref: () => Event, select: false })
  createdEvents?: Ref<Event>[];
  @prop({ ref: () => Event, select: false })
  participatedEvents?: Ref<Event>[];

  @prop({
    ref: () => () => "Followers", // This need to be written this way, because since typegoose "7.1", deferred function are supported
    foreignField: () => "followerId", // no "doc" parameter provided here
    localField: () => "_id", // no "doc" parameter provided here
    justOne: true,
  })
  public following?: Ref<Followers>[];

  @prop()
  universityId?: Types.ObjectId;

  @prop({ ref: () => Post, select: false })
  projectsParticipated?: Ref<Project>[];

  @prop({ ref: () => Post, select: false })
  postsSaved?: Ref<Post>[];

  @prop({
    ref: () => "University",
    localField: () => "universityId",
    foreignField: () => "_id",
    justOne: true,
  })
  university?: Ref<University>;

  @prop({ required: false })
  departmentId?: Types.ObjectId;

  @prop({
    ref: () => "Department",
    localField: () => "departmentId",
    foreignField: () => "_id",
    justOne: true,
  })
  department?: Ref<Department>;

  @prop({
    ref: () => "UserJob",
    foreignField: () => "userId",
    localField: () => "_id",
    justOne: false,
  })
  jobs?: Ref<UserJob>[];

  get currentJob() {
    return this.jobs?.find((job) => (job as UserJob)?.current);
  }

  @prop({
    ref: () => UserEducation,
    foreignField: () => "userId",
    localField: () => "_id",
    justOne: false,
  })
  education?: Ref<UserEducation>[];

  currentUserFollowed?: boolean = false;

  public async applyCurrentUserFollowed(user: DocumentType<User>) {
    const followers = await FollowersModel.findOne({
      followerId: user._id,
      followingId: (this as any)._id,
    }).exec();
    this.currentUserFollowed = !!followers;
  }
  
  public get organisations() : any[] {
    return [
      ...(this.jobs || []),
      this.university,
    ]
  }
  
}
