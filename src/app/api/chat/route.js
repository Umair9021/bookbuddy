
// import Ably from 'ably/promises';
// import dbConnect from '@/lib/db';
// import Conversation from '@/models/Conversation';
// import Message from '@/models/Message';

// const ably = new Ably.Realtime(process.env.ABLY_API_KEY);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       await dbConnect();
      
//       const { conversationId, senderId, content, messageType = 'text' } = req.body;

//       // Save to MongoDB
//       const message = await Message.create({
//         conversationId,
//         senderId,
//         content,
//         messageType
//       });

//       // Get conversation details
//       const conversation = await Conversation.findById(conversationId)
//         .populate('participants', 'name dp');

//       // Update conversation last message
//       await Conversation.findByIdAndUpdate(conversationId, {
//         'lastMessage.content': content,
//         'lastMessage.senderId': senderId,
//         'lastMessage.timestamp': new Date(),
//         'lastMessage.messageType': messageType
//       });

//       // Get sender details
//       const populatedMessage = await Message.findById(message._id)
//         .populate('senderId', 'name dp');

//       // Send via Ably for real-time
//       const channel = ably.channels.get(`chat-${conversationId}`);
//       await channel.publish('message', {
//         _id: message._id,
//         conversationId,
//         senderId,
//         senderName: populatedMessage.senderId.name,
//         senderDp: populatedMessage.senderId.dp,
//         content,
//         messageType,
//         createdAt: message.createdAt
//       });

//       res.status(201).json({ success: true, message: populatedMessage });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   }
// }



// import Ably from 'ably';
// import dbConnect from '@/lib/db';
// import Conversation from '@/models/Conversation';
// import Message from '@/models/Message';

// const ably = new Ably.Realtime(process.env.ABLY_API_KEY);

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { conversationId, senderId, content, messageType = 'text' } = await request.json();

//     // Save to MongoDB
//     const message = await Message.create({
//       conversationId,
//       senderId,
//       content,
//       messageType
//     });

//     // Get conversation details
//     const conversation = await Conversation.findById(conversationId)
//       .populate('participants', 'name dp');

//     // Update conversation last message
//     await Conversation.findByIdAndUpdate(conversationId, {
//       'lastMessage.content': content,
//       'lastMessage.senderId': senderId,
//       'lastMessage.timestamp': new Date(),
//       'lastMessage.messageType': messageType
//     });

//     // Get sender details
//     const populatedMessage = await Message.findById(message._id)
//       .populate('senderId', 'name dp');

//     // Send via Ably for real-time
//     const channel = ably.channels.get(`chat-${conversationId}`);
//     await channel.publish('message', {
//       _id: message._id,
//       conversationId,
//       senderId,
//       senderName: populatedMessage.senderId.name,
//       senderDp: populatedMessage.senderId.dp,
//       content,
//       messageType,
//       createdAt: message.createdAt
//     });

//     return Response.json({ success: true, message: populatedMessage }, { status: 201 });
//   } catch (error) {
//     return Response.json({ success: false, error: error.message }, { status: 500 });
//   }
// }





import Ably from "ably";
import dbConnect from "@/lib/db";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function POST(request) {
  try {
    await dbConnect();

    const { conversationId, senderId, content, messageType = "text" } =
      await request.json();

    // Save message in MongoDB
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      messageType,
    });

    // Get conversation details (with participants)
    const conversation = await Conversation.findById(conversationId)
      .populate("participants", "name dp");

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      "lastMessage.content": content,
      "lastMessage.senderId": senderId,
      "lastMessage.timestamp": new Date(),
      "lastMessage.messageType": messageType,
    });

    // Get sender details
    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "name dp"
    );

    // ✅ Initialize Ably (server-side safe)
    const ably = new Ably.Rest(process.env.ABLY_API_KEY);

    // Publish to the chat channel
    const channel = ably.channels.get(`chat-${conversationId}`);
    await channel.publish("message", {
      _id: populatedMessage._id,
      conversationId,
      senderId,
      senderName: populatedMessage.senderId.name,
      senderDp: populatedMessage.senderId.dp,
      content,
      messageType,
      createdAt: populatedMessage.createdAt,
    });

    // Send response back
    return Response.json(
      { success: true, message: populatedMessage, conversation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ably/Chat Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



