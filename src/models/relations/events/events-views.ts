import { prop, Ref } from "@typegoose/typegoose";
import { User } from "../../user";

export class EventViews{
    @prop({ ref: () => User })
    user: Ref<User>

    @prop({ ref: () => Event })
    event: Ref<Event>

    @prop({default:()=> new Date()})
    createdAt:Date



}