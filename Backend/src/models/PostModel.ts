import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  caption?: string;
  imageUrl: string;
  likes: string[];
  shares: number;
  comments: Array<{
    username: string;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  caption: { type: String },
  imageUrl: { type: String, required: true },
  likes: [
    {
      type: String,
      required: true,
      default: 0,
    },
  ],
  shares: { type: Number, default: 0 },
  comments: [
    {
      username: { type: String, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
