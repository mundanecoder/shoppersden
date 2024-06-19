import { Schema, Document, model, Model } from "mongoose";

interface IMentionDocument extends Document {
  mentionUsername: string;
}

const MentionSchema = new Schema<IMentionDocument>({
  mentionUsername: {
    type: String,
    required: true,
    unique: true,
  },
});

const Mention: Model<IMentionDocument> = model<IMentionDocument>(
  "Mention",
  MentionSchema
);

export default Mention;
