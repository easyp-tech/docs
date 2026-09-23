> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Отчёт: документация EasyP API Service + сравнение с Buf BSR

Ветка `docs/api-service-full-and-bsr` в `docs-fumadocs/`, коммиты локальные, **ничего не запушено и не задеплоено**.
Код и конфиги `service/`, `easyp/`, `portal/`, старый `docs/`, `content/docs/cli/**` не менялись.

## Что сделано

### Страницы (`content/docs/api-service/`, каждая EN `.mdx` + RU `.ru.mdx`)

| Страница | Статус |
|---|---|
| `overview` | переписана (маркетинг → сухо, порты, `latest`, roadmap удалён, mermaid → ASCII) |
| `quickstart` | новая; пройдена руками целиком (см. «Проверка») |
| `architecture` | новая: цепочка интерсепторов по коду, worker pool, исполнение, хранилище, БД, аудит, одна реплика |
| `installation` | новая: теги GHCR, Helm (обязательные значения проверены `helm template`), compose, бинарники, модули |
| `configuration` | новая: все 55 настроек из `config.Leaves()` + `EASYP_CONFIG`, `EASYP_TOKEN`, `OTEL_EXPORTER_OTLP_ENDPOINT` |
| `authentication-and-licensing` | новая: TLS/mTLS, токены, Community vs Enterprise по коду, PASETO, grace, ELv2 |
| `security` | новая: «не песочница», что ограничено/не ограничено, кто что может, изоляция силами окружения |
| `plugins` | новая: имена, каталог (80/1738), plugin.yaml, Dockerfile, build→push→register, связь с bufbuild/plugins |
| `client-usage` | новая: easyp CLI (`remote:`), ограничения CLI, Go SDK, gRPC, таблица ошибок |
| `operator-cli` | новая: все команды и флаги из `--help` |
| `observability` | новая: все метрики (со стенда + ленивые из кода), трейсы, профили, логи, алерты → runbooks |
| `mcp` | новая |
| `runbooks` | исправлены 6 секций; **заголовки не менялись**; RU `## Хост [#the-host]` |
| `backup` | исправлен код ошибки |
| `upgrading` | удалено roadmap-обещание |
| `vs-buf-bsr` | новая: таблица, «где сильнее BSR» (9 пунктов), «где сильнее EasyP», совместимость, производительность (без цифр), TCO, когда что, источники с датой |
| `migrating-from-bsr` | новая: BSR→EasyP и обратный путь |
| `meta.json` | новый порядок (17 страниц) |

Корневой `content/docs/meta.json` не менялся — раздел уже был. Страницы вне `api-service/` не правились
(найденные проблемы — в `inventory.md` и `for-next-prompt-cli.md`).

### Структура — отличия от предложенной и почему

- Порядок: `security` сразу после `authentication-and-licensing` — это вторая по важности страница для
  оператора и логически продолжает auth.
- `runbooks`, `backup`, `upgrading` оставлены на своих URL (на `runbooks` ссылается чарт).
- Якоря, на которые ссылаются другие страницы, в RU заданы явно синтаксисом Fumadocs `[#id]`
  (`single-replica`, `adding-a-plugin`, `sources`, `the-host`) — поддержка проверена в
  `node_modules/fumadocs-core/dist/mdx-plugins/remark-heading.js` (`customId = true`).
- Диаграммы — ASCII: mermaid-компонента на сайте нет.

### Отчёты (`prompts/reports/api-service-2026-09-23/`)

`inventory.md`, `service-facts.md`, `bsr-facts.md`, `comparison-matrix.md`, `code-vs-docs-discrepancies.md`,
`for-next-prompt-cli.md`, `REPORT.md`.

### Коммиты

```
d5eb424 docs(api-service): restructure section, rewrite overview, add quickstart, architecture, installation, security
82d9156 docs(api-service): add configuration, operator CLI, observability, auth/licensing, plugins, client and MCP references
8eff2c4 docs(api-service): correct runbooks, backup and upgrading against the code
b84da08 docs(api-service): compare with Buf BSR remote plugins, migration in both directions
5549e91 docs(api-service): Russian versions of every page in the section
+ коммит с отчётами
```

## Проверка

| Проверка | Результат |
|---|---|
| `npm run types:check` | OK: `fumadocs-mdx && tsc --noEmit` → `[MDX] generated files in 8.6ms`, без ошибок |
| `npm run build` | OK, exit 0: `✓ Compiled successfully in 2.8s`, `✓ Generating static pages using 10 workers (666/666)`. В логе есть `Error: GitHub tags status 403` — запрос тегов GitHub при пререндере (лимит API), сборку не валит, к разделу не относится |
| Страницы в навигации | `npm run start` на :3187, `curl` по 17 EN + 17 RU URL → все **200**; RU-сайдбар — 17 ссылок на каждой странице; EN-дерево — все 17 в RSC-payload. Браузером глазами не смотрел |
| Внутренние ссылки | Скрипт (node + github-slugger, повторяет логику Fumadocs, учитывает `[#id]`) по `content/docs/**`: в `api-service/` 186 ссылок, 0 битых; по всему сайту 238, битых 4 — все вне раздела (`guides/*`), в отчёте |
| Якоря runbooks | 17 алертов из `prometheusrule.yaml` + `mimir/rules/anonymous/*.yaml`; проверка `grep -qiE "^#{2,3} <Alert>$"` (логика `render.sh`) — EN и RU: 0 пропусков. `bash service/deploy/charts/easyp-service/tests/render.sh` → `ok every alert carries a runbook_url anchored on its own name`, `ok every host alert …`, `ok runbookBaseUrl names the runbooks page` |
| Якоря в HTML | `id="the-host"`, `id="single-replica"`, `id="sources"`, `id="easypauthfailures"` присутствуют в отрендеренном RU |
| Справочник конфигурации | `config.Leaves()` → 55 строк (go run с `-overlay` в scratchpad, без записи в `service/`); все 55 в таблице EN и RU. `grep 'env:"'` → 76 строк; разбор разницы — `code-vs-docs-discrepancies.md` C7 |
| Команды `easyp-svc` | `go build` в scratchpad + `--help` каждой подкоманды; флаги в `operator-cli.mdx` сверены построчно |
| Quickstart | Пройден **буквально**: `easyp-svc plugins build --output <scratch> --filter protocolbuffers/go:v1.36.10 registry` (Docker, Linux ELF) → `auth new-token` → compose из страницы (awk-извлечение блока) → `/live` 200, `/` 200 → `plugins register` (Registered 1) → `easyp generate` с `easyp.yaml` из страницы → `gen/go/demo/v1/demo.pb.go` c `protoc-gen-go v1.36.10`. Стенд удалён |
| Скептик-проход по `vs-buf-bsr` | Результат — таблица в конце `comparison-matrix.md`; каждое утверждение о Buf на сайте имеет сноску на страницу, прочитанную 2026-09-23 |
| Ничего не запушено | `git log origin/main..HEAD` — только локальные коммиты; `git push` не выполнялся |

Что **не** выполнялось и почему:
- Полный compose-стек (`task up`) — пишет сертификаты и артефакты в `service/`, это за границами; проверено только
  `docker compose -f deploy/docker-compose.yml config --quiet` → OK.
- S3-режим вживую (push → register с checksum → download) — не поднимал хранилище; описан по коду.
- Helm в кластере — нет кластера; только `helm template` (обязательные проверки воспроизведены).
- Enterprise-режим — нет лицензионного токена; описан по коду.
- `buf generate` против EasyP и `easyp` против buf.build — не запускал (нет аккаунта BSR, не хотел
  трогать внешний сервис); совместимость описана по протоколам.
- Визуальная проверка в браузере — не делал, только curl.

## Главные находки

1. **`latest` выбирает версию лексикографически** (`v1.36.9` > `v1.36.10`) — подтверждено на стенде.
   README/AGENTS.md обещают «newest». На сайте это честно описано с рекомендацией фиксировать версии.
2. **easyp CLI не отправляет токен и не умеет mTLS**, дедлайн 30 s — несовместим с `require_authentication` и
   mTLS-listener'ом сервиса (подтверждено на стенде: `Unauthenticated`).
3. **`plugins_dir` обязан быть записываемым** даже без S3 (подтверждено на стенде).
4. Порядок интерсепторов в AGENTS.md (и в промпте) неверен: error code conversion — последний.
5. Каталог `registry/` повторяет структуру и набор владельцев `bufbuild/plugins` (Apache-2.0): 80 из 85 плагинов,
   те же 10 владельцев, те же имена `community/*`. Dockerfile'ы переписаны (один на плагин, `ARG VERSION`, `/plugin`),
   но `package.json` у `bufbuild/es` и `grpc/node` совпадают по содержимому с последними версиями в bufbuild/plugins
   (`diff <(jq -S) <(jq -S)` пусто). Файлов LICENSE/NOTICE с атрибуцией в `registry/` нет.
   **Нужна ли атрибуция по Apache-2.0 §4 — вопрос для юриста**, не для меня; на сайте связь описана открыто.
6. У BSR тоже есть MCP-сервер — MCP не является нашим отличием; на сайте так и написано.

## Неподтверждённое

| Утверждение | Почему не подтверждено |
|---|---|
| Число плагинов на https://buf.build/plugins | Страница рендерится JS; посчитан только репозиторий bufbuild/plugins (85/1886) |
| Технология песочницы BSR, лимиты памяти/CPU/времени у remote plugins | Документация Buf их не называет |
| Какие тарифы Buf включают on-prem (кроме «Enterprise» на pricing) | На страницах on-prem не указано |
| Цена лицензии EasyP Enterprise | В репозиториях нет; `portal/` не смотрел |
| Юрисдикция/размещение данных публичного BSR | Privacy Policy Buf не читал; на сайте тему не раскрываю |
| Что `buf` не может использовать EasyP как remote, а `easyp` — BSR | Вывод из протоколов; экспериментом не проверено |
| Серверная часть BSR закрыта | Прямого документа нет; вывод из лицензионной on-prem-поставки |
| Поведение нескольких реплик с `persistence.enabled=false` (у каждой свой emptyDir) | README не обсуждает; values.yaml намекает, что это рассматривалось. На сайте не утверждаю |
| Точность цитат Buf | WebFetch пересказывает страницу моделью; ключевые числа (rate limits, цены) перепроверить на живых страницах |
| Работа `plugins register` без аргумента `path` | Не запускал |
| `upgrading.mdx` построчно | Сверял выборочно |
| Instance-level роли BSR, содержимое on-prem Observability | Страницы не читал |
