import Post from "../../Models/PostModel";
import { ObjectId } from "@fastify/mongodb";

export interface AddLikeParams {
  postId: string;
  userId: ObjectId;
}

export async function addLikeToPostService(params: AddLikeParams) {
  const { postId, userId } = params;

  console.log("Parameters received - postId:", postId, "userId:", userId);

  try {
    if (!ObjectId.isValid(postId)) {
      throw new Error("Invalid postId");
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const userIdString = userId.toString();

    const userHasLiked = post.likes.some(
      (likeId: ObjectId) => likeId.toString() === userIdString
    );

    // Handle both like and unlike a post
    if (userHasLiked) {
      post.likes = post.likes.filter(
        (likeId: ObjectId) => likeId.toString() !== userIdString
      );
    } else {
      post.likes.push(new ObjectId(userId));
    }

    const updatedPost = await post.save();
    return updatedPost;
  } catch (error) {
    console.error("Error updating likes on post:", error);
    throw new Error("Error updating likes on post");
  }
}
