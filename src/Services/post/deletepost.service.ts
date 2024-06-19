import Post from "../../Models/PostModel";
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

    return true;
  } catch (error) {
    console.error("Error in deletePostService:", error);
    throw new Error("Error deleting post");
  }
}
