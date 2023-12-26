import { Ref, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "../user";
import { AnalyticsData } from "./analytics-data";
import { BaseAnalytics } from "./base-analytics";
import { Project } from "../project";
import { JobPosting } from "../job-posting";

export class JobPostingAnalytics extends BaseAnalytics {
  @prop({
    ref: () => JobPosting,
  })
  jobPosting: Ref<JobPosting>;
}
