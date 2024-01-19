import { Ref, modelOptions, prop } from "@typegoose/typegoose";
import { User } from "./user";

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class File {
  @prop()
  name?: string;

  @prop()
  path?: string;

  @prop()
  uploadId?: string;

  @prop()
  size?: number;

  @prop()
  type?: string;

  @prop()
  uploadFinished?: boolean;

  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: Date.now, index: true })
  createdAt?: Date;

  @prop({ default: Date.now, index: true })
  updatedAt?: Date;

  @prop({ default: {} })
  imagesData: {
    id: string;
    variants: string[];
    uploaded: Date;
    filename: string;
    requiredSignedURLs: boolean;
  };

  get url(): string {
    return `${process.env.CDN_URL}/${this.path}`;
  }
}
