import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

export async function POST(request) {
  try {
    await dbConnect();
    const { conversationId, userId } = await request.json();
    
    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        'readBy.userId': { $ne: userId }
      },
      {
        $push: {
          readBy: {
            userId: userId,
            readAt: new Date()
          }
        }
      }
    );
    
    // Reset unread count for this user in the conversation
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          [`unreadCount.${userId}`]: 0
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}