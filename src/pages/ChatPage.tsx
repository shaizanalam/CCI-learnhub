import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
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
    { id: 1, role: 'ai', text: `Hi ${profile?.name?.split(' ')[0] || 'there'}! 👋 I'm your CCI AI Assistant. Ask me any Class 10 or NEET doubt!`, time: '10:00 AM' },
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
    <div className="animate-fade-in">
      {/* CSS injection for Markdown styling */}
      <style>{`
        .prose-custom h1, .prose-custom h2, .prose-custom h3 { 
          font-weight: 700; color: #a855f7; margin-top: 12px; margin-bottom: 6px; font-size: 16px;
        }
        .prose-custom p { margin-bottom: 10px; line-height: 1.6; }
        .prose-custom ul, .prose-custom ol { margin-left: 20px; margin-bottom: 10px; list-style-position: outside; }
        .prose-custom li { margin-bottom: 6px; }
        .prose-custom strong { color: #facc15; } /* Yellow bold for emphasis */
        .prose-custom code { background: #334155; padding: 2px 4px; rounded: 4px; font-family: monospace; }
      `}</style>

      <div className="mb-5">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1 text-white">AI Doubt Solver 🤖</h1>
        <p className="text-muted-foreground text-sm">Organized study help for CCI students.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', maxHeight: '700px' }}>
        {/* Header */}
        <div className="p-4 px-5 border-b border-border flex items-center gap-3 bg-[#1e2235]">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#a855f7] to-[#22c55e] rounded-full flex items-center justify-center text-lg">🤖</div>
          <div>
            <div className="font-bold text-[15px] text-white">CCI AI Tutor</div>
            <div className="text-xs text-[#22c55e] flex items-center gap-1.5"><span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />Online</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[#0f172a]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 animate-msg-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] flex-shrink-0 mt-1 ${
                msg.role === 'ai' ? 'bg-gradient-to-br from-[#a855f7] to-[#22c55e]' : 'bg-gradient-to-br from-[#f59e0b] to-[#f43f5e] text-white font-bold'
              }`}>
                {msg.role === 'ai' ? '🤖' : (profile?.name?.[0]?.toUpperCase() || 'U')}
              </div>
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end max-w-[80%]' : 'items-start max-w-[90%]'}`}>
                <div className={`px-4 py-3 rounded-2xl text-[14px] shadow-sm ${
                  msg.role === 'ai' ? 'bg-[#1e293b] text-gray-100 rounded-tl-none border border-slate-700' : 'bg-[#a855f7] text-white rounded-tr-none'
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
                <span className="text-[10px] text-slate-500 mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-msg-in">
              <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#a855f7] to-[#22c55e] flex items-center justify-center text-lg">🤖</div>
              <div className="p-4 bg-[#1e293b] rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-[#1e2235] border-t border-slate-800 flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type your study doubt..."
            className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-white text-sm focus:border-[#a855f7] outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={typing || !input.trim()}
            className="w-12 h-12 bg-gradient-to-br from-[#a855f7] to-[#7c3aed] rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}