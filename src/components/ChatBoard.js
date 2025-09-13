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
//   const conversationsRef = useRef(conversations);
//   const messagesEndRef = useRef(null);
//   const [isAutoOpening, setIsAutoOpening] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState(new Set());
//   const [presenceChannel, setPresenceChannel] = useState(null);

//   const [isTyping, setIsTyping] = useState(false);
//   const [typingUsers, setTypingUsers] = useState({});
//   const [typingTimeout, setTypingTimeout] = useState(null);

//   // Add typing handlers
//   const handleTypingStart = useCallback(() => {
//     if (!ablyChannel || !currentUser) return;

//     setIsTyping(true);

//     // Send typing start event
//     ablyChannel.publish("typing", {
//       userId: currentUser.id,
//       typing: true,
//       name: currentUser.user_metadata?.full_name || 'Unknown'
//     });

//     // Clear previous timeout
//     if (typingTimeout) {
//       clearTimeout(typingTimeout);
//     }

//     // Set timeout to stop typing after 3 seconds
//     const timeout = setTimeout(() => {
//       handleTypingStop();
//     }, 3000);

//     setTypingTimeout(timeout);
//   }, [ablyChannel, currentUser, typingTimeout]);

//   const handleTypingStop = useCallback(() => {
//     if (!ablyChannel || !currentUser) return;

//     setIsTyping(false);

//     // Send typing stop event
//     ablyChannel.publish("typing", {
//       userId: currentUser.id,
//       typing: false,
//       name: currentUser.user_metadata?.full_name || 'Unknown'
//     });

//     // Clear timeout
//     if (typingTimeout) {
//       clearTimeout(typingTimeout);
//       setTypingTimeout(null);
//     }
//   }, [ablyChannel, currentUser, typingTimeout]);

//   // Add debounced status checks to avoid flickering
//   const [userStatusCache, setUserStatusCache] = useState({});

//   useEffect(() => {
//     const checkAllStatuses = debounce(async () => {
//       if (!ablyClient) return;

//       try {
//         const globalPresenceChannel = ablyClient.channels.get('presence-global');
//         const presenceSet = await globalPresenceChannel.presence.get();

//         const newStatusCache = {};
//         presenceSet.forEach(user => {
//           newStatusCache[user.data.userId] = user.data.status || 'online';
//         });

//         setUserStatusCache(newStatusCache);
//       } catch (error) {
//         console.error('Error checking statuses:', error);
//       }
//     }, 1000); // Debounce to avoid too many requests

//     checkAllStatuses();
//   }, [ablyClient, onlineUsers]);


//   useEffect(() => {
//     if (ablyClient && ablyClient.connection.state === 'connected' && currentUser) {
//       console.log('Both ablyClient and currentUser available, setting up presence');
//       setupPresence();
//     }
//   }, [ablyClient, currentUser]); // This will trigger when ablyClient is set

//   // 3. Simplify your setupPresence function
//   const setupPresence = useCallback(async () => {
//     console.log('setupPresence called with:', {
//       hasAblyClient: !!ablyClient,
//       hasCurrentUser: !!currentUser,
//       currentUserId: currentUser?.id,
//       ablyState: ablyClient?.connection.state
//     });

//     if (!ablyClient || ablyClient.connection.state !== 'connected' || !currentUser) {
//       console.log('Cannot setup presence: missing requirements');
//       return;
//     }

//     try {
//       const presenceChannel = ablyClient.channels.get('presence-global');
//       console.log('Entering presence for user:', currentUser.id);

//       await presenceChannel.presence.enter({
//         userId: currentUser.id,
//         name: currentUser.user_metadata?.full_name || 'Unknown',
//         avatar: currentUser.user_metadata?.avatar_url || '',
//         status: 'online'
//       });

//       console.log('Successfully entered presence');

//       presenceChannel.presence.subscribe('enter', (presenceMessage) => {
//         console.log('USER ENTERED:', presenceMessage.data.userId);
//         setOnlineUsers(prev => new Set(prev).add(presenceMessage.data.userId));
//       });

//       presenceChannel.presence.subscribe('leave', (presenceMessage) => {
//         console.log('USER LEFT:', presenceMessage.data.userId);
//         setOnlineUsers(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(presenceMessage.data.userId);
//           return newSet;
//         });
//       });

//       const presenceSet = await presenceChannel.presence.get();
//       console.log('INITIAL ONLINE USERS:', presenceSet.map(user => user.data.userId));

//       const onlineUserIds = new Set(presenceSet.map(msg => msg.data.userId));
//       setOnlineUsers(onlineUserIds);

//       setPresenceChannel(presenceChannel);

//     } catch (error) {
//       console.error('Error setting up presence:', error);
//     }
//   }, [ablyClient, currentUser]);

//   // Add this to monitor connection state changes
//   useEffect(() => {
//     if (!ablyClient) return;

//     const handleStateChange = (stateChange) => {
//       console.log('Ably state changed:', stateChange.current);
//       if (stateChange.current === 'connected' && currentUser) {
//         // Setup presence when connection is established
//         setupPresence();
//       }
//     };

//     ablyClient.connection.on(handleStateChange);

//     return () => {
//       ablyClient.connection.off(handleStateChange);
//     };
//   }, [ablyClient, currentUser, setupPresence]);

//   // Add this to detect duplicate conversations
//   useEffect(() => {
//     const conversationIds = conversations.map(c => c._id);
//     const duplicateIds = conversationIds.filter((id, index) =>
//       conversationIds.indexOf(id) !== index
//     );

//     if (duplicateIds.length > 0) {

//       // Remove duplicates
//       const uniqueConversations = conversations.filter((conv, index, self) =>
//         index === self.findIndex(c => c._id === conv._id)
//       );

//       if (uniqueConversations.length !== conversations.length) {
//         setConversations(uniqueConversations);
//       }
//     }
//   }, [conversations]);


//   // Update your initializeAbly function
//   useEffect(() => {
//     const initializeAbly = async () => {
//       if (isAblyConnecting || ablyClient || !currentUser) return;

//       setIsAblyConnecting(true);
//       setAblyError(null);

//       try {
//         const Ably = (await import('ably')).default;

//         // Generate a consistent clientId
//         // const clientId = `user-${currentUser?.id || 'anonymous'}-${Date.now()}`;

//         // Use the SAME clientId for the same user across all browsers
//         const clientId = `user-${currentUser.id}`;

//         // Use authUrl with clientId parameter
//         const client = new Ably.Realtime({
//           authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
//           autoConnect: true,
//           clientId: clientId, // Use the same clientId here
//           log: { level: 2 },
//           closeOnUnload: false,
//           disconnectedRetryTimeout: 1000,
//         });

//         setAblyClient(client);

//         // Add connection event listeners
//         client.connection.on('connecting', () => {
//           setAblyError('Connecting to chat service...');
//         });

//         client.connection.on('connected', () => {
//           setAblyError(null);
//           setIsAblyConnecting(false);
//           setupPresence(); // Call presence setup after connection
//         });

//         client.connection.on('disconnected', () => {
//           setAblyError('Disconnected from chat service');
//         });

//         client.connection.on('suspended', () => {
//           setAblyError('Connection suspended. Reconnecting...');
//         });

//         client.connection.on('failed', (error) => {
//           setAblyError('Connection failed: ' + error.message);
//           setIsAblyConnecting(false);
//         });

//         client.connection.on('closed', () => {
//           setAblyError('Connection closed');
//           setIsAblyConnecting(false);
//         });

//       } catch (error) {
//         setAblyError('Failed to initialize chat: ' + error.message);
//         setIsAblyConnecting(false);
//       }
//     };
//     if (isOpen && !ablyClient && !isAblyConnecting && currentUser) {
//       initializeAbly();
//     }
//   }, [isOpen, ablyClient, isAblyConnecting, currentUser, setupPresence]);


//   useEffect(() => {
//     if (ablyClient && ablyClient.connection.state === 'connected' && currentUser) {
//       console.log('Both ablyClient and currentUser available, setting up presence');
//       setupPresence();
//     }
//   }, [ablyClient, currentUser, setupPresence]);


//   // Get chat context
//   const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();


//   const handleAutoOpenConversation = async (user) => {
//     try {
//       setIsAutoOpening(true);
//       // Use the ref to get the current conversations
//       const currentConversations = conversationsRef.current;
//       // Check if conversation already exists with this user
//       const existingConversation = currentConversations.find(conv => {
//         const hasUser = conv.participants.some(p => String(p._id) === String(user._id));
//         return hasUser;
//       });


//       if (existingConversation) {
//         handleConversationSelect(existingConversation);
//       } else {
//         await createConversation(user._id);
//       }
//     } catch (error) {
//       console.error('❌ Error auto-opening conversation:', error);
//     } finally {
//       // Reset the state AFTER the conversation is opened
//       resetChatState();
//       setIsAutoOpening(false);
//     }
//   };

//   const createConversation = async (otherUserId) => {
//     try {

//       // Double-check that conversation doesn't already exist
//       const currentConversations = conversationsRef.current;
//       const alreadyExists = currentConversations.find(conv => {
//         return conv.participants.some(p => normalizeId(p._id) === normalizeId(otherUserId));
//       });

//       if (alreadyExists) {
//         handleConversationSelect(alreadyExists);
//         return;
//       }

//       const response = await fetch('/api/chat/conversation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId1: currentUser.id,
//           userId2: otherUserId
//         })
//       });

//       const data = await response.json();

//       if (data.success) {

//         // Make sure we're not adding duplicates
//         const alreadyInList = conversations.some(c => c._id === data.conversation._id);
//         if (!alreadyInList) {
//           setConversations(prev => [data.conversation, ...prev]);
//         }

//         setSelectedConversation(data.conversation);
//         setCurrentView('chat');
//         loadMessages(data.conversation._id);
//         setupAblyChannel(data.conversation._id);

//         const otherParticipant = data.conversation.participants.find(p => p._id !== currentUser.id);
//         setSelectedContact(otherParticipant);
//       }
//     } catch (error) {
//       console.error('❌ Error creating conversation:', error);
//     }
//   };

//   useEffect(() => {
//     setIsOpen(isChatOpen);
//   }, [isChatOpen]);

//   useEffect(() => {
//     if (!isOpen) {
//       resetChatState();
//     }
//   }, [isOpen, resetChatState]);

//   // Add this useEffect to listen for force open events
//   useEffect(() => {
//     const handleForceOpen = (event) => {
//       const { user } = event.detail;
//       if (user && currentUser) {
//         handleAutoOpenConversation(user);
//       }
//     };

//     window.addEventListener('chatForceOpen', handleForceOpen);

//     return () => {
//       window.removeEventListener('chatForceOpen', handleForceOpen);
//     };
//   }, [currentUser]);

//   // Also update your existing useEffect that handles auto-opening:
//   useEffect(() => {
//     if (isOpen && autoOpenConversation && currentUser && !isAutoOpening) {
//       // Add a small delay to ensure the chat is fully open
//       setTimeout(() => {
//         handleAutoOpenConversation(autoOpenConversation);
//       }, 200);
//     }
//   }, [isOpen, autoOpenConversation, currentUser, conversations, isAutoOpening]);

//   // Get current user from Supabase
//   useEffect(() => {
//     const getCurrentUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         setCurrentUser(user);
//         loadConversations(user.id);
//       }
//     };
//     getCurrentUser();
//   }, []);

//   // Load user's conversations
//   const loadConversations = async (userId) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/chat/conversation?userId=${userId}`);
//       const data = await response.json();

//       if (data.success) {
//         setConversations(data.conversations);
//       }
//     } catch (error) {
//       console.error('Error loading conversations:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleClose = () => {
//     setIsOpen(false);
//     setIsChatOpen(false);
//     resetChatState();
//   };

//   // Load messages for a conversation
//   const loadMessages = async (conversationId) => {
//     try {
//       const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//       }

//       const data = await response.json();


//       if (data.success) {
//         setMessages(data.messages);
//       }
//     } catch (error) {
//       console.error('Error loading messages:', error);
//     }
//   };

//   // Search users for new chat
//   const searchUsers = async (query) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/chat/users/search?query=${query}&currentUserId=${currentUser.id}`);
//       const data = await response.json();

//       if (data.success) {
//         setSearchResults(data.users);
//       }
//     } catch (error) {
//       console.error('Error searching users:', error);
//     }
//   };

//   // Setup Ably channel when conversation is selected
//   const setupAblyChannel = (conversationId) => {

//     // If we're already setting up or using this channel, skip
//     if (currentChannelId === conversationId && ablyChannel) {
//       return;
//     }

//     if (!ablyClient || ablyClient.connection.state !== 'connected') {
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
//         } catch (error) {
//           console.warn('Error detaching from previous channel:', error);
//         }
//       }

//       const channel = ablyClient.channels.get(`chat-${conversationId}`);
//       setCurrentChannelId(conversationId);

//       // Add channel event listeners
//       channel.on('attached', () => {
//         setAblyError(null);
//         setupConversationPresence(conversationId);
//       });

//       channel.on('failed', (error) => {
//         setAblyError('Failed to join chat channel');
//       });



//       channel.on('suspended', () => {
//         setAblyError('Channel connection suspended');
//       });

//       // Subscribe to typing events
//       channel.subscribe("typing", (message) => {
//         if (message.data.userId !== currentUser.id) {
//           setTypingUsers(prev => ({
//             ...prev,
//             [message.data.userId]: message.data.typing
//           }));

//           // Auto-clear typing after 3 seconds
//           if (message.data.typing) {
//             setTimeout(() => {
//               setTypingUsers(prev => ({
//                 ...prev,
//                 [message.data.userId]: false
//               }));
//             }, 3000);
//           }
//         }
//       });

//       // Subscribe to messages with robust duplicate prevention
//       channel.subscribe("message", (message) => {
//         const newMessage = message.data;

//         if (newMessage.senderId !== currentUser.id) {
//           setMessages((prev) => {


//             // Add to seen messages
//             setSeenMessageIds(prev => new Set(prev).add(newMessage._id));

//             return [...prev, {
//               _id: newMessage._id,
//               conversationId: newMessage.conversationId,
//               content: newMessage.content,
//               messageType: newMessage.messageType || 'text',
//               createdAt: newMessage.createdAt || new Date().toISOString(),
//               senderId: {
//                 _id: newMessage.senderId,
//                 name: newMessage.senderName || 'Unknown',
//                 dp: newMessage.senderDp || ''
//               }
//             }];
//           });
//         }
//       });

//       setAblyChannel(channel);

//     } catch (error) {
//       console.error('Error setting up Ably channel:', error);
//       setAblyError('Failed to set up chat channel');
//     }
//   };

//   // Add this helper function near the top of your component
//   const normalizeId = (id) => {
//     if (!id) return '';
//     return String(id).trim();
//   };

//   // Add heartbeat interval
//   useEffect(() => {
//     if (!presenceChannel) return;

//     const heartbeatInterval = setInterval(async () => {
//       try {
//         await presenceChannel.presence.enter({
//           userId: currentUser.id,
//           name: currentUser.user_metadata?.full_name || 'Unknown',
//           avatar: currentUser.user_metadata?.avatar_url || '',
//           status: 'online',
//           lastSeen: new Date().toISOString()
//         });
//       } catch (error) {
//         console.error('Heartbeat failed:', error);
//       }
//     }, 30000); // Every 30 seconds

//     return () => clearInterval(heartbeatInterval);
//   }, [presenceChannel, currentUser]);

//   // Add this function to update presence status
//   const updatePresenceStatus = async (status) => {
//     if (!presenceChannel) return;

//     try {
//       await presenceChannel.presence.update({
//         userId: currentUser.id,
//         name: currentUser.user_metadata?.full_name || 'Unknown',
//         avatar: currentUser.user_metadata?.avatar_url || '',
//         status: status,
//         lastSeen: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Error updating presence status:', error);
//     }
//   };

//   // Add this useEffect to monitor connection status
//   useEffect(() => {
//     if (!ablyClient) return;

//     ablyClient.connection.on((stateChange) => {
//       console.log('Ably connection state:', stateChange.current, stateChange.reason);
//     });
//   }, [ablyClient]);

//   // Add beforeunload handler to leave presence
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (presenceChannel) {
//         presenceChannel.presence.leave();
//       }
//       if (ablyClient) {
//         ablyClient.close();
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [presenceChannel, ablyClient]);

//   const setupConversationPresence = async (conversationId) => {
//     if (!ablyClient || !currentUser) return;

//     try {
//       const convPresenceChannel = ablyClient.channels.get(`presence-conversation-${conversationId}`);

//       await convPresenceChannel.presence.enter({
//         userId: currentUser.id,
//         conversationId: conversationId,
//         name: currentUser.user_metadata?.full_name || 'Unknown',
//         avatar: currentUser.user_metadata?.avatar_url || '',
//         status: 'in_conversation'
//       });

//       // Subscribe to conversation-specific presence events
//       convPresenceChannel.presence.subscribe('enter', (presenceMessage) => {
//         console.log('User entered conversation:', presenceMessage.data);
//         // You can use this for conversation-specific online indicators
//       });

//       convPresenceChannel.presence.subscribe('leave', (presenceMessage) => {
//         console.log('User left conversation:', presenceMessage.data);
//       });

//       // Get initial presence for this conversation
//       const presenceSet = await convPresenceChannel.presence.get();
//       console.log('Users in conversation:', presenceSet.map(msg => msg.data));

//     } catch (error) {
//       console.error('Error setting up conversation presence:', error);
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

//   // Update your cleanup useEffect with proper state checking
//   useEffect(() => {
//     return () => {
//       // Clean up conversation presence
//       if (currentChannelId && ablyClient) {
//         const convPresenceChannel = ablyClient.channels.get(`presence-conversation-${currentChannelId}`);
//         try {
//           // Only leave if channel is in a valid state
//           if (convPresenceChannel.state === 'attached' || convPresenceChannel.state === 'attaching') {
//             convPresenceChannel.presence.leave().catch(error => {
//               console.warn('Error leaving conversation presence (non-critical):', error);
//             });
//           }
//         } catch (error) {
//           console.warn('Error accessing conversation presence channel:', error);
//         }
//       }

//       // Clean up global presence
//       if (presenceChannel) {
//         try {
//           // Check channel state before trying to leave
//           if (presenceChannel.state === 'attached' || presenceChannel.state === 'attaching') {
//             presenceChannel.presence.leave().catch(error => {
//               console.warn('Error leaving global presence (non-critical):', error);
//             });
//           }
//           // Detach only if needed
//           if (presenceChannel.state !== 'detached' && presenceChannel.state !== 'detaching') {
//             presenceChannel.detach();
//           }
//         } catch (error) {
//           console.warn('Error cleaning up presence channel:', error);
//         }
//       }

//       // Clean up chat channel
//       if (ablyChannel) {
//         try {
//           if (ablyChannel.state === 'attached' || ablyChannel.state === 'attaching') {
//             ablyChannel.unsubscribe();
//             ablyChannel.detach((err) => {
//               if (err) {
//                 console.warn('Error detaching channel:', err);
//               }
//             });
//           }
//         } catch (error) {
//           console.warn('Error cleaning up channel:', error);
//         }
//       }
//     };
//   }, [presenceChannel, ablyChannel, currentChannelId, ablyClient]);

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

//   // Add this state to track message IDs we've already seen
//   const [seenMessageIds, setSeenMessageIds] = useState(new Set());

//   // Update the handleSendMessage function
//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedConversation || sending) return;

//     if (!ablyClient || ablyClient.connection.state !== 'connected') {
//       setAblyError('Connection lost. Please try again.');
//       return;
//     }

//     setSending(true);

//     // Create a unique temporary ID
//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
//     const tempMessage = {
//       _id: tempId,
//       content: message,
//       senderId: {
//         _id: currentUser.id,
//         name: currentUser.user_metadata?.full_name || 'You',
//         dp: currentUser.user_metadata?.avatar_url || ''
//       },
//       createdAt: new Date().toISOString(),
//       messageType: 'text',
//       isTemp: true
//     };

//     // Add to seen messages
//     setSeenMessageIds(prev => new Set(prev).add(tempId));

//     setMessages(prev => [...prev, tempMessage]);
//     const messageText = message;
//     setMessage('');

//     try {
//       const response = await fetch('/api/chat/send', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
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
//         // Add the real message ID to seen messages
//         setSeenMessageIds(prev => new Set(prev).add(data.message._id));

//         // Replace temp message with real one
//         setMessages(prev => prev.map(msg =>
//           msg._id === tempId ? data.message : msg
//         ));

//         // Update conversation list
//         setConversations(prev => prev.map(conv =>
//           conv._id === selectedConversation._id ? {
//             ...conv,
//             lastMessage: {
//               content: messageText,
//               timestamp: new Date(),
//               senderId: currentUser.id
//             }
//           } : conv
//         ));

//         // Publish to Ably
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
//           }
//         }
//       } else {
//         throw new Error(data.error || 'Failed to send message');
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//       setMessages(prev => prev.filter(msg => msg._id !== tempId));
//       setMessage(messageText);
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

//     // Update presence status back to online
//     updatePresenceStatus('online');

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
//     setupAblyChannel(conversation._id);

//     // Update presence status
//     updatePresenceStatus('in_conversation');

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
//     resetChatState();  // Reset auto-open state
//   };


//   // Reset seen messages when changing conversations
//   useEffect(() => {
//     if (selectedConversation) {
//       setSeenMessageIds(new Set());
//     }
//   }, [selectedConversation]);

//   // Cleanup when component unmounts
//   useEffect(() => {
//     return () => {
//       setSeenMessageIds(new Set());
//     };
//   }, []);

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

//   // Handle new chat with search result
//   const handleNewChatSelect = async (user) => {
//     await createConversation(user._id);
//     setSearchQuery('');
//     setSearchResults([]);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (currentView === 'chat') {
//       scrollToBottom();
//     }
//   }, [messages, currentView]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (currentView === 'newChat') {
//         searchUsers(searchQuery);
//       }
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [searchQuery, currentView]);

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const getOtherParticipant = (conversation) => {
//     return conversation.participants?.find(p => p._id !== currentUser?.id);
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

//     if (messageDate.getTime() === today.getTime()) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } else if (messageDate.getTime() === today.getTime() - 86400000) {
//       return 'Yesterday';
//     } else {
//       return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
//     }
//   };

//   if (!currentUser) {
//     return (
//       <div className="fixed bottom-4 right-4 z-50">
//         <button className="bg-gray-400 text-white rounded-full p-4 shadow-lg cursor-not-allowed">
//           <MessageCircle size={24} />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Background overlay when chat is open */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-transparent bg-opacity-20 z-40"
//         />
//       )}

//       {/* Chat Container */}
//       <div className="fixed bottom-4 right-4 z-50">
//         {/* Chat Button */}
//         {!isOpen && (
//           <button
//             onClick={() => setIsOpen(true)}
//             className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
//           >
//             <MessageCircle size={24} />
//           </button>
//         )}

//         {/* Chat Interface */}
//         {isOpen && (
//           <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-96 sm:h-[500px] flex flex-col overflow-hidden border">

//             {/* Conversations List View */}
//             {currentView === 'contacts' && (
//               <>
//                 {/* Header */}
//                 <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                   <h2 className="text-lg font-semibold">Chats</h2>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => setCurrentView('newChat')}
//                       className="p-1 hover:bg-green-700 rounded"
//                       title="New Chat"
//                     >
//                       <Plus size={18} />
//                     </button>
//                     <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                       <MoreVertical size={18} />
//                     </button>
//                     <button
//                       onClick={handleClose}
//                       className="p-1 hover:bg-green-700 rounded"
//                     >
//                       <X size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Conversations List */}
//                 <div className="flex-1 overflow-y-auto">
//                   {loading ? (
//                     <div className="flex items-center justify-center h-full">
//                       <div className="text-gray-500">Loading chats...</div>
//                     </div>
//                   ) : conversations.length > 0 ? (
//                     conversations.map((conversation) => {
//                       const otherParticipant = getOtherParticipant(conversation);
//                       if (!otherParticipant) return null;

//                       return (
//                         <div
//                           key={conversation._id}
//                           onClick={() => handleConversationSelect(conversation)}
//                           className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
//                         >
//                           <div className="flex items-center space-x-3">
//                             <div className="relative">
//                               {otherParticipant.dp ? (
//                                 <img
//                                   src={otherParticipant.dp}
//                                   alt={otherParticipant.name}
//                                   className="w-10 h-10 rounded-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                                   {otherParticipant.name?.charAt(0)?.toUpperCase() || '?'}
//                                 </div>
//                               )}
//                               {/* Online status indicator */}
//                               {onlineUsers.has(otherParticipant._id) && (
//                                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center justify-between">
//                                 <h3 className="font-semibold text-sm text-gray-900 truncate">
//                                   {otherParticipant.name}
//                                 </h3>
//                                 <span className="text-xs text-gray-500">
//                                   {conversation.lastMessage?.timestamp && formatTimestamp(conversation.lastMessage.timestamp)}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between">
//                                 <p className="text-sm text-gray-600 truncate">
//                                   {conversation.lastMessage?.content || 'No messages yet'}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                       <MessageCircle size={48} className="mb-4 text-gray-300" />
//                       <p className="text-center px-4">No conversations yet</p>
//                       <button
//                         onClick={() => setCurrentView('newChat')}
//                         className="mt-2 text-green-600 hover:text-green-700"
//                       >
//                         Start a new chat
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* New Chat View */}
//             {currentView === 'newChat' && (
//               <>
//                 {/* Header */}
//                 <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <button
//                       onClick={() => {
//                         handleBackToContacts();
//                         setSearchQuery('');
//                         setSearchResults([]);
//                       }}
//                       className="p-1 hover:bg-green-700 rounded"
//                     >
//                       <ArrowLeft size={18} />
//                     </button>
//                     <h2 className="text-lg font-semibold">New Chat</h2>
//                   </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="p-3 border-b bg-gray-50">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                     <input
//                       type="text"
//                       placeholder="Search users..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Search Results */}
//                 <div className="flex-1 overflow-y-auto">
//                   {searchResults.map((user) => (
//                     <div
//                       key={user._id}
//                       onClick={() => handleNewChatSelect(user)}
//                       className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
//                     >
//                       <div className="flex items-center space-x-3">
//                         {user.dp ? (
//                           <img
//                             src={user.dp}
//                             alt={user.name}
//                             className="w-10 h-10 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                             {user.name?.charAt(0)?.toUpperCase() || '?'}
//                           </div>
//                         )}
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-sm text-gray-900">{user.name}</h3>
//                           <p className="text-xs text-gray-500">{user.email}</p>
//                           <p className="text-xs text-gray-400">{user.major} • {user.collegeName}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {searchQuery && searchResults.length === 0 && (
//                     <div className="flex items-center justify-center h-32">
//                       <p className="text-gray-500">No users found</p>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Individual Chat View */}
//             {currentView === 'chat' && selectedContact && selectedConversation && (
//               <>
//                 {/* Chat Header */}
//                 <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <button
//                       onClick={handleBackToContacts}
//                       className="p-1 hover:bg-green-700 rounded"
//                     >
//                       <ArrowLeft size={18} />
//                     </button>
//                     {selectedContact.dp ? (
//                       <img
//                         src={selectedContact.dp}
//                         alt={selectedContact.name}
//                         className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
//                         {selectedContact.name?.charAt(0)?.toUpperCase() || '?'}
//                       </div>
//                     )}
//                     <div>
//                       <h3 className="font-semibold text-sm sm:text-base">{selectedContact.name}</h3>
//                       <p className="text-xs text-green-100">
//                         {onlineUsers.has(selectedContact._id) ? 'Online' : 'Offline'}
//                         {typingUsers[selectedContact._id] && ' • Typing...'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                       <Video size={18} />
//                     </button>
//                     <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                       <Phone size={18} />
//                     </button>
//                     <button className="p-1 hover:bg-green-700 rounded hidden sm:block">
//                       <MoreVertical size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Messages Container */}
//                 <div
//                   className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
//                   style={{
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 0h40v40h-40z'/%3E%3C/g%3E%3C/svg%3E")`
//                   }}
//                 >
//                   <div className="space-y-3">
//                     {messages.map((msg, index) => {
//                       const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
//                       const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };

//                       // Create a guaranteed unique key using multiple properties
//                       const uniqueKey = `${msg._id}-${msg.createdAt}-${index}`;

//                       return (
//                         <div
//                           key={uniqueKey}
//                           className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
//                         >
//                           <div className="flex items-end space-x-2 max-w-xs">
//                             {!isMe && (
//                               <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-semibold mb-1">
//                                 {sender.name?.charAt(0)?.toUpperCase() || '?'}
//                               </div>
//                             )}
//                             <div
//                               className={`px-3 py-2 rounded-lg ${isMe
//                                 ? 'bg-green-500 text-white rounded-br-none'
//                                 : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
//                                 }`}
//                             >
//                               <p className="text-sm">{msg.content}</p>
//                               <p className={`text-xs mt-1 ${isMe ? 'text-green-100' : 'text-gray-500'
//                                 }`}>
//                                 {formatTimestamp(msg.createdAt)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <div ref={messagesEndRef} />
//                   </div>
//                 </div>

//                 {/* Input Area */}
//                 <div className="p-3 sm:p-4 bg-gray-100 border-t">
//                   <div className="flex items-center space-x-2">
//                     <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
//                       <Smile size={18} />
//                     </button>
//                     <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full hidden sm:block">
//                       <Paperclip size={18} />
//                     </button>
//                     <div className="flex-1 relative">
//                       <input
//                         type="text"
//                         value={message}
//                         onChange={(e) => {
//                           setMessage(e.target.value);
//                           handleTypingStart(); // Start typing indicator
//                         }}
//                         onKeyPress={handleKeyPress}
//                         onBlur={handleTypingStop} // Stop typing when input loses focus
//                         onFocus={handleTypingStart} // Start typing when input gains focus
//                         placeholder="Type a message..."
//                         disabled={sending}
//                         className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:opacity-50"
//                       />
//                     </div>
//                     <button
//                       onClick={handleSendMessage}
//                       disabled={sending || !message.trim()}
//                       className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
//                     >
//                       <Send size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ChatBoard;


















// typing and real time messages 



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
  const conversationsRef = useRef(conversations);
  const messagesEndRef = useRef(null);
  const [isAutoOpening, setIsAutoOpening] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [presenceChannel, setPresenceChannel] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [seenMessageIds, setSeenMessageIds] = useState(new Set());
  const [userStatusCache, setUserStatusCache] = useState({});
  const [connectionState, setConnectionState] = useState('disconnected');

  // Refs for cleanup tracking
  const presenceChannelRef = useRef(null);
  const ablyChannelRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get chat context
  const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();

  // Utility functions
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

  const normalizeId = (id) => {
    if (!id) return '';
    return String(id).trim();
  };

  // Add typing handlers with better state management
  const handleTypingStart = useCallback(() => {
    if (!ablyChannelRef.current || !currentUser || isTyping) return;

    setIsTyping(true);

    try {
      // Send typing start event
      ablyChannelRef.current.publish("typing", {
        userId: currentUser.id,
        typing: true,
        name: currentUser.user_metadata?.full_name || 'Unknown'
      });
    } catch (error) {
      console.error('Error sending typing start:', error);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  }, [currentUser, isTyping]);

  const handleTypingStop = useCallback(() => {
    if (!ablyChannelRef.current || !currentUser) return;

    setIsTyping(false);

    try {
      // Send typing stop event
      ablyChannelRef.current.publish("typing", {
        userId: currentUser.id,
        typing: false,
        name: currentUser.user_metadata?.full_name || 'Unknown'
      });
    } catch (error) {
      console.error('Error sending typing stop:', error);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentUser]);

  // Add this debug effect
  useEffect(() => {
    if (selectedContact && conversations.length > 0) {
      console.log('Current user ID:', currentUser?.id);
      console.log('Selected contact ID:', selectedContact._id);
      console.log('Selected contact ID type:', typeof selectedContact._id);
      console.log('Online users IDs:', Array.from(onlineUsers));
    }
  }, [selectedContact, conversations, onlineUsers, currentUser]);

  const setupPresence = useCallback(async () => {
    console.log('Attempting to setup presence, connection state:', connectionState);

    if (!ablyClient || !currentUser) {
      console.log('Cannot setup presence: missing ablyClient or currentUser');
      return;
    }

    // Check if we're connected or connecting
    if (ablyClient.connection.state !== 'connected') {
      console.log('Ably not connected yet, current state:', ablyClient.connection.state);

      // If we're in a state that can become connected, wait for it
      if (['connecting', 'initialized'].includes(ablyClient.connection.state)) {
        console.log('Waiting for connection to be established...');
        return;
      }

      // If disconnected or failed, try to reconnect
      if (['disconnected', 'failed', 'suspended'].includes(ablyClient.connection.state)) {
        console.log('Attempting to reconnect...');
        try {
          ablyClient.connection.connect();
        } catch (error) {
          console.error('Failed to reconnect:', error);
        }
        return;
      }

      return;
    }

    // Clean up existing presence channel
    if (presenceChannelRef.current) {
      try {
        if (presenceChannelRef.current.state === 'attached') {
          await presenceChannelRef.current.presence.leave();
        }
        presenceChannelRef.current.unsubscribe();
        if (presenceChannelRef.current.state !== 'detached') {
          presenceChannelRef.current.detach();
        }
      } catch (error) {
        console.warn('Error cleaning up previous presence:', error);
      }
    }

    try {
      const presenceChannel = ablyClient.channels.get('chat-presence');
      presenceChannelRef.current = presenceChannel;

      console.log('Setting up presence channel...');

      // Attach the channel
      if (presenceChannel.state !== 'attached') {
        await presenceChannel.attach();
      }

      // Enter presence
      await presenceChannel.presence.enter({
        userId: currentUser.id,
        name: currentUser.user_metadata?.full_name || 'Unknown',
        timestamp: Date.now()
      });

      console.log('Presence entered successfully');

      // Subscribe to presence events
      presenceChannel.presence.subscribe('enter', (presenceMessage) => {
        console.log('User entered:', presenceMessage.data.userId);
        setOnlineUsers(prev => new Set(prev).add(presenceMessage.data.userId));
      });

      presenceChannel.presence.subscribe('leave', (presenceMessage) => {
        console.log('User left:', presenceMessage.data.userId);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(presenceMessage.data.userId);
          return newSet;
        });
      });

      // Get initial presence
      const presenceSet = await presenceChannel.presence.get();
      const onlineUserIds = new Set(presenceSet.map(msg => msg.data.userId));
      console.log('Initial online users:', Array.from(onlineUserIds));
      setOnlineUsers(onlineUserIds);

      setPresenceChannel(presenceChannel);

      // Setup heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      heartbeatIntervalRef.current = setInterval(async () => {
        try {
          if (presenceChannel.state === 'attached') {
            await presenceChannel.presence.update({
              userId: currentUser.id,
              timestamp: Date.now()
            });
          }
        } catch (error) {
          console.error('Heartbeat failed:', error);
        }
      }, 30000);

    } catch (error) {
      console.error('Error setting up presence:', error);
      setAblyError(`Presence error: ${error.message}`);
    }
  }, [ablyClient, currentUser, connectionState]);

  // Add this useEffect to retry presence setup when connection becomes available
  useEffect(() => {
    if (connectionState === 'connected' && currentUser && !presenceChannelRef.current) {
      console.log('Connection established, setting up presence...');
      const timer = setTimeout(() => {
        setupPresence();
      }, 1000); // Small delay to ensure connection is fully ready

      return () => clearTimeout(timer);
    }
  }, [connectionState, currentUser, setupPresence]);

  useEffect(() => {
    if (selectedContact && onlineUsers.has(selectedContact._id)) {
      // Force re-render of online status for the current chat
      setUserStatusCache(prev => ({
        ...prev,
        [selectedContact._id]: 'online'
      }));
    }
  }, [selectedContact, onlineUsers]);



  // Initialize Ably with improved connection handling
  useEffect(() => {
    const initializeAbly = async () => {
      if (isAblyConnecting || ablyClient || !currentUser || !isOpen) return;

      setIsAblyConnecting(true);
      setAblyError(null);

      try {
        const Ably = (await import('ably')).default;
        const clientId = `user-${currentUser.id}`;

        const client = new Ably.Realtime({
          authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
          autoConnect: true,
          clientId: clientId,
          log: { level: 1 }, // Reduced logging
          closeOnUnload: true,
          disconnectedRetryTimeout: 2000,
          suspendedRetryTimeout: 5000,
        });

        setAblyClient(client);

        client.connection.on('connecting', () => {
          setAblyError('Connecting...');
        });

        client.connection.on('connected', () => {
          console.log('Ably connected');
          setAblyError(null);
          setIsAblyConnecting(false);
          // Setup presence after connection is established
          setupPresence();
        });

        client.connection.on('disconnected', () => {
          console.log('Ably disconnected');
          setAblyError('Disconnected. Reconnecting...');
        });

        client.connection.on('suspended', () => {
          setAblyError('Connection suspended. Reconnecting...');
        });

        client.connection.on('failed', (error) => {
          console.error('Ably connection failed:', error);
          setAblyError('Connection failed');
          setIsAblyConnecting(false);
        });

        client.connection.on('closed', () => {
          console.log('Ably connection closed');
          setIsAblyConnecting(false);
        });

      } catch (error) {
        console.error('Failed to initialize Ably:', error);
        setAblyError('Failed to initialize chat');
        setIsAblyConnecting(false);
      }
    };

    initializeAbly();
  }, [isOpen, currentUser, setupPresence]);

  // Improved channel setup with better state management
  const setupAblyChannel = useCallback((conversationId) => {
    if (currentChannelId === conversationId && ablyChannelRef.current) {
      return; // Already set up for this conversation
    }

    if (!ablyClient || ablyClient.connection.state !== 'connected') {
      setAblyError('Waiting for connection...');
      return;
    }

    try {
      // Clean up previous channel
      if (ablyChannelRef.current) {
        try {
          ablyChannelRef.current.unsubscribe();
          if (ablyChannelRef.current.state !== 'detached') {
            ablyChannelRef.current.detach();
          }
        } catch (error) {
          console.warn('Error cleaning up previous channel:', error);
        }
      }

      const channel = ablyClient.channels.get(`chat-${conversationId}`);
      ablyChannelRef.current = channel;
      setCurrentChannelId(conversationId);

      // Subscribe to typing events
      channel.subscribe("typing", (message) => {
        if (message.data.userId !== currentUser.id) {
          setTypingUsers(prev => ({
            ...prev,
            [message.data.userId]: message.data.typing
          }));

          // Auto-clear typing after 5 seconds
          if (message.data.typing) {
            setTimeout(() => {
              setTypingUsers(prev => ({
                ...prev,
                [message.data.userId]: false
              }));
            }, 5000);
          }
        }
      });

      // Subscribe to messages with improved duplicate handling
      channel.subscribe("message", (message) => {
        const newMessage = message.data;

        // Skip if it's our own message or already seen
        if (newMessage.senderId === currentUser.id || seenMessageIds.has(newMessage._id)) {
          return;
        }

        setSeenMessageIds(prev => new Set(prev).add(newMessage._id));

        setMessages(prev => [...prev, {
          _id: newMessage._id,
          conversationId: newMessage.conversationId,
          content: newMessage.content,
          messageType: newMessage.messageType || 'text',
          createdAt: newMessage.createdAt || new Date().toISOString(),
          senderId: {
            _id: newMessage.senderId,
            name: newMessage.senderName || 'Unknown',
            dp: newMessage.senderDp || ''
          }
        }]);
      });

      setAblyChannel(channel);
      setAblyError(null);

    } catch (error) {
      console.error('Error setting up channel:', error);
      setAblyError('Failed to join chat');
    }
  }, [ablyClient, currentUser, currentChannelId, seenMessageIds]);

  // Update presence status with better error handling
  const updatePresenceStatus = useCallback(async (status) => {
    if (!presenceChannelRef.current || !currentUser) return;

    try {
      if (presenceChannelRef.current.state === 'attached') {
        await presenceChannelRef.current.presence.update({
          userId: currentUser.id,
          name: currentUser.user_metadata?.full_name || 'Unknown',
          avatar: currentUser.user_metadata?.avatar_url || '',
          status: status,
          lastSeen: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating presence status:', error);
    }
  }, [currentUser]);

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

  // Add this useEffect to monitor connection state
  useEffect(() => {
    if (!ablyClient) return;

    const handleStateChange = (stateChange) => {
      console.log('Ably connection state:', stateChange.current);
      setConnectionState(stateChange.current);

      if (stateChange.current === 'connected') {
        console.log('Ably connected, setting up presence...');
        setupPresence();
      } else if (stateChange.current === 'disconnected' || stateChange.current === 'failed') {
        setAblyError(`Connection ${stateChange.current}. Reconnecting...`);
      }
    };

    // Set initial state
    setConnectionState(ablyClient.connection.state);

    ablyClient.connection.on('connected', handleStateChange);
    ablyClient.connection.on('disconnected', handleStateChange);
    ablyClient.connection.on('suspended', handleStateChange);
    ablyClient.connection.on('failed', handleStateChange);
    ablyClient.connection.on('closed', handleStateChange);

    return () => {
      ablyClient.connection.off('connected', handleStateChange);
      ablyClient.connection.off('disconnected', handleStateChange);
      ablyClient.connection.off('suspended', handleStateChange);
      ablyClient.connection.off('failed', handleStateChange);
      ablyClient.connection.off('closed', handleStateChange);
    };
  }, [ablyClient, setupPresence]);

  // Update conversations ref when conversations change
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Deduplicate conversations
  useEffect(() => {
    const conversationIds = conversations.map(c => c._id);
    const duplicateIds = conversationIds.filter((id, index) =>
      conversationIds.indexOf(id) !== index
    );

    if (duplicateIds.length > 0) {
      const uniqueConversations = conversations.filter((conv, index, self) =>
        index === self.findIndex(c => c._id === conv._id)
      );

      if (uniqueConversations.length !== conversations.length) {
        setConversations(uniqueConversations);
      }
    }
  }, [conversations]);

  // Load conversations
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

  // Load messages
  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        // Clear seen messages when loading new conversation
        setSeenMessageIds(new Set(data.messages.map(msg => msg._id)));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Search users
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

  // Create conversation
  const createConversation = async (otherUserId) => {
    try {
      const currentConversations = conversationsRef.current;
      const alreadyExists = currentConversations.find(conv => {
        return conv.participants.some(p => normalizeId(p._id) === normalizeId(otherUserId));
      });

      if (alreadyExists) {
        handleConversationSelect(alreadyExists);
        return;
      }

      const response = await fetch('/api/chat/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId1: currentUser.id,
          userId2: otherUserId
        })
      });

      const data = await response.json();

      if (data.success) {
        const alreadyInList = conversations.some(c => c._id === data.conversation._id);
        if (!alreadyInList) {
          setConversations(prev => [data.conversation, ...prev]);
        }

        setSelectedConversation(data.conversation);
        setCurrentView('chat');
        loadMessages(data.conversation._id);
        setupAblyChannel(data.conversation._id);

        const otherParticipant = data.conversation.participants.find(p => p._id !== currentUser.id);
        setSelectedContact(otherParticipant);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('chat');
    loadMessages(conversation._id);
    setupAblyChannel(conversation._id);
    updatePresenceStatus('in_conversation');

    const otherParticipant = conversation.participants.find(p => p._id !== currentUser.id);
    setSelectedContact(otherParticipant);
    resetChatState();
  };

  // Handle back to contacts
  const handleBackToContacts = () => {
    setSelectedConversation(null);
    setSelectedContact(null);
    setMessages([]);
    setCurrentView('contacts');
    updatePresenceStatus('online');

    // Clean up channel
    if (ablyChannelRef.current) {
      try {
        ablyChannelRef.current.unsubscribe();
        setAblyChannel(null);
        setCurrentChannelId(null);
        ablyChannelRef.current = null;
      } catch (error) {
        console.warn('Error cleaning up channel:', error);
      }
    }
  };

  // Send message with improved real-time handling
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || sending) return;

    if (!ablyClient || ablyClient.connection.state !== 'connected') {
      setAblyError('Connection lost. Please try again.');
      return;
    }

    setSending(true);
    handleTypingStop(); // Stop typing indicator

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const tempMessage = {
      _id: tempId,
      content: message,
      senderId: {
        _id: currentUser.id,
        name: currentUser.user_metadata?.full_name || 'You',
        dp: currentUser.user_metadata?.avatar_url || ''
      },
      createdAt: new Date().toISOString(),
      messageType: 'text',
      isTemp: true
    };

    setSeenMessageIds(prev => new Set(prev).add(tempId));
    setMessages(prev => [...prev, tempMessage]);
    const messageText = message;
    setMessage('');

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderId: currentUser.id,
          content: messageText,
          messageType: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSeenMessageIds(prev => new Set(prev).add(data.message._id));

        // Replace temp message
        setMessages(prev => prev.map(msg =>
          msg._id === tempId ? data.message : msg
        ));

        // Update conversation list
        setConversations(prev => prev.map(conv =>
          conv._id === selectedConversation._id ? {
            ...conv,
            lastMessage: {
              content: messageText,
              timestamp: new Date(),
              senderId: currentUser.id
            }
          } : conv
        ));

        // Publish to Ably
        if (ablyChannelRef.current && ablyClient.connection.state === 'connected') {
          try {
            await ablyChannelRef.current.publish("message", {
              _id: data.message._id,
              conversationId: data.message.conversationId,
              senderId: data.message.senderId._id,
              senderName: data.message.senderId.name,
              senderDp: data.message.senderId.dp,
              content: data.message.content,
              messageType: data.message.messageType,
              createdAt: data.message.createdAt
            });
          } catch (publishError) {
            console.error('Failed to publish to Ably:', publishError);
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setMessage(messageText);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Auto-open conversation handling
  const handleAutoOpenConversation = async (user) => {
    try {
      setIsAutoOpening(true);
      const currentConversations = conversationsRef.current;
      const existingConversation = currentConversations.find(conv => {
        return conv.participants.some(p => String(p._id) === String(user._id));
      });

      if (existingConversation) {
        handleConversationSelect(existingConversation);
      } else {
        await createConversation(user._id);
      }
    } catch (error) {
      console.error('Error auto-opening conversation:', error);
    } finally {
      resetChatState();
      setIsAutoOpening(false);
    }
  };

  // Handle new chat selection
  const handleNewChatSelect = async (user) => {
    await createConversation(user._id);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    setIsChatOpen(false);
    resetChatState();
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Utility functions
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


  const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(userId);
  };


  // Add this useEffect to debug the online status
  useEffect(() => {
    console.log('Online users:', Array.from(onlineUsers));
    console.log('Selected contact:', selectedContact);
    if (selectedContact) {
      console.log('Is selected contact online:', onlineUsers.has(selectedContact._id));
    }
  }, [onlineUsers, selectedContact]);
  // Chat context effects
  useEffect(() => {
    setIsOpen(isChatOpen);
  }, [isChatOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetChatState();
    }
  }, [isOpen, resetChatState]);

  useEffect(() => {
    if (isOpen && autoOpenConversation && currentUser && !isAutoOpening) {
      setTimeout(() => {
        handleAutoOpenConversation(autoOpenConversation);
      }, 200);
    }
  }, [isOpen, autoOpenConversation, currentUser, isAutoOpening]);

  // Auto-scroll effect
  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [messages, currentView]);

  // Search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentView === 'newChat') {
        searchUsers(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentView]);

  // Initial view setup
  useEffect(() => {
    if (isOpen && autoOpenConversation) {
      setCurrentView('chat');
    } else if (isOpen) {
      setCurrentView('contacts');
    }
  }, [isOpen, autoOpenConversation]);

  // Force open event listener
  useEffect(() => {
    const handleForceOpen = (event) => {
      const { user } = event.detail;
      if (user && currentUser) {
        handleAutoOpenConversation(user);
      }
    };

    window.addEventListener('chatForceOpen', handleForceOpen);
    return () => window.removeEventListener('chatForceOpen', handleForceOpen);
  }, [currentUser]);

  // Cleanup effects
  useEffect(() => {
    return () => {
      // Clean up all timeouts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      // Clean up channels
      if (presenceChannelRef.current) {
        try {
          if (presenceChannelRef.current.state === 'attached') {
            presenceChannelRef.current.presence.leave().catch(console.warn);
          }
          presenceChannelRef.current.unsubscribe();
          presenceChannelRef.current.detach();
        } catch (error) {
          console.warn('Error cleaning up presence:', error);
        }
      }

      if (ablyChannelRef.current) {
        try {
          ablyChannelRef.current.unsubscribe();
          ablyChannelRef.current.detach();
        } catch (error) {
          console.warn('Error cleaning up channel:', error);
        }
      }

      // Close Ably client
      if (ablyClient) {
        try {
          ablyClient.close();
        } catch (error) {
          console.warn('Error closing Ably client:', error);
        }
      }
    };
  }, []);

  // Beforeunload cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (presenceChannelRef.current) {
        try {
          presenceChannelRef.current.presence.leave();
        } catch (error) {
          console.warn('Error leaving presence on unload:', error);
        }
      }
      if (ablyClient) {
        try {
          ablyClient.close();
        } catch (error) {
          console.warn('Error closing client on unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [ablyClient]);

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
      {/* Background overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 z-40" />
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
            {/* Error Display */}
            {ablyError && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-xs">
                {ablyError}
              </div>
            )}

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
                              {/* Online status indicator */}
                              {isUserOnline(otherParticipant._id) && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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
                                {typingUsers[otherParticipant._id] ? (
                                  <p className="text-sm text-green-600 italic truncate">
                                    Typing...
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-600 truncate">
                                    {conversation.lastMessage?.content || 'No messages yet'}
                                  </p>
                                )}
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
                      <p className="text-xs text-green-100">
                        {isUserOnline(selectedContact._id) ? 'Online' : 'Offline'}
                        {typingUsers[selectedContact._id] && ' • Typing...'}
                      </p>
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
                    {messages.map((msg, index) => {
                      const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
                      const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };
                      const uniqueKey = `${msg._id}-${msg.createdAt}-${index}`;

                      return (
                        <div
                          key={uniqueKey}
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
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (e.target.value.trim()) {
                            handleTypingStart();
                          } else {
                            handleTypingStop();
                          }
                        }}
                        onKeyPress={handleKeyPress}
                        onBlur={handleTypingStop}
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