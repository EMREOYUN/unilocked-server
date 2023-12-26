import { Ref, prop } from "@typegoose/typegoose";
import { User } from "./user";

export class File {
  @prop()
  name?: string;

  @prop()
  path?: string;

  @prop()
  size?: number;

  @prop()
  type?: string;

  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: Date.now, index: true })
  createdAt?: Date;

  @prop({ default: Date.now, index: true })
  updatedAt?: Date;

}
