import { Schema, Document, model, Model } from "mongoose";

export interface IHashtag {
    label: string;
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
  },
  {
    timestamps: true,
  }
);

HashtagSchema.index({ label: 1 });

/**
 * Keeping placeholder for pre-save hook if needed in future for processing data before saving to database
 * -------------------------------------------------------------------------------------------------------
 * HashtagSchema.pre<IHashtagDocument>("save", function(next) {
    next();
  });
 */

const Hashtag: Model<IHashtagDocument> = model<IHashtagDocument>("Hashtag", HashtagSchema);

export default Hashtag;