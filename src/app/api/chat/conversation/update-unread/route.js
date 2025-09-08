import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';

export async function POST(request) {
  try {
    await dbConnect();
    const { conversationId, userId, increment } = await request.json();

    const update = {};
    
    if (increment) {
      update.$inc = { [`unreadCount.${userId}`]: increment };
    } else {
      update.$set = { [`unreadCount.${userId}`]: 0 };
    }

    await Conversation.findByIdAndUpdate(
      conversationId,
      update,
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating unread count:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}