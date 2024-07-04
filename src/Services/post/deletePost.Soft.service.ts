import Post from "../../models/PostModel";
import Comment from "../../models/Comment.Model";
import Reply from "../../models/Reply.Model";
import { ObjectId } from "mongodb";

export async function deleteSoftPostService(postId: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    post.postDeleted = true;
    await post.save();

    const commentsToDelete = await Comment.find({ postId: postId });

    for (const comment of commentsToDelete) {
      comment.commentDeleted = true;
      await comment.save();
      await Reply.updateMany({ commentId: comment._id }, { deleted: true });
    }

    return true;
  } catch (error) {
    console.error("Error in deletePostService:", error);
    throw new Error("Error deleting post");
  }
}
