"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAnswer } from "../../answers";
import { interviewQuestions, type InterviewQuestion } from "../../questions";
import type { Module } from "../../topics";
import ThemeToggle from "../../theme-toggle";

const categoryMatchers: Record<string, RegExp> = {
  html: /HTML и доступность/,
  css: /^CSS$/,
  javascript: /JavaScript|Асинхронность/,
  typescript: /TypeScript/,
  react: /React|Redux|Angular|Vue/,
  browser: /Браузер|Сеть|Безопасность/,
  quality: /Тестирование|Performance|Инженерные/,
  architecture: /Архитектура|System Design|Инженерные/,
};

function levelClass(level: string) {
  if (level === "Senior") return "border-violet-200 bg-violet-50 text-violet-700";
  if (level === "Middle") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function SectionPageClient({ module }: { module: Module }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeTopic, setActiveTopic] = useState("all");
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [answerVisible, setAnswerVisible] = useState(false);

  useEffect(() => {
    setCompleted(JSON.parse(window.localStorage.getItem("frontend-base-progress") ?? "[]"));
  }, []);

  const questions = useMemo(() => {
    const matcher = categoryMatchers[module.id];
    const sectionQuestions = interviewQuestions.filter((item) => matcher?.test(item.category));
    if (activeTopic === "all") return sectionQuestions;
    const topic = module.topics.find((item) => item.id === activeTopic);
    if (!topic) return sectionQuestions;
    const words = `${topic.title} ${topic.description}`.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
    const filtered = sectionQuestions.filter((item) => words.some((word) => item.question.toLowerCase().includes(word)));
    return filtered.length >= 3 ? filtered : sectionQuestions;
  }, [activeTopic, module]);

  const toggleComplete = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("frontend-base-progress", JSON.stringify(next));
      return next;
    });
  };

  const openQuestion = (question: InterviewQuestion) => {
    setCurrentQuestion(question);
    setAnswerVisible(false);
  };

  const answer = currentQuestion ? getAnswer(currentQuestion) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-slate-950 font-mono text-xs text-white">&lt;/&gt;</span>
            Frontend Base
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-950">Все разделы</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Разделы</Link><span>/</span><span className="text-slate-900">{module.title}</span>
        </nav>

        <section className="mb-8 border-b border-slate-200 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-white font-mono text-xs text-slate-500 ring-1 ring-slate-200">{module.number}</span>
            <span className="text-sm text-slate-500">{module.topics.length} тем · {questions.length} вопросов</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{module.title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{module.description}</p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Темы раздела</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {module.topics.map((topic) => {
              const done = completed.includes(topic.id);
              return (
                <article key={topic.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <button onClick={() => toggleComplete(topic.id)} aria-label={`Отметить тему ${topic.title}`} className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border text-[10px] ${done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent"}`}>✓</button>
                  <button onClick={() => setActiveTopic(topic.id)} className="min-w-0 flex-1 text-left">
                    <span className={`block text-sm font-medium ${done ? "text-slate-400 line-through" : ""}`}>{topic.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{topic.description}</span>
                  </button>
                  <span className={`h-fit rounded-md border px-2 py-1 text-[10px] font-medium ${levelClass(topic.level)}`}>{topic.level}</span>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Вопросы раздела</h2>
              <p className="mt-1 text-sm text-slate-500">Нажмите на вопрос — ответ появится так же, как в общей базе.</p>
            </div>
            {activeTopic !== "all" && <button onClick={() => setActiveTopic("all")} className="text-sm text-slate-600 hover:text-slate-950">Показать все вопросы</button>}
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {questions.map((item, index) => (
              <button key={item.id} onClick={() => openQuestion(item)} className="grid w-full grid-cols-[34px_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50 sm:grid-cols-[40px_minmax(0,1fr)_auto_auto] sm:items-center sm:px-5">
                <span className="font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium leading-5">{item.question}</span>
                <span className="hidden text-xs text-slate-400 sm:block">{item.category}</span>
                <span className={`hidden rounded-md border px-2 py-1 text-[10px] font-medium sm:block ${levelClass(item.level)}`}>{item.level}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {currentQuestion && answer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={() => setCurrentQuestion(null)}>
          <article className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2"><span className="text-xs text-slate-500">{currentQuestion.category}</span><span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${levelClass(currentQuestion.level)}`}>{currentQuestion.level}</span></div>
                <h2 className="text-xl font-semibold leading-8 sm:text-2xl">{currentQuestion.question}</h2>
              </div>
              <button onClick={() => setCurrentQuestion(null)} className="grid size-8 shrink-0 place-items-center rounded-lg text-xl text-slate-400 hover:bg-slate-100" aria-label="Закрыть">×</button>
            </div>
            {answerVisible ? (
              <section className="my-6 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="border-b border-emerald-200 bg-emerald-100/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-emerald-800">Ответ</div>
                <div className="space-y-5 p-4 sm:p-5">
                  <p className="text-sm font-medium leading-6">{answer.short}</p>
                  <ul className="space-y-2">{answer.points.map((point) => <li key={point} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />{point}</li>)}</ul>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="mb-1 text-xs font-semibold text-slate-500">Пример</p><p className="text-sm leading-6 text-slate-700">{answer.example}</p></div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3"><p className="mb-1 text-xs font-semibold text-amber-700">Важно</p><p className="text-sm leading-6 text-slate-700">{answer.caveat}</p></div>
                  </div>
                </div>
              </section>
            ) : <button onClick={() => setAnswerVisible(true)} className="my-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Показать ответ</button>}
            <div className="flex justify-end"><button onClick={() => setCurrentQuestion(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Закрыть</button></div>
          </article>
        </div>
      )}
    </div>
  );
}
