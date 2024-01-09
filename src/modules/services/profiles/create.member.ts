import { MessageMemberModel, MessageRoomModel } from "../../../resolved-models";

export async function createMember(doc) {
  const profileId = doc.profileId;
  const profileType = doc.profileType;
  const memberId = doc.memberId;
  const memberType = doc.memberType;
  const room = await MessageRoomModel.findOne({
    createdById: profileId,
    createdByType: profileType,
  }).exec();
  if (room) {
    const existing = await MessageMemberModel.findOne({
      memberId: memberId,
      memberType: memberType,
      room: room._id,
    }).exec();
    if (!existing) {
      const member = new MessageMemberModel({
        memberId: memberId,
        memberType: memberType,
        room: room._id,
      });
      await member.save();
    }
  }
}
