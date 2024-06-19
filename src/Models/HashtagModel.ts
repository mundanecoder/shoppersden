import { Schema, Document, model, Model } from "mongoose";

export interface IHashtag {
    label: string;
    hitCountDay: number;
    hitCountWeek: number;
    hitCountMonth: number;
}

export interface IHashtagDocument extends IHashtag, Document {
  createdAt: Date;
  updatedAt: Date;
}

const HashtagSchema = new Schema<IHashtagDocument>(
  {
    label: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1, 
      maxlength: 20
    },
    hitCountDay: { type: Number, default: 0 },
    hitCountWeek: { type: Number, default: 0 },
    hitCountMonth: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

HashtagSchema.index({ label: 1 });

const Hashtag: Model<IHashtagDocument> = model<IHashtagDocument>("Hashtag", HashtagSchema);

export default Hashtag;
