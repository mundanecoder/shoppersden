import { ObjectId } from "@fastify/mongodb";
import Post from "../../Models/PostModel";
import User from "../../Models/UserModel";
import Hashtag from "../../Models/HashtagModel";
import { FastifyRequest } from "fastify";

interface CreatePostParams {
  userId: ObjectId | undefined;
  content: string;
  media?: {
    images?: string[];
    videos?: string[];
  };
}

export async function createNewPostService(params: CreatePostParams) {
  const { userId, content, media } = params;

  const hashtags = content.match(/#\w+/g) || [];
  const mentions = content.match(/@\w+/g) || [];

  console.log(mentions, hashtags, "mentions");

  // Get mention user IDs
  const mentionUserIds = await User.find({
    userName: { $in: mentions.map((mention) => mention.slice(1)) },
  }).select("_id");

  const hashtagIds = await Promise.all(
    hashtags.map(async (hashtag) => {
      const label = hashtag.slice(1);
      let hashtagDoc = await Hashtag.findOne({ label });

      if (hashtagDoc) {
        hashtagDoc.hitCountDay += 1;
        hashtagDoc.hitCountWeek += 1;
        hashtagDoc.hitCountMonth += 1;
        await hashtagDoc.save();
      } else {
        hashtagDoc = new Hashtag({
          label,
          hitCountDay: 1,
          hitCountWeek: 1,
          hitCountMonth: 1,
        });
        await hashtagDoc.save();
      }

      return hashtagDoc._id;
    })
  );

  const newPost = new Post({
    userId,
    content,
    hashtags: hashtagIds,
    mentions: mentionUserIds.map((user) => user._id),
    media,
  });

  try {
    const savedPost = await newPost.save();
    return savedPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post");
  }
}

export async function handleCreateNewPost(req: FastifyRequest) {
  const userData = req.user;

  const { content, media } = req.body as CreatePostParams;

  try {
    const savedPost = await createNewPostService({
      userId: userData?._MongoId,
      content,
      media,
    });

    console.log(savedPost);
    return { success: true, post: savedPost };
  } catch (error) {
    console.error("Error in createNewPostService:", error);
    throw new Error("Internal Server Error");
  }
}
