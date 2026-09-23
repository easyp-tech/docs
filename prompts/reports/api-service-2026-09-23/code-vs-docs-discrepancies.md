Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Расхождения кода и документации

Номера строк docs относятся к исходному commit5fd544999f79a8306554ed4a1d4f1afd841bbd24; service paths — к commit4b01518b42c6f448d21216e3c0e8c35ef66d5c2d. Исходные API-страницы сохранены отдельно до правок. Код, README/AGENTS сервиса, CLI-документация, routing и CI не исправлялись.

## Порядок интерсепторов

Исходное место: [код: service/AGENTS.md:10]

Расхождение/уточнение: AGENTS помещает converter раньше admission/auth; код append ставит его последним. [код: service/internal/grpchelper/server.go:204] [код: service/internal/grpchelper/server.go:119]

Действие: Архитектура переписана по фактическому порядку; код/AGENTS не изменялись. [команда: git diff -- content/docs/api-service]

## Изоляция

Исходное место: [код: service/README.md:3]

Расхождение/уточнение: Слова об isolated execution не означают sandbox. Процесс использует права сервиса. [код: service/internal/adapters/registry/registry.go:472] [код: service/internal/adapters/registry/registry.go:475] [код: service/internal/adapters/registry/registry.go:484] [код: service/internal/adapters/registry/registry.go:520] [код: service/internal/config/config.go:173] [код: service/internal/adapters/registry/registry.go:39]

Действие: security/architecture/overview явно говорят «не песочница», описаны последствия. [команда: git diff -- content/docs/api-service]

## Имя wire-сервиса

Исходное место: [код: service/README.md:259]

Расхождение/уточнение: Примеры со ServiceAPI не соответствуют текущему GeneratorAPI. [код: service/api/easyp/generator/v1/generator.proto:67]

Действие: В разделе API Service используется текущий wire-контракт. [команда: git diff -- content/docs/api-service]

## Enterprise-only CRUD

Исходное место: [код: service/api/easyp/generator/v1/generator.proto:110]

Расхождение/уточнение: Комментарий помечает CRUD как Enterprise-only; код разрешает CRUD Community при bearer authentication и count ceiling. [код: service/internal/auth/static.go:5] [код: service/internal/api/auth_interceptor.go:129] [код: service/internal/config/auth.go:39] [код: service/internal/core/domain.go:356] [код: service/internal/core/domain.go:378] [код: service/internal/license/features.go:38] [код: service/internal/core/core.go:58]

Действие: Таблица возможностей построена по claims/feature gate, не комментарию proto. [команда: git diff -- content/docs/api-service]

## MCP-инструмент

Исходное место: [код: service/README.md:290]

Расхождение/уточнение: README перечисляет отсутствующий текущему generated MCP инструмент. [код: service/api/easyp/generator/v1/generator.mcp.go:24] [код: service/internal/api/mcp.go:8] [код: service/internal/api/mcp_tools.go:14] [код: service/internal/api/mcp.go:39]

Действие: Документирован единственный plugins_list. [команда: git diff -- content/docs/api-service]

## Аудит MCP

Исходное место: [код: service/README.md:26]

Расхождение/уточнение: Отсутствие gRPC-interceptors не доказывает отсутствие аудита MCP: вызов списка проходит Core. [код: service/internal/core/core.go:20] [код: service/internal/core/core.go:58] [код: service/api/easyp/generator/v1/generator.mcp.go:24] [код: service/internal/api/mcp.go:8] [код: service/internal/api/mcp_tools.go:14]

Действие: MCP и architecture различают HTTP wrapper, gRPC chain и Core audit. [команда: git diff -- content/docs/api-service]

## Применение EASYP_TOKEN

Исходное место: [код: service/README.md:517]

Расхождение/уточнение: Нельзя переносить поддержку регистрационного клиента на developer CLI. [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54] [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7] [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/register.go:81]

Действие: client-usage показывает реальный gap и SDK-путь; developer CLI не исправлялся. [команда: git diff -- content/docs/api-service]

## Структура каталога

Исходное место: [код: service/README.md:39]

Расхождение/уточнение: Описание каталогов версий/Dockerfile не совпадает с текущим одним recipe-каталогом и versions в plugin.yaml. [код: service/cmd/easyp-svc/build.go:31] [код: service/cmd/easyp-svc/build.go:483] [код: service/cmd/easyp-svc/build.go:515]

Действие: plugins описывает фактический builder и полный каталог. [команда: git diff -- content/docs/api-service]

## Повторная регистрация

Исходное место: [код: service/cmd/easyp-svc/push.go:44]

Расхождение/уточнение: Совет повторно register после замены объекта не обновляет существующий checksum; AlreadyExists пропускается. [код: service/internal/adapters/registry/registry.go:7] [код: service/internal/adapters/registry/registry.go:62] [код: service/internal/config/config.go:182] [код: service/internal/adapters/registry/cache.go:20] [код: service/cmd/easyp-svc/register.go:367] [код: service/cmd/easyp-svc/push.go:44]

Действие: plugins/operator-cli/architecture объясняют риск warm/cold divergence. [команда: git diff -- content/docs/api-service]

## Удаление S3

Исходное место: [код: service/sdk/client.go:258]

Расхождение/уточнение: SDK-комментарий о сохранении S3-архива не соответствует best-effort удалению сервером. [код: service/internal/adapters/registry/registry.go:736] [код: service/sdk/client.go:239] [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7]

Действие: client-usage и backup не обещают сохранность после DeletePlugin. [команда: git diff -- content/docs/api-service]

## Версия bufbuild/es

Исходное место: [код: service/registry/bufbuild/es/plugin.yaml:1]

Расхождение/уточнение: Много заявленных версий используют fixed2.9.0package/lock без выбора VERSION при npmci. [код: service/registry/bufbuild/es/package.json:3] [код: service/registry/bufbuild/es/Dockerfile:6] [код: service/registry/bufbuild/es/Dockerfile:20]

Действие: Публично отмечен known recipe defect; vendor recipe не изменён. [команда: git diff -- content/docs/api-service]

## Абсолютные sidecar-пути

Исходное место: [код: service/registry/bufbuild/es/Dockerfile:20]

Расхождение/уточнение: Docker export не переносит root filesystem runtime в чroot; абсолютные /nodejs и /app не разрешаются относительно plugins_dir. [код: service/internal/adapters/registry/registry.go:472] [код: service/internal/adapters/registry/registry.go:475] [код: service/cmd/easyp-svc/build.go:483] [код: service/cmd/easyp-svc/build.go:515] [код: service/registry/bufbuild/es/package.json:3] [код: service/registry/bufbuild/es/Dockerfile:6] [код: service/registry/bufbuild/es/Dockerfile:20]

Действие: Добавлено требование wrapper-relative paths и runtime smoke. [команда: git diff -- content/docs/api-service]

## Лицензионное истечение

Исходное место: [код: docs-fumadocs/content/docs/api-service/runbooks.mdx:48]

Расхождение/уточнение: Refresh claims не пересоздаёт worker/generation pool; неизменённая ёмкость не доказывает сохранение Enterprise. [код: service/internal/core/domain.go:356] [код: service/internal/core/domain.go:378] [код: service/cmd/easyp-svc/start.go:660] [код: service/internal/license/manager.go:19] [код: service/internal/license/paseto_client.go:142] [код: service/internal/license/manager.go:113] [код: service/internal/config/config.go:903] [код: service/internal/license/manager.go:15]

Действие: Runbook объясняет exp+grace+refresh и необходимость restart при ротации. [команда: git diff -- content/docs/api-service]

## Очереди

Исходное место: [код: docs-fumadocs/content/docs/api-service/runbooks.mdx:55]

Расхождение/уточнение: Lookup workers не равны процессам генерации; отдельные queue/semaphore требуют отдельных метрик. [код: service/internal/core/pool.go:319] [код: service/internal/core/pool.go:215] [код: service/internal/core/pool.go:386] [код: service/internal/config/config.go:265] [код: service/cmd/easyp-svc/start.go:46] [код: service/internal/grpchelper/metrics.go:12] [код: service/internal/database/metrics.go:29]

Действие: architecture/observability/runbooks описывают фактические admission points. [команда: git diff -- content/docs/api-service]

## Аудит DEFAULT

Исходное место: [код: docs-fumadocs/content/docs/api-service/runbooks.mdx:131]

Расхождение/уточнение: Gauge — cached boolean maintenance, не точное число строк и не live query каждый scrape. [код: service/internal/database/goosemigrate/migrations/00002_audit_log_partitioning.sql:72] [код: service/internal/adapters/audit/partitions.go:196] [код: service/internal/adapters/audit/partitions.go:327] [код: service/internal/adapters/audit/partitions.go:278] [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:151] [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:23]

Действие: Runbook требует прямой read-only проверки перед DDL/data maintenance. [команда: git diff -- content/docs/api-service]

## Аудит и паники

Исходное место: [код: docs-fumadocs/content/docs/api-service/runbooks.mdx:201]

Расхождение/уточнение: У easyp_panics_total нет labels goroutine/name; recovered background panic может завершить конкретную задачу. [код: service/cmd/easyp-svc/start.go:351] [код: service/cmd/easyp-svc/health.go:20] [код: service/cmd/easyp-svc/start.go:17] [код: service/cmd/easyp-svc/start.go:46] [код: service/internal/grpchelper/metrics.go:12] [код: service/internal/database/metrics.go:29] [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:151] [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:23]

Действие: Нельзя искать несуществующие labels или считать /live доказательством фонового progress. [команда: git diff -- content/docs/api-service]

## Согласованный restore

Исходное место: [код: docs-fumadocs/content/docs/api-service/backup.mdx:18]

Расхождение/уточнение: Более свежий bucket не гарантирует совместимость со snapshot metadata при overwrite/delete. [код: service/cmd/easyp-svc/start.go:901] [код: service/internal/adapters/registry/registry.go:212] [код: service/internal/adapters/registry/registry.go:7] [код: service/internal/adapters/registry/registry.go:62] [код: service/internal/config/config.go:182] [код: service/internal/adapters/registry/cache.go:20] [код: service/internal/adapters/registry/registry.go:736] [код: service/sdk/client.go:239] [код: service/cmd/easyp-svc/register.go:367] [код: service/cmd/easyp-svc/push.go:44]

Действие: backup требует согласованный набор metadata+artifacts и холодную проверку. [команда: git diff -- content/docs/api-service]

## Миграции и rollback

Исходное место: [код: docs-fumadocs/content/docs/api-service/upgrading.mdx:272]

Расхождение/уточнение: Down SQL не равен безопасному rollback старого binary; migrate2копирует audit table. [код: service/internal/database/goosemigrate/migrations/00001_init.sql:2] [код: service/cmd/easyp-svc/start.go:35] [код: service/internal/database/goosemigrate/migrations/00002_audit_log_partitioning.sql:72] [код: service/internal/adapters/audit/partitions.go:196]

Действие: upgrading описывает locks/disk/backups и отсутствие операторской команды downgrade. [команда: git diff -- content/docs/api-service]

## Healthcheck файла

Исходное место: [код: service/Dockerfile:72]

Расхождение/уточнение: Healthcheck запускается отдельным процессом и не наследует --cfg argv сервера. [код: service/cmd/easyp-svc/start.go:351] [код: service/cmd/easyp-svc/health.go:20] [код: service/cmd/easyp-svc/start.go:17] [код: service/Dockerfile:78] [код: service/Dockerfile:72] [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/register.go:81]

Действие: EASYP_CONFIG обязателен для общего cfg либо передайте --cfg отдельно. [команда: git diff -- content/docs/api-service]

## Helm shared storage

Исходное место: [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:172]

Расхождение/уточнение: Разрешение RWX при replicaCount>1 не доказывает безопасность общего plugin cache. [код: service/internal/adapters/registry/registry.go:26] [код: service/internal/plugarchive/plugarchive.go:184] [код: service/internal/plugarchive/plugarchive.go:143] [код: service/internal/config/config.go:182] [код: service/internal/adapters/registry/cache.go:20] [код: service/deploy/charts/easyp-service/Chart.yaml:54] [код: service/deploy/charts/easyp-service/templates/deployment.yaml:18] [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:172]

Действие: installation/security не рекомендуют shared-cache HA. [команда: git diff -- content/docs/api-service]

## Helm MCP policy

Исходное место: [код: service/deploy/charts/easyp-service/templates/networkpolicy.yaml:15]

Расхождение/уточнение: Включение MCP не создаёт соответствующий ingress allow-rule. [код: service/api/easyp/generator/v1/generator.mcp.go:24] [код: service/internal/api/mcp.go:8] [код: service/internal/api/mcp_tools.go:14] [код: service/deploy/charts/easyp-service/templates/networkpolicy.yaml:15] [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:72]

Действие: Описана отдельная обязанность NetworkPolicy; шаблон не изменён. [команда: git diff -- content/docs/api-service]

## Helm server-only TLS guard

Исходное место: [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:72]

Расхождение/уточнение: Ingress guard требует client certificate даже при clientCASecret="-". [код: service/internal/grpchelper/tls.go:43] [код: service/internal/grpchelper/tls.go:53] [код: service/deploy/charts/easyp-service/Chart.yaml:54] [код: service/deploy/charts/easyp-service/templates/deployment.yaml:18] [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:172] [код: service/deploy/charts/easyp-service/templates/networkpolicy.yaml:15] [код: service/deploy/charts/easyp-service/templates/_helpers.tpl:72]

Действие: Отмечено ограничение чарта, не вымышленное обязательное mTLS сервиса. [команда: git diff -- content/docs/api-service]

## Экспериментально подтверждённые ошибки статусов

Исходные обработчики создают InvalidArgument для malformed cursor/update mask, но внутренняя конвертация не сохраняет готовый status и возвращает Internal. Обёрнутый generation timeout также классифицируется Internal/GENERATION_FAILED раньше проверки DeadlineExceeded. Это дефекты реализации, не обещанный желательный контракт. [код: service/internal/api/api.go:268] [команда: scratch/probe/go run ., probe-results.log]

## Routing EN: различие dev и production

В dev EN-маршруты возвращают 307 на тот же URL, включая неизменённую introduction/what-is. Однако повторная проверка через npm run start подтвердила HTTP 200 для всех 34 страниц EN/RU и все 17 runbook anchors в каждом языке. EN sidebar появляется после JavaScript hydration: Chrome headless подтвердил все 17 ссылок. Предыдущий вывод о недоступности production EN был слишком широким. Routing-код не изменён; причина dev-only цикла не установлена. [команда: npm run start -- --hostname localhost --port 34322] [команда: evidence/production-http.log] [команда: evidence/validation.log] [не подтверждено: причина dev-only redirect loop]

## Атрибуция upstream packaging

Найдены побайтово одинаковые package.json/package-lock.json EasyP ES и Buf ESv2.9.0; в registry не найдены отдельные файлы LICENSE/NOTICE/ATTRIBUTION. Это повод проверить применимые Apache-2.0 уведомления и происхождение адаптаций, а не готовое юридическое заключение о нарушении всего каталога. Исходники вне docs не менялись. [код: service/registry/bufbuild/es/package.json:3] [код: service/registry/bufbuild/es/Dockerfile:6] [код: service/registry/bufbuild/es/Dockerfile:20] [код: service/LICENSE:7] [код: service/api/LICENSE:1] [код: service/sdk/LICENSE:1] [команда: read_bytes comparison; поиск LICENSE/NOTICE/ATTRIBUTION в service/registry] [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/LICENSE, 2026-09-23]

## Исправления самого черновика при проверках

В новом черновике исправлены ошибочные WithPluginFilter → WithFilter, удалена отсутствующая UpdatePluginFields, флаг --address заменён на --addr. SDK-пример извлечён из страницы и собран отдельным consumer-модулем против опубликованного sdk v1.0.2, без replace на локальный SDK. Это исправления агента, а не дефекты upstream API. [код: service/sdk/filter.go:37] [код: service/sdk/client.go:201] [команда: easyp-svc plugins register --help] [команда: evidence/sdk-consumer-build.log]

Read-only quickstart теперь предварительно создаёт plugins/.tmp: конструктор registry вызывает MkdirAll даже без S3. Ожидаемый путь файла исправлен на gen/proto/hello.pb.go по реальному запуску. [код: service/internal/adapters/registry/registry.go:179] [команда: evidence/quickstart-restore.log]

Штатный cmd/mcp-smoke падает, ожидая отсутствующий easyp_config_describe; фактически сервер отдаёт plugins_list. Проверка HTTP/MCP выполняется отдельно от устаревшего smoke, исходник smoke не изменялся. [код: service/cmd/mcp-smoke/main.go:21] [команда: evidence/upstream-mcp-smoke-failure.log]
