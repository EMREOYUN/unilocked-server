import { Ref, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user";
import { AnalyticsData } from "./analytics-data";
import { BaseAnalytics } from "./base-analytics";
import { Project } from "../project";

export class ProjectAnalytics extends BaseAnalytics {
  @prop()
  project: Ref<Project>;
}
