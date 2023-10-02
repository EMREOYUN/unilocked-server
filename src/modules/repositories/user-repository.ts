import bcrypt from "bcrypt";
import gravatar from "gravatar";
import slugify from "slugify";
import {
  DepartmentModel,
  RoleModel,
  UniversityModel,
  UserEducationModel,
  UserModel,
} from "../../resolved-models";
import { User } from "../../models/user";

export async function createUser(data: any) {
  const { email, first_name, last_name, password } = data;
  const avatar = gravatar.url(email);
  const newUser: User = {
    email,
    first_name,
    last_name,
    avatar,
    password: null,
    name: slugify(first_name + " " + last_name, {
      lower: true,
    }),
    roles: [(await RoleModel.findOne({ default: true }))._id],
    currentJob: null,
    description: null,
    type: "User",
    city: null,
    tags: [],
    links: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  newUser.password = hash;

  const universityName = data.school;
  const university = await UniversityModel.findOne({ name: universityName });
  if (university) {
    newUser.universityId = university._id;
  }

  if (data.department) {
    const department = await DepartmentModel.findOne({ name: data.department });
    if (department) {
      newUser.departmentId = department._id;
    }
  }

  const userEducation = new UserEducationModel({
    schoolName: data.school,
    schoolId: university?._id,
    description: "",
    talents: [],
    joinedAt: new Date(data.startDate),
    departmentId: newUser.departmentId,
    graduationDate: new Date(data.endDate),
  })
  await userEducation.save();

  newUser.education = [userEducation._id];
    
  const created = await UserModel.create(newUser);
  return created;
}
