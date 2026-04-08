import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, User, Bot, Loader2, MessageCircle } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const SUGGESTED_PROMPTS = [
  'How often should I replace my prosthetic liner?',
  'Why is my residual limb irritated?',
  'What does Medicare cover for prosthetics?',
  'How do I manage limb volume changes throughout the day?',
  'What exercises help with prosthetic gait training?',
  'How should I care for my prosthetic socket?',
];

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

const STORAGE_KEY = 'ampume-chat-history';

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
  const inputRef = useRef(null);

  // Auto-send initial prompt from navigation state (e.g. homepage prompt click)
  useEffect(() => {
    if (initialPrompt && !hasUsedInitialPrompt && !isLoading) {
      setHasUsedInitialPrompt(true);
      // Clear previous chat and send the prompt
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
      setTimeout(() => sendMessage(initialPrompt), 100);
    }
  }, [initialPrompt, hasUsedInitialPrompt]);

  // Persist messages to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
    catch { /* quota exceeded or private browsing */ }
  }, [messages]);

  const lastUserMsgRef = useRef(null);

  // Gentle scroll within chat container only — no page scrolling
  useEffect(() => {
    const container = scrollAreaRef.current;
    const target = lastUserMsgRef.current;
    if (!container || !target || messages.length < 2) return;
    if (container.scrollHeight <= container.clientHeight) return;
    // Calculate target position relative to the scroll container
    const targetTop = target.offsetTop - container.offsetTop;
    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Timeout after 30 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'Sorry, I was unable to generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (err) {
      clearTimeout(timeout);
      console.error('Chat error:', err);
      const isTimeout = err.name === 'AbortError';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isTimeout
          ? "The response took too long. Please try again."
          : "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handlePromptClick = (prompt) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden" style={{ height: 'min(70vh, 640px)' }}>
      {/* Header — new conversation button */}
      {!isEmpty && (
        <div className="flex justify-end px-4 pt-3 pb-0">
          <button
            onClick={clearChat}
            className="text-xs font-medium text-gray-500 hover:text-black bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors"
          >
            New conversation
          </button>
        </div>
      )}
      {/* Messages area */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-5">
              <MessageCircle className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">How can I help you today?</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Ask me anything about prosthetics, recovery, daily life, or insurance coverage.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-full transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              // Track the last user message for scroll anchoring
              const isLastUser = msg.role === 'user' && (i === messages.length - 1 || (i === messages.length - 2 && messages[messages.length - 1].role === 'assistant'));
              return (
                <div key={i} ref={isLastUser ? lastUserMsgRef : null}>
                  <ChatMessage message={msg} />
                </div>
              );
            })}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 px-4 md:px-6 py-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-50 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 hover:bg-gray-800 transition-colors disabled:opacity-30"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          AI responses are informational only. Always consult your prosthetist or healthcare provider for medical decisions.
        </p>
      </div>
    </div>
  );
}

const AISupport = () => {
  const location = useLocation();
  const initialPrompt = location.state?.prompt || null;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <SEO
        title="AI Support Assistant"
        description="Get immediate answers about amputation recovery, prosthetics, and daily life from our AI assistant."
        url="https://ampume.com/ai-support"
      />
      <SimpleNavbar />

      <main className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <ChatInterface initialPrompt={initialPrompt} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AISupport;
