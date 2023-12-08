import { Ref, prop } from "@typegoose/typegoose";
import { User } from "../../user";
import { EventApplication } from "./event-application";

export class EventTicket {
  @prop({ required: true })
  user: Ref<User>;

  @prop({ required: true })
  event: Ref<Event>;

  @prop({ required: true })
  ticketNumber: number;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  currency: string;

  @prop({ required: true })
  application: Ref<EventApplication>;

  @prop({ required: true })
  status: TicketStatus;

  @prop({ required: true, default: () => new Date() })
  date: Date;
}

export enum TicketStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  USED = "USED",
}
