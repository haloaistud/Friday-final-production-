
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

const ChatbotPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const initChat = () => {
    if (!chatRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are FRIDAY, a highly advanced AI terminal. Respond intelligently, concisely, and use external search grounding when relevant.',
          tools: [{ googleSearch: {} }]
        }
      });
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    initChat();
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: userMsg });
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '' }]);

      let aiText = '';
      let aiSources: { uri: string; title: string }[] = [];

      for await (const chunk of responseStream) {
        if (chunk.text) {
           aiText += chunk.text;
        }
        
        // Extract Google Search Grounding Metadata dynamically
        const chunks = chunk.groundingMetadata?.groundingChunks;
        if (chunks && Array.isArray(chunks)) {
          chunks.forEach((gChunk: any) => {
            if (gChunk.web?.uri && gChunk.web?.title) {
              if (!aiSources.some(s => s.uri === gChunk.web.uri)) {
                aiSources.push({ uri: gChunk.web.uri, title: gChunk.web.title });
              }
            }
          });
        }

        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, text: aiText, sources: [...aiSources] } : msg
        ));
      }
    } catch (error: any) {
       console.error(error);
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '[SYSTEM ERROR: ' + error.message + ']' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-[#00d4ff]/10 to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#00d4ff] shadow-[0_0_10px_#00d4ff] animate-pulse"></div>
          <div className="flex flex-col">
             <h2 className="text-[10px] font-bold tracking-[0.3em] text-[#00d4ff] uppercase font-mono">TEXT UPLINK CORE</h2>
             <span className="text-[8px] text-white/20 tracking-widest uppercase">MODEL: gemini-3-flash-preview | LIVE SEARCH: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Chat log */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/20 font-mono text-sm tracking-widest uppercase opacity-50">
            <span className="text-4xl mb-4 block animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">💬</span>
            Terminal ready for text input...
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-xl border font-mono text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-white/5 border-white/10 text-white/80 rounded-tr-sm' : 'bg-[#00d4ff]/5 border-[#00d4ff]/20 text-[#00d4ff]/90 shadow-[0_0_15px_rgba(0,212,255,0.05)] rounded-tl-sm'}`}>
              <div className="text-[8px] uppercase tracking-widest mb-2 opacity-50">{msg.role === 'user' ? 'User' : 'Friday AI'}</div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              
              {/* Grounding Source Rendering */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#00d4ff]/20">
                  <div className="text-[8px] uppercase tracking-widest mb-2 opacity-60 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#00d4ff] rounded-full animate-pulse"></span> Search Grounding Sources
                  </div>
                  <ul className="space-y-1.5">
                    {msg.sources.map((src, idx) => (
                      <li key={idx} className="truncate">
                        <a href={src.uri} target="_blank" rel="noreferrer" className="text-[#00d4ff] hover:text-white transition-colors hover:underline text-[10px] flex items-center gap-2 bg-[#00d4ff]/10 px-2 py-1.5 rounded-md border border-[#00d4ff]/10">
                          <span className="opacity-70">🔗</span> {src.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-4 rounded-xl border bg-[#00d4ff]/5 border-[#00d4ff]/20 text-[#00d4ff]/90 rounded-tl-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-ping"></div>
                <span className="text-xs uppercase tracking-widest opacity-80">Processing query & searching databanks...</span>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-[#050505]">
        <form onSubmit={handleSend} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter query parameters (Search enabled)..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-[#00d4ff]/5 transition-all shadow-inner"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-6 py-3 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 font-bold uppercase tracking-widest rounded-lg hover:bg-[#00d4ff]/20 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Transmit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatbotPanel;
