import { Schema, Document, model, Model } from "mongoose";
import { ObjectId } from "mongodb";

export interface IReplyDocument extends Document {
  commentId: ObjectId;
  userId: ObjectId;
  content: string;
  mentions: ObjectId[];
  hashtags: string[];
  media?: {
    url?: string;
    format?: string;
    size?: number;
  };
  likes: ObjectId[];
  replyDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReplyDocument>(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [1, "Content cannot be empty"],
      maxlength: [500, "Content cannot exceed 500 characters"],
    },
    mentions: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      index: true,
      default: [],
    },
    media: {
      type: {
        url: { type: String },
        format: { type: String },
        size: { type: Number },
      },

      default: {},
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    hashtags: {
      type: [String],
      index: true,
      default: [],
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
    replyDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Reply: Model<IReplyDocument> = model<IReplyDocument>(
  "Reply",
  ReplySchema
);

export default Reply;
