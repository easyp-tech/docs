Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.

# Инвентаризация исходной документации

Снимок docs: <code>5fd544999f79a8306554ed4a1d4f1afd841bbd24</code>. Все 97 EN-страниц прочитаны целиком, включая страницы без упоминаний API Service. Номера строк ниже относятся к исходному снимку, а не к переписанным страницам. Проверка полноты: <code>scratch/docs-manifest.json</code> и пронумерованные пакеты <code>scratch/docs-reading/01.txt</code>–<code>11.txt</code>. [команда: Python rglob("*.mdx"), исключая *.ru.mdx, подсчёт и SHA-256 каждого файла]

Статус «не подтверждено» означает, что инвентаризация обнаружила упоминание, но не выдаёт его за проверенный факт. Развёрнутые выводы и доказательства находятся в service-facts.md, code-vs-docs-discrepancies.md и for-next-prompt-cli.md. Для обычных локальных plugin/lint/breaking примеров проверка реализации CLI отложена по границам задачи.

## content/docs/api-service/backup.mdx

Прочитано: 81 строк; SHA-256 <code>9dd2c091c194ad83974ee2aebf8455c8a9f82dba9bbc6e12c5625aff0f894d32</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 3 | description: "What a backup of the API Service has to contain, how long to keep it, and the order a restore has to happen in." | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 14 | \| **The <code>plugins</code> table** \| The registry itself: which plugin versions exist, their config, their command line, their recorded checksums. Nothing else holds this. \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 17 | \| **The object storage bucket** \| Plugin archives. The local cache is a cache — it is evicted — so the bucket is the only copy of the binaries. \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 18 | \| **<code>DB&#95;POSTGRES&#95;DSN</code>, <code>AUTH&#95;WRITE&#95;TOKENS</code>, S3 credentials** \| Secrets are not in the database and are usually not in the cluster backup either. \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 19 | \| **<code>LICENSE&#95;KEY</code> and <code>LICENSE&#95;PUBLIC&#95;KEYS</code>** \| Recoverable from the licence registry, but not by you at 3am. Without them the restored service runs in community mode: no audit, four workers, ten plugins. \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 23 | matters: a <code>plugins</code> row without its archive fails generation with | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 40 | An RPO of hours is fine for <code>plugins</code> — plugin registration is a deliberate, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 48 | service briefly able to serve plugins it has no rows for. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 66 | 4. **Expect the plugin cache to be empty.** It is a cache, and with | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 68 | request for each plugin re-downloads it. Watch | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 69 | <code>easyp&#95;plugin&#95;cache&#95;bytes</code> climb; nothing needs doing. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 74 | [Runbooks](/docs/api-service/runbooks). | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 80 | that <code>easyp&#95;business&#95;plugins&#95;total</code> matches what production reports and that the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/api-service/overview.mdx

Прочитано: 304 строк; SHA-256 <code>e7e0bc641928255925ad0058a652320bc7d8817d6b353506436bf0619069713d</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 2 | title: "API Service Overview" | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 5 | **A service that runs protobuf code-generation plugins so that developers and CI do not have to install them** | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 7 | The EasyP API Service accepts a <code>CodeGeneratorRequest</code> over gRPC, executes the named plugin as a child process on the server — bounded in time, concurrency and output size — and returns the <code>CodeGeneratorResponse</code>. One registry of plugin versions, built from reviewed Dockerfiles and verified by checksum, replaces one installation per developer machine. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 9 | ## Why EasyP API Service? | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 16 | - Developers use different plugin versions locally, causing build failures and inconsistent generated code | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 18 | - Manual coordination required to keep entire teams synchronized on plugin versions | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 21 | - DevOps teams spend significant time managing plugin installations across developer machines | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 22 | - Each new team member requires manual setup of correct plugin versions | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 23 | - Plugin updates require coordinating with every developer individually | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 24 | - No centralized control over which plugin versions are approved for use | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 27 | - Developers install plugins from various sources without security validation | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 28 | - No audit trail of which plugins were used for which builds | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 31 | ### The Solution: Centralized Plugin Execution | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 35 | \| **Version Control** \| A plugin version is registered once, on the server, and every client gets the same binary \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 36 | \| **Operations** \| Operators build, push and register plugins; developer machines are never touched \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 37 | \| **Provenance** \| Plugins are built from Dockerfiles in a public registry, stored as archives and sha256-verified before every execution \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 39 | \| **Developer Experience** \| No local plugin installation or maintenance required \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 51 | subgraph "EasyP API Service" | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 55 | PLUGIN[Plugin process<br/>stdin → stdout] | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 60 | DB[(PostgreSQL<br/>plugin registry, audit log)] | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 61 | S3[(Object storage<br/>plugin archives)] | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 62 | CACHE[Local cache<br/>unpacked plugins] | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 74 | CORE -->\|Resolve plugin\| DB | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 76 | POOL --> PLUGIN | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 77 | PLUGIN -.->\|miss: download, verify sha256, unpack\| S3 | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 79 | CACHE --> PLUGIN | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 83 | MCP -->\|plugins_list\| DB | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 89 | - **gRPC server** — the contract is <code>easyp.generator.v1.GeneratorAPI</code>: <code>GenerateCode</code>, <code>Plugins</code>, and the three mutating methods <code>CreatePlugin</code>, <code>UpdatePlugin</code>, <code>DeletePlugin</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 90 | - One <code>CodeGeneratorRequest</code> per plugin invocation | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 91 | - An interceptor chain in front of every call: TLS or mutual TLS, rate limit and concurrency cap per caller, write-token authentication, licence check | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 94 | - **Worker pool** — a bounded number of concurrent plugin processes; a request that finds no room is refused with <code>SERVER&#95;OVERLOADED</code> rather than queued indefinitely | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 95 | - **Plugin process** — a child process of the service, fed the request on stdin and read on stdout, with a clean environment, a timeout and an output-size limit | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 96 | - **Local cache** — plugin archives are downloaded on first use, sha256-verified against what the registry recorded, and unpacked; concurrent misses collapse into one download | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 99 | - **PostgreSQL** — the plugin registry (name, version, command, environment, tags) and, in Enterprise mode, the audit log in monthly partitions | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 100 | - **Object storage** — plugin archives, one <code>tar.gz</code> per plugin version, pushed by the operator's CLI and read by the service | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 103 | - **Prometheus** metrics for the worker pool, plugin durations, the cache, the licence and the audit pipeline, each with an alert rule in the Helm chart | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 110 | - **Installed plugins**: System-installed protoc plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 111 | - **WASM plugins**: Fast, lightweight WebAssembly plugins | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 113 | ### Remote Execution (API Service) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 114 | When using the API Service: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 115 | - **Remote plugins**: a <code>remote:</code> entry in <code>easyp.yaml</code> names the service and the plugin; the CLI sends the request there instead of executing anything | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 116 | - **Centralized control**: operators decide which plugins and versions exist | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 119 | ## Plugin Execution Flow | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 127 | participant Plugin as Plugin process | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 130 | CLI->>API: CodeGeneratorRequest (per plugin) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 133 | API->>DB: Resolve plugin (or "latest") | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 138 | S3-->>API: plugin.tgz | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 142 | API->>Plugin: Start; request on stdin | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 143 | Note over Plugin: bounded by timeout,<br/>output size, worker pool | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 144 | Plugin-->>API: CodeGeneratorResponse on stdout | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 153 | 2. **Request**: the CLI sends a <code>CodeGeneratorRequest</code> per plugin | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 155 | 4. **Resolution**: the service looks the plugin up in PostgreSQL; <code>latest</code> resolves to the newest registered version | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 156 | 5. **Fetch on miss**: if the plugin is not in the local cache, its archive is downloaded from object storage, sha256-verified and unpacked | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 157 | 6. **Execution**: the plugin runs as a child process under the worker pool's limits | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 164 | \| **📦 Versioned registry** \| Every plugin version is a reviewed Dockerfile, a checksummed archive and a database row \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 165 | \| **⚙️ Bounded execution** \| Timeout, output-size limit and a worker pool cap every plugin run \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 167 | \| **🔐 Authenticated writes** \| Mutating calls need a token; reads are anonymous by default and can be locked down \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 210 | ## Plugin Parameters Storage | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 212 | PostgreSQL holds one row per registered plugin version: its name, the command | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 217 | "command": ["plugins/protocolbuffers/go/v1.36.10/plugin"], | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 224 | <code>command</code> must point inside <code>registry.plugins&#95;dir</code>. <code>env</code> is the entire | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 225 | environment the plugin sees — nothing of the service's is inherited. <code>sha256</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 234 | \| **First call for a plugin version** \| seconds \| Downloading the archive from object storage, verifying it, unpacking \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 235 | \| **Subsequent calls** \| the plugin's own run time \| Executed from the local cache; the service adds milliseconds \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 237 | \| **Memory** \| the plugin's \| Not bounded by the service; see *Security* \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 241 | ### Plugin execution | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 243 | A plugin is a child process of the service — not a container. The service | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 246 | (<code>registry.max&#95;output&#95;size</code>), its **environment** (only what the plugin's own | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 248 | **where its executable may live** (inside <code>registry.plugins&#95;dir</code>). | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 251 | own, or network access: a plugin reaches whatever the pod reaches. Registering | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 252 | a plugin is therefore as privileged as running code on the host. Treat the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 253 | write token accordingly, and treat a shared registry as a set of people who all | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 262 | - The three mutating RPCs require a write token; the configuration holds only | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 264 | <code>auth.require&#95;authentication</code> makes them require a token too. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 265 | - Every request is validated before it reaches a plugin. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 272 | **One replica.** The plugin cache on disk is not safe to share between | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 285 | - **Prometheus metrics** for the worker pool, plugin durations, the cache, the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 294 | - Policy over which plugins and versions a deployment permits. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 304 | *Simplify your protobuf workflows with centralized plugin execution* | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |

## content/docs/api-service/runbooks.mdx

Прочитано: 356 строк; SHA-256 <code>1a8dbd0f107fa05c27292448553ed841008939304d57000480250bb88f391b9c</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 3 | description: "One procedure per alert the API Service ships: what the alert means, what is actually broken, and what to do about it." | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 30 | Nothing breaks at expiry — the token also carries a grace period — but at the end | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 31 | of that, the tier drops to community: audit stops, workers cap at 4, plugin | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 37 | 2. Check <code>easyp&#95;license&#95;expiry&#95;timestamp&#95;seconds</code> against <code>time()</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 38 | 3. Get a renewed token, put it in the secret as <code>LICENSE&#95;KEY</code> (on compose, in | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 43 | If the token is present but ignored, the usual cause is a missing or mismatched | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 44 | <code>LICENSE&#95;PUBLIC&#95;KEYS</code> entry: a token is only as good as the key it verifies against, and | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 45 | the key id in the token footer has to be one of the keys configured. See | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 46 | <code>config.license.publicKeys</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 50 | Expiry has passed and the service is running on the grace period the token | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 80 | ## EasypPluginCacheAtLimit | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 82 | Unpacked plugins on disk have reached <code>config.registry.cacheMaxBytes</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 85 | evict. Watch <code>easyp&#95;plugin&#95;cache&#95;evictions&#95;total</code>. Steady eviction with steady | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 88 | It matters when eviction churns — the same plugins evicted and re-downloaded | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 193 | 1. <code>easyp&#95;generation&#95;errors&#95;total</code> by <code>plugin</code> and <code>error&#95;type</code> — this is almost | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 194 | always one plugin, not a general fault. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 196 | what was recorded for that plugin version. Do not "fix" it by re-registering: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 198 | 3. Otherwise, run the plugin by hand with the same request. Plugin failures are | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 199 | reported faithfully, so the plugin's own stderr is in the logs. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 221 | CreatePlugin, UpdatePlugin, DeletePlugin. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 225 | 2. <code>AUTH&#95;WRITE&#95;TOKENS</code> maps <code>name=sha256</code>; the logs name the token that failed, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 227 | 3. If it is not a known caller, it is someone trying tokens against the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 228 | registry. The tokens are hashed and the rate limiter applies, but this is | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 293 | a plugin process, not whatever caused the pressure. &#96;dmesg -T \| grep -i | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 296 | <code>registry.cache&#95;max&#95;bytes</code> is not the place to look. It bounds unpacked plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/api-service/upgrading.mdx

Прочитано: 337 строк; SHA-256 <code>3c7c62bacd7e442261c73e028adf8da733ec76c0d389884b775b1df6162c2002</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 3 | description: "Release-by-release upgrade notes for the API Service: what breaks, what it looks like when it does, and what to change." | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 90 | does not answer the old method path. That includes <code>easyp</code> itself: <code>remote:</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 91 | plugins in <code>easyp.yaml</code> reach this service over gRPC, so an <code>easyp</code> older than | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 97 | Both carried an Apache-2.0 <code>LICENSE</code>, but Go tooling reads licences per module, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 111 | ### <code>PluginsResponse.total</code> is gone | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 113 | It held the number of plugins in *this page*, which <code>plugins.length</code> already | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 117 | ### <code>UpdatePlugin</code> takes a field mask | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 123 | was an empty one, so changing a tag meant resending the plugin's whole command | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 126 | ### A plugin's <code>command[0]</code> must be inside <code>plugins&#95;dir</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 129 | plugins directory, so <code>["/bin/sh", "-c", "…", "/plugins/x"]</code> passed on the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 133 | **A registration whose <code>command[0]</code> is a wrapper script outside <code>plugins&#95;dir</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 134 | now fails** with <code>INVALID&#95;ARGUMENT</code>. Re-register it with the plugin binary as | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 136 | inside the plugins directory. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 138 | ### Plugin archives may not contain symlinks pointing outside themselves | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 140 | An archive could ship its <code>plugin</code> entrypoint as a symlink to <code>/bin/sh</code>: the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 141 | link file landed inside <code>plugins&#95;dir</code>, so every containment check was satisfied. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 145 | ### <code>UpdatePlugin</code> recomputes the archive checksum | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 147 | Creating a plugin records the sha256 of its archive; updating one did not, and | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 150 | <code>UpdatePlugin</code> with a hand-written config permanently disabled verification of | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 151 | that plugin's binary** — silently. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 153 | Update now recomputes it, as Create does. **A plugin whose verification had been | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 156 | <code>plugin archive checksum mismatch</code> instead of running. That is the correct | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 157 | outcome, but it can surface as a plugin that "suddenly broke": re-push the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 168 | <code>NOT&#95;FOUND</code>, <code>INVALID&#95;PLUGIN&#95;NAME</code>, <code>INVALID&#95;CONFIG</code>, <code>GENERATION&#95;FAILED</code>, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 169 | <code>SERVER&#95;OVERLOADED</code>, <code>ALREADY&#95;EXISTS</code>, <code>MAX&#95;PLUGINS&#95;EXCEEDED</code>, <code>SHUTTING&#95;DOWN</code>, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 174 | Malformed plugin configurations also return <code>INVALID&#95;ARGUMENT</code> rather than | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 179 | - <code>ListPlugins(ctx, filter ...PluginFilter)</code> → <code>ListPlugins(ctx, ...ListOption)</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 180 | Pass a filter as <code>sdk.WithFilter(sdk.PluginFilter&#123;…&#125;)</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 187 | - <code>UpdatePlugin</code> and <code>DeletePlugin</code> exist. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 188 | - <code>WithRetryMaxDelay</code> and <code>WithCreatePluginTimeout</code> exist. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 194 | <code>plugins&#95;list</code> remains; the schema helpers are gone. They came from | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 223 | [Listing plugins](#listing-plugins-returns-100-rows-now) even if you change | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 252 | ### <code>license.public&#95;key</code> removed | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 254 | One setting, not two. Move the key into <code>license.public&#95;keys</code> under its key id, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 255 | or under <code>"&#42;"</code> to verify a token whose key id matches nothing else: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 258 | license: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 263 | The environment spelling is <code>LICENSE&#95;PUBLIC&#95;KEYS="&lt;kid&gt;:&lt;hex&gt;,&lt;kid&gt;:&lt;hex&gt;"</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 264 | <code>LICENSE&#95;PUBLIC&#95;KEY</code> (singular) is gone and is no longer passed through by | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 266 | community** — no audit, four workers, ten plugins — without an error, because | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 291 | ### Listing plugins returns 100 rows now | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 293 | <code>Plugins</code> is paginated. **A client that sends no <code>page&#95;size</code> gets the first 100 | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 294 | plugins instead of all of them** — the call still succeeds, so a registry with | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 300 | - <code>next&#95;page&#95;token</code> is empty on the last page; pass it back as <code>page&#95;token</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 302 | - <code>total</code> is the number of plugins in *this* response, as it always was. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 303 | - The Go SDK's <code>ListPlugins</code> walks every page itself, so SDK callers see the | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 313 | write token or the DSN actually restarts the service. Previously it did not, | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 314 | and the new token was rejected until someone restarted by hand. The value | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 335 | and are now published at [Runbooks](/docs/api-service/runbooks), which is where | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/architecture/mvs-dependency-resolution.mdx

Прочитано: 175 строк; SHA-256 <code>37c791abf067eda71fcf63a8cd0eda10a317e120e79e7c9a8986248496308301</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/blog/finally-give-up-gin-echo.mdx

Прочитано: 281 строк; SHA-256 <code>279ee12480f4ee5a05b969fd421abae7db66079a6950bc303b81ab115e25a675</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/blog/working-with-proto-errors-correctly.mdx

Прочитано: 225 строк; SHA-256 <code>0c28505c4f37fe2b5d5af3a8c612cfbba34ab9242ed6da61f14e0ff05c7e32c7</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/ci-cd/github-actions.mdx

Прочитано: 5 строк; SHA-256 <code>49414ee67e325d370ead4f2ba64328ece7f6425ac9271761eedea4a1fbe61b57</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/ci-cd/gitlab.mdx

Прочитано: 5 строк; SHA-256 <code>326f2a1b212d49461de9f491d99c7bc5977ea42f5a587a00cbb24f52e18d220a</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/auto-completion.mdx

Прочитано: 32 строк; SHA-256 <code>17db7c2d897b9b03356de1632764a854533dfd17cb8929ff292cbff38790277e</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/index.mdx

Прочитано: 453 строк; SHA-256 <code>8d50209bb70f3dc36bb9fec9b516d168c6657ffaec22a83d225320dac599374b</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/enum-no-delete.mdx

Прочитано: 340 строк; SHA-256 <code>31ad9064b365164c4ee2b6f3d548bffaa1f93f4d746007da2eedc4020de80358</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/enum-value-no-delete.mdx

Прочитано: 334 строк; SHA-256 <code>7e8656cdd3fc76f856c5a7afda58cfc98862a7a66795b817ee8ad807cfb2aec4</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/enum-value-same-name.mdx

Прочитано: 175 строк; SHA-256 <code>3e4f2c796881d7d4bc1a7a851f9f6474de0bf823dfc308f382a6f5a1ba876250</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/field-no-delete.mdx

Прочитано: 102 строк; SHA-256 <code>78bd1ae87832dfeea904bf316b6f045fa95f932d1fb96f09b8ddfba845ea271f</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/field-same-cardinality.mdx

Прочитано: 292 строк; SHA-256 <code>4f9eda96120a9041cd3b434749b2fd67eb62bdb4562e30b9feedb6b1af9069b3</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/field-same-type.mdx

Прочитано: 154 строк; SHA-256 <code>efbda66df9bfa085ad1415f4ceca0140bfb125ee035fef4942120c045545abb0</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/import-no-delete.mdx

Прочитано: 413 строк; SHA-256 <code>4739ba490548ac6c4fc647e4da98f4cec986e65c176499330b430677a2e25d51</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/message-no-delete.mdx

Прочитано: 252 строк; SHA-256 <code>d591d758acc6625dcd983ed5e3c08014c916feec3b5121f6166d7bd86693df57</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/oneof-field-no-delete.mdx

Прочитано: 415 строк; SHA-256 <code>5da87dac8f12193ec2635aaedba89df6033491b5eea7266d3ee9494c67a318f7</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 27 | string oauth_token = 4; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 54 | // string oauth_token = 4; // Deleted oneOf field - BREAKING! | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 71 | login.proto:7:5: Previously present field "4" with name "oauth_token" on OneOf "credentials" was deleted. (BREAKING_CHECK) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 121 | string oauth_token = 4 [deprecated = true]; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 148 | string oauth_token = 4 [deprecated = true]; // Keep old field | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 173 | // Set OAuth token (oneOf field) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 174 | loginReq.Credentials = &myapi.LoginRequest_OauthToken{ | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 175 | OauthToken: "token123",  // ERROR after field deletion | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 182 | case *myapi.LoginRequest_OauthToken:  // ERROR: undefined type after deletion | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 183 | return authenticateOAuth(cred.OauthToken) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 191 | // undefined: myapi.LoginRequest_OauthToken | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 204 | case *LoginRequest_OauthToken:    // ERROR after deletion | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 205 | return validateOAuth(cred.OauthToken) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 219 | "oauth_token": "abc123xyz" | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 223 | // Data deserializes but oauth_token is lost or causes parsing errors | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 233 | string oauth_token = 4 [deprecated = true]; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 241 | string oauth_token = 4 [deprecated = true]; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 253 | case *LoginRequest_OauthToken: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 255 | log.Warn("Using deprecated oauth_token field") | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 256 | return validateOAuthLegacy(cred.OauthToken) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 267 | Token:        "token123", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 268 | RefreshToken: "refresh456", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 278 | reserved "oauth_token", "certificate"; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 360 | // *LoginRequest_OauthToken  // Entire type removed | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/breaking-changes/rules/oneof-field-same-type.mdx

Прочитано: 417 строк; SHA-256 <code>05ce4bad029923388a4c1fada3b0a7e9803e801ab9b9966c6a5b484e8245bfa1</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/oneof-no-delete.mdx

Прочитано: 416 строк; SHA-256 <code>94570b8bc431ac05ee605124dde667d97f7e157974ad7e98def93851cecd6ba4</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 27 | string oauth_token = 4; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 57 | string oauth_token = 4; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 129 | string oauth_token = 4 [deprecated = true]; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 156 | string oauth_token = 4 [deprecated = true]; | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 217 | case *LoginRequest_OauthToken: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 218 | return validateOAuthToken(req.GetOauthToken()) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 230 | if req.OauthToken != "" { credCount++ } | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 414 | OauthToken  string | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/breaking-changes/rules/rpc-no-delete.mdx

Прочитано: 80 строк; SHA-256 <code>67b5ffa0a837e0b477a0acbd1af89123ef9cb6fd9aa9c14730ccb12c028f2e0b</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/rpc-same-request-type.mdx

Прочитано: 258 строк; SHA-256 <code>100570e087440554f92166f200ae8ef8a9b63c4ac23b3e999545bb6b14a36cc4</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/rpc-same-response-type.mdx

Прочитано: 323 строк; SHA-256 <code>5ead525b3ca6073be8f57afd31f34a92e7f7c0eb3f07c4019889b9975d3bbaa6</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/breaking-changes/rules/service-no-delete.mdx

Прочитано: 89 строк; SHA-256 <code>7c44c87a4fb7f4c4fc38288e6cbbe283bccf4e269199ebb4f6145548800638f0</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/configuration.mdx

Прочитано: 932 строк; SHA-256 <code>addd17373812f0458d01177d4667e2cd58b975aebc755e3d292222d6cf0a9ddd</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 242 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 266 | "plugins": [ | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 300 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 613 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 643 | # Remote git repository | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 660 | #### <code>generate.plugins</code> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 662 | **Required when <code>generate</code> is set.** Configures protoc plugins for code generation. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 669 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 670 | # Local plugin | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 676 | # Remote plugin | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 677 | - remote: "buf.build/bufbuild/protovalidate-go:v0.4.0" | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 682 | # Plugin with import dependencies | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 690 | **Plugin fields:** | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 691 | - <code>name</code> (string, optional) - Plugin name (omit <code>protoc-gen-</code> prefix) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 692 | - <code>remote</code> (string, optional) - Remote plugin URL for execution | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 693 | - <code>path</code> (string, optional) - Path to plugin executable file | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 694 | - <code>command</code> ([]string, optional) - Command to execute plugin | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 696 | - <code>opts</code> (map[string](string \| number \| boolean \| array&lt;string \| number \| boolean&gt;), optional) - Plugin-specific options; each key can be a single scalar value or an array of scalar values | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 699 | Plugin source is <code>one-of</code>: exactly one of <code>name</code>, <code>remote</code>, <code>path</code>, or <code>command</code> must be set. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 701 | **Common plugin options:** | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 703 | # Go plugin options | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 726 | When an <code>opts</code> value is a list, EasyP serializes it as repeated plugin params, e.g. <code>outputServices=grpc-js,outputServices=generic-definitions</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 801 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 833 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 882 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 895 | - remote: "buf.build/bufbuild/protovalidate-go:v0.4.0" | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 915 | Error: required field "plugins" is missing (path: generate.plugins) | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 929 | 3. Update <code>deps</code> format if using BSR modules | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |

## content/docs/cli/generator/examples/go.mdx

Прочитано: 147 строк; SHA-256 <code>d439b1f0ef3691861063887850a15ca6f71c177d98ba83e06ec83ec8c8a14d7f</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 5 | ## Installing Plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 7 | First, install the necessary plugins for working with gRPC: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 14 | These commands will install the <code>protoc-gen-go</code> and <code>protoc-gen-go-grpc</code> plugins for use with EasyP. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 58 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 73 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 74 | - remote: buf.build/protocolbuffers/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 77 | - remote: buf.build/grpc/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 92 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 106 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 121 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/generator/examples/grpc-gateway.mdx

Прочитано: 148 строк; SHA-256 <code>18fe04bb1723dc157d495d68774fdb707423ec436c3ff62208423520f7c936e9</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 5 | ## Installing Plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 7 | In addition to the plugins for working with gRPC, install the following plugins for gRPC-Gateway: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 57 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 80 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 81 | - remote: buf.build/protocolbuffers/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 84 | - remote: buf.build/grpc/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 87 | - remote: buf.build/grpc-ecosystem/gateway | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 90 | - remote: buf.build/grpc-ecosystem/openapiv2 | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 100 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 112 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 126 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/generator/examples/validate.mdx

Прочитано: 132 строк; SHA-256 <code>5cc152fc87e53649a1300c7bef3a1b62bbb6a6e262bde76d65d5195675736201</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 5 | ## Installing Plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 7 | First, install the necessary plugins for working with gRPC and validation: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 52 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 71 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 72 | - remote: buf.build/protocolbuffers/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 75 | - remote: buf.build/grpc/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 78 | - remote: buf.build/bufbuild/validate-go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 89 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 100 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 110 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/generator/index.mdx

Прочитано: 136 строк; SHA-256 <code>30ac187a268fc1e6418a5385393dfe188661b9a552862a0ced7003b52d0098e7</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 15 | - Supports all options and plugins available in protoc. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 18 | - Use the same parameters as protoc plugins, directly in the configuration file. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 19 | - Support for multiple plugins and their parameters in a single configuration. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 22 | - Generate code from local directories or remote repositories. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 25 | 5. **Remote Generation**: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 26 | - Generate code from remote Git repositories without local checkout. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 47 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 65 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 66 | - remote: buf.build/protocolbuffers/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 71 | - remote: buf.build/grpc/go | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 80 | ### Multi-Language Plugin Examples | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 85 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 99 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 114 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/index.mdx

Прочитано: 23 строк; SHA-256 <code>598c70268a15e936fb9ea0b158ca063971121a56e320fde99cf90bcd23c50367</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 12 | \| <code>easyp generate</code> \| Run local/remote plugins \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/cli/linter/index.mdx

Прочитано: 420 строк; SHA-256 <code>f8c8caf4b36f1c06e1a5898806dc8777551872bb8c5d03948690e63406475889</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-enum-value.mdx

Прочитано: 36 строк; SHA-256 <code>4c88bcd9011ce01af1bce0a80138dbbe6fbeca11fd3016f4a15f3648e82f0b5b</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-enum.mdx

Прочитано: 34 строк; SHA-256 <code>ce31aaf757fd342db99546dff58a1784993f76d6b17faa398da94462668a2de3</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-field.mdx

Прочитано: 35 строк; SHA-256 <code>13cd5580f065643341ae661b693b3942ff67753e457b56ed5ed79b61b2c63bc3</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-message.mdx

Прочитано: 38 строк; SHA-256 <code>8296aeb4fda6fb3e7208dc3ddeecb894c14438a6c379dce3944b3e3d48dc3b6c</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-oneof.mdx

Прочитано: 38 строк; SHA-256 <code>38a859755f4d2c054cdd59fa490bf6a00bf97499f8433c4c7a1b0785eff7a063</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-rpc.mdx

Прочитано: 35 строк; SHA-256 <code>866af2acf34182bc944a4d4adf4d01108e16f809dcdea38c8eb3fa27b79ecd63</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/comment-service.mdx

Прочитано: 33 строк; SHA-256 <code>665a4a576cc263c5bd2b203860e8fb926d1ec441f15ccd1ac2b02db9bccd485d</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/directory-same-package.mdx

Прочитано: 40 строк; SHA-256 <code>3f8e51fd5e7c255ce14bde917b76239ec5285ca8a941fc6fcab1e3d77cd6673f</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/enum-first-value-zero.mdx

Прочитано: 40 строк; SHA-256 <code>0cf029e1501736990c582b89dad7e7239acd02bc3404cde036784ff6b3587ae1</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/enum-no-allow-alias.mdx

Прочитано: 40 строк; SHA-256 <code>c95b2a4bf337d5262f6ea06992e4e60848bce9e761c86499e0e8751d9efdc631</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/enum-pascal-case.mdx

Прочитано: 38 строк; SHA-256 <code>7f1e42d047f19234ca2cc3e872bbb2e3f9d097b6a73761b319825aca667138af</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/enum-value-prefix.mdx

Прочитано: 33 строк; SHA-256 <code>63e166fd1d81f9d06dca292803e1e11de797b14a29ef849690ba4190d70b0ada</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/enum-value-upper-snake-case.mdx

Прочитано: 38 строк; SHA-256 <code>a849af297b3263e593cb755be86e4a9c9cd8f8152f83ce472e2676d2bcc169af</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/enum-zero-value-suffix.mdx

Прочитано: 33 строк; SHA-256 <code>e9287cd0fce69c5173816c98bbbe5e1742891fadc5b64e03cdc07ffbec580d9d</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/field-lower-snake-case.mdx

Прочитано: 36 строк; SHA-256 <code>9ad4377aa970872e75ae93fa16fb8062aee7d35aff70a2e228277b5e69101ee5</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/file-lower-snake-case.mdx

Прочитано: 29 строк; SHA-256 <code>d2d863155fd5b654be4599357d90dcc26cbd0d50146a9b89d1104bd88e072a67</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/import-no-public.mdx

Прочитано: 33 строк; SHA-256 <code>24600d6beda64ab00aa56d74e34bce636445729998abfb1f30d0ae839e70a985</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/import-no-weak.mdx

Прочитано: 33 строк; SHA-256 <code>0046da3e323ddcefe6361d51fe192b0edec95b9ff4c9cdb244e8cedee4d5be42</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/import-used.mdx

Прочитано: 36 строк; SHA-256 <code>20658388a2d8b200131db89fae3d6948531bb0f71ed1e6ef1e442c8d808d956d</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/message-pascal-case.mdx

Прочитано: 36 строк; SHA-256 <code>cb7ca20a59d796bdd373c17949a51d5a7f5b82653b080e9324649ee7b8eb2c9d</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/oneof-lower-snake-case.mdx

Прочитано: 40 строк; SHA-256 <code>76bcf393b0ce04be2a6c6736135e084cf6b94ad30019cb5a0ef3eef8c22130aa</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-defined.mdx

Прочитано: 35 строк; SHA-256 <code>52d2684fd18be32896d4d5eb9e5d1546240a828d07905d1830ce25bc640a5fc7</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-directory-match.mdx

Прочитано: 41 строк; SHA-256 <code>4fd15394d138317e8551c2fe6337595ec6ed1e03d11ca058a24afc808a538b08</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-lower-snake-case.mdx

Прочитано: 31 строк; SHA-256 <code>d411744a3d853f58c2f203e9721891ff37c465bd4b832fd28c3896eba0085169</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-csharp-namespace.mdx

Прочитано: 57 строк; SHA-256 <code>959d6aa4ce915d9f848e9ae2f3fef951a21a159740c96ebcf81a8342b00d2f68</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-directory.mdx

Прочитано: 42 строк; SHA-256 <code>951e8d79df18e01f33a3b6ac0d920b7f509bb9486c4448f9c3586e94d3b3317e</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-go-package.mdx

Прочитано: 58 строк; SHA-256 <code>12f21608fa8d2f3c8d4acf620b53335eeae82cdca565301f76a5bfee2d1d4f46</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-java-multiple-files.mdx

Прочитано: 57 строк; SHA-256 <code>477edc5f18a94892d758fa06de9bf138135ff790e173887f24a5760bf7627b66</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-java-package.mdx

Прочитано: 57 строк; SHA-256 <code>27adc2bfc46f7d52f41427ae2be28e794faa67fa8324638688e410dfb3aefdc0</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-php-namespace.mdx

Прочитано: 58 строк; SHA-256 <code>4cac4ed0f4241d186448c07c3531670deed162b14460e99aea869d8e4d3513ae</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-ruby-package.mdx

Прочитано: 57 строк; SHA-256 <code>beec169b4c77114b6444245bae83eaefae375066511928177c8c5ad33636572f</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-same-swift-prefix.mdx

Прочитано: 57 строк; SHA-256 <code>840dd13b19641e7e03ea5ab476c765275725f34f62b581f33bb866ce6c874646</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/package-version-suffix.mdx

Прочитано: 29 строк; SHA-256 <code>84e51f31a47e35818ea61a7628de0df94ac6de9ed6e897d163bae113191a811c</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/rpc-no-client-streaming.mdx

Прочитано: 31 строк; SHA-256 <code>83bd9c61eca2f3479385e6222ce0a95f332318f2300afb0fcdd1ec262f15a4e6</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/rpc-no-server-streaming.mdx

Прочитано: 31 строк; SHA-256 <code>d026016291ab71434336492cbcd14843668fa3e20615869d2f9500ced63a9aec</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/rpc-pascal-case.mdx

Прочитано: 33 строк; SHA-256 <code>23e0ebda2f29cc8f98482df5b245cec173a7d0a33db1bb3535e80f145cb9bee7</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/rpc-request-response-unique.mdx

Прочитано: 35 строк; SHA-256 <code>9cf886cecb042911e869c25f9e776950b67cf3d7f209c1c48f2bcdd53f0298bb</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/rpc-request-standard-name.mdx

Прочитано: 32 строк; SHA-256 <code>2e2e12ea7a0cf5339f54191199d75adf71e1dbc151da31ec93be62e57e51b66c</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/rpc-response-standard-name.mdx

Прочитано: 33 строк; SHA-256 <code>b7243f27899aa9385ecb1f61ed900d09538b909736a6092739263e1769c26c55</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/service-pascal-case.mdx

Прочитано: 32 строк; SHA-256 <code>fda6795ab78cda7a4f8ce983fd966f06c4aa40fe7f453b4110756b46d287717b</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/linter/rules/service-suffix.mdx

Прочитано: 33 строк; SHA-256 <code>98fb3d9f915497ff79308b5e3bb81ad0fb4d8749297e7f8665859c734dc082f7</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/cli/package-manager/easyp-vs-buf.mdx

Прочитано: 455 строк; SHA-256 <code>cd912e3a3f473ed07743c08754bc8f2b9beb17e15c10febcf7fc886fe02d339d</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 7 | This document provides a comprehensive comparison between EasyP's decentralized package management approach and Buf's centralized Buf Schema Registry (BSR) model, helping you understand the key differences and choose the right solution for your needs. | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 48 | │  Developer Machine               Buf Schema Registry (BSR)     │ | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 51 | │  │ ~/.cache/    │◄────────────►│  buf.build                  │ │ | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 66 | │  ⚠️  Requires buf.build access                                 │ | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 67 | │  ⚠️  Limited to BSR ecosystem                                  │ | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 76 | \| **Architecture** \| Decentralized (Git-based) \| Centralized (BSR registry) \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 78 | \| **Single Point of Failure** \| No \| Yes (buf.build) \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 79 | \| **Enterprise Deployment** \| Fully air-gapped support \| Requires BSR access or private BSR \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 80 | \| **Authentication** \| Git credentials (SSH/HTTPS) \| Buf tokens + Git credentials \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 82 | \| **Private Repositories** \| Native Git support \| Must publish to BSR first \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 85 | \| **Setup Complexity** \| Minimal \| Moderate (BSR setup) \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 108 | # buf.yaml - Must reference BSR modules | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 111 | - buf.build/googleapis/googleapis | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 112 | - buf.build/grpc/grpc | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 113 | - buf.build/envoyproxy/protoc-gen-validate | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 123 | - ❌ Must publish to BSR before use | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 124 | - ❌ Requires BSR account and authentication | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 154 | #### Buf: Requires BSR Infrastructure | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 159 | # Option 1: Use buf.build (requires internet) | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 160 | buf mod download           # Must reach buf.build | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 162 | # Option 2: Set up private BSR (complex) | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 163 | # - Deploy BSR server infrastructure | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 164 | # - Migrate all modules to private BSR | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 170 | - ❌ Requires constant internet access OR expensive private BSR | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 201 | # Dependencies controlled by BSR | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 203 | - buf.build/googleapis/googleapis  # Controlled by Buf | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 204 | - buf.build/grpc/grpc             # Could be removed/updated | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 208 | - ⚠️ **Intermediary risk** - BSR controls what's available | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 211 | - ⚠️ **Update policies** - BSR may force updates or deprecations | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 228 | # Requires understanding BSR module names | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 230 | - buf.build/googleapis/googleapis | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 231 | - buf.build/grpcecosystem/grpc-gateway | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 251 | # All must be published to BSR first | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 253 | - buf.build/googleapis/googleapis | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 254 | - buf.build/mycompany/auth-protos      # Requires BSR publication | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 255 | - buf.build/mycompany/shared-types     # Requires BSR publication | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 273 | # Must deploy and maintain private BSR infrastructure | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 289 | - ⚠️ **Registry dependency**: Must audit BSR's security practices | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 290 | - ⚠️ **Third-party risk**: BSR is part of your compliance scope | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 303 | - ✅ **No licensing fees** for registry software | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 313 | **BSR Hosted (buf.build):** | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 319 | **Private BSR Deployment:** | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 322 | - ❌ Licensing costs for enterprise features | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 346 | - ❌ Must identify original Git repositories for each BSR module | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 347 | - ❌ BSR-specific module names don't translate directly | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 349 | - ❌ Complex if heavily integrated with BSR ecosystem | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 352 | - ❌ Must publish all dependencies to BSR first | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 354 | - ❌ Must adopt BSR workflow and tooling | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 376 | - Want to avoid additional licensing costs | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 387 | ✅ **Heavy BSR ecosystem usage** | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 390 | - Benefit from BSR's rich metadata and docs | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 395 | - Benefit from BSR's collaboration features | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 399 | - Don't mind BSR dependency | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 403 | - Benefit from BSR's documentation and examples | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 411 | 1. **Identify source repositories** for each BSR module | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 412 | 2. **Map BSR modules** to Git repository references | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 420 | - buf.build/googleapis/googleapis | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 421 | - buf.build/grpc/grpc | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 431 | 1. **Publish modules** to BSR (if not already available) | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 432 | 2. **Create BSR account** and configure authentication | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 433 | 3. **Update configuration** to reference BSR modules | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 434 | 4. **Adopt BSR workflow** (push, pull, etc.) | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 451 | - Projects heavily using BSR features | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |

## content/docs/cli/package-manager/index.mdx

Прочитано: 554 строк; SHA-256 <code>92b68d6bc2e18db8395fe95146f639853645c01843e8cc20c6da87eb78a0e4b3</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 307 | #### Personal Access Tokens | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 314 | echo "https://username:token@github.com" >> ~/.git-credentials | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 317 | git config --global url."https://username:token@github.com/mycompany".insteadOf "https://github.com/mycompany" | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 403 | git ls-remote https://github.com/mycompany/private-repo | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 416 | git ls-remote --tags https://github.com/googleapis/googleapis | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/guides/adding-dependency.mdx

Прочитано: 78 строк; SHA-256 <code>4258b8ad4087c553b8d31cbe960f6fb6b09a7a877d2d063fcaf4cf02993362ec</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/guides/breaking-checks-ci.mdx

Прочитано: 134 строк; SHA-256 <code>cc63a0ad1880513453960bb183855350258ed40c59f329b0d649b4e8b9d1bef8</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/guides/buf-migration.mdx

Прочитано: 95 строк; SHA-256 <code>553a01c9bf87df56b7b650b38d5b546e2123303474a55d0edfe7bf60384c8671</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 14 | \| <code>buf.yaml</code> (deps section) \| <code>protobuf.mod</code> \| Tool-neutral dependency DSL; uses Git URLs instead of proprietary BSR names. \| | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 79 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/guides/debugging-replace.mdx

Прочитано: 55 строк; SHA-256 <code>4622c61afd745d516370a39e56a43587096004202a96abaf09741affa5e529a4</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 26 | // Overrides remote dependency with local disk path | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 37 | - No remote Git tags or network downloads are required. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/guides/microservice-isolation.mdx

Прочитано: 57 строк; SHA-256 <code>ebde92747aba93829099a54413c0ec9f938d911329debb60b04af30923d44276</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/guides/multi-target-generation.mdx

Прочитано: 141 строк; SHA-256 <code>1841a8d2cbf1efb23af90a2796a718b44f48ccfbf6ca666052d21c103bbc3423</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 27 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 54 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 55 | - remote: gen.easyp.tech/es | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 79 | - **<code>plugins</code>**: Array of code generator plugins to execute: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 81 | - <code>remote</code>: Cloud generation service endpoint. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 82 | - <code>version</code>: Exact pinned plugin version. <code>:latest</code> tags are prohibited to ensure build reproducibility. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 84 | - <code>opts</code>: Key-value map or list of plugin-specific option flags. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 85 | - **<code>options</code>**: Language-scoped managed options (e.g. <code>options.go.package&#95;prefix</code>). Managed options apply consistently across all plugins for a given language to prevent import path mismatches. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 87 | ## Plugin Execution Sources | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 89 | EasyP supports three execution mechanisms for code generator plugins, allowing teams to balance local performance with build hermeticity: | При отнесении к API Service нужна оговорка: отдельной песочницы нет. [код: service/internal/adapters/registry/registry.go:472] |
| 91 | <Tabs items={["Local Binary (name)", "WASM Sandbox (name)", "Remote Service (remote)"]}> | При отнесении к API Service нужна оговорка: отдельной песочницы нет. [код: service/internal/adapters/registry/registry.go:472] |
| 94 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 105 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 112 | When configured for WASM execution, EasyP executes the plugin inside an embedded WebAssembly runtime, providing complete OS and toolchain independence. | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 114 | <Tab value="Remote Service (remote)"> | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 116 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 117 | - remote: gen.easyp.tech/es | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 123 | EasyP streams protocol descriptors to a remote generation service, receiving pre-compiled source files. Zero local toolchain installation is required. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/guides/organization-lint-style.mdx

Прочитано: 79 строк; SHA-256 <code>1b9ac182b9a82a30861e64da78b80b30dc209bfabf0517f1dfbb84c2060fb665</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/guides/reproducibility.mdx

Прочитано: 38 строк; SHA-256 <code>2799d07363a5777fe4cad196746f5e136e5a793df39001c8cacecaf304a7388b</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 3 | description: "Achieving 100% bit-for-bit reproducible Protobuf builds with lockfiles, pinned plugin versions, and prohibition of floating latest tags." | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 13 | 2. **Pinned Plugin Versions**: Generator plugins in <code>easyp.gen.yaml</code> require explicit semantic version tags. Floating <code>:latest</code> tags are prohibited. | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 14 | 3. **WASM / Remote Executors**: Eliminates system environment dependencies (such as locally installed <code>protoc</code> or plugin binaries) by running plugins inside deterministic WASM sandboxes or remote generation environments. | При отнесении к API Service нужна оговорка: отдельной песочницы нет. [код: service/internal/adapters/registry/registry.go:472] |
| 26 | # 2. Execute code generation using pinned plugin versions | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 30 | Because <code>easyp mod download</code> reads strictly from <code>protobuf.lock</code>, remote registry updates or force-pushed Git tags cannot alter your build output. | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 37 | - ❌ Using floating plugin tags like <code>version: latest</code>. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/guides/version-diamond.mdx

Прочитано: 58 строк; SHA-256 <code>1c581fdb9222b28ae2348a7ab05e2a04e33ff2ea08f66db0c347d765f0020ce9</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/index.mdx

Прочитано: 24 строк; SHA-256 <code>499fa02c7a3dc4dc2e0d26630a4fa4f7e535f116dffd935f70a80dd391b6f960</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 21 | - [API Service](/docs/api-service/overview) — remote plugin execution | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/introduction/install.mdx

Прочитано: 53 строк; SHA-256 <code>b69538f8754eae10ec1a4397cccc373af48b8d94135cf21ceb1f0abc518be1ea</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/introduction/quickstart.mdx

Прочитано: 174 строк; SHA-256 <code>937929981627cb8b5b115b4bc6899b4ec358a891b39d50b66f5d733df32042af</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 129 | Now let's configure code generation. EasyP supports all standard Protobuf plugins. | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 140 | Add plugin configuration to <code>easyp.yaml</code> (or <code>easyp.gen.yaml</code>): | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 144 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 159 | EasyP uses a hybrid execution model with WASM for blazing speed and remote/Docker executors for heavy plugins. | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 174 | - **[API Service](/docs/api-service/overview)** - Set up remote code generation | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/introduction/what-is.mdx

Прочитано: 159 строк; SHA-256 <code>3d74e7807598af656112cbf9462e43d96b6a2d43ed351b55a89892936488f609</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 38 | - **Code generation** with local and remote plugin support | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 53 | \| ⚡ **Code Generation** \| Multi-language code generation with support for both local protoc plugins and remote plugin execution. \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 55 | \| 🌐 **Remote Plugin Support** \| Execute plugins via centralized EasyP API service for consistent, isolated execution without local dependencies. \| | При отнесении к API Service нужна оговорка: отдельной песочницы нет. [код: service/internal/adapters/registry/registry.go:472] |
| 58 | ## Supported Plugin Types | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 60 | EasyP provides flexibility in how you execute code generation plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 62 | ### Local Plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 63 | Standard protoc plugins installed on your system: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 65 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 72 | ### Remote Plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 73 | Plugins executed via EasyP API service for consistent results: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 75 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 76 | - remote: api.easyp.tech/protoc-gen-typescript:latest | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 80 | ### Custom Plugins | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 81 | Support for custom plugin development and distribution through the ecosystem. | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 101 | ### EasyP vs buf.build Comparison | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 103 | \| Feature \| EasyP \| buf.build \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 105 | \| **Dependency Management** \| Git-based repositories \| Buf Schema Registry (BSR) \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 106 | \| **Vendor Lock-in** \| None - works with any Git hosting \| Tied to BSR for full features \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 107 | \| **Plugin Execution** \| Local + Remote plugins \| Local + BSR plugins \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 108 | \| **Private Dependencies** \| Any Git provider (GitHub, GitLab, etc.) \| BSR or manual management \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 109 | \| **Offline Development** \| Full support with <code>mod vendor</code> \| Limited without BSR access \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 110 | \| **Enterprise Integration** \| Works with existing Git infrastructure \| Requires BSR setup \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 112 | \| **Package Distribution** \| Any Git repository \| BSR required for publishing \| | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |
| 113 | \| **License** \| Apache 2.0 \| Apache 2.0 \| | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 119 | - **Enhanced flexibility**: Access to both local and remote plugin execution | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/migration/buf-cli.mdx

Прочитано: 5 строк; SHA-256 <code>0ac97c9441ec36ad7f3f79636f86d96620bf92238cc4e60ebb023d6e0f646e7a</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/migration/protoc.mdx

Прочитано: 5 строк; SHA-256 <code>cd7baebed6e4ca5381d5bf6d256ce4e4b3ebf459e5522149b419141b1d708573</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/migration/protolock.mdx

Прочитано: 5 строк; SHA-256 <code>1cdf9b040ee96560268ff71fe1e44bf4725e1a4414d30d888d0cd9fc2cf452b1</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/migration/prototool.mdx

Прочитано: 5 строк; SHA-256 <code>e1341825b9fc80f73dd31192504e8f6247cf13b85e4f952c420628d81502b314</code>.

Релевантных упоминаний по поисковому набору не найдено. [команда: поиск BSR, buf.build, remote, api-service, license, token, plugin]

## content/docs/reference/easyp-gen-yaml.mdx

Прочитано: 123 строк; SHA-256 <code>2e470b7fc18c3fc589d4eef6228fb7d13547161b932c2371d2ce82ce8981de97</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 3 | description: "Complete specification for easyp.gen.yaml, configuring consumer-side code generation, plugin outputs, WASM/remote execution, and managed package options." | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 6 | The <code>easyp.gen.yaml</code> file specifies **consumer-side code generation rules**. Residing alongside consuming applications or service projects, it defines which modules or packages to compile, which plugins to invoke, where generated artifacts should be written, and language-specific managed options (such as <code>package&#95;prefix</code>). | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 33 | plugins: { | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 34 | description: "List of code generator plugins to execute.", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 37 | "plugins[].name": { | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 38 | description: "Local executable binary or WASM plugin identifier.", | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 41 | "plugins[].remote": { | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 42 | description: "gRPC or HTTP remote code generation service URL.", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 45 | "plugins[].version": { | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 46 | description: "Strict version tag of the plugin. ':latest' is prohibited for reproducibility.", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 49 | "plugins[].out": { | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 53 | "plugins[].opts": { | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 54 | description: "Plugin-specific key-value options or flag strings.", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 82 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 100 | ### Remote Web Generator (<code>frontend/easyp.gen.yaml</code>) | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |
| 109 | plugins: | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 110 | - remote: gen.easyp.tech/es | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/reference/easyp-yaml.mdx

Прочитано: 133 строк; SHA-256 <code>a265558cc9ae9854e14d849aeeed9e1641a18d10b0350d49a138edb94b2843a0</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 39 | description: "Remote Git module or policy path to inherit base linter rules from.", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |
| 74 | description: "Remote Git policy module to inherit breaking change settings from.", | [не подтверждено] Проверять в контексте; это не подтверждение наличия функции. |

## content/docs/reference/protobuf-lock.mdx

Прочитано: 70 строк; SHA-256 <code>37b8f01b321265527a6a47af0d66852b35ed0e7f7cc1b1b5b56413297dbf1b4f</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 70 | - <code>easyp mod download</code>: Populates local cache strictly using <code>protobuf.lock</code> without reaching out to remote registries or modifying locked versions. | Сверить с актуальными bsr-facts.md; исходный текст не является доказательством о Buf. [не подтверждено] |

## content/docs/reference/protobuf-mod.mdx

Прочитано: 66 строк; SHA-256 <code>7db99246f073954968752e9f80c660e7d06dd787e6c3f103226106077e94d52f</code>.

| Строка | Исходное утверждение / контекст | Статус |
| --- | --- | --- |
| 6 | The <code>protobuf.mod</code> file resides at the root of a Protocol Buffer module. Designed as a **tool-neutral standard**, it contains zero tool-specific settings (no linter flags, generator plugins, or vendor extensions). It is strictly focused on module identity, inner root directories, dependency requirements, and local source overrides. | CLI handoff: формат/исполнитель требует сверки с текущим CLI; не переносить в API Service как факт. [не подтверждено] |

## RU-паритет и старый сайт

Все четыре исходные RU-страницы API Service прочитаны целиком: overview, runbooks, backup, upgrading. Неподтверждённые исторические операционные истории не переносились; сходные ошибочные утверждения в EN и RU исправляются синхронно. Исходные версии сохранены в scratch/original-api, пакеты чтения — scratch/docs-ru-api-reading. Точные разногласия и общие ошибки перечислены в code-vs-docs-discrepancies.md. [команда: копирование до правок и построчное чтение 4 *.ru.mdx]

Исторический отдельный Vite-репозиторий docs/content/{en,ru} не получен из однозначно указанного GitHub-источника. Поиск этих путей в истории клонированного easyp-tech/docs не дал файлов. Личные соседние репозитории пользователя не использовались вместо GitHub. Потерянные при миграции сведения из старого сайта не подтверждены. [команда: git log --all --format="%h %s" -- content/en docs/content/en] [не подтверждено]

## Неприкосновенные якоря runbooks

- <code>easypauditdefaultpartitionused</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:139], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:143]
- <code>easypauditeventslost</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:111], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:115]
- <code>easypauditmaintenancestale</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:127], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:131]
- <code>easypauthfailures</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:190], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:187]
- <code>easypcertificateexpiringsoon</code>: [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:135]
- <code>easypgenerationerrorrate</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:171], [код: service/deploy/charts/easyp-service/tests/render.sh:698], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:168]
- <code>easypgenerationqueuesaturated</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:75], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:79]
- <code>easypgenerationsrejected</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:63], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:67]
- <code>easyphostdiskfillingup</code>: [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:51]
- <code>easyphostdisklow</code>: [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:30]
- <code>easyphostmemorylow</code>: [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:69]
- <code>easyplicenceexpiringsoon</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:35], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:39]
- <code>easyplicenceingrace</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:48], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:52]
- <code>easyppanics</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:180], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:177]
- <code>easypplugincacheatlimit</code>: [код: service/deploy/charts/easyp-service/templates/prometheusrule.yaml:95], [код: service/deploy/observability/mimir/rules/anonymous/easyp.yaml:99]
- <code>easypservicemissing</code>: [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:115]
- <code>easyptargetdown</code>: [код: service/deploy/observability/mimir/rules/anonymous/host.yaml:91]
