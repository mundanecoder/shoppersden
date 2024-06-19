import { Schema, Document, model, Model } from "mongoose";

interface IHashtagDocument extends Document {
  hashtagText: string;
}

const HashtagSchema = new Schema<IHashtagDocument>({
  hashtagText: {
    type: String,
    required: true,
    unique: true,
  },
});

const Hashtag: Model<IHashtagDocument> = model<IHashtagDocument>(
  "Hashtag",
  HashtagSchema
);

export default Hashtag;
