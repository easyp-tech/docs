> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Инвентаризация: где документация говорит о сервисе, remote-генерации, BSR, лицензиях, токенах

Метод: `grep -rn -i 'remote|api service|api-service|BSR|buf schema registry|licen[cs]e|token|plugins\.|easyp-svc|:8080|23410'`
по `content/docs/**/*.mdx` (EN), затем чтение найденных страниц; RU-версии `api-service/*` прочитаны целиком;
старый `../docs/content/{en,ru}/api-service/overview.md` прочитан. Правила линтера/breaking и блог исключены
(совпадения там — примеры protobuf-полей с `token`, не про сервис).

Статусы: **верно** / **неверно** / **неизвестно** / **исправлено мной** (со ссылкой на коммит в ветке).

## Раздел `api-service/` (до правки)

| Файл | Что говорилось | Статус |
|---|---|---|
| `api-service/overview.mdx` | Порты `SERVER_PORT_GRPC=8080` … `8083` как настройки сервиса | **неверно** — дефолты бинарника 23410–23413 (`service/internal/config/config.go:140-143`); 8080–8083 — это значения Helm-чарта. Исправлено (d5eb424). |
| `api-service/overview.mdx` | «The Challenge / Version Inconsistencies / Operational Overhead / Security & Compliance Risks» + таблица «Solution» | маркетинговый тон; суть верна. Переписано сухо (d5eb424). |
| `api-service/overview.mdx` | Mermaid-диаграммы | на сайте нет компонента mermaid (`components/mdx.tsx`: только defaults, TypeTable, Tabs) — рендерились как код. Заменено ASCII. |
| `api-service/overview.mdx` | «Planned: caching, usage accounting, policy» | roadmap-обещание, в коде нет. Удалено. |
| `api-service/overview.mdx` | «`latest` resolves to the newest registered version» | **неверно**: лексикографически (см. service-facts 1.6). Исправлено. |
| `api-service/overview.mdx` | «Local Execution: Installed plugins, WASM plugins» | верно (easyp `internal/core/generate.go:490-505`). |
| `api-service/overview.mdx` | «Community tier caps it at 16; Enterprise has no ceiling» | верно. |
| `api-service/overview.mdx` | Security: «not a container… memory, CPU, fs, network not bounded» | верно. Сохранено и расширено в `security.mdx`. |
| `api-service/runbooks.mdx` | 17 якорей-алертов | верно, все на месте (render.sh проходит). |
| `api-service/runbooks.mdx` → EasypGenerationsRejected | «`easyp_pool_queue_depth` против `queueSize`, `easyp_pool_active_workers` против `workers`» | **неверно по сути**: алерт смотрит `easyp_pool_generations_rejected_total` (лимитер генераций), а названные метрики — очередь поиска. Исправлено (8eff2c4). |
| `api-service/runbooks.mdx` → EasypGenerationQueueSaturated | «Consider more replicas» | **противоречит** README «It does not run in more than one replica». Исправлено. |
| `api-service/runbooks.mdx` → EasypGenerationErrorRate | «If `error_type` names a checksum mismatch» | **неверно**: `error_type` ∈ {transient, permanent} (`internal/core/pool.go:406-409`). Исправлено. |
| `api-service/runbooks.mdx` → EasypPanics | «The barrier's `name` label» | **неверно**: `easyp_panics_total` без меток (`internal/safe/safe.go:59-63`). Исправлено. |
| `api-service/runbooks.mdx` → The host | «These three come from prometheus.exporter.unix» | **неверно**: алертов шесть, источники разные. Исправлено. |
| `api-service/runbooks.mdx` → EasypAuthFailures | «Reads are anonymous by design, so everything here is mutating» | неполно: не учитывает `require_authentication`. Дополнено. |
| `api-service/backup.mdx` | «a `plugins` row without its archive fails generation with `BINARY_NOT_UPLOADED`» | **неверно**: при генерации — `UNAVAILABLE`/`STORAGE_UNAVAILABLE`; `BINARY_NOT_UPLOADED` только при регистрации. Исправлено. |
| `api-service/backup.mdx` | остальное (таблицы, goose, TestRollbackOntoAnOlderBinary, `easyp_business_plugins_total`) | верно (тест есть в `internal/database/goosemigrate/skew_test.go`, метрика есть). |
| `api-service/upgrading.mdx` | «The tool is planned to return from a standalone library» | roadmap-обещание. Удалено. |
| `api-service/upgrading.mdx` | прочее (v1.0.0→v1.0.2, v0.14.0, v0.13.x) | верно по выборочной проверке (EASYP_CONFIG, OTEL alias, ErrorInfo reasons, пагинация). Полностью построчно не сверял. |
| `api-service/*.ru.mdx` vs EN | RU были построчным переводом EN; по смыслу совпадали, включая те же ошибки. Ссылки в `backup.ru.mdx`, `upgrading.ru.mdx` вели на `/docs/...` (EN), а не `/ru/docs/...`. | исправлено (5549e91). |

## Остальной сайт

| Файл:строка | Что сказано | Статус |
|---|---|---|
| `index.mdx:21` | ссылка на `/docs/api-service/overview` | верно. |
| `introduction/what-is.mdx:55` | «Execute plugins via centralized EasyP API service for consistent, **isolated** execution» | **неверно**: плагины не изолированы. Не правил (не ссылка; вне границ) → for-next-prompt-cli.md. |
| `introduction/what-is.mdx:73-77` | `remote: api.easyp.tech/protoc-gen-typescript:latest` | **неверно**: имя без группы (`group/name`) сервис отвергнет (`INVALID_PLUGIN_NAME`); `api.easyp.tech` не резолвится (`dig +short api.easyp.tech` → пусто). → for-next-prompt-cli.md. |
| `introduction/what-is.mdx:105-113` | таблица EasyP vs Buf: «Plugin Execution: Local + Remote | Local + BSR plugins», «License Apache 2.0 | Apache 2.0» | лицензия easyp CLI — Apache-2.0 (верно, `easyp/LICENSE`); buf CLI — Apache-2.0 (верно). Но сервис EasyP — Elastic-2.0, таблица это не различает. |
| `introduction/quickstart.mdx:159` | «hybrid execution model with WASM for **blazing** speed and remote/**Docker** executors» | **неверно**: Docker-исполнителя в CLI нет (исполнители: command, remote, builtin WASM, local — `easyp/internal/core/generate.go:490-505`); маркетинговый тон. |
| `introduction/quickstart.mdx:174` | ссылка на `/docs/api-service/overview` | верно. |
| `cli/configuration.mdx:676-677, 895` | `remote: "buf.build/bufbuild/protovalidate-go:v0.4.0"` | **неверно**: easyp CLI не умеет BSR remote plugins (протокол `easyp.generator.v1`). |
| `cli/configuration.mdx:692` | «`remote` (string) - Remote plugin URL for execution» | неполно: формат, TLS-правило, `latest`, 30 s. |
| `cli/generator/index.mdx:25-26` | «Remote Generation: Generate code from remote Git repositories» | путает удалённые входы (Git) с удалённым исполнением плагинов. |
| `cli/generator/index.mdx:66,71` | `remote: buf.build/protocolbuffers/go`, `buf.build/grpc/go` | **неверно** для easyp. |
| `cli/generator/examples/{go,grpc-gateway,validate}.mdx` | `remote: buf.build/...` | **неверно** для easyp. |
| `guides/multi-target-generation.mdx:55,117` | `remote: gen.easyp.tech/es`; «Cloud generation service endpoint»; вкладка «WASM Sandbox» | `gen.easyp.tech` не резолвится; `es` без группы — невалидное имя; «cloud service» — публичного сервиса нет в документации. |
| `guides/multi-target-generation.mdx:141` | ссылка `/docs/guides/build-reproducibility` | **битая** (нет такой страницы; есть `guides/reproducibility`). Не про сервис — не правил. |
| `guides/breaking-checks-ci.mdx:134` | ссылка `/docs/guides/adding-dependencies` | **битая** (есть `guides/adding-dependency`). Не про сервис — не правил. |
| `guides/reproducibility.mdx:14` | «WASM / Remote Executors… deterministic WASM sandboxes or remote generation» | про remote — нейтрально; детерминизм remote-плагина сервис не гарантирует. |
| `guides/buf-migration.mdx:~70-85` | пример `backend/easyp.gen.yaml` с `version: v1`, `generate.modules`, `plugins[].version` | **неизвестно/скорее неверно**: в коде easyp нет упоминаний `easyp.gen.yaml` (`grep -rln 'easyp.gen' easyp --include=*.go` → пусто). |
| `reference/easyp-gen-yaml.mdx` | целая страница про `easyp.gen.yaml`; «`plugins[].remote`: gRPC **or HTTP** remote code generation service URL»; `remote: gen.easyp.tech/es` | **неверно/неподтверждено**: файл не читается CLI (см. выше); HTTP-транспорта нет (только gRPC). |
| `cli/package-manager/easyp-vs-buf.mdx` | сравнение модулей; «Private BSR Deployment: Significant infrastructure costs…» | частично устарело — см. for-next-prompt-cli.md. Не правил (запрещено). |

## Старый сайт `../docs/content/{en,ru}/api-service/overview.md`

Описывает несуществующий продукт: изоляция в Docker-контейнерах, `DOCKER_HOST`, `EASYP_SERVICE_*` переменные,
ресурсные лимиты CPU/память, «Horizontal scaling». Всё это **неверно** для текущего кода
(`cmd/easyp-svc/docs_test.go` прямо упоминает `EASYP_SERVICE_HOST` как никогда не существовавшую переменную).
Ценного, потерянного при миграции, не найдено; единственное пригодное — последовательность «CLI парсит →
отправляет по запросу на плагин → пишет файлы», она уже была в новом overview.
