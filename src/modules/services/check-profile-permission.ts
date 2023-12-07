import { DocumentType } from "@typegoose/typegoose";
import { Profile } from "../../models/profile";
import { User } from "../../models/user";
import { Role } from "../../models/role";

export default function checkProfilePermission(
  user: DocumentType<User> | Express.User,
  profile: DocumentType<Profile>,
  permission: string
) {
  const member = (profile.members as any[]).find(
    (member) => member.memberId.toString() === user._id.toString()
  );
  if (member) {
    return (member.memberRole as Role)?.permissions?.includes(permission);
  } else {
    return false;
  }
}
