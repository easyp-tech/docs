> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# EasyP API Service — факты с доказательствами

Снимок: `service/` на коммите `db92c64` (тег последнего релиза `v1.0.2`, `Chart.yaml` version `1.0.2`,
appVersion `v1.0.2`); `easyp/` на коммите `a1f6e44` (последний тег `v0.17.0`).
Пути ниже — относительно `service/`, если не указано иное. Номера строк — на этот снимок.

Условные обозначения: `[код: path:line]`, `[команда: ...]`, `[стенд]` — проверено на локальном
стенде (см. раздел «Локальный стенд» внизу), `[не подтверждено]`.

## 1. Путь запроса GenerateCode

| # | Факт | Доказательство |
|---|---|---|
| 1.1 | Базовая цепочка unary-интерсепторов: trace_logging → realip → callerIP → prometheus (`serverMetrics`) → structured logging → panic recovery → validation (`grpc_validator`) → *extra* → error code conversion (последний, innermost). | [код: internal/grpchelper/server.go:189-204] |
| 1.2 | *extra* = rate_limit → concurrency_limit → auth → license. | [код: cmd/easyp-svc/start.go:811-816] |
| 1.3 | Итоговый порядок: trace_logging → realip → callerIP → prometheus → logging → recovery → validation → rate_limit → concurrency_limit → auth → license → error_code_conversion → handler. **Порядок в `AGENTS.md` (error_code_conversion перед rate_limit) и в промпте неверен**: конвертер кодов стоит последним, и в коде это обосновано (иначе он переклассифицировал бы статусы интерсепторов в Internal). Также в `AGENTS.md` пропущен `callerIP`. | [код: internal/grpchelper/server.go:198-203] |
| 1.4 | Хендлер `API.GenerateCode` → `core.Generate`: парсинг `group/name:version`, `registry.Get` (через `WorkerPool`), `plugin.Generate`, метрика, аудит. | [код: internal/api/api.go:53-65], [код: internal/core/core.go:68-114] |
| 1.5 | Формат имени: `group` и `name` — `^[a-z][a-z0-9-]*$`, версия — `^v\d+\.\d+(\.\d+)?$` или `latest`. Имя обязано содержать ровно один `/` и ровно один `:` — **версия на уровне сервиса обязательна** (без `:` → `INVALID_PLUGIN_NAME`). Подставляет `latest` клиент (easyp CLI). | [код: internal/core/core.go:165-195], [код: easyp/internal/adapters/plugin/remote.go:128-131] |
| 1.6 | `latest` = `order by version desc limit 1` по колонке `TEXT` — **лексикографически, не по semver**. `v1.36.9` > `v1.36.10`. | [код: internal/adapters/registry/registry.go:218-222], [код: internal/database/goosemigrate/migrations/00001_init.sql:7], [стенд: при зарегистрированных v1.36.9 и v1.36.10 `remote: localhost:23410/protocolbuffers/go` сгенерировал код с заголовком `protoc-gen-go v1.36.9`; `select version ... order by version desc` вернул v1.36.9 первой] |
| 1.7 | Коды ошибок: NotFound→`NOT_FOUND`; InvalidPluginName/InvalidConfig→`INVALID_ARGUMENT`; GenerationFailed→`INTERNAL`; ServerOverloaded→`RESOURCE_EXHAUSTED`/`SERVER_OVERLOADED`; AlreadyExists; MaxPluginsExceeded→`RESOURCE_EXHAUSTED`; ShuttingDown/StorageUnavailable→`UNAVAILABLE`; BinaryNotUploaded→`FAILED_PRECONDITION`; FeatureDenied→`PERMISSION_DENIED`; DeadlineExceeded; Canceled. | [код: internal/api/api.go:292-321] |
| 1.8 | Rate limit и concurrency limit отвечают `RESOURCE_EXHAUSTED`. | [код: internal/ratelimiter/ratelimiter.go:167], [код: internal/ratelimiter/concurrency.go:188] |
| 1.9 | Сервер не отдаёт gRPC reflection; дескриптор — `easyp-svc api descriptor`. | [команда: easyp-svc api descriptor --help] |

## 2. Worker pool и лимиты исполнения

| # | Факт | Доказательство |
|---|---|---|
| 2.1 | Два разных ограничителя: `workers` — поиск плагина (БД + скачивание при промахе), `max_concurrent_generations` — одновременные процессы плагинов. | [код: internal/core/pool.go:22-26 (комментарий к WorkerPoolConfig)] |
| 2.2 | `WorkerPool.Get()` неблокирующий: если канал заданий (ёмкость `queue_size`) полон — сразу `ErrServerOverloaded`. | [код: internal/core/pool.go:341-350], [код: internal/core/pool.go:~133 `make(chan job, cfg.QueueSize)`] |
| 2.3 | Лимитер генераций: `TryAcquire`; если слотов нет — ожидание в очереди глубиной `queue_size`; сверх неё — `ErrServerOverloaded`. Время в очереди не входит в `generation_timeout`. | [код: internal/core/pool.go:220-244, 386-395] |
| 2.4 | Клиент видит `RESOURCE_EXHAUSTED` с reason `SERVER_OVERLOADED`. | [код: internal/api/api.go:304-305] |
| 2.5 | Ретраи на сервере: до `max_retries` (2) при «транзиентных» ошибках — только если текст ошибки содержит `connection refused` или `temporary failure`; `DeadlineExceeded` не повторяется. | [код: internal/core/pool.go:421-486] |
| 2.6 | Таймаут генерации `worker_pool.generation_timeout` (120s); у плагина может быть свой `timeout` в конфиге — он применяется внутри (эффективный — меньший). | [код: internal/core/pool.go:397], [код: internal/adapters/registry/registry.go:459-469] |

## 3. Исполнение плагина — не песочница

| # | Факт | Доказательство |
|---|---|---|
| 3.1 | Плагин — дочерний процесс `exec.CommandContext(command[0], command[1:]...)`. Не контейнер. | [код: internal/adapters/registry/registry.go:472] |
| 3.2 | Окружение: пустое + только `env` из конфига плагина. | [код: internal/adapters/registry/registry.go:474-478] |
| 3.3 | Запрос на stdin, ответ из stdout; stdout ограничен `registry.max_output_size` (64 MiB), stderr — 1 MiB. | [код: internal/adapters/registry/registry.go:39, 406-432, 481] |
| 3.4 | Отдельная группа процессов (`Setpgid`), по таймауту — `SIGKILL` всей группе. | [код: internal/adapters/registry/registry.go:484, 519-520] |
| 3.5 | `command[0]` обязан лежать внутри `plugins_dir` — проверяется лексически при регистрации и после разрешения симлинков перед запуском. | [код: internal/adapters/registry/registry.go:117 (ValidateConfig), 770-803] |
| 3.6 | Рабочая директория (`cmd.Dir`) не задаётся — наследуется от сервиса. | [код: grep `cmd.Dir` в registry.go — пусто] |
| 3.7 | Нет ограничений по памяти, CPU, файловой системе (кроме прав сервисного пользователя), сети. README это подтверждает («Plugins are not sandboxed»). | [код: отсутствие соответствующего кода в registry.go], README.md:843 |
| 3.8 | Образ сервиса запускается от UID 65532 (`nonroot`). | [код: Dockerfile:61,76] |
| 3.9 | Helm-чарт по умолчанию включает `NetworkPolicy` с egress только на 5432, 443, 4317 и DNS; комментарий прямо говорит, что 443 — «anything a plugin fetches over HTTPS». | [код: deploy/charts/easyp-service/values.yaml:433-443] |
| 3.10 | Архивы плагинов: symlink, указывающий за пределы архива, отвергается при распаковке. | upgrading.mdx (v0.14.0), [код: internal/plugarchive] [не перепроверял построчно] |

## 4. Хранилище плагинов

| # | Факт | Доказательство |
|---|---|---|
| 4.1 | Без `registry.s3.bucket` — локальный режим: бинарники берутся из `plugins_dir` как есть. | [код: internal/adapters/registry/registry.go:850-852], values.yaml:227-228 |
| 4.2 | С S3: при промахе кеша — singleflight по ключу `{group}/{name}/{version}/plugin.tgz`, скачивание во временный файл в `plugins_dir/.tmp`, проверка sha256, распаковка. | [код: internal/adapters/registry/registry.go:268, 850-950] |
| 4.3 | sha256 вычисляет **сервис** при `CreatePlugin`/`UpdatePlugin`, читая архив из S3; если архива нет — `FAILED_PRECONDITION`/`BINARY_NOT_UPLOADED` ("run `easyp-svc plugins push` first"). | [код: internal/adapters/registry/registry.go:951-975, 963] |
| 4.4 | Порядок: `plugins build` → `plugins push` → `plugins register`. `push --force` поверх зарегистрированного плагина ломает записанный checksum — нужен re-register. | [команда: easyp-svc plugins push --help] |
| 4.5 | При генерации отсутствие архива в S3 даёт ошибку скачивания, обёрнутую в `ErrStorageUnavailable` → `UNAVAILABLE`/`STORAGE_UNAVAILABLE`, **а не `BINARY_NOT_UPLOADED`** (backup.mdx утверждает обратное). | [код: internal/adapters/registry/registry.go:930-933], [код: internal/adapters/storage/s3.go — NotFound обрабатывается только в Exists] |
| 4.6 | `plugins_dir` должен быть **записываемым даже в локальном режиме**: при старте создаётся `plugins_dir/.tmp`; при read-only монтировании сервис не стартует: `registry.New: creating the archive staging directory: mkdir /plugins/.tmp: read-only file system`. | [стенд], [код: internal/adapters/registry/registry.go:902-916] |
| 4.7 | Кеш на диске ограничен `registry.cache_max_bytes` (20 GiB), LRU-вытеснение; 0 отключает. | [код: internal/config/config.go:182], values.yaml:221-226 |
| 4.8 | Несколько реплик на общем томе не поддерживаются (кеш небезопасен для совместного использования). | README.md:876, values.yaml:22 (`replicaCount: 1`) [не перепроверял механизм гонки в коде] |

## 5. Postgres, миграции, health

| # | Факт | Доказательство |
|---|---|---|
| 5.1 | Таблицы: `plugins` (`group_name, name, version TEXT, config, tags, created_at`, UNIQUE по тройке), `audit_log` (партиционирована по месяцам, миграция 00002), `goose_db_version`. | [код: internal/database/goosemigrate/migrations/00001_init.sql, 00002_audit_log_partitioning.sql] |
| 5.2 | Миграции применяет сам сервис при старте (goose, session lock Postgres). Down-миграций нет. | [код: internal/database/goosemigrate/goosemigrate.go:44], README.md:895 |
| 5.3 | Health-порт: `/live` — ничего не проверяет, всегда 200; `/` — readiness, проверяет Postgres; 503 до инициализации. | [код: cmd/easyp-svc/start.go:351-367], [стенд: live=200, ready=200] |
| 5.4 | `easyp-svc health` пробует `/live`; порт берёт из `--addr`, иначе из конфига (`--cfg`/`EASYP_CONFIG`), иначе из env/дефолта. Используется в `HEALTHCHECK` образа. | [код: cmd/easyp-svc/health.go:27-60], [код: Dockerfile:72] |
| 5.5 | При недоступной БД на старте — пинг с экспоненциальным backoff до 5 s между попытками. | [код: internal/database/sql.go:66, 120] |

## 6. Аудит

| # | Факт | Доказательство |
|---|---|---|
| 6.1 | Аудит эмитится из `internal/core` (не интерсептор) для каждой операции, успех и ошибка. | [код: internal/core/core.go:41-66, 395-429] |
| 6.2 | Счётчик `easyp_operations_total{operation,status}` пишется всегда, включая Community. | [код: internal/core/core.go:49] |
| 6.3 | Запись в аудит — только при фиче `audit` (Enterprise); иначе `audit_events_skipped_total`. | [код: internal/core/core.go:57-61] |
| 6.4 | Очередь `audit.buffer_size` (1000); ожидание места до `audit.enqueue_timeout` (1s); не нашёл места → событие теряется, `easyp_audit_events_lost_total{reason="enqueue_timeout"}`; операция при этом успешна. Другие причины: `save_failed`, `shutdown_timeout`. | [код: internal/adapters/audit/worker.go:21-25, 214-240], values.yaml:196-203 |

## 7. Аутентификация

| # | Факт | Доказательство |
|---|---|---|
| 7.1 | Единственный механизм учётных данных — статические bearer-токены (`authorization: Bearer <token>`); в конфиге — только sha256-дайджесты с именами. | [код: internal/auth/static.go:16-18, 92-110], [код: internal/config/auth.go:39-58] |
| 7.2 | По умолчанию анонимны: `GenerateCode`, `Plugins`, Health. Мутирующие `CreatePlugin/UpdatePlugin/DeletePlugin` требуют токен. Пустой `write_tokens` — запись запрещена всем. | [код: internal/api/auth_interceptor.go:82-89], [код: internal/config/auth.go:31-37], [стенд: register без токена — 2 failed; с токеном — 2 registered] |
| 7.3 | `auth.require_authentication=true` требует токен на всех RPC (кроме Health) и на MCP (HTTP 401). | [код: internal/config/auth.go:41-51], [код: cmd/easyp-svc/start.go:694-710], [стенд: MCP → 401] |
| 7.4 | TLS: `server.tls.cert_file`/`key_file`; mTLS — `client_ca_file`. Проверяется только CA, без allow-list субъектов. Без TLS сервис пишет в лог WARN `gRPC server is running WITHOUT TLS`. | [код: internal/config/config.go:121-125], README.md:916, [стенд] |
| 7.5 | Ролей, пользователей, организаций нет: токен либо есть в списке, либо нет. | README.md:860 («There is no user model»), [код: internal/auth — только static.go] |
| 7.6 | Метрика `easyp_auth_failures_total{reason}`; reason ∈ `no_credentials`, `unknown_token`. | [код: internal/api/auth_interceptor.go:35-36, 73-75] |

## 8. Лицензия и тарифы

| # | Факт | Доказательство |
|---|---|---|
| 8.1 | Community: `MaxWorkers=4`, `MaxPlugins=10`, `MaxGenerations=16`; Enterprise: `-1` (без потолка). | [код: internal/core/domain.go:339-354, 385-401] |
| 8.2 | Единственная Enterprise-only фича — `audit`. Остальные (`code_generation`, `plugin_listing`, `mcp_server_tools`, `rate_limiting`, `plugin_crud`) есть в Community. | [код: internal/license/features.go:8-46], [код: internal/core/domain.go:356-376] |
| 8.3 | `workers` и `max_concurrent_generations` при превышении **понижаются при старте** до потолка с INFO-логом `"<setting> lowered to the licence tier's limit"` — запрос не отклоняется. | [код: cmd/easyp-svc/start.go:584-592, 658-660] |
| 8.4 | `MaxPlugins` проверяется **на каждом `CreatePlugin`**: при `count >= limit` → `RESOURCE_EXHAUSTED`/`MAX_PLUGINS_EXCEEDED`. Считаются версии (строки таблицы), не уникальные плагины. | [код: internal/core/core.go:268-283] |
| 8.5 | Лицензия — PASETO v4.public, проверяется офлайн по `license.public_keys` (kid → hex Ed25519); kid берётся из footer; `"*"` — ключ для любого kid. Нет ключа → Community. | [код: internal/license/paseto_client.go:41-43, 87, 107-121, 183-200] |
| 8.6 | Истечение: grace-период `grace_days` из токена (нет поля — 0); допуск часов 1 минута. В grace — Enterprise с `in_grace=true`; после — Community с WARN в логе. | [код: internal/license/paseto_client.go:37, 234-279] |
| 8.7 | Лицензия перечитывается каждые `license.cache_ttl` (5m). | [код: internal/license/manager.go:15, 78-90] |
| 8.8 | Чарт по умолчанию содержит публичный ключ easyp.tech `"2026-08"`. | [код: deploy/charts/easyp-service/values.yaml:266-267] |
| 8.9 | Код: Elastic-2.0 для сервиса (с релизов после v0.8.0), Apache-2.0 для `api/` и `sdk/` (отдельные Go-модули). | [код: LICENSE:1-20], [код: api/LICENSE, sdk/LICENSE] |

## 9. Конфигурация

| # | Факт | Доказательство |
|---|---|---|
| 9.1 | 55 листьев конфигурации (YAML-ключ ↔ env). Полный список с дефолтами — в `configuration.mdx`, сгенерирован из `config.Leaves()`. | [команда: go run (overlay) ./cmd/zz-leaves → 55 строк], [код: internal/config/fields.go:100-176] |
| 9.2 | `grep 'env:"'` по `internal/` даёт 76 тегов: 55 листьев + 13 префиксов секций + 2 поля `WriteToken` (`NAME`, `SHA256` — элементы списка, не отдельные переменные) + дубли в `internal/ratelimiter/config.go` (3) и `internal/license/manager.go` (1) — внутренние структуры, не читаемые из окружения напрямую [не подтверждено для ratelimiter/license: проверено только, что они не входят в `Leaves()`] + 1 упоминание в комментарии `fields.go:221`. | [команда: grep -rn 'env:"' internal cmd] |
| 9.3 | Приоритет: env > YAML > `default=`; неизвестный YAML-ключ — отказ старта. | AGENTS.md, [код: internal/config] [не перепроверял построчно] |
| 9.4 | Вне структуры конфига читаются: `EASYP_CONFIG` (путь к файлу для `--cfg` всех команд), `EASYP_TOKEN` (токен клиентских команд), `OTEL_EXPORTER_OTLP_ENDPOINT` (алиас `TELEMETRY_OTLP_ENDPOINT`). | [код: cmd/easyp-svc/main.go:19,78], [код: cmd/easyp-svc/license.go:26-37], [код: internal/config/alias.go:22] |
| 9.5 | Порты по умолчанию 23410/23411/23412/23413; чарт и dev-стек переопределяют на 8080–8083. | [код: internal/config/config.go:140-143], values.yaml:86-92 |
| 9.6 | `server.max_send_msg_size` должен быть ≥ `registry.max_output_size`, иначе отказ старта. | values.yaml:150-152 [не перепроверял валидатор] |
| 9.7 | `config print --origin` на старте пишется в лог сводкой (`configuration resolved`, settings: 55). | [стенд] |

## 10. MCP

| # | Факт | Доказательство |
|---|---|---|
| 10.1 | HTTP `/mcp` (streamable), по умолчанию выключен (`mcp.enabled=false`), порт `server.port.mcp`. | [код: cmd/easyp-svc/start.go:859-871] |
| 10.2 | Один инструмент: `plugins_list` (сгенерирован из proto). | [код: api/easyp/generator/v1/generator.mcp.go:24], [код: internal/api/mcp.go:30-50] |
| 10.3 | Вне цепочки gRPC-интерсепторов: без TLS, rate limit, аудита; токен — только при `require_authentication`. | [код: cmd/easyp-svc/start.go:697-710], values.yaml:94-100, [стенд: initialize → serverInfo easyp-service-mcp] |

## 11. Установка и релизы

| # | Факт | Доказательство |
|---|---|---|
| 11.1 | Образ `ghcr.io/easyp-tech/service`: `vX.Y.Z` (релиз), `latest` (последний релиз, release.yml), `edge` (tip ветки master, edge.yml), `sha-<short>` (коммит). | [код: .github/workflows/edge.yml:11-19, 62-64], README.md:26-31 |
| 11.2 | Бинарники goreleaser: linux/darwin × amd64/arm64. | [код: .goreleaser.yaml:12-22] |
| 11.3 | Helm-чарт: `oci://ghcr.io/easyp-tech/charts/easyp-service`, публикуется release.yml; appVersion должен совпадать с тегом. | [код: .github/workflows/release.yml:72-74, 158-170] |
| 11.4 | Чарт отказывается ставиться без DSN и без решения по TLS (`tls.enabled` по умолчанию true). | values.yaml:3-20 |
| 11.5 | Три модуля тегируются отдельно и синхронно: `v1.0.2`, `api/v1.0.2`, `sdk/v1.0.2`. | AGENTS.md; easyp/go.mod требует `github.com/easyp-tech/service/api v1.0.0` |

## 12. Операторский CLI

Все команды и флаги сняты с собранного бинаря: [команда: go build -o easyp-svc ./cmd/easyp-svc; easyp-svc <cmd> --help].
Команды: `service start`, `plugins build|pack|push|register`, `auth new-token`, `api descriptor`,
`config validate|print`, `health`. **Команды `license` нет** (в промпте упомянута `auth`, `license` —
нет; в `main.go` её тоже нет). Полный список флагов — в `operator-cli.mdx`.

Примечательное:
- `plugins register --fail-on-error` по умолчанию `true`. [код: cmd/easyp-svc/main.go:546-550]
- Help `plugins register --addr` говорит «the chart publishes gRPC on 8080», дефолт — `localhost:23410`. [команда]
- `--log-level`/`--log_level` — единственный флаг, переопределяющий настройку. [команда]

## 13. Клиент: easyp CLI

| # | Факт | Доказательство |
|---|---|---|
| 13.1 | `remote:` в `generate.plugins[]`; формат `[http(s)://]host[:port]/group/name[:version]`; без версии отправляется `latest`. | [код: easyp/internal/adapters/plugin/remote.go:104-140] |
| 13.2 | TLS с системными корнями, кроме `http://` и хостов, содержащих `localhost`/`127.0.0.1` — там plaintext. Своего CA указать нельзя. | [код: easyp/internal/adapters/plugin/remote.go:58-67] |
| 13.3 | **Токен не отправляется, клиентского сертификата нет** — с `auth.require_authentication=true` или mTLS на listener CLI работать не может. | [код: remote.go — нет metadata/authorization], [стенд: `code = Unauthenticated desc = valid credentials are required for /easyp.generator.v1.GeneratorAPI/GenerateCode`] |
| 13.4 | Таймаут вызова захардкожен: 30 s (серверный `generation_timeout` по умолчанию 120 s). | [код: easyp/internal/adapters/plugin/remote.go:55] |
| 13.5 | Новое gRPC-соединение на каждый вызов плагина. | [код: remote.go:69-80] |
| 13.6 | `opts` склеиваются в `CodeGeneratorRequest.parameter`. | [код: remote.go:88-90] |
| 13.7 | У CLI нет специальной обработки `buf.build`: `remote: buf.build/protocolbuffers/go` будет трактоваться как хост `buf.build` + плагин `protocolbuffers/go:latest` по протоколу `easyp.generator.v1.GeneratorAPI` — BSR этот протокол не реализует [не подтверждено экспериментом против buf.build]. | [код: remote.go:104-140; grep `buf.build` по easyp/*.go — пусто] |
| 13.8 | Приоритет исполнителей: `command` > `remote` > встроенный WASM (если плагин не в PATH) > локальный. | [код: easyp/internal/core/generate.go:490-505] |

## 14. Go SDK

| # | Факт | Доказательство |
|---|---|---|
| 14.1 | Модуль `github.com/easyp-tech/service/sdk`, Apache-2.0. | [код: sdk/go.mod, sdk/LICENSE] |
| 14.2 | Дефолты: TLS с системными корнями, 3 ретрая, base 100 ms, max 5 s, GenerateCode 30 s, ListPlugins 10 s, CreatePlugin 120 s, health-check 30 s, max recv 64 MiB. | [код: sdk/config.go:44-67] |
| 14.3 | Ретраится только `Unavailable`. | [код: sdk/retry.go:56-75] |
| 14.4 | Опции: `WithInsecure`, `WithTransportCredentials`, `WithToken`, `WithMaxRecvMsgSize`, `WithMaxRetries`, `WithRetryBaseDelay`, `WithRetryMaxDelay`, `WithCreatePluginTimeout`, `WithGenerateCodeTimeout`, `WithListPluginsTimeout`, `WithUnaryInterceptor`, `WithLoggingInterceptor`, `WithMetricsInterceptor`, `WithHealthCheck`, `WithKeepaliveParams`; для списка — `WithFilter(PluginFilter{Group,Name,Version,Tags})`. | [код: sdk/config.go:82-212], [код: sdk/filter.go:9-37] |
| 14.5 | Методы: `GenerateCode`, `ListPlugins` (обходит все страницы), `CreatePlugin`, `UpdatePlugin`, `DeletePlugin`, `Close`. | [код: sdk/client.go:25-261] |

## 15. Метрики (снято с работающего сервиса + код)

[стенд: `curl localhost:23411/metrics`] — 46 семейств с префиксом `easyp_` видны сразу; ещё 7 регистрируются лениво
или только при S3: `easyp_generation_errors_total{plugin,error_type}`, `easyp_generation_retries_total{plugin}`,
`easyp_auth_failures_total{reason}`, `easyp_plugin_cache_bytes`, `easyp_plugin_cache_evictions_total`,
`easyp_plugin_cache_limit_bytes` [код: internal/adapters/metrics/metrics.go:47-59, internal/api/auth_interceptor.go:73,
internal/adapters/registry/cache.go:75-98]. `error_type` ∈ {`transient`,`permanent`} [код: internal/core/pool.go:406-409].
`easyp_panics_total` **без лейблов** [код: internal/safe/safe.go:59-63].
Полная таблица — `observability.mdx`.

## 16. Каталог плагинов

- [команда: `find registry -name plugin.yaml | wc -l`] → **80** плагинов в 10 вендорах.
- [команда: `npm run sync:plugins -- --ref v1.0.2` (разбор `plugin.yaml` библиотекой `yaml`, без `skip: true`)] → **1743** версий.
  Первоначально здесь стояло 1738: awk-подсчёт обрывался на строках-комментариях внутри `versions:`
  (`connectrpc/python` −1, `grpc/swift-protobuf` −4). Исправлено во всех страницах и отчётах.
- Формат: `registry/<vendor>/<name>/{Dockerfile,plugin.yaml}`; `plugin.yaml` = `build_args` + список `versions`;
  Dockerfile собирает `/plugin` (entrypoint обязан называться `plugin`). [код: registry/protocolbuffers/go/plugin.yaml], AGENTS.md.

## Локальный стенд (как проверялось)

`docker compose` в scratchpad (не в `service/`): `postgres:17-alpine` + `ghcr.io/easyp-tech/service:v1.0.2`,
конфигурация только через env (`DB_POSTGRES_DSN`, `AUTH_WRITE_TOKENS`, `MCP_ENABLED`), порты по умолчанию,
локальный режим без S3, два бинарника `protoc-gen-go` v1.36.9 и v1.36.10, собранные `GOOS=linux go install`.
Токен — `easyp-svc auth new-token --name qs`. Регистрация — `easyp-svc plugins register --insecure --addr localhost:23410`.
Генерация — `easyp` CLI, собранный из `easyp/` (`a1f6e44`). Стенд удалён (`docker compose down -v`).
Полный compose-стек из `service/deploy/docker-compose.yml` не поднимался: `task up` пишет сертификаты и артефакты
внутрь `service/`, что за границами задачи; проверено только `docker compose -f deploy/docker-compose.yml config --quiet` → OK.
