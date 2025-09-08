import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import { NextResponse } from 'next/server';

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

    // Validate required fields
    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: conversationId, senderId, content' },
        { status: 400 }
      );
    }

    // Create the message
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      messageType,
      fileUrl,
      fileName,
      fileSize
    });

    // Get the conversation to update last message
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Find the other participant
    const otherParticipant = conversation.participants.find(
      participant => participant.toString() !== senderId
    );

    // Update conversation's last message and unread count
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: {
          content: messageType === 'text' ? content : `📎 ${fileName || 'File'}`,
          senderId: senderId,
          timestamp: new Date(),
          messageType: messageType
        },
        $inc: {
          [`unreadCount.${otherParticipant}`]: 1
        }
      },
      { new: true }
    );

    // Populate sender information
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name dp email');

    return NextResponse.json(
      { 
        success: true, 
        message: {
          _id: populatedMessage._id.toString(),
          conversationId: populatedMessage.conversationId.toString(),
          senderId: {
            _id: populatedMessage.senderId._id.toString(),
            name: populatedMessage.senderId.name,
            dp: populatedMessage.senderId.dp,
            email: populatedMessage.senderId.email
          },
          content: populatedMessage.content,
          messageType: populatedMessage.messageType,
          createdAt: populatedMessage.createdAt,
          updatedAt: populatedMessage.updatedAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}