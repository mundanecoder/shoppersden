import Comment, { ICommentDocument } from "../../models/Comment.Model";
import User from "../../models/UserModel";
import Post from "../../models/PostModel";
import { ObjectId } from "mongodb";

export interface AddCommentParams {
  postId: string;
  userId: ObjectId | undefined;
  content: string;
  media?: { url?: string; format?: string; size?: number };
}

export async function addCommentToPostService(params: AddCommentParams) {
  const { postId, userId, content, media } = params;

  // Extract hashtags and mentions from content
  const hashtags = content.match(/#\w+/g) || [];
  const mentions = content.match(/@\w+/g) || [];

  try {
    const postExist = await Post.findOne({ _id: postId });
    if (!postExist) {
      return {
        message: false,
        error: "Could not find post",
      };
    }

    const mentionUserIds = await User.find({
      userName: { $in: mentions.map((mention) => mention.slice(1)) },
    }).select("_id");

    const populatedMentionUserIds: ObjectId[] = mentionUserIds.map(
      (user) => user._id
    ) as ObjectId[];

    // Create new Comment document
    const comment = new Comment({
      postId,
      userId,
      content,
      mentions: populatedMentionUserIds,
      hashtags,
      media,
    });

    // Save the comment to the database
    const savedComment = await comment.save();

    await Post.updateOne(
      { _id: postId },
      { $push: { comments: savedComment._id } }
    );

    await savedComment.populate({
      path: "userId",
      select: "_id fullName",
      model: User,
    });

    return savedComment as ICommentDocument;
  } catch (error) {
    console.error("Error adding comment to post:", error);
    throw new Error("Error adding comment to post");
  }
}
