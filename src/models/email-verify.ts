import { prop } from "@typegoose/typegoose";

export class EmailVerify {
    @prop({ type: () => String })
    public email?: string;

    @prop({ type: () => String })
    public token?: string;

    @prop({ type: () => Date , default : Date.now})
    public created_at?: Date;
    
}