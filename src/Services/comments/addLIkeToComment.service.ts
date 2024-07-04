import Comment from "../../Models/Comment.Model";
import { ObjectId } from "mongodb";

export interface AddLikeToCommentParams {
  commentId: string;
  userId: ObjectId;
}

export async function addLikeToCommentService(params: AddLikeToCommentParams) {
  const { commentId, userId } = params;

  try {
    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid commentId");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const userIdString = userId.toString();
    const userHasLiked = comment.likes.some(
      (likeId: ObjectId) => likeId.toString() === userIdString
    );

    const updateOperation = userHasLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateOperation,
      { new: true }
    );

    return updatedComment;
  } catch (error) {
    console.error("Error updating likes on comment:", error);
    throw new Error("Error updating likes on comment");
  }
}
