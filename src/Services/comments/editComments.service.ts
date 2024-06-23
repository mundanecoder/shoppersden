import Comment from "../../Models/Comment.Model";
import User from "../../Models/UserModel";
import { ObjectId } from "mongodb";

interface EditCommentParams {
  commentId: string;
  userId: ObjectId;
  content: string;
  media?: {};
}

export async function editCommentService(params: EditCommentParams) {
  const { commentId, userId, content, media } = params;
  console.log("here 0");

  try {
    const comment = await Comment.findOne({ _id: commentId });

    console.log("here 4", comment);

    if (!comment) {
      console.log("no comment");
      throw new Error("Comment not found");
    }

    if (!comment.userId.equals(userId)) {
      throw new Error("Unauthorized");
    }

    console.log("here 3");

    let contentUpdated = false;

    if (comment.content !== content) {
      comment.content = content;
      contentUpdated = true;

      const newMentions = content.match(/@\w+/g) || [];
      const newHashtags = content.match(/#\w+/g) || [];

      const mentionUserIds = await User.find({
        userName: { $in: newMentions.map((mention) => mention.slice(1)) },
      }).select("_id");

      const newMentionIds: any[] = mentionUserIds.map((user) => user._id);
      console.log("here 2");

      if (!arraysAreEqual(comment.mentions, newMentionIds)) {
        comment.mentions = newMentionIds;
      }

      if (!arraysAreEqual(comment.hashtags, newHashtags)) {
        comment.hashtags = newHashtags;
      }
    }

    if (media) {
      comment.media = media;
    } else {
      comment.media = media;
    }

    console.log("here 4");

    if (contentUpdated || media) {
      const updatedComment = await comment.save();
      return updatedComment;
    }

    return comment;
  } catch (error) {
    console.error("Error editing comment:", error);
    throw new Error("Error editing comment");
  }
}

function arraysAreEqual(
  arr1: (string | ObjectId | unknown)[] | undefined,
  arr2: (string | ObjectId | unknown)[] | undefined
): boolean {
  if (!arr1 || !arr2) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (String(arr1[i]) !== String(arr2[i])) {
      return false;
    }
  }
  return true;
}
