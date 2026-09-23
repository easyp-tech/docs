> Автор: Claude Opus 5.5 (claude-opus-5-5), 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Вход для следующего промпта (easyp CLI)

Замечено по дороге, ничего из этого не правилось (границы задачи). Снимок `easyp/` — коммит `a1f6e44`,
последний тег `v0.17.0`.

## Remote-плагины в CLI-документации

1. **`remote: buf.build/...` в примерах easyp.yaml** — не работает с easyp: CLI говорит только на
   `easyp.generator.v1.GeneratorAPI` (`easyp/internal/adapters/plugin/remote.go`), спец-обработки `buf.build`
   нет. Места:
   - `cli/configuration.mdx:676-677`, `:895` (`buf.build/bufbuild/protovalidate-go:v0.4.0`)
   - `cli/generator/index.mdx:66,71`
   - `cli/generator/examples/go.mdx:74,77`
   - `cli/generator/examples/grpc-gateway.mdx:81-90`
   - `cli/generator/examples/validate.mdx:72-78`
   Заменить на `<your-service-host>/<group>/<name>:<version>` или на `name:`-плагины и сослаться на
   `/docs/api-service/client-usage`.
2. **`cli/configuration.mdx:692`** — описание `remote` без формата. Факты для описания (код `remote.go`):
   `[http://|https://]host[:port]/group/name[:version]`; без версии → `latest` (лексикографически на сервере!);
   TLS по умолчанию с системными корнями, plaintext для `http://` и хостов с `localhost`/`127.0.0.1`;
   дедлайн 30 s; нет токена, нет mTLS, нет своего CA; `opts` → `parameter`.
3. **`cli/generator/index.mdx:25-26`** — «Remote Generation: Generate code from remote Git repositories» —
   смешаны удалённые входы (git) и удалённое исполнение плагинов. Разделить.
4. **`introduction/what-is.mdx:55`** — «consistent, **isolated** execution» — плагины на сервисе не изолированы.
5. **`introduction/what-is.mdx:73-77`** — `remote: api.easyp.tech/protoc-gen-typescript:latest`: имя без
   группы невалидно для сервиса (`group/name`), хост `api.easyp.tech` не резолвится (`dig` → пусто).
6. **`introduction/quickstart.mdx:159`** — «WASM for blazing speed and remote/Docker executors»: Docker-исполнителя
   нет (исполнители: `command`, `remote`, встроенный WASM, локальный — `easyp/internal/core/generate.go:490-505`);
   тон маркетинговый.
7. **`guides/multi-target-generation.mdx:55,117`** и **`reference/easyp-gen-yaml.mdx:110`** —
   `remote: gen.easyp.tech/es`: хост не резолвится, имя без группы. «Cloud generation service endpoint» —
   публичного сервиса документация не описывает.

## Возможно несуществующая функциональность

8. **`easyp.gen.yaml`** — целая страница `reference/easyp-gen-yaml.mdx` и пример в `guides/buf-migration.mdx`
   (`backend/easyp.gen.yaml`, `version: v1`, `generate.modules`, `plugins[].version`). В коде CLI нет ни одного
   упоминания (`grep -rln 'easyp.gen' easyp --include=*.go` → пусто). Проверить и либо удалить, либо описать
   реальный формат `easyp.yaml`.
9. **`reference/easyp-gen-yaml.mdx:42`** — «`plugins[].remote`: gRPC **or HTTP**» — HTTP-транспорта нет.

## Битые ссылки (не про сервис)

10. `guides/breaking-checks-ci.mdx:134` (+ `.ru`) → `/docs/guides/adding-dependencies` (есть `adding-dependency`).
11. `guides/multi-target-generation.mdx:141` (+ `.ru`) → `/docs/guides/build-reproducibility` (есть `reproducibility`).
Найдено скриптом проверки ссылок (см. REPORT.md).

## `cli/package-manager/easyp-vs-buf.mdx`

12. Сравнение не датировано и без ссылок на Buf. Утверждения, которые сейчас расходятся с buf.build
    (2026-09-23):
    - «Private BSR Deployment: Significant infrastructure costs…» — Buf пишет, что on-prem «should be less than
      $1,000/month at list rates» и «typical deployment fits comfortably in 8 vCPUs and 32 GiB»
      (https://buf.build/docs/bsr/admin/on-prem/installation/). Стоимость лицензии не опубликована.
    - «Requires constant internet access OR expensive private BSR» — on-prem поддерживает air-gap
      (https://buf.build/docs/bsr/admin/on-prem/architecture/).
    - «BSR Hosted: Free tier available; Paid plans for private modules» — верно, но актуальные тарифы:
      Community free (1 приватный репо ≤100 типов), Teams $0.50/тип/мес, Pro $5/тип/мес (мин. $3000),
      Enterprise custom (https://buf.build/pricing).
    - Таблица «License: Apache 2.0 | Apache 2.0» (в `introduction/what-is.mdx:113`) — для CLI верно; сервис EasyP — Elastic-2.0.
    - Везде нужна строка «сведения о Buf актуальны на <дата>» и ссылки.
13. Сравнение генерации в этом документе (если есть) должно ссылаться на `/docs/api-service/vs-buf-bsr`, чтобы не дублировать.

## `guides/buf-migration.mdx`, `migration/buf-cli.mdx`

14. `guides/buf-migration.mdx` не упоминает remote plugins BSR → добавить ссылку на
    `/docs/api-service/migrating-from-bsr`.
15. `migration/buf-cli.mdx` — `grep -i 'remote|bsr|plugin'` пусто: миграция `buf.gen.yaml` с `remote:` не описана.

## Факты о CLI, полезные следующему агенту (проверены)

- `easyp` собирается из `easyp/` (`go build ./cmd/easyp`), `--cfg` указывает конфиг, по умолчанию `easyp.yaml`.
- `generate.inputs[].directory.path` — **относительно `root`** (с `path: proto, root: proto` CLI искал `proto/proto`).
  [стенд: `stat proto/proto: no such file or directory`]
- Remote-генерация против сервиса v1.0.2 работает (стенд, `protoc-gen-go v1.36.10`).
- Приоритет исполнителей: `command` > `remote` > builtin WASM (если нет в PATH) > локальный.

## ASCII-схемы вне api-service (добавлено 2026-09-23)

Сайт теперь рисует ```` ```mermaid ```` блоки (`components/mermaid.tsx`, `remarkMdxMermaid` в `source.config.ts`),
а дерево файлов — компонентом `<Files>/<Folder>/<File>` из fumadocs-ui. В разделе API Service ASCII-схемы
заменены. Остались псевдографикой (символы `┌─│▶`): `cli/configuration.mdx`, `cli/package-manager/index.mdx`,
`cli/package-manager/easyp-vs-buf.mdx`, `guides/organization-lint-style.mdx`, `guides/microservice-isolation.mdx`
(+ RU). Перевести на Mermaid / `<Files>`.
