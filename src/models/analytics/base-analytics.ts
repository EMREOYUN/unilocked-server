import { Ref, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user";
import { AnalyticsData } from "./analytics-data";
import { AnalyticsAction } from "./analytics-action";

export class BaseAnalytics {
  
  @prop()
  action: AnalyticsAction;

  @prop()
  user: Ref<User>;

  @prop({ default: () => new Date() })
  date: Date;

  @prop()
  data: AnalyticsData;

}



