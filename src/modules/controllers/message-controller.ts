import { Router } from "express";
import BaseController from "./base-controller";
import {
  MessageMemberModel,
  MessageMemberStatusModel,
  MessageModel,
  MessageRoomModel,
} from "../../resolved-models";
import { ObjectId } from "mongodb";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import success, { successTr } from "../responses/success";
import { OID } from "../helpers/generate-object-id";
import { MessageRoom, RoomType } from "../../models/messages/message-room";
import { DocumentType, isDocument } from "@typegoose/typegoose";
import { MessageMember } from "../../models/messages/message-member";
import { errorTr } from "../responses/error";

export class MessageController extends BaseController {
  public socket: Socket;
  listenSocket(socket: Socket) {
    this.socket = socket;

    let memberType = "User";
    let memberId = socket.request.user._id;
    let autoChangeStatus = true;

    socket.on("updateMemberStatus", async (data, callback) => {
      await this.updateMemberStatus(
        data.memberType,
        OID(data.memberId),
        data.status
      );
      memberType = data.memberType;
      memberId = OID(data.memberId);
      autoChangeStatus = data.autoChangeStatus;
      callback(successTr("Status updated"));
    });
    socket.on("getRooms", this.getRooms.bind(this));
    socket.on("getMessages", this.getMessages.bind(this));
    socket.on("sendMessage", this.sendMessage.bind(this));
    socket.on("createGroupRoom", this.createGroupRoom.bind(this));
    socket.on("joinRoom", this.joinRoom.bind(this));
    socket.on("disconnect", async () => {
      if (autoChangeStatus) {
        await this.updateMemberStatus(memberType, memberId, "OFFLINE");
      }
    });
  }
  listen(router: Router): void {}

  async joinRoom(data, callback) {
    this.socket.join(data);
    console.log("joined", data, this.socket.rooms);
  }

  async getRooms(data, callback) {
    const memberType = data.memberType;
    const memberId = OID(data.memberId);
    const members = await MessageMemberModel.find({
      memberType,
      memberId,
    }).populate([
      {
        path: "room",
        populate: [
          {
            path: "members",
            populate: [
              {
                path: "member",
              },
            ],
          },
        ],
      },
    ]);

    callback(
      success(
        members.map((m) => {
          const room = m.room;

          const modifiedRoom = this.modifyRoom(room, memberId);
          if (modifiedRoom) {
            return modifiedRoom;
          }

          return m?.toObject()?.room;
        })
      )
    );
  }

  modifyRoom(room, memberId) {
    if (room && isDocument(room) && room.roomType == RoomType.DIRECT_MESSAGE) {
      const otherMember = room.members.filter(
        (member: DocumentType<MessageMember>) => {
          return member.memberId.toString() != memberId.toString();
        }
      )[0];
      if (
        otherMember &&
        isDocument(otherMember) &&
        isDocument(otherMember.member)
      ) {
        const objectRoom = room.toObject();
        objectRoom.name = otherMember.member.name;
        objectRoom.image = otherMember.member.avatar;
        return objectRoom;
      }
    }
  }

  async getMessages(data, callback) {
    const roomId = OID(data.roomId);
    const messages = await MessageModel.find({
      room: roomId,
    }).populate("sender");
    callback(success(messages));
  }

  async sendMessage(data, callback) {
    const willCreateRoom = !data.roomId;
    let roomId = data.roomId ? OID(data.roomId) : null;
    const senderId = OID(data.senderId);
    const senderType = data.senderType;

    let room: DocumentType<MessageRoom>;
    if (!roomId) {
      room = await this.createDmRoom(data);
      roomId = room._id;
    } else {
      room = await MessageRoomModel.findById(roomId).exec();
    }

    const text = data.text;
    const files = data.files;
    const replyTo = data.replyTo;
    const message = await MessageModel.create({
      room: roomId,
      senderId,
      senderType,
      text,
      files,
      replyTo,
    });

    if (!isDocument(message.room) && willCreateRoom) {
      await MessageModel.populate(message, {
        path: "room",
        populate: [
          {
            path: "members",
            populate: [
              {
                path: "member",
              },
            ],
          },
        ],
      });
    }

    const modifiedRoom = this.modifyRoom(message.room, senderId);
    const modifiedMessage = message?.toObject();
    if (modifiedRoom) {
      modifiedMessage.room = modifiedRoom;
    }

    if (willCreateRoom) {
      this.emitForAllMembers("newRoom", room, modifiedMessage.room);
    }
    this.emitForAllMembers("newMessage", room, modifiedMessage);
    try {
      callback(success(modifiedMessage));
    } catch (e) {}
  }

  async createGroupRoom(data, callback) {
    const members = data.members.map((m) => {
      m.memberId = OID(m.memberId);
      return m;
    });
    const creatorId = OID(data.creatorId);
    const creatorType = data.creatorType;

    if (!data.name || data.name.length === 0) {
      callback(errorTr("Room name is required"));
      return;
    }

    if (members.length === 0) {
      callback(errorTr("Room members are required"));
      return;
    }

    if (data.name.length > 50) {
      callback(errorTr("Room name is too long"));
      return;
    }

    if (data.name.length < 3) {
      callback(errorTr("Room name is too short"));
      return;
    }

    const room = new MessageRoomModel({
      roomType: RoomType.GROUP,
      createdByType: creatorType,
      createdById: creatorId,
      name: data.name,
      description: data.description || "",
    });

    const membersToSave = members.map((m) => {
      return new MessageMemberModel({
        memberId: m.memberId,
        memberType: m.memberType,
        room: room._id,
      });
    });

    await room.save();
    await MessageMemberModel.insertMany(membersToSave);
    callback(success(room));
  }

  async createDmRoom(data) {
    const receiverId = OID(data.receiverId);
    const receiverType = data.receiverType || "User";
    const senderId = OID(data.senderId);
    const senderType = data.senderType || "User";

    const room = new MessageRoomModel({
      roomType: RoomType.DIRECT_MESSAGE,
      createdByType: senderType,
      createdById: senderId,
      name: "DM",
      description: "",
    });

    const member1 = new MessageMemberModel({
      memberId: receiverId,
      memberType: receiverType,
      room: room._id,
    });

    const member2 = new MessageMemberModel({
      memberId: senderId,
      memberType: senderType,
      room: room._id,
    });

    await room.save();
    await member1.save();
    await member2.save();

    return room;
  }

  emitForAllMembers(key: string, room: DocumentType<MessageRoom>, data?: any) {
    console.log("emitting", key, "to", room._id.toString());
    this.socket.emit(key, data);
    this.socket.in(room._id.toString()).emit(key, data);
  }

  async updateMemberStatus(memberType: string, memberId: any, status: string) {
    await MessageMemberStatusModel.updateOne(
      {
        memberType,
        memberId,
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
          autoChangeStatus: true,
        },
        $setOnInsert: {
          memberType,
          memberId,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
      }
    );
  }
}
