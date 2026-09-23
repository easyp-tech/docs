Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Факты о Buf Schema Registry

Дата обращения: **2026-09-23**. Проверены публичные первоисточники; BSR account, private API, коммерческий договор и production endpoints не использовались. Это проверка документации, не фактический smoke test каждого продукта. [команда: публичные чтения buf.build/docs и git clone bufbuild/plugins, bufbuild/buf]

## Возможность → tier → ограничения → первоисточник

### Модель продукта

BSR объединяет версии схем, remote generation и distribution готовых SDK; это шире отдельного executor.

Тариф/размещение: Все публично описанные tiers, с различиями приватности и governance. Ограничения доказательства: Не приписывать все Enterprise-возможности Community. [док Buf: https://buf.build/docs/bsr/, 2026-09-23] [док Buf: https://buf.build/pricing, 2026-09-23]

### Развёртывание

Public SaaS, Pro private instance, Enterprise dedicated и on-prem доступны.

Тариф/размещение: Pro/Enterprise по pricing. Ограничения доказательства: Self-hosted — не уникальное преимущество EasyP. [док Buf: https://buf.build/pricing, 2026-09-23] [док Buf: https://buf.build/docs/bsr/admin/on-prem/architecture/, 2026-09-23]

### On-prem зависимости

Архитектура включает PostgreSQL, Redis и blob storage, в дополнение к BSR-сервисам.

Тариф/размещение: Enterprise on-prem. Ограничения доказательства: Размеры архитектурного примера не являются результатом comparative benchmark. [док Buf: https://buf.build/docs/bsr/admin/on-prem/architecture/, 2026-09-23]

### Air-gapped

Self-hosted можно разместить в изолированной сети при предварительном предоставлении артефактов и зависимостей.

Тариф/размещение: Enterprise on-prem. Ограничения доказательства: Размещение само по себе не доказывает выполнение требований конкретной юрисдикции или отсутствие egress у интеграций. [док Buf: https://buf.build/docs/bsr/admin/on-prem/architecture/, 2026-09-23]

### Remote plugins

buf.gen.yaml remote задаёт BSR-hosted plugin; клиент передаёт разрешённый compiler input, получать исходный модуль из BSR необязательно.

Тариф/размещение: Remote generation описана для публичного BSR; private instances имеют свои endpoints. Ограничения доказательства: Не смешивать remote generation и публикацию модуля. [док Buf: https://buf.build/docs/bsr/remote-plugins/usage/, 2026-09-23]

### Версии/revisions

Upstream version и revision упаковки — разные части идентичности: Buf может пересобрать ту же upstream-версию.

Тариф/размещение: Каталог remote plugins. Ограничения доказательства: Одинаковая строка версии в EasyP не доказывает одинаковые байты или настройки сборки. [док Buf: https://buf.build/docs/bsr/remote-plugins/usage/, 2026-09-23] [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/CONTRIBUTING.md, 2026-09-23]

### Sandbox

Custom remote plugins ограничены по сети и внешнему состоянию filesystem; on-prem configuration документирует gVisor.

Тариф/размещение: Custom private plugins — Pro/Enterprise; gVisor-детали относятся к on-prem. Ограничения доказательства: Не распространять конкретную on-prem реализацию на все SaaS-инстансы; универсальные CPU/RAM/time ceilings не найдены. [док Buf: https://buf.build/docs/bsr/remote-plugins/custom-plugins/, 2026-09-23] [док Buf: https://buf.build/docs/bsr/admin/on-prem/configuration/, 2026-09-23]

### Custom plugins

Приватные instances могут размещать свои плагины; custom image должен соответствовать документированному Linux/amd64 формату.

Тариф/размещение: Pro и Enterprise. Ограничения доказательства: ARM-only артефакт EasyP не становится совместимым автоматически. Произвольное внешнее состояние плагину недоступно. [док Buf: https://buf.build/docs/bsr/remote-plugins/custom-plugins/, 2026-09-23]

### Public generation limits

Анонимно 10 запросов/час, burst10; с аутентификацией 960/час, burst120; максимум20плагинов на запрос.

Тариф/размещение: Публичный BSR. Ограничения доказательства: Это не сообщения/месяц и не ограничение по числу файлов; не сравнивать напрямую с per-IP RPS EasyP. [док Buf: https://buf.build/docs/bsr/rate-limits/, 2026-09-23]

### Private rate limits

Для текущих Pro/Enterprise private instances документация говорит об отсутствии настроенных rate limits.

Тариф/размещение: Private Pro/Enterprise. Ограничения доказательства: Не равно бесконечной вычислительной мощности или отсутствию договорных ограничений. [док Buf: https://buf.build/docs/bsr/rate-limits/, 2026-09-23]

### Generated SDKs

Поддержаны Go, npm, Maven/Gradle, Python, Swift, Cargo, NuGet и CMake; доступна также выгрузка архивов.

Тариф/размещение: BSR SDK functionality; доступ к приватным схемам определяется tier и permissions. Ограничения доказательства: Это distribution потребительского кода, не SDK самого API BSR. Не выдавать каждый язык за отдельный публичный package registry. [док Buf: https://buf.build/docs/bsr/generated-sdks/, 2026-09-23]

### Go SDK packages

Go module proxy даёт пакеты по координатам схемы/плагина; приватный доступ требует корректного GOPRIVATE и credentials.

Тариф/размещение: BSR Go SDK. Ограничения доказательства: Отдельные upstream-модули могут использовать канонические runtime/generated packages, а не произвольную независимую копию. [док Buf: https://buf.build/docs/bsr/generated-sdks/go/, 2026-09-23]

### npm SDK packages

BSR предоставляет собственный npm registry и scoped packages.

Тариф/размещение: BSR npm SDK. Ограничения доказательства: Это не автоматическая публикация в публичный npmjs; поддержка package manager/version описана отдельно. [док Buf: https://buf.build/docs/bsr/generated-sdks/npm/, 2026-09-23]

### Maven/Gradle

BSR обслуживает Maven-совместимые Java/Kotlin пакеты.

Тариф/размещение: BSR Maven/Gradle SDK. Ограничения доказательства: Указанные на этой странице build limits относятся к соответствующей сборке SDK, не ко всем remote plugin executions. [док Buf: https://buf.build/docs/bsr/generated-sdks/maven/, 2026-09-23]

### Python

Пакеты доступны через Python package index BSR.

Тариф/размещение: BSR Python SDK. Ограничения доказательства: Не утверждать, что BSR публикует пользовательские пакеты в публичный PyPI. [док Buf: https://buf.build/docs/bsr/generated-sdks/python/, 2026-09-23]

### Swift

Есть Swift package registry и Git fallback для Xcode. Git-репозиторий соответствует конкретной версии пакета.

Тариф/размещение: BSR Swift SDK. Ограничения доказательства: Изменение версии может требовать смены URL, не только revision в Package.swift. [док Buf: https://buf.build/docs/bsr/generated-sdks/swift/, 2026-09-23]

### Cargo

Sparse registry поддерживает Rust SDK; после priming используются eager generation paths.

Тариф/размещение: BSR Cargo SDK. Ограничения доказательства: Не описывать все экосистемы как исключительно lazy/on-demand. [док Buf: https://buf.build/docs/bsr/generated-sdks/cargo/, 2026-09-23]

### NuGet

BSR предоставляет NuGet v3 source и собственные package coordinates.

Тариф/размещение: BSR NuGet SDK. Ограничения доказательства: Настройте package source mapping и credentials по инструкции; не считать это nuget.org publication. [док Buf: https://buf.build/docs/bsr/generated-sdks/nuget/, 2026-09-23]

### CMake

Есть FetchContent workflow для C++ SDK.

Тариф/размещение: BSR CMake SDK. Ограничения доказательства: Это отдельный способ получения артефактов, не универсальный CMake registry для любых плагинов. [док Buf: https://buf.build/docs/bsr/generated-sdks/cmake/, 2026-09-23]

### Архивы SDK

Сгенерированные артефакты можно получать как архивы по версионным координатам.

Тариф/размещение: BSR SDK archive API. Ограничения доказательства: Редиректы и аутентификация зависят от запроса/приватности; сохранение source module не подразумевается архивом кода. [док Buf: https://buf.build/docs/bsr/generated-sdks/archive/, 2026-09-23]

### Документация SDK

Есть автоматически публикуемая справочная документация SDK для документированных экосистем, в частности Go/TypeScript.

Тариф/размещение: BSR SDK documentation. Ограничения доказательства: Не заявлять одинаковую API reference поддержку для всех восьми способов distribution. [док Buf: https://buf.build/docs/bsr/generated-sdks/sdk-documentation/, 2026-09-23]

### Auth

buf registry login, токены и BUF_TOKEN используются BSR-клиентами.

Тариф/размещение: Общий BSR auth; private instance identity требует соответствующих настроек. Ограничения доказательства: BUF_TOKEN не эквивалент EASYP_TOKEN, ни один не меняет несовместимый RPC-протокол. [док Buf: https://buf.build/docs/bsr/authentication/, 2026-09-23]

### Организации/RBAC

Есть роли организаций и репозиториев с наследованием эффективных прав.

Тариф/размещение: Общий BSR, административные расширения зависят от tier. Ограничения доказательства: Это реальная разница с единым allowlist write-capable токенов EasyP. [док Buf: https://buf.build/docs/bsr/admin/roles/, 2026-09-23]

### SSO/SCIM

Pricing включает SAML/OIDC SSO и SCIM/user management в Pro и унаследованные Enterprise возможности.

Тариф/размещение: Pro/Enterprise. Ограничения доказательства: Конкретные IdP и group mapping нужно настраивать; не обещать доступ Community на основании общих login providers. [док Buf: https://buf.build/pricing, 2026-09-23]

### Audit logs

Private BSR документирует аудит и варианты доступа для выбранного deployment.

Тариф/размещение: Pro/Enterprise. Ограничения доказательства: Не подтверждены универсальный retention, полный self-service export API и условия любого конкретного договора. [док Buf: https://buf.build/docs/bsr/admin/instance/audit-logs/, 2026-09-23] [док Buf: https://buf.build/pricing, 2026-09-23]

### Webhooks

Private-instance webhooks описаны как alpha; доставка best-effort, без подписи payload и автоматических retries.

Тариф/размещение: Private-instance functionality; конкретный договор не проверен. Ограничения доказательства: Не заявлять signed/durable delivery как преимущество Buf. [док Buf: https://buf.build/docs/bsr/admin/instance/webhooks/, 2026-09-23]

### Server policy checks

Применение schema policies на стороне BSR относится к Enterprise.

Тариф/размещение: Enterprise; локальные CLI checks — другая возможность. Ограничения доказательства: Policy enforcement не равно наличию команды lint на ноутбуке. [док Buf: https://buf.build/docs/bsr/checks/policies/, 2026-09-23]

### Review commits

Review управляет продвижением default label; pending commit может оставаться доступным по явному hash.

Тариф/размещение: BSR checks/review согласно документированной политике instance. Ограничения доказательства: Нельзя утверждать универсальную недоступность всех ссылок на unapproved commit. [док Buf: https://buf.build/docs/bsr/checks/review-commits/, 2026-09-23]

### Schema documentation

Публикуемые схемы имеют браузерную документацию с comments/README.

Тариф/размещение: BSR schema functionality. Ограничения доказательства: EasyP API Service не содержит schema repository для такой функции. [док Buf: https://buf.build/docs/bsr/documentation/, 2026-09-23]

### Buf Studio

Браузерный клиент строит запросы по схемам и обращается к API endpoint; запросы endpoint не обязательно проксируются сервером BSR.

Тариф/размещение: BSR Studio. Ограничения доказательства: Учитывать CORS/транспорт и реальные data flows, не выдумывать серверное хранение RPC bodies. [док Buf: https://buf.build/docs/bsr/studio/, 2026-09-23]

### Reflection API

BSR предоставляет дескрипторы сохранённых схем через документированный API.

Тариф/размещение: BSR reflection API с правами доступа к схемам. Ограничения доказательства: Не путать с включением gRPC reflection на любом произвольном приложении. [док Buf: https://buf.build/docs/bsr/reflection/, 2026-09-23]

### MCP

У BSR есть собственный MCP server/API integration.

Тариф/размещение: Документированная возможность; аккаунт и доступ не проверялись. Ограничения доказательства: MCP не является уникальной функцией EasyP. Нельзя выводить tool-набор BSR из tool-набора EasyP. [док Buf: https://buf.build/docs/bsr/apis/mcp/, 2026-09-23]

### Наблюдаемость on-prem

Документированы metrics/monitoring, dashboards и diagnostics on-prem BSR.

Тариф/размещение: Self-hosted/Enterprise; SaaS-внутренности обслуживает провайдер. Ограничения доказательства: Отсутствие пользовательского доступа к SaaS-метрикам не равнозначно отсутствию наблюдаемости продукта. [док Buf: https://buf.build/docs/bsr/admin/on-prem/observability/, 2026-09-23]

### Цена на дату

Community free:1private repository до100types; Teams0.50USD/type/month; Pro5USD/type/month,min3000USD/month; Enterprisequote.

Тариф/размещение: Состояние pricing2026-09-23. Ограничения доказательства: Types=messages/enums/RPC; billed scope различается по tier. Публикуемые цены не равны договору, налогам или стоимости remote-generator-only. [док Buf: https://buf.build/pricing, 2026-09-23]

### Лицензии публичного кода

Buf CLI и recipes bufbuild/plugins имеют Apache-2.0.

Тариф/размещение: Публичные GitHub repositories. Ограничения доказательства: Это не доказывает Apache-2.0 у сервера BSR; API repos не равны server implementation. [док Buf: https://github.com/bufbuild/buf/blob/f29dbd335d49393d23e5a1ba4c8718932b33692e/LICENSE, 2026-09-23] [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/LICENSE, 2026-09-23]

### Условия использования

Публичные Terms of Use имеют дату обновления2023-11-10 и допускают дополнительные условия конкретных услуг, имеющие приоритет для них.

Тариф/размещение: Общие web/service terms, не копия Enterprise-договора. Ограничения доказательства: Не выводить гарантии storage/SLA/региональной доступности из факта публичной доступности сайта; нужен применимый договор. [док Buf: https://buf.build/legal/terms-of-use, 2026-09-23]

### Privacy policy

Актуальный официальный policy URL найден через footer pricing.

Тариф/размещение: Общие сведения о политике. Ограничения доказательства: Не сертифицированы data residency конкретного Enterprise-инстанса и соответствие требованиям РФ. [док Buf: https://buf.build/legal/privacy-policy, 2026-09-23]

### Status и SLA

Support docs ссылаются на bufstatus.com; exact SLA response times зависят от customer agreement.

Тариф/размещение: Private Pro/Enterprise/on-prem support. Ограничения доказательства: Содержимое архива публичных инцидентов не удалось верифицировать; uptime/ranking/outage frequency не вычислялись. [док Buf: https://buf.build/docs/bsr/admin/instance/support/, 2026-09-23]

## Каталог плагинов и происхождение упаковки

Проверенный commit bufbuild/plugins: <code>392d085396a7b53cf130aed7bd3ee83f22927aa3</code>; Buf CLI: <code>f29dbd335d49393d23e5a1ba4c8718932b33692e</code>. В первом подсчитано85уникальных identities и1886version directories с buf.plugin.yaml; у EasyP —80/1743. Это counts рецептов, не инвентарь реально доступного BSR или проверенных executable. [команда: Path("buf-plugins/plugins").rglob("buf.plugin.yaml"), len и set(parent.parent); Path("service/registry").rglob("plugin.yaml"), сумма versions] [док Buf: https://github.com/bufbuild/plugins/tree/392d085396a7b53cf130aed7bd3ee83f22927aa3, 2026-09-23]

Fetcher workflow запускается раз в4часа; это период обнаружения кандидатов, не SLA публикации обновлений. CONTRIBUTING описывает review, plugin versions/revisions и воспроизводимые integration fixtures. [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/.github/workflows/plugin-fetcher.yaml, 2026-09-23] [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/CONTRIBUTING.md, 2026-09-23]

EasyP registry/bufbuild/es/package.json и package-lock.json побайтово совпадают с Buf recipe v2.9.0. Это доказательство одинаковых файлов, не доказательство истории авторства всего каталога. Переработка Dockerfile не устраняет возможные обязанности Apache-2.0 по копии лицензии, copyright и уведомлениям об изменениях; юридическое соответствие нужно проверить отдельно. Наличие каталога vendor не является атрибуцией само по себе. [код: service/registry/bufbuild/es/package.json:3] [команда: сравнение read_bytes() двух пар файлов] [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/plugins/bufbuild/es/v2.9.0/package.json, 2026-09-23] [док Buf: https://github.com/bufbuild/plugins/blob/392d085396a7b53cf130aed7bd3ee83f22927aa3/LICENSE, 2026-09-23]

## Buf CLI: последние примерно12месяцев changelog

Прочитан текущий CHANGELOG от1.73.0(2026-09-21) назад до окна2025-09-23; последний релиз — не предположение из памяти. [док Buf: https://github.com/bufbuild/buf/blob/f29dbd335d49393d23e5a1ba4c8718932b33692e/CHANGELOG.md, 2026-09-23]

В окне были исправления сериализации user-defined/extension options для remote generation(1.59–1.62), managed-mode precedence(1.68), работа с версиями/параметрами генерации(1.70), переход policy CLI к стабильным командам(1.67). Удаление beta policy organization-команды в1.64 не означает удаления remote plugins. Опция --debug-no-parallel для generate появилась в1.69. Это change inventory, не утверждение, что каждый релиз меняет протокол сервера. [док Buf: https://github.com/bufbuild/buf/blob/f29dbd335d49393d23e5a1ba4c8718932b33692e/CHANGELOG.md, 2026-09-23]

v2 buf.gen.yaml использует remote/local/protoc_builtin. Нельзя объявлять любое слово plugin: устаревшим без версии и контекста: check plugins, legacy generation configs и v2 remote — разные контракты. В примерах сайта использован current v2 remote; автоматическая миграция произвольного v1 конфига не обещается. [док Buf: https://buf.build/docs/configuration/v2/buf-gen-yaml/, 2026-09-23]

## Покрытие чтения и пределы полноты

Полностью прочитаны78BSR-страниц сохранённой навигации (пакеты buf-bsr-reading/01–09), README/CONTRIBUTING и лицензия bufbuild/plugins, релевантное12-месячное окно Buf CLI changelog, pricing, публичные legal/support страницы. Общий обход сохранил268ответов, включая дубликаты, assets, RSS и страницы вне BSR. Сам факт HTTP200 или сохранения HTML **не считается прочтением и верификацией всей документации Buf**. Полное чтение всех разделов вне BSR не завершено; их содержимое не используется как доказанное сверх конкретно указанных источников. Это незакрытая часть исходного требования, не скрытый success. [команда: scratch/buf-snapshot/manifest.json и scratch/buf-bsr-reading/*] [не подтверждено: полное чтение всей документации Buf]

| Прочитанная BSR-страница | Сохранённый SHA-256 HTTP body |
| --- | --- |
| [док Buf: https://buf.build/docs/bsr/, 2026-09-23] | <code>0fb2c7c9efb8641c220e289efc4ef150a0422fc4917fcc4762de0047944cc153</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/audit-logs/, 2026-09-23] | <code>ef0ecbe03d437b0ceeaf1b4e7eb47bc49ddf83971efb7919339780d71a43d531</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/bot-users/, 2026-09-23] | <code>2e5e2b74a4d05e1a606b84cd9d53461eece6cc9067f5487a6d6cc04e3f18ac31</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/customize-appearance/, 2026-09-23] | <code>38bd01e4e28d5df98e3c0e1dda19459002242af929bc1c942dbf615d999728c2</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/customize-homepage/, 2026-09-23] | <code>21e2715045ece8565f3e05a2d13a51b587d1728d3ecfb3eace37c0b8ccd0e274</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/customize-instructions/, 2026-09-23] | <code>883cf6c66d2af2eace7893748e5d9e5529b9a6cfb473ff58409ce328f02d658d</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/disable-package-managers/, 2026-09-23] | <code>f6aa401d316ba2a922cdadfb80aaa1d7893096010e0b77dc8eb74b9275fe66ec</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/manage-access-idp-groups/, 2026-09-23] | <code>294dcb2fdb06808e5b713324654d040ed44d05e27b827b02c7f5e28148d21205</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/manage-plugin-versions/, 2026-09-23] | <code>641ef0eae48f21f127ef613cb472ec5bd43a113ba818926376100cf7bf925a1f</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/managed-modules/, 2026-09-23] | <code>c1ed7851a6bc38be290eb8cc5064abd4e791ba09e40ca8bdfff2a8033db4dddb</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/plugin-management/, 2026-09-23] | <code>823f1c07bbe3d7f6ee31cd780997b45cb4a5426fd374c5ffb140023b08f0cbaa</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/scim/, 2026-09-23] | <code>75b2a03b9b99e68dfc43da3c53e24276f5f34c26adce799486a111e6198931dd</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/scim/azure-saml/, 2026-09-23] | <code>850fee16c2b2bb63743db74fe2e85072fd1f1c9bdb22b71103956812fc1dc11a</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/scim/faq/, 2026-09-23] | <code>1bb847a9861d6a0ddbe5f0441194ab6f288d60bad938c76bcabfcae51b7f0c66</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/scim/okta-saml/, 2026-09-23] | <code>e5407bf1b87dcada4b4e44705963d2ef5370b9c7a0f673d3e4159ccbaabe7f83</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/setup/, 2026-09-23] | <code>bfc56f1634bcfc8370f1f20f71ebf059e1d2bc4afdedd1bf7ed47962beeb024f</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/sso/github-oauth2/, 2026-09-23] | <code>bb5ff97937db8b38ccefc8678741a98f95722fc396ceb06509e918c6b4935418</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/sso/google-saml/, 2026-09-23] | <code>e320171831e71a7beab2aac19fe882cff7581180d604acea1e951053a7335041</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/sso/okta-oidc/, 2026-09-23] | <code>ad9f3ec4b9c503fbb486f0aaa83acec58cae1587abcdb3724bab370551d18175</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/sso/okta-saml/, 2026-09-23] | <code>9dd318ec23dad4dfce1d1f8df0c32b5957767b7f273c8e1b9698bc8237f866e3</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/support/, 2026-09-23] | <code>070f57ba61ba2703a943dc7404617a421915c6084a8bad1b7d3243cd338f172e</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/user-lifecycle/, 2026-09-23] | <code>078cbab0d9a8cf9005e66f9d451182983244afb65c440169f75a6c77c3e2096a</code> |
| [док Buf: https://buf.build/docs/bsr/admin/instance/webhooks/, 2026-09-23] | <code>77ea09dc98e6d0febd587b70629af1a7f2d72175b596db8db603a5965a9a9629</code> |
| [док Buf: https://buf.build/docs/bsr/admin/manage-organizations/, 2026-09-23] | <code>8eb9c53aeaf5021a6f408f8c3e6472f1a33d9c20eb7467b16853d2a2e77b8f00</code> |
| [док Buf: https://buf.build/docs/bsr/admin/on-prem/architecture/, 2026-09-23] | <code>7ae06129c070a6222cd1bd4e36295feb035aa84f02d034cf8557dd42c3b94f88</code> |
| [док Buf: https://buf.build/docs/bsr/admin/on-prem/configuration/, 2026-09-23] | <code>c637a57abb40b40dd6364ac1660963cebfb6acdd3228e234fc61b6a3c6415f76</code> |
| [док Buf: https://buf.build/docs/bsr/admin/on-prem/installation/, 2026-09-23] | <code>2f1e358fb5b441d0fc19f8dc1e4267be078f6956b010a62cfd3c4e1e2c92e71d</code> |
| [док Buf: https://buf.build/docs/bsr/admin/on-prem/observability/, 2026-09-23] | <code>2410759a5ad176b1d249110013e6a8e50572d4fdd03ebf9fd579b315626c6314</code> |
| [док Buf: https://buf.build/docs/bsr/admin/on-prem/release-notes/, 2026-09-23] | <code>0a8d87aefcd0d18a66239577ba5cebe2a191b5a7cfd7a8c6509923fbeb6bd822</code> |
| [док Buf: https://buf.build/docs/bsr/admin/on-prem/upgrade/, 2026-09-23] | <code>1dbdc772aa84799e4882e93176996951b604f05f19a7b7cfbbbac2a995728678</code> |
| [док Buf: https://buf.build/docs/bsr/admin/private-user-orgs/, 2026-09-23] | <code>36080b178d8dcaef8a46aa23762b47c8634991ee709e771e5330587f5f7a2413</code> |
| [док Buf: https://buf.build/docs/bsr/admin/resource-visibility/, 2026-09-23] | <code>48e1952eeff3c5df7b6a53ca5e78ed14e221d1fb2f3ee9ae8128d817c84e2dcb</code> |
| [док Buf: https://buf.build/docs/bsr/admin/roles/, 2026-09-23] | <code>4e7b2e4b7bfb8859cc2a13ea710e9584b5cd1c319c9c16b4f8b8c459b02d1812</code> |
| [док Buf: https://buf.build/docs/bsr/admin/user-account/, 2026-09-23] | <code>15d80279bcc102bef740b4c980c44a8018979e08c63dd99f8161f74c2d67ede3</code> |
| [док Buf: https://buf.build/docs/bsr/apis/api-access/, 2026-09-23] | <code>45896638067fad221d55533d6dbfe324c7f4542c06bbb1cfbd903570b61d4494</code> |
| [док Buf: https://buf.build/docs/bsr/apis/mcp/, 2026-09-23] | <code>c89e149b3ae42b4bca57c2cb3386fa2d7c4d7e92a808211c0720d19f811e0e8f</code> |
| [док Buf: https://buf.build/docs/bsr/authentication/, 2026-09-23] | <code>ba8c65de036b16515f6eaeba942e3ceff03fb3dd9dd2dcff3e3060583a5e2e9e</code> |
| [док Buf: https://buf.build/docs/bsr/authentication/trust-credentials/, 2026-09-23] | <code>d256284c6c4fa01c2e3f0ab540b0e4de27ccdd499f82db1e6860de113d27e3e5</code> |
| [док Buf: https://buf.build/docs/bsr/checks/, 2026-09-23] | <code>c0dc85a0abcdced360afb75352c07d94724a9dfec734afbf80630b4dc3a813cd</code> |
| [док Buf: https://buf.build/docs/bsr/checks/breaking/, 2026-09-23] | <code>3d8ae051f89259bb5c0c7e76d4ea74d4ddf0caf297232fa1cab41fd923738fc0</code> |
| [док Buf: https://buf.build/docs/bsr/checks/plugins/, 2026-09-23] | <code>0b2d6305d1dc802a82c49f2bf8f3bc8f5cfdcece611e0f1b9502009a4eedd30a</code> |
| [док Buf: https://buf.build/docs/bsr/checks/plugins/publish/, 2026-09-23] | <code>3530073f5169d8f011e85843b2c64272e9d1a7c64a77d6a4176f1ebacba8d5cd</code> |
| [док Buf: https://buf.build/docs/bsr/checks/plugins/tutorial/, 2026-09-23] | <code>2830851a0ab26d41d8eab8410415bcc24086317a11fd6a71968939dd85c0f484</code> |
| [док Buf: https://buf.build/docs/bsr/checks/policies/, 2026-09-23] | <code>6a43e3e838d6af84a42f481263c43b0e1dab96745191a0bd57d3c716a080681a</code> |
| [док Buf: https://buf.build/docs/bsr/checks/review-commits/, 2026-09-23] | <code>2f74b99d1b3f705f1310e8f7adc4305a871cfe465d73258b1b15147672ef10f9</code> |
| [док Buf: https://buf.build/docs/bsr/checks/uniqueness/, 2026-09-23] | <code>140609ffa8cfb3f227dd5a90966ecb971ba849041d659262bcdce62b314ba1e7</code> |
| [док Buf: https://buf.build/docs/bsr/ci-cd/github-actions/, 2026-09-23] | <code>86eeed9aa005571d8b9bfa5f111c92ec35e99cbc52e68080ca1beda532576187</code> |
| [док Buf: https://buf.build/docs/bsr/ci-cd/setup/, 2026-09-23] | <code>9272a13bb90d883f1c30ef525cb818ebe5754963146313a10fc0b6a66ad9bde8</code> |
| [док Buf: https://buf.build/docs/bsr/commits-labels/, 2026-09-23] | <code>77550d0c81a47ab0e15bc2a5482e8732e3749a9f7bbb85879dd4ba2f1453f110</code> |
| [док Buf: https://buf.build/docs/bsr/documentation/, 2026-09-23] | <code>b9b33779c069c5cecffb1c4f704e44d1f8de9c6771bf05dbffe9efc01a71edfb</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/, 2026-09-23] | <code>427208a1b734654bdb2e2e001f3ec1a0285feb9386cafe90d57fc6a83332648d</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/archive/, 2026-09-23] | <code>63dbf50ee36dde75e44c145ab031a896e9b22be595b4f2f0d2dc1c03c40892bd</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/artifactory/, 2026-09-23] | <code>418be35994067060f2d08c0e1fcca2b9e894091332959fee40741de71f08b936</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/cargo/, 2026-09-23] | <code>cee8e06cebf830e9f21380bbf8565bb36eb8137fbba03d3a6b944c6a7414308f</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/cmake/, 2026-09-23] | <code>d03d48b9397d5d6a04697354138e6c4f450b1efebd837ce3ef22553c7c7e5fb0</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/go/, 2026-09-23] | <code>9c6d35f172a3074ba91a4d5ca9b20735ea9fdf472657be15f6f9ee73e938cfae</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/maven/, 2026-09-23] | <code>1b8dbb9e991e68689d7a730864d9e4b47b42f55203db8d2064c6274289f94835</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/npm/, 2026-09-23] | <code>54bf810c54a2bb2153d94a7ca2401d3db6a5bcd93d21d29f7aba1674e1a268af</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/nuget/, 2026-09-23] | <code>7a14301074da3e3984185b87580da5b0a8c61e7eba81509baf1bec2cd38dc2bb</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/python/, 2026-09-23] | <code>66f01280d90cdb94bf811ea3f91d229808fa143cb01c1159f9824366a303e997</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/quickstart/, 2026-09-23] | <code>34b18219249425d9c90af94431cf01d6ac815393f8dd7b3921aa67dc918e9e83</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/sdk-documentation/, 2026-09-23] | <code>4243c7773dae62d3dd7cc1882041f7e82f0c6639604ad43054bac4410f05530b</code> |
| [док Buf: https://buf.build/docs/bsr/generated-sdks/swift/, 2026-09-23] | <code>3b140017d04dcd369b4ab83abc8cc9c932ad4963f238a6c4e8672cede315e8e7</code> |
| [док Buf: https://buf.build/docs/bsr/module/dependency-management/, 2026-09-23] | <code>1e7ef6a2969d4ef6581b40dc8d3783352ba5f630c88caf44470369dbdd311e8d</code> |
| [док Buf: https://buf.build/docs/bsr/module/descriptor/, 2026-09-23] | <code>00003bbeb546b73a4ead0e679d855b862cf63535a960599b619628bb2fc188a3</code> |
| [док Buf: https://buf.build/docs/bsr/module/export/, 2026-09-23] | <code>78e8589fbe17c46942ab88c248c315278252481d0b38d814867cf2e11192e9e4</code> |
| [док Buf: https://buf.build/docs/bsr/module/publish, 2026-09-23] | <code>24cb7a9c6cf2fe7271709326bec824f77899e59ebf8befa926240a44c1dfedaa</code> |
| [док Buf: https://buf.build/docs/bsr/module/publish/, 2026-09-23] | <code>24cb7a9c6cf2fe7271709326bec824f77899e59ebf8befa926240a44c1dfedaa</code> |
| [док Buf: https://buf.build/docs/bsr/module/tamper-proofing/, 2026-09-23] | <code>cb5faf5229cb588ca6020af406221754cb39cc4d4902d27469ce996aa5c22238</code> |
| [док Buf: https://buf.build/docs/bsr/quickstart/, 2026-09-23] | <code>cc74516bda2506f11a23d00fef42fe062b4bdfb630f588a7d399f73c76f02820</code> |
| [док Buf: https://buf.build/docs/bsr/rate-limits/, 2026-09-23] | <code>1862b1f3d59a6eb9542785439d1b4252f8013a6443eb320678f754741b26d237</code> |
| [док Buf: https://buf.build/docs/bsr/reflection/, 2026-09-23] | <code>2003bb617167c70c17f38875ef1bfbda4539812784b03d3574de22803bc28aed</code> |
| [док Buf: https://buf.build/docs/bsr/remote-plugins/, 2026-09-23] | <code>8ef17f89bfb84fdd8a2095d6adfc634956fcdab03b06294d67c1494c3aee8074</code> |
| [док Buf: https://buf.build/docs/bsr/remote-plugins/custom-plugins/, 2026-09-23] | <code>d213401c3c984f88de6b2c2eed232e2ad92d16667c77e4eaa64dffaa73d73798</code> |
| [док Buf: https://buf.build/docs/bsr/remote-plugins/usage/, 2026-09-23] | <code>df26792c25c54fb189601c966cadedcd4a48d9a7b0d5d250e7ef65a98fdb4445</code> |
| [док Buf: https://buf.build/docs/bsr/repositories/, 2026-09-23] | <code>976248a05db77a2b59c4763dc12f0df73135157da91685672d2f8dfd64a2e405</code> |
| [док Buf: https://buf.build/docs/bsr/studio/, 2026-09-23] | <code>002b78fa372ea61f631eb7d2d0688271ba7a63824dddff2ea27dc7fdeaefacd0</code> |
| [док Buf: https://buf.build/docs/bsr/ci-cd/gh-actions/, 2026-09-23] | <code>97c0f7409067780611722caf87d1494c9310a83dae3593f720cfa0f0442fdb4b</code> |

## Неподтверждённое

Универсальные CPU/RAM/timeout ограничения remote plugin sandbox; фактическая доступность всех recipe versions; история публичных инцидентов и сравнительный uptime; лицензионные условия исходников backend BSR; конкретные Enterprise prices, SLA, retention и regional procurement; фактический BSR account smoke; все sections вне BSR. Ничто из этого не превращено в заявленное преимущество EasyP. [не подтверждено]
