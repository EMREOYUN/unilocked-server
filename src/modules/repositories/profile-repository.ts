import { UserModel, CompanyModel } from "./../../resolved-models";

export async function updateProfile(modelType: "User" | "Company", body: any) {
  let model: any = null;
  if (modelType === "User") {
    model = new UserModel(body);
  } else {
    model = new CompanyModel(body);
  }
  await model.save();
  return model;
}
