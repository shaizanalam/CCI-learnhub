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

const suggestions = [
  "What is Newton's 3rd law?",
  "Explain photosynthesis",
  "How to solve quadratic equations?",
  "Difference between acids and bases",
];

export default function ChatPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: `Hi ${profile?.name?.split(' ')[0] || 'there'}! I'm your CCI AI Assistant. Ask me any Class 10 doubt!`, time: '10:00 AM' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

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
    <div className="animate-fade-in min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* CSS injection for Markdown styling */}
      <style>{`
        .prose-custom h1, .prose-custom h2, .prose-custom h3 { 
          font-weight: 700; color: #9333ea; margin-top: 12px; margin-bottom: 6px; font-size: 16px;
        }
        .prose-custom p { margin-bottom: 10px; line-height: 1.6; color: #374151; }
        .prose-custom ul, .prose-custom ol { margin-left: 20px; margin-bottom: 10px; list-style-position: outside; }
        .prose-custom li { margin-bottom: 6px; }
        .prose-custom strong { color: #9333ea; font-weight: 600; }
        .prose-custom code { background: #f3f4f6; padding: 2px 6px; border-radius: 6px; font-family: monospace; color: #9333ea; }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">AI Doubt Solver 🤖</h1>
        <p className="text-sm text-gray-600">Get instant answers to your study questions.</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white/70 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)', maxHeight: '700px' }}>
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">CCI AI Tutor</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-white/90">Online - Ready to help!</span>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className="px-2 py-1 sm:px-3 sm:py-2 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 animate-msg-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
              </div>
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end max-w-[80%]' : 'items-start max-w-[90%]'}`}>
                <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md ${
                  msg.role === 'ai' 
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-none'
                }`}>
                  {/* Markdown Rendering for AI Responses */}
                  {msg.role === 'ai' ? (
                    <div className="prose-custom">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-msg-in">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type your study doubt..."
                className="w-full bg-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl py-2 px-3 sm:py-3 sm:px-4 text-gray-900 text-xs sm:text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 placeholder-gray-500"
              />
            </div>
            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={typing || !input.trim()}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white disabled:opacity-40 transition-all hover:shadow-lg disabled:hover:shadow-none"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}