"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, MessageCircle, Send, X } from "lucide-react";
import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";
import { askLandmarkChat, type ChatHistoryMessage } from "@/src/lib/chat-landmark";

interface DisplayMessage extends ChatHistoryMessage {
  id: string;
}

interface LandmarkChatProps {
  result: LandmarkAnalysis;
  language: string;
}

const STARTER_QUESTIONS = ["Why was this built?", "Who built it?", "What makes it famous?"];

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export function LandmarkChat({ result, language }: LandmarkChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const sendQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isSending) return;

      setError(null);
      setInput("");
      const history: ChatHistoryMessage[] = messages.map(({ role, text }) => ({ role, text }));
      setMessages((prev) => [...prev, { id: makeId(), role: "user", text: trimmed }]);
      setIsSending(true);

      try {
        const answer = await askLandmarkChat({ result, language, history, question: trimmed });
        setMessages((prev) => [...prev, { id: makeId(), role: "assistant", text: answer }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending, result, language]
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0038FF] text-white font-black text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg hover:brightness-110 active:scale-[0.98] transition"
      >
        <MessageCircle className="w-4 h-4 text-[#CCFF00]" aria-hidden="true" />
        Ask About This Place
      </button>
    );
  }

  return (
    <div className="w-full bg-[#F8F9FA] rounded-[1.5rem] border border-black/5 overflow-hidden text-left">
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
        <span className="flex items-center gap-1.5 font-bold text-sm">
          <MessageCircle className="w-4 h-4 text-[#0038FF]" aria-hidden="true" />
          Ask about {result.name ?? "this place"}
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          className="text-black/40 hover:text-black/70 transition"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div ref={listRef} className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void sendQuestion(question)}
                className="text-xs font-semibold bg-white border border-black/10 rounded-full px-3 py-1.5 hover:border-[#0038FF]/40 transition"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
              message.role === "user"
                ? "ml-auto bg-[#0038FF] text-white"
                : "mr-auto bg-white text-black/80 border border-black/5"
            }`}
          >
            {message.text}
          </div>
        ))}

        {isSending && (
          <div className="mr-auto flex items-center gap-1.5 text-black/40 text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            Thinking…
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-rose-700 bg-rose-50 border-t border-rose-200 px-4 py-2 text-xs">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendQuestion(input);
        }}
        className="flex items-center gap-2 p-3 border-t border-black/5"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question…"
          disabled={isSending}
          aria-label="Ask a question about this place"
          className="flex-1 bg-white border border-black/10 rounded-full px-4 py-2 text-sm outline-none focus:border-[#0038FF]/50 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          aria-label="Send"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0038FF] text-white disabled:opacity-40 transition flex-shrink-0"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
