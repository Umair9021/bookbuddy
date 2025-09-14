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

  // ✅ Open chat with a specific user
  const openChatWithUser = (user, forceOpen = false) => {
    setTargetUser(user);
    setShouldCreateConversation(true);
    setAutoOpenConversation(user);

    if (forceOpen) {
      setIsChatOpen(true); 
    } else {
      setIsChatOpen(true);
    }
  };

  const resetChatState = () => {
    setTargetUser(null);
    setShouldCreateConversation(false);
    setAutoOpenConversation(null);
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        setIsChatOpen,
        targetUser,
        shouldCreateConversation,
        autoOpenConversation,
        openChatWithUser,
        resetChatState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
