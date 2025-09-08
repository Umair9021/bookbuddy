import dbConnect from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const messages = await Message.find({
      conversationId: conversationId
    })
      .populate('senderId', 'name dp')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    return NextResponse.json({ 
      success: true, 
      messages: messages.reverse() 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { 
      conversationId, 
      senderId, 
      content, 
      messageType = 'text',
      fileUrl = '',
      fileName = '',
      fileSize = 0
    } = body;

    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize
    });

    // Get conversation to update last message and unread count
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Update conversation's last message
    const otherParticipant = conversation.participants.find(
      participant => participant.toString() !== senderId
    );

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: messageType === 'text' ? content : `📎 ${fileName || 'File'}`,
        senderId: senderId,
        timestamp: new Date(),
        messageType: messageType
      },
      $inc: {
        [`unreadCount.${otherParticipant}`]: 1
      }
    });

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name dp');

    return NextResponse.json(
      { success: true, message: populatedMessage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}