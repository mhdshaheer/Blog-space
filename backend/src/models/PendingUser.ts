import mongoose, { Document, Schema } from 'mongoose';

export interface IPendingUser extends Document {
  username: string;
  email: string;
  password: string;
  otp: string;
  createdAt: Date;
}

const pendingUserSchema = new Schema<IPendingUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // This is the MAGIC: MongoDB will auto-delete this after 600 seconds (10 mins)
  }
});

export default mongoose.model<IPendingUser>('PendingUser', pendingUserSchema);
