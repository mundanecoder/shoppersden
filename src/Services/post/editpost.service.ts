import Post, { IPostDocument } from "../../Models/PostModel";
import User from "../../Models/UserModel";
import Hashtag from "../../Models/HashtagModel";
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

    const post: IPostDocument | null = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    let contentUpdated = false;

    if (post.content !== content) {
      const oldHashtags = post.hashtags || [];
      for (const oldHashtagId of oldHashtags) {
        const oldHashtag = await Hashtag.findById(oldHashtagId);
        if (oldHashtag) {
          oldHashtag.hitCountDay = Math.max(0, oldHashtag.hitCountDay - 1);
          oldHashtag.hitCountWeek = Math.max(0, oldHashtag.hitCountWeek - 1);
          oldHashtag.hitCountMonth = Math.max(0, oldHashtag.hitCountMonth - 1);
          await oldHashtag.save();
        }
      }

      post.content = content;
      contentUpdated = true;

      const newMentions = content.match(/@\w+/g) || [];
      const newHashtags = content.match(/#\w+/g) || [];

      const mentionUserIds = await User.find({
        userName: { $in: newMentions.map((mention) => mention.slice(1)) },
      }).select("_id");

      const newMentionIds: any[] = mentionUserIds.map((user) => user._id);

      if (!arraysAreEqual(post.mentions, newMentionIds)) {
        post.mentions = newMentionIds;
      }

      if (!arraysAreEqual(post.hashtags, newHashtags)) {
        post.hashtags = newHashtags;
      }
    }

    if (media) {
      post.media = media;
    } else {
      post.media = media;
    }

    if (contentUpdated || media) {
      const updatedPost = await post.save();
      return updatedPost;
    }

    return post;
  } catch (error) {
    console.error("Error in editPostService:", error);
    throw new Error("Error editing post");
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
