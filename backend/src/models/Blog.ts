import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  image: string;
  author: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index on author for efficient queries
blogSchema.index({ author: 1, createdAt: -1 });

// Virtual populate for author details
blogSchema.virtual('authorDetails', {
  ref: 'User',
  localField: 'author',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included when converting to JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

export default mongoose.model<IBlog>('Blog', blogSchema);
