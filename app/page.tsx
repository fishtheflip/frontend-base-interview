"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { allTopics, modules, type Level } from "./topics";
import { interviewQuestions, questionCategories } from "./questions";
import { getAnswer } from "./answers";

const levelOptions: Array<"Все" | Level> = ["Все", "Основа", "Middle", "Senior"];

function levelClass(level: string) {
  if (level === "Senior") return "border-violet-200 bg-violet-50 text-violet-700";
  if (level === "Middle") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

const levelVisuals = {
  Все: {
    filter: "bg-slate-900 text-white",
    card: "border-slate-200 bg-white",
    number: "bg-slate-100 text-slate-500",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    dot: "bg-slate-500",
  },
  Основа: {
    filter: "bg-emerald-600 text-white shadow-sm shadow-emerald-200",
    card: "border-emerald-200 bg-emerald-50/50 ring-1 ring-emerald-100",
    number: "bg-emerald-100 text-emerald-700",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
  Middle: {
    filter: "bg-blue-600 text-white shadow-sm shadow-blue-200",
    card: "border-blue-200 bg-blue-50/50 ring-1 ring-blue-100",
    number: "bg-blue-100 text-blue-700",
    badge: "border-blue-200 bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
  },
  Senior: {
    filter: "bg-violet-600 text-white shadow-sm shadow-violet-200",
    card: "border-violet-200 bg-violet-50/50 ring-1 ring-violet-100",
    number: "bg-violet-100 text-violet-700",
    badge: "border-violet-200 bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
  },
} as const;

export default function Home() {
  const [view, setView] = useState<"topics" | "questions">("topics");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"Все" | Level>("Все");
  const [category, setCategory] = useState("Все категории");
  const [completed, setCompleted] = useState<string[]>([]);
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [topicsPage, setTopicsPage] = useState(1);
  const [questionsPage, setQuestionsPage] = useState(1);

  useEffect(() => {
    const saved = window.localStorage.getItem("frontend-base-progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const filteredModules = useMemo(() => {
    return modules
      .map((module) => ({
        ...module,
        topics: module.topics.filter((topic) => {
          const matchesLevel = level === "Все" || topic.level === level;
          return matchesLevel;
        }),
      }))
      .filter((module) => module.topics.length > 0);
  }, [level]);

  const filteredQuestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      const matchesCategory = category === "Все категории" || item.category === category;
      const matchesLevel = level === "Все" || (level === "Основа" ? item.level === "Junior" : item.level === level);
      const matchesQuery = !value || `${item.category} ${item.question}`.toLowerCase().includes(value);
      return matchesCategory && matchesLevel && matchesQuery;
    });
  }, [query, level, category]);

  useEffect(() => {
    setTopicsPage(1);
    setQuestionsPage(1);
  }, [query, level, category]);

  const sectionsPerPage = 4;
  const topicsPages = Math.max(1, Math.ceil(filteredModules.length / sectionsPerPage));
  const currentTopicsPage = Math.min(topicsPage, topicsPages);
  const topicsPageStart = (currentTopicsPage - 1) * sectionsPerPage;
  const paginatedModules = filteredModules.slice(topicsPageStart, topicsPageStart + sectionsPerPage);
  const filteredTopicsCount = filteredModules.reduce((count, module) => count + module.topics.length, 0);
  const activeLevelVisual = levelVisuals[level];

  const questionsPerPage = 20;
  const questionsPages = Math.max(1, Math.ceil(filteredQuestions.length / questionsPerPage));
  const currentQuestionsPage = Math.min(questionsPage, questionsPages);
  const questionsPageStart = (currentQuestionsPage - 1) * questionsPerPage;
  const paginatedQuestions = filteredQuestions.slice(questionsPageStart, questionsPageStart + questionsPerPage);

  const progress = Math.round((completed.length / allTopics.length) * 100);
  const currentQuestion = practiceIndex === null ? null : interviewQuestions[practiceIndex % interviewQuestions.length];
  const currentAnswer = currentQuestion ? getAnswer(currentQuestion) : null;

  const openQuestion = (index: number) => {
    setPracticeIndex(index);
    setAnswerVisible(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-4 px-4 sm:px-6">
          <a href="#" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-md bg-slate-950 font-mono text-xs text-white">&lt;/&gt;</span>
            <span>Frontend Base</span>
          </a>

          <button
            onClick={() => openQuestion(Math.floor(Math.random() * interviewQuestions.length))}
            className="ml-auto hidden h-10 shrink-0 items-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 sm:flex"
          >
            Практика
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1480px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-5">
          <nav className="flex gap-2 lg:grid" aria-label="Разделы">
            <button
              onClick={() => setView("topics")}
              className={`flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium lg:flex-none ${view === "topics" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              Темы <span className="text-xs opacity-60">{allTopics.length}</span>
            </button>
            <button
              onClick={() => setView("questions")}
              className={`flex flex-1 items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium lg:flex-none ${view === "questions" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              Вопросы <span className="text-xs opacity-60">{interviewQuestions.length}</span>
            </button>
          </nav>

          <div className="mt-6 hidden lg:block">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Прогресс</span>
              <span className="text-slate-500">{completed.length}/{allTopics.length}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{progress}% тем пройдено</p>
          </div>

          <div className="mt-7 hidden lg:block">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Уровень</p>
            <div className="grid gap-1">
              {levelOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLevel(option)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${level === option ? `${levelVisuals[option].filter} font-medium` : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <span className={`size-2 rounded-full ${level === option ? "bg-white/80" : levelVisuals[option].dot}`} />
                  {option}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-sm text-slate-500">База подготовки к frontend-собеседованию</p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {view === "topics" ? "Темы" : "Вопросы"}
              </h1>
            </div>
            <div className="flex gap-2 lg:hidden">
              {levelOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLevel(option)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs transition ${level === option ? `border-transparent ${levelVisuals[option].filter}` : "border-slate-200 bg-white text-slate-600"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {view === "topics" ? (
            <section className="space-y-3" aria-label="Темы">
              <div className={`mb-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${activeLevelVisual.card}`}>
                <div className="flex items-center gap-3">
                  <span className={`size-3 shrink-0 rounded-full ${activeLevelVisual.dot}`} />
                  <div>
                    <p className="text-sm font-semibold">
                      {level === "Все" ? "Показаны все уровни" : `Выбран уровень: ${level}`}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {filteredTopicsCount} тем в {filteredModules.length} разделах
                    </p>
                  </div>
                </div>
                {level !== "Все" && (
                  <button onClick={() => setLevel("Все")} className="w-fit text-xs font-medium text-slate-600 underline-offset-4 hover:underline">
                    Сбросить уровень
                  </button>
                )}
              </div>

              {paginatedModules.map((module) => {
                const done = module.topics.filter((topic) => completed.includes(topic.id)).length;
                return (
                  <article key={module.id} className={`overflow-hidden rounded-xl border transition ${activeLevelVisual.card}`}>
                    <Link
                      href={`/sections/${module.id}`}
                      className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/60 sm:p-5"
                    >
                      <span className={`grid size-9 shrink-0 place-items-center rounded-lg font-mono text-xs ${activeLevelVisual.number}`}>{module.number}</span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-sm font-semibold sm:text-base">{module.title}</strong>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 sm:text-sm">{module.description}</span>
                      </span>
                      <span className={`hidden rounded-full border px-2.5 py-1 text-[11px] font-medium sm:inline ${activeLevelVisual.badge}`}>
                        {level === "Все" ? `${module.topics.length} тем` : `${module.topics.length} · ${level}`}
                      </span>
                      <span className="text-xs text-slate-400">{done}/{module.topics.length}</span>
                      <span className="text-sm font-medium text-slate-500">Открыть →</span>
                    </Link>
                  </article>
                );
              })}

              {filteredModules.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="font-medium">Темы не найдены</p>
                  <button onClick={() => { setQuery(""); setLevel("Все"); }} className="mt-2 text-sm text-blue-600 hover:underline">Сбросить фильтры</button>
                </div>
              )}

              {filteredModules.length > sectionsPerPage && (
                <nav className="flex items-center justify-center gap-2 pt-2" aria-label="Пагинация тем">
                  <button
                    onClick={() => setTopicsPage((page) => Math.max(1, page - 1))}
                    disabled={currentTopicsPage === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Назад
                  </button>
                  {Array.from({ length: topicsPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setTopicsPage(page)}
                      aria-current={page === currentTopicsPage ? "page" : undefined}
                      className={`size-10 rounded-lg border text-sm font-medium ${page === currentTopicsPage ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setTopicsPage((page) => Math.min(topicsPages, page + 1))}
                    disabled={currentTopicsPage === topicsPages}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Вперёд →
                  </button>
                </nav>
              )}
            </section>
          ) : (
            <section aria-label="Вопросы">
              <div className="relative mb-4 w-full max-w-xl">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Поиск по вопросам"
                  aria-label="Поиск по вопросам"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                {["Все категории", ...questionCategories].map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${category === item ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span>Найдено: {filteredQuestions.length}</span>
                <span>У каждого вопроса есть ответ</span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {paginatedQuestions.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => openQuestion(interviewQuestions.findIndex((question) => question.id === item.id))}
                    className="grid w-full grid-cols-[32px_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 sm:grid-cols-[40px_minmax(0,1fr)_auto_auto] sm:items-center sm:px-5"
                  >
                    <span className="font-mono text-xs text-slate-400">{String(questionsPageStart + index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium leading-5">{item.question}</span>
                    <span className="hidden text-xs text-slate-400 sm:block">{item.category}</span>
                    <span className={`hidden rounded-md border px-2 py-1 text-[10px] font-medium sm:block ${levelClass(item.level)}`}>{item.level}</span>
                  </button>
                ))}
              </div>

              {filteredQuestions.length > questionsPerPage && (
                <nav className="mt-5 flex flex-wrap items-center justify-center gap-2" aria-label="Пагинация вопросов">
                  <button
                    onClick={() => setQuestionsPage((page) => Math.max(1, page - 1))}
                    disabled={currentQuestionsPage === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Назад
                  </button>
                  {Array.from({ length: questionsPages }, (_, index) => index + 1)
                    .filter((page) => page === 1 || page === questionsPages || Math.abs(page - currentQuestionsPage) <= 2)
                    .map((page, index, pages) => (
                      <span key={page} className="contents">
                        {index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
                        <button
                          onClick={() => setQuestionsPage(page)}
                          aria-current={page === currentQuestionsPage ? "page" : undefined}
                          className={`size-10 rounded-lg border text-sm font-medium ${page === currentQuestionsPage ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                  <button
                    onClick={() => setQuestionsPage((page) => Math.min(questionsPages, page + 1))}
                    disabled={currentQuestionsPage === questionsPages}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Вперёд →
                  </button>
                </nav>
              )}
            </section>
          )}
        </main>
      </div>

      {currentQuestion && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={() => setPracticeIndex(null)}>
          <article className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">{currentQuestion.category}</span>
                  <span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${levelClass(currentQuestion.level)}`}>{currentQuestion.level}</span>
                </div>
                <h2 className="text-xl font-semibold leading-8 sm:text-2xl">{currentQuestion.question}</h2>
              </div>
              <button onClick={() => setPracticeIndex(null)} className="grid size-8 shrink-0 place-items-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Закрыть">×</button>
            </div>

            {answerVisible && currentAnswer ? (
              <section className="mb-6 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/50" aria-label="Ответ">
                <div className="border-b border-emerald-200 bg-emerald-100/60 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Ответ</p>
                </div>
                <div className="space-y-5 p-4 sm:p-5">
                  <div>
                    <h3 className="mb-1.5 text-xs font-semibold text-slate-500">Кратко</h3>
                    <p className="text-sm font-medium leading-6 text-slate-900">{currentAnswer.short}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-semibold text-slate-500">Что раскрыть</h3>
                    <ul className="space-y-2">
                      {currentAnswer.points.map((point) => (
                        <li key={point} className="flex gap-2 text-sm leading-6 text-slate-700">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <h3 className="mb-1 text-xs font-semibold text-slate-500">Пример</h3>
                      <p className="text-sm leading-6 text-slate-700">{currentAnswer.example}</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <h3 className="mb-1 text-xs font-semibold text-amber-700">Важно</h3>
                      <p className="text-sm leading-6 text-slate-700">{currentAnswer.caveat}</p>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <button
                onClick={() => setAnswerVisible(true)}
                className="mb-6 w-full rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Показать ответ
              </button>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => setPracticeIndex(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Закрыть</button>
              <button onClick={() => openQuestion(Math.floor(Math.random() * interviewQuestions.length))} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Следующий вопрос</button>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
