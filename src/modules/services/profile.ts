import { DocumentType } from "@typegoose/typegoose";
import { Profile } from "../../models/profile";
import { University } from "../../models/university";
import {
  CommunityModel,
  CompanyModel,
  UniversityModel,
  UserModel,
} from "../../resolved-models";
import { ModelType } from "@typegoose/typegoose/lib/types";

/**
 * Useful to get the right model for a profile
 * @param profileType
 * @returns profile model
 */
export default function getProfileModel(
  profileType: string
): ModelType<Profile> {
  switch (profileType) {
    case "User":
      return UserModel;
    case "Company":
      return CompanyModel;
    case "Community":
      return CommunityModel;
    case "University":
      return UniversityModel;
  }
}
