import Post from "../../models/PostModel";
import Comment from "../../models/Comment.Model";
import Reply from "../../models/Reply.Model";
import { ObjectId } from "mongodb";

export async function deletePostService(postId: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      throw new Error("Post not found");
    }

    const commentsToDelete = await Comment.find({ postId: postId });

    for (const comment of commentsToDelete) {
      await Comment.findByIdAndDelete(comment._id);
      await Reply.deleteMany({ commentId: comment._id });
    }

    return true;
  } catch (error) {
    console.error("Error in deletePostService:", error);
    throw new Error("Error deleting post");
  }
}
