import { ObjectId } from "mongodb";
import Post, { IPostDocument } from "../../models/PostModel";
import User from "../../models/UserModel";
import { Result } from "../../types/Post.getAllPost.type";

// interface Result {
//   message: boolean;
//   data?: {
//     posts: {
//       //   _id: string;
//       //   userId: string;
//       //   content: string;
//       //   hashtags?: string[];
//       //   mentions?: string[];
//       //   mediaUrls?: string[];
//       //   likesData?: { _id: string; fullName?: string }[];
//       //   commentsData?: { _id: string; content: string; fullName?: string }[];
//       //   likesCount: number;
//       //   createdAt: string;
//       //   updatedAt: string;
//     }[];
//     totalPosts: number;
//     totalPages: number;
//     currentPage: number;
//   };
//   error?: string;
// }

export const getPostsByUserService = async (
  userId: ObjectId,
  page: number,
  limit: number
): Promise<Result> => {
  try {
    const userExist = await User.findOne({ _id: userId });

    if (!userExist) {
      return {
        error: "Unauthorized",
        message: false,
      };
    }

    const skip = (page - 1) * limit;

    const posts = await Post.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "likesData",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "commentsData",
        },
      },
      {
        $addFields: {
          likesCount: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          postDeleted: 1,
          hashtags: 1,
          mentions: 1,
          media: 1,
          likesData: { _id: 1, fullName: 1 },
          commentsData: { _id: 1, content: 1, fullName: 1, userId: 1 },
          likesCount: 1,
          createdAt: 1,
          updatedAt: 1,
          userId: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPosts = await Post.countDocuments({ userId: userExist._id });

    return {
      message: true,
      data: {
        posts,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error in getPostsByUserService:", error);
    return {
      error: "Internal Server Error",
      message: false,
    };
  }
};
