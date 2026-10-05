> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Buf Schema Registry — факты с источниками

Все страницы прочитаны **2026-09-23** через WebFetch (страница конвертируется в markdown и пересказывается
вспомогательной моделью, поэтому цитаты — «почти дословные»; перед публикацией чего-то спорного
перепроверьте на живой странице). Если страница чего-то не говорит — это записано явно.

## Remote plugins

| Факт | Источник |
|---|---|
| При `buf generate` с `remote:` BSR «sends the input to its plugin executor, runs the plugin against it, and writes the output to your local disk». | [док Buf: https://buf.build/docs/bsr/remote-plugins/ , 2026-09-23] |
| Remote plugins «run under the BSR sandbox's filesystem and network constraints»; локальные плагины «can do things the BSR sandbox prohibits». | там же |
| Синтаксис v2: `- remote: buf.build/protocolbuffers/go:v1.36.11`, `out:`, `opt:`. Без версии — «resolves to the latest version every time». Рекомендуют пинить. | там же; [док Buf: https://buf.build/docs/bsr/remote-plugins/usage/ , 2026-09-23] |
| `buf.gen.yaml` допускает `remote:` и `local:` в одном файле; плагины работают параллельно. | [usage, 2026-09-23] |
| Технология песочницы, лимиты памяти/CPU/времени на страницах remote plugins и custom plugins **не описаны**. | [remote-plugins, custom-plugins, 2026-09-23] |
| Плагины, которые «access the file system, make network requests» или зависят от чего-то вне `CodeGeneratorRequest», «aren't supported on the BSR». Исполнитель — Linux/amd64. | [док Buf: https://buf.build/docs/bsr/remote-plugins/custom-plugins/ , 2026-09-23] |
| Запросить плагин в публичный каталог — issue в `bufbuild/plugins`; «more likely to accept plugins that are widely adopted, stable, well-documented». | [remote-plugins, 2026-09-23]; [https://github.com/bufbuild/plugins README, 2026-09-23] |

## Custom plugins

| Факт | Источник |
|---|---|
| «Custom plugins are available on the Pro plan and above.» Пушатся в **private BSR instance**. | [custom-plugins, 2026-09-23] |
| Упаковка — Docker-образ `linux/amd64`, non-root, `buf.plugin.yaml` (`version: v1`, `name`, `plugin_version`), `buf beta registry plugin push --visibility=public|private --image=...` (команда ещё в `beta`). | там же |
| Видимость: public (всем пользователям инстанса) или private (члены организации). | там же |
| «You can push as many custom plugins as you need.» | там же |
| Удаление: `buf beta registry plugin delete`, роль Admin; блокируется, если от плагина зависят другие. | там же |

## Каталог bufbuild/plugins

| Факт | Источник |
|---|---|
| Лицензия репозитория — Apache-2.0. | [команда: `gh api repos/bufbuild/plugins --jq .license.spdx_id` → `Apache-2.0`, 2026-09-23] |
| Каждый плагин-версия = `buf.plugin.yaml` + `Dockerfile` в `plugins/<owner>/<name>/<version>/`. | [https://github.com/bufbuild/plugins README, 2026-09-23] |
| **85** плагинов, **1886** версий (по наличию `plugins/<owner>/<name>/v*/buf.plugin.yaml` в дереве `main`). | [команда: `gh api 'repos/bufbuild/plugins/git/trees/main?recursive=1'`, truncated=false, 2026-09-23] |
| Владельцы: anthropics, apple, bufbuild, community, connectrpc, googlecloudplatform, grpc, grpc-ecosystem, pluginrpc, protocolbuffers. | там же |
| Активно обновляется: последние коммиты 2026-09-22 (bump базовых образов). Расписание обновлений в README не описано. | [команда: `gh api repos/bufbuild/plugins/commits?per_page=3`, 2026-09-23] |
| Сколько плагинов показывает https://buf.build/plugins — **не удалось установить** (страница рендерится JS, WebFetch получил только заголовок). Каталог BSR может отличаться от репозитория. | [не подтверждено] |

## Generated SDKs

| Факт | Источник |
|---|---|
| Generated SDK — «a language-native package the BSR builds from a Buf module and a plugin»; генерируются «for every commit». | [док Buf: https://buf.build/docs/bsr/generated-sdks/ , 2026-09-23] |
| Разделы: JFrog Artifactory, Cargo, CMake, Go, Maven/Gradle, npm, NuGet, Python, Swift, «Download an archive». | там же |
| «Every plan can use Buf-managed plugins through remote plugins and generated SDKs.» | [док Buf: https://buf.build/docs/subscription/faq/ , 2026-09-23] |

## Rate limits

| Факт | Источник |
|---|---|
| Публичный `buf.build` ограничивает весь трафик «regardless of the user's plan»; Pro dedicated (`<org>.buf.dev`) и Enterprise — «no rate limits under current configuration». | [док Buf: https://buf.build/docs/bsr/rate-limits/ , 2026-09-23] |
| Code generation: без аутентификации 10 req/hour (burst 10), с аутентификацией 960 req/hour (burst 120); один `buf generate` = один запрос; «hard ceiling of 20 plugins per request». | там же |
| General API 30 req/s (burst 60); FileDescriptorSetService 1 req/s (burst 2). Ответ 429 + `resource_exhausted` + `Retry-After`. | там же |
| «Limits below reflect current policy; specific numbers can change.» | там же |

## Тарифы (на 2026-09-23)

| Факт | Источник |
|---|---|
| Биллинг — за тип (message, enum, RPC) в месяц. | [https://buf.build/pricing , 2026-09-23]; [subscription/faq, 2026-09-23] |
| Community — Free: один приватный репозиторий до 100 типов, поддержка через Slack. | там же |
| Teams — $0.50 за тип/мес: неограниченные приватные репозитории, email-поддержка 48 рабочих часов. | [pricing, 2026-09-23] |
| Pro — $5 за тип/мес, минимум $3000/мес: hosted custom plugins, SSO (SAML/OIDC), SCIM, audit logging, private instance на своём поддомене, 99% uptime SLA. | [pricing, 2026-09-23] |
| Enterprise — цена по запросу: self-hosted/on-prem, full data isolation, dedicated CE, 99.5% uptime SLA. | [pricing, 2026-09-23] |
| Какие тарифы включают remote plugins/generated SDKs в таблице сравнения — галочки не извлеклись; закрыто цитатой из FAQ «Every plan can use...». | [pricing + subscription/faq, 2026-09-23] |
| Pro при отмене: доступ к инстансу неделю, потом удаляется. | [subscription/faq, 2026-09-23] |

## Private / On-Prem

| Факт | Источник |
|---|---|
| On-prem состоит из `bufd`, `bufsandboxd` («A sandboxed runtime that executes plugin images»), `bufpluginsd`, `bufmodulesd`, `buftoolsd` и встроенного OCI registry. | [док Buf: https://buf.build/docs/bsr/admin/on-prem/architecture/ , 2026-09-23] |
| Технология песочницы `bufsandboxd` не названа. | там же |
| Требует от заказчика PostgreSQL, Redis, blob storage; ставится Helm-чартом в Kubernetes; «typical deployment fits comfortably in 8 vCPUs and 32 GiB»; PostgreSQL 14+, Redis 6.2+ standalone. | [док Buf: https://buf.build/docs/bsr/admin/on-prem/installation/ , 2026-09-23] |
| «A fully air-gapped install is supported by mirroring the BSR release images»; в рантайме BSR «doesn't send analytics, telemetry, or user data to Buf». | [on-prem/architecture, 2026-09-23] |
| Нужна лицензия (`buflicense-...`), выдаётся при онбординге. | [on-prem/installation, 2026-09-23] |
| Какой тариф даёт on-prem — на страницах on-prem не сказано; pricing относит self-hosted к Enterprise. | [pricing, 2026-09-23] |

## Аутентификация, роли, аудит, SSO

| Факт | Источник |
|---|---|
| `buf registry login` (браузер → токен в `.netrc`), `BUF_TOKEN`; токены full/limited; bot users — только private instance. | [док Buf: https://buf.build/docs/bsr/authentication/ , 2026-09-23] |
| Роли организации: Member, Writer, Admin, Owner; роли ресурса: Read, Limited Write, Write, Admin. | [док Buf: https://buf.build/docs/bsr/admin/roles/ , 2026-09-23] |
| Audit logs — «a private-BSR feature»; события users/orgs/repos/plugins; `ListAuditedEvents` для админов. | [док Buf: https://buf.build/docs/bsr/admin/instance/audit-logs/ , 2026-09-23] |
| SSO (GitHub OAuth2, Google SAML, Okta OIDC/SAML), SCIM (Entra ID, Okta) — разделы админки private instance. | [навигация https://buf.build/docs/bsr/remote-plugins/ , 2026-09-23]; [pricing: SSO и SCIM — Pro, 2026-09-23] |
| Админ private instance может отключать плагины («A disabled plugin is hidden ... can't be ... invoked as a remote plugin»). | [док Buf: https://buf.build/docs/bsr/admin/instance/plugin-management/ , 2026-09-23] |
| Webhooks — alpha, одно событие `WEBHOOK_EVENT_REPOSITORY_PUSH`, только private instance. | [док Buf: https://buf.build/docs/bsr/admin/instance/webhooks/ , 2026-09-23] |

## Прочее

| Факт | Источник |
|---|---|
| BSR MCP server на `https://buf.build/mcp`, отдаёт Registry API (modules, owners, commits, labels) как MCP-инструменты, включая запись; требует OAuth2 или токен. **То есть MCP — не наше отличие.** | [док Buf: https://buf.build/docs/bsr/apis/mcp/ , 2026-09-23] |
| Policies: hosted-политики и их проверка на push — «Available on Enterprise plans». | [док Buf: https://buf.build/docs/bsr/checks/policies/ , 2026-09-23] |
| Buf Studio — браузерный клиент для gRPC/Connect/gRPC-Web, «available to any BSR user». | [док Buf: https://buf.build/docs/bsr/studio/ , 2026-09-23] |
| Reflection API — отдаёт дескрипторы модуля для декодирования в рантайме. | [док Buf: https://buf.build/docs/bsr/reflection/ , 2026-09-23] |
| Лицензия `bufbuild/buf` — Apache-2.0. | [https://github.com/bufbuild/buf , 2026-09-23] |
| Серверная часть BSR не опубликована в открытом доступе [не подтверждено документом — вывод из того, что on-prem ставится по лицензии из приватного образа `us-docker.pkg.dev/buf-images-1`]. | [on-prem/installation, 2026-09-23] |
| Статус-страница: `status.buf.build` → `www.bufstatus.com`; компоненты «buf.build» и «Enterprise BSR»; история инцидентов не извлечена. | [https://www.bufstatus.com/ , 2026-09-23] |

## Changelog bufbuild/buf, 2025-09 … 2026-09

[https://github.com/bufbuild/buf/blob/main/CHANGELOG.md , 2026-09-23] — версии v1.57.1 (2025-09-16) … v1.73.0 (2026-09-11).
Изменения, относящиеся к remote plugins / BSR:
- v1.62.0: фикс multi-arch манифестов для `buf beta registry plugin push`.
- v1.65.0: команды `buf registry policy …`.
- v1.67.0: `buf generate` не перезаписывает неизменённые файлы; `buf beta registry plugin delete` спрашивает подтверждение.
- v1.68.0: LSP-ссылки на remote plugins в `buf.gen.yaml`.
- v1.69.0 / v1.70.0: LSP code lenses и автодополнение для `buf.gen.yaml`.
Депрекаций формата `remote:` за период не найдено. Про v1-формат `buf.gen.yaml` (`plugin:`/`remote:` с `/plugins/`)
ни одна прочитанная страница не говорит — [не подтверждено].
