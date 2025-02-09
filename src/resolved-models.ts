import { PasswordReset } from './models/password-reset';
import { EmailVerify } from './models/email-verify';
import { Setting } from './models/setting';
import { MessageMemberStatus } from './models/messages/message-member-status';
import { MessageMember } from './models/messages/message-member';
import { MessageRoom } from './models/messages/message-room';
import { JobApplication } from "./models/relations/jobs/job-application";
import { Partner } from "./models/relations/partner";
import { JobPosting } from "./models/job-posting";
import { EventApplication } from "./models/relations/events/event-application";
import { EventTicket } from "./models/relations/events/event-ticket";
import { ProjectApplication } from "./models/relations/projects/project-application";
import { ProjectAnalytics } from "./models/analytics/project-analytics";
import { CustomPage } from "./models/custom-page";
import { ProfileSettings } from "./models/profile-settings";
import { UserJob } from "./models/relations/jobs/user-job";
import { PostReaction } from "./models/relations/post-reaction";
import { CommunityContributors } from "./models/relations/community-contributors";
import { UserEducation } from "./models/relations/school/user-education";
import { FeaturedContent } from "./models/relations/profiles/featured-content";
import { Department } from "./models/university/department";
import { Members } from "./models/relations/members";
import { Followers } from "./models/relations/followers";
import { getModelForClass } from "@typegoose/typegoose";
import { Comment } from "./models/comment";
import { Community } from "./models/community";
import { Project } from "./models/project";
import { ProjectPosting } from "./models/project-posting";
import { Role } from "./models/role";
import { University } from "./models/university";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Event } from "./models/event";
import { Company } from "./models/company";
import { Message } from "./models/messages/message";
import { File } from "./models/file";
import { Talent } from "./models/talent";
import { EventAnalytics } from "./models/analytics/event-analytics";
import { Organisation } from "./models/organisation";
import { JobPostingAnalytics } from "./models/analytics/job-posting-analytics";
import { InviteCode } from './models/invite-code';
import { PersonalAccessToken } from './models/personal-access-token';

export const CommentModel = getModelForClass(Comment);
export const CommunityModel = getModelForClass(Community);
export const CompanyModel = getModelForClass(Company);
export const EventModel = getModelForClass(Event);
export const PostModel = getModelForClass(Post);
export const ProjectPostingModel = getModelForClass(ProjectPosting);
export const ProjectModel = getModelForClass(Project);
export const RoleModel = getModelForClass(Role);
export const UniversityModel = getModelForClass(University);
export const UserModel = getModelForClass(User);
export const MessageModel = getModelForClass(Message);
export const FollowersModel = getModelForClass(Followers);
export const FileModel = getModelForClass(File);
export const MembersModel = getModelForClass(Members);
export const DepartmentModel = getModelForClass(Department);
export const FeaturedContentModel = getModelForClass(FeaturedContent);
export const UserEducationModel = getModelForClass(UserEducation);
export const TalentModel = getModelForClass(Talent);
export const CommunityContributorsModel = getModelForClass(
  CommunityContributors
);
export const PostReactionModel = getModelForClass(PostReaction);
export const UserJobModel = getModelForClass(UserJob);
export const EventAnalyticsModel = getModelForClass(EventAnalytics);
export const OrganisationModel = getModelForClass(Organisation);
export const ProfileSettingsModel = getModelForClass(ProfileSettings);
export const CustomPageModel = getModelForClass(CustomPage);
export const ProjectAnalyticsModel = getModelForClass(ProjectAnalytics);
export const ProjectApplicationModel = getModelForClass(ProjectApplication);
export const EventTicketModel = getModelForClass(EventTicket);
export const EventApplicationModel = getModelForClass(EventApplication);
export const JobPostingModel = getModelForClass(JobPosting);
export const PartnerModel = getModelForClass(Partner);
export const JobApplicationModel = getModelForClass(JobApplication);
export const JobPostingAnalyticsModel = getModelForClass(JobPostingAnalytics);
export const MessageRoomModel = getModelForClass(MessageRoom);
export const MessageMemberModel = getModelForClass(MessageMember);
export const MessageMemberStatusModel = getModelForClass(MessageMemberStatus);
export const InviteCodeModel = getModelForClass(InviteCode);
export const PersonalAccessTokenModel = getModelForClass(PersonalAccessToken);
export const SettingModel = getModelForClass(Setting);
export const EmailVerifyModel = getModelForClass(EmailVerify);
export const PasswordResetModel = getModelForClass(PasswordReset);