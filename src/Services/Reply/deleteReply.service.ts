import Reply from "../../Models/Reply.Model";
import { ObjectId } from "mongodb";

export async function deleteReplyService(replyId: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(replyId)) {
      throw new Error("Invalid reply ID");
    }

    const deletedReply = await Reply.findByIdAndDelete(replyId);

    if (!deletedReply) {
      throw new Error("Reply not found");
    }

    return true;
  } catch (error) {
    console.error("Error in deleteReplyService:", error);
    throw new Error("Error deleting reply");
  }
}
