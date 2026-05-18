import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Header } from "./app.send";
import { useCasheI18n } from "@/lib/cashe-i18n";

export const Route = createFileRoute("/_authenticated/app/ai")({
  component: AIChat,
});

const suggestions = [
  "আমি কীভাবে প্রতি মাসে ৳১০০০ সঞ্চয় করব?",
  "Best way to budget my student stipend?",
  "Eid Sanchay goal-এর জন্য টিপস দাও",
  "Should I take a Khamar loan for poultry?",
];

function AIChat() {
  const nav = useNavigate();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { tr } = useCasheI18n();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const loading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    if (!text.trim() || loading) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <div className="min-h-full flex flex-col gradient-hero pb-2">
      <Header onBack={() => nav({ to: "/app" })} title="CASh-E AI · Bangla + English" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 mt-2 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center text-center pt-8">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-glow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="mt-3 text-base font-bold">{tr("Apnar Financial Bondhu 🤝")}</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              {tr("Ask in Bangla or English about saving, budgeting, sending money, agri-loans, OTT bundles — anything.")}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-2 w-full">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="glass rounded-2xl px-3 py-2.5 text-left text-xs hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-br from-primary to-accent text-white"
                    : "glass-strong text-foreground"
                }`}
              >
                {isUser ? (
                  text
                ) : (
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" /> {tr("CASh-E AI is thinking…")}
            </div>
          </div>
        )}
      </div>

      <div className="p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="glass-strong rounded-2xl p-1.5 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tr("Type in Bangla or English…")}
            className="flex-1 bg-transparent outline-none px-3 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}
