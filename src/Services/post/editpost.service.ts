import Post from "../../Models/PostModel";
import { ObjectId } from "mongodb";

interface EditPostParams {
  postId: string;
  content: string;
  media?: {
    images?: string[];
    videos?: string[];
  };
}

export async function editPostService({
  postId,
  content,
  media,
}: EditPostParams) {
  try {
    console.log(postId);
    // Validate postId (optional step depending on your needs)
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    // Find post by ID and update
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content, media },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    return updatedPost;
  } catch (error) {
    console.error("Error in editPostService:", error);
    throw new Error("Error editing post");
  }
}
