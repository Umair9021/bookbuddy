
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ 
    type: String, 
    ref: 'User',
    required: true 
  }],
  lastMessage: {
    content: { type: String, default: '' },
    senderId: { type: String, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);