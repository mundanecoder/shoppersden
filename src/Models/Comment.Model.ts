import { Schema, Document, model, Model } from "mongoose";
import { ObjectId } from "mongodb";

export interface ICommentDocument extends Document {
  postId: ObjectId;
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
  replies: ObjectId[];
  commentDeleted: boolean;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
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

    mentions: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      index: true,
      default: [],
    },
    hashtags: {
      type: [String],
      index: true,
      default: [],
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
    commentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const Comment: Model<ICommentDocument> = model<ICommentDocument>(
  "comment",
  CommentSchema
);

export default Comment;
