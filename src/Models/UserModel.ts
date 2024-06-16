import { Schema, Document, model, Model } from "mongoose";

export interface IUser {
  firstname: string;
  lastName: string;
  fullName: string;
  phoneNumbers?: string;
  age?: number;
  gender?: string;
  email: string;
  userDeleted?: boolean;
  clerkId: string;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    clerkId: {
      type: "string",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumbers: {
      type: Array,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    userDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUserDocument> = model<IUserDocument>("User", UserSchema);

export default User;
