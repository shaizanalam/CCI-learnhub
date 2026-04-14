import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Camera, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Groq from "groq-sdk";
// 1. Import Markdown library
import ReactMarkdown from 'react-markdown';

// Initialize Groq
const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  time: string;
}

const suggestions = [];

export default function ChatPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const getAiResponse = async (userPrompt: string) => {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are the CCI (Chhattisgarh Coaching Institute) AI Tutor. 
                      CRITICAL: Always use clear headings, bullet points, and bold text to organize your answer.
                      If explaining a process, use numbered steps. 
                      Keep it very organized for a student to study easily.` 
          },
          { role: "user", content: userPrompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5, // Lower temperature makes it more factual and structured
      });
      return completion.choices[0]?.message?.content || "I couldn't generate a response.";
    } catch (error) {
      console.error("Groq Error:", error);
      return "Connection error. Please check your Groq API key!";
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const aiResponseText = await getAiResponse(text.trim());

    setTyping(false);
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: 'ai',
      text: aiResponseText,
      time: getTime(),
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="animate-fade-in h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* CSS injection for Markdown styling and bot face */}
      <style>{`
        .prose-custom h1, .prose-custom h2, .prose-custom h3 { 
          font-weight: 700; color: #9333ea; margin-top: 12px; margin-bottom: 6px; font-size: 16px;
        }
        .prose-custom p { margin-bottom: 10px; line-height: 1.6; color: #374151; }
        .prose-custom ul, .prose-custom ol { margin-left: 20px; margin-bottom: 10px; list-style-position: outside; }
        .prose-custom li { margin-bottom: 6px; }
        .prose-custom strong { color: #9333ea; font-weight: 600; }
        .prose-custom code { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; font-family: monospace; color: #9333ea; }
        @media (max-width: 640px) {
          .prose-custom { font-size: 14px; }
          .prose-custom h1, .prose-custom h2, .prose-custom h3 { font-size: 14px; }
        }
      `}</style>

      {/* Full Screen Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-white/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">AI Doubt Solver</h1>
              <p className="text-xs text-gray-600">Ask anything, learn everything</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Full Screen Chat Area */}
      <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-lg">
        {/* Messages Area - Full Screen */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth" ref={messagesContainerRef}>
          {/* Welcome Message when no messages */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Hello! I'm your AI Tutor</h2>
              <p className="text-gray-600 max-w-md mb-8">Ask me anything about your studies. I'm here to help you learn and understand complex topics easily.</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {['Explain physics concepts', 'Help with math problems', 'Study tips', 'Exam preparation'].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 sm:gap-4 animate-msg-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === 'ai' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold'
              }`}>
                {msg.role === 'ai' ? 
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                }
              </div>
              
              {/* Message Content - No Cards */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end max-w-[80%]' : 'items-start max-w-[85%]'} min-w-0`}>
                <div className={`px-4 py-3 rounded-2xl text-sm sm:text-base ${
                  msg.role === 'ai' 
                    ? 'bg-white/80 backdrop-blur-lg text-gray-800 shadow-md' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                }`}>
                  {msg.role === 'ai' ? (
                    <div className="prose-custom max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="break-words">{msg.text}</div>
                  )}
                </div>
                
                {/* Time */}
                <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">AI</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-3 sm:gap-4 animate-msg-in">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Scroll Anchor */}
          <div ref={messagesEnd} />
        </div>

        {/* Full Screen Input Area */}
        <div className="p-4 bg-white/90 backdrop-blur-lg border-t border-white/20">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask me anything about your studies..."
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-3 px-4 text-gray-900 text-base focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={typing || !input.trim()}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white disabled:opacity-40 transition-all hover:shadow-lg disabled:hover:shadow-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}