import { Ref, prop } from "@typegoose/typegoose";

export class EventApplication {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  event: Ref<Event>;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  location: string;

  @prop({ required: true })
  date: Date;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  currency: string;

  @prop({ required: true })
  maxTickets: number;
}
