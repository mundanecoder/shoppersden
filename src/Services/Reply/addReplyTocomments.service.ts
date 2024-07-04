import Reply, { IReplyDocument } from "../../models/Reply.Model";
import User from "../../models/UserModel";
import Comment, { ICommentDocument } from "../../models/Comment.Model";
import { ObjectId } from "mongodb";

interface AddReplyParams {
  commentId: string;
  userId: ObjectId | undefined;
  content: string;
  media?: {
    url?: string;
    format?: string;
    size?: number;
  };
}

export async function addReplyToCommentService(params: AddReplyParams) {
  const { commentId, userId, content, media } = params;

  // Extract hashtags and mentions from content
  const hashtags = content.match(/#\w+/g) || [];
  const mentions = content.match(/@\w+/g) || [];

  console.log("here", commentId, userId, content, media);
  try {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      throw new Error("Comment not found");
    }

    const mentionUserIds = await User.find({
      userName: { $in: mentions.map((mention: string) => mention.slice(1)) }, // slice(1) removes the '@' symbol
    }).select("_id");

    const populatedMentionUserIds: ObjectId[] = mentionUserIds.map(
      (user) => user._id
    ) as ObjectId[];

    const reply = new Reply({
      commentId,
      userId,
      content,
      mentions: populatedMentionUserIds,
      hashtags,
      media: media || {},
    });

    const savedReply = await reply.save();

    await Comment.updateOne(
      { _id: commentId },
      { $push: { replies: savedReply._id } }
    );

    await savedReply.populate({
      path: "userId",
      select: "_id fullName",
      model: User,
    });

    return savedReply as IReplyDocument;
  } catch (error) {
    console.error("Error adding reply to comment:", error);
    throw new Error("Error adding reply to comment");
  }
}
