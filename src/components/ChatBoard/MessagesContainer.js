import React from 'react';
export default function MessagesContainer({ messages, currentUser, imageMessages, setLightboxIndex, setLightboxOpen, formatTimestamp, isUserOnline, messagesEndRef }) {
  return (
    <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 0h40v40h-40z'/%3E%3C/g%3E%3C/svg%3E")` }}>
      <div className="space-y-3">
        {messages.map((msg, index) => {
          const isMe = msg.senderId._id === currentUser.id || msg.senderId === currentUser.id;
          const sender = typeof msg.senderId === 'object' ? msg.senderId : { name: 'Unknown' };
          const uniqueKey = `${msg._id}-${msg.createdAt}-${index}`;

          return (
            <div key={uniqueKey} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-end space-x-2 max-w-xs">
                {!isMe && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-semibold mb-1">{sender.name?.charAt(0)?.toUpperCase() || '?'}</div>
                )}
                <div className={`px-1 py-1 rounded-lg ${isMe ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                    {msg.messageType === 'image' ? (
                      <div className="max-w-xs">
                        <div className="relative inline-block">
                          <img src={msg.content} alt="sent image" className="rounded-md max-h-60 w-auto object-cover cursor-pointer" onClick={() => {
                            const idx = imageMessages.findIndex(im => im._id === msg._id);
                            if (idx >= 0) { setLightboxIndex(idx); setLightboxOpen(true); }
                          }} />
                          {msg.isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                              <div className="text-white text-sm">{msg.uploadProgress || 0}%</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-green-100' : 'text-gray-500'}`}>{formatTimestamp(msg.createdAt)}</p>
                      </>
                    )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
