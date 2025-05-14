import mongoose, { Document, Schema } from "mongoose";

export interface IStory extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
  expiresAt: Date;
  viewers: string[];
  highlightTitle?: string;
}

const storySchema = new Schema<IStory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    caption: { type: String },
    expiresAt: { type: Date, required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    highlightTitle: { type: String, default: null },
  },
  { timestamps: true }
);

export const Story = mongoose.model<IStory>("Story", storySchema);
