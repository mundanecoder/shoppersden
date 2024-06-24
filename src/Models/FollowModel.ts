import { Schema, Document, model, Model } from "mongoose";

export interface IFollow {
  followerId: string;
  followingId: string;
  followType: 'user' | 'shop';
}

export interface IFollowDocument extends IFollow, Document {
  createdAt: Date;
  updatedAt: Date;
}

const FollowSchema = new Schema<IFollowDocument>(
  {
    followerId: {
      type: String,
      required: true,
      index: true,
    },
    followingId: {
      type: String,
      required: true,
      index: true,
    },
    followType: {
      type: String,
      required: true,
      enum: ['user', 'shop'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

FollowSchema.index({ followerId: 1, followingId: 1, followType: 1 }, { unique: true });

const Follow: Model<IFollowDocument> = model<IFollowDocument>("Follow", FollowSchema);

export default Follow;
