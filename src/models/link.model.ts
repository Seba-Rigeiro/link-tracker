import { prop } from '@typegoose/typegoose';

export class Link {
  @prop()
  _id: string;

  @prop()
  target: string;

  @prop()
  link: string;

  @prop()
  valid: boolean;

  @prop({ default: 0 })
  redirectCount: number;

  @prop()
  expireIn: number;
}
