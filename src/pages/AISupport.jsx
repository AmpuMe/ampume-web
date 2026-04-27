import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send, User, Bot, Loader2,
  ChevronRight, ChevronDown, Info,
  HandHeart, ShieldCheck, Smile, Flag,
} from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// All six default suggested prompts (per Alex, 2026-04-26).
const ALL_PROMPTS = [
  'What exercises help improve prosthetic walking?',
  'What should I expect after an amputation?',
  'How do I choose the right prosthetic liner?',
  'How do I manage limb volume changes during the day?',
  'How often should I replace my prosthetic liner?',
  'What does Medicare cover for prosthetics?',
];

// Topic chips with brand-friendly accent colors and curated prompt sets.
const TOPICS = [
  {
    key: 'care',
    label: 'Care',
    Icon: HandHeart,
    color: 'text-rose-500',
    prompts: [
      'How often should I replace my prosthetic liner?',
      'How should I care for my prosthetic socket?',
      'What are early signs of skin irritation to watch for?',
    ],
  },
  {
    key: 'insurance',
    label: 'Insurance',
    Icon: ShieldCheck,
    color: 'text-emerald-500',
    prompts: [
      'What does Medicare cover for prosthetics?',
      'How often will insurance cover a new socket?',
      'What if my insurance denies coverage for supplies?',
    ],
  },
  {
    key: 'comfort',
    label: 'Comfort',
    Icon: Smile,
    color: 'text-violet-500',
    prompts: [
      'How do I manage limb volume changes during the day?',
      'Why is my residual limb irritated?',
      'How can I reduce phantom limb pain?',
    ],
  },
  {
    key: 'getting-started',
    label: 'Getting Started',
    Icon: Flag,
    color: 'text-amber-500',
    prompts: [
      'What should I expect after an amputation?',
      'How do I choose the right prosthetic liner?',
      'What exercises help improve prosthetic walking?',
    ],
  },
];

const DISCLAIMER = 'AmpuMe provides informational guidance only and is not a medical provider, medical device, or diagnostic tool. Responses are not medical advice and should not be relied upon for healthcare decisions. Always consult your prosthetist or a qualified healthcare provider.';

const INPUT_PLACEHOLDER = "Ask a question or share what's on your mind about your prosthesis, care, or daily life…";

const STORAGE_KEY = 'ampume-chat-history';

/* ── Message bubble (chat view) ─────────────────────────────────── */

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-black text-white rounded-tr-sm'
          : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm'
      }`}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap [&_strong]:font-bold" dangerouslySetInnerHTML={{ __html: message.content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n\n/g, '<br/><br/>')
          .replace(/^- /gm, '• ')
          .replace(/^(\d+)\. /gm, '$1. ')
        }} />
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/* ── Landing view (pre-chat) ────────────────────────────────────── */

function LandingView({ onSend, isLoading }) {
  const [input, setInput] = useState('');
  const [activeTopic, setActiveTopic] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Suggested questions: when a topic is active, show that topic's set;
  // otherwise the canonical first 4 from ALL_PROMPTS.
  const visibleQuestions = activeTopic
    ? TOPICS.find(t => t.key === activeTopic)?.prompts || []
    : ALL_PROMPTS.slice(0, 4);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-12 min-h-[100dvh]">
      {/* Hero */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-3 md:mb-4">
          Ask AmpuMe. Get real answers.
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Clear, reliable answers for real life with limb loss — informed by expert guidance and designed for everyday life.
        </p>
      </div>

      {/* Primary action — dominant input */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10 md:mb-14">
        <div className="relative bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg px-4 md:px-5 py-3 md:py-3.5 flex items-center gap-2 md:gap-3 focus-within:border-gray-400 focus-within:shadow-lg transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isNarrow ? 'Ask a question…' : "Ask a question or share what's going on"}
            disabled={isLoading}
            className="flex-1 min-w-0 bg-transparent text-sm md:text-base focus:outline-none placeholder:text-gray-400 py-1.5"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-30 disabled:bg-gray-200 disabled:text-gray-400"
            aria-label="Send"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Suggested questions */}
      <div className="mb-8 md:mb-10">
        <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-3 md:mb-4">Suggested questions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
          {visibleQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onSend(q)}
              disabled={isLoading}
              className="group text-left bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm rounded-xl px-3.5 py-3 md:px-4 md:py-3.5 transition-all disabled:opacity-50 disabled:hover:border-gray-200"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs md:text-sm text-gray-700 leading-snug line-clamp-3">{q}</span>
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-300 group-hover:text-gray-700 flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Browse by topic — de-emphasized */}
      <div className="mb-8 md:mb-10">
        <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-3 md:mb-4">Browse by topic</h3>
        <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TOPICS.map(({ key, label, Icon, color }) => {
            const active = activeTopic === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTopic(active ? null : key)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full border transition-colors flex-shrink-0 ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${active ? 'text-white' : color}`} />
                <span className="text-[11px] md:text-sm font-medium whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle divider */}
      <div className="h-px bg-gray-100 mb-6 md:mb-8" />

      {/* Important information — quietest */}
      <div>
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          className="w-full flex items-center gap-2 py-2 text-left text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
          aria-expanded={showInfo}
        >
          <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          Important information
          <ChevronDown
            className={`w-3.5 h-3.5 ml-auto text-gray-400 transition-transform ${showInfo ? 'rotate-180' : ''}`}
          />
        </button>
        {showInfo && (
          <p className="text-xs text-gray-500 leading-relaxed pt-2 pb-2">
            {DISCLAIMER}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Chat view (post-first-message) ─────────────────────────────── */

function ChatView({ messages, isLoading, input, setInput, onSend, onClear, scrollAreaRef, lastUserMsgRef }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
  };

  return (
    <div className="h-[100dvh] flex flex-col pt-20 md:pt-24 pb-4 md:pb-6 px-4 md:px-12">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* New conversation button row */}
        <div className="flex justify-end mb-3 flex-shrink-0">
          <button
            onClick={onClear}
            className="text-xs font-medium text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
          >
            New conversation
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-1 [scrollbar-gutter:stable]">
          <div className="space-y-4 pb-2">
            {messages.map((msg, i) => {
              const isLastUser = msg.role === 'user' && (i === messages.length - 1 || (i === messages.length - 2 && messages[messages.length - 1].role === 'assistant'));
              return (
                <div key={i} ref={isLastUser ? lastUserMsgRef : null}>
                  <ChatMessage message={msg} />
                </div>
              );
            })}
            {isLoading && <TypingIndicator />}
          </div>
        </div>

        {/* Input pill */}
        <form onSubmit={handleSubmit} className="mt-4 flex-shrink-0">
          <div className="relative bg-white border border-gray-200 rounded-full shadow-sm px-5 py-3 flex items-center gap-3 focus-within:border-gray-400 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={INPUT_PLACEHOLDER}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm md:text-base focus:outline-none placeholder:text-gray-400 py-1.5"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-30"
              aria-label="Send"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] md:text-xs text-gray-500 text-center mt-3 max-w-3xl mx-auto leading-snug">
            {DISCLAIMER}
          </p>
        </form>
      </div>
    </div>
  );
}

/* ── Stateful container ─────────────────────────────────────────── */

function ChatInterface({ initialPrompt }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedInitialPrompt, setHasUsedInitialPrompt] = useState(false);
  const scrollAreaRef = useRef(null);
  const lastUserMsgRef = useRef(null);

  // Auto-send initial prompt from navigation state (e.g. homepage prompt click)
  useEffect(() => {
    if (initialPrompt && !hasUsedInitialPrompt && !isLoading) {
      setHasUsedInitialPrompt(true);
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
      setTimeout(() => sendMessage(initialPrompt), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, hasUsedInitialPrompt]);

  // Persist messages
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
    catch { /* quota exceeded or private browsing */ }
  }, [messages]);

  // Gentle scroll to last user message
  useEffect(() => {
    const container = scrollAreaRef.current;
    const target = lastUserMsgRef.current;
    if (!container || !target || messages.length < 2) return;
    if (container.scrollHeight <= container.clientHeight) return;
    const targetTop = target.offsetTop - container.offsetTop;
    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'Sorry, I was unable to generate a response.';
      setMessages((prev) => [...prev, { role: 'assistant', content }]);
    } catch (err) {
      clearTimeout(timeout);
      console.error('Chat error:', err);
      const isTimeout = err.name === 'AbortError';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isTimeout
            ? 'The response took too long. Please try again.'
            : "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isEmpty = messages.length === 0;

  return isEmpty ? (
    <LandingView onSend={sendMessage} isLoading={isLoading} />
  ) : (
    <ChatView
      messages={messages}
      isLoading={isLoading}
      input={input}
      setInput={setInput}
      onSend={sendMessage}
      onClear={clearChat}
      scrollAreaRef={scrollAreaRef}
      lastUserMsgRef={lastUserMsgRef}
    />
  );
}

/* ── Page wrapper ──────────────────────────────────────────────── */

const AISupport = () => {
  const location = useLocation();
  const initialPrompt = location.state?.prompt || null;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <SEO
        title="Ask AmpuMe"
        description="Get immediate answers about amputation recovery, prosthetics, and daily life from our AI assistant."
        url="https://ampume.com/ai-support"
      />
      <SimpleNavbar />

      <main>
        <ChatInterface initialPrompt={initialPrompt} />
      </main>

      <Footer />
    </div>
  );
};

export default AISupport;
