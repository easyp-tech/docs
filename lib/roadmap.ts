import type { AppLocale } from './i18n'

/**
 * The public roadmap. Statuses were checked against releases and merged PRs on
 * 2026-11-19: "shipped" means in a published release, "now" means being worked
 * on or merged but not yet released. Order inside "next" is the order of work;
 * there are no dates on purpose.
 */

export type Product = 'cli' | 'service' | 'mcp' | 'agents'

export interface Item {
  title: string
  body?: string
}

export interface Track {
  product: Product
  tagline: string
  now: Item[]
  /** Shown in the Now lane when it is empty. */
  nowNote?: string
  next: Item[]
}

export interface Milestone {
  date: string
  product: Product
  version?: string
  title: string
  body: string
  url?: string
}

const SERVICE_RELEASE = 'https://github.com/easyp-tech/service/releases/tag/'

const en = {
  metaTitle: 'Roadmap',
  metaDescription:
    'What EasyP has shipped and what comes next: the easyp CLI, the plugin service and plugins.easyp.tech, protoc-gen-mcp and AI agent integrations.',
  title: 'Roadmap.',
  titleHighlight: 'Shipped, now, next.',
  subtitle:
    'What we have released, what we are working on, and the order of what comes after. Plans carry no dates — only order, and only what we intend to build.',
  legend: { shipped: 'Shipped', now: 'Now', next: 'Next', notPlanned: 'Not planned' },
  laneEmpty: 'Nothing in this lane right now.',
  products: {
    cli: 'easyp CLI',
    service: 'Plugin service',
    mcp: 'protoc-gen-mcp',
    agents: 'AI agents',
  } satisfies Record<Product, string>,
  shippedTitle: 'Shipped',
  shippedBody: 'Released and available today, newest first.',
  shipped: [
    {
      date: '2026-11-19',
      product: 'service',
      version: 'v1.3.2',
      title: 'latest means the newest version',
      body: 'latest now picks the highest version compared as numbers (v1.36.11 over v1.36.9). The MCP endpoint reports the running release and returns lowerCamelCase fields throughout.',
      url: `${SERVICE_RELEASE}v1.3.2`,
    },
    {
      date: '2026-11-14',
      product: 'mcp',
      version: 'v1.0.0',
      title: 'protoc-gen-mcp 1.0',
      body: 'Go on the official MCP Go SDK; Python, TypeScript, Java and Kotlin at parity with it. Tools, resources and prompts in every language, OAuth for HTTP servers, MCP Apps UI metadata.',
      url: 'https://github.com/easyp-tech/protoc-gen-mcp/releases/tag/v1.0.0',
    },
    {
      date: '2026-11-10',
      product: 'service',
      title: 'Public plugin registry: plugins.easyp.tech',
      body: '80 plugins and 1,700+ versions — Go, gRPC, Connect, TypeScript, Python, Java, Rust, Swift and more — ready to use from easyp.yaml without installing anything.',
    },
    {
      date: '2026-10-30',
      product: 'service',
      version: 'v1.3.0',
      title: 'Reproducible plugin packs',
      body: 'The same plugin always packs to the same bytes, and plugins are built for the platform the service runs on.',
      url: `${SERVICE_RELEASE}v1.3.0`,
    },
    {
      date: '2026-10-24',
      product: 'service',
      version: 'v1.2.0',
      title: 'Helm StatefulSet and one-pass publishing',
      body: 'Each replica gets its own plugin cache volume; plugins publish builds, verifies, uploads and registers in a single pass.',
      url: `${SERVICE_RELEASE}v1.2.0`,
    },
    {
      date: '2026-10-05',
      product: 'cli',
      version: 'v1 preview',
      title: 'easyp v1 nightly builds',
      body: 'New config (protobuf.mod / protobuf.lock, nested Git modules, replace), migrate from v0, get, mod tidy, descriptor-based breaking checks, EASYP_PROXY.',
      url: 'https://github.com/easyp-tech/easyp/releases',
    },
    {
      date: '2026-10-05',
      product: 'service',
      version: 'v1.1.0',
      title: 'Interpreted plugins run anywhere',
      body: '22 plugins built on Python, Node or the JVM became relocatable bundles, verified when they are built.',
      url: `${SERVICE_RELEASE}v1.1.0`,
    },
    {
      date: '2026-09-27',
      product: 'mcp',
      title: 'protoc-gen-mcp in awesome-go',
      body: 'Listed in the awesome-go catalogue.',
      url: 'https://github.com/avelino/awesome-go/pull/6715',
    },
    {
      date: '2026-09-14',
      product: 'service',
      version: 'v1.0.0',
      title: 'Plugin service 1.0',
      body: 'First stable release: remote code generation over gRPC with a frozen API contract, a Go SDK, and community and enterprise tiers.',
      url: `${SERVICE_RELEASE}v1.0.0`,
    },
  ] satisfies Milestone[],
  aheadTitle: 'Now and next',
  aheadBody: 'Per product: what is in progress, then what follows, in order.',
  tracks: [
    {
      product: 'cli',
      tagline: 'A drop-in buf replacement',
      now: [
        {
          title: 'easyp 1.0 stable',
          body: 'The v1 configuration and commands from the nightlies, as a stable release.',
        },
        { title: 'breaking — the same findings as buf', body: 'Including positions.' },
        { title: 'easyp build', body: 'Compile to descriptor sets without a generate config.' },
        { title: 'easyp format', body: '-w, --diff, --exit-code, --stdin-filepath.' },
        {
          title: 'easyp migrate --from-buf',
          body: 'buf.yaml, buf.gen.yaml and buf.lock to easyp configs in one command.',
        },
        {
          title: 'Compatibility checked every night',
          body: 'Against the latest buf and protoc; editions 2023 and 2024; Windows in CI.',
        },
      ],
      next: [
        {
          title: 'Language server',
          body: 'Diagnostics, go to definition, hover, formatting; then completion, references, rename.',
        },
        { title: 'VS Code extension, then JetBrains plugin' },
        { title: 'Only what changed', body: '--changed-since for lint, generate, breaking, build and format.' },
        { title: 'easyp changelog', body: 'API changes between two refs as Markdown, and as a PR comment.' },
        { title: 'easyp mod outdated and easyp docs' },
        { title: 'easyp init --from-protoc', body: 'Turn a protoc command line into an easyp config.' },
        {
          title: 'More commands',
          body: 'config ls-lint-rules, PROTOVALIDATE rule, mod graph, export, stats, convert, source edit deprecate, custom rules as wasm plugins.',
        },
      ],
    },
    {
      product: 'service',
      tagline: 'Your plugins, run for you',
      now: [
        {
          title: 'Generation result cache',
          body: 'The same request with the same plugin is answered without running it.',
        },
        { title: 'Smaller, faster requests', body: 'Compressed requests and a faster plugin cold start.' },
        { title: 'protoc-gen-mcp in the registry' },
        { title: 'easyp-svc migrate down', body: 'Run the migration rollbacks that already exist.' },
        { title: 'A slimmer Go SDK', body: 'Without the MCP dependencies for clients that do not need them.' },
      ],
      next: [
        { title: 'Plugin sandbox', body: 'WebAssembly where a plugin builds to it, OS-level isolation for the rest.' },
        { title: 'Users and permissions', body: 'Organisations, roles, plugin owners, SSO and OIDC; mTLS identities.' },
        { title: 'Generated SDKs', body: 'go get, npm, pip and Maven packages with generated code.' },
        { title: 'Catalogue', body: 'More plugins, automatic version updates, signed plugin archives and provenance.' },
        { title: 'Code generation over MCP', body: 'So an agent can call the service itself.' },
      ],
    },
    {
      product: 'mcp',
      tagline: 'Any proto service → an MCP server',
      now: [
        { title: 'Swift target', body: 'Merged; ships in the next release.' },
        { title: 'Long tool names', body: 'Shortened to 64 characters with a hash instead of failing generation.' },
        { title: 'Every language checked in CI with MCP Inspector' },
      ],
      next: [
        {
          title: 'gRPC pass-through',
          body: 'The generated server calls your existing gRPC service — no handlers to write.',
        },
        { title: 'Strict schemas', body: 'For OpenAI, Gemini and Anthropic strict mode.' },
        { title: 'Server-streaming RPCs and progress notifications' },
        { title: 'Elicitation, sampling and completions' },
        { title: 'Typed MCP clients' },
        { title: 'OpenTelemetry tracing and metrics' },
      ],
    },
    {
      product: 'agents',
      tagline: 'Schemas your agent checks itself',
      now: [],
      nowNote: 'Starts together with the language server: both need the same diagnostics, symbol search and formatting.',
      next: [
        {
          title: 'easyp mcp',
          body: 'An MCP server in the CLI: lint, breaking, build, format, generate, symbol search — answers in JSON.',
        },
        {
          title: 'Skills, hooks and ready-made commands',
          body: 'An agent that edits a .proto file formats and lints it, and fixes its own mistakes.',
        },
        { title: 'Claude Code plugin' },
        { title: 'OpenAI Codex' },
        { title: 'Gemini CLI and Antigravity' },
        { title: 'Cursor, then GitHub Copilot, then Grok' },
        { title: 'Windsurf, Zed, JetBrains AI, Cline' },
      ],
    },
  ] satisfies Track[],
  notPlannedTitle: 'Not planned',
  notPlannedBody:
    'buf’s cloud commands. EasyP works differently: dependencies come from Git, plugins from a service you can run yourself.',
  notPlanned: ['push', 'registry *', 'beta registry *', 'policy', 'price', 'studio-agent', 'webhook'],
  notPlannedWhy: 'If one of these is what keeps you on buf, tell us — that is exactly the feedback this list is for.',
  cta: {
    title: 'Missing something?',
    body: 'Open an issue or write to us in Telegram. What people ask for moves things up this page.',
    issues: 'Open an issue',
    plugins: 'Browse plugins',
  },
}

const ru: typeof en = {
  metaTitle: 'Роадмап',
  metaDescription:
    'Что уже вышло в EasyP и что дальше: CLI easyp, сервис плагинов и plugins.easyp.tech, protoc-gen-mcp и интеграции с AI-агентами.',
  title: 'Роадмап.',
  titleHighlight: 'Сделано, сейчас, дальше.',
  subtitle:
    'Что уже вышло, над чем работаем и в каком порядке пойдём дальше. У планов нет дат — только порядок, и только то, что действительно собираемся делать.',
  legend: { shipped: 'Сделано', now: 'Сейчас', next: 'Дальше', notPlanned: 'Не делаем' },
  laneEmpty: 'Здесь пока пусто.',
  products: {
    cli: 'CLI easyp',
    service: 'Сервис плагинов',
    mcp: 'protoc-gen-mcp',
    agents: 'AI-агенты',
  },
  shippedTitle: 'Сделано',
  shippedBody: 'Вышло и доступно уже сейчас, от новых к старым.',
  shipped: [
    {
      date: '2026-11-19',
      product: 'service',
      version: 'v1.3.2',
      title: 'latest — самая новая версия',
      body: 'latest выбирает самую большую версию при сравнении номеров как чисел (v1.36.11, а не v1.36.9). MCP-эндпоинт сообщает версию сервиса и отдаёт все поля в lowerCamelCase.',
      url: `${SERVICE_RELEASE}v1.3.2`,
    },
    {
      date: '2026-11-14',
      product: 'mcp',
      version: 'v1.0.0',
      title: 'protoc-gen-mcp 1.0',
      body: 'Go на официальном MCP Go SDK; Python, TypeScript, Java и Kotlin на том же уровне. Tools, resources и prompts во всех языках, OAuth для HTTP-серверов, метаданные интерфейса MCP Apps.',
      url: 'https://github.com/easyp-tech/protoc-gen-mcp/releases/tag/v1.0.0',
    },
    {
      date: '2026-11-10',
      product: 'service',
      title: 'Публичный реестр плагинов: plugins.easyp.tech',
      body: '80 плагинов и больше 1700 версий — Go, gRPC, Connect, TypeScript, Python, Java, Rust, Swift и другие — подключаются из easyp.yaml без установки.',
    },
    {
      date: '2026-10-30',
      product: 'service',
      version: 'v1.3.0',
      title: 'Воспроизводимые сборки плагинов',
      body: 'Один и тот же плагин всегда упаковывается в одни и те же байты и собирается под платформу, на которой работает сервис.',
      url: `${SERVICE_RELEASE}v1.3.0`,
    },
    {
      date: '2026-10-24',
      product: 'service',
      version: 'v1.2.0',
      title: 'StatefulSet в Helm и публикация за один проход',
      body: 'У каждой реплики свой том для кэша плагинов; plugins publish собирает, проверяет, загружает и регистрирует за один проход.',
      url: `${SERVICE_RELEASE}v1.2.0`,
    },
    {
      date: '2026-10-05',
      product: 'cli',
      version: 'v1 preview',
      title: 'Ночные сборки easyp v1',
      body: 'Новый конфиг (protobuf.mod / protobuf.lock, вложенные Git-модули, replace), миграция с v0, get, mod tidy, проверка breaking по дескрипторам, EASYP_PROXY.',
      url: 'https://github.com/easyp-tech/easyp/releases',
    },
    {
      date: '2026-10-05',
      product: 'service',
      version: 'v1.1.0',
      title: 'Интерпретируемые плагины работают где угодно',
      body: '22 плагина на Python, Node и JVM стали переносимыми бандлами, которые проверяются при сборке.',
      url: `${SERVICE_RELEASE}v1.1.0`,
    },
    {
      date: '2026-09-27',
      product: 'mcp',
      title: 'protoc-gen-mcp в awesome-go',
      body: 'Добавлен в каталог awesome-go.',
      url: 'https://github.com/avelino/awesome-go/pull/6715',
    },
    {
      date: '2026-09-14',
      product: 'service',
      version: 'v1.0.0',
      title: 'Сервис плагинов 1.0',
      body: 'Первый стабильный релиз: удалённая генерация кода по gRPC с зафиксированным контрактом API, Go SDK, тарифы community и enterprise.',
      url: `${SERVICE_RELEASE}v1.0.0`,
    },
  ],
  aheadTitle: 'Сейчас и дальше',
  aheadBody: 'По каждому продукту: что в работе и что следующее, по порядку.',
  tracks: [
    {
      product: 'cli',
      tagline: 'Замена buf один в один',
      now: [
        { title: 'Стабильный easyp 1.0', body: 'Конфигурация и команды v1 из ночных сборок — в стабильном релизе.' },
        { title: 'breaking — те же замечания, что у buf', body: 'Включая позиции.' },
        { title: 'easyp build', body: 'Сборка дескрипторов без конфига генерации.' },
        { title: 'easyp format', body: '-w, --diff, --exit-code, --stdin-filepath.' },
        {
          title: 'easyp migrate --from-buf',
          body: 'buf.yaml, buf.gen.yaml и buf.lock в конфиги easyp одной командой.',
        },
        {
          title: 'Совместимость проверяется каждую ночь',
          body: 'С последними buf и protoc; editions 2023 и 2024; Windows в CI.',
        },
      ],
      next: [
        {
          title: 'Языковой сервер',
          body: 'Диагностики, переход к определению, hover, форматирование; затем completion, references, rename.',
        },
        { title: 'Расширение VS Code, затем плагин JetBrains' },
        { title: 'Только изменённое', body: '--changed-since для lint, generate, breaking, build и format.' },
        { title: 'easyp changelog', body: 'Изменения API между двумя ревизиями в Markdown и комментарием к PR.' },
        { title: 'easyp mod outdated и easyp docs' },
        { title: 'easyp init --from-protoc', body: 'Вызов protoc превращается в конфиг easyp.' },
        {
          title: 'Другие команды',
          body: 'config ls-lint-rules, правило PROTOVALIDATE, mod graph, export, stats, convert, source edit deprecate, свои правила через wasm-плагины.',
        },
      ],
    },
    {
      product: 'service',
      tagline: 'Плагины запускаются за вас',
      now: [
        { title: 'Кэш результатов генерации', body: 'Тот же запрос с тем же плагином — готовый ответ без запуска.' },
        { title: 'Запросы меньше и быстрее', body: 'Сжатие запросов и более быстрый холодный старт плагина.' },
        { title: 'protoc-gen-mcp в реестре' },
        { title: 'easyp-svc migrate down', body: 'Запуск уже написанных откатов миграций.' },
        { title: 'Лёгкий Go SDK', body: 'Без MCP-зависимостей для клиентов, которым они не нужны.' },
      ],
      next: [
        {
          title: 'Песочница для плагинов',
          body: 'WebAssembly, где плагин в него собирается, изоляция на уровне ОС для остальных.',
        },
        {
          title: 'Пользователи и права',
          body: 'Организации, роли, владельцы плагинов, SSO и OIDC; пользователь из сертификата mTLS.',
        },
        { title: 'Сгенерированные SDK', body: 'Пакеты go get, npm, pip и Maven с готовым кодом.' },
        {
          title: 'Каталог',
          body: 'Больше плагинов, автообновление версий, подписанные архивы плагинов и их происхождение.',
        },
        { title: 'Генерация кода через MCP', body: 'Чтобы агент сам вызывал сервис.' },
      ],
    },
    {
      product: 'mcp',
      tagline: 'Любой proto-сервис → MCP-сервер',
      now: [
        { title: 'Swift', body: 'Уже в основной ветке, выйдет в следующем релизе.' },
        { title: 'Длинные имена инструментов', body: 'Сокращаются до 64 символов с хешем, а не роняют генерацию.' },
        { title: 'Каждый язык проверяется в CI через MCP Inspector' },
      ],
      next: [
        {
          title: 'Проброс в gRPC',
          body: 'Сгенерированный сервер сам вызывает ваш gRPC-сервис — обработчики писать не нужно.',
        },
        { title: 'Strict-схемы', body: 'Для strict mode в OpenAI, Gemini и Anthropic.' },
        { title: 'Server-streaming RPC и уведомления о прогрессе' },
        { title: 'Elicitation, sampling и completions' },
        { title: 'Типизированные MCP-клиенты' },
        { title: 'Трассировка и метрики OpenTelemetry' },
      ],
    },
    {
      product: 'agents',
      tagline: 'Схемы, которые агент проверяет сам',
      now: [],
      nowNote: 'Начнём вместе с языковым сервером: им нужны одни и те же диагностики, поиск символов и форматирование.',
      next: [
        {
          title: 'easyp mcp',
          body: 'MCP-сервер в CLI: lint, breaking, build, format, generate, поиск символов — ответы в JSON.',
        },
        {
          title: 'Навыки, хуки и готовые команды',
          body: 'Агент поменял .proto — файл сразу форматируется и проверяется, агент исправляет свои ошибки сам.',
        },
        { title: 'Плагин для Claude Code' },
        { title: 'OpenAI Codex' },
        { title: 'Gemini CLI и Antigravity' },
        { title: 'Cursor, затем GitHub Copilot, затем Grok' },
        { title: 'Windsurf, Zed, JetBrains AI, Cline' },
      ],
    },
  ],
  notPlannedTitle: 'Не делаем',
  notPlannedBody:
    'Облачные команды buf. EasyP устроен иначе: зависимости — из Git, плагины — из сервиса, который можно поднять у себя.',
  notPlanned: ['push', 'registry *', 'beta registry *', 'policy', 'price', 'studio-agent', 'webhook'],
  notPlannedWhy:
    'Если именно что-то из этого держит вас на buf — напишите нам: этот список для такой обратной связи и нужен.',
  cta: {
    title: 'Чего-то не хватает?',
    body: 'Откройте issue или напишите нам в Telegram. То, о чём просят, поднимается выше на этой странице.',
    issues: 'Открыть issue',
    plugins: 'Каталог плагинов',
  },
}

export type RoadmapCopy = typeof en

export function roadmap(locale: AppLocale): RoadmapCopy {
  return locale === 'ru' ? ru : en
}
