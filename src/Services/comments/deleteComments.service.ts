import Comment from "../../models/Comment.Model";
import Reply from "../../models/Reply.Model";
import { ObjectId } from "mongodb";

export async function deleteCommentService(
  commentId: string
): Promise<boolean> {
  try {
    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID");
    }

    // Find the comment by ID and delete it
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new Error("Comment not found");
    }

    // Delete all replies associated with the deleted comment
    await Reply.deleteMany({ commentId: commentId });

    return true;
  } catch (error) {
    console.error("Error in deleteCommentService:", error);
    throw new Error("Error deleting comment");
  }
}
