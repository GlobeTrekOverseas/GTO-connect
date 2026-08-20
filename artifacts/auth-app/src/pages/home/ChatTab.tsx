import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Bot, User } from 'lucide-react';

type MsgRole = 'bot' | 'user';

interface Msg {
  id: number;
  role: MsgRole;
  text: string;
  time: string;
}

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const COUNSELLORS = [
  { name: 'Priya Sharma',   role: 'Senior Counsellor', avatar: 'PS', online: true  },
  { name: 'Rahul Verma',    role: 'Visa Specialist',   avatar: 'RV', online: true  },
  { name: 'Ananya Singh',   role: 'Admissions Expert', avatar: 'AS', online: false },
];

const BOT_REPLIES = [
  "I can help you with university recommendations, visa requirements, scholarships, and more! What would you like to know?",
  "Great question! Based on your profile, I'd recommend looking at universities in Canada and Australia — they have high acceptance rates and excellent programs.",
  "For a Canada Study Visa, you'll need: Passport, Offer Letter, Financial Proof, IELTS Score Report, Medical Certificate, and Passport Size Photos.",
  "The IELTS requirement for most top universities is 6.5 overall with no band below 6.0. Would you like tips to improve your score?",
  "September 2024 and January 2025 intakes are currently open. Shall I shortlist universities with seats available for these intakes?",
];

const INITIAL_BOT: Msg[] = [
  { id: 1, role: 'bot', text: "Hello! 👋 I'm GlobeTrek AI Assistant. How can I help you today?", time: now() },
];

const fallbackReply = (question: string) => {
  const q = question.toLowerCase().trim();
  if (q === 'uk' || q.includes('united kingdom') || q.includes('study in uk')) return 'The UK is a strong option for one-year master’s degrees and globally recognised universities. Start by choosing your course, budget and preferred intake, then use Universities to browse UK partners. You will usually need an offer letter, financial evidence, passport and English-language proof.';
  if (q === 'canada' || q.includes('study in canada')) return 'Canada is popular for career-focused programs and post-study work opportunities. Use the Canada filter in Universities, then check each course for its intake, tuition and English-language requirement before applying.';
  if (q === 'australia' || q.includes('study in australia')) return 'Australia offers a wide choice of bachelor’s and master’s programs. Browse Australian universities in the app, compare fees and intakes, and keep your academic records and English-test score ready.';
  if (q === 'usa' || q.includes('united states') || q.includes('study in usa')) return 'The USA has a broad range of universities, specialisations and scholarships. Shortlist by course and budget first; most applications also need transcripts, recommendation letters, a statement of purpose and English-test results.';
  if (q.includes('germany') || q.includes('europe')) return 'Germany and other European destinations can offer excellent value and specialised programs. Tell me your course and budget, and I can guide you to the right country filter and next steps.';
  if (q.includes('visa')) return 'For a visa checklist, keep your passport, offer letter, financial proof, English-test score report, medical documents and photos ready. A GlobeTrek counsellor can confirm the country-specific requirements.';
  if (q.includes('ielts') || q.includes('pte')) return 'For most courses, an IELTS overall score around 6.5 is common, though each university and program differs. Use Mock Tests in the app, then verify the exact requirement for your course.';
  if (q.includes('scholar')) return 'Scholarships depend on your university, course and academic profile. Save universities you like, then ask a GlobeTrek counsellor to review your eligible options.';
  if (q.includes('university') || q.includes('college') || q.includes('course')) return 'I can help you shortlist from 684 universities across 25 countries. Tell me the country, course, budget and intake you prefer, then use Universities to compare and save options.';
  return 'I can help with UK, Canada, Australia, USA and other study destinations, plus applications, documents, visas, scholarships, English tests, costs and travel preparation. What would you like to explore?';
};

export default function ChatTab() {
  const [counsellorMode, setCounsellorMode] = React.useState<'ai' | 'counsellor'>('ai');
  const [activeCounsellor, setActiveCounsellor] = React.useState(0);
  const [msgs, setMsgs] = React.useState<Msg[]>(INITIAL_BOT);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { id: Date.now(), role: 'user', text, time: now() };
    const conversation = [...msgs, userMsg].slice(-8).map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.text }));
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    try {
      if (counsellorMode !== 'ai') throw new Error('counsellor-mode');
      const response = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, history: conversation }) });
      if (!response.ok) throw new Error('chat-request-failed');
      const data = await response.json();
      setMsgs(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: data.reply, time: now() }]);
    } catch {
      const reply = counsellorMode === 'ai' ? fallbackReply(text) : c.name + ' has received your message. A counsellor will reply shortly.';
      setMsgs(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply, time: now() }]);
    } finally {
      setTyping(false);
    }
  };

  const c = COUNSELLORS[activeCounsellor];

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="bg-[#062a53] px-5 pt-12 pb-0">
        <h1 className="text-[20px] font-bold text-white mb-3">Chat</h1>
        {/* Mode tabs */}
        <div className="flex gap-0 bg-white/10 rounded-xl p-0.5">
          {(['counsellor', 'ai'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setCounsellorMode(mode)}
              className={`flex-1 py-2 rounded-[10px] text-[13px] font-bold capitalize transition-all ${counsellorMode === mode ? 'bg-white text-[#062a53]' : 'text-white/70'}`}
            >
              {mode === 'ai' ? '🤖 AI Assistant' : '👩‍💼 Counsellor'}
            </button>
          ))}
        </div>

        {/* Counsellor picker (counsellor mode) */}
        {counsellorMode === 'counsellor' && (
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {COUNSELLORS.map((cc, i) => (
              <button
                key={cc.name}
                onClick={() => setActiveCounsellor(i)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${activeCounsellor === i ? 'bg-white border-white' : 'border-white/20'}`}
              >
                <div className="w-7 h-7 rounded-full bg-[#087b41] flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-white">{cc.avatar}</span>
                </div>
                <div className="text-left">
                  <p className={`text-[11px] font-bold ${activeCounsellor === i ? 'text-[#062a53]' : 'text-white'}`}>{cc.name.split(' ')[0]}</p>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${cc.online ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                    <span className={`text-[9px] ${activeCounsellor === i ? 'text-slate-500' : 'text-white/60'}`}>{cc.online ? 'Online' : 'Away'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active agent info bar */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-slate-100 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-[#062a53] flex items-center justify-center flex-shrink-0">
          {counsellorMode === 'ai'
            ? <Bot size={18} className="text-white" />
            : <span className="text-[11px] font-bold text-white">{c.avatar}</span>
          }
        </div>
        <div>
          <p className="text-[13px] font-bold text-slate-900">
            {counsellorMode === 'ai' ? 'GlobeTrek AI Assistant' : c.name}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-500">{counsellorMode === 'ai' ? 'Online' : c.online ? 'Online' : 'Away'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {msgs.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto ${msg.role === 'bot' ? 'bg-[#062a53]' : 'bg-[#087b41]'}`}>
                {msg.role === 'bot'
                  ? <Bot size={14} className="text-white" />
                  : <User size={14} className="text-white" />
                }
              </div>
              <div className={`max-w-[75%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#087b41] text-white rounded-br-sm'
                    : 'bg-white text-slate-800 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {typing && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <div className="w-8 h-8 rounded-full bg-[#062a53] flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              {[0,1,2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-300"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
        {['Visa requirements', 'Top universities', 'IELTS tips', 'Scholarship info'].map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="flex-shrink-0 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white px-4 py-3 flex items-center gap-2.5 border-t border-slate-100">
        <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Paperclip size={16} className="text-slate-500" />
        </button>
        <div className="flex-1 flex items-center bg-slate-100 rounded-2xl px-4 py-2.5 gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={input.trim() ? send : undefined}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${input.trim() ? 'bg-[#087b41]' : 'bg-slate-100'}`}
        >
          {input.trim()
            ? <Send size={16} className="text-white" />
            : <Mic size={16} className="text-slate-500" />
          }
        </button>
      </div>
    </div>
  );
}
