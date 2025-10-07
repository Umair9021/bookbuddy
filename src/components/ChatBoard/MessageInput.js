import React from 'react';
import { Paperclip, Send } from 'lucide-react';

export default function MessageInput({ fileInputRef, handleImageFile, message, setMessage, handleTypingStart, handleTypingStop, handleSendMessage, sending }) {
  return (
    <div className="p-3 sm:p-4 bg-gray-100 border-t">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-200" title="Send image" aria-label="Send image">
            <Paperclip size={16} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) handleImageFile(f); e.target.value = null; }} />
        </div>

        <div className="flex-1 relative">
          <input type="text" value={message} onChange={(e) => { setMessage(e.target.value); if (e.target.value.trim()) { handleTypingStart(); } else { handleTypingStop(); } }} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} onBlur={handleTypingStop} placeholder="Type a message..." className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-sm disabled:opacity-50" />
        </div>
        <button onClick={handleSendMessage} disabled={sending || !message.trim()} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"><Send size={18} /></button>
      </div>
    </div>
  );
}
