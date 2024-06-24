import { Type, Static } from "@sinclair/typebox";

// Request schema for adding a reply
export const AddReplyRequestSchema = Type.Object({
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
export const AddReplySchema = Type.Object({
  content: Type.String(),
  media: Type.Optional(
    Type.Object({
      images: Type.Optional(
        Type.Object({
          url: Type.String(),
          format: Type.String(),
          size: Type.Number(),
        })
      ),
    })
  ),
});

export const EditReplyRequestSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 500,
  }),
  media: Type.Optional(
    Type.Object({
      images: Type.Optional(
        Type.Object({
          url: Type.String(),
          format: Type.String(),
          size: Type.Number(),
        })
      ),
    })
  ),
});

export const EditCommentRequestSchema = Type.Object({
  content: Type.String({
    minLength: 1,
    maxLength: 500,
  }),
  media: Type.Optional(
    Type.Object({
      images: Type.Optional(
        Type.Object({
          url: Type.String(),
          format: Type.String(),
          size: Type.Number(),
        })
      ),
    })
  ),
});

export const EditReplyResponseSchema = Type.Object({
  success: Type.Boolean(),
  reply: Type.Object({
    _id: Type.String(),
    // commentId: Type.String(),
    // userId: Type.String(),
    content: Type.Optional(Type.String()),
    mentions: Type.Optional(Type.Array(Type.String())),
    hashtags: Type.Optional(Type.Array(Type.String())),
    media: Type.Optional(
      Type.Object({
        url: Type.Optional(Type.String()),
        format: Type.Optional(Type.String()),
        size: Type.Optional(Type.Number()),
      })
    ),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
});

// Response schema for the added reply
export const AddReplyResponseSchema = Type.Object({
  success: Type.Boolean(),
  reply: Type.Object({
    _id: Type.String(),
    postId: Type.String(),
    userId: Type.String(),
    content: Type.String(),
    mentions: Type.Array(Type.String()),
    hashtags: Type.Array(Type.String()),
    media: Type.Optional(
      Type.Object({
        images: Type.Optional(
          Type.Object({
            url: Type.String(),
            format: Type.String(),
            size: Type.Number(),
          })
        ),
      })
    ),
    replies: Type.Array(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
  }),
});

// Define the type for TypeScript from the schema
export type AddReplyRequestType = Static<typeof AddReplyRequestSchema>;
export type AddReplyResponseType = Static<typeof AddReplyResponseSchema>;
