import mongoose, { Schema, Document } from "mongoose";

interface IHighlight extends Document {
  userId: mongoose.Types.ObjectId;
  stories: mongoose.Types.ObjectId[];
  title: string;
  createdAt: Date;
}

const highlightSchema = new Schema<IHighlight>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Highlight = mongoose.model<IHighlight>(
  "Highlight",
  highlightSchema
);
