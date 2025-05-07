import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  fullname: string;
  email?: string;
  phone?: string;
  password: string;
  bio?: string;
  avatarImage?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts?: mongoose.Types.ObjectId[];
  isPrivate: {
    type: boolean;
    default: false;
  };
  createdAt: Date;
  updateAt: Date;
  savedPosts: mongoose.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: { type: String },
    avatarImage: { type: String },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isPrivate: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
