import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  color: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  participants: number;
  onSendMessage: (message: string) => void;
  accessibilityMode: boolean;
}

export function ChatPanel({ messages, participants, onSendMessage, accessibilityMode }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const emojis = ['💗', '😢', '😊', '😂', '👍', '🔥', '👏', '🎉'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onSendMessage(emoji);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      {/* Header */}
      <div className="p-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-white ${accessibilityMode ? 'text-xl' : 'text-base'}`}>
            Chat en Vivo
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Users className="w-4 h-4" />
            <span className={accessibilityMode ? 'text-base' : 'text-sm'}>
              {participants}
            </span>
          </div>
        </div>
        <p className={`text-gray-400 ${accessibilityMode ? 'text-base' : 'text-xs'}`}>
          Chatea con otros espectadores
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="space-y-3 p-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarFallback style={{ backgroundColor: msg.color }}>
                    <span className="text-xs">{msg.username.charAt(0).toUpperCase()}</span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span 
                      className={`font-medium ${accessibilityMode ? 'text-sm' : 'text-xs'}`}
                      style={{ color: msg.color }}
                    >
                      {msg.username}
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      {msg.timestamp.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className={`text-gray-300 break-words ${accessibilityMode ? 'text-sm' : 'text-xs'} leading-relaxed`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800 flex-shrink-0">
        {/* Emojis */}
        <div className="flex gap-1.5 mb-2 overflow-x-auto pb-2 scrollbar-hide">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiClick(emoji)}
              className={`flex-shrink-0 ${
                accessibilityMode ? 'w-10 h-10 text-xl' : 'w-9 h-9 text-lg'
              } rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95`}
              aria-label={`Enviar emoji ${emoji}`}
              type="button"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
              accessibilityMode ? 'text-lg py-6' : ''
            }`}
            aria-label="Escribe un mensaje"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`bg-purple-600 hover:bg-purple-700 ${accessibilityMode ? 'px-6' : ''}`}
            aria-label="Enviar mensaje"
          >
            <Send className={accessibilityMode ? 'w-5 h-5' : 'w-4 h-4'} />
          </Button>
        </div>
        <p className="text-gray-500 mt-1.5 text-[10px]">
          Presiona Enter para enviar
        </p>
      </div>
    </div>
  );
}
