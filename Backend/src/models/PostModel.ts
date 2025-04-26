import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    userId: string;
    caption?: string;
    imageUrl: string;
    likes: number;
    shares: number;
    comments: Array<{
        userId: string;
        comment: string;
        createdAt: Date;
    }>;
    createdAt: Date;
}

const PostSchema: Schema = new Schema({
    userId: { type: String, required: true },
    caption: { type: String },
    imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: [
        {
            userId: { type: String, required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;