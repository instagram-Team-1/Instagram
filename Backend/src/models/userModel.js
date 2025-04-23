
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
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
})

export const User = mongoose.model('User', userSchema)
