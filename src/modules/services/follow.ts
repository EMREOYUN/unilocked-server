import { ObjectId } from "mongodb";
import { Profile } from "./../../models/profile";
import { ReturnModelType } from "@typegoose/typegoose";
import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import { Types } from "mongoose";
import { FollowersModel } from "../../resolved-models";
import { OID } from "../helpers/generate-object-id";
import checkProfilePermission from "./check-profile-permission";
import getProfileModel from "./profile";
import { User } from "../../models/user";
import { tr } from "./translator";

export async function follow(
  user: Express.User | DocumentType<User>,
  profileId: Types.ObjectId,
  profileType: string,
  followerId: Types.ObjectId,
  followerType: string
) {
  const profile = await getProfileModel(profileType).findById(profileId);
  const follower = await getProfileModel(followerType).findById(followerId);

  let hasPermission = user._id.toString() === followerId.toString();
  if (!hasPermission) {
    hasPermission = await checkProfilePermission(user, follower, "follow");
  }

  if (!hasPermission) {
    throw new Error(tr("You don't have permission to follow this profile"));
  }

  const followerModel = await FollowersModel.findOne({
    followerId: followerId,
    followingId: profileId,
  });

  if (followerModel) {
    await followerModel.deleteOne();
    let followerCount = profile.followerCount || 1;
    followerCount = followerCount - 1;
    profile.followerCount = followerCount;
    await profile.save();
    return false;
  } else {
    const newFollower = new FollowersModel();
    newFollower.followerId = followerId;
    newFollower.followingId = profileId;
    newFollower.followerType = followerType;
    newFollower.followingType = profileType;
    let followerCount = profile.followerCount || 0;
    await newFollower.save();
    profile.followerCount = followerCount + 1;
    await profile.save();
    return true;
  }
}
