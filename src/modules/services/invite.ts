import { User } from "./../../models/user";
import { Express } from "express";
import { InviteCodeModel } from "../../resolved-models";

export async function generateInviteCode() {
  const code = generateRandomCode();
  const existingCode = await InviteCodeModel.findOne({ code });
  if (existingCode) {
    return generateInviteCode();
  }
  const date = new Date();
  // add month
  date.setMonth(date.getMonth() + 1);
  const inviteCode = new InviteCodeModel({
    code,
    deadLine: date,
  });
  await inviteCode.save();
  return inviteCode;
}

export async function validateInviteCode(user: Express.User, code: string) {
  const inviteCode = await InviteCodeModel.findOne({ code });
  if (!inviteCode) {
    return false;
  }
  if (inviteCode.user) {
    return false;
  }
  if (inviteCode.deadLine < new Date()) {
    return false;
  }
  inviteCode.user = user._id;
  inviteCode.joinedAt = new Date();
  await inviteCode.save();
  return true;
}

function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
