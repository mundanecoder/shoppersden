// src/Schemas/post.schema.ts
import { ObjectId } from "@fastify/mongodb";
import { Type, Static } from "@sinclair/typebox";

// export const PostRequestSchema = Type.Object({
//   content: Type.String({ minLength: 1 }),
//   hashtags: Type.Optional(Type.Array(Type.String())),
//   mentions: Type.Optional(Type.Array(Type.String())),
//   mediaUrls: Type.Optional(Type.Array(Type.String())),
// });
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

// export const PostResponseSchema = Type.Object({
//   _id: Type.String(),
//   content: Type.String(),
//   hashtags: Type.Optional(Type.Array(Type.String())),
//   mentions: Type.Optional(Type.Array(Type.String())),
//   mediaUrls: Type.Optional(Type.Array(Type.String())),
//   createdAt: Type.String(),
//   updatedAt: Type.String(),
// });

export const GetPostsByUserIdResponseSchema = Type.Object({
  message: Type.Boolean(),
  data: Type.Array(
    Type.Object({
      _id: Type.String(),
      userId: Type.String(),
      content: Type.String(),
      hashtags: Type.Optional(Type.Array(Type.String())),
      mentions: Type.Optional(Type.Array(Type.String())),
      mediaUrls: Type.Optional(Type.Array(Type.String())),
      createdAt: Type.String(),
      updatedAt: Type.String(),
    })
  ),
});

// export type PostRequest = Static<typeof PostRequestSchema>;
// export type PostResponse = Static<typeof PostResponseSchema>;

export type GetPostsByUserIdResponse = Static<
  typeof GetPostsByUserIdResponseSchema
>;
