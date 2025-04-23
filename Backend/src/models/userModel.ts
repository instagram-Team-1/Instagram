import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  fullname: string;
  email?: string;
  phone?: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
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
    required: true
  },
}, {
  timestamps: true,
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
