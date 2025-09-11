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


  // Add this to detect duplicate conversations
useEffect(() => {
  const conversationIds = conversations.map(c => c._id);
  const duplicateIds = conversationIds.filter((id, index) => 
    conversationIds.indexOf(id) !== index
  );
  
  if (duplicateIds.length > 0) {
    
    // Remove duplicates
    const uniqueConversations = conversations.filter((conv, index, self) => 
      index === self.findIndex(c => c._id === conv._id)
    );
    
    if (uniqueConversations.length !== conversations.length) {
      setConversations(uniqueConversations);
    }
  }
}, [conversations]);


  // Update your initializeAbly function
  useEffect(() => {
    const initializeAbly = async () => {
      if (isAblyConnecting || ablyClient) return;

      setIsAblyConnecting(true);
      setAblyError(null);

      try {
        const Ably = (await import('ably')).default;

        // Generate a consistent clientId
        const clientId = `user-${currentUser?.id || 'anonymous'}-${Date.now()}`;

        // Use authUrl with clientId parameter
        const client = new Ably.Realtime({
          authUrl: `/api/chat/createToken?clientId=${encodeURIComponent(clientId)}`,
          autoConnect: true,
          clientId: clientId, // Use the same clientId here
          log: { level: 2 },
          closeOnUnload: false,
          disconnectedRetryTimeout: 1000,
        });

        // Add connection event listeners
        client.connection.on('connecting', () => {
          setAblyError('Connecting to chat service...');
        });

        client.connection.on('connected', () => {
          setAblyError(null);
          setIsAblyConnecting(false);
        });

        client.connection.on('disconnected', () => {
          setAblyError('Disconnected from chat service');
        });

        client.connection.on('suspended', () => {
          setAblyError('Connection suspended. Reconnecting...');
        });

        client.connection.on('failed', (error) => {
          setAblyError('Connection failed: ' + error.message);
          setIsAblyConnecting(false);
        });

        client.connection.on('closed', () => {
          setAblyError('Connection closed');
          setIsAblyConnecting(false);
        });

        setAblyClient(client);

      } catch (error) {
        setAblyError('Failed to initialize chat: ' + error.message);
        setIsAblyConnecting(false);
      }
    };
    if (isOpen && !ablyClient && !isAblyConnecting) {
      initializeAbly();
    }
  }, [isOpen, ablyClient, isAblyConnecting, currentUser]);


  // Get chat context
  const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();


  const handleAutoOpenConversation = async (user) => {
  try {
    setIsAutoOpening(true);
    // Use the ref to get the current conversations
    const currentConversations = conversationsRef.current;
    // Check if conversation already exists with this user
    const existingConversation = currentConversations.find(conv => {
      const hasUser = conv.participants.some(p => String(p._id) === String(user._id));
      return hasUser;
    });


    if (existingConversation) {
      handleConversationSelect(existingConversation);
    } else {
      await createConversation(user._id);
    }
  } catch (error) {
    console.error('❌ Error auto-opening conversation:', error);
  } finally {
    // Reset the state AFTER the conversation is opened
    resetChatState();
    setIsAutoOpening(false);
  }
};

  const createConversation = async (otherUserId) => {
  try {
    
    // Double-check that conversation doesn't already exist
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
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId1: currentUser.id,
        userId2: otherUserId
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      
      // Make sure we're not adding duplicates
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
    console.error('❌ Error creating conversation:', error);
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

  // Add this useEffect to listen for force open events
  useEffect(() => {
    const handleForceOpen = (event) => {
      const { user } = event.detail;
      if (user && currentUser) {
        handleAutoOpenConversation(user);
      }
    };

    window.addEventListener('chatForceOpen', handleForceOpen);

    return () => {
      window.removeEventListener('chatForceOpen', handleForceOpen);
    };
  }, [currentUser]);

  // Also update your existing useEffect that handles auto-opening:
  useEffect(() => {
    if (isOpen && autoOpenConversation && currentUser && !isAutoOpening) {
      // Add a small delay to ensure the chat is fully open
      setTimeout(() => {
        handleAutoOpenConversation(autoOpenConversation);
      }, 200);
    }
  }, [isOpen, autoOpenConversation, currentUser, conversations, isAutoOpening]);

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
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();


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

  // Setup Ably channel when conversation is selected
  const setupAblyChannel = (conversationId) => {
    // If we're already setting up or using this channel, skip
    if (currentChannelId === conversationId && ablyChannel) {
      return;
    }

    if (!ablyClient || ablyClient.connection.state !== 'connected') {
      setAblyError('Connecting to chat service...');

      // Retry after connection is established
      const checkConnection = () => {
        if (ablyClient && ablyClient.connection.state === 'connected') {
          setupAblyChannel(conversationId);
        } else if (ablyClient && ablyClient.connection.state === 'failed') {
          setAblyError('Connection failed. Please refresh the page.');
        } else {
          setTimeout(checkConnection, 500);
        }
      };
      setTimeout(checkConnection, 500);
      return;
    }

    try {
      // Unsubscribe from previous channel if it's different
      if (ablyChannel && currentChannelId !== conversationId) {
        try {
          ablyChannel.unsubscribe();
          ablyChannel.detach();
        } catch (error) {
          console.warn('Error detaching from previous channel:', error);
        }
      }

      const channel = ablyClient.channels.get(`chat-${conversationId}`);
      setCurrentChannelId(conversationId);

      // Add channel event listeners
      channel.on('attached', () => {
        setAblyError(null);
      });

      channel.on('failed', (error) => {
        setAblyError('Failed to join chat channel');
      });

      

      channel.on('suspended', () => {
        setAblyError('Channel connection suspended');
      });

      // Subscribe to messages with robust duplicate prevention
      channel.subscribe("message", (message) => {
        const newMessage = message.data;

        if (newMessage.senderId !== currentUser.id) {
          setMessages((prev) => {
           

            // Add to seen messages
            setSeenMessageIds(prev => new Set(prev).add(newMessage._id));

            return [...prev, {
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
            }];
          });
        }
      });

      setAblyChannel(channel);

    } catch (error) {
      console.error('Error setting up Ably channel:', error);
      setAblyError('Failed to set up chat channel');
    }
  };

  //  useEffect to set the initial view
  useEffect(() => {
    if (isOpen && autoOpenConversation) {
      setCurrentView('chat');
    } else if (isOpen) {
      setCurrentView('contacts');
    }
  }, [isOpen, autoOpenConversation]);

  // Update the cleanup useEffect
  useEffect(() => {
    return () => {
      // Only cleanup when component truly unmounts
      if (ablyChannel) {
        try {
          // Check channel state before trying to detach
          if (ablyChannel.state === 'attached' || ablyChannel.state === 'attaching') {
            ablyChannel.unsubscribe();
            ablyChannel.detach((err) => {
              if (err) {
                console.warn('Error detaching channel:', err);
              } else {
                console.log('Channel detached successfully');
              }
            });
          }
        } catch (error) {
          console.warn('Error cleaning up channel:', error);
        }
      }
    };
  }, [ablyChannel]);

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

  // Add this state to track message IDs we've already seen
  const [seenMessageIds, setSeenMessageIds] = useState(new Set());

  // Update the handleSendMessage function
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || sending) return;

    if (!ablyClient || ablyClient.connection.state !== 'connected') {
      setAblyError('Connection lost. Please try again.');
      return;
    }

    setSending(true);

    // Create a unique temporary ID
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

    // Add to seen messages
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Add the real message ID to seen messages
        setSeenMessageIds(prev => new Set(prev).add(data.message._id));

        // Replace temp message with real one
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
        if (ablyChannel && ablyClient.connection.state === 'connected') {
          try {
            await ablyChannel.publish("message", {
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
      } else {
        throw new Error(data.error || 'Failed to send message');
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


  // Reset seen messages when changing conversations
useEffect(() => {
  if (selectedConversation) {
    setSeenMessageIds(new Set());
  }
}, [selectedConversation]);

// Cleanup when component unmounts
useEffect(() => {
  return () => {
    setSeenMessageIds(new Set());
  };
}, []);

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
                    {messages.map((msg, index) => {
                      const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
                      const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };

                      // Create a guaranteed unique key using multiple properties
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