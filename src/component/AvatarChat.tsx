"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Msg = { role: "user" | "assistant"; text: string };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Web Speech API types (avoid TS errors)
type SpeechRecognitionType = typeof window extends any
  ? any
  : any;

export default function AvatarChat() {
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voicesReady, setVoicesReady] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi 👋 I’m Tamil’s AI avatar. You can type or tap the mic to ask by voice.",
    },
  ]);

  // --- Animations ---
  const avatarPulse = useMemo(
    () => ({
      idle: reduce
        ? {}
        : {
            scale: [1, 1.02, 1],
            transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          },
      speaking: reduce
        ? {}
        : {
            scale: [1, 1.05, 1],
            transition: { duration: 0.75, repeat: Infinity, ease: "easeInOut" },
          },
      listening: reduce
        ? {}
        : {
            scale: [1, 1.04, 1],
            transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
          },
    }),
    [reduce]
  );

  const blink = useMemo(
    () => ({
      animate: reduce
        ? {}
        : {
            scaleY: [1, 1, 1, 0.08, 1, 1, 1],
            transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          },
    }),
    [reduce]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
  
    const synth = window.speechSynthesis;
  
    const markReady = () => {
      const v = synth.getVoices();
      if (v && v.length > 0) setVoicesReady(true);
    };

    markReady();
    synth.onvoiceschanged = markReady;
  
    // Also check periodically in case onvoiceschanged doesn't fire (only for first 5 seconds)
    let attempts = 0;
    const maxAttempts = 10; // 5 seconds total (500ms * 10)
    const interval = setInterval(() => {
      attempts++;
      if (!voicesReady && attempts < maxAttempts) {
        markReady();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 500);
  
    return () => {
      synth.onvoiceschanged = null;
      clearInterval(interval);
    };
  }, []); // Remove voicesReady dependency to avoid infinite loops
  

  // --- Detect support & init SpeechRecognition ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const hasSR = !!SR;
    setSpeechSupported(hasSR);

    const hasTTS = typeof window.speechSynthesis !== "undefined";
    setTtsSupported(hasTTS);

    if (!hasSR) return;

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onstart = () => setListening(true);

    rec.onresult = (event: any) => {
      const results = Array.from(event.results || []);
      const transcript = results
        .map((r: any) => r[0]?.transcript ?? "")
        .join("")
        .trim();

      setInput(transcript);

      const last = event.results?.[event.results.length - 1];
      const isFinal = last?.isFinal;
      if (isFinal && transcript) {
        setListening(false);
        setTimeout(() => send(transcript), 50);
      }
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;

    return () => {
      try {
        rec.abort?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToBottom() {
    queueMicrotask(() =>
      listRef.current?.scrollTo({ top: 999999, behavior: "smooth" })
    );
  }

  function stopTTS() {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  function speak(text: string) {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
  
    // Wait for voices to be ready if not already
    const ensureVoicesReady = () => {
      const voices = synth.getVoices();
      if (voices && voices.length > 0) {
        return voices;
      }
      // If voices aren't ready, wait a bit and try again
      return null;
    };
  
    const voices = ensureVoicesReady();
    if (!voices || voices.length === 0) {
      // Wait for voices; retry speaks outside gesture but we've already primed TTS
      const checkVoices = () => {
        const v = synth.getVoices();
        if (v && v.length > 0) {
          setVoicesReady(true);
          setTimeout(() => speak(text), 100);
        } else {
          setTimeout(checkVoices, 100);
        }
      };
      synth.onvoiceschanged = checkVoices;
      setTimeout(checkVoices, 50);
      return;
    }

    try {
      synth.cancel();
      setTimeout(() => {
        try {
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang = "en-US";
          utter.rate = 1;
          utter.pitch = 1;
          utter.volume = 1;
          utter.onstart = () => setSpeaking(true);
          utter.onend = () => setSpeaking(false);
          utter.onerror = () => setSpeaking(false);

          const preferred =
            voices.find((v) => /en/i.test(v.lang) && /zira|samantha|female/i.test(v.name)) ||
            voices.find((v) => /en/i.test(v.lang)) ||
            voices[0] ||
            null;
          if (preferred) utter.voice = preferred;

          synth.speak(utter);
        } catch {
          setSpeaking(false);
        }
      }, 50);
    } catch {
      setSpeaking(false);
    }
  }
  

  function startListening() {
    if (!speechSupported) return;

    stopTTS();
    setSpeaking(false);

    const rec = recognitionRef.current;
    if (!rec) return;

    try {
      rec.start();
    } catch {
      // Some browsers throw if called twice quickly
    }
  }

  function stopListening() {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch {}
    setListening(false);
  }

  async function send(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    scrollToBottom();

    stopListening();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = (await res.json()) as { answer?: string };
      const answer = data?.answer ?? "Sorry — I couldn't answer that right now.";

      if (ttsEnabled && ttsSupported) {
        speak(answer);
      }
      setMsgs((m) => [...m, { role: "assistant", text: answer }]);
      scrollToBottom();
    } catch {
      const errorMsg = "Network issue. Please try again.";
      if (ttsEnabled && ttsSupported) speak(errorMsg);
      setMsgs((m) => [...m, { role: "assistant", text: errorMsg }]);
      scrollToBottom();
    }
  }

  const status = listening ? "Listening…" : speaking ? "Speaking…" : "Ready";

  const avatarAnim =
    listening ? avatarPulse.listening : speaking ? avatarPulse.speaking : avatarPulse.idle;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        {/* Avatar */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative h-16 w-16 rounded-2xl border border-white/10 bg-zinc-950"
              animate={avatarAnim as any}
            >
              {/* Neon aura */}
              <div className="absolute -inset-2 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_60%)] blur-md" />
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_60%)]" />

              {/* Face */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative h-10 w-10">
                  {/* Eyes */}
                  <div className="absolute left-0 top-2 flex w-full items-center justify-between px-1">
                    <motion.div
                      className="h-2 w-3 rounded-full bg-white/80"
                      {...blink as any}
                    />
                    <motion.div
                      className="h-2 w-3 rounded-full bg-white/80"
                      {...blink as any}
                    />
                  </div>

                  {/* Mouth / waveform */}
                  <div className="absolute bottom-1 left-1/2 w-7 -translate-x-1/2">
                    <motion.div
                      className="h-1 w-full rounded-full bg-white/70"
                      animate={
                        reduce
                          ? {}
                          : speaking
                          ? { scaleX: [0.5, 1, 0.6, 1] }
                          : listening
                          ? { scaleX: [0.7, 0.95, 0.75, 0.92] }
                          : { scaleX: 0.7 }
                      }
                      transition={
                        reduce
                          ? {}
                          : speaking
                          ? { duration: 0.32, repeat: Infinity, ease: "easeInOut" }
                          : listening
                          ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
                          : { duration: 0.2 }
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Tamil’s AI Avatar</p>
              <p className="text-xs text-white/60">{status}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-xs text-white/70">
            <p className="rounded-xl border border-white/10 bg-zinc-950/40 p-3">
              Tap the mic to ask by voice. Try:{" "}
              <span className="text-white/90">“Tech stack?”</span>,{" "}
              <span className="text-white/90">“Availability?”</span>
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTtsEnabled((v) => !v)}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                disabled={!ttsSupported}
                title={!ttsSupported ? "Text-to-speech not supported in this browser." : ""}
              >
                🔊 Voice Reply: {ttsEnabled ? "ON" : "OFF"}
              </button>

              <button
                onClick={() => {
                  stopTTS();
                  setSpeaking(false);
                }}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                disabled={!ttsSupported}
              >
                ⏹ Stop Voice
              </button>
              <button
                onClick={() => {
                  if (ttsEnabled && ttsSupported) {
                    speak("Voice output is working. This is a test of the text to speech system.");
                  } else {
                    alert(`TTS Status: Enabled=${ttsEnabled}, Supported=${ttsSupported}, Voices Ready=${voicesReady}`);
                  }
                }}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15"
                disabled={!ttsSupported}
                >
                    ✅ Test Voice
                </button>
                <p className="text-[11px] text-white/45">
                    TTS: {ttsSupported ? "Supported" : "Not supported"} · Voices: {voicesReady ? "Loaded" : "Loading…"}
                </p>
            </div>

            {!speechSupported && (
              <p className="text-[11px] text-white/45">
                Voice input isn’t supported in this browser. Try Chrome or Edge.
              </p>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
          <div
            ref={listRef}
            className="max-h-[420px] overflow-auto p-5 space-y-3"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cx(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cx(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-white/10 text-white"
                      : "bg-zinc-950/60 border border-white/10 text-white/90"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex gap-2">
              <button
                onClick={() => (listening ? stopListening() : startListening())}
                className={cx(
                  "rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 active:scale-[0.99]",
                  listening ? "bg-white/20" : "bg-white/10"
                )}
                disabled={!speechSupported}
                title={!speechSupported ? "Voice input not supported" : ""}
              >
                {listening ? "🎙️ Listening…" : "🎙️ Mic"}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Type a question…"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/20"
              />

              <button
                onClick={() => send()}
                className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 active:scale-[0.99]"
              >
                Send
              </button>
            </div>

            <p className="mt-2 text-[11px] text-white/45">
              Tip: Chrome asks permission for mic. If voice doesn’t start, check site permissions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
