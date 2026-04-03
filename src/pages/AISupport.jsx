import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Loader2, MessageCircle } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useSubscribe } from '../hooks/useSubscribe';

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
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      // Add empty assistant message that we'll stream into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // If no content came through streaming, try non-streaming fallback
      if (!assistantContent) {
        setMessages(prev => prev.slice(0, -1)); // Remove empty assistant message
        const fallbackResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map(m => ({ role: m.role, content: m.content })),
            stream: false,
          }),
        });
        const fallbackData = await fallbackResponse.json();
        const content = fallbackData.choices?.[0]?.message?.content || 'Sorry, I was unable to generate a response.';
        setMessages(prev => [...prev, { role: 'assistant', content }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => {
        // Remove empty assistant message if it exists
        const filtered = prev.filter(m => m.content !== '');
        return [...filtered, {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        }];
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
  };

  const handlePromptClick = (prompt) => {
    if (isStreaming) return;
    sendMessage(prompt);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden" style={{ height: 'min(70vh, 640px)' }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
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
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
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
            disabled={isStreaming}
            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-50 placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 hover:bg-gray-800 transition-colors disabled:opacity-30"
          >
            {isStreaming ? (
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
  const { subscribe, loading, success, error } = useSubscribe();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await subscribe(formData);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <SEO
        title="AI Support Assistant"
        description="Get immediate answers about amputation recovery, prosthetics, and daily life from our AI assistant."
        url="https://ampume.com/ai-support"
      />
      <SimpleNavbar />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Available 24/7
            </p>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
              Ask anything.
            </h1>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-xl mx-auto">
              Questions about prosthetics, care, and daily life — get clear answers instantly.
            </p>
          </div>

          {/* Chat */}
          <ChatInterface />
        </div>
      </main>

      {/* Newsletter / CTA */}
      <section id="newsletter" className="py-32 px-6 md:px-12 bg-gray-50 text-black border-t border-gray-100">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-6">
             <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">
              Stay in <br /> the loop.
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-md leading-relaxed">
              New products, resources, and platform updates — delivered to your inbox.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8 mt-12 lg:mt-0">
            {success ? (
              <div className="bg-white p-8 md:p-12 border border-gray-100 text-center">
                <h3 className="text-2xl font-medium mb-4">You're subscribed!</h3>
                <p className="text-gray-500">We'll keep you in the loop with updates, new products, and resources.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 md:p-12 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-widest mb-4">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full bg-transparent border-b border-gray-200 py-4 text-left text-xl placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-widest mb-4">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full bg-transparent border-b border-gray-200 py-4 text-left text-xl placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest mb-4">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-transparent border-b border-gray-200 py-4 text-left text-xl placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors w-full md:w-auto disabled:opacity-50"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                   <p className="text-xs text-gray-400">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AISupport;
