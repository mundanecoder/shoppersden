import { Schema, Document, model, Model } from "mongoose";
import { ObjectId } from "mongodb";

interface IPostDocument extends Document {
  userId: ObjectId;
  title?: string;
  content: string;
  hashtags?: string[];
  mentions?: ObjectId[];
  media?: {
    images?: string[];
    videos?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface IVideo {
  url: string;
  thumbnailUrl?: string;
  format: string;
  size: number;
  duration: number;
}

interface IImage {
  url: string;
  thumbnailUrl?: string;
  format: string;
  size: number;
}

const PostSchema = new Schema<IPostDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "" },
    content: { type: String, required: true },
    hashtags: { type: [String], index: true },
    mentions: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      index: true,
    },
    media: {
      images: {
        type: [
          {
            url: { type: String, required: true },
            thumbnailUrl: { type: String, required: true },
            format: { type: String, required: true },
            size: { type: Number, required: true },
          },
        ],
        default: [],
      },
      videos: {
        type: [
          {
            url: { type: String, required: true },
            thumbnailUrl: { type: String, required: true },
            format: { type: String, required: true },
            size: { type: Number, required: true },
            duration: { type: Number, required: true },
          },
        ],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPostDocument> = model<IPostDocument>("Post", PostSchema);

export default Post;
