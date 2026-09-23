> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Расхождения: код ↔ README / AGENTS.md / страницы / промпт

Правило: прав код. Ошибки в коде и README сервиса здесь только записаны — код и README не менялись.

## A. Возможные дефекты кода (для команды сервиса)

| # | Что | Где в коде | Доказательство | Предложение |
|---|---|---|---|---|
| A1 | **`latest` выбирает версию лексикографически**: `ORDER BY version DESC` по `TEXT`. `v1.36.9` > `v1.36.10`, `v1.9.0` > `v1.10.0`. | `service/internal/adapters/registry/registry.go:218-222`; колонка `version TEXT` в `internal/database/goosemigrate/migrations/00001_init.sql:7` | [стенд] зарегистрированы v1.36.9 и v1.36.10 → `remote: localhost:23410/protocolbuffers/go` сгенерировал `protoc-gen-go v1.36.9`; `select version … order by version desc` → `v1.36.9` первой | Сортировать по semver в Go после выборки или хранить нормализованный ключ сортировки. README (`README.md:540-544`) и AGENTS.md обещают «newest registered version». |
| A2 | `plugins_dir` обязан быть записываемым даже в локальном режиме: старт создаёт `plugins_dir/.tmp`; read-only mount → сервис не стартует. | `internal/adapters/registry/registry.go:902-916` (вызов из `registry.New`) | [стенд] `ERROR … registry.New: creating the archive staging directory: mkdir /plugins/.tmp: read-only file system` | Создавать staging лениво или только при `s3` включённом. Сейчас задокументировано как требование. |
| A3 | `LicenseInterceptor` — пустая карта метод→фича; интерсептор ничего не проверяет. | `internal/api/license_interceptor.go:23-31` | чтение кода | Не дефект, но AGENTS.md/overview описывают его как проверку. Задокументировано честно. |
| A4 | `grpc_validator` в цепочке, но сгенерированные сообщения не реализуют `Validate()` — pass-through. | `internal/grpchelper/server.go:196`; `grep -c 'func (.*) Validate()' api/easyp/generator/v1/*.go` → 0 | [команда] | Удалить или подключить protovalidate. |
| A5 | Нет `SECURITY.md`, private vulnerability reporting выключен, при том что продукт исполняет чужие бинарники. | репозиторий `easyp-tech/service` | [команда: `gh api repos/easyp-tech/service/private-vulnerability-reporting` → `{"enabled":false}`] | Включить и описать канал. |
| A6 | Чарт не даёт задать `runtimeClassName` (gVisor/Kata) — единственный «дешёвый» способ песочницы на K8s. | `deploy/charts/easyp-service/templates/deployment.yaml` | `grep runtimeClassName` → пусто | Добавить значение. |
| A7 | Help `plugins register --addr`: «(the chart publishes gRPC on 8080)» при дефолте `localhost:23410` — корректно, но путает. | `cmd/easyp-svc/main.go` | [команда: `easyp-svc plugins register --help`] | — |
| A8 | Вывод `plugins build` (сводка) на русском при английском интерфейсе остального CLI. | `cmd/easyp-svc/build.go` | [команда] «Всего версий найдено : 1 / Собрано : 1» | Косметика. |

## B. Клиент (easyp CLI) против сервиса

| # | Что | Где | Доказательство |
|---|---|---|---|
| B1 | CLI не передаёт токен и не поддерживает mTLS → несовместим с `auth.require_authentication=true` и с mTLS на listener. Сервис рекламирует оба режима. | `easyp/internal/adapters/plugin/remote.go:58-80` | [стенд] `code = Unauthenticated desc = valid credentials are required for /easyp.generator.v1.GeneratorAPI/GenerateCode` |
| B2 | Дедлайн CLI 30 s захардкожен; `worker_pool.generation_timeout` сервера — 120 s; SDK `WithGenerateCodeTimeout` по умолчанию тоже 30 s. | `remote.go:55`; `service/sdk/config.go:59`; `service/internal/config/config.go:265` | [код] |
| B3 | Нельзя указать свой CA (только системный пул). | `remote.go:58-64` | [код] |
| B4 | Новое gRPC-соединение на каждый вызов плагина. | `remote.go:69-80` | [код] |

## C. README сервиса / AGENTS.md против кода

| # | Документ говорит | Код говорит |
|---|---|---|
| C1 | AGENTS.md: порядок интерсепторов «… validation → error_code_conversion → rate_limit → concurrency_limit → auth → license» | error_code_conversion — **последний** (innermost), после license; между realip и prometheus есть `callerIP`. `internal/grpchelper/server.go:189-204`, `cmd/easyp-svc/start.go:811-816`. (Промпт повторяет ошибку AGENTS.md.) |
| C2 | README.md:540-544, AGENTS.md: `latest` «resolves to the newest registered version» | лексикографически (A1). |
| C3 | AGENTS.md «Pitfalls»: «`easyp generate` needs running service — the generate command calls localhost:8080 gRPC» | верно только для `easyp.local.yaml` в репо; `easyp.yaml` репо указывает на `plugins.beta.easyp.tech`. Не дефект, формулировка неточна. |
| C4 | AGENTS.md: `plugins register` «default path `plugins`» | `--help` показывает `[path]` без явного дефолта [не проверял поведение без аргумента]. |
| C5 | README «Known limitations → It does not run in more than one replica» | Совпадает с кодом; чарт при этом *разрешает* `replicaCount>1` с RWX (`_helpers.tpl:170-175`) — README это оговаривает. OK. |
| C6 | Промпт (раздел 1/Фаза B): операторские команды `service start`, `plugins build|push|register`, `config`, `auth`, `api`, `health` | есть ещё `plugins pack`; команды `license` нет (промпт её не называет как команду, но перечисляет «лицензии» рядом). |
| C7 | Промпт: «`sethvargo/go-envconfig` — ищи теги `env:`»; проверяющий сделает `grep 'env:"'` | `grep` даёт 76 строк, из них 55 — реальные листья (`config.Leaves()`); остальное — префиксы секций (13), поля элементов списка `WriteToken` (`NAME`,`SHA256`), внутренние структуры `ratelimiter.Config`(3) и `license.Config`(1), и одно упоминание в комментарии. Справочник покрывает все 55 листьев. |

## D. Страницы сайта против кода (исправлено в этой ветке)

См. `inventory.md`, раздел «Раздел api-service». Кратко: порты, `latest`, `BINARY_NOT_UPLOADED` в backup,
метрики в пяти секциях runbooks, roadmap-обещания, mermaid.

## E. Чарт против документации

| # | Что |
|---|---|
| E1 | `values.yaml:94-100` описывает MCP как «catalog and the easyp.yaml schema» — schema-инструмент удалён в v0.14.0 (upgrading.mdx); остался только `plugins_list` (`api/easyp/generator/v1/generator.mcp.go:24`). |
| E2 | `values.yaml:406-411` — `runbookBaseUrl` указывает на `https://easyp.tech/docs/api-service/runbooks`; сайт сейчас может быть недоступен (по условию задачи) — ссылки из алертов ведут туда. Якоря на месте. |
