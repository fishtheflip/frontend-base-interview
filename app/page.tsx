"use client";

import { useEffect, useMemo, useState } from "react";
import { interviewQuestions, questionCategories } from "./questions";

type Level = "Основа" | "Middle" | "Senior";

type Topic = {
  id: string;
  title: string;
  description: string;
  level: Level;
  minutes: number;
  questions: string[];
};

type Module = {
  id: string;
  number: string;
  title: string;
  description: string;
  accent: string;
  topics: Topic[];
};

const modules: Module[] = [
  {
    id: "html",
    number: "01",
    title: "HTML и доступность",
    description: "Семантика, формы, SEO и интерфейсы для всех",
    accent: "#f97316",
    topics: [
      { id: "semantic", title: "Семантическая разметка", description: "Поток документа, landmark-элементы и правильная структура страницы.", level: "Основа", minutes: 18, questions: ["Зачем нужны семантические теги?", "Когда использовать section, а когда article?", "Что такое accessibility tree?"] },
      { id: "forms", title: "Формы и валидация", description: "Label, типы input, нативная валидация и UX ошибок.", level: "Основа", minutes: 22, questions: ["Почему placeholder не заменяет label?", "Как работает constraint validation API?", "Что важно для доступной ошибки формы?"] },
      { id: "a11y", title: "Accessibility и ARIA", description: "WCAG, управление фокусом, клавиатура и ARIA-паттерны.", level: "Middle", minutes: 32, questions: ["Первое правило ARIA?", "Как организовать focus trap?", "Чем aria-label отличается от aria-labelledby?"] },
      { id: "seo", title: "SEO и метаданные", description: "Индексация, метатеги, structured data и социальные карточки.", level: "Middle", minutes: 20, questions: ["Что влияет на индексацию SPA?", "Зачем нужен canonical?", "Что такое structured data?"] },
    ],
  },
  {
    id: "css",
    number: "02",
    title: "CSS и интерфейсы",
    description: "Layout, адаптивность, анимации и архитектура стилей",
    accent: "#3b82f6",
    topics: [
      { id: "cascade", title: "Каскад и специфичность", description: "Origins, layers, inheritance, specificity и область видимости.", level: "Основа", minutes: 25, questions: ["Как вычисляется специфичность?", "Что делает @layer?", "Какие свойства наследуются?"] },
      { id: "layout", title: "Flexbox и Grid", description: "Одномерные и двумерные раскладки без магии.", level: "Основа", minutes: 35, questions: ["Когда Grid лучше Flexbox?", "Как работает minmax()?", "Почему flex-элемент не сжимается?"] },
      { id: "responsive", title: "Адаптивный дизайн", description: "Container queries, fluid type, mobile-first и responsive images.", level: "Middle", minutes: 30, questions: ["Media или container query?", "Что такое intrinsic design?", "Как работает srcset?"] },
      { id: "rendering-css", title: "Производительность CSS", description: "Layout, paint, composite и дешёвые анимации.", level: "Senior", minutes: 28, questions: ["Какие свойства вызывают layout?", "Почему transform дешевле top?", "Что делает will-change?"] },
    ],
  },
  {
    id: "javascript",
    number: "03",
    title: "JavaScript",
    description: "Язык, асинхронность, память и внутренние механизмы",
    accent: "#eab308",
    topics: [
      { id: "types", title: "Типы и преобразования", description: "Primitive, reference, equality, coercion и частые ловушки.", level: "Основа", minutes: 35, questions: ["Чем == отличается от ===?", "Почему typeof null — object?", "Что хранится в переменной объекта?"] },
      { id: "scope", title: "Scope, closure и this", description: "Лексическое окружение, замыкания и правила привязки this.", level: "Middle", minutes: 42, questions: ["Что хранит замыкание?", "Как определяется this?", "Чем var отличается от let?"] },
      { id: "async", title: "Event Loop и асинхронность", description: "Call stack, задачи, микрозадачи, Promise и async/await.", level: "Middle", minutes: 48, questions: ["Что выполнится раньше: timeout или Promise?", "Как работает async/await?", "Что может заблокировать event loop?"] },
      { id: "prototype", title: "Прототипы и классы", description: "Prototype chain, наследование и синтаксический сахар class.", level: "Middle", minutes: 38, questions: ["Как работает prototype chain?", "Что делает new?", "Чем class отличается от функции-конструктора?"] },
      { id: "memory", title: "Память и Garbage Collector", description: "Reachability, утечки памяти, WeakMap и профилирование.", level: "Senior", minutes: 36, questions: ["Как GC определяет мусор?", "Когда полезен WeakMap?", "Какие бывают утечки в браузере?"] },
    ],
  },
  {
    id: "typescript",
    number: "04",
    title: "TypeScript",
    description: "Типизация от основ до продвинутых utility-типов",
    accent: "#3178c6",
    topics: [
      { id: "ts-base", title: "Система типов", description: "Structural typing, inference, unions и narrowing.", level: "Основа", minutes: 32, questions: ["Что такое structural typing?", "Как работает narrowing?", "any или unknown?"] },
      { id: "generics", title: "Generics", description: "Ограничения, параметры типов и переиспользуемые контракты.", level: "Middle", minutes: 38, questions: ["Зачем нужны generics?", "Что означает extends в generic?", "Как вывести тип аргумента?"] },
      { id: "advanced-ts", title: "Продвинутые типы", description: "Conditional, mapped, template literal types и infer.", level: "Senior", minutes: 48, questions: ["Как работает conditional type?", "Что делает infer?", "Как устроен Partial?"] },
    ],
  },
  {
    id: "react",
    number: "05",
    title: "React",
    description: "Рендеринг, хуки, состояние и архитектура приложений",
    accent: "#06b6d4",
    topics: [
      { id: "react-model", title: "Модель React", description: "Декларативный UI, render/commit, reconciliation и keys.", level: "Основа", minutes: 40, questions: ["Что запускает рендер?", "Зачем нужны keys?", "Чем render отличается от commit?"] },
      { id: "hooks", title: "Хуки без ловушек", description: "State, effect, ref, memo и правила зависимостей.", level: "Middle", minutes: 52, questions: ["Когда не нужен useEffect?", "Что хранит useRef?", "Почему stale closure опасен?"] },
      { id: "state", title: "Управление состоянием", description: "Локальное, серверное, URL-состояние и state machines.", level: "Middle", minutes: 42, questions: ["Где должно жить состояние?", "Server state или client state?", "Когда нужен reducer?"] },
      { id: "react-performance", title: "Производительность React", description: "Профилирование, memoization, transitions и virtualization.", level: "Senior", minutes: 45, questions: ["Когда React.memo бесполезен?", "Что решает virtualization?", "Как найти дорогой рендер?"] },
      { id: "react-architecture", title: "Архитектура React", description: "Composition, feature slices, boundaries и дизайн API компонентов.", level: "Senior", minutes: 50, questions: ["Composition или inheritance?", "Что такое compound components?", "Как разделить feature и shared код?"] },
    ],
  },
  {
    id: "browser",
    number: "06",
    title: "Браузер и сеть",
    description: "От URL до пикселя: HTTP, DOM, rendering и storage",
    accent: "#8b5cf6",
    topics: [
      { id: "network", title: "HTTP и сеть", description: "DNS, TCP, TLS, HTTP/2–3, caching и CORS.", level: "Middle", minutes: 50, questions: ["Что происходит после ввода URL?", "Как работает CORS?", "Для чего нужен Cache-Control?"] },
      { id: "rendering", title: "Critical Rendering Path", description: "DOM, CSSOM, render tree, layout, paint и compositor.", level: "Middle", minutes: 44, questions: ["Как браузер строит страницу?", "Что блокирует рендеринг?", "Что такое compositing layer?"] },
      { id: "storage", title: "Хранение данных", description: "Cookie, Web Storage, IndexedDB и Cache API.", level: "Middle", minutes: 28, questions: ["Cookie или localStorage?", "Когда нужен IndexedDB?", "Что такое SameSite?"] },
      { id: "security", title: "Web-безопасность", description: "XSS, CSRF, CSP, clickjacking и безопасная аутентификация.", level: "Senior", minutes: 48, questions: ["Как предотвратить XSS?", "CSRF и SameSite?", "Что ограничивает CSP?"] },
    ],
  },
  {
    id: "quality",
    number: "07",
    title: "Качество и инструменты",
    description: "Git, тесты, сборка и надёжная разработка",
    accent: "#10b981",
    topics: [
      { id: "testing", title: "Тестирование", description: "Unit, integration, E2E, test pyramid и хорошие assertions.", level: "Middle", minutes: 44, questions: ["Что лучше не мокать?", "Unit или integration?", "Как избежать flaky-тестов?"] },
      { id: "git", title: "Git для разработчика", description: "История, rebase, merge, cherry-pick и восстановление.", level: "Основа", minutes: 30, questions: ["Merge или rebase?", "Что делает cherry-pick?", "Как работает reflog?"] },
      { id: "bundlers", title: "Сборщики и модули", description: "ESM, bundling, tree shaking, code splitting и HMR.", level: "Middle", minutes: 40, questions: ["CJS или ESM?", "Как работает tree shaking?", "Что такое code splitting?"] },
      { id: "web-vitals", title: "Web Performance", description: "Core Web Vitals, budgets, profiling и оптимизация загрузки.", level: "Senior", minutes: 46, questions: ["Что измеряют LCP, INP и CLS?", "Как найти bottleneck?", "Что такое performance budget?"] },
    ],
  },
  {
    id: "architecture",
    number: "08",
    title: "Архитектура и System Design",
    description: "Масштабируемый frontend и инженерные решения",
    accent: "#ec4899",
    topics: [
      { id: "patterns", title: "Паттерны проектирования", description: "Observer, strategy, adapter, factory и практическое применение.", level: "Middle", minutes: 36, questions: ["Когда полезен Observer?", "Что решает Adapter?", "Почему Singleton часто вреден?"] },
      { id: "frontend-system", title: "Frontend System Design", description: "Требования, API, данные, offline, performance и observability.", level: "Senior", minutes: 55, questions: ["Как спроектировать ленту?", "Что кэшировать на клиенте?", "Как заложить observability?"] },
      { id: "microfrontends", title: "Микрофронтенды", description: "Границы команд, интеграция, Module Federation и trade-offs.", level: "Senior", minutes: 38, questions: ["Когда нужны микрофронтенды?", "Как разделить зависимости?", "Какие есть способы интеграции?"] },
      { id: "decisions", title: "Инженерные решения", description: "Trade-offs, ADR, оценка рисков и защита решения на интервью.", level: "Senior", minutes: 32, questions: ["Как аргументировать trade-off?", "Что входит в ADR?", "Как оценить стоимость миграции?"] },
    ],
  },
];

const allTopics = modules.flatMap((module) =>
  module.topics.map((topic) => ({ ...topic, module: module.title, accent: module.accent }))
);

const levelOptions: Array<"Все" | Level> = ["Все", "Основа", "Middle", "Senior"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<"Все" | Level>("Все");
  const [completed, setCompleted] = useState<string[]>([]);
  const [selected, setSelected] = useState<(typeof allTopics)[number] | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [questionCategory, setQuestionCategory] = useState("Все категории");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [visibleQuestionCount, setVisibleQuestionCount] = useState(24);

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
    const normalized = query.trim().toLowerCase();
    return modules
      .map((module) => ({
        ...module,
        topics: module.topics.filter((topic) => {
          const matchesLevel = level === "Все" || topic.level === level;
          const matchesQuery =
            !normalized ||
            topic.title.toLowerCase().includes(normalized) ||
            topic.description.toLowerCase().includes(normalized) ||
            module.title.toLowerCase().includes(normalized);
          return matchesLevel && matchesQuery;
        }),
      }))
      .filter((module) => module.topics.length > 0);
  }, [query, level]);

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return interviewQuestions.filter((item) => {
      const matchesCategory = questionCategory === "Все категории" || item.category === questionCategory;
      const matchesLevel = level === "Все" || (level === "Основа" ? item.level === "Junior" : item.level === level);
      const matchesQuery =
        !normalized ||
        item.question.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized);
      return matchesCategory && matchesLevel && matchesQuery;
    });
  }, [query, level, questionCategory]);

  const progress = Math.round((completed.length / allTopics.length) * 100);
  const nextTopic = allTopics.find((topic) => !completed.includes(topic.id)) ?? allTopics[0];
  const totalMinutes = allTopics.reduce((sum, topic) => sum + topic.minutes, 0);

  const openTopic = (topic: (typeof allTopics)[number]) => {
    setSelected(topic);
    setQuestionIndex(0);
    setAnswerVisible(false);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Frontend Base — наверх">
          <span className="brand-mark">&lt;/&gt;</span>
          <span>FRONTEND<br /><b>BASE</b></span>
        </a>

        <nav className="main-nav" aria-label="Основная навигация">
          <a className="nav-link active" href="#modules"><span>⌂</span> База знаний</a>
          <a className="nav-link" href="#questions"><span>?</span> Все вопросы</a>
          <button className="nav-link" onClick={() => setShowPractice(true)}><span>◎</span> Практика</button>
          <a className="nav-link" href="#plan"><span>✓</span> Мой прогресс</a>
        </nav>

        <div className="sidebar-plan" id="plan">
          <p>ТВОЙ ПРОГРЕСС</p>
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{progress}%</strong><span>{completed.length}/{allTopics.length}</span></div>
          </div>
          <span>{progress === 100 ? "База пройдена!" : "Продолжай — всё получится"}</span>
        </div>

        <p className="sidebar-foot">Сделано для тех, кто<br />хочет понимать, а не зубрить.</p>
      </aside>

      <section className="content" id="top">
        <header className="topbar">
          <div className="search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Найти тему, технологию или вопрос..."
              aria-label="Поиск по базе знаний"
            />
            <kbd>⌘ K</kbd>
          </div>
          <button className="practice-button" onClick={() => setShowPractice(true)}>
            <span>▶</span> Начать практику
          </button>
        </header>

        <div className="page">
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">ТВОЯ СИСТЕМА ПОДГОТОВКИ</p>
              <h1>Знай не ответы.<br /><em>Понимай систему.</em></h1>
              <p className="hero-description">
                Полная карта знаний frontend-разработчика: от семантики HTML до архитектурных решений.
                Коротко, глубоко и по делу.
              </p>
              <div className="hero-actions">
                <button onClick={() => openTopic(nextTopic)}>Продолжить обучение <span>→</span></button>
                <a href="#modules">Посмотреть все темы</a>
              </div>
            </div>

            <div className="today-card">
              <p>СЕГОДНЯ В ПЛАНЕ</p>
              <div className="today-topic">
                <span style={{ background: nextTopic.accent }}>{nextTopic.module.slice(0, 2).toUpperCase()}</span>
                <div>
                  <small>{nextTopic.module}</small>
                  <strong>{nextTopic.title}</strong>
                </div>
              </div>
              <div className="today-meta">
                <span>◷ {nextTopic.minutes} минут</span>
                <span>{nextTopic.level}</span>
              </div>
              <button onClick={() => openTopic(nextTopic)}>Открыть тему <span>↗</span></button>
            </div>
          </section>

          <section className="stats" aria-label="Статистика базы">
            <div><strong>{modules.length}</strong><span>направлений</span></div>
            <div><strong>{allTopics.length}</strong><span>ключевых тем</span></div>
            <div><strong>{interviewQuestions.length}</strong><span>вопросов</span></div>
            <div><strong>{Math.round(totalMinutes / 60)}</strong><span>часов материала</span></div>
          </section>

          <section className="knowledge" id="modules">
            <div className="section-heading">
              <div>
                <p className="eyebrow">КАРТА ЗНАНИЙ</p>
                <h2>Что нужно знать frontend-разработчику</h2>
              </div>
              <div className="filters" aria-label="Фильтр по уровню">
                {levelOptions.map((option) => (
                  <button key={option} className={level === option ? "selected" : ""} onClick={() => setLevel(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="module-list">
              {filteredModules.map((module) => {
                const done = module.topics.filter((topic) => completed.includes(topic.id)).length;
                return (
                  <article className="module-card" key={module.id} style={{ "--accent": module.accent } as React.CSSProperties}>
                    <div className="module-number">{module.number}</div>
                    <div className="module-content">
                      <div className="module-title">
                        <div>
                          <h3>{module.title}</h3>
                          <p>{module.description}</p>
                        </div>
                        <span>{done}/{module.topics.length}</span>
                      </div>
                      <div className="topic-list">
                        {module.topics.map((topic) => (
                          <button className="topic-row" key={topic.id} onClick={() => openTopic({ ...topic, module: module.title, accent: module.accent })}>
                            <span
                              className={`check ${completed.includes(topic.id) ? "done" : ""}`}
                              onClick={(event) => { event.stopPropagation(); toggleComplete(topic.id); }}
                              role="checkbox"
                              aria-checked={completed.includes(topic.id)}
                              aria-label={`Отметить тему «${topic.title}» пройденной`}
                            >✓</span>
                            <span className="topic-copy"><strong>{topic.title}</strong><small>{topic.description}</small></span>
                            <span className={`level level-${topic.level.toLowerCase()}`}>{topic.level}</span>
                            <span className="topic-arrow">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredModules.length === 0 && (
              <div className="empty-state">
                <strong>Ничего не найдено</strong>
                <p>Попробуй изменить запрос или выбрать другой уровень.</p>
                <button onClick={() => { setQuery(""); setLevel("Все"); }}>Сбросить фильтры</button>
              </div>
            )}
          </section>

          <section className="question-bank" id="questions">
            <div className="question-bank-head">
              <div>
                <p className="eyebrow">ИНТЕРВЬЮ-БАНК</p>
                <h2>{interviewQuestions.length} вопросов, которые действительно задают</h2>
                <p>От короткой проверки базы до глубокого архитектурного разговора. Отвечай вслух и всегда называй практический пример и trade-off.</p>
              </div>
              <button onClick={() => setShowPractice(true)}>Случайный вопрос <span>↗</span></button>
            </div>

            <div className="category-strip" aria-label="Категория вопросов">
              {["Все категории", ...questionCategories].map((category) => (
                <button
                  key={category}
                  className={questionCategory === category ? "active" : ""}
                  onClick={() => { setQuestionCategory(category); setVisibleQuestionCount(24); }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="question-summary">
              <span>Найдено: <b>{filteredQuestions.length}</b></span>
              <span className="difficulty-key"><i className="junior-dot" /> Junior <i className="middle-dot" /> Middle <i className="senior-dot" /> Senior</span>
            </div>

            <div className="question-grid">
              {filteredQuestions.slice(0, visibleQuestionCount).map((item, index) => (
                <article className="question-card" key={item.id}>
                  <div className="question-card-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`question-level ${item.level.toLowerCase()}`}>{item.level}</span>
                  </div>
                  <h3>{item.question}</h3>
                  <p>{item.category}</p>
                  <button onClick={() => {
                    setPracticeIndex(interviewQuestions.findIndex((question) => question.id === item.id));
                    setShowPractice(true);
                  }}>Ответить в режиме практики →</button>
                </article>
              ))}
            </div>

            {visibleQuestionCount < filteredQuestions.length && (
              <button className="load-more" onClick={() => setVisibleQuestionCount((count) => count + 24)}>
                Показать ещё 24 вопроса
              </button>
            )}
          </section>
        </div>
      </section>

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <article className="topic-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="topic-title">
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Закрыть">×</button>
            <p className="modal-kicker" style={{ color: selected.accent }}>{selected.module} · {selected.level}</p>
            <h2 id="topic-title">{selected.title}</h2>
            <p className="modal-description">{selected.description}</p>
            <div className="lesson-block">
              <p>НА СОБЕСЕДОВАНИИ</p>
              <h3>{selected.questions[questionIndex]}</h3>
              {answerVisible ? (
                <div className="answer">
                  Строй ответ от определения к механизму работы, затем приведи практический пример и назови один важный trade-off.
                  Интервьюеру важна логика рассуждения, а не заученная формулировка.
                </div>
              ) : (
                <button className="show-answer" onClick={() => setAnswerVisible(true)}>Показать структуру ответа</button>
              )}
            </div>
            <div className="modal-actions">
              <button
                className={completed.includes(selected.id) ? "completed" : ""}
                onClick={() => toggleComplete(selected.id)}
              >
                {completed.includes(selected.id) ? "✓ Тема пройдена" : "Отметить пройденной"}
              </button>
              <button
                onClick={() => {
                  setQuestionIndex((current) => (current + 1) % selected.questions.length);
                  setAnswerVisible(false);
                }}
              >Следующий вопрос →</button>
            </div>
          </article>
        </div>
      )}

      {showPractice && (
        <div className="modal-backdrop" onMouseDown={() => setShowPractice(false)}>
          <article className="practice-modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="practice-title">
            <button className="modal-close" onClick={() => setShowPractice(false)} aria-label="Закрыть">×</button>
            <p className="modal-kicker">РЕЖИМ ПРАКТИКИ</p>
            <h2 id="practice-title">Проверь себя без подсказок</h2>
            <p>Случайный вопрос из всей базы. Сформулируй ответ вслух за 2–3 минуты, как на настоящем интервью.</p>
            <div className="practice-meta">
              <span>{interviewQuestions[practiceIndex % interviewQuestions.length].category}</span>
              <span>{interviewQuestions[practiceIndex % interviewQuestions.length].level}</span>
            </div>
            <div className="practice-question">
              {interviewQuestions[practiceIndex % interviewQuestions.length].question}
            </div>
            <div className="answer-formula">
              <strong>Формула сильного ответа</strong>
              <span>Определение → механизм → пример → ограничения → trade-off</span>
            </div>
            <button
              className="practice-next"
              onClick={() => setPracticeIndex((current) => (current * 73 + 41) % interviewQuestions.length)}
            >Другой вопрос →</button>
          </article>
        </div>
      )}
    </main>
  );
}
