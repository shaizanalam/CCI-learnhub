import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: number;
  role: 'ai' | 'user';
  text: string;
  time: string;
}

const aiReplies = [
  "Great question! Let me explain this step by step. This concept is fundamental to understanding the rest of the chapter.",
  "This is a very common doubt among students! The key is to understand the underlying principle first, then apply the formula.",
  "Excellent! This topic appears frequently in exams. Here's a simplified way to remember it: focus on the relationship between the variables.",
  "You're on the right track! Let me give you a cleaner explanation with an example that'll make it easier to remember.",
  "This is a tricky one but very important. The concept becomes clear when you think about it from first principles.",
];

const suggestions = [
  "What is Newton's 3rd law?",
  "Explain photosynthesis",
  "How to solve quadratic equations?",
  "Difference between acids and bases",
];

export default function ChatPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'ai', text: `Hi ${profile?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Doubt Solver. Ask me anything related to your subjects. I'm here to help!`, time: '10:00 AM' },
    { id: 2, role: 'ai', text: 'You can also try the quick questions below ⬇️', time: '10:00 AM' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'ai',
        text: aiReplies[replyIdx.current % aiReplies.length],
        time: getTime(),
      };
      replyIdx.current++;
      setMessages(prev => [...prev, aiMsg]);
    }, 1400 + Math.random() * 800);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1">AI Doubt Solver 🤖</h1>
        <p className="text-muted-foreground text-sm">Ask any subject-related doubt — AI replies instantly.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', maxHeight: '700px' }}>
        {/* Chat header */}
        <div className="p-4 px-5 border-b border-border flex items-center gap-3">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-cci-accent to-cci-green rounded-full flex items-center justify-center text-lg flex-shrink-0">🤖</div>
          <div>
            <div className="font-bold text-[15px]">CCI AI Tutor</div>
            <div className="text-xs text-cci-green flex items-center gap-1.5">
              <span className="w-[7px] h-[7px] bg-cci-green rounded-full animate-pulse-dot" />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2.5 animate-msg-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5 ${
                msg.role === 'ai'
                  ? 'bg-gradient-to-br from-cci-accent to-cci-green'
                  : 'bg-gradient-to-br from-cci-amber to-cci-rose text-primary-foreground font-bold'
              }`}>
                {msg.role === 'ai' ? '🤖' : (profile?.name?.[0]?.toUpperCase() || 'U')}
              </div>
              <div>
                <div className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-cci-bg3 rounded-bl-[4px]'
                    : 'bg-gradient-to-br from-cci-accent to-cci-accent2 text-primary-foreground rounded-br-[4px]'
                }`}>
                  {msg.text}
                </div>
                <div className={`text-[10px] text-cci-text3 mt-1 ${msg.role === 'ai' ? 'text-left' : 'text-right'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2.5 animate-msg-in">
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-cci-accent to-cci-green flex items-center justify-center text-[13px] flex-shrink-0 mt-0.5">🤖</div>
              <div className="flex gap-1 p-3.5 px-4 bg-cci-bg3 rounded-2xl rounded-bl-[4px] w-fit">
                <div className="w-[7px] h-[7px] bg-cci-text3 rounded-full animate-typing-bounce" />
                <div className="w-[7px] h-[7px] bg-cci-text3 rounded-full animate-typing-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-[7px] h-[7px] bg-cci-text3 rounded-full animate-typing-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Suggestions */}
        <div className="px-5 pb-3 flex gap-2 flex-wrap">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-cci-bg3 border border-input text-muted-foreground hover:border-cci-accent hover:text-cci-accent hover:bg-cci-accent/10 transition-all whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 px-5 border-t border-border flex gap-2.5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask your doubt..."
            className="flex-1 bg-cci-bg3 border border-input rounded-lg py-2.5 px-4 text-foreground text-sm outline-none transition-all focus:border-cci-accent placeholder:text-cci-text3"
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-11 h-11 bg-gradient-to-br from-cci-accent to-cci-accent3 rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0 hover:opacity-90 hover:scale-105 transition-all"
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
