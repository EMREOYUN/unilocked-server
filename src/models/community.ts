import { User } from "./user";
import { getModelForClass, post, Ref } from "@typegoose/typegoose";
import { prop } from "@typegoose/typegoose/lib/prop";
import { Post } from "./post";
import { Profile } from "./profile";
import { createRoom } from "../modules/services/profiles/create.room";

@post("save", createRoom)
export class Community extends Profile {
  @prop()
  summary: string;

  @prop()
  description: string;

  @prop()
  backdrop: string;

  @prop()
  poster: string;

  @prop()
  tags: string[];

  @prop({ ref: () => User })
  contributors: Ref<User>[];

  @prop({ ref: () => User })
  likes: Ref<User>[];
  @prop({ type: () => [String] })
  links: string[];

  @prop({ default: "Community" })
  type: string;
}
