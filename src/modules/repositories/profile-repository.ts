import { ContactInfo } from "./../../models/relations/profiles/contact-info";
import { Types } from "mongoose";
import getProfileModel from "../services/profile";
import {
  UserModel,
  CompanyModel,
  FeaturedContentModel,
} from "./../../resolved-models";
import { tr } from "../services/translator";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { FeaturedContent } from "../../models/relations/profiles/featured-content";
import { User } from "../../models/user";
import checkProfilePermission from "../services/check-profile-permission";

export async function updateProfile(
  modelType: string,
  profileId: Types.ObjectId,
  body: any,
  user: DocumentType<User>
) {
  const profile = await getProfileModel(modelType).findById(profileId);
  if (!profile) {
    throw new Error(tr("Profile not found"));
  }

  if (!checkProfilePermission(user, profile, "edit")) {
    throw new Error(tr("You don't have permission to edit this profile"));
  }

  if (body.headnote) {
    profile.headnote = body.headnote;
  }

  if (body.about) {
    profile.about = body.about;
  }

  if (body.avatarUrl) {
    profile.avatar = body.avatar;
  }

  if (body.description) {
    profile.description = body.description;
  }

  if (body.city) {
    profile.city = body.city;
  }

  if (body.tags) {
    profile.tags = body.tags;
  }

  if (body.links) {
    profile.links = body.links;
  }

  if (body.backdrop) {
    profile.backdrop = body.backdrop;
  }

  if (body.followerCountStyle) {
    profile.followerCountStyle = body.followerCountStyle;
  }

  if (body.contactInfo) {
    profile.contactList = body.contactInfo;
  }

  if (body.featuredContentCount) {
    profile.featuredContentCount = body.featuredContentCount;
  }

  if (body.featuredContent) {
    for (let content of body.featuredContent) {
      const existing = profile.featuredContent.find((c) => {
        if (isDocument(c)) {
          return c.contentId.equals(content.contentId);
        }
        return c.toString() === content.contentId.toString();
      });
      if (!existing) {
        const featuredContent = new FeaturedContentModel({
          profileId: profile._id,
          profileType: modelType,
          contentId: content.contentId,
          contentType: content.contentType,
        });
        await featuredContent.save();
      }
    }
  }
  await profile.save();
  return profile;
}
