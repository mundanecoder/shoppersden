import Reply from "../../models/Reply.Model";
import User from "../../models/UserModel";
import { ObjectId } from "mongodb";

interface EditReplyParams {
  replyId: string;
  userId: ObjectId;
  content: string;
  media?: {
    url?: string;
    format?: string;
    size?: number;
  };
}

export async function editReplyService(params: EditReplyParams) {
  const { replyId, userId, content, media } = params;

  try {
    const reply = await Reply.findOne({ _id: replyId });

    if (!reply) {
      throw new Error("Reply not found");
    }

    if (!reply.userId.equals(userId)) {
      throw new Error("Unauthorized");
    }

    let contentUpdated = false;

    if (reply.content !== content) {
      reply.content = content;
      contentUpdated = true;

      const newMentions = content.match(/@\w+/g) || [];
      const newHashtags = content.match(/#\w+/g) || [];

      const mentionUserIds = await User.find({
        userName: { $in: newMentions.map((mention) => mention.slice(1)) },
      }).select("_id");

      const newMentionIds: any[] = mentionUserIds.map((user) => user._id);

      if (!arraysAreEqual(reply.mentions, newMentionIds)) {
        reply.mentions = newMentionIds;
      }

      if (!arraysAreEqual(reply.hashtags, newHashtags)) {
        reply.hashtags = newHashtags;
      }
    }

    if (media) {
      reply.media = media;
    } else {
      reply.media = media;
    }

    reply.updatedAt = new Date();

    if (contentUpdated || media) {
      const updatedReply = await reply.save();
      return updatedReply;
    }

    return reply;
  } catch (error) {
    console.error("Error editing reply:", error);
    throw new Error("Error editing reply");
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
