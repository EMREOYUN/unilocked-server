import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true ,getters : true},
    toObject: { virtuals: true, getters : true },
  },
})
export class CustomPage {
  @prop({ type: () => Number, index: true, unique: true })
  public id!: number;

  @prop({ type: () => String })
  public title?: string;

  @prop({ type: () => String })
  public body!: string;

  @prop({ type: () => String })
  public slug!: string;

  @prop({ type: () => Object })
  public meta?: object;

  @prop({ type: () => String })
  public type!: string;

  @prop({ type: () => Date , default: Date.now})
  public created_at?: Date;

  @prop({ type: () => Date,default: Date.now })
  public updated_at?: Date;

  @prop({ ref: () => User })
  public user?: Ref<User>;

  @prop({ type: () => Boolean ,default: false})
  public hide_nav!: boolean;

  @prop({ type: () => Number })
  public workspace_id?: number;

}
