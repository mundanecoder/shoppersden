import Reply from "../../Models/Reply.Model"; // Assuming you have a Reply model similar to Comment
import { ObjectId } from "mongodb";

export interface AddLikeToReplyParams {
  replyId: string;
  userId: ObjectId;
}

export async function addLikeToReplyService(params: AddLikeToReplyParams) {
  const { replyId, userId } = params;

  try {
    if (!ObjectId.isValid(replyId)) {
      throw new Error("Invalid replyId");
    }

    const reply = await Reply.findById(replyId);
    if (!reply) {
      throw new Error("Reply not found");
    }

    const userIdString = userId.toString();
    const userHasLiked = reply.likes.some(
      (likeId: ObjectId) => likeId.toString() === userIdString
    );

    const updateOperation = userHasLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updatedReply = await Reply.findByIdAndUpdate(
      replyId,
      updateOperation,
      { new: true }
    );

    return updatedReply;
  } catch (error) {
    console.error("Error updating likes on reply:", error);
    throw new Error("Error updating likes on reply");
  }
}
