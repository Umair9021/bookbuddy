'use client';
import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [shouldCreateConversation, setShouldCreateConversation] = useState(false);
  const [autoOpenConversation, setAutoOpenConversation] = useState(null);

  const openChatWithUser = (user, forceOpen = false) => {
  setTargetUser(user);
  setShouldCreateConversation(true);
  setAutoOpenConversation(user);
  
  // Force the chat to open even if it's already open
  if (forceOpen) {
    // Close and immediately reopen the chat to trigger the auto-open logic
    setIsChatOpen(false);
    
    // Use a timeout to ensure the close completes before reopening
    setTimeout(() => {
      setIsChatOpen(true);
      
      // Additional force refresh for the chat board component
      if (typeof window !== 'undefined') {
        // Dispatch a custom event that ChatBoard can listen for
        window.dispatchEvent(new CustomEvent('chatForceOpen', { 
          detail: { user } 
        }));
      }
    }, 100);
  } else {
    // Normal behavior
    setIsChatOpen(true);
  }
};

  const resetChatState = () => {
    setTargetUser(null);
    setShouldCreateConversation(false);
    setAutoOpenConversation(null);
  };

  return (
    <ChatContext.Provider value={{
      isChatOpen,
      setIsChatOpen,
      targetUser,
      shouldCreateConversation,
      autoOpenConversation,
      openChatWithUser,
      resetChatState
    }}>
      {children}
    </ChatContext.Provider>
  );
};