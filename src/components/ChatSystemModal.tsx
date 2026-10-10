import React, { useState } from 'react';
import { Chat, ChatMessage, UserRole } from '../types';
import { X, Send, MessageSquare } from 'lucide-react';

interface ChatSystemModalProps {
  chats: Chat[];
  messages: Record<string, ChatMessage[]>;
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onSendMessage: (chatId: string, text: string) => void;
  onClose: () => void;
}

export const ChatSystemModal: React.FC<ChatSystemModalProps> = ({
  chats,
  messages,
  currentUserRole,
  currentUserId,
  currentUserName,
  onSendMessage,
  onClose
}) => {
  const [activeChatId, setActiveChatId] = useState<string>(chats[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const activeMessages = activeChat ? (messages[activeChat.id] || []) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    onSendMessage(activeChat.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full h-[620px] flex overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Left Side: Conversation List */}
        <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Mensajería Interdisciplinaria</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {chats.map(chat => {
              const isSelected = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {chat.patientName}
                    </h4>
                    {chat.lastMessage && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(chat.lastMessage.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {chat.lastMessage?.text || 'Nueva conversación iniciada'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Message Thread & Composer */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeChat?.patientName}
              </h3>
              <p className="text-[11px] text-slate-500">
                Canal seguro de comunicación entre familia, clínica y escuela
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
            {activeMessages.map(msg => {
              const isMe = msg.senderId === currentUserId || msg.senderName.includes(currentUserName);
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{msg.senderName}</span>
                    <span>·</span>
                    <span className="text-indigo-600">{msg.senderRole}</span>
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Escribe una observación clínica, recomendación o consulta..."
              className="flex-1 text-xs px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
