import { ObjectId } from "mongodb";

export interface Like {
  _id: ObjectId;
  fullName?: string;
  userName?: string;
  email?: string;
}

export interface Comment {
  _id: ObjectId;
  content: string;
  fullName?: string;
  userId?: ObjectId;
  createdAt?: Date;
}

export interface PostData {
  _id: ObjectId;
  userId: ObjectId;
  title?: string;
  content: string;
  hashtags?: string[];
  mentions?: ObjectId[];
  media?: {
    images?: string[];
    videos?: string[];
  };
  likesData: Like[];
  commentsData: Comment[];
  likesCount: number;
  postDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Result {
  message: boolean;
  data?: {
    posts: PostData[];
    totalPosts: number;
    totalPages: number;
    currentPage: number;
  };
  error?: string;
}
