import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";

export class Partner {
  @prop()
  partnerType: string;

  @prop()
  partnerId: ObjectId;

  @prop()
  parentId: ObjectId;

  @prop({
    ref: () => (doc: any) => doc.partnerType,
    foreignField: "_id",
    localField: "partnerId",
    justOne: true,
  })
  partner: any;
}
