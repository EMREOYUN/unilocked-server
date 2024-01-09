import { MessageMemberModel, MessageRoomModel } from "../../../resolved-models";

export async function deleteMember(doc) {
  const profileId = doc.profileId;
  const profileType = doc.profileType;
  const memberId = doc.memberId;
  const memberType = doc.memberType;

  const room = await MessageRoomModel.findOne({
    createdById: profileId,
    createdByType: profileType,
  }).exec();
  if (room) {
    await MessageMemberModel.deleteMany({
      memberId: memberId,
      memberType: memberType,
      room: room._id,
    });
  }
}
