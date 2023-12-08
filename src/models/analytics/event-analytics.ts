import { prop, Ref } from "@typegoose/typegoose";
import { User } from "../user";
import { BaseAnalytics } from "./base-analytics";

export class EventAnalytics extends BaseAnalytics {
  @prop({ ref: () => Event })
  event: Ref<Event>;
}
