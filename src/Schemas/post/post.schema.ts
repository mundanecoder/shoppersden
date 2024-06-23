import { Type, Static } from "@sinclair/typebox";

export const LikePostRequestSchema = Type.Object({
  postId: Type.String({ format: "objectId" }),
});

export const CreatePostRequestSchema = Type.Object({
  content: Type.String(),
  media: Type.Optional(
    Type.Object({
      images: Type.Optional(Type.Array(Type.String())),
      videos: Type.Optional(Type.Array(Type.String())),
    })
  ),
});

export const CreatePostResponseSchema = Type.Object({
  success: Type.Boolean(),
  post: Type.Object({}),
});

export const AddLikePostRequestSchema = Type.Object({
  postId: Type.String(),
});

export const GetPostsByUserIdResponseSchema = Type.Object({
  message: Type.Boolean(),
  data: Type.Object({
    posts: Type.Array(
      Type.Object({
        _id: Type.String(),
        userId: Type.String(),
        content: Type.String(),
        hashtags: Type.Optional(Type.Array(Type.String())),
        mentions: Type.Optional(Type.Array(Type.String())),
        mediaUrls: Type.Optional(Type.Array(Type.String())),
        likesData: Type.Optional(
          Type.Array(
            Type.Object({
              _id: Type.String(),
              fullName: Type.Optional(Type.String()), // Optional fullName
            })
          )
        ),
        commentsData: Type.Optional(
          Type.Array(
            Type.Object({
              _id: Type.String(),
              content: Type.String(),
              userId: Type.String(),
            })
          )
        ),
        likesCount: Type.Number(),
        createdAt: Type.String(),
        updatedAt: Type.String(),
      })
    ),
    totalPosts: Type.Number(),
    totalPages: Type.Number(),
    currentPage: Type.Number(),
  }),
});

export type GetPostsByUserIdResponse = {
  message: boolean;
  data?: {
    posts: {
      _id: string;
      userId: string;
      content: string;
      hashtags?: string[];
      mentions?: string[];
      mediaUrls?: string[];
      likesData?: {
        _id: string;
        fullName: string;
      }[];
      commentsData?: {
        _id: string;
        content: string;
        fullName: string;
      }[];
      likesCount: number;
      createdAt: string;
      updatedAt: string;
    }[];
    totalPosts: number;
    totalPages: number;
    currentPage: number;
  };
};
