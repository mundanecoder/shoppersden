import { Schema, Document, model, Model } from "mongoose";
import { ObjectId } from "mongodb";

interface IComment extends Document {
  userId: ObjectId;
  content: string;
  createdAt: Date;
}

export interface IPostDocument extends Document {
  _id: ObjectId;
  title: string;
  userId: ObjectId;
  content: string;
  hashtags?: string[];
  mentions?: string[];
  media?: {
    images?: string[];
    videos?: string[];
  };
  likes: ObjectId[];
  comments: {
    _id: ObjectId;
    content: string;
    userId: ObjectId; // Assuming userId is ObjectId, change to string if it's string
    createdAt: Date;
  }[];
  postDeleted: boolean;
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
  url: string | null;
  thumbnailUrl?: string | null;
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
            thumbnailUrl: { type: String },
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
            thumbnailUrl: { type: String },
            format: { type: String, required: true },
            size: { type: Number, required: true },
            duration: { type: Number, required: true },
          },
        ],
        default: [],
      },
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    postDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPostDocument> = model<IPostDocument>("Post", PostSchema);

export default Post;
