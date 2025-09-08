// models/UserActivity.js
import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  currentConversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.models.UserActivity || mongoose.model('UserActivity', userActivitySchema);