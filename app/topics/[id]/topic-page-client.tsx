"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAnswer } from "../../answers";
import { interviewQuestions, type InterviewQuestion } from "../../questions";
import type { Module, Topic } from "../../topics";
import ThemeToggle from "../../theme-toggle";

type TopicWithModule = Topic & { module: string; accent: string };

const topicMatchers: Record<string, RegExp> = {
  semantic: /семантик|section|article|doctype|поток документа|data-атрибут/i,
  forms: /форм|input|label|валидац/i,
  a11y: /accessib|ARIA|tabindex|клавиатур|фокус/i,
  seo: /SEO|meta|индексац|structured data|canonical/i,
  cascade: /каскад|специфич|наследован|@layer/i,
  layout: /Flexbox|Grid|layout|BFC|position|stacking|z-index|margin/i,
  responsive: /адаптив|container query|media query|srcset|clamp|responsive/i,
  "rendering-css": /paint|composite|will-change|анимир|производительност.*CSS/i,
  types: /тип данных|typeof|null|undefined|NaN|==|falsy|преобразован/i,
  scope: /scope|замыкан|closure|this|var|let|const|hoisting|bind/i,
  async: /Event Loop|Promise|async|await|microtask|task queue|AbortController|Worker|race condition/i,
  prototype: /прототип|prototype|class|new|Object.create/i,
  memory: /памят|garbage|утеч|WeakMap|detached DOM|hidden class/i,
  "ts-base": /структурн.*тип|interface|type alias|unknown|never|narrowing|union|satisfies/i,
  generics: /generic|keyof|Record|overload|variance/i,
  "advanced-ts": /conditional|mapped|infer|utility|branded|declaration|module augmentation/i,
  "react-model": /декларатив|props|state|render|commit|reconciliation|keys|batching|controlled/i,
  hooks: /hook|useEffect|useLayoutEffect|useRef|useMemo|useCallback|stale closure/i,
  state: /управлен.*состоян|state manager|Context|useReducer|Redux|Pinia|server state|URL state/i,
  "react-performance": /производительност.*React|Fiber|transition|virtualiz|Profiler|memoization|Compiler/i,
  "react-architecture": /архитектур.*React|Server Component|compound|Suspense|Error Boundary|hydration|Actions/i,
  network: /HTTP|DNS|TCP|TLS|CORS|Cache-Control|cookie|WebSocket|SSE|REST|GraphQL/i,
  rendering: /rendering path|DOM|CSSOM|layout|paint|composit|ввода URL|requestAnimationFrame/i,
  storage: /localStorage|sessionStorage|IndexedDB|Cache API|Service Worker|хранен/i,
  security: /XSS|CSRF|CSP|безопас|JWT|OAuth|WebAuthn|Access Control|injection/i,
  testing: /тест|mock|flaky|coverage|snapshot|E2E|contract/i,
  git: /Git|rebase|merge|cherry-pick|reflog/i,
  bundlers: /сборщик|ESM|CommonJS|tree shaking|code splitting|bundle|HMR/i,
  "web-vitals": /LCP|INP|CLS|Web Vitals|performance budget|Long Task|preload|RUM/i,
  patterns: /паттерн|Observer|Strategy|Adapter|Factory|Singleton/i,
  "frontend-system": /System Design|спроектировать|pagination|offline|collaborative|dashboard|чат/i,
  microfrontends: /микрофронтенд|Module Federation/i,
  decisions: /решени|trade-off|ADR|техническ.*долг|миграц|оцен/i,
  cicd: /CI\/CD|pipeline|artifact|quality gate|окружен/i,
  docker: /Docker|container|image|Dockerfile|layer|nginx/i,
  "ci-platforms": /GitHub Actions|GitLab CI|runner|workflow|job|secret/i,
  delivery: /депло|rollout|rollback|canary|blue-green|observability|релиз/i,
};

const moduleCategories: Record<string, RegExp> = {
  html: /HTML и доступность/,
  css: /^CSS$/,
  javascript: /JavaScript|Асинхронность/,
  typescript: /TypeScript/,
  react: /React|Redux/,
  browser: /Браузер|Сеть|Безопасность/,
  quality: /Тестирование|Performance|Инженерные/,
  architecture: /Архитектура|System Design|Инженерные/,
  devops: /DevOps|CI\/CD|Docker|GitHub Actions|GitLab CI|Деплой/,
};

function questionsForTopic(topic: Topic, module: Module): InterviewQuestion[] {
  const matcher = topicMatchers[topic.id];
  const categoryMatcher = moduleCategories[module.id];
  const exact = interviewQuestions.filter((item) => matcher?.test(item.question));
  const related = interviewQuestions.filter((item) => categoryMatcher?.test(item.category) && !exact.some((question) => question.id === item.id));
  return [...exact, ...related].slice(0, 30);
}

function levelClass(level: string) {
  if (level === "Senior") return "border-violet-200 bg-violet-50 text-violet-700";
  if (level === "Middle") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

export default function TopicPageClient({ topic, module }: { topic: TopicWithModule; module: Module }) {
  const [openAnswers, setOpenAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const questions = useMemo(() => questionsForTopic(topic, module), [topic, module]);

  useEffect(() => {
    const saved = JSON.parse(window.localStorage.getItem("frontend-base-progress") ?? "[]") as string[];
    setCompleted(saved.includes(topic.id));
  }, [topic.id]);

  const toggleAnswer = (id: string) => {
    setOpenAnswers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleCompleted = () => {
    const saved = JSON.parse(window.localStorage.getItem("frontend-base-progress") ?? "[]") as string[];
    const nextCompleted = !saved.includes(topic.id);
    const next = nextCompleted ? [...saved, topic.id] : saved.filter((id) => id !== topic.id);
    window.localStorage.setItem("frontend-base-progress", JSON.stringify(next));
    setCompleted(nextCompleted);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-md bg-slate-950 font-mono text-xs text-white">&lt;/&gt;</span>
            Frontend Base
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-950">Все темы</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500" aria-label="Хлебные крошки">
          <Link href="/" className="hover:text-slate-900">Темы</Link>
          <span>/</span>
          <span>{module.title}</span>
          <span>/</span>
          <span className="text-slate-900">{topic.title}</span>
        </nav>

        <section className="mb-10 border-b border-slate-200 pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-md border px-2 py-1 text-[10px] font-medium ${levelClass(topic.level)}`}>{topic.level}</span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">{topic.minutes} минут</span>
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">{questions.length} вопросов</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{topic.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{topic.description}</p>
          <button
            onClick={toggleCompleted}
            className={`mt-6 rounded-lg px-4 py-2 text-sm font-medium ${completed ? "bg-emerald-100 text-emerald-800" : "bg-slate-950 text-white hover:bg-slate-800"}`}
          >
            {completed ? "✓ Тема пройдена" : "Отметить тему пройденной"}
          </button>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold">Основные вопросы темы</h2>
          <p className="mt-1 text-sm text-slate-500">Сначала сформулируйте ответ самостоятельно, затем откройте разбор.</p>

          <div className="mt-5 space-y-3">
            {questions.map((item, index) => {
              const isOpen = openAnswers.includes(item.id);
              const answer = getAnswer(item);
              return (
                <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <button onClick={() => toggleAnswer(item.id)} className="flex w-full items-start gap-3 p-4 text-left hover:bg-slate-50 sm:p-5">
                    <span className="mt-0.5 font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-sm font-medium leading-6">{item.question}</span>
                    <span className={`mt-1 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
                      <p className="text-sm font-medium leading-6">{answer.short}</p>
                      <ul className="mt-4 space-y-2">
                        {answer.points.map((point) => (
                          <li key={point} className="flex gap-2 text-sm leading-6 text-slate-600">
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                          <p className="mb-1 text-xs font-semibold text-slate-500">Пример</p>
                          <p className="text-sm leading-6 text-slate-700">{answer.example}</p>
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <p className="mb-1 text-xs font-semibold text-amber-700">Важно</p>
                          <p className="text-sm leading-6 text-slate-700">{answer.caveat}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-200 pt-6">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-950">← Вернуться к темам</Link>
          <span className="text-xs text-slate-400">{module.title}</span>
        </footer>
      </main>
    </div>
  );
}
