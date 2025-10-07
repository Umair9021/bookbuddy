import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';

export default function ChatHeader({ selectedContact, handleBackToContacts, isUserOnline }) {
  return (
    <div className="bg-green-600 text-white p-3 sm:p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button onClick={handleBackToContacts} className="p-1 hover:bg-green-700 rounded"><ArrowLeft size={18} /></button>
        {selectedContact.dp ? (
          <img src={selectedContact.dp} alt={selectedContact.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-700 rounded-full flex items-center justify-center text-sm font-semibold">{selectedContact.name?.charAt(0)?.toUpperCase() || '?'}</div>
        )}
        <div>
          <h3 className="font-semibold text-sm sm:text-base">{selectedContact.name}</h3>
          <p className="text-xs text-green-100">{isUserOnline(selectedContact._id) ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-1 hover:bg-green-700 rounded hidden sm:block"><MoreVertical size={18} /></button>
      </div>
    </div>
  );
}
