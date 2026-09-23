Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Передача следующему агенту: easyp CLI

**CLI-код и CLI-документация этим этапом не изменялись.** Полностью прочитаны97EN-страниц сайта, но реализация CLI изучалась только для интеграции remote generation и проверки конфигурационных примеров. Проблемы вне этого пути ниже разделены на подтверждённые и кандидаты на проверку. Не считайте весь этот файл списком доказанных ошибок CLI. [команда: git diff --name-only; чтение content/docs EN и easyp/internal/adapters/plugin/remote.go]

## Подтверждено по remote executor

1. Нет bearer-токена, чтения EASYP_TOKEN, пользовательского CA из config и client certificate. Прямой grpc.NewClient не использует service/sdk; поддержка этих опций у SDK не исправляет CLI. Сервер с require_authentication или mTLS недоступен этому executor без отдельной интеграции. [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54] [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7] [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/register.go:81]

2. Deadline клиента30s и дефолт grpc.MaxCallRecvMsgSize4MiB могут расходиться с execution budget120s/выводом64MiB сервера. При больших ответах или долгих плагинах нужна честная документация, затем отдельное изменение клиента с тестами. [код: service/internal/config/config.go:173] [код: service/internal/adapters/registry/registry.go:39] [код: service/internal/core/pool.go:386] [код: service/internal/config/config.go:265] [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54] [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7]

3. remote — URL EasyP GeneratorAPI, не BSR CodeGenerationService. Подмена hostname не обеспечивает совместимость. Совпадающие group/name/version не обеспечивают идентичность бинарников и revisions. [код: service/api/easyp/generator/v1/generator.proto:67] [код: service/internal/adapters/registry/registry.go:220] [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54] [код: service/cmd/easyp-svc/build.go:483] [код: service/cmd/easyp-svc/build.go:515] [док Buf: https://buf.build/docs/bsr/remote-plugins/usage/, 2026-09-23]

4. Явные http/https определяют plaintext/TLS gRPC. Для адреса без схемы есть localhost-эвристика; не описывать её как универсальную безопасную default-TLS policy. [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54]

5. Пример сервиса использует generate.inputs, generate.plugins, remote/out/opts. EASYP_TOKEN относится к plugins register операторского easyp-svc; новый Go SDK example использует собственную переменную EASYP_SERVICE_TOKEN, которая не становится возможностью CLI. [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54] [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7] [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/register.go:81]

## Что пересмотреть в существующих страницах

| Файл / группа | Почему пересмотреть | Степень подтверждения |
| --- | --- | --- |
| <code>content/docs/cli/package-manager/easyp-vs-buf.mdx</code> | Это сравнение Git module manager, не отдельного API Service. Не дублировать новую service comparison; уточнить scope ячеек BSR self-hosting, платных возможностей и приватности. BSR имеет on-prem, MCP и private instances. | Старые обобщения о BSR нужно сверить с bsr-facts; CLI licensing и все module claims требуют отдельной кодовой проверки. [код: docs-fumadocs/content/docs/cli/package-manager/easyp-vs-buf.mdx:1] [не подтверждено: полный CLI-аудит] |
| <code>content/docs/guides/buf-migration.mdx</code> | Сопоставить формат конфигурации с актуальным CLI и v1 migration work; перенос managed/opt/deps не является простой заменой бинарника. | Кандидат на аудит всей миграции; remote wire incompatibility подтверждена. [код: docs-fumadocs/content/docs/guides/buf-migration.mdx:1] [не подтверждено: полный CLI-аудит] |
| <code>content/docs/migration/buf-cli.mdx</code> | Проверить старые plugin:/remote: примеры в контексте версии Buf и EasyP, а не объявлять все слова plugin устаревшими. | Кандидат; текущий Buf v2 remote подтверждён документацией. [код: docs-fumadocs/content/docs/migration/buf-cli.mdx:1] [не подтверждено: полный CLI-аудит] |
| <code>content/docs/cli/generate/&#42;&#42;</code> | Согласовать реальные remote URL, token/TLS ограничения, лимиты receive/deadline, error field CodeGeneratorResponse, output paths и plugin opts. | Remote-path код проверен; остальные flags/managed features полностью не аудированы. [команда: inventory.md, полный список просмотренных EN-страниц] [не подтверждено: полный CLI-аудит] |
| <code>content/docs/cli/package-manager/&#42;&#42;</code> | Развести Git module distribution и generated SDK distribution BSR. Не обещать функции сервера как свойства пакетного менеджера. | Scope уточнён; реализация package manager оставлена следующему этапу. [команда: inventory.md, полный список просмотренных EN-страниц] [не подтверждено: полный CLI-аудит] |
| <code>Общие вводные, guides и reference</code> | В inventory есть разные поколения схем конфигурации, упоминания protobuf.mod/easyp.gen.yaml/WASM и исторические команды. Для каждого нужен grep current CLI structs/--help и отдельные regression tests. | Кандидаты на проверку, не утверждение, что каждое упоминание обязательно ошибочно. [команда: inventory.md, полный список просмотренных EN-страниц] [не подтверждено: полный CLI-аудит] |

## Приоритет работы следующего этапа

Сначала закрепить ревизию CLI и фактическую v1 конфигурацию, затем инвентаризировать команды/флаги и схемы, после этого исправлять docs и проверять реальные сценарии. Для защищённой remote generation отдельно решить: поддержка bearer/customCA/mTLS в CLI или честное ограничение документации до реализации. Не внедрять EASYP_TOKEN в примеры как уже работающий API только потому, что он есть в операторском бинарнике. [код: easyp/internal/adapters/plugin/remote.go:69] [код: easyp/internal/adapters/plugin/remote.go:54] [код: service/sdk/config.go:108] [код: service/sdk/retry.go:83] [код: service/sdk/client.go:154] [код: service/sdk/health.go:7] [код: service/cmd/easyp-svc/license.go:27] [код: service/cmd/easyp-svc/register.go:81]

Сравнение BSR module registry остаётся на прежней странице; новое сравнение сервиса расположено в api-service/vs-buf-bsr и api-service/migrating-from-bsr. Проверяйте их совместный scope, а не переписывайте одинаковые таблицы дважды. [команда: git diff content/docs/api-service]

## Отдельно: существующие внутренние ссылки сайта

Повторный file-target scanner учитывает .md URL, поддерживаемые существующим Markdown routing. Первые 66 замечаний включали ложные срабатывания на расширение .md; актуально осталось 6 неразрешённых целей вне API Service. Это проверка файловых целей, не доказательство HTTP 404 для каждого возможного redirect. [команда: evidence/validation.log]

- content/docs/cli/configuration.mdx → string [код: docs-fumadocs/content/docs/cli/configuration.mdx:318]
- content/docs/cli/configuration.ru.mdx → string [код: docs-fumadocs/content/docs/cli/configuration.ru.mdx:330]
- content/docs/guides/multi-target-generation.ru.mdx → /ru/docs/guides/build-reproducibility [код: docs-fumadocs/content/docs/guides/multi-target-generation.ru.mdx:141]
- content/docs/guides/breaking-checks-ci.ru.mdx → /ru/docs/guides/adding-dependencies [код: docs-fumadocs/content/docs/guides/breaking-checks-ci.ru.mdx:134]
- content/docs/guides/breaking-checks-ci.mdx → /docs/guides/adding-dependencies [код: docs-fumadocs/content/docs/guides/breaking-checks-ci.mdx:134]
- content/docs/guides/multi-target-generation.mdx → /docs/guides/build-reproducibility [код: docs-fumadocs/content/docs/guides/multi-target-generation.mdx:141]

## Не включать в следующий CLI scope молча

Исправление EN redirect loop требует routing-кода сайта, а дефекты service cache/checksum/ES recipe — изменений service. Они описаны в code-vs-docs-discrepancies.md и требуют отдельного разрешения/задачи. В рамках данного этапа эти исходники оставлены неизменными. [команда: git status --porcelain в каждом исходном репозитории]
