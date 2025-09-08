'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MoreVertical, Phone, Video, Search, Smile, Paperclip, ArrowLeft, Users, Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Ably from "ably";

const ably = new Ably.Realtime({
  authUrl: "/api/chat/createToken",
});

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ChatBoard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('contacts'); // 'contacts', 'chat', 'newChat'
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
  
  const messagesEndRef = useRef(null);

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

  // Load messages for a conversation
  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
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
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const setupAblyChannel = (conversationId) => {
    if (ablyChannel) {
      ablyChannel.unsubscribe();
    }

    const channel = ably.channels.get(`chat-${conversationId}`);

    // Subscribe to messages
    channel.subscribe("message", (message) => {
      const newMessage = message.data;

      if (newMessage.senderId !== currentUser.id) {
        setMessages((prev) => [...prev, {
          _id: newMessage._id,
          conversationId: newMessage.conversationId,
          senderId: newMessage.senderId,
          content: newMessage.content,
          messageType: newMessage.messageType,
          createdAt: newMessage.createdAt,
          senderId: {
            _id: newMessage.senderId,
            name: newMessage.senderName,
            dp: newMessage.senderDp
          }
        }]);
      }
    });

    setAblyChannel(channel);
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || sending) return;

    setSending(true);
    const tempMessage = {
      _id: 'temp-' + Date.now(),
      content: message,
      senderId: {
        _id: currentUser.id,
        name: currentUser.user_metadata?.full_name || 'You',
        dp: currentUser.user_metadata?.avatar_url || ''
      },
      createdAt: new Date().toISOString(),
      messageType: 'text'
    };

    // Add message optimistically
    setMessages(prev => [...prev, tempMessage]);
    const messageText = message;
    setMessage('');

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderId: currentUser.id,
          content: messageText,
          messageType: 'text'
        })
      });

      const data = await response.json();
      if (data.success) {
        // Replace temp message with real one
        setMessages(prev => prev.map(msg => 
          msg._id === tempMessage._id ? data.message : msg
        ));
        
        // Update conversation in list
        setConversations(prev => prev.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: { content: messageText, timestamp: new Date() } }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      setMessage(messageText); // Restore message
    } finally {
      setSending(false);
    }
  };

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('chat');
    loadMessages(conversation._id);
    setupAblyChannel(conversation._id);
    
    // Find the other participant
    const otherParticipant = conversation.participants.find(p => p._id !== currentUser.id);
    setSelectedContact(otherParticipant);
  };

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
      <div 
        className="fixed bottom-4 right-4"
        style={{ zIndex: 9999, isolation: 'isolate' ,backgroundColor: 'transparent',// Ensure no pointer events are blocked
    pointerEvents: 'auto' ,
    boxShadow: 'none'}}
      >
        <button className="bg-gray-400 text-white rounded-full p-4 shadow-lg cursor-not-allowed">
          <MessageCircle size={24} />
        </button>
      </div>
    );
  }

useEffect(() => {
  if (isOpen) {
    document.body.classList.add('chat-open');
  } else {
    document.body.classList.remove('chat-open');
  }
  
  return () => {
    document.body.classList.remove('chat-open');
  };
}, [isOpen]);

  return (
    <div 
      className="fixed bottom-4 right-4 chatboard-container" 
      style={{ zIndex: 9999, isolation: 'isolate', backgroundColor: 'transparent',
    boxShadow: 'none',
    // Ensure no pointer events are blocked
    pointerEvents: 'auto' }}
    >
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Interface - Only the chat box, no background overlay */}
      {isOpen && (
        <div 
          className="bg-white rounded-lg shadow-2xl border flex flex-col overflow-hidden"
          style={{
            width: '320px',
            height: '400px',
            position: 'relative',
            zIndex: 1,
            isolation: 'isolate',
            pointerEvents: 'auto'
          }}
        >
          
          {/* Conversations List View */}
          {currentView === 'contacts' && (
            <>
              {/* Header */}
              <div className="bg-green-600 text-white p-4 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-semibold">Chats</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentView('newChat')}
                    className="p-1 hover:bg-green-700 rounded"
                    title="New Chat"
                  >
                    <Plus size={18} />
                  </button>
                  <button className="p-1 hover:bg-green-700 rounded">
                    <MoreVertical size={18} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
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
              <div className="bg-green-600 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setCurrentView('contacts');
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
              <div className="p-3 border-b bg-gray-50 shrink-0">
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
              <div className="bg-green-600 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentView('contacts')}
                    className="p-1 hover:bg-green-700 rounded"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  {selectedContact.dp ? (
                    <img 
                      src={selectedContact.dp} 
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      {selectedContact.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-base">{selectedContact.name}</h3>
                    <p className="text-xs text-green-100">{selectedContact.major}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-green-700 rounded">
                    <Video size={18} />
                  </button>
                  <button className="p-1 hover:bg-green-700 rounded">
                    <Phone size={18} />
                  </button>
                  <button className="p-1 hover:bg-green-700 rounded">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
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
                            className={`px-3 py-2 rounded-lg ${
                              isMe
                                ? 'bg-green-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              isMe ? 'text-green-100' : 'text-gray-500'
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
              <div className="p-4 bg-gray-100 border-t shrink-0">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    <Smile size={18} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
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
  );
};

export default ChatBoard;