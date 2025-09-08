// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { MessageCircle, X, Send, MoreVertical, Phone, Video, Search, Smile, Paperclip, ArrowLeft, Users, Plus } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';
// import { useChat } from '@/contexts/ChatContext';


// // Initialize Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// const ChatBoard = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentView, setCurrentView] = useState('contacts');
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);

//   // Real data from backend
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [ablyChannel, setAblyChannel] = useState(null);
//   const [ablyClient, setAblyClient] = useState(null);
//   const [ablyError, setAblyError] = useState(null);
//   const [isAblyConnecting, setIsAblyConnecting] = useState(false);
//   const [currentChannelId, setCurrentChannelId] = useState(null);

//   // New state for unread messages
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [lastSeenMessages, setLastSeenMessages] = useState({});

//   // Update your initializeAbly function
//   useEffect(() => {
//     const initializeAbly = async () => {
//     if (isAblyConnecting || ablyClient) return;

//     setIsAblyConnecting(true);
//     setAblyError(null);

//     try {
//       console.log('Initializing Ably connection...');

//       const Ably = (await import('ably')).default;

//       // Generate a consistent clientId
//       const clientId = `user-${currentUser?.id || 'anonymous'}-${Date.now()}`;

//       // Use authUrl with clientId parameter
//       const client = new Ably.Realtime({
//         authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
//         autoConnect: true,
//         clientId: clientId, // Use the same clientId here
//         log: { level: 2 },
//         closeOnUnload: false,
//         disconnectedRetryTimeout: 1000,
//       });

//       // Add connection event listeners
//       client.connection.on('connecting', () => {
//         console.log('Ably connecting...');
//         setAblyError('Connecting to chat service...');
//       });

//       client.connection.on('connected', () => {
//         console.log('Ably connected successfully');
//         setAblyError(null);
//         setIsAblyConnecting(false);
//       });

//       client.connection.on('disconnected', () => {
//         console.log('Ably disconnected');
//         setAblyError('Disconnected from chat service');
//       });

//       client.connection.on('suspended', () => {
//         console.log('Ably connection suspended');
//         setAblyError('Connection suspended. Reconnecting...');
//       });

//       client.connection.on('failed', (error) => {
//         console.error('Ably connection failed:', error);
//         setAblyError('Connection failed: ' + error.message);
//         setIsAblyConnecting(false);
//       });

//       client.connection.on('closed', () => {
//         console.log('Ably connection closed');
//         setAblyError('Connection closed');
//         setIsAblyConnecting(false);
//       });

//       setAblyClient(client);

//     } catch (error) {
//       console.error('Error initializing Ably:', error);
//       setAblyError('Failed to initialize chat: ' + error.message);
//       setIsAblyConnecting(false);
//     }
//   };
//     if (isOpen && !ablyClient && !isAblyConnecting) {
//       initializeAbly();
//     }
//   }, [isOpen, ablyClient, isAblyConnecting, currentUser]);


//     // Get chat context
//    const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();

//     const messagesEndRef = useRef(null);

//      //useEffect to handle auto-opening conversations
//      useEffect(() => {
//       if (isOpen && autoOpenConversation && currentUser) {
//         handleAutoOpenConversation(autoOpenConversation);
//       }
//     }, [isOpen, autoOpenConversation, currentUser]);

//     const [isAutoOpening, setIsAutoOpening] = useState(false);

//     const handleAutoOpenConversation = async (user) => {
//       try {
//          setIsAutoOpening(true);
//         // Check if conversation already exists
//         const existingConversation = conversations.find(conv => {
//           const otherParticipant = conv.participants.find(p => p._id === user._id);
//           return otherParticipant !== undefined;
//         });

//         if (existingConversation) {
//           // If conversation exists, open it directly
//           handleConversationSelect(existingConversation);
//         } else {
//           // If not, create new conversation and open it
//           await createConversation(user._id);
//         }

//         // Reset the flag
//         resetChatState();
//       } catch (error) {
//         console.error('Error auto-opening conversation:', error);
//         resetChatState();
//       }finally {
//       setIsAutoOpening(false);
//     }
//     };


//     useEffect(() => {
//       setIsOpen(isChatOpen);
//     }, [isChatOpen]);

//     useEffect(() => {
//       if (!isOpen) {
//         resetChatState();
//       }
//     }, [isOpen, resetChatState]);

//     // Handle automatic conversation creation when targetUser is set
//     useEffect(() => {
//       if (shouldCreateConversation && targetUser && currentUser) {
//         handleAutoCreateConversation(targetUser);
//       }
//     }, [shouldCreateConversation, targetUser, currentUser]);

//     // Get current user from Supabase
//     useEffect(() => {
//       const getCurrentUser = async () => {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user) {
//           setCurrentUser(user);
//           loadConversations(user.id);
//           loadUnreadCounts(user.id);
//         }
//       };
//       getCurrentUser();
//     }, []);

//     // Load unread counts from localStorage or API
//     const loadUnreadCounts = (userId) => {
//       try {
//         const stored = localStorage.getItem(`unreadCounts_${userId}`);
//         const storedLastSeen = localStorage.getItem(`lastSeenMessages_${userId}`);

//         if (stored) {
//           setUnreadCounts(JSON.parse(stored));
//         }
//         if (storedLastSeen) {
//           setLastSeenMessages(JSON.parse(storedLastSeen));
//         }
//       } catch (error) {
//         console.error('Error loading unread counts:', error);
//       }
//     };

//     // Save unread counts to localStorage
//     const saveUnreadCounts = (counts, lastSeen) => {
//       if (currentUser) {
//         try {
//           localStorage.setItem(`unreadCounts_${currentUser.id}`, JSON.stringify(counts));
//           localStorage.setItem(`lastSeenMessages_${currentUser.id}`, JSON.stringify(lastSeen));
//         } catch (error) {
//           console.error('Error saving unread counts:', error);
//         }
//       }
//     };

//     // Mark conversation as read
//     const markConversationAsRead = (conversationId) => {
//       setUnreadCounts(prev => {
//         const newCounts = { ...prev, [conversationId]: 0 };

//         // Update last seen message timestamp
//         const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
//         const newLastSeen = {
//           ...lastSeenMessages,
//           [conversationId]: latestMessage?.createdAt || new Date().toISOString()
//         };
//         setLastSeenMessages(newLastSeen);

//         saveUnreadCounts(newCounts, newLastSeen);
//         return newCounts;
//       });
//     };

//     // Update unread count for a conversation
//     const updateUnreadCount = (conversationId, increment = 1) => {
//       setUnreadCounts(prev => {
//         const newCount = (prev[conversationId] || 0) + increment;
//         const newCounts = { ...prev, [conversationId]: Math.max(0, newCount) };
//         saveUnreadCounts(newCounts, lastSeenMessages);
//         return newCounts;
//       });
//     };

//     // Calculate unread count for a conversation
//     const calculateUnreadCount = (conversation) => {
//       const conversationId = conversation._id;
//       const lastSeen = lastSeenMessages[conversationId];

//       if (!lastSeen || !conversation.lastMessage) {
//         return unreadCounts[conversationId] || 0;
//       }

//       // If the last message is from the current user, no unread messages
//       if (conversation.lastMessage.senderId === currentUser.id) {
//         return 0;
//       }

//       // If last message timestamp is after last seen, there's at least 1 unread
//       const lastMessageTime = new Date(conversation.lastMessage.timestamp).getTime();
//       const lastSeenTime = new Date(lastSeen).getTime();

//       if (lastMessageTime > lastSeenTime) {
//         return Math.max(1, unreadCounts[conversationId] || 1);
//       }

//       return 0;
//     };

//     // Auto-create conversation with target user
//      const handleAutoCreateConversation = async (user) => {
//       try {
//         // Check if conversation already exists
//         const existingConversation = conversations.find(conv => {
//           const otherParticipant = conv.participants.find(p => p._id === user._id);
//           return otherParticipant !== undefined;
//         });

//         if (existingConversation) {
//           // If conversation exists, open it
//           handleConversationSelect(existingConversation);
//         } else {
//           // If not, create new conversation
//           await createConversation(user._id);
//         }

//         // Reset the flag
//         resetChatState();
//       } catch (error) {
//         console.error('Error auto-creating conversation:', error);
//         resetChatState();
//       }
//     };

//     // Load user's conversations
//     const loadConversations = async (userId) => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/chat/conversation?userId=${userId}`);
//         const data = await response.json();

//         if (data.success) {
//           setConversations(data.conversations);
//         }
//       } catch (error) {
//         console.error('Error loading conversations:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleClose = () => {
//       setIsOpen(false);
//       setIsChatOpen(false);
//       resetChatState();
//     };

//     // Load messages for a conversation
//     const loadMessages = async (conversationId) => {
//       try {
//          console.log('Loading messages for conversation:', conversationId);
//         const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);


//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error response:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//         const data = await response.json();
//         console.log('Messages data:', data);

//         if (data.success) {
//           setMessages(data.messages);
//           // Mark as read when messages are loaded
//           markConversationAsRead(conversationId);
//         }
//       } catch (error) {
//         console.error('Error loading messages:', error);
//       }
//     };

//     // Search users for new chat
//     const searchUsers = async (query) => {
//       if (!query.trim()) {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         const response = await fetch(`/api/chat/users/search?query=${query}&currentUserId=${currentUser.id}`);
//         const data = await response.json();

//         if (data.success) {
//           setSearchResults(data.users);
//         }
//       } catch (error) {
//         console.error('Error searching users:', error);
//       }
//     };

//     // Create or get conversation
//     const createConversation = async (otherUserId) => {
//       try {
//         const response = await fetch('/api/chat/conversation', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userId1: currentUser.id,
//             userId2: otherUserId
//           })
//         });

//         const data = await response.json();
//         if (data.success) {
//           setSelectedConversation(data.conversation);
//           setCurrentView('chat');
//           loadMessages(data.conversation._id);
//           setupAblyChannel(data.conversation._id);

//           // Add to conversations list if new
//           const existingConv = conversations.find(c => c._id === data.conversation._id);
//           if (!existingConv) {
//             setConversations(prev => [data.conversation, ...prev]);
//           }
//           // Find the other participant
//         const otherParticipant = data.conversation.participants.find(p => p._id !== currentUser.id);
//         setSelectedContact(otherParticipant);
//         }
//       } catch (error) {
//         console.error('Error creating conversation:', error);
//       }
//     };

//   // Setup Ably channel when conversation is selected
//   const setupAblyChannel = (conversationId) => {
//     // If we're already setting up or using this channel, skip
//     if (currentChannelId === conversationId && ablyChannel) {
//       console.log('Already using this channel, skipping setup');
//       return;
//     }

//     if (!ablyClient || ablyClient.connection.state !== 'connected') {
//       console.log('Ably client not ready, delaying channel setup');
//       setAblyError('Connecting to chat service...');

//       // Retry after connection is established
//       const checkConnection = () => {
//         if (ablyClient && ablyClient.connection.state === 'connected') {
//           setupAblyChannel(conversationId);
//         } else if (ablyClient && ablyClient.connection.state === 'failed') {
//           setAblyError('Connection failed. Please refresh the page.');
//         } else {
//           setTimeout(checkConnection, 500);
//         }
//       };
//       setTimeout(checkConnection, 500);
//       return;
//     }

//     try {
//       // Unsubscribe from previous channel if it's different
//       if (ablyChannel && currentChannelId !== conversationId) {
//         try {
//           ablyChannel.unsubscribe();
//           ablyChannel.detach();
//           console.log('Detached from previous channel:', currentChannelId);
//         } catch (error) {
//           console.warn('Error detaching from previous channel:', error);
//         }
//       }

//       const channel = ablyClient.channels.get(`chat-${conversationId}`);
//       setCurrentChannelId(conversationId);

//       // Add channel event listeners
//       channel.on('attached', () => {
//         console.log('Channel attached successfully:', conversationId);
//         setAblyError(null);
//       });

//       channel.on('failed', (error) => {
//         console.error('Channel failed:', error);
//         setAblyError('Failed to join chat channel');
//       });

//       channel.on('detached', () => {
//         console.log('Channel detached:', conversationId);
//       });

//       channel.on('suspended', () => {
//         console.log('Channel suspended:', conversationId);
//         setAblyError('Channel connection suspended');
//       });

//       // Subscribe to messages
//       channel.subscribe("message", (message) => {
//         const newMessage = message.data;

//         if (newMessage.senderId !== currentUser.id) {
//           // Add message to current chat if it's the active conversation
//           if (selectedConversation && selectedConversation._id === newMessage.conversationId) {
//             setMessages((prev) => [...prev, {
//               _id: newMessage._id || `ably-${Date.now()}`,
//               conversationId: newMessage.conversationId,
//               content: newMessage.content,
//               messageType: newMessage.messageType || 'text',
//               createdAt: newMessage.createdAt || new Date().toISOString(),
//               senderId: {
//                 _id: newMessage.senderId,
//                 name: newMessage.senderName || 'Unknown',
//                 dp: newMessage.senderDp || ''
//               }
//             }]);
//           } else {
//             // If message is for a different conversation, increment unread count
//             updateUnreadCount(newMessage.conversationId, 1);
//           }

//           // Update conversation list with new last message
//           setConversations(prev => prev.map(conv => 
//             conv._id === newMessage.conversationId 
//               ? { 
//                   ...conv, 
//                   lastMessage: { 
//                     content: newMessage.content, 
//                     timestamp: new Date(newMessage.createdAt),
//                     senderId: newMessage.senderId
//                   } 
//                 }
//               : conv
//           ));
//         }
//       });

//       // Attach to the channel
//       channel.attach((err) => {
//         if (err) {
//           console.error('Failed to attach to channel:', err);
//           setAblyError('Failed to join chat');
//         } else {
//           console.log('Successfully attached to channel');
//         }
//       });

//       setAblyChannel(channel);

//     } catch (error) {
//       console.error('Error setting up Ably channel:', error);
//       setAblyError('Failed to set up chat channel');
//     }
//   };

//   //  useEffect to set the initial view
//   useEffect(() => {
//     if (isOpen && autoOpenConversation) {
//       setCurrentView('chat');
//     } else if (isOpen) {
//       setCurrentView('contacts');
//     }
//   }, [isOpen, autoOpenConversation]);

//   // Update the cleanup useEffect
//   useEffect(() => {
//     return () => {
//       // Only cleanup when component truly unmounts
//       if (ablyChannel) {
//         try {
//           // Check channel state before trying to detach
//           if (ablyChannel.state === 'attached' || ablyChannel.state === 'attaching') {
//             ablyChannel.unsubscribe();
//             ablyChannel.detach((err) => {
//               if (err) {
//                 console.warn('Error detaching channel:', err);
//               } else {
//                 console.log('Channel detached successfully');
//               }
//             });
//           }
//         } catch (error) {
//           console.warn('Error cleaning up channel:', error);
//         }
//       }
//     };
//   }, [ablyChannel]);

//   //separate useEffect for handling chat close/refresh
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (ablyClient) {
//         ablyClient.close();
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [ablyClient]);

//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedConversation || sending) return;

//     // Check if Ably connection is still open
//     if (!ablyClient || ablyClient.connection.state !== 'connected') {
//       setAblyError('Connection lost. Please try again.');
//       return;
//     }

//     setSending(true);
//     const tempMessage = {
//       _id: 'temp-' + Date.now(),
//       content: message,
//       senderId: {
//         _id: currentUser.id,
//         name: currentUser.user_metadata?.full_name || 'You',
//         dp: currentUser.user_metadata?.avatar_url || ''
//       },
//       createdAt: new Date().toISOString(),
//       messageType: 'text'
//     };

//     // Add message optimistically
//     setMessages(prev => [...prev, tempMessage]);
//     const messageText = message;
//     setMessage('');

//     try {
//       const response = await fetch('/api/chat/send', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           conversationId: selectedConversation._id,
//           senderId: currentUser.id,
//           content: messageText,
//           messageType: 'text'
//         })
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         // Replace temp message with real one
//         setMessages(prev => prev.map(msg => 
//           msg._id === tempMessage._id ? data.message : msg
//         ));

//         // Update conversation in list
//         setConversations(prev => prev.map(conv => 
//           conv._id === selectedConversation._id 
//             ? { 
//                 ...conv, 
//                 lastMessage: { 
//                   content: messageText, 
//                   timestamp: new Date(),
//                   senderId: currentUser.id
//                 } 
//               }
//             : conv
//         ));

//         // Publish to Ably channel if available and connected
//         if (ablyChannel && ablyClient.connection.state === 'connected') {
//           try {
//             await ablyChannel.publish("message", {
//               _id: data.message._id,
//               conversationId: data.message.conversationId,
//               senderId: data.message.senderId._id,
//               senderName: data.message.senderId.name,
//               senderDp: data.message.senderId.dp,
//               content: data.message.content,
//               messageType: data.message.messageType,
//               createdAt: data.message.createdAt
//             });
//           } catch (publishError) {
//             console.error('Failed to publish to Ably:', publishError);
//             // Don't show error to user for publish failures
//           }
//         }
//       } else {
//         throw new Error(data.error || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       // Remove temp message on error
//       setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
//       setMessage(messageText); // Restore message
//       alert('Failed to send message. Please try again.');
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleBackToContacts = () => {
//     // Reset chat-specific state
//     setSelectedConversation(null);
//     setSelectedContact(null);
//     setMessages([]);
//     setCurrentView('contacts');

//     // Clean up Ably channel but keep the client connection
//     if (ablyChannel) {
//       try {
//         ablyChannel.unsubscribe();
//         setAblyChannel(null);
//         setCurrentChannelId(null);
//       } catch (error) {
//         console.warn('Error cleaning up channel:', error);
//       }
//     }
//   };

//   // Update handleConversationSelect to use the debounced version
//   const handleConversationSelect = (conversation) => {
//     setSelectedConversation(conversation);
//     setCurrentView('chat'); // This ensures we go directly to chat view 
//     loadMessages(conversation._id);

//     // Mark conversation as read when selected
//     markConversationAsRead(conversation._id);

//     if (ablyClient && ablyClient.connection.state === 'connected') {
//       debouncedSetupAblyChannel(conversation._id);
//     } else {
//       setAblyError('Waiting for connection...');
//       const waitForConnection = () => {
//         if (ablyClient && ablyClient.connection.state === 'connected') {
//           debouncedSetupAblyChannel(conversation._id);
//         } else {
//           setTimeout(waitForConnection, 100);
//         }
//       };
//       waitForConnection();
//     }

//     const otherParticipant = conversation.participants.find(p => p._id !== currentUser.id);
//     setSelectedContact(otherParticipant);
//      resetChatState();  // Reset auto-open state
//   };

//   // Add a debounce function to prevent rapid channel switching
//   const debounce = (func, wait) => {
//     let timeout;
//     return function executedFunction(...args) {
//       const later = () => {
//         clearTimeout(timeout);
//         func(...args);
//       };
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//     };
//   };

//   // Create a debounced version of setupAblyChannel
//   const debouncedSetupAblyChannel = useCallback(
//     debounce((conversationId) => {
//       setupAblyChannel(conversationId);
//     }, 300),
//     [ablyClient, ablyChannel]
//   );

//     // Handle new chat with search result
//     const handleNewChatSelect = async (user) => {
//       await createConversation(user._id);
//       setSearchQuery('');
//       setSearchResults([]);
//     };

//     const scrollToBottom = () => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//       if (currentView === 'chat') {
//         scrollToBottom();
//       }
//     }, [messages, currentView]);

//     useEffect(() => {
//       const timeoutId = setTimeout(() => {
//         if (currentView === 'newChat') {
//           searchUsers(searchQuery);
//         }
//       }, 300);

//       return () => clearTimeout(timeoutId);
//     }, [searchQuery, currentView]);

//     const handleKeyPress = (e) => {
//       if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         handleSendMessage();
//       }
//     };

//     const getOtherParticipant = (conversation) => {
//       return conversation.participants?.find(p => p._id !== currentUser?.id);
//     };

//     const formatTimestamp = (timestamp) => {
//       const date = new Date(timestamp);
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

//       if (messageDate.getTime() === today.getTime()) {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       } else if (messageDate.getTime() === today.getTime() - 86400000) {
//         return 'Yesterday';
//       } else {
//         return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//       }
//     };

//     if (!currentUser) {
//       return (
//         <div className="fixed bottom-4 right-4 z-50">
//           <button className="bg-gray-400 text-white rounded-full p-4 shadow-lg cursor-not-allowed">
//             <MessageCircle size={24} />
//           </button>
//         </div>
//       );
//     }

//     return (
//       <>
//         {/* Background overlay when chat is open */}
//         {isOpen && (
//           <div 
//             className="fixed inset-0 bg-transparent bg-opacity-20 z-40"
//             onClick={() => setIsOpen(false)}
//           />
//         )}

//         {/* Chat Container */}
//         <div className="fixed bottom-4 right-4 z-50">
//           {/* Chat Button */}
//           {!isOpen && (
//             <button
//               onClick={() => setIsOpen(true)}
//               className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
//             >
//               <MessageCircle size={24} />
//             </button>
//           )}

//           {/* Chat Interface */}
//           {isOpen && (
//             <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-96 sm:h-[500px] flex flex-col overflow-hidden border">

//               {/* Conversations List View */}
//               {currentView === 'contacts' && (
//                 <>
//                   {/* Header */}
//                   <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                     <h2 className="text-lg font-semibold">Chats</h2>
//                     <div className="flex items-center space-x-2">
//                       <button 
//                         onClick={() => setCurrentView('newChat')}
//                         className="p-1 hover:bg-green-700 rounded"
//                         title="New Chat"
//                       >
//                         <Plus size={18} />
//                       </button>
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <MoreVertical size={18} />
//                       </button>
//                       <button
//                         onClick={handleClose}
//                         className="p-1 hover:bg-green-700 rounded"
//                       >
//                         <X size={18} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Conversations List */}
//                   <div className="flex-1 overflow-y-auto">
//                     {loading ? (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-gray-500">Loading chats...</div>
//                       </div>
//                     ) : conversations.length > 0 ? (
//                       conversations.map((conversation) => {
//                         const otherParticipant = getOtherParticipant(conversation);
//                         if (!otherParticipant) return null;

//                         const unreadCount = calculateUnreadCount(conversation);

//                         return (
//                           <div
//                             key={conversation._id}
//                             onClick={() => handleConversationSelect(conversation)}
//                             className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
//                           >
//                             <div className="flex items-center space-x-3">
//                               <div className="relative">
//                                 {otherParticipant.dp ? (
//                                   <img 
//                                     src={otherParticipant.dp} 
//                                     alt={otherParticipant.name}
//                                     className="w-10 h-10 rounded-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                     {otherParticipant.name?.charAt(0)?.toUpperCase() || '?'}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center justify-between">
//                                   <h3 className="font-semibold text-sm text-gray-900 truncate">
//                                     {otherParticipant.name}
//                                   </h3>
//                                   <div className="flex flex-col items-end">
//                                     <span className="text-xs text-gray-500">
//                                       {conversation.lastMessage?.timestamp && formatTimestamp(conversation.lastMessage.timestamp)}
//                                     </span>
//                                     {/* Unread message badge */}
//                                     {unreadCount > 0 && (
//                                       <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1 mt-1 min-w-[20px] h-5 flex items-center justify-center">
//                                         {unreadCount > 99 ? '99+' : unreadCount}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                   <p className="text-sm text-gray-600 truncate">
//                                     {conversation.lastMessage?.content || 'No messages yet'}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                         <MessageCircle size={48} className="mb-4 text-gray-300" />
//                         <p className="text-center px-4">No conversations yet</p>
//                         <button 
//                           onClick={() => setCurrentView('newChat')}
//                           className="mt-2 text-green-600 hover:text-green-700"
//                         >
//                           Start a new chat
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* New Chat View */}
//               {currentView === 'newChat' && (
//                 <>
//                   {/* Header */}
//                   <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <button
//                         onClick={() => {
//                           handleBackToContacts();
//                           setSearchQuery('');
//                           setSearchResults([]);
//                         }}
//                         className="p-1 hover:bg-green-700 rounded"
//                       >
//                         <ArrowLeft size={18} />
//                       </button>
//                       <h2 className="text-lg font-semibold">New Chat</h2>
//                     </div>
//                   </div>

//                   {/* Search Bar */}
//                   <div className="p-3 border-b bg-gray-50">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input
//                         type="text"
//                         placeholder="Search users..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Search Results */}
//                   <div className="flex-1 overflow-y-auto">
//                     {searchResults.map((user) => (
//                       <div
//                         key={user._id}
//                         onClick={() => handleNewChatSelect(user)}
//                         className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center space-x-3">
//                           {user.dp ? (
//                             <img 
//                               src={user.dp} 
//                               alt={user.name}
//                               className="w-10 h-10 rounded-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                               {user.name?.charAt(0)?.toUpperCase() || '?'}
//                             </div>
//                           )}
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-sm text-gray-900">{user.name}</h3>
//                             <p className="text-xs text-gray-500">{user.email}</p>
//                             <p className="text-xs text-gray-400">{user.major} • {user.collegeName}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     {searchQuery && searchResults.length === 0 && (
//                       <div className="flex items-center justify-center h-32">
//                         <p className="text-gray-500">No users found</p>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* Individual Chat View */}
//               {currentView === 'chat' && selectedContact && selectedConversation && (
//                 <>
//                   {/* Chat Header */}
//                   <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <button
//                          onClick={handleBackToContacts}
//                         className="p-1 hover:bg-green-700 rounded"
//                       >
//                         <ArrowLeft size={18} />
//                       </button>
//                       {selectedContact.dp ? (
//                         <img 
//                           src={selectedContact.dp} 
//                           alt={selectedContact.name}
//                           className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
//                           {selectedContact.name?.charAt(0)?.toUpperCase() || '?'}
//                         </div>
//                       )}
//                       <div>
//                         <h3 className="font-semibold text-sm sm:text-base">{selectedContact.name}</h3>
//                         <p className="text-xs text-green-100">{selectedContact.major}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <Video size={18} />
//                       </button>
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <Phone size={18} />
//                       </button>
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <MoreVertical size={18} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Messages Container */}
//                   <div
//                     className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
//                     style={{
//                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 0h40v40h-40z'/%3E%3C/g%3E%3C/svg%3E")`
//                     }}
//                   >
//                     <div className="space-y-3">
//                       {messages.map((msg) => {
//                         const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
//                         const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };

//                         return (
//                           <div
//                             key={msg._id}
//                             className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
//                           >
//                             <div className="flex items-end space-x-2 max-w-xs">
//                               {!isMe && (
//                                 <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-semibold mb-1">
//                                   {sender.name?.charAt(0)?.toUpperCase() || '?'}
//                                 </div>
//                               )}
//                               <div
//                                 className={`px-3 py-2 rounded-lg ${
//                                   isMe
//                                     ? 'bg-green-500 text-white rounded-br-none'
//                                     : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
//                                 }`}
//                               >
//                                 <p className="text-sm">{msg.content}</p>
//                                 <p className={`text-xs mt-1 ${
//                                   isMe ? 'text-green-100' : 'text-gray-500'
//                                 }`}>
//                                   {formatTimestamp(msg.createdAt)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <div ref={messagesEndRef} />
//                     </div>
//                   </div>

//                   {/* Input Area */}
//                   <div className="p-3 sm:p-4 bg-gray-100 border-t">
//                     <div className="flex items-center space-x-2">
//                       <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
//                         <Smile size={18} />
//                       </button>
//                       <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
//                         <Paperclip size={18} />
//                       </button>
//                       <div className="flex-1 relative">
//                         <input
//                           type="text"
//                           value={message}
//                           onChange={(e) => setMessage(e.target.value)}
//                           onKeyPress={handleKeyPress}
//                           placeholder="Type a message..."
//                           disabled={sending}
//                           className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:opacity-50"
//                         />
//                       </div>
//                       <button
//                         onClick={handleSendMessage}
//                         disabled={sending || !message.trim()}
//                         className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
//                       >
//                         <Send size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </>
//     );
//   };

//   export default ChatBoard;




// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { MessageCircle, X, Send, MoreVertical, Phone, Video, Search, Smile, Paperclip, ArrowLeft, Users, Plus } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';
// import { useChat } from '@/contexts/ChatContext';


// // Initialize Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// const ChatBoard = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentView, setCurrentView] = useState('contacts');
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);

//   // Real data from backend
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [ablyChannel, setAblyChannel] = useState(null);
//   const [ablyClient, setAblyClient] = useState(null);
//   const [ablyError, setAblyError] = useState(null);
//   const [isAblyConnecting, setIsAblyConnecting] = useState(false);
//   const [currentChannelId, setCurrentChannelId] = useState(null);

//   // New state for unread messages
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [lastSeenMessages, setLastSeenMessages] = useState({});

//   // Update your initializeAbly function
//   useEffect(() => {
//     const initializeAbly = async () => {
//     if (isAblyConnecting || ablyClient) return;

//     setIsAblyConnecting(true);
//     setAblyError(null);

//     try {
//       console.log('Initializing Ably connection...');

//       const Ably = (await import('ably')).default;

//       // Generate a consistent clientId
//       const clientId = `user-${currentUser?.id || 'anonymous'}-${Date.now()}`;

//       // Use authUrl with clientId parameter
//       const client = new Ably.Realtime({
//         authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
//         autoConnect: true,
//         clientId: clientId, // Use the same clientId here
//         log: { level: 2 },
//         closeOnUnload: false,
//         disconnectedRetryTimeout: 1000,
//       });

//       // Add connection event listeners
//       client.connection.on('connecting', () => {
//         console.log('Ably connecting...');
//         setAblyError('Connecting to chat service...');
//       });

//       client.connection.on('connected', () => {
//         console.log('Ably connected successfully');
//         setAblyError(null);
//         setIsAblyConnecting(false);
//       });

//       client.connection.on('disconnected', () => {
//         console.log('Ably disconnected');
//         setAblyError('Disconnected from chat service');
//       });

//       client.connection.on('suspended', () => {
//         console.log('Ably connection suspended');
//         setAblyError('Connection suspended. Reconnecting...');
//       });

//       client.connection.on('failed', (error) => {
//         console.error('Ably connection failed:', error);
//         setAblyError('Connection failed: ' + error.message);
//         setIsAblyConnecting(false);
//       });

//       client.connection.on('closed', () => {
//         console.log('Ably connection closed');
//         setAblyError('Connection closed');
//         setIsAblyConnecting(false);
//       });

//       setAblyClient(client);

//     } catch (error) {
//       console.error('Error initializing Ably:', error);
//       setAblyError('Failed to initialize chat: ' + error.message);
//       setIsAblyConnecting(false);
//     }
//   };
//     if (isOpen && !ablyClient && !isAblyConnecting) {
//       initializeAbly();
//     }
//   }, [isOpen, ablyClient, isAblyConnecting, currentUser]);


//     // Get chat context
//    const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();

//     const messagesEndRef = useRef(null);

//      //useEffect to handle auto-opening conversations
//      useEffect(() => {
//       if (isOpen && autoOpenConversation && currentUser) {
//         handleAutoOpenConversation(autoOpenConversation);
//       }
//     }, [isOpen, autoOpenConversation, currentUser]);

//     const [isAutoOpening, setIsAutoOpening] = useState(false);

//     const handleAutoOpenConversation = async (user) => {
//       try {
//          setIsAutoOpening(true);
//         // Check if conversation already exists
//         const existingConversation = conversations.find(conv => {
//           const otherParticipant = conv.participants.find(p => p._id === user._id);
//           return otherParticipant !== undefined;
//         });

//         if (existingConversation) {
//           // If conversation exists, open it directly
//           handleConversationSelect(existingConversation);
//         } else {
//           // If not, create new conversation and open it
//           await createConversation(user._id);
//         }

//         // Reset the flag
//         resetChatState();
//       } catch (error) {
//         console.error('Error auto-opening conversation:', error);
//         resetChatState();
//       }finally {
//       setIsAutoOpening(false);
//     }
//     };


//     useEffect(() => {
//       setIsOpen(isChatOpen);
//     }, [isChatOpen]);

//     useEffect(() => {
//       if (!isOpen) {
//         resetChatState();
//       }
//     }, [isOpen, resetChatState]);

//     // Handle automatic conversation creation when targetUser is set
//     useEffect(() => {
//       if (shouldCreateConversation && targetUser && currentUser) {
//         handleAutoCreateConversation(targetUser);
//       }
//     }, [shouldCreateConversation, targetUser, currentUser]);

//     // Get current user from Supabase
//     useEffect(() => {
//       const getCurrentUser = async () => {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (user) {
//           setCurrentUser(user);
//           loadConversations(user.id);
//           loadUnreadCounts(user.id);
//         }
//       };
//       getCurrentUser();
//     }, []);

//     // Load unread counts from localStorage or API
//     const loadUnreadCounts = (userId) => {
//       try {
//         const stored = localStorage.getItem(`unreadCounts_${userId}`);
//         const storedLastSeen = localStorage.getItem(`lastSeenMessages_${userId}`);

//         if (stored) {
//           setUnreadCounts(JSON.parse(stored));
//         }
//         if (storedLastSeen) {
//           setLastSeenMessages(JSON.parse(storedLastSeen));
//         }
//       } catch (error) {
//         console.error('Error loading unread counts:', error);
//       }
//     };

//     // Save unread counts to localStorage
//     const saveUnreadCounts = (counts, lastSeen) => {
//       if (currentUser) {
//         try {
//           localStorage.setItem(`unreadCounts_${currentUser.id}`, JSON.stringify(counts));
//           localStorage.setItem(`lastSeenMessages_${currentUser.id}`, JSON.stringify(lastSeen));
//         } catch (error) {
//           console.error('Error saving unread counts:', error);
//         }
//       }
//     };

//     // Mark conversation as read
//     const markConversationAsRead = (conversationId) => {
//       setUnreadCounts(prev => {
//         const newCounts = { ...prev, [conversationId]: 0 };

//         // Update last seen message timestamp
//         const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
//         const newLastSeen = {
//           ...lastSeenMessages,
//           [conversationId]: latestMessage?.createdAt || new Date().toISOString()
//         };
//         setLastSeenMessages(newLastSeen);

//         saveUnreadCounts(newCounts, newLastSeen);
//         return newCounts;
//       });
//     };

//     // Update unread count for a conversation
//     const updateUnreadCount = (conversationId, increment = 1) => {
//       setUnreadCounts(prev => {
//         const newCount = (prev[conversationId] || 0) + increment;
//         const newCounts = { ...prev, [conversationId]: Math.max(0, newCount) };
//         saveUnreadCounts(newCounts, lastSeenMessages);
//         return newCounts;
//       });
//     };

//     // Calculate unread count for a conversation
//     const calculateUnreadCount = (conversation) => {
//       const conversationId = conversation._id;
//       const lastSeen = lastSeenMessages[conversationId];

//       if (!lastSeen || !conversation.lastMessage) {
//         return unreadCounts[conversationId] || 0;
//       }

//       // If the last message is from the current user, no unread messages
//       if (conversation.lastMessage.senderId === currentUser.id) {
//         return 0;
//       }

//       // If last message timestamp is after last seen, there's at least 1 unread
//       const lastMessageTime = new Date(conversation.lastMessage.timestamp).getTime();
//       const lastSeenTime = new Date(lastSeen).getTime();

//       if (lastMessageTime > lastSeenTime) {
//         return Math.max(1, unreadCounts[conversationId] || 1);
//       }

//       return 0;
//     };



//     // Auto-create conversation with target user
//      const handleAutoCreateConversation = async (user) => {
//       try {
//         // Check if conversation already exists
//         const existingConversation = conversations.find(conv => {
//           const otherParticipant = conv.participants.find(p => p._id === user._id);
//           return otherParticipant !== undefined;
//         });

//         if (existingConversation) {
//           // If conversation exists, open it
//           handleConversationSelect(existingConversation);
//         } else {
//           // If not, create new conversation
//           await createConversation(user._id);
//         }

//         // Reset the flag
//         resetChatState();
//       } catch (error) {
//         console.error('Error auto-creating conversation:', error);
//         resetChatState();
//       }
//     };

//     // Load user's conversations
//     const loadConversations = async (userId) => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/chat/conversation?userId=${userId}`);
//         const data = await response.json();

//         if (data.success) {
//           setConversations(data.conversations);
//         }
//       } catch (error) {
//         console.error('Error loading conversations:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleClose = () => {
//       setIsOpen(false);
//       setIsChatOpen(false);
//       resetChatState();
//     };

//     // Load messages for a conversation
//     const loadMessages = async (conversationId) => {
//       try {
//          console.log('Loading messages for conversation:', conversationId);
//         const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);


//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error response:', errorText);
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }
//         const data = await response.json();
//         console.log('Messages data:', data);

//         if (data.success) {
//           setMessages(data.messages);
//           // Mark as read when messages are loaded
//           markConversationAsRead(conversationId);
//         }
//       } catch (error) {
//         console.error('Error loading messages:', error);
//       }
//     };

//     // Search users for new chat
//     const searchUsers = async (query) => {
//       if (!query.trim()) {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         const response = await fetch(`/api/chat/users/search?query=${query}&currentUserId=${currentUser.id}`);
//         const data = await response.json();

//         if (data.success) {
//           setSearchResults(data.users);
//         }
//       } catch (error) {
//         console.error('Error searching users:', error);
//       }
//     };

//     // Create or get conversation
//     const createConversation = async (otherUserId) => {
//       try {
//         const response = await fetch('/api/chat/conversation', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userId1: currentUser.id,
//             userId2: otherUserId
//           })
//         });

//         const data = await response.json();
//         if (data.success) {
//           setSelectedConversation(data.conversation);
//           setCurrentView('chat');
//           loadMessages(data.conversation._id);
//           setupAblyChannel(data.conversation._id);

//           // Add to conversations list if new
//           const existingConv = conversations.find(c => c._id === data.conversation._id);
//           if (!existingConv) {
//             setConversations(prev => [data.conversation, ...prev]);
//           }
//           // Find the other participant
//         const otherParticipant = data.conversation.participants.find(p => p._id !== currentUser.id);
//         setSelectedContact(otherParticipant);
//         }
//       } catch (error) {
//         console.error('Error creating conversation:', error);
//       }
//     };

//   // Setup Ably channel when conversation is selected
//   const setupAblyChannel = (conversationId) => {
//     // If we're already setting up or using this channel, skip
//     if (currentChannelId === conversationId && ablyChannel) {
//       console.log('Already using this channel, skipping setup');
//       return;
//     }

//     if (!ablyClient || ablyClient.connection.state !== 'connected') {
//       console.log('Ably client not ready, delaying channel setup');
//       setAblyError('Connecting to chat service...');

//       // Retry after connection is established
//       const checkConnection = () => {
//         if (ablyClient && ablyClient.connection.state === 'connected') {
//           setupAblyChannel(conversationId);
//         } else if (ablyClient && ablyClient.connection.state === 'failed') {
//           setAblyError('Connection failed. Please refresh the page.');
//         } else {
//           setTimeout(checkConnection, 500);
//         }
//       };
//       setTimeout(checkConnection, 500);
//       return;
//     }

//     try {
//       // Unsubscribe from previous channel if it's different
//       if (ablyChannel && currentChannelId !== conversationId) {
//         try {
//           ablyChannel.unsubscribe();
//           ablyChannel.detach();
//           console.log('Detached from previous channel:', currentChannelId);
//         } catch (error) {
//           console.warn('Error detaching from previous channel:', error);
//         }
//       }

//       const channel = ablyClient.channels.get(`chat-${conversationId}`);
//       setCurrentChannelId(conversationId);

//       // Add channel event listeners
//       channel.on('attached', () => {
//         console.log('Channel attached successfully:', conversationId);
//         setAblyError(null);
//       });

//       channel.on('failed', (error) => {
//         console.error('Channel failed:', error);
//         setAblyError('Failed to join chat channel');
//       });

//       channel.on('detached', () => {
//         console.log('Channel detached:', conversationId);
//       });

//       channel.on('suspended', () => {
//         console.log('Channel suspended:', conversationId);
//         setAblyError('Channel connection suspended');
//       });

//       // Subscribe to messages
//       channel.subscribe("message", (message) => {
//         const newMessage = message.data;

//         if (newMessage.senderId !== currentUser.id) {
//           // Add message to current chat if it's the active conversation
//           if (selectedConversation && selectedConversation._id === newMessage.conversationId) {
//             setMessages((prev) => [...prev, {
//               _id: newMessage._id || `ably-${Date.now()}`,
//               conversationId: newMessage.conversationId,
//               content: newMessage.content,
//               messageType: newMessage.messageType || 'text',
//               createdAt: newMessage.createdAt || new Date().toISOString(),
//               senderId: {
//                 _id: newMessage.senderId,
//                 name: newMessage.senderName || 'Unknown',
//                 dp: newMessage.senderDp || ''
//               }
//             }]);
//           } else {
//             // If message is for a different conversation, increment unread count
//             updateUnreadCount(newMessage.conversationId, 1);
//           }

//           // Update conversation list with new last message
//           setConversations(prev => prev.map(conv => 
//             conv._id === newMessage.conversationId 
//               ? { 
//                   ...conv, 
//                   lastMessage: { 
//                     content: newMessage.content, 
//                     timestamp: new Date(newMessage.createdAt),
//                     senderId: newMessage.senderId
//                   } 
//                 }
//               : conv
//           ));
//         }
//       });

//       // Attach to the channel
//       channel.attach((err) => {
//         if (err) {
//           console.error('Failed to attach to channel:', err);
//           setAblyError('Failed to join chat');
//         } else {
//           console.log('Successfully attached to channel');
//         }
//       });

//       setAblyChannel(channel);

//     } catch (error) {
//       console.error('Error setting up Ably channel:', error);
//       setAblyError('Failed to set up chat channel');
//     }
//   };

//   //  useEffect to set the initial view
//   useEffect(() => {
//     if (isOpen && autoOpenConversation) {
//       setCurrentView('chat');
//     } else if (isOpen) {
//       setCurrentView('contacts');
//     }
//   }, [isOpen, autoOpenConversation]);

//   // Update the cleanup useEffect
//   useEffect(() => {
//     return () => {
//       // Only cleanup when component truly unmounts
//       if (ablyChannel) {
//         try {
//           // Check channel state before trying to detach
//           if (ablyChannel.state === 'attached' || ablyChannel.state === 'attaching') {
//             ablyChannel.unsubscribe();
//             ablyChannel.detach((err) => {
//               if (err) {
//                 console.warn('Error detaching channel:', err);
//               } else {
//                 console.log('Channel detached successfully');
//               }
//             });
//           }
//         } catch (error) {
//           console.warn('Error cleaning up channel:', error);
//         }
//       }
//     };
//   }, [ablyChannel]);

//   //separate useEffect for handling chat close/refresh
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (ablyClient) {
//         ablyClient.close();
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [ablyClient]);

//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedConversation || sending) return;

//     // Check if Ably connection is still open
//     if (!ablyClient || ablyClient.connection.state !== 'connected') {
//       setAblyError('Connection lost. Please try again.');
//       return;
//     }

//     setSending(true);
//     const tempMessage = {
//       _id: 'temp-' + Date.now(),
//       content: message,
//       senderId: {
//         _id: currentUser.id,
//         name: currentUser.user_metadata?.full_name || 'You',
//         dp: currentUser.user_metadata?.avatar_url || ''
//       },
//       createdAt: new Date().toISOString(),
//       messageType: 'text'
//     };

//     // Add message optimistically
//     setMessages(prev => [...prev, tempMessage]);
//     const messageText = message;
//     setMessage('');

//     try {
//       const response = await fetch('/api/chat/send', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           conversationId: selectedConversation._id,
//           senderId: currentUser.id,
//           content: messageText,
//           messageType: 'text'
//         })
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         // Replace temp message with real one
//         setMessages(prev => prev.map(msg => 
//           msg._id === tempMessage._id ? data.message : msg
//         ));

//         // Update conversation in list
//         setConversations(prev => prev.map(conv => 
//           conv._id === selectedConversation._id 
//             ? { 
//                 ...conv, 
//                 lastMessage: { 
//                   content: messageText, 
//                   timestamp: new Date(),
//                   senderId: currentUser.id
//                 } 
//               }
//             : conv
//         ));

//         // Publish to Ably channel if available and connected
//         if (ablyChannel && ablyClient.connection.state === 'connected') {
//           try {
//             await ablyChannel.publish("message", {
//               _id: data.message._id,
//               conversationId: data.message.conversationId,
//               senderId: data.message.senderId._id,
//               senderName: data.message.senderId.name,
//               senderDp: data.message.senderId.dp,
//               content: data.message.content,
//               messageType: data.message.messageType,
//               createdAt: data.message.createdAt
//             });
//           } catch (publishError) {
//             console.error('Failed to publish to Ably:', publishError);
//             // Don't show error to user for publish failures
//           }
//         }
//       } else {
//         throw new Error(data.error || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       // Remove temp message on error
//       setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
//       setMessage(messageText); // Restore message
//       alert('Failed to send message. Please try again.');
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleBackToContacts = () => {
//     // Reset chat-specific state
//     setSelectedConversation(null);
//     setSelectedContact(null);
//     setMessages([]);
//     setCurrentView('contacts');

//     // Clean up Ably channel but keep the client connection
//     if (ablyChannel) {
//       try {
//         ablyChannel.unsubscribe();
//         setAblyChannel(null);
//         setCurrentChannelId(null);
//       } catch (error) {
//         console.warn('Error cleaning up channel:', error);
//       }
//     }
//   };

//   // Update handleConversationSelect to use the debounced version
//   const handleConversationSelect = (conversation) => {
//     setSelectedConversation(conversation);
//     setCurrentView('chat'); // This ensures we go directly to chat view 
//     loadMessages(conversation._id);

//     // Mark conversation as read when selected
//     markConversationAsRead(conversation._id);

//     if (ablyClient && ablyClient.connection.state === 'connected') {
//       debouncedSetupAblyChannel(conversation._id);
//     } else {
//       setAblyError('Waiting for connection...');
//       const waitForConnection = () => {
//         if (ablyClient && ablyClient.connection.state === 'connected') {
//           debouncedSetupAblyChannel(conversation._id);
//         } else {
//           setTimeout(waitForConnection, 100);
//         }
//       };
//       waitForConnection();
//     }

//     const otherParticipant = conversation.participants.find(p => p._id !== currentUser.id);
//     setSelectedContact(otherParticipant);
//      resetChatState();  // Reset auto-open state
//   };

//   // Add a debounce function to prevent rapid channel switching
//   const debounce = (func, wait) => {
//     let timeout;
//     return function executedFunction(...args) {
//       const later = () => {
//         clearTimeout(timeout);
//         func(...args);
//       };
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//     };
//   };

//   // Create a debounced version of setupAblyChannel
//   const debouncedSetupAblyChannel = useCallback(
//     debounce((conversationId) => {
//       setupAblyChannel(conversationId);
//     }, 300),
//     [ablyClient, ablyChannel]
//   );

//     // Handle new chat with search result
//     const handleNewChatSelect = async (user) => {
//       await createConversation(user._id);
//       setSearchQuery('');
//       setSearchResults([]);
//     };

//     const scrollToBottom = () => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     useEffect(() => {
//       if (currentView === 'chat') {
//         scrollToBottom();
//       }
//     }, [messages, currentView]);

//     useEffect(() => {
//       const timeoutId = setTimeout(() => {
//         if (currentView === 'newChat') {
//           searchUsers(searchQuery);
//         }
//       }, 300);

//       return () => clearTimeout(timeoutId);
//     }, [searchQuery, currentView]);

//     const handleKeyPress = (e) => {
//       if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         handleSendMessage();
//       }
//     };

//     const getOtherParticipant = (conversation) => {
//       return conversation.participants?.find(p => p._id !== currentUser?.id);
//     };

//     const formatTimestamp = (timestamp) => {
//       const date = new Date(timestamp);
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

//       if (messageDate.getTime() === today.getTime()) {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       } else if (messageDate.getTime() === today.getTime() - 86400000) {
//         return 'Yesterday';
//       } else {
//         return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//       }
//     };

//     if (!currentUser) {
//       return (
//         <div className="fixed bottom-4 right-4 z-50">
//           <button className="bg-gray-400 text-white rounded-full p-4 shadow-lg cursor-not-allowed">
//             <MessageCircle size={24} />
//           </button>
//         </div>
//       );
//     }

//     return (
//       <>
//         {/* Background overlay when chat is open */}
//         {isOpen && (
//           <div 
//             className="fixed inset-0 bg-transparent bg-opacity-20 z-40"
//             onClick={() => setIsOpen(false)}
//           />
//         )}

//         {/* Chat Container */}
//         <div className="fixed bottom-4 right-4 z-50">
//           {/* Chat Button */}
//           {!isOpen && (
//             <button
//               onClick={() => setIsOpen(true)}
//               className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
//             >
//               <MessageCircle size={24} />
//             </button>
//           )}

//           {/* Chat Interface */}
//           {isOpen && (
//             <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-96 sm:h-[500px] flex flex-col overflow-hidden border">

//               {/* Conversations List View */}
//               {currentView === 'contacts' && (
//                 <>
//                   {/* Header */}
//                   <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                     <h2 className="text-lg font-semibold">Chats</h2>
//                     <div className="flex items-center space-x-2">
//                       <button 
//                         onClick={() => setCurrentView('newChat')}
//                         className="p-1 hover:bg-green-700 rounded"
//                         title="New Chat"
//                       >
//                         <Plus size={18} />
//                       </button>
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <MoreVertical size={18} />
//                       </button>
//                       <button
//                         onClick={handleClose}
//                         className="p-1 hover:bg-green-700 rounded"
//                       >
//                         <X size={18} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Conversations List */}
//                   <div className="flex-1 overflow-y-auto">
//                     {loading ? (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-gray-500">Loading chats...</div>
//                       </div>
//                     ) : conversations.length > 0 ? (
//                       conversations.map((conversation) => {
//                         const otherParticipant = getOtherParticipant(conversation);
//                         if (!otherParticipant) return null;

//                         const unreadCount = calculateUnreadCount(conversation);

//                         return (
//                           <div
//                             key={conversation._id}
//                             onClick={() => handleConversationSelect(conversation)}
//                             className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
//                           >
//                             <div className="flex items-center space-x-3">
//                               <div className="relative">
//                                 {otherParticipant.dp ? (
//                                   <img 
//                                     src={otherParticipant.dp} 
//                                     alt={otherParticipant.name}
//                                     className="w-10 h-10 rounded-full object-cover"
//                                   />
//                                 ) : (
//                                   <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                     {otherParticipant.name?.charAt(0)?.toUpperCase() || '?'}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center justify-between">
//                                   <h3 className="font-semibold text-sm text-gray-900 truncate">
//                                     {otherParticipant.name}
//                                   </h3>
//                                   <div className="flex items-center space-x-2">
//                                     <span className="text-xs text-gray-500">
//                                       {conversation.lastMessage?.timestamp && formatTimestamp(conversation.lastMessage.timestamp)}
//                                     </span>
//                                     {/* Unread message badge */}
//                                     {unreadCount > 0 && (
//                                       <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center flex-shrink-0">
//                                         {unreadCount > 99 ? '99+' : unreadCount}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center justify-between mt-1">
//                                   <p className="text-sm text-gray-600 truncate">
//                                     {conversation.lastMessage?.content || 'No messages yet'}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                         <MessageCircle size={48} className="mb-4 text-gray-300" />
//                         <p className="text-center px-4">No conversations yet</p>
//                         <button 
//                           onClick={() => setCurrentView('newChat')}
//                           className="mt-2 text-green-600 hover:text-green-700"
//                         >
//                           Start a new chat
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* New Chat View */}
//               {currentView === 'newChat' && (
//                 <>
//                   {/* Header */}
//                   <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <button
//                         onClick={() => {
//                           handleBackToContacts();
//                           setSearchQuery('');
//                           setSearchResults([]);
//                         }}
//                         className="p-1 hover:bg-green-700 rounded"
//                       >
//                         <ArrowLeft size={18} />
//                       </button>
//                       <h2 className="text-lg font-semibold">New Chat</h2>
//                     </div>
//                   </div>

//                   {/* Search Bar */}
//                   <div className="p-3 border-b bg-gray-50">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                       <input
//                         type="text"
//                         placeholder="Search users..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                       />
//                     </div>
//                   </div>

//                   {/* Search Results */}
//                   <div className="flex-1 overflow-y-auto">
//                     {searchResults.map((user) => (
//                       <div
//                         key={user._id}
//                         onClick={() => handleNewChatSelect(user)}
//                         className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center space-x-3">
//                           {user.dp ? (
//                             <img 
//                               src={user.dp} 
//                               alt={user.name}
//                               className="w-10 h-10 rounded-full object-cover"
//                             />
//                           ) : (
//                             <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                               {user.name?.charAt(0)?.toUpperCase() || '?'}
//                             </div>
//                           )}
//                           <div className="flex-1">
//                             <h3 className="font-semibold text-sm text-gray-900">{user.name}</h3>
//                             <p className="text-xs text-gray-500">{user.email}</p>
//                             <p className="text-xs text-gray-400">{user.major} • {user.collegeName}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     {searchQuery && searchResults.length === 0 && (
//                       <div className="flex items-center justify-center h-32">
//                         <p className="text-gray-500">No users found</p>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}

//               {/* Individual Chat View */}
//               {currentView === 'chat' && selectedContact && selectedConversation && (
//                 <>
//                   {/* Chat Header */}
//                   <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <button
//                          onClick={handleBackToContacts}
//                         className="p-1 hover:bg-green-700 rounded"
//                       >
//                         <ArrowLeft size={18} />
//                       </button>
//                       {selectedContact.dp ? (
//                         <img 
//                           src={selectedContact.dp} 
//                           alt={selectedContact.name}
//                           className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
//                           {selectedContact.name?.charAt(0)?.toUpperCase() || '?'}
//                         </div>
//                       )}
//                       <div>
//                         <h3 className="font-semibold text-sm sm:text-base">{selectedContact.name}</h3>
//                         <p className="text-xs text-green-100">{selectedContact.major}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <Video size={18} />
//                       </button>
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <Phone size={18} />
//                       </button>
//                       <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                         <MoreVertical size={18} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Messages Container */}
//                   <div
//                     className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
//                     style={{
//                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 0h40v40h-40z'/%3E%3C/g%3E%3C/svg%3E")`
//                     }}
//                   >
//                     <div className="space-y-3">
//                       {messages.map((msg) => {
//                         const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
//                         const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };

//                         return (
//                           <div
//                             key={msg._id}
//                             className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
//                           >
//                             <div className="flex items-end space-x-2 max-w-xs">
//                               {!isMe && (
//                                 <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-semibold mb-1">
//                                   {sender.name?.charAt(0)?.toUpperCase() || '?'}
//                                 </div>
//                               )}
//                               <div
//                                 className={`px-3 py-2 rounded-lg ${
//                                   isMe
//                                     ? 'bg-green-500 text-white rounded-br-none'
//                                     : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
//                                 }`}
//                               >
//                                 <p className="text-sm">{msg.content}</p>
//                                 <p className={`text-xs mt-1 ${
//                                   isMe ? 'text-green-100' : 'text-gray-500'
//                                 }`}>
//                                   {formatTimestamp(msg.createdAt)}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       <div ref={messagesEndRef} />
//                     </div>
//                   </div>

//                   {/* Input Area */}
//                   <div className="p-3 sm:p-4 bg-gray-100 border-t">
//                     <div className="flex items-center space-x-2">
//                       <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
//                         <Smile size={18} />
//                       </button>
//                       <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
//                         <Paperclip size={18} />
//                       </button>
//                       <div className="flex-1 relative">
//                         <input
//                           type="text"
//                           value={message}
//                           onChange={(e) => setMessage(e.target.value)}
//                           onKeyPress={handleKeyPress}
//                           placeholder="Type a message..."
//                           disabled={sending}
//                           className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:opacity-50"
//                         />
//                       </div>
//                       <button
//                         onClick={handleSendMessage}
//                         disabled={sending || !message.trim()}
//                         className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
//                       >
//                         <Send size={18} />
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </>
//     );
//   };

//   export default ChatBoard;






















'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, MoreVertical, Phone, Video, Search, Smile, Paperclip, ArrowLeft, Users, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useChat } from '@/contexts/ChatContext';


// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ChatBoard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('contacts');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Real data from backend
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [ablyChannel, setAblyChannel] = useState(null);
  const [ablyClient, setAblyClient] = useState(null);
  const [ablyError, setAblyError] = useState(null);
  const [isAblyConnecting, setIsAblyConnecting] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(null);


  // Update your initializeAbly function
  // useEffect(() => {
  //   const initializeAbly = async () => {
  //     if (isAblyConnecting || ablyClient) return;

  //     setIsAblyConnecting(true);
  //     setAblyError(null);

  //     try {
  //       console.log('Initializing Ably connection...');

  //       const Ably = (await import('ably')).default;

  //       // Generate a consistent clientId
  //       const clientId = `user-${currentUser?.id || 'anonymous'}-${Date.now()}`;

  //       // Use authUrl with clientId parameter
  //       const client = new Ably.Realtime({
  //         authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
  //         autoConnect: true,
  //         clientId: clientId, // Use the same clientId here
  //         log: { level: 2 },
  //         closeOnUnload: false,
  //         disconnectedRetryTimeout: 1000,
  //       });

  //       // Add connection event listeners
  //       client.connection.on('connecting', () => {
  //         console.log('Ably connecting...');
  //         setAblyError('Connecting to chat service...');
  //       });

  //       client.connection.on('connected', () => {
  //         console.log('Ably connected successfully');
  //         setAblyError(null);
  //         setIsAblyConnecting(false);
  //       });

  //       client.connection.on('disconnected', () => {
  //         console.log('Ably disconnected');
  //         setAblyError('Disconnected from chat service');
  //       });

  //       client.connection.on('suspended', () => {
  //         console.log('Ably connection suspended');
  //         setAblyError('Connection suspended. Reconnecting...');
  //       });

  //       client.connection.on('failed', (error) => {
  //         console.error('Ably connection failed:', error);
  //         setAblyError('Connection failed: ' + error.message);
  //         setIsAblyConnecting(false);
  //       });

  //       client.connection.on('closed', () => {
  //         console.log('Ably connection closed');
  //         setAblyError('Connection closed');
  //         setIsAblyConnecting(false);
  //       });

  //       setAblyClient(client);

  //     } catch (error) {
  //       console.error('Error initializing Ably:', error);
  //       setAblyError('Failed to initialize chat: ' + error.message);
  //       setIsAblyConnecting(false);
  //     }
  //   };
  //   if (isOpen && !ablyClient && !isAblyConnecting) {
  //     initializeAbly();
  //   }
  // }, [isOpen, ablyClient, isAblyConnecting, currentUser]);

// In component body

// Stable clientId
const [clientId] = useState(() => `user-${currentUser?.id || 'anonymous'}`);

// Initialize Ably client once currentUser is ready
useEffect(() => {
  if (!currentUser || ablyClient) return;

  const initializeAbly = async () => {
    try {
      const Ably = (await import('ably')).default;

      const client = new Ably.Realtime({
        authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
        autoConnect: true,
        clientId: clientId,
        log: { level: 2 },
        closeOnUnload: false,
        disconnectedRetryTimeout: 1000,
      });

      client.connection.on('connecting', () => setAblyError('Connecting to chat service...'));
      client.connection.on('connected', () => setAblyError(null));
      client.connection.on('disconnected', () => setAblyError('Disconnected from chat service'));
      client.connection.on('suspended', () => setAblyError('Connection suspended. Reconnecting...'));
      client.connection.on('failed', (err) => setAblyError('Connection failed: ' + err.message));
      client.connection.on('closed', () => setAblyError('Connection closed'));

      setAblyClient(client);

    } catch (err) {
      console.error('Error initializing Ably:', err);
      setAblyError('Failed to initialize chat: ' + err.message);
    }
  };

  initializeAbly();
}, [currentUser, ablyClient, clientId]);


  // Get chat context
  const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();

  const messagesEndRef = useRef(null);

  //useEffect to handle auto-opening conversations
  useEffect(() => {
    if (isOpen && autoOpenConversation && currentUser) {
      handleAutoOpenConversation(autoOpenConversation);
    }
  }, [isOpen, autoOpenConversation, currentUser]);

  const [isAutoOpening, setIsAutoOpening] = useState(false);

  const handleAutoOpenConversation = async (user) => {
    try {
      setIsAutoOpening(true);
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => {
        const otherParticipant = conv.participants.find(p => p._id === user._id);
        return otherParticipant !== undefined;
      });

      if (existingConversation) {
        // If conversation exists, open it directly
        handleConversationSelect(existingConversation);
      } else {
        // If not, create new conversation and open it
        await createConversation(user._id);
      }

      // Reset the flag
      resetChatState();
    } catch (error) {
      console.error('Error auto-opening conversation:', error);
      resetChatState();
    } finally {
      setIsAutoOpening(false);
    }
  };


  useEffect(() => {
    setIsOpen(isChatOpen);
  }, [isChatOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetChatState();
    }
  }, [isOpen, resetChatState]);

  // Handle automatic conversation creation when targetUser is set
  useEffect(() => {
    if (shouldCreateConversation && targetUser && currentUser) {
      handleAutoCreateConversation(targetUser);
    }
  }, [shouldCreateConversation, targetUser, currentUser]);

  // Get current user from Supabase
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        loadConversations(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Auto-create conversation with target user
  const handleAutoCreateConversation = async (user) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => {
        const otherParticipant = conv.participants.find(p => p._id === user._id);
        return otherParticipant !== undefined;
      });

      if (existingConversation) {
        // If conversation exists, open it
        handleConversationSelect(existingConversation);
      } else {
        // If not, create new conversation
        await createConversation(user._id);
      }

      // Reset the flag
      resetChatState();
    } catch (error) {
      console.error('Error auto-creating conversation:', error);
      resetChatState();
    }
  };

  // Load user's conversations
  const loadConversations = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/conversation?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    setIsChatOpen(false);
    resetChatState();
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId) => {
    try {
      console.log('Loading messages for conversation:', conversationId);
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);


      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      console.log('Messages data:', data);

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Search users for new chat
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/chat/users/search?query=${query}&currentUserId=${currentUser.id}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  // Create or get conversation
  const createConversation = async (otherUserId) => {
    try {
      const response = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId1: currentUser.id,
          userId2: otherUserId
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedConversation(data.conversation);
        setCurrentView('chat');
        loadMessages(data.conversation._id);
        setupAblyChannel(data.conversation._id);

        // Add to conversations list if new
        const existingConv = conversations.find(c => c._id === data.conversation._id);
        if (!existingConv) {
          setConversations(prev => [data.conversation, ...prev]);
        }
        // Find the other participant
        const otherParticipant = data.conversation.participants.find(p => p._id !== currentUser.id);
        setSelectedContact(otherParticipant);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Setup Ably channel when conversation is selected

  // const setupAblyChannel = (conversationId) => {
  //   // If we're already setting up or using this channel, skip
  //   if (currentChannelId === conversationId && ablyChannel) {
  //     console.log('Already using this channel, skipping setup');
  //     return;
  //   }

  //   if (!ablyClient || ablyClient.connection.state !== 'connected') {
  //     console.log('Ably client not ready, delaying channel setup');
  //     setAblyError('Connecting to chat service...');

  //     // Retry after connection is established
  //     const checkConnection = () => {
  //       if (ablyClient && ablyClient.connection.state === 'connected') {
  //         setupAblyChannel(conversationId);
  //       } else if (ablyClient && ablyClient.connection.state === 'failed') {
  //         setAblyError('Connection failed. Please refresh the page.');
  //       } else {
  //         setTimeout(checkConnection, 500);
  //       }
  //     };
  //     setTimeout(checkConnection, 500);
  //     return;
  //   }

  //   try {
  //     // Unsubscribe from previous channel if it's different
  //     if (ablyChannel && currentChannelId !== conversationId) {
  //       try {
  //         ablyChannel.unsubscribe();
  //         ablyChannel.detach();
  //         console.log('Detached from previous channel:', currentChannelId);
  //       } catch (error) {
  //         console.warn('Error detaching from previous channel:', error);
  //       }
  //     }

  //     const channel = ablyClient.channels.get(`chat-${conversationId}`);
  //     setCurrentChannelId(conversationId);

  //     // Add channel event listeners
  //     channel.on('attached', () => {
  //       console.log('Channel attached successfully:', conversationId);
  //       setAblyError(null);
  //     });

  //     channel.on('failed', (error) => {
  //       console.error('Channel failed:', error);
  //       setAblyError('Failed to join chat channel');
  //     });

  //     channel.on('detached', () => {
  //       console.log('Channel detached:', conversationId);
  //     });

  //     channel.on('suspended', () => {
  //       console.log('Channel suspended:', conversationId);
  //       setAblyError('Channel connection suspended');
  //     });

  //     // Subscribe to messages
  //     channel.subscribe("message", (message) => {
  //       const newMessage = message.data;

  //       if (newMessage.senderId !== currentUser.id) {
  //         setMessages((prev) => [...prev, {
  //           _id: newMessage._id || `ably-${Date.now()}`,
  //           conversationId: newMessage.conversationId,
  //           content: newMessage.content,
  //           messageType: newMessage.messageType || 'text',
  //           createdAt: newMessage.createdAt || new Date().toISOString(),
  //           senderId: {
  //             _id: newMessage.senderId,
  //             name: newMessage.senderName || 'Unknown',
  //             dp: newMessage.senderDp || ''
  //           }
  //         }]);
  //       }
  //     });

  //     // Attach to the channel
  //     channel.attach((err) => {
  //       if (err) {
  //         console.error('Failed to attach to channel:', err);
  //         setAblyError('Failed to join chat');
  //       } else {
  //         console.log('Successfully attached to channel');
  //       }
  //     });

  //     setAblyChannel(channel);

  //   } catch (error) {
  //     console.error('Error setting up Ably channel:', error);
  //     setAblyError('Failed to set up chat channel');
  //   }
  // };

  // Setup Ably channel whenever ablyClient or selectedConversation changes
useEffect(() => {
  if (!ablyClient || !selectedConversation) return;

  const conversationId = selectedConversation._id;

  const setupChannel = async () => {
    // Detach previous channel if exists
    if (ablyChannel) {
      try {
        ablyChannel.unsubscribe();
        await ablyChannel.detach();
      } catch (err) {
        console.warn('Error detaching previous channel:', err);
      }
    }

    const channel = ablyClient.channels.get(`chat-${conversationId}`);

    channel.on('attached', () => setAblyError(null));
    channel.on('failed', () => setAblyError('Failed to join chat channel'));
    channel.on('suspended', () => setAblyError('Channel connection suspended'));

    channel.subscribe('message', (msg) => {
      const newMessage = msg.data;
      if (newMessage.senderId !== currentUser.id) {
        setMessages((prev) => [
          ...prev,
          {
            _id: newMessage._id || `ably-${Date.now()}`,
            conversationId: newMessage.conversationId,
            content: newMessage.content,
            messageType: newMessage.messageType || 'text',
            createdAt: newMessage.createdAt || new Date().toISOString(),
            senderId: {
              _id: newMessage.senderId,
              name: newMessage.senderName || 'Unknown',
              dp: newMessage.senderDp || '',
            },
          },
        ]);
      }
    });

    channel.attach((err) => {
      if (err) setAblyError('Failed to join chat');
    });

    setAblyChannel(channel);
    setCurrentChannelId(conversationId);
  };

  if (ablyClient.connection.state === 'connected') {
    setupChannel();
  } else {
    const onConnect = () => setupChannel();
    ablyClient.connection.once('connected', onConnect);
    return () => ablyClient.connection.off('connected', onConnect);
  }
}, [ablyClient, selectedConversation]);


  //  useEffect to set the initial view
  useEffect(() => {
    if (isOpen && autoOpenConversation) {
      setCurrentView('chat');
    } else if (isOpen) {
      setCurrentView('contacts');
    }
  }, [isOpen, autoOpenConversation]);

  // Update the cleanup useEffect
  // useEffect(() => {
  //   return () => {
  //     // Only cleanup when component truly unmounts
  //     if (ablyChannel) {
  //       try {
  //         // Check channel state before trying to detach
  //         if (ablyChannel.state === 'attached' || ablyChannel.state === 'attaching') {
  //           ablyChannel.unsubscribe();
  //           ablyChannel.detach((err) => {
  //             if (err) {
  //               console.warn('Error detaching channel:', err);
  //             } else {
  //               console.log('Channel detached successfully');
  //             }
  //           });
  //         }
  //       } catch (error) {
  //         console.warn('Error cleaning up channel:', error);
  //       }
  //     }
  //   };
  // }, [ablyChannel]);

  useEffect(() => {
  return () => {
    if (ablyChannel) {
      try {
        ablyChannel.unsubscribe();
        ablyChannel.detach().catch(console.warn);
      } catch (err) {
        console.warn('Error cleaning up Ably channel:', err);
      }
    }
    if (ablyClient) ablyClient.close();
  };
}, [ablyChannel, ablyClient]);


  //separate useEffect for handling chat close/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (ablyClient) {
        ablyClient.close();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [ablyClient]);

  // const handleSendMessage = async () => {
  //   if (!message.trim() || !selectedConversation || sending) return;

  //   // Check if Ably connection is still open
  //   if (!ablyClient || ablyClient.connection.state !== 'connected') {
  //     setAblyError('Connection lost. Please try again.');
  //     return;
  //   }

  //   setSending(true);
  //   const tempMessage = {
  //     _id: 'temp-' + Date.now(),
  //     content: message,
  //     senderId: {
  //       _id: currentUser.id,
  //       name: currentUser.user_metadata?.full_name || 'You',
  //       dp: currentUser.user_metadata?.avatar_url || ''
  //     },
  //     createdAt: new Date().toISOString(),
  //     messageType: 'text'
  //   };

  //   // Add message optimistically
  //   setMessages(prev => [...prev, tempMessage]);
  //   const messageText = message;
  //   setMessage('');

  //   try {
  //     const response = await fetch('/api/chat/send', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         conversationId: selectedConversation._id,
  //         senderId: currentUser.id,
  //         content: messageText,
  //         messageType: 'text'
  //       })
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  //     }

  //     const data = await response.json();

  //     if (data.success) {
  //       // Replace temp message with real one
  //       setMessages(prev => prev.map(msg =>
  //         msg._id === tempMessage._id ? data.message : msg
  //       ));

  //       // Update conversation in list
  //       setConversations(prev => prev.map(conv =>
  //         conv._id === selectedConversation._id
  //           ? {
  //             ...conv,
  //             lastMessage: {
  //               content: messageText,
  //               timestamp: new Date(),
  //               senderId: currentUser.id
  //             }
  //           }
  //           : conv
  //       ));

  //       // Publish to Ably channel if available and connected
  //       if (ablyChannel && ablyClient.connection.state === 'connected') {
  //         try {
  //           await ablyChannel.publish("message", {
  //             _id: data.message._id,
  //             conversationId: data.message.conversationId,
  //             senderId: data.message.senderId._id,
  //             senderName: data.message.senderId.name,
  //             senderDp: data.message.senderId.dp,
  //             content: data.message.content,
  //             messageType: data.message.messageType,
  //             createdAt: data.message.createdAt
  //           });
  //         } catch (publishError) {
  //           console.error('Failed to publish to Ably:', publishError);
  //           // Don't show error to user for publish failures
  //         }
  //       }

  //       console.log("Sending message payload:", {
  //         conversationId: selectedConversation._id,
  //         senderId: currentUser.id,
  //         content: messageText
  //       });

  //     } else {
  //       throw new Error(data.error || 'Failed to send message');
  //     }
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     // Remove temp message on error
  //     setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
  //     setMessage(messageText); // Restore message
  //     alert('Failed to send message. Please try again.');
  //   } finally {
  //     setSending(false);
  //   }
  // };

//   const handleSendMessage = async () => {
//   if (!message.trim() || !selectedConversation || sending) return;

//   setSending(true);

//   const tempMessage = {
//     _id: 'temp-' + Date.now(),
//     content: message,
//     senderId: {
//       _id: currentUser.id,
//       name: currentUser.user_metadata?.full_name || 'You',
//       dp: currentUser.user_metadata?.avatar_url || ''
//     },
//     createdAt: new Date().toISOString(),
//     messageType: 'text'
//   };

//   // Add message optimistically
//   setMessages(prev => [...prev, tempMessage]);
//   const messageText = message;
//   setMessage('');

//   try {
//     const response = await fetch('/api/chat/send', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         conversationId: selectedConversation._id,
//         senderId: currentUser.id,
//         content: messageText,
//         messageType: 'text'
//       })
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//     }

//     const data = await response.json();

//     if (data.success) {
//       // Replace temp message with real one
//       setMessages(prev => prev.map(msg =>
//         msg._id === tempMessage._id ? data.message : msg
//       ));

//       // Update conversation in list
//       setConversations(prev => prev.map(conv =>
//         conv._id === selectedConversation._id
//           ? {
//               ...conv,
//               lastMessage: {
//                 content: messageText,
//                 timestamp: new Date(),
//                 senderId: currentUser.id
//               }
//             }
//           : conv
//       ));
//     } else {
//       throw new Error(data.error || 'Failed to send message');
//     }
//   } catch (error) {
//     console.error('Error sending message:', error);
//     // Remove temp message on error
//     setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
//     setMessage(messageText); // Restore message
//     alert('Failed to send message. Please try again.');
//   } finally {
//     setSending(false);
//   }
// };


const handleSendMessage = async () => {
  if (!message.trim() || !selectedConversation || sending) return;

  // Check if Ably connection is still open
  if (!ablyClient || ablyClient.connection.state !== "connected") {
    setAblyError("Connection lost. Please try again.");
    return;
  }

  setSending(true);

  const tempMessage = {
    _id: "temp-" + Date.now(),
    content: message,
    senderId: {
      _id: currentUser.id,
      name: currentUser.user_metadata?.full_name || "You",
      dp: currentUser.user_metadata?.avatar_url || "",
    },
    createdAt: new Date().toISOString(),
    messageType: "text",
  };

  // Add optimistic message
  setMessages((prev) => [...prev, tempMessage]);
  const messageText = message;
  setMessage("");

  try {
    const response = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedConversation._id,
        senderId: currentUser.id,
        content: messageText,
        messageType: "text",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    if (data.success) {
      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempMessage._id ? data.message : msg))
      );

      // Update conversation in list
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selectedConversation._id
            ? {
                ...conv,
                lastMessage: {
                  content: messageText,
                  timestamp: new Date(),
                  senderId: currentUser.id,
                },
              }
            : conv
        )
      );

      // ✅ Publish to Ably channel (no await in latest SDK)
      if (ablyChannel && ablyClient.connection.state === "connected") {
        ablyChannel.publish(
          "message",
          {
            _id: data.message._id,
            conversationId: data.message.conversationId,
            senderId: data.message.senderId._id,
            senderName: data.message.senderId.name,
            senderDp: data.message.senderId.dp,
            content: data.message.content,
            messageType: data.message.messageType,
            createdAt: data.message.createdAt,
          },
          (err) => {
            if (err) {
              console.error("Failed to publish to Ably:", err);
            }
          }
        );
      }

      console.log("Sending message payload:", {
        conversationId: selectedConversation._id,
        senderId: currentUser.id,
        content: messageText,
      });
    } else {
      throw new Error(data.error || "Failed to send message");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    // rollback optimistic message
    setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
    setMessage(messageText); // restore unsent
    alert("Failed to send message. Please try again.");
  } finally {
    setSending(false);
  }
};


  const handleBackToContacts = () => {
    // Reset chat-specific state
    setSelectedConversation(null);
    setSelectedContact(null);
    setMessages([]);
    setCurrentView('contacts');

    // Clean up Ably channel but keep the client connection
    if (ablyChannel) {
      try {
        ablyChannel.unsubscribe();
        setAblyChannel(null);
        setCurrentChannelId(null);
      } catch (error) {
        console.warn('Error cleaning up channel:', error);
      }
    }
  };

  // Update handleConversationSelect to use the debounced version
  const handleConversationSelect = (conversation) => {

    setSelectedConversation(conversation);
    setCurrentView('chat'); // This ensures we go directly to chat view 
    loadMessages(conversation._id);

    if (ablyClient && ablyClient.connection.state === 'connected') {
      debouncedSetupAblyChannel(conversation._id);
    } else {
      setAblyError('Waiting for connection...');
      const waitForConnection = () => {
        if (ablyClient && ablyClient.connection.state === 'connected') {
          debouncedSetupAblyChannel(conversation._id);
        } else {
          setTimeout(waitForConnection, 100);
        }
      };
      waitForConnection();
    }

    const otherParticipant = conversation.participants.find(p => p._id !== currentUser.id);
    setSelectedContact(otherParticipant);
    resetChatState();  // Reset auto-open state
  };

  // Add a debounce function to prevent rapid channel switching
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Create a debounced version of setupAblyChannel
  const debouncedSetupAblyChannel = useCallback(
    debounce((conversationId) => {
      setupAblyChannel(conversationId);
    }, 300),
    [ablyClient, ablyChannel]
  );

  // Handle new chat with search result
  const handleNewChatSelect = async (user) => {
    await createConversation(user._id);
    setSearchQuery('');
    setSearchResults([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, currentView]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentView === 'newChat') {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentView]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(p => p._id !== currentUser?.id);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-gray-400 text-white rounded-full p-4 shadow-lg cursor-not-allowed">
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Background overlay when chat is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Container */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {/* Chat Interface */}
        {isOpen && (
          <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-96 sm:h-[500px] flex flex-col overflow-hidden border">

            {/* Conversations List View */}
            {currentView === 'contacts' && (
              <>
                {/* Header */}
                <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Chats</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentView('newChat')}
                      className="p-1 hover:bg-green-700 rounded"
                      title="New Chat"
                    >
                      <Plus size={18} />
                    </button>
                    <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
                      <MoreVertical size={18} />
                    </button>
                    <button
                      onClick={handleClose}
                      className="p-1 hover:bg-green-700 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-gray-500">Loading chats...</div>
                    </div>
                  ) : conversations.length > 0 ? (
                    conversations.map((conversation) => {
                      const otherParticipant = getOtherParticipant(conversation);
                      if (!otherParticipant) return null;

                      return (
                        <div
                          key={conversation._id}
                          onClick={() => handleConversationSelect(conversation)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              {otherParticipant.dp ? (
                                <img
                                  src={otherParticipant.dp}
                                  alt={otherParticipant.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {otherParticipant.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                  {otherParticipant.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {conversation.lastMessage?.timestamp && formatTimestamp(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">
                                  {conversation.lastMessage?.content || 'No messages yet'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageCircle size={48} className="mb-4 text-gray-300" />
                      <p className="text-center px-4">No conversations yet</p>
                      <button
                        onClick={() => setCurrentView('newChat')}
                        className="mt-2 text-green-600 hover:text-green-700"
                      >
                        Start a new chat
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* New Chat View */}
            {currentView === 'newChat' && (
              <>
                {/* Header */}
                <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        handleBackToContacts();
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-1 hover:bg-green-700 rounded"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-lg font-semibold">New Chat</h2>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="p-3 border-b bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                </div>

                {/* Search Results */}
                <div className="flex-1 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleNewChatSelect(user)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {user.dp ? (
                          <img
                            src={user.dp}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">{user.name}</h3>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.major} • {user.collegeName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchQuery && searchResults.length === 0 && (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Individual Chat View */}
            {currentView === 'chat' && selectedContact && selectedConversation && (
              <>
                {/* Chat Header */}
                <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleBackToContacts}
                      className="p-1 hover:bg-green-700 rounded"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    {selectedContact.dp ? (
                      <img
                        src={selectedContact.dp}
                        alt={selectedContact.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
                        {selectedContact.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{selectedContact.name}</h3>
                      <p className="text-xs text-green-100">{selectedContact.major}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
                      <Video size={18} />
                    </button>
                    <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
                      <Phone size={18} />
                    </button>
                    <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 0h40v40h-40z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}
                >
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
                      const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };

                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-end space-x-2 max-w-xs">
                            {!isMe && (
                              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-semibold mb-1">
                                {sender.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            )}
                            <div
                              className={`px-3 py-2 rounded-lg ${isMe
                                  ? 'bg-green-500 text-white rounded-br-none'
                                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isMe ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                {formatTimestamp(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 bg-gray-100 border-t">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
                      <Smile size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
                      <Paperclip size={18} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={sending}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:opacity-50"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={sending || !message.trim()}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBoard;