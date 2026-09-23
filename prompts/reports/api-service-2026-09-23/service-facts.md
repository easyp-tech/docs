Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Факты EasyP API Service

Ревизии: service <code>4b01518b42c6f448d21216e3c0e8c35ef66d5c2d</code>; CLI <code>a1f6e44d5756970cc0eca67ad7a093687dc01cf2</code>; исходная документация <code>5fd544999f79a8306554ed4a1d4f1afd841bbd24</code>. Дата проверки 2026-09-23. [команда: git rev-parse HEAD в каждом отдельном клоне]

## Wire API

GenerateCode, Plugins, CreatePlugin, UpdatePlugin, DeletePlugin — полный набор RPC; GeneratorAPI, не ServiceAPI. [код: service/api/easyp/generator/v1/generator.proto:67]

## Порядок цепочки

error_code_conversion — самый внутренний прикладной interceptor; auth/limiter не проходят через него. Trace/IP/Prometheus/log/recovery/validation стоят раньше. [код: service/internal/grpchelper/server.go:204] [код: service/internal/grpchelper/server.go:119]

## Фактическая валидация

Само наличие validate-аннотаций proto не создаёт Validate/ValidateAll. В API исходниках методов нет; middleware проверяет интерфейсы. Полагаться нужно на ручные проверки. [код: service/internal/grpchelper/server.go:196]

## Путь генерации

Core получает плагин через pool, затем выполняет GenerateCode; результат proto.error не превращается автоматически в gRPC failure. [код: service/internal/core/core.go:68] [код: service/internal/core/pool.go:386]

## Версии

latest разрешается ORDER BY version DESC, то есть текстовая сортировка, не SemVer/created_at. [код: service/internal/adapters/registry/registry.go:220]

## Исполнитель

exec.CommandContext запускает локальный процесс без Docker sandbox; Env задаётся явно, cmd.Dir не задаётся. Path/symlink containment не ограничивает сеть/права исполняемого кода. [код: service/internal/adapters/registry/registry.go:472] [код: service/internal/adapters/registry/registry.go:475]

## Контекст отмены

Процессу назначается группа; отмена может завершать группу. Это не изоляция злонамеренного executable. [код: service/internal/adapters/registry/registry.go:484] [код: service/internal/adapters/registry/registry.go:520]

## Вывод

Дефолт stdout 67108864 байт, stderr 1048576 байт. Не является ограничением памяти/CPU процесса. [код: service/internal/config/config.go:173] [код: service/internal/adapters/registry/registry.go:39]

## WorkerPool

Lookup workers и semaphore генерации — разные ресурсы. Get неблокирующе допускает lookup в очередь, отказ ErrServerOverloaded. [код: service/internal/core/pool.go:319] [код: service/internal/core/pool.go:215]

## Конкурентность

Очередь lookup и ожидания генерации отдельно используют queue_size; execution timeout начинается после допуска генерации, retries повторяют распознанные временные execution failures. [код: service/internal/core/pool.go:386] [код: service/internal/config/config.go:265]

## БД обязательна

PostgreSQL хранит metadata; миграции до readiness. Ни бинарники плагинов, ни сгенерированные output files не хранятся таблицей регистраций. [код: service/internal/database/goosemigrate/migrations/00001_init.sql:2] [код: service/cmd/easyp-svc/start.go:35]

## Local / S3

S3 выключен при пустом bucket. Local-only требует готовые файлы в plugins_dir; S3-режим скачивает архив в локальный кэш. [код: service/cmd/easyp-svc/start.go:901] [код: service/internal/adapters/registry/registry.go:212]

## S3 object layout

Архив plugin.tgz расположен по prefix/group/name/version; push должен предшествовать S3 registration. [код: service/internal/adapters/registry/registry.go:269] [код: service/cmd/easyp-svc/push.go:72]

## SHA-256

Create/update конфигурации получает checksum архива; cold download проверяет сохранённый хеш при наличии; warm hit не хеширует executable заново. [код: service/internal/adapters/registry/registry.go:7] [код: service/internal/adapters/registry/registry.go:62]

## Загрузка и распаковка

Singleflight действует внутри процесса. Распаковка во временный каталог с удалением старого и rename не является атомарной заменой каталога. [код: service/internal/adapters/registry/registry.go:26] [код: service/internal/plugarchive/plugarchive.go:184] [код: service/internal/plugarchive/plugarchive.go:143]

## Кэш

20 GiB soft LRU budget; 0 выключает eviction. Нет межпроцессной координации; shared RWX не создаёт безопасный HA-кэш. [код: service/internal/config/config.go:182] [код: service/internal/adapters/registry/cache.go:20]

## CRUD / S3 delete

Delete после metadata пытается удалить объект и локальные файлы; не общая транзакция. SDK-комментарий о сохранении S3 не соответствует серверу. [код: service/internal/adapters/registry/registry.go:736] [код: service/sdk/client.go:239]

## Список

Exact group/name/version, AND tags, page_size default100/max1000, keyset pagination. Ответ metadata не содержит конфигурацию команды. [код: service/internal/api/plugins_list.go:18] [код: service/internal/api/pagetoken.go:30] [код: service/api/easyp/generator/v1/generator.proto:251]

## Bearer

Статический allowlist digest SHA-256; имя — audit label. Нет разных scopes/ролей для разных токенов; мутации требуют токен и в Community. [код: service/internal/auth/static.go:5] [код: service/internal/api/auth_interceptor.go:129] [код: service/internal/config/auth.go:39]

## Anonymous reads

require_authentication=false обходит auth для GenerateCode/Plugins, не устанавливая actor даже при переданном токене; true требует тот же write-capable token. [код: service/internal/api/auth_interceptor.go:48] [код: service/internal/config/auth.go:51]

## TLS / mTLS

TLS минимум1.3; client CA включает VerifyClientCert, но не заменяет bearer gate и не создаёт прикладные роли. [код: service/internal/grpchelper/tls.go:43] [код: service/internal/grpchelper/tls.go:53]

## Лицензионные потолки

Community: 4 lookup workers, 10 зарегистрированных версий, 16 генераций; Enterprise -1 означает отсутствие license ceiling, не конфигурацию. [код: service/internal/core/domain.go:356] [код: service/internal/core/domain.go:378]

## Enterprise-only

Audit — Enterprise; CRUD, rate limiting, MCP, generation доступны Community. Комментарии proto про Enterprise-only CRUD не применяются. [код: service/internal/license/features.go:38] [код: service/internal/core/core.go:58]

## Refresh vs startup

Startup клампит workers/generations по claims; refresh меняет claims и gate, не пересоздаёт пул. Existing plugin rows не удаляются при downgrade. [код: service/cmd/easyp-svc/start.go:660] [код: service/internal/license/manager.go:19]

## PASETO

Offline PASETO v4.public Ed25519, issuer easyp.tech, audience easyp-service; grace_days default0 и clock skew1min. [код: service/internal/license/paseto_client.go:29] [код: service/internal/license/paseto_client.go:244]

## Лицензия после истечения

После exp+grace обычная проверка возвращает Community claims; unexpected verifier error удерживает прошлые claims. Public-key parse и unreadable license file могут останавливать старт. [код: service/internal/license/paseto_client.go:142] [код: service/internal/license/manager.go:113] [код: service/internal/config/config.go:903]

## Нет file hot reload

license.key приоритетнее license.file; файл читается при конфигурации, refresh перепроверяет кешированный token. cache_ttl default5min. [код: service/internal/config/config.go:903] [код: service/internal/license/manager.go:15]

## Audit emit

Core emits after outcome; rejected earlier interceptors отсутствуют в Core audit. Community increases skipped metrics. [код: service/internal/core/core.go:20] [код: service/internal/core/core.go:58]

## Audit losses

Queue1000,batch100,flush1s,enqueue1s,flushbudget5s,max_save_retries3additional. Enqueue wait survives context cancellation; losses are not replayed. [код: service/internal/config/config.go:372] [код: service/internal/adapters/audit/worker.go:230] [код: service/internal/adapters/audit/worker.go:24]

## Партиции

Миграция2 копирует прежнюю таблицу в месячные UTC partitions. Current+3future,period6h,retention12strictmonthcutoff; DEFAULT не удаляется автоматически. [код: service/internal/database/goosemigrate/migrations/00002_audit_log_partitioning.sql:72] [код: service/internal/adapters/audit/partitions.go:196]

## Audit gauges

DEFAULT occupancy sampled by maintenance, not per scrape; current-partition count can be stale; created counter counts IF NOT EXISTS successes, not only newly created tables. [код: service/internal/adapters/audit/partitions.go:327] [код: service/internal/adapters/audit/partitions.go:278]

## Readiness / liveness

HTTP /live independent from DB; HTTP / checks PostgreSQL after startup. gRPC health is not database-aware readiness. Health CLI GET /live timeout3s. [код: service/cmd/easyp-svc/start.go:351] [код: service/cmd/easyp-svc/health.go:20] [код: service/cmd/easyp-svc/start.go:17]

## MCP

Только plugins_list; отдельный HTTP /mcp. gRPC TLS/interceptors на него не распространяются. HTTP bearer wrapper uses same require_authentication setting. [код: service/api/easyp/generator/v1/generator.mcp.go:24] [код: service/internal/api/mcp.go:8] [код: service/internal/api/mcp_tools.go:14]

## MCP версия

Строка implementation version v1.0.0 жёстко задана и не идентифицирует server release1.0.2. [код: service/internal/api/mcp.go:39]

## OTLP

OTLP/gRPC traces AND metrics, 15s periodic reader; bare host endpoint insecure, https selects TLS; not an OTLP log exporter. [код: service/internal/telemetry/telemetry.go:145] [код: service/internal/telemetry/telemetry.go:52]

## Pyroscope

Профили Go service process, а не CPU-профили child executable. Trace attributes plugin-specific, OTel/log trace propagation enabled. [код: service/internal/telemetry/telemetry.go:175] [код: service/internal/telemetry/tracing_plugin.go:63]

## Метрики

Prom namespace easyp, RPC subsystem api, DAL subsystem repo, standard go/process collectors. Labels/default audit freshness описаны на observability. [код: service/cmd/easyp-svc/start.go:46] [код: service/internal/grpchelper/metrics.go:12] [код: service/internal/database/metrics.go:29]

## Алерты

11 application rules Helm и6host/discovery/edge rules Compose;17runbookanchorsсохранены. generation_errors/lookupjobs ≠ доля failed userRPC. [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:151] [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:23]

## Docker runtime

Debian bookworm-slim UID/GID65532; ENTRYPOINT /easyp-svc без CMD; запуск требует service start. Health отдельныйпроцесс EASYP_CONFIG. [код: service/Dockerfile:78] [код: service/Dockerfile:72]

## Релизы

vX.Y.Z/latest черезrelease, edge/sha7черезmasterworkflow; linuxamd64/arm64image; darwin/linuxamd64/arm64binaries. Публикация в GHCR НЕ выполнялась. [код: service/.github/workflows/release.yml:27] [код: service/.github/workflows/edge.yml:16] [код: service/.goreleaser.yaml:18]

## Helm

Chart1.0.2appVersionv1.0.2,117leafvalues. DefaultoneRecreateRWO;checksRWXdonotproveHA;externalPG/secretTLSrequired. [код: service/deploy/charts/easyp-service/Chart.yaml:54] [код: service/deploy/charts/easyp-service/templates/deployment.yaml:18] [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:172]

## Helm network

MCP ingress отсутствует в template NetworkPolicy; ports allowlist не destination allowlist. Ingress TLS guard требуетclientcertevenserveronly. [код: service/deploy/charts/easyp-service/templates/networkpolicy.yaml:15] [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:72]

## Developer CLI

Direct EasyP GeneratorAPI remote URL, no EASYP_TOKEN/bearer/clientcert/customCAconfig;30scontext;4MiBdefaultgrpcclientrecvvs64MiBserver. [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54]

## SDK

TLS default, WithToken/mTLScreds,64MiBrecv,3additionalUnavailable retry backoff100ms..5s;Generate30s,List10sperpage,CRUD120s;Healthconnectivityonly. [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7]

## CLI operator

Actualhelpverified16calls;pluginsbuild/pack/push/register/config/auth/api/health. registercfgrawyaml vsfullconfigelsewhere, EASYP_TOKENclientfallback. [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/register.go:81]

## force mismatch

push --force changes archive; register skips AlreadyExists and does not update checksum. Warm cache remains until explicit invalidation/eviction. [код: service/cmd/easyp-svc/register.go:367] [код: service/cmd/easyp-svc/push.go:44]

## Каталог

80plugin.yaml,1743versions,10vendors;metadata counts, not validatedbinaryavailability. [код: service/cmd/easyp-svc/build.go:31]

## Builder не контейнер runtime

Docker export emits final rootfs under plugin path; normalize only verifies regular /plugin and chmod. No root relocation/chroot/entrypoint execution. [код: service/cmd/easyp-svc/build.go:483] [код: service/cmd/easyp-svc/build.go:515]

## bufbuild/es неверные версии

package.json pins protoc-gen-es2.9.0, Dockerfile npmci ignores requestedVERSION. packagejson+lockbyte-identicalBufv2.9.0; wrappers use absolute/nodejs/app paths. [код: service/registry/bufbuild/es/package.json:3] [код: service/registry/bufbuild/es/Dockerfile:6] [код: service/registry/bufbuild/es/Dockerfile:20]

## Лицензия сервиса

Elastic-2.0server,Apache2api/sdk;sourceavailable notunrestrictedOSS;pluginupstreamlicencesseparate. [код: service/LICENSE:7] [код: service/api/LICENSE:1] [код: service/sdk/LICENSE:1]

## Проверки поведений

- <code>go build ./...</code> завершился0. [команда: cd service && go build ./...]
- Выбранные unit packages config/core/api/auth/license/ratelimiter/plugarchive прошли. [команда: go test ./internal/config ./internal/core ./internal/api ./internal/auth ./internal/license ./internal/ratelimiter ./internal/plugarchive]
- Probe вне репозитория: ErrorToStatus(raw InvalidArgument) → Internal; wrapped generation DeadlineExceeded → Internal/GENERATION_FAILED; bare DeadlineExceeded → DeadlineExceeded; ErrServerOverloaded → ResourceExhausted/SERVER_OVERLOADED. [команда: cd scratch/probe && go run .]
- config.Defaults+config.Leaves реально вызваны;55leafsettings. [команда: scratch/probe/main.go, configuration-leaves.json]
- Все16вариантов --help имеют exit0, тексты сохранены и включены в operator-cli. [команда: scratch/easyp-svc <command> --help]
- Локальный Docker build сервиса и protocolbuffers/go:v1.36.11 прошли; запуск completegeneration не состоялся. [команда: docker build --build-arg VERSION=v1.0.2-audit -t easyp-api-docs-audit:local service] [команда: easyp-svc plugins build --filter protocolbuffers/go:v1.36.11 --output scratch/demo/plugins --parallel 1 --non-interactive service/registry]
- Нельзя считать go test proof end-to-end/Postgres/S3/authMCP/Helmrestore. Эти сценарии не выполнены. [не подтверждено]

## Все настройки: YAML → env → тип → фактический дефолт

| YAML | env | Тип | Дефолт | Доказательство |
| --- | --- | --- | --- | --- |
| <code>server.host</code> | <code>SERVER&#95;HOST</code> | <code>string</code> | <code>0.0.0.0</code> | [код: service/internal/config/config.go:53] [команда: config.Defaults + config.Leaves] |
| <code>server.port.grpc</code> | <code>SERVER&#95;PORT&#95;GRPC</code> | <code>string</code> | <code>23410</code> | [код: service/internal/config/config.go:140] [команда: config.Defaults + config.Leaves] |
| <code>server.port.metric</code> | <code>SERVER&#95;PORT&#95;METRIC</code> | <code>string</code> | <code>23411</code> | [код: service/internal/config/config.go:141] [команда: config.Defaults + config.Leaves] |
| <code>server.port.health</code> | <code>SERVER&#95;PORT&#95;HEALTH</code> | <code>string</code> | <code>23412</code> | [код: service/internal/config/config.go:142] [команда: config.Defaults + config.Leaves] |
| <code>server.port.mcp</code> | <code>SERVER&#95;PORT&#95;MCP</code> | <code>string</code> | <code>23413</code> | [код: service/internal/config/config.go:34] [команда: config.Defaults + config.Leaves] |
| <code>server.tls.cert&#95;file</code> | <code>SERVER&#95;TLS&#95;CERT&#95;FILE</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:121] [команда: config.Defaults + config.Leaves] |
| <code>server.tls.key&#95;file</code> | <code>SERVER&#95;TLS&#95;KEY&#95;FILE</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:122] [команда: config.Defaults + config.Leaves] |
| <code>server.tls.client&#95;ca&#95;file</code> | <code>SERVER&#95;TLS&#95;CLIENT&#95;CA&#95;FILE</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:125] [команда: config.Defaults + config.Leaves] |
| <code>server.force&#95;shutdown&#95;after</code> | <code>SERVER&#95;FORCE&#95;SHUTDOWN&#95;AFTER</code> | <code>time.Duration</code> | <code>2m30s</code> | [код: service/internal/config/config.go:61] [команда: config.Defaults + config.Leaves] |
| <code>server.trusted&#95;proxies</code> | <code>SERVER&#95;TRUSTED&#95;PROXIES</code> | <code>[]string</code> | <code>[]</code> | [код: service/internal/config/config.go:73] [команда: config.Defaults + config.Leaves] |
| <code>server.max&#95;recv&#95;msg&#95;size</code> | <code>SERVER&#95;MAX&#95;RECV&#95;MSG&#95;SIZE</code> | <code>int</code> | <code>67108864</code> | [код: service/internal/config/config.go:84] [команда: config.Defaults + config.Leaves] |
| <code>server.max&#95;send&#95;msg&#95;size</code> | <code>SERVER&#95;MAX&#95;SEND&#95;MSG&#95;SIZE</code> | <code>int</code> | <code>67108864</code> | [код: service/internal/config/config.go:85] [команда: config.Defaults + config.Leaves] |
| <code>server.max&#95;concurrent&#95;streams</code> | <code>SERVER&#95;MAX&#95;CONCURRENT&#95;STREAMS</code> | <code>uint32</code> | <code>256</code> | [код: service/internal/config/config.go:91] [команда: config.Defaults + config.Leaves] |
| <code>db.postgres</code> | <code>DB&#95;POSTGRES&#95;DSN</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:167] [команда: config.Defaults + config.Leaves] |
| <code>registry.plugins&#95;dir</code> | <code>REGISTRY&#95;PLUGINS&#95;DIR</code> | <code>string</code> | <code>/plugins</code> | [код: service/internal/config/config.go:172] [команда: config.Defaults + config.Leaves] |
| <code>registry.max&#95;output&#95;size</code> | <code>REGISTRY&#95;MAX&#95;OUTPUT&#95;SIZE</code> | <code>int64</code> | <code>67108864</code> | [код: service/internal/config/config.go:173] [команда: config.Defaults + config.Leaves] |
| <code>registry.cache&#95;max&#95;bytes</code> | <code>REGISTRY&#95;CACHE&#95;MAX&#95;BYTES</code> | <code>int64</code> | <code>21474836480</code> | [код: service/internal/config/config.go:182] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.endpoint</code> | <code>REGISTRY&#95;S3&#95;ENDPOINT</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:197] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.bucket</code> | <code>REGISTRY&#95;S3&#95;BUCKET</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:198] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.region</code> | <code>REGISTRY&#95;S3&#95;REGION</code> | <code>string</code> | <code>us-east-1</code> | [код: service/internal/config/config.go:199] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.prefix</code> | <code>REGISTRY&#95;S3&#95;PREFIX</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:200] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.access&#95;key&#95;id</code> | <code>REGISTRY&#95;S3&#95;ACCESS&#95;KEY&#95;ID</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:201] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.secret&#95;access&#95;key</code> | <code>REGISTRY&#95;S3&#95;SECRET&#95;ACCESS&#95;KEY</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:202] [команда: config.Defaults + config.Leaves] |
| <code>registry.s3.force&#95;path&#95;style</code> | <code>REGISTRY&#95;S3&#95;FORCE&#95;PATH&#95;STYLE</code> | <code>bool</code> | <code>false</code> | [код: service/internal/config/config.go:203] [команда: config.Defaults + config.Leaves] |
| <code>telemetry.otlp&#95;endpoint</code> | <code>TELEMETRY&#95;OTLP&#95;ENDPOINT</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:233] [команда: config.Defaults + config.Leaves] |
| <code>telemetry.pyroscope&#95;endpoint</code> | <code>TELEMETRY&#95;PYROSCOPE&#95;ENDPOINT</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:234] [команда: config.Defaults + config.Leaves] |
| <code>telemetry.service&#95;tier</code> | <code>TELEMETRY&#95;SERVICE&#95;TIER</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:245] [команда: config.Defaults + config.Leaves] |
| <code>worker&#95;pool.workers</code> | <code>WORKER&#95;POOL&#95;WORKERS</code> | <code>int</code> | <code>4</code> | [код: service/internal/config/config.go:257] [команда: config.Defaults + config.Leaves] |
| <code>worker&#95;pool.queue&#95;size</code> | <code>WORKER&#95;POOL&#95;QUEUE&#95;SIZE</code> | <code>int</code> | <code>16</code> | [код: service/internal/config/config.go:258] [команда: config.Defaults + config.Leaves] |
| <code>worker&#95;pool.max&#95;concurrent&#95;generations</code> | <code>WORKER&#95;POOL&#95;MAX&#95;CONCURRENT&#95;GENERATIONS</code> | <code>int</code> | <code>16</code> | [код: service/internal/config/config.go:263] [команда: config.Defaults + config.Leaves] |
| <code>worker&#95;pool.generation&#95;timeout</code> | <code>WORKER&#95;POOL&#95;GENERATION&#95;TIMEOUT</code> | <code>time.Duration</code> | <code>2m0s</code> | [код: service/internal/config/config.go:265] [команда: config.Defaults + config.Leaves] |
| <code>worker&#95;pool.max&#95;retries</code> | <code>WORKER&#95;POOL&#95;MAX&#95;RETRIES</code> | <code>int</code> | <code>2</code> | [код: service/internal/config/config.go:266] [команда: config.Defaults + config.Leaves] |
| <code>worker&#95;pool.shutdown&#95;timeout</code> | <code>WORKER&#95;POOL&#95;SHUTDOWN&#95;TIMEOUT</code> | <code>time.Duration</code> | <code>30s</code> | [код: service/internal/config/config.go:267] [команда: config.Defaults + config.Leaves] |
| <code>license.key</code> | <code>LICENSE&#95;KEY</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:280] [команда: config.Defaults + config.Leaves] |
| <code>license.file</code> | <code>LICENSE&#95;FILE</code> | <code>string</code> | <code>""</code> | [код: service/internal/config/config.go:282] [команда: config.Defaults + config.Leaves] |
| <code>license.public&#95;keys</code> | <code>LICENSE&#95;PUBLIC&#95;KEYS</code> | <code>map[string]string</code> | <code>map[]</code> | [код: service/internal/config/config.go:299] [команда: config.Defaults + config.Leaves] |
| <code>license.cache&#95;ttl</code> | <code>LICENSE&#95;CACHE&#95;TTL</code> | <code>time.Duration</code> | <code>5m0s</code> | [код: service/internal/config/config.go:306] [команда: config.Defaults + config.Leaves] |
| <code>rate&#95;limit.requests&#95;per&#95;second</code> | <code>RATE&#95;LIMIT&#95;REQUESTS&#95;PER&#95;SECOND</code> | <code>float64</code> | <code>10</code> | [код: service/internal/config/config.go:354] [команда: config.Defaults + config.Leaves] |
| <code>rate&#95;limit.burst</code> | <code>RATE&#95;LIMIT&#95;BURST</code> | <code>int</code> | <code>20</code> | [код: service/internal/config/config.go:355] [команда: config.Defaults + config.Leaves] |
| <code>rate&#95;limit.cleanup&#95;interval</code> | <code>RATE&#95;LIMIT&#95;CLEANUP&#95;INTERVAL</code> | <code>time.Duration</code> | <code>10m0s</code> | [код: service/internal/config/config.go:356] [команда: config.Defaults + config.Leaves] |
| <code>rate&#95;limit.max&#95;concurrent&#95;per&#95;ip</code> | <code>RATE&#95;LIMIT&#95;MAX&#95;CONCURRENT&#95;PER&#95;IP</code> | <code>int</code> | <code>2</code> | [код: service/internal/config/config.go:361] [команда: config.Defaults + config.Leaves] |
| <code>audit.buffer&#95;size</code> | <code>AUDIT&#95;BUFFER&#95;SIZE</code> | <code>int</code> | <code>1000</code> | [код: service/internal/config/config.go:367] [команда: config.Defaults + config.Leaves] |
| <code>audit.batch&#95;size</code> | <code>AUDIT&#95;BATCH&#95;SIZE</code> | <code>int</code> | <code>100</code> | [код: service/internal/config/config.go:368] [команда: config.Defaults + config.Leaves] |
| <code>audit.flush&#95;interval</code> | <code>AUDIT&#95;FLUSH&#95;INTERVAL</code> | <code>time.Duration</code> | <code>1s</code> | [код: service/internal/config/config.go:369] [команда: config.Defaults + config.Leaves] |
| <code>audit.max&#95;save&#95;retries</code> | <code>AUDIT&#95;MAX&#95;SAVE&#95;RETRIES</code> | <code>int</code> | <code>3</code> | [код: service/internal/config/config.go:370] [команда: config.Defaults + config.Leaves] |
| <code>audit.enqueue&#95;timeout</code> | <code>AUDIT&#95;ENQUEUE&#95;TIMEOUT</code> | <code>time.Duration</code> | <code>1s</code> | [код: service/internal/config/config.go:376] [команда: config.Defaults + config.Leaves] |
| <code>audit.flush&#95;timeout</code> | <code>AUDIT&#95;FLUSH&#95;TIMEOUT</code> | <code>time.Duration</code> | <code>5s</code> | [код: service/internal/config/config.go:380] [команда: config.Defaults + config.Leaves] |
| <code>audit.retention&#95;months</code> | <code>AUDIT&#95;RETENTION&#95;MONTHS</code> | <code>int</code> | <code>12</code> | [код: service/internal/config/config.go:383] [команда: config.Defaults + config.Leaves] |
| <code>audit.pre&#95;create&#95;months</code> | <code>AUDIT&#95;PRE&#95;CREATE&#95;MONTHS</code> | <code>int</code> | <code>3</code> | [код: service/internal/config/config.go:384] [команда: config.Defaults + config.Leaves] |
| <code>audit.partition&#95;check&#95;interval</code> | <code>AUDIT&#95;PARTITION&#95;CHECK&#95;INTERVAL</code> | <code>time.Duration</code> | <code>6h0m0s</code> | [код: service/internal/config/config.go:385] [команда: config.Defaults + config.Leaves] |
| <code>audit.partition&#95;op&#95;timeout</code> | <code>AUDIT&#95;PARTITION&#95;OP&#95;TIMEOUT</code> | <code>time.Duration</code> | <code>30s</code> | [код: service/internal/config/config.go:386] [команда: config.Defaults + config.Leaves] |
| <code>auth.write&#95;tokens</code> | <code>AUTH&#95;WRITE&#95;TOKENS</code> | <code>config.TokenList</code> | <code>[]</code> | [код: service/internal/config/auth.go:39] [команда: config.Defaults + config.Leaves] |
| <code>auth.require&#95;authentication</code> | <code>AUTH&#95;REQUIRE&#95;AUTHENTICATION</code> | <code>bool</code> | <code>false</code> | [код: service/internal/config/auth.go:51] [команда: config.Defaults + config.Leaves] |
| <code>mcp.enabled</code> | <code>MCP&#95;ENABLED</code> | <code>bool</code> | <code>false</code> | [код: service/internal/config/config.go:48] [команда: config.Defaults + config.Leaves] |
| <code>log.level</code> | <code>LOG&#95;LEVEL</code> | <code>string</code> | <code>info</code> | [код: service/internal/config/config.go:158] [команда: config.Defaults + config.Leaves] |

## Полный raw grep env-тегов

Ниже сохранён каждый совпавший env-тег internal, включая prefix-узлы, комментарий, вложенные поля TokenList и вторичные конфигурационные структуры. 55 runtime leaves не должны механически равняться числу строк grep. TokenList NAME/SHA256 описаны как nested YAML поля и декодируются через AUTH_WRITE_TOKENS. internal/ratelimiter.Config и internal/license.Config создаются из разрешённого главного config, не образуют независимую дополнительную загрузку окружения. [команда: Python rglob internal/*.go, env:" без *_test.go] [код: service/cmd/easyp-svc/start.go:777]

- <code>WriteTokens TokenList env:"WRITE&#95;TOKENS" yaml:"write&#95;tokens"</code> [код: service/internal/config/auth.go:39]
- <code>RequireAuthentication bool env:"REQUIRE&#95;AUTHENTICATION,default=false" yaml:"require&#95;authentication"</code> [код: service/internal/config/auth.go:51]
- <code>Name   string env:"NAME"   yaml:"name"</code> [код: service/internal/config/auth.go:57]
- <code>SHA256 string env:"SHA256" yaml:"sha256"</code> [код: service/internal/config/auth.go:58]
- <code>Server     Server           env:", prefix=SERVER&#95;"      yaml:"server"</code> [код: service/internal/config/config.go:25]
- <code>DB         DBConfig         env:", prefix=DB&#95;"          yaml:"db"</code> [код: service/internal/config/config.go:26]
- <code>Registry   RegistryConfig   env:", prefix=REGISTRY&#95;"    yaml:"registry"</code> [код: service/internal/config/config.go:27]
- <code>Telemetry  TelemetryConfig  env:", prefix=TELEMETRY&#95;"   yaml:"telemetry"</code> [код: service/internal/config/config.go:28]
- <code>WorkerPool WorkerPoolConfig env:", prefix=WORKER&#95;POOL&#95;" yaml:"worker&#95;pool"</code> [код: service/internal/config/config.go:29]
- <code>License    LicenseConfig    env:", prefix=LICENSE&#95;"     yaml:"license"</code> [код: service/internal/config/config.go:30]
- <code>RateLimit  RateLimitConfig  env:", prefix=RATE&#95;LIMIT&#95;"  yaml:"rate&#95;limit"</code> [код: service/internal/config/config.go:31]
- <code>Audit      AuditConfig      env:", prefix=AUDIT&#95;"       yaml:"audit"</code> [код: service/internal/config/config.go:32]
- <code>Auth       AuthConfig       env:", prefix=AUTH&#95;"        yaml:"auth"</code> [код: service/internal/config/config.go:33]
- <code>MCP        MCPConfig        env:", prefix=MCP&#95;"         yaml:"mcp"</code> [код: service/internal/config/config.go:34]
- <code>Log        LogConfig        env:", prefix=LOG&#95;"         yaml:"log"</code> [код: service/internal/config/config.go:35]
- <code>Enabled bool env:"ENABLED,default=false" yaml:"enabled"</code> [код: service/internal/config/config.go:48]
- <code>Host string    env:"HOST, default=0.0.0.0" yaml:"host"</code> [код: service/internal/config/config.go:53]
- <code>Port Ports     env:", prefix=PORT&#95;"        yaml:"port"</code> [код: service/internal/config/config.go:54]
- <code>TLS  TLSConfig env:", prefix=TLS&#95;"         yaml:"tls"</code> [код: service/internal/config/config.go:55]
- <code>ForceShutdownAfter time.Duration env:"FORCE&#95;SHUTDOWN&#95;AFTER,default=150s" yaml:"force&#95;shutdown&#95;after"</code> [код: service/internal/config/config.go:61]
- <code>TrustedProxies []string env:"TRUSTED&#95;PROXIES" yaml:"trusted&#95;proxies"</code> [код: service/internal/config/config.go:73]
- <code>MaxRecvMsgSize int env:"MAX&#95;RECV&#95;MSG&#95;SIZE,default=67108864" yaml:"max&#95;recv&#95;msg&#95;size"</code> [код: service/internal/config/config.go:84]
- <code>MaxSendMsgSize int env:"MAX&#95;SEND&#95;MSG&#95;SIZE,default=67108864" yaml:"max&#95;send&#95;msg&#95;size"</code> [код: service/internal/config/config.go:85]
- <code>MaxConcurrentStreams uint32 env:"MAX&#95;CONCURRENT&#95;STREAMS,default=256" yaml:"max&#95;concurrent&#95;streams"</code> [код: service/internal/config/config.go:91]
- <code>CertFile string env:"CERT&#95;FILE" yaml:"cert&#95;file"</code> [код: service/internal/config/config.go:121]
- <code>KeyFile  string env:"KEY&#95;FILE"  yaml:"key&#95;file"</code> [код: service/internal/config/config.go:122]
- <code>ClientCAFile string env:"CLIENT&#95;CA&#95;FILE" yaml:"client&#95;ca&#95;file"</code> [код: service/internal/config/config.go:125]
- <code>GRPC   string env:"GRPC, default=23410"   yaml:"grpc"</code> [код: service/internal/config/config.go:140]
- <code>Metric string env:"METRIC, default=23411" yaml:"metric"</code> [код: service/internal/config/config.go:141]
- <code>Health string env:"HEALTH, default=23412" yaml:"health"</code> [код: service/internal/config/config.go:142]
- <code>MCP    string env:"MCP, default=23413"    yaml:"mcp"</code> [код: service/internal/config/config.go:143]
- <code>Level string env:"LEVEL,default=info" yaml:"level"</code> [код: service/internal/config/config.go:158]
- <code>Postgres string env:"POSTGRES&#95;DSN" secret:"true" yaml:"postgres"</code> [код: service/internal/config/config.go:167]
- <code>PluginsDir    string env:"PLUGINS&#95;DIR, default=/plugins"     yaml:"plugins&#95;dir"</code> [код: service/internal/config/config.go:172]
- <code>MaxOutputSize int64  env:"MAX&#95;OUTPUT&#95;SIZE, default=67108864" yaml:"max&#95;output&#95;size"</code> [код: service/internal/config/config.go:173]
- <code>CacheMaxBytes int64 env:"CACHE&#95;MAX&#95;BYTES, default=21474836480" yaml:"cache&#95;max&#95;bytes"</code> [код: service/internal/config/config.go:182]
- <code>S3 S3Config env:", prefix=S3&#95;" yaml:"s3"</code> [код: service/internal/config/config.go:184]
- <code>Endpoint        string env:"ENDPOINT"                 yaml:"endpoint"</code> [код: service/internal/config/config.go:197]
- <code>Bucket          string env:"BUCKET"                   yaml:"bucket"</code> [код: service/internal/config/config.go:198]
- <code>Region          string env:"REGION,default=us-east-1" yaml:"region"</code> [код: service/internal/config/config.go:199]
- <code>Prefix          string env:"PREFIX"                   yaml:"prefix"</code> [код: service/internal/config/config.go:200]
- <code>AccessKeyID     string env:"ACCESS&#95;KEY&#95;ID"            yaml:"access&#95;key&#95;id"</code> [код: service/internal/config/config.go:201]
- <code>SecretAccessKey string env:"SECRET&#95;ACCESS&#95;KEY"        secret:"true"           yaml:"secret&#95;access&#95;key"</code> [код: service/internal/config/config.go:202]
- <code>ForcePathStyle  bool   env:"FORCE&#95;PATH&#95;STYLE"         yaml:"force&#95;path&#95;style"</code> [код: service/internal/config/config.go:203]
- <code>OTLPEndpoint      string env:"OTLP&#95;ENDPOINT"      yaml:"otlp&#95;endpoint"</code> [код: service/internal/config/config.go:233]
- <code>PyroscopeEndpoint string env:"PYROSCOPE&#95;ENDPOINT" yaml:"pyroscope&#95;endpoint"</code> [код: service/internal/config/config.go:234]
- <code>ServiceTier string env:"SERVICE&#95;TIER" yaml:"service&#95;tier"</code> [код: service/internal/config/config.go:245]
- <code>Workers   int env:"WORKERS,default=4"     yaml:"workers"</code> [код: service/internal/config/config.go:257]
- <code>QueueSize int env:"QUEUE&#95;SIZE,default=16" yaml:"queue&#95;size"</code> [код: service/internal/config/config.go:258]
- <code>MaxConcurrentGenerations int env:"MAX&#95;CONCURRENT&#95;GENERATIONS,default=16" yaml:"max&#95;concurrent&#95;generations"</code> [код: service/internal/config/config.go:263]
- <code>GenerationTimeout time.Duration env:"GENERATION&#95;TIMEOUT,default=120s" yaml:"generation&#95;timeout"</code> [код: service/internal/config/config.go:265]
- <code>MaxRetries        int           env:"MAX&#95;RETRIES,default=2"           yaml:"max&#95;retries"</code> [код: service/internal/config/config.go:266]
- <code>ShutdownTimeout   time.Duration env:"SHUTDOWN&#95;TIMEOUT,default=30s"    yaml:"shutdown&#95;timeout"</code> [код: service/internal/config/config.go:267]
- <code>Key string env:"KEY" secret:"true" yaml:"key"</code> [код: service/internal/config/config.go:280]
- <code>File string env:"FILE" yaml:"file"</code> [код: service/internal/config/config.go:282]
- <code>PublicKeys map[string]string env:"PUBLIC&#95;KEYS" yaml:"public&#95;keys"</code> [код: service/internal/config/config.go:299]
- <code>CacheTTL time.Duration env:"CACHE&#95;TTL,default=5m" yaml:"cache&#95;ttl"</code> [код: service/internal/config/config.go:306]
- <code>RequestsPerSecond float64       env:"REQUESTS&#95;PER&#95;SECOND,default=10.0" yaml:"requests&#95;per&#95;second"</code> [код: service/internal/config/config.go:354]
- <code>Burst             int           env:"BURST,default=20"                 yaml:"burst"</code> [код: service/internal/config/config.go:355]
- <code>CleanupInterval   time.Duration env:"CLEANUP&#95;INTERVAL,default=10m"     yaml:"cleanup&#95;interval"</code> [код: service/internal/config/config.go:356]
- <code>MaxConcurrentPerIP int env:"MAX&#95;CONCURRENT&#95;PER&#95;IP,default=2" yaml:"max&#95;concurrent&#95;per&#95;ip"</code> [код: service/internal/config/config.go:361]
- <code>BufferSize     int           env:"BUFFER&#95;SIZE,default=1000"   yaml:"buffer&#95;size"</code> [код: service/internal/config/config.go:367]
- <code>BatchSize      int           env:"BATCH&#95;SIZE,default=100"     yaml:"batch&#95;size"</code> [код: service/internal/config/config.go:368]
- <code>FlushInterval  time.Duration env:"FLUSH&#95;INTERVAL,default=1s"  yaml:"flush&#95;interval"</code> [код: service/internal/config/config.go:369]
- <code>MaxSaveRetries int           env:"MAX&#95;SAVE&#95;RETRIES,default=3" yaml:"max&#95;save&#95;retries"</code> [код: service/internal/config/config.go:370]
- <code>EnqueueTimeout time.Duration env:"ENQUEUE&#95;TIMEOUT,default=1s" yaml:"enqueue&#95;timeout"</code> [код: service/internal/config/config.go:376]
- <code>FlushTimeout time.Duration env:"FLUSH&#95;TIMEOUT,default=5s" yaml:"flush&#95;timeout"</code> [код: service/internal/config/config.go:380]
- <code>RetentionMonths        int           env:"RETENTION&#95;MONTHS,default=12"         yaml:"retention&#95;months"</code> [код: service/internal/config/config.go:383]
- <code>PreCreateMonths        int           env:"PRE&#95;CREATE&#95;MONTHS,default=3"         yaml:"pre&#95;create&#95;months"</code> [код: service/internal/config/config.go:384]
- <code>PartitionCheckInterval time.Duration env:"PARTITION&#95;CHECK&#95;INTERVAL,default=6h" yaml:"partition&#95;check&#95;interval"</code> [код: service/internal/config/config.go:385]
- <code>PartitionOpTimeout     time.Duration env:"PARTITION&#95;OP&#95;TIMEOUT,default=30s"    yaml:"partition&#95;op&#95;timeout"</code> [код: service/internal/config/config.go:386]
- <code>// written (env:", prefix=REGISTRY&#95;"). And everything after default= is the</code> [код: service/internal/config/fields.go:221]
- <code>CacheTTL time.Duration env:"LICENSE&#95;CACHE&#95;TTL" yaml:"cache&#95;ttl"</code> [код: service/internal/license/manager.go:21]
- <code>RequestsPerSecond float64       env:"REQUESTS&#95;PER&#95;SECOND" yaml:"requests&#95;per&#95;second"</code> [код: service/internal/ratelimiter/config.go:7]
- <code>Burst             int           env:"BURST"               yaml:"burst"</code> [код: service/internal/ratelimiter/config.go:8]
- <code>CleanupInterval   time.Duration env:"CLEANUP&#95;INTERVAL"    yaml:"cleanup&#95;interval"</code> [код: service/internal/ratelimiter/config.go:9]

## Дополнительные поля / команды

EASYP_CONFIG выбирает файл для команд с cfg; EASYP_TOKEN используется регистрационным клиентом; alias OTEL_EXPORTER_OTLP_ENDPOINT принимается с приоритетом TELEMETRY_OTLP_ENDPOINT. AWS SDK default credential chain используется при отсутствии статических keys; это внешняя библиотечная конфигурация, не YAML-root сервиса. [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/main.go:19] [код: service/internal/config/alias.go:12]

## Дополнительная интеграционная проверка

Проверены регистрация, easyp generate, внешний SDK consumer, остановка/возврат PostgreSQL и восстановление pg_dump в новую БД с повторной генерацией. SHA-256 результата до/после restore совпал. При остановленной БД HTTP /live вернул 200, readiness / вернул 503. [команда: evidence/quickstart-restore.log] [команда: evidence/sdk-consumer-build.log]

Также проверены MCP tools/list и plugins_list через HTTP: единственный tool — plugins_list. При включённой auth anonymous CLI отклонён с Unauthenticated, SDK с bearer успешно генерирует; MCP без bearer даёт HTTP 401, с bearer выполняет tools/list и tools/call. Из live /metrics сняты 47 семейств easyp_*, каждое присутствует в справочнике. [команда: evidence/integration.log] [команда: evidence/metrics-scrape.txt]

## Ограничения доказательств

Чтение кода не доказывает публикацию release assets или отсутствие всех багов. Реальные Enterprise-лицензия/аудит, mTLS и S3 restore не проверены интеграционно. Нет конкурентного бенчмарка и подтверждённого публичного тарифа Enterprise EasyP. Production credentials и GHCR не использовались. [не подтверждено]
