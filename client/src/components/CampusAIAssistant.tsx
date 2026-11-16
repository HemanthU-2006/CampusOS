import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ChevronDown,
  RotateCcw,
  Building2,
  Calendar,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { Button } from './ui/Button';
import { aiApi, AIChatMessage } from '@/features/ai/api';

const QUICK_SUGGESTIONS = [
  'How do I book Alan Turing Hall?',
  'Who is the HOD of ISE department?',
  'Where is the Innovation & Robotics Lab?',
  'How does event waitlist promotion work?',
];

export const CampusAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'model',
      content:
        "Hello! I am **Sage**, your SJBIT CampusOS Assistant. How can I assist you with venues, fests, faculty, or lab hardware today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');
    const newMessages: AIChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const reply = await aiApi.chat(text, newMessages.slice(-6));
      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'An error occurred while communicating with the assistant. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'model',
        content:
          "Conversation cleared! I'm Sage. Ask me anything about SJBIT venues, courses, lab equipment, or campus procedures.",
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Campus AI Assistant"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#141414] border border-lime/40 text-white shadow-[0_0_24px_rgba(131,243,77,0.35)] hover:border-lime hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-lime animate-ping absolute opacity-75" />
            <Sparkles className="w-4 h-4 text-lime relative" />
          </div>
          <span className="text-xs font-bold tracking-wide text-white group-hover:text-lime transition-colors">
            Ask Campus AI
          </span>
        </button>
      )}

      {/* Slide-out / Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] flex flex-col rounded-2xl bg-[#0e0e0e]/95 backdrop-blur-xl border border-ring/80 shadow-[0_12px_48px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#141414] border-b border-ring/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-lime" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-tight">Sage Assistant</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                </div>
                <p className="text-[10px] text-white/50">SJBIT Campus AI · Powered by Gemini</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Clear conversation"
                className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-lime" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-lime text-lime-ink font-medium rounded-tr-sm'
                      : 'bg-[#181818] border border-ring/60 text-white/90 rounded-tl-sm'
                  }`}
                >
                  {/* Basic markdown renderer */}
                  {msg.content.split('\n').map((line, lIdx) => {
                    // Render bold text
                    const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return (
                      <span
                        key={lIdx}
                        className="block"
                        dangerouslySetInnerHTML={{ __html: boldProcessed }}
                      />
                    );
                  })}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-white/70" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-white/50">
                <div className="w-6 h-6 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-lime animate-pulse" />
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[#181818] border border-ring/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (only if 2 or fewer messages) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 pb-2 pt-1 border-t border-ring/30 bg-[#121212]">
              <p className="text-[10px] text-white/40 mb-1.5 font-medium px-1">Suggested inquiries:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSend(sug)}
                    className="text-[11px] text-left px-2.5 py-1 rounded-full bg-[#1c1c1c] hover:bg-lime/10 hover:text-lime hover:border-lime/30 border border-ring/60 text-white/70 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-[#141414] border-t border-ring/60 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Sage anything about SJBIT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-[#1a1a1a] border border-ring/80 focus:border-lime rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
            />
            <Button
              variant="lime"
              size="sm"
              disabled={!input.trim() || isLoading}
              onClick={() => handleSend()}
              className="px-3 py-2 h-auto"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
