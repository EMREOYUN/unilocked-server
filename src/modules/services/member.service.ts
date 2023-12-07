import { ObjectId } from "mongodb";
import { DocumentType } from "@typegoose/typegoose";
import { Profile } from "../../models/profile";
import { User } from "../../models/user";
import { MembersModel } from "../../resolved-models";
import { Role } from "../../models/role";
import { Members } from "../../models/relations/members";
import checkProfilePermission from "./check-profile-permission";
import { Types } from "mongoose";

export class MemberSerivce {
  public async createMember(
    user: DocumentType<User> | Express.User,
    memberId: Types.ObjectId,
    profile: DocumentType<Profile>,
    role: DocumentType<Role>
  ) {
    if (checkProfilePermission(user, profile, "members.create")) {
      const member = await MembersModel.create({
        memberId: memberId,
        profileId: profile._id,
        profileType: profile.type,
        memberRole: role._id,
      });
      return member;
    } else {
      throw new Error("You don't have permission to create a member");
    }
  }

  public async updateMember(
    user: DocumentType<User>,
    role: DocumentType<Role>,
    member: DocumentType<Members>
  ) {
    if (
      checkProfilePermission(
        user,
        member.profile as DocumentType<Profile>,
        "members.update"
      )
    ) {
      member.memberRole = role._id;
      await member.save();
      return member;
    } else {
      throw new Error("You don't have permission to update a member");
    }
  }

  public async deleteMember(
    user: DocumentType<User> | Express.User,
    member: DocumentType<Members>
  ) {
    if (
      checkProfilePermission(
        user,
        member.profile as DocumentType<Profile>,
        "members.delete"
      )
    ) {
      await member.deleteOne();
      return member;
    } else {
      throw new Error("You don't have permission to delete a member");
    }
  }
}
