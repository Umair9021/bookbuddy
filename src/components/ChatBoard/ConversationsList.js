import React from 'react';

export default function ConversationsList({
  loading,
  conversations,
  getOtherParticipant,
  handleConversationSelect,
  isUserOnline,
  typingUsers,
  formatTimestamp
}) {
  return (
    <>
      <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-green-700 rounded hidden sm:block">...</button>
        </div>
      </div>

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
                    {isUserOnline(otherParticipant._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{otherParticipant.name}</h3>
                      <span className="text-xs text-gray-500">
                        {conversation.lastMessage?.timestamp && formatTimestamp(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {typingUsers[otherParticipant._id] ? (
                        <p className="text-sm text-green-600 italic truncate">Typing...</p>
                      ) : (
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.content || 'No messages yet'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="mb-4 text-gray-300">No conversations yet</div>
            <p className="text-center px-4">No conversations yet</p>
          </div>
        )}
      </div>
    </>
  );
}
