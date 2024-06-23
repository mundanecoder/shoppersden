import { Type, Static } from "@sinclair/typebox";

// Request schema for adding a comment
export const AddCommentRequestSchema = Type.Object({
  content: Type.String(),
  media: Type.Optional(
    Type.Array(
      Type.Object({
        images: Type.Object({
          url: Type.String(),
          format: Type.String(),
          size: Type.Number(),
        }),
      })
    )
  ),
});

export const CreateCommentResponseSchema = Type.Object({
  success: Type.Boolean(),
  comment: Type.Object({
    _id: Type.String({ format: "objectId" }),
    postId: Type.String({ format: "objectId" }),
    userId: Type.String({ format: "objectId" }),
    content: Type.String(),
    mentions: Type.Array(Type.String({ format: "objectId" })),
    hashtags: Type.Array(Type.String()),
    media: Type.Optional(
      Type.Object({
        url: Type.String(),
        format: Type.String(),
        size: Type.Number(),
      })
    ),
    replies: Type.Array(Type.String({ format: "objectId" })),
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" }),
  }),
});
export const EditCommentRequestSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 500,
  }),
  media: Type.Optional(
    Type.Object({
      url: Type.String(),
      format: Type.String(),
      size: Type.Number(),
    })
  ),
});

// Response schema for the edited comment
export const EditCommentResponseSchema = Type.Object({
  success: Type.Boolean(),
  comment: Type.Object({
    _id: Type.String(),
    postId: Type.String(),
    userId: Type.String(),
    content: Type.String(),
    mentions: Type.Array(Type.String()),
    hashtags: Type.Array(Type.String()),
    media: Type.Optional(
      Type.Object({
        images: Type.Optional(Type.String()),
      })
    ),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
});

// Error response schema
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
              fullName: Type.Optional(Type.String()), // Optional fullName
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

export const ReplySchema = Type.Object({
  _id: Type.String(),
  userId: Type.String(),
  content: Type.String(),
  createdAt: Type.String(),
});

export const CommentSchema = Type.Object({
  _id: Type.String(),
  content: Type.String(),
  userId: Type.String(),
  likesCount: Type.Number(),
  likesData: Type.Array(
    Type.Object({
      _id: Type.String(),
      fullName: Type.Optional(Type.String()),
    })
  ),
  repliesData: Type.Array(
    Type.Object({
      _id: Type.String(),
      content: Type.String(),
      userId: Type.String(),
      createdAt: Type.String(),
    })
  ),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const GetCommentsByUserIdResponseSchema = Type.Object({
  data: Type.Object({
    comments: Type.Array(CommentSchema),
    totalComments: Type.Number(),
    totalPages: Type.Number(),
    currentPage: Type.Number(),
  }),
});

export type GetCommentsByUserIdResponse =
  typeof GetCommentsByUserIdResponseSchema;
