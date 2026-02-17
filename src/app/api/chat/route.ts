import { NextResponse } from "next/server";

type ChatRequest = { message: string };

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function answerFromFaq(messageRaw: string) {
  const message = normalize(messageRaw);

  // Basic UAE / portfolio / hiring-friendly FAQs (edit freely)
  const rules: Array<{ test: RegExp; answer: string }> = [
    {
      test: /(hi|hello|hey)\b/,
      answer: "Hey! 👋 Ask me anything about Tamil’s work, projects, or availability.",
    },
    {
      test: /(who are you|what are you)\b/,
      answer:
        "I’m Tamil’s AI avatar. I can help you quickly understand his skills, experience, and projects.",
    },
    {
      test: /(stack|tech stack|technologies)\b/,
      answer:
        "Primary: React, Next.js, TypeScript. Mobile: React Native. Also: REST APIs, performance optimization, secure UI flows, CI/CD.",
    },
    {
      test: /(portfolio|projects)\b/,
      answer:
        "You can browse the portfolio projects and deep-dive into architecture, highlights, and impact: https://tamilarasan-nagendran-portfolio.vercel.app/",
    },
    {
      test: /(availability|notice period|when can you join|join)\b/,
      answer:
        "Tamil is currently in Dubai and can start immediately (or within short notice depending on contract setup).",
    },
    {
      test: /(visa|work visa|sponsorship)\b/,
      answer:
        "Tamil is currently on a UAE visit visa with limited remaining validity and prefers roles that provide visa support (or a suitable contract arrangement).",
    },
    {
      test: /(contact|email|phone)\b/,
      answer:
        "Email: tamilarasann.1992@gmail.com • Phone: +971 54 359 0779",
    },
    {
      test: /(experience|years)\b/,
      answer:
        "Tamil is a Senior Software Engineer with 9+ years building production-grade web & mobile platforms across enterprise and regulated environments.",
    },
  ];

  for (const r of rules) {
    if (r.test.test(message)) return r.answer;
  }

  // Fallback
  return (
    "Good question. I can help with Tamil’s projects, tech stack, availability, visa, or contact details. " +
    "Try asking: “What’s your tech stack?” or “Share portfolio.”"
  );
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;

  const message = body?.message ?? "";
  if (!message.trim()) {
    return NextResponse.json(
      { answer: "Ask me something 🙂" },
      { status: 400 }
    );
  }

  const answer = answerFromFaq(message);
  return NextResponse.json({ answer });
}
