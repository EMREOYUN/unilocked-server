import { Ref, prop } from "@typegoose/typegoose";
import { User } from "./user";

export class InviteCode {
  @prop({ required: true })
  public code!: number;

  @prop({ ref: () => User, required: false })
  public user?: Ref<User>;

  @prop({ required: true })
  public deadLine!: Date;

  @prop({ required: true, default: () => new Date() })
  public createdAt!: Date;

  @prop({ required: false })
  public joinedAt?: Date;
}
