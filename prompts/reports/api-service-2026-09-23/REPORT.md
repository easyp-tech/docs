Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# EasyP API Service: итоговый отчёт

## Результат и границы

Подготовлены 17 страниц API Service в двух языках: 34 MDX-файла и порядок в api-service/meta.json. Все изменения сайта ограничены content/docs/api-service/. CLI-раздел, код service/easyp, сайт routing/i18n, Dockerfile и CI не изменены. Семь отчётов и воспроизводимые материалы проверки находятся в этом каталоге. [команда: git diff --name-only 5fd544999f79a8306554ed4a1d4f1afd841bbd24 HEAD]

Ветка: <code>docs/api-service-full-and-bsr</code>. Последующее сообщение пользователя разрешило завершить работу коммитами и пушем этой ветки; исходный запрет на деплой и операции с GHCR сохранён. Workflow сайта публикует на push в main или release tags, а не на push этой рабочей ветки. Main, release tags и настройки workflow не изменялись. [код: docs-fumadocs/.github/workflows/docker-publish.yml:3]

Основа аудита: docs 5fd544999f79a8306554ed4a1d4f1afd841bbd24, service 4b01518b42c6f448d21216e3c0e8c35ef66d5c2d. Документация привязана к service v1.0.2, а не к неопределённому latest. Локальный проверочный образ собран из этого исходника и маркирован v1.0.2-audit; он не скачивался из GHCR и не публиковался. Ревизии остальных прочитанных репозиториев записаны в evidence/source-revisions.txt. [команда: git rev-parse HEAD] [команда: evidence/source-revisions.txt] [команда: evidence/service-image-build.log]

## Структура раздела

Сохранены исходные overview, runbooks, backup и upgrading; добавлены quickstart, architecture, installation, configuration, authentication-and-licensing, plugins, client-usage, operator-cli, observability, mcp, vs-buf-bsr, migrating-from-bsr и security. Разделение отделяет справочники и эксплуатационные процедуры от вводной страницы, а модель угроз — от инструкции запуска. Все 17 заголовков runbooks, используемых 11 сервисными и 6 host-алертами, сохранены в обоих языках. [код: docs-fumadocs/content/docs/api-service/meta.json:1] [команда: evidence/validation.log]

Сравнение посвящено удалённой генерации, а не пакетному менеджеру. На неизменённую CLI-страницу easyp-vs-buf дана ссылка; её неточности переданы в for-next-prompt-cli.md. Рассмотрены 14 осей, реальные преимущества BSR, условия выбора обоих продуктов и обратная миграция. MCP, on-prem и air gap не представлены как исключительные возможности EasyP. [код: docs-fumadocs/content/docs/api-service/vs-buf-bsr.mdx:1] [команда: comparison-matrix.md]

## Проверки

Полные сохранённые выводы команд находятся в evidence/. Значения ниже относятся к проверенной ревизии и локальной среде, а не к production-инсталляции. [команда: evidence/source-revisions.txt]
| Проверка | Результат | Доказательство |
| --- | --- | --- |
| Сборка сервиса и выбранные unit-пакеты | Успешно; это не полный интеграционный тест каждого пакета | [команда: evidence/go-build.log] [команда: evidence/go-unit-tests.log] |
| Внешний SDK consumer | Успешная сборка опубликованного sdk v1.0.2 без локального replace; затем реальная генерация | [команда: evidence/sdk-consumer-build.log] [команда: evidence/integration.log] |
| Typecheck и production build итогового MDX | TYPECHECK_EXIT=0, BUILD_EXIT=0 | [команда: evidence/build.log] |
| HTTP и runbooks | 34 страницы, 17 обязательных якорей в каждом языке | [команда: evidence/validation.log] |
| Конфигурация | 55 конечных YAML/env-настроек в EN/RU, все 76 совпадений env-тегов internal отражены в фактах | [команда: evidence/validation.log] [команда: evidence/configuration-leaves.json] |
| Helm | Проверены все 117 конечных values; штатные render/lint/promtool-проверки прошли | [команда: evidence/validation.log] [команда: evidence/helm-render.log] |
| Quickstart | Регистрация плагина и получение gen/proto/hello.pb.go через easyp generate | [команда: evidence/quickstart-restore.log] |
| PostgreSQL restore | pg_dump → отдельная БД → повторная генерация с идентичным SHA-256 | [команда: evidence/quickstart-restore.log] |
| Раздельные healthcheck | Остановка БД: /live 200, / 503; после возврата БД readiness 200 | [команда: evidence/quickstart-restore.log] |
| Auth | Anonymous CLI получает Unauthenticated при обязательной auth; SDK с bearer работает | [команда: evidence/integration.log] |
| MCP | tools/list и plugins_list проверены анонимно и с bearer; без bearer при обязательной auth — HTTP 401 | [команда: evidence/integration.log] |
| Штатный mcp-smoke | Не проходит: требует отсутствующий easyp_config_describe. Не маскируется успешным отдельным MCP-тестом | [команда: evidence/upstream-mcp-smoke-failure.log] |
| Метрики | 47 семейств easyp_* из live scrape найдены в справочнике; отсутствие остальных series в одном scrape не доказывает отсутствие метрики | [команда: evidence/metrics-scrape.txt] [команда: evidence/integration.log] |

Для HTTP-проверки использован production server. Dev-only цикл EN-редиректов воспроизводится на исходных страницах тоже; routing не менялся. Навигация EN проверяется после hydration, а не поиском ссылок в одном лишь первоначальном HTML. Окончательная browser-проверка и проверка ссылок отражены в validation.log. [команда: evidence/validation.log]

Локальный Docker-стенд использовал только случайные одноразовые credentials и loopback-порты. Рабочие production-секреты не читались. Логи очищены от одноразовых credential values/digests и личных абсолютных путей; эти редактирования не меняют коды завершения и результаты проверок. Проверочные контейнеры удалены после теста. [команда: evidence/integration.log]

## Исправления после первого прохода

Компиляция примера и реальный Quickstart исправили ошибки самого черновика: WithFilter вместо вымышленного WithPluginFilter, удаление вымышленного UpdatePluginFields, --addr вместо --address, создание plugins/.tmp перед read-only mount и правильный путь gen/proto/hello.pb.go. Эти ошибки не приписываются upstream. [код: service/sdk/filter.go:37] [код: service/sdk/client.go:201] [код: service/internal/adapters/registry/registry.go:179] [команда: evidence/operator-help.json] [команда: evidence/quickstart-restore.log]

Метаданные каталога — не гарантия работоспособности: обнаружены версии bufbuild/es, которые собираются из фиксированного package.json 2.9.0, а также wrapper paths, рассчитанные на контейнерный root. Сервисный код не исправлялся. Подробности, лицензионные вопросы upstream packaging и дефекты преобразования gRPC-ошибок вынесены в code-vs-docs-discrepancies.md. [код: service/registry/bufbuild/es/package.json:3] [код: service/registry/bufbuild/es/Dockerfile:6] [команда: evidence/probe-results.log]
## Покрытие чтения

Инвентаризация охватывает 97 исходных EN-страниц сайта, 419 тематических упоминаний и RU-страницы исходного API Service. Статусы и ссылки на исходные строки находятся в inventory.md. Ссылки на исходную документацию в этом отчёте следует сверять с указанной базовой ревизией docs, а не с номерами строк после переписывания. [команда: inventory.md]

По Buf прочитаны 78 сохранённых страниц разделов BSR, релевантные страницы конфигурации, pricing и материалы bufbuild/plugins, а также нужное окно changelog. Количество сохранённых crawler-ответов не приравнивается к количеству внимательно прочитанных страниц. Полное чтение каждого раздела Buf за пределами BSR не завершено; исходное требование «вся документация Buf» не заявляется выполненным. Список источников и границы проверки находятся в bsr-facts.md. [команда: bsr-facts.md] [не подтверждено: полное чтение всего Buf Docs]

## Неподтверждённое

- Старый отдельный Vite-сайт: однозначный исторический GitHub-источник не установлен; восстановление утраченного при миграции содержания не подтверждено. [не подтверждено]
- Production-доступность сервиса, реальная публикация всех GHCR tags/charts и release assets не проверялись: эти операции исключены из задачи. Семантика тегов описана по CI, а не выдана за проверку каждого объекта в registry. [не подтверждено]
- Реальные Enterprise claims, истечение коммерческой лицензии, интеграционный аудит под ней, mTLS и S3 backup/restore не проверены на развёрнутом стенде. Их документирование опирается на код и отдельно отмеченные unit-проверки, не на выдуманный production-эксперимент. [не подтверждено]
- Все 80 идентичностей и 1 743 заявленных версии EasyP не собирались. Проверен один Go-плагин; число рецептов не является размером проверенного рабочего каталога. [команда: evidence/plugin-build.log] [не подтверждено: остальные сборки]
- BSR account/private instance/on-prem не предоставлены. Не проверены реальная миграция конкретного аккаунта, расходы пользователя, производительность, региональная доступность из конкретной сети, точные общие sandbox memory/time caps и юридическая квалификация происхождения всего EasyP registry. Эти неизвестные не превращены в преимущества EasyP. [не подтверждено]
- Нет сопоставимого бенчмарка EasyP/BSR или измерения сравнительной надёжности. Нет подтверждённой публичной цены EasyP Enterprise. SLA Buf не выдаётся за наблюдавшийся uptime. [не подтверждено]
- Причина dev-only EN redirect loop и визуальное поведение всех страниц на всех браузерах/экранах не установлены. Это не отменяет успешную проверку итоговой production-сборки, её 34 HTTP-маршрутов и отдельных browser smoke-checks. [не подтверждено]

## Воспроизведение проверок

Сначала выполните npm run types:check и npm run build в docs, затем npm run start -- --hostname localhost --port 34323. Из этого каталога запустите python3 evidence/verify-docs.py /path/to/docs /path/to/service http://localhost:34323. Проверяющий скрипт требует Python 3 и PyYAML; это инструменты аудита, а не новые зависимости сайта. Зафиксированный service checkout нужен для проверки env-тегов, Helm values и ссылок алертов. Навигацию необходимо дополнительно проверить после загрузки JavaScript. [команда: evidence/verify-docs.py]

Quickstart воспроизводится по одноимённой странице; расширенный протокол/SDK/restore прогон виден в integration.log. Для маленького Go-probe сохранены main.go/go.mod/go.sum в evidence/probe: положите service рядом с docs и выполните go run . из evidence/probe. Относительные replace-директивы привязаны к этой структуре каталогов. [команда: evidence/probe-results.log]

## Итог контроля ссылок и навигации

Проверены 242 внутренние file-target ссылки: в API Service ошибок нет, вне раздела осталось 6 неразрешённых целей. Они переданы следующему агенту, CLI-файлы не менялись. EN-навигация проверена в Chrome headless после hydration, RU — по production HTTP HTML: присутствуют все 17 ссылок каждого языка. Визуально проверен снимок EN overview 1440×1080; на другие страницы и размеры экрана этот результат не распространяется. [команда: evidence/validation.log] [команда: evidence/file-link-issues.json]

## Файлы

~~~text
content/docs/api-service/architecture.mdx
content/docs/api-service/architecture.ru.mdx
content/docs/api-service/authentication-and-licensing.mdx
content/docs/api-service/authentication-and-licensing.ru.mdx
content/docs/api-service/backup.mdx
content/docs/api-service/backup.ru.mdx
content/docs/api-service/client-usage.mdx
content/docs/api-service/client-usage.ru.mdx
content/docs/api-service/configuration.mdx
content/docs/api-service/configuration.ru.mdx
content/docs/api-service/installation.mdx
content/docs/api-service/installation.ru.mdx
content/docs/api-service/mcp.mdx
content/docs/api-service/mcp.ru.mdx
content/docs/api-service/meta.json
content/docs/api-service/migrating-from-bsr.mdx
content/docs/api-service/migrating-from-bsr.ru.mdx
content/docs/api-service/observability.mdx
content/docs/api-service/observability.ru.mdx
content/docs/api-service/operator-cli.mdx
content/docs/api-service/operator-cli.ru.mdx
content/docs/api-service/overview.mdx
content/docs/api-service/overview.ru.mdx
content/docs/api-service/plugins.mdx
content/docs/api-service/plugins.ru.mdx
content/docs/api-service/quickstart.mdx
content/docs/api-service/quickstart.ru.mdx
content/docs/api-service/runbooks.mdx
content/docs/api-service/runbooks.ru.mdx
content/docs/api-service/security.mdx
content/docs/api-service/security.ru.mdx
content/docs/api-service/upgrading.mdx
content/docs/api-service/upgrading.ru.mdx
content/docs/api-service/vs-buf-bsr.mdx
content/docs/api-service/vs-buf-bsr.ru.mdx
prompts/reports/api-service-2026-09-23/REPORT.md
prompts/reports/api-service-2026-09-23/bsr-facts.md
prompts/reports/api-service-2026-09-23/code-vs-docs-discrepancies.md
prompts/reports/api-service-2026-09-23/comparison-matrix.md
prompts/reports/api-service-2026-09-23/evidence/build.log
prompts/reports/api-service-2026-09-23/evidence/catalog.json
prompts/reports/api-service-2026-09-23/evidence/configuration-leaves.json
prompts/reports/api-service-2026-09-23/evidence/copied-probe.log
prompts/reports/api-service-2026-09-23/evidence/file-link-issues.json
prompts/reports/api-service-2026-09-23/evidence/go-build.log
prompts/reports/api-service-2026-09-23/evidence/go-unit-tests.log
prompts/reports/api-service-2026-09-23/evidence/helm-render.log
prompts/reports/api-service-2026-09-23/evidence/integration.log
prompts/reports/api-service-2026-09-23/evidence/metrics-scrape.txt
prompts/reports/api-service-2026-09-23/evidence/operator-help.json
prompts/reports/api-service-2026-09-23/evidence/plugin-build.log
prompts/reports/api-service-2026-09-23/evidence/probe/go.mod
prompts/reports/api-service-2026-09-23/evidence/probe/go.sum
prompts/reports/api-service-2026-09-23/evidence/probe/main.go
prompts/reports/api-service-2026-09-23/evidence/probe-results.log
prompts/reports/api-service-2026-09-23/evidence/production-http.log
prompts/reports/api-service-2026-09-23/evidence/quickstart-restore.log
prompts/reports/api-service-2026-09-23/evidence/sdk-consumer-build.log
prompts/reports/api-service-2026-09-23/evidence/service-image-build.log
prompts/reports/api-service-2026-09-23/evidence/source-revisions.txt
prompts/reports/api-service-2026-09-23/evidence/upstream-mcp-smoke-failure.log
prompts/reports/api-service-2026-09-23/evidence/validation.log
prompts/reports/api-service-2026-09-23/evidence/verify-docs.py
prompts/reports/api-service-2026-09-23/for-next-prompt-cli.md
prompts/reports/api-service-2026-09-23/inventory.md
prompts/reports/api-service-2026-09-23/service-facts.md
~~~
