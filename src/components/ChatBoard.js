'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, MoreVertical,ChevronLeft , Phone, Video, Search, Smile, Paperclip, ArrowLeft, Users, Plus } from 'lucide-react';
import ConversationsList from './ChatBoard/ConversationsList';
import ChatHeader from './ChatBoard/ChatHeader';
import MessagesContainer from './ChatBoard/MessagesContainer';
import MessageInput from './ChatBoard/MessageInput';
import LightboxOverlay from './ChatBoard/LightboxOverlay';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  // Lightbox state for viewing images
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const touchStartLbX = useRef(null);
  const touchCurrentLbX = useRef(null);
  const isSwipingLb = useRef(false);
  // Lightbox swipe refs (handlers inserted after messages state to avoid init order issues)
  // Lightbox image animation state
  const [animating, setAnimating] = useState(false);
  const [prevLightboxIndex, setPrevLightboxIndex] = useState(null);
  const [animateDirection, setAnimateDirection] = useState(0); // -1 prev, 1 next

  // Real data from backend
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const imageMessages = React.useMemo(() => messages.filter(m => m.messageType === 'image'), [messages]);

  const lbPrev = () => {
    if (imageMessages.length === 0) return;
    setAnimateDirection(-1);
    setPrevLightboxIndex(lightboxIndex);
    setAnimating(true);
    setLightboxIndex(i => (i - 1 + imageMessages.length) % imageMessages.length);
  };

  const lbNext = () => {
    if (imageMessages.length === 0) return;
    setAnimateDirection(1);
    setPrevLightboxIndex(lightboxIndex);
    setAnimating(true);
    setLightboxIndex(i => (i + 1) % imageMessages.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, imageMessages.length]);

  // Touch handlers for lightbox
  const onLightboxTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartLbX.current = e.touches[0].clientX;
    touchCurrentLbX.current = touchStartLbX.current;
    isSwipingLb.current = true;
  };
  // Clear animating flag after transition
  useEffect(() => {
    if (!animating) return;
    const t = setTimeout(() => {
      setAnimating(false);
      setPrevLightboxIndex(null);
    }, 340);
    return () => clearTimeout(t);
  }, [animating]);

  const onLightboxTouchMove = (e) => {
    if (!isSwipingLb.current) return;
    touchCurrentLbX.current = e.touches[0].clientX;
  };

  const onLightboxTouchEnd = () => {
    if (!isSwipingLb.current) return;
    const dx = (touchCurrentLbX.current || 0) - (touchStartLbX.current || 0);
    const threshold = 50;
    if (Math.abs(dx) > threshold) {
      if (dx > 0) lbPrev(); else lbNext();
    }
    isSwipingLb.current = false;
    touchStartLbX.current = null;
    touchCurrentLbX.current = null;
  };
  const [ablyClient, setAblyClient] = useState(null);
  const [ablyError, setAblyError] = useState(null);
  const [isAblyConnecting, setIsAblyConnecting] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const conversationsRef = useRef(conversations);
  const messagesEndRef = useRef(null);
  const [isAutoOpening, setIsAutoOpening] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [seenMessageIds, setSeenMessageIds] = useState(new Set());
  const [connectionState, setConnectionState] = useState('disconnected');

  // Refs for cleanup tracking
  const presenceChannelRef = useRef(null);
  const ablyChannelRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get chat context
  const { isChatOpen, setIsChatOpen, targetUser, shouldCreateConversation, autoOpenConversation, resetChatState } = useChat();

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


  const setupPresence = useCallback(async () => {

    if (!ablyClient || !currentUser) {
      console.log('Cannot setup presence: missing ablyClient or currentUser');
      return;
    }

    // Check if we're connected or connecting
    if (ablyClient.connection.state !== 'connected') {

      // If disconnected or failed, try to reconnect
      if (['disconnected', 'failed', 'suspended'].includes(ablyClient.connection.state)) {
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

      // Subscribe to presence events
      presenceChannel.presence.subscribe('enter', (presenceMessage) => {
        setOnlineUsers(prev => new Set(prev).add(presenceMessage.data.userId));
      });

      presenceChannel.presence.subscribe('leave', (presenceMessage) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(presenceMessage.data.userId);
          return newSet;
        });
      });

      // Get initial presence
      const presenceSet = await presenceChannel.presence.get();
      const onlineUserIds = new Set(presenceSet.map(msg => msg.data.userId));
      setOnlineUsers(onlineUserIds);

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
      const timer = setTimeout(() => {
        setupPresence();
      }, 1000); // Small delay to ensure connection is fully ready

      return () => clearTimeout(timer);
    }
  }, [connectionState, currentUser, setupPresence]);

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
          setAblyError(null);
          setIsAblyConnecting(false);
          // Setup presence after connection is established
          setupPresence();
        });

        client.connection.on('disconnected', () => {
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

        // Infer messageType if missing and content looks like an image
        if (!newMessage.messageType && looksLikeImage(newMessage.content)) {
          newMessage.messageType = 'image';
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
      setConnectionState(stateChange.current);

      if (stateChange.current === 'connected') {
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
        // Backfill messageType for messages that contain image URLs
        const normalized = data.messages.map(m => ({
          ...m,
          messageType: m.messageType || (looksLikeImage(m.content) ? 'image' : 'text')
        }));
        setMessages(normalized);
        // Clear seen messages when loading new conversation
        setSeenMessageIds(new Set(normalized.map(msg => msg._id)));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };


  // Create conversation
  const createConversation = async (otherUserId) => {

    try {
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

    const otherParticipant = conversation.participants.find(p => {
      return String(p._id || p.id) !== String(currentUser.id) &&
        p.email !== currentUser.email;
    });


    setSelectedContact(otherParticipant);
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

  // Handle image upload and send
  const handleImageFile = async (file) => {
    if (!file) return;
    if (!selectedConversation) {
      alert('Select a conversation first');
      return;
    }

    // basic validations
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > maxSize) {
      alert('Image too large. Max 5MB.');
      return;
    }

    setSending(true);

    const tempId = `temp-img-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
    const localUrl = URL.createObjectURL(file);
    const tempMessage = {
      _id: tempId,
      content: localUrl,
      senderId: {
        _id: currentUser.id,
        name: currentUser.user_metadata?.full_name || 'You',
        dp: currentUser.user_metadata?.avatar_url || ''
      },
      createdAt: new Date().toISOString(),
      messageType: 'image',
      isTemp: true
    };

    setSeenMessageIds(prev => new Set(prev).add(tempId));
    setMessages(prev => [...prev, tempMessage]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadRes.json();

      if (!uploadData.url) {
        throw new Error('Upload response missing url');
      }

      // Send chat message referencing uploaded image URL
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderId: currentUser.id,
          content: uploadData.url,
          messageType: 'image'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send image message');
      }

      const data = await response.json();

      if (data.success) {
        setSeenMessageIds(prev => new Set(prev).add(data.message._id));

        // Replace temp message
        setMessages(prev => prev.map(msg => msg._id === tempId ? data.message : msg));

        // Update conversation list last message
        setConversations(prev => prev.map(conv =>
          conv._id === selectedConversation._id ? {
            ...conv,
            lastMessage: {
              content: '[Image]',
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
            console.error('Failed to publish image to Ably:', publishError);
          }
        }
      } else {
        throw new Error('Server failed to create message');
      }
    } catch (error) {
      console.error('Error uploading/sending image:', error);
      // remove temp
      setMessages(prev => prev.filter(m => m._id !== tempId));
      alert('Failed to send image. Please try again.');
    } finally {
      setSending(false);
      // revoke local URL
      URL.revokeObjectURL(localUrl);
    }
  };

  // Share the image currently open in lightbox as an image message (upload the blob and send)
  const shareImageFromLightbox = async () => {
    if (!imageMessages[lightboxIndex]) return;
    if (!selectedConversation) {
      alert('Select a conversation first to share the image');
      return;
    }

    try {
      // create a temp message immediately so user sees image + loader in chat
      const imageUrl = imageMessages[lightboxIndex].content;
      const tempId = `temp-share-${Date.now()}-${Math.random().toString(36).substr(2,5)}`;
      const tempMessage = {
        _id: tempId,
        content: imageUrl,
        senderId: {
          _id: currentUser.id,
          name: currentUser.user_metadata?.full_name || 'You',
          dp: currentUser.user_metadata?.avatar_url || ''
        },
        createdAt: new Date().toISOString(),
        messageType: 'image',
        isTemp: true,
        isUploading: true
      };

      setSeenMessageIds(prev => new Set(prev).add(tempId));
      setMessages(prev => [...prev, tempMessage]);
      setSending(true);

      // fetch the image as blob
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error('Failed to fetch image');
      const blob = await res.blob();

      // upload the blob to our /api/upload
      const formData = new FormData();
      // attempt to derive filename
      const filename = imageUrl.split('/').pop().split('?')[0] || `image-${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      if (!uploadData.url) throw new Error('Upload response missing url');

      // send message referencing uploaded url
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          senderId: currentUser.id,
          content: uploadData.url,
          messageType: 'image'
        })
      });

      if (!response.ok) throw new Error('Failed to send image message');

      const data = await response.json();
      if (data.success) {
        setSeenMessageIds(prev => new Set(prev).add(data.message._id));

        // Replace temp message with server message
        setMessages(prev => prev.map(msg => msg._id === tempId ? data.message : msg));

        // Publish to Ably
        if (ablyChannelRef.current && ablyClient.connection.state === 'connected') {
          try {
            await ablyChannelRef.current.publish('message', {
              _id: data.message._id,
              conversationId: data.message.conversationId,
              senderId: data.message.senderId._id,
              senderName: data.message.senderId.name,
              senderDp: data.message.senderId.dp,
              content: data.message.content,
              messageType: data.message.messageType,
              createdAt: data.message.createdAt
            });
          } catch (err) {
            console.error('Failed to publish shared image:', err);
          }
        }

        // update conversations lastMessage
        setConversations(prev => prev.map(conv => conv._id === selectedConversation._id ? { ...conv, lastMessage: { content: '[Image]', timestamp: new Date(), senderId: currentUser.id } } : conv));
      }
    } catch (error) {
      console.error('Error sharing image from lightbox:', error);
      // remove temp message if exists
      setMessages(prev => prev.filter(m => !m.isTemp || !m._id.startsWith('temp-share-')));
      alert('Failed to share image.');
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
        return conv.participants.some(p => {
          return p.email === user.email;
        });
      });


      if (existingConversation) {
        handleConversationSelect(existingConversation);
      } else {

        await createConversation(user._id);
      }
    } catch (error) {
      console.error('Error auto-opening conversation:', error);
    } finally {
      setIsAutoOpening(false);
    }
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

  // Heuristic to detect image URLs (Cloudinary or common image extensions)
  const looksLikeImage = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      // quick extension check
      if (/\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i.test(url)) return true;
      // Cloudinary urls often contain 'res.cloudinary.com' and deliver images
      if (url.includes('res.cloudinary.com')) return true;
      return false;
    } catch (e) {
      return false;
    }
  };


  const isUserOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(userId);
  };

  // Chat context effects
  useEffect(() => {
    setIsOpen(isChatOpen);
  }, [isChatOpen]);

  useEffect(() => {
    if (!isOpen && !autoOpenConversation) {
      resetChatState();
    }
  }, [isOpen, autoOpenConversation, resetChatState]);


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
      {isOpen && (<div className="fixed inset-0 bg-transparent bg-opacity-20 z-40" />)}

      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <button onClick={() => setIsOpen(true)} className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"><MessageCircle size={24} /></button>
        )}

        {isOpen && (
          <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-96 sm:h-[500px] flex flex-col overflow-hidden border">
            {ablyError && (<div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-xs">{ablyError}</div>)}

            {currentView === 'contacts' && (
              <ConversationsList loading={loading} conversations={conversations} getOtherParticipant={getOtherParticipant} handleConversationSelect={handleConversationSelect} isUserOnline={isUserOnline} typingUsers={typingUsers} formatTimestamp={formatTimestamp} />
            )}

            {currentView === 'chat' && selectedContact && selectedConversation && (
              <>
                <ChatHeader selectedContact={selectedContact} handleBackToContacts={handleBackToContacts} isUserOnline={isUserOnline} />

                <MessagesContainer messages={messages} currentUser={currentUser} imageMessages={imageMessages} setLightboxIndex={setLightboxIndex} setLightboxOpen={setLightboxOpen} formatTimestamp={formatTimestamp} messagesEndRef={messagesEndRef} />

                <MessageInput fileInputRef={fileInputRef} handleImageFile={handleImageFile} message={message} setMessage={setMessage} handleTypingStart={handleTypingStart} handleTypingStop={handleTypingStop} handleSendMessage={handleSendMessage} sending={sending} />
              </>
            )}
          </div>
        )}
      </div>

      <LightboxOverlay lightboxOpen={lightboxOpen} imageMessages={imageMessages} lightboxIndex={lightboxIndex} setLightboxOpen={setLightboxOpen} sending={sending} lbPrev={lbPrev} lbNext={lbNext} onLightboxTouchStart={onLightboxTouchStart} onLightboxTouchMove={onLightboxTouchMove} onLightboxTouchEnd={onLightboxTouchEnd} prevLightboxIndex={prevLightboxIndex} animateDirection={animateDirection} animating={animating} />
    </>
  );
};

export default ChatBoard;