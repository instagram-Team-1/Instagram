import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  media: { type: String, required: true },
  text: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 20 } 
});

const Story = mongoose.model('Story', StorySchema);
export default Story;
