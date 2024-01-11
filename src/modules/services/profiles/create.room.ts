import { type } from "os";
import { MessageRoomModel } from "../../../resolved-models";
import { RoomType } from "../../../models/messages/message-room";

export async function createRoom(doc) {
  const profileId = doc._id;
  const profileType = doc.constructor.modelName;
  
  const room = await MessageRoomModel.findOne({
    createdById: profileId,
    createdByType: profileType,
  }).exec();
  if (!room) {
    const room = new MessageRoomModel({
      createdById: profileId,
      createdByType: profileType,
      name: doc.name,
      type: RoomType.ORGANIZATION,
    });
    await room.save();
  }
}
