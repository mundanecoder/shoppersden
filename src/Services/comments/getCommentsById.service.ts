import { ObjectId } from "mongodb";
import Comment, { ICommentDocument } from "../../Models/Comment.Model";
import User from "../../Models/UserModel";

interface Result {
  message: boolean;
  data?: {
    comments: ICommentDocument[];
    totalComments: number;
    totalPages: number;
    currentPage: number;
  };
  error?: string;
}

export const getCommentsByCommentIdService = async (
  commentId: string,
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
    const objectIdCommentId = new ObjectId(commentId);

    const comments = await Comment.aggregate([
      { $match: { _id: objectIdCommentId, userId: userId } },
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
          from: "replies",
          localField: "replies",
          foreignField: "_id",
          as: "repliesData",
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
          content: 1,
          hashtags: 1,
          mentions: 1,
          media: 1,
          likesData: { _id: 1, fullName: 1 },
          repliesData: { _id: 1, content: 1, userId: 1, createdAt: 1 },
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

    if (!comments || comments.length === 0) {
      return {
        error: "Not Found",
        message: false,
      };
    }

    const totalComments = await Comment.countDocuments({
      _id: objectIdCommentId,
      userId: userExist._id,
    });

    return {
      message: true,
      data: {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error("Error in getCommentsByCommentIdService:", error);
    return {
      error: "Internal Server Error",
      message: false,
    };
  }
};
