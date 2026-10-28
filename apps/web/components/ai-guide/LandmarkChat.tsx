"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";
import {
  askLandmarkChat,
  type ChatHistoryMessage,
} from "@/src/lib/chat-landmark";

interface DisplayMessage extends ChatHistoryMessage {
  id: string;
}

interface LandmarkChatProps {
  result: LandmarkAnalysis;
  language: string;
}

const STARTER_QUESTIONS = [
  "Why was this built?",
  "Who built it?",
  "What makes it famous?",
];

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
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const sendQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isSending) return;

      setError(null);
      setInput("");

      const history: ChatHistoryMessage[] = messages.map(({ role, text }) => ({
        role,
        text,
      }));

      setMessages((previous) => [
        ...previous,
        { id: makeId(), role: "user", text: trimmed },
      ]);
      setIsSending(true);

      try {
        const answer = await askLandmarkChat({
          result,
          language,
          history,
          question: trimmed,
        });

        setMessages((previous) => [
          ...previous,
          { id: makeId(), role: "assistant", text: answer },
        ]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tourmate-coral)] px-8 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[var(--tourmate-coral-dark)] active:scale-[0.98] sm:w-auto md:text-base"
      >
        <MessageCircle
          className="h-4 w-4 text-[var(--tourmate-gold)]"
          aria-hidden="true"
        />
        Ask About This Place
      </button>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-[1.5rem] border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] text-left">
      <div className="flex items-center justify-between border-b border-[var(--tourmate-line)] px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm font-bold text-[var(--tourmate-ink)]">
          <MessageCircle
            className="h-4 w-4 text-[var(--tourmate-coral)]"
            aria-hidden="true"
          />
          Ask about {result.name ?? "this place"}
        </span>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          className="text-[var(--tourmate-dim)] transition hover:text-[var(--tourmate-coral-dark)]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={listRef}
        className="max-h-72 space-y-3 overflow-y-auto px-4 py-3"
      >
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void sendQuestion(question)}
                className="rounded-full border border-[var(--tourmate-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-coral)]"
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
                ? "ml-auto bg-[var(--tourmate-coral)] text-white"
                : "mr-auto border border-[var(--tourmate-line)] bg-white text-[var(--tourmate-ink)]"
            }`}
          >
            {message.text}
          </div>
        ))}

        {isSending && (
          <div className="mr-auto flex items-center gap-1.5 text-xs text-[var(--tourmate-dim)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Thinking…
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 border-t border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] px-4 py-2 text-xs text-[var(--tourmate-coral-dark)]">
          <AlertCircle
            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void sendQuestion(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--tourmate-line)] p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question…"
          disabled={isSending}
          aria-label="Ask a question about this place"
          className="flex-1 rounded-full border border-[var(--tourmate-line)] bg-white px-4 py-2 text-sm text-[var(--tourmate-ink)] outline-none placeholder:text-[var(--tourmate-dim)] focus:border-[var(--tourmate-teal)] disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isSending || !input.trim()}
          aria-label="Send"
          className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--tourmate-coral)] text-white transition hover:bg-[var(--tourmate-coral-dark)] disabled:opacity-40"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
