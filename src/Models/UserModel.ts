import { Schema, Document, model, Model } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumbers?: string[];
  age?: number;
  gender?: string;
  email: string;
  userDeleted?: boolean;
  clerkId: string;
  userName: string;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    clerkId: {
      type: String,
      required: true,
    },
    firstName: {
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
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumbers: {
      type: [String],
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email address",
      },
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
