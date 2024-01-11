import { Ref, post, prop } from "@typegoose/typegoose";
import { Profile } from "./profile";
import { User } from "./user";
import { createRoom } from "../modules/services/profiles/create.room";

@post("save", createRoom)
export class Company extends Profile {
  @prop()
  sector: string;

  @prop()
  workerCount: string;

  @prop()
  tags: string[];

  @prop({ ref: () => User })
  creator: Ref<User>;
}
