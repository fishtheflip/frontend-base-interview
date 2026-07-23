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

export default function Home() {
  const [view, setView] = useState<"topics" | "questions">("topics");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"Все" | Level>("Все");
  const [category, setCategory] = useState("Все категории");
  const [completed, setCompleted] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>(modules.map((module) => module.id));
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(40);

  useEffect(() => {
    const saved = window.localStorage.getItem("frontend-base-progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleComplete = (id: string) => {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      window.localStorage.setItem("frontend-base-progress", JSON.stringify(next));
      return next;
    });
  };

  const filteredModules = useMemo(() => {
    const value = query.trim().toLowerCase();
    return modules
      .map((module) => ({
        ...module,
        topics: module.topics.filter((topic) => {
          const matchesLevel = level === "Все" || topic.level === level;
          const matchesQuery = !value || `${module.title} ${topic.title} ${topic.description}`.toLowerCase().includes(value);
          return matchesLevel && matchesQuery;
        }),
      }))
      .filter((module) => module.topics.length > 0);
  }, [query, level]);

  const filteredQuestions = useMemo(() => {
    const value = query.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      const matchesCategory = category === "Все категории" || item.category === category;
      const matchesLevel = level === "Все" || (level === "Основа" ? item.level === "Junior" : item.level === level);
      const matchesQuery = !value || `${item.category} ${item.question}`.toLowerCase().includes(value);
      return matchesCategory && matchesLevel && matchesQuery;
    });
  }, [query, level, category]);

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

          <div className="relative ml-auto w-full max-w-xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по темам и вопросам"
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <button
            onClick={() => openQuestion(Math.floor(Math.random() * interviewQuestions.length))}
            className="hidden h-10 shrink-0 items-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 sm:flex"
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
                  className={`rounded-lg px-3 py-2 text-left text-sm ${level === option ? "bg-slate-100 font-medium text-slate-950" : "text-slate-600 hover:bg-slate-50"}`}
                >
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
                  className={`rounded-md border px-2.5 py-1.5 text-xs ${level === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {view === "topics" ? (
            <section className="space-y-3" aria-label="Темы">
              {filteredModules.map((module) => {
                const isExpanded = expandedModules.includes(module.id);
                const done = module.topics.filter((topic) => completed.includes(topic.id)).length;
                return (
                  <article key={module.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <button
                      onClick={() => setExpandedModules((current) => current.includes(module.id) ? current.filter((id) => id !== module.id) : [...current, module.id])}
                      className="flex w-full items-center gap-4 p-4 text-left hover:bg-slate-50 sm:p-5"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 font-mono text-xs text-slate-500">{module.number}</span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-sm font-semibold sm:text-base">{module.title}</strong>
                        <span className="mt-0.5 block truncate text-xs text-slate-500 sm:text-sm">{module.description}</span>
                      </span>
                      <span className="text-xs text-slate-400">{done}/{module.topics.length}</span>
                      <span className={`text-slate-400 transition ${isExpanded ? "rotate-180" : ""}`}>⌄</span>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-100">
                        {module.topics.map((topic) => {
                          const isDone = completed.includes(topic.id);
                          return (
                            <div key={topic.id} className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:items-center sm:px-5">
                              <button
                                onClick={() => toggleComplete(topic.id)}
                                aria-label={`Отметить тему ${topic.title}`}
                                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border text-[10px] sm:mt-0 ${isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-slate-500"}`}
                              >✓</button>
                              <Link href={`/topics/${topic.id}`} className="min-w-0 flex-1 rounded-md outline-none focus:ring-2 focus:ring-slate-300">
                                <p className={`text-sm font-medium hover:text-blue-700 ${isDone ? "text-slate-400 line-through" : ""}`}>{topic.title}</p>
                                <p className="mt-0.5 text-xs leading-5 text-slate-500">{topic.description}</p>
                              </Link>
                              <span className={`hidden rounded-md border px-2 py-1 text-[10px] font-medium sm:inline ${levelClass(topic.level)}`}>{topic.level}</span>
                              <Link href={`/topics/${topic.id}`} className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                                Открыть
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}

              {filteredModules.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <p className="font-medium">Темы не найдены</p>
                  <button onClick={() => { setQuery(""); setLevel("Все"); }} className="mt-2 text-sm text-blue-600 hover:underline">Сбросить фильтры</button>
                </div>
              )}
            </section>
          ) : (
            <section aria-label="Вопросы">
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                {["Все категории", ...questionCategories].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setCategory(item); setVisibleCount(40); }}
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
                {filteredQuestions.slice(0, visibleCount).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => openQuestion(interviewQuestions.findIndex((question) => question.id === item.id))}
                    className="grid w-full grid-cols-[32px_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 sm:grid-cols-[40px_minmax(0,1fr)_auto_auto] sm:items-center sm:px-5"
                  >
                    <span className="font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-medium leading-5">{item.question}</span>
                    <span className="hidden text-xs text-slate-400 sm:block">{item.category}</span>
                    <span className={`hidden rounded-md border px-2 py-1 text-[10px] font-medium sm:block ${levelClass(item.level)}`}>{item.level}</span>
                  </button>
                ))}
              </div>

              {visibleCount < filteredQuestions.length && (
                <button onClick={() => setVisibleCount((count) => count + 40)} className="mx-auto mt-5 block rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
                  Показать ещё
                </button>
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

            <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Структура ответа</p>
              <ol className="grid gap-2 text-sm text-slate-700 sm:grid-cols-5">
                {["Определение", "Механизм", "Пример", "Ограничения", "Trade-off"].map((item, index) => (
                  <li key={item} className="flex items-center gap-2 sm:block">
                    <span className="mr-1 inline-grid size-5 place-items-center rounded-full bg-white text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">{index + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
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
