> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Матрица сравнения EasyP API Service ↔ Buf BSR (remote plugins)

Источники Buf — `[док Buf: URL, 2026-09-23]`; подробные цитаты в `bsr-facts.md`. Источники EasyP — `service-facts.md`
(номер факта) или `[код: …]`. «Сильнее» — моя оценка с обоснованием, её можно оспорить.

| # | Ось | EasyP | BSR | Кто сильнее и почему |
|---|---|---|---|---|
| 1 | Модель развёртывания | Только self-hosted: образ, Helm, бинарник; нужны PostgreSQL, (опц.) S3, том под кеш [SF 11.x, 4.1] | SaaS buf.build; Pro — private instance `<org>.buf.dev`; Enterprise — single-tenant / on-prem (K8s, Postgres 14+, Redis 6.2+, blob, ~8 vCPU/32 GiB) [док Buf: pricing; subscription/faq; on-prem/installation, 2026-09-23] | **BSR** для «ничего не эксплуатировать»; **EasyP** для self-hosted без Enterprise-контракта. |
| 2 | Где исполняется плагин, изоляция | Дочерний процесс, без песочницы; ограничены время/параллельность/вывод/env/путь [SF 3.1-3.7] | «BSR sandbox's filesystem and network constraints» [док Buf: remote-plugins]; on-prem `bufsandboxd` «sandboxed runtime» [док Buf: on-prem/architecture]; технология не названа | **BSR**. Следствие для EasyP: любые плагины (в т.ч. сетевые) работают, но регистрация = RCE на хосте. |
| 3 | Каталог | 80 плагинов / 1738 версий, рецепты; собирать самому [SF 16] | bufbuild/plugins: 85 / 1886, готовые [команда: gh api tree, 2026-09-23]; кол-во на buf.build/plugins — [не подтверждено] | **BSR** немного больше и не требует сборки. Приватные: EasyP — на любом тарифе (Community ≤10 версий всего) [SF 8.1]; BSR — Pro+ [док Buf: custom-plugins]. |
| 4 | Приватность исходников, air-gap, юрисдикция | `CodeGeneratorRequest` уходит только в ваш сервис; air-gap возможен (образ + свои плагины; S3 опционально) [SF 4.1] | Публичный BSR — в исполнитель Buf; on-prem — «fully air-gapped install is supported» [док Buf: on-prem/architecture] | Равенство при BSR on-prem; **EasyP** дешевле войти. Юрисдикция публичного BSR — по их Privacy Policy [не читал, не подтверждено]; на сайте юрисдикцию не описываю. |
| 5 | Производительность | Бенчмарка нет; +1 RTT на плагин, скачивание при промахе кеша [SF 2, 4.2] | Бенчмарка нет | **Неизвестно**. Цифр не приводим. |
| 6 | Надёжность, зависимость, rate limits | Одна реплика на кеш, вертикальное масштабирование [SF 4.8]; лимиты задаёте сами (дефолт 10 rps/IP, 2 в полёте/IP) [config.go:354-361] | SLA 99% Pro / 99.5% Enterprise [док Buf: pricing]; публичный: 10 gen/час без auth, 960/час с auth, ≤20 плагинов на запрос; dedicated — без лимитов [док Buf: rate-limits]; статус-страница bufstatus.com | **BSR** по доступности; **EasyP** по отсутствию внешних лимитов. |
| 7 | Auth, орг., RBAC, SSO, аудит | Статические bearer-токены (sha256 в конфиге), нет пользователей/ролей/SSO/срока жизни [SF 7.x]; аудит — Enterprise [SF 6.3]; CLI не шлёт токен [SF 13.3] | `buf registry login`/`BUF_TOKEN`, токены full/limited, bot users (private) [док Buf: authentication]; роли Member/Writer/Admin/Owner + resource roles [док Buf: roles]; SSO/SCIM на Pro [док Buf: pricing]; audit logs — private instance [док Buf: audit-logs] | **BSR** однозначно. |
| 8 | Наблюдаемость для оператора | ~53 метрики, PrometheusRule на 11 алертов + 6 хостовых, runbook на каждый, OTLP, Pyroscope [SF 15; observability.mdx] | SaaS — не вопрос пользователя; on-prem — есть раздел Observability [навигация док Buf, 2026-09-23; содержимое не читал] | Для SaaS сравнение неприменимо; для on-prem — **не подтверждено**, что лучше. |
| 9 | Лицензия и TCO | Сервис ELv2 (source-available), api/sdk Apache-2.0 [SF 8.9]; Community бесплатно; Enterprise — лицензия (цены нет в репо — [не подтверждено]); + инфраструктура и люди | CLI Apache-2.0 [github bufbuild/buf]; сервер закрыт; $0.50/тип Teams, $5/тип Pro (мин. $3000/мес), Enterprise по запросу [док Buf: pricing] | Зависит от масштаба. Для малой команды на free BSR — **BSR** дешевле по TCO. |
| 10 | Интеграция с инструментами | `easyp generate` + `remote:`; протокол `easyp.generator.v1` [SF 13] | `buf generate` + `remote:` v2 [док Buf: usage] | Взаимно несовместимы: easyp CLI не ходит в BSR (нет спец-обработки buf.build, другой API) [SF 13.7; не проверено экспериментом против buf.build]; `buf` не ходит в EasyP (EasyP не реализует API BSR) [вывод из кода EasyP; поведение `buf` не проверял]. |
| 11 | Чего нет у EasyP вовсе | — | Generated SDKs (Go, npm, Maven/Gradle, PyPI, Cargo, Swift, NuGet, CMake, архивы) [док Buf: generated-sdks]; реестр модулей; Studio [док Buf: studio]; Reflection API [док Buf: reflection]; hosted policies/push-time checks (Enterprise) [док Buf: policies]; webhooks (alpha) [док Buf: webhooks]; документация схем; роли/SSO/SCIM; песочница | **BSR**. |
| 12 | Чего нет у BSR, но есть у EasyP (подтверждено кодом) | Self-hosted Community без лицензии и без биллинга по типам [SF 8.1-8.2]; source-available сервер; исполнение на arm64 (образ multi-arch) [SF 11.1] vs custom-plugin executor linux/amd64 [док Buf: custom-plugins]; плагины с сетью/ФС (следствие отсутствия песочницы) | — | MCP — **не** отличие: у BSR есть MCP server (шире, с записью) [док Buf: apis/mcp]. Кастомные потолки — не преимущество, а ограничение Community. |
| 13 | Миграция | BSR→EasyP: имена совпадают после хоста; `opt`→`opts` (карта); CI без токена; ≤10 версий на Community; 30 s дедлайн [migrating-from-bsr.mdx] | EasyP→BSR: custom plugins только Pro+, linux/amd64, без сети/ФС; логин ради лимитов [док Buf: custom-plugins, rate-limits] | Обратный путь описан на сайте. |
| 14 | Когда что | см. `vs-buf-bsr.mdx` «When to choose …» | | |

## Утверждения, которые Buf мог бы оспорить, и что с ними сделано

| Утверждение | Риск | Решение |
|---|---|---|
| «Server source not published» | Buf может возразить о формулировке | Оставлено как «Not published; on-prem is licensed» со ссылкой на on-prem installation (лицензия `buflicense-…`). Прямого документа «сервер закрыт» не нашёл → в bsr-facts помечено [не подтверждено документом]. |
| «Self-hosting the BSR is an Enterprise offering» | pricing: Enterprise «Self hosted, on-prem deployments available»; Pro — private instance, хостинг Buf | Формулировка соответствует pricing. |
| Счёт 85/1886 | зависит от метода подсчёта; каталог BSR может отличаться от репо | Метод указан в сноске на сайте. |
| «Plugins run in a sandbox» | Buf сам так пишет | Цитата со ссылкой. |
| «unauthenticated generation 10 req/hour per IP» | «numbers can change» | Дата на странице + ссылка. |
| «data stays in your network … BSR only on-prem» | Pro — выделенный инстанс, но у Buf | Формулировка «keeps them in your network only on an on-prem deployment» — корректна. |
| Производительность | — | Цифр нет, прямо сказано. |
| «For a small team on the public BSR's free plan, that operational cost is almost certainly higher» | оценка, не факт | Сформулировано как оценка («almost certainly»), без цифр. |
