export type Level = "Основа" | "Middle" | "Senior";

export type Topic = {
  id: string;
  title: string;
  description: string;
  level: Level;
  minutes: number;
  questions: string[];
};

export type Module = {
  id: string;
  number: string;
  title: string;
  description: string;
  accent: string;
  topics: Topic[];
};

export const modules: Module[] = [
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
  {
    id: "devops",
    number: "09",
    title: "DevOps для frontend",
    description: "CI/CD, Docker, автоматизация релизов и эксплуатация frontend",
    accent: "#f59e0b",
    topics: [
      { id: "cicd", title: "Основы CI/CD", description: "Pipeline, quality gates, artifacts, environments и автоматизация доставки.", level: "Основа", minutes: 42, questions: ["Чем CI отличается от CD?", "Из каких стадий состоит pipeline?", "Что такое artifact?"] },
      { id: "docker", title: "Docker для frontend", description: "Images, containers, Dockerfile, multi-stage build и nginx.", level: "Middle", minutes: 48, questions: ["Image или container?", "Зачем нужен multi-stage build?", "Как кэшируются Docker layers?"] },
      { id: "ci-platforms", title: "GitHub Actions и GitLab CI", description: "Workflow, jobs, runners, secrets, cache и переиспользуемые pipelines.", level: "Middle", minutes: 52, questions: ["Что такое runner?", "Как передавать artifacts между jobs?", "Как защитить secrets?"] },
      { id: "delivery", title: "Деплой и эксплуатация", description: "Preview environments, canary, rollback, observability и безопасные релизы.", level: "Senior", minutes: 55, questions: ["Blue-green или canary?", "Rollback или roll-forward?", "Какие метрики проверять после релиза?"] },
    ],
  },
  {
    id: "api",
    number: "10",
    title: "API, HTTP и сети",
    description: "Проектирование API, HTTP, интернет-протоколы и real-time соединения",
    accent: "#14b8a6",
    topics: [
      { id: "api-design", title: "Проектирование API", description: "REST, GraphQL, контракты, версионирование, ошибки и устойчивый клиент.", level: "Middle", minutes: 50, questions: ["Что делает API RESTful?", "REST или GraphQL?", "Как версионировать контракт?"] },
      { id: "http-cache", title: "HTTP и кэширование", description: "Методы, статусы, headers, cookies, CORS, Cache-Control и ETag.", level: "Middle", minutes: 55, questions: ["Safe и idempotent методы?", "Как работает CORS?", "no-cache или no-store?"] },
      { id: "internet-protocols", title: "Как работает интернет", description: "DNS, IP, TCP, TLS, HTTP/2, HTTP/3, QUIC, proxy и CDN.", level: "Senior", minutes: 65, questions: ["Как проходит пакет до сервера?", "Как работает TLS 1.3?", "Зачем нужен QUIC?"] },
      { id: "realtime", title: "WebSocket и real-time", description: "WebSocket, SSE, polling, heartbeat, reconnect, delivery и масштабирование.", level: "Senior", minutes: 52, questions: ["WebSocket или SSE?", "Как реализовать reconnect?", "Как масштабировать соединения?"] },
    ],
  },
];

export const allTopics = modules.flatMap((module) =>
  module.topics.map((topic) => ({ ...topic, module: module.title, accent: module.accent }))
);
