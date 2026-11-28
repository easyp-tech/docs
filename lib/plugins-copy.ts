import type { AppLocale } from './i18n'

const en = {
  metaTitle: 'Plugins on plugins.easyp.tech',
  metaDescription:
    'Every code generator registered on the public EasyP plugin registry: protoc plugins for Go, TypeScript, Python, Java, Rust, Swift and more, ready to use from easyp.gen.yaml.',
  badgeLive: 'Live',
  badgeSnapshot: 'Snapshot',
  service: 'service',
  title: 'Plugins on',
  subtitle:
    'Every code generator registered on the public EasyP registry. Reference one from easyp.gen.yaml and it runs on the service — nothing to install, the same version on every machine and in CI.',
  stats: { plugins: 'plugins', versions: 'versions', groups: 'publishers' },
  listedAt: 'Listing from',
  snapshotNote:
    'The registry did not answer, so this is the last saved listing. Plugins and versions may have changed since.',
  quickstart: {
    title: 'Use it in easyp.gen.yaml',
    body: 'Point a plugin at the registry with remote: and version: — pin the version so the output does not move when a newer one is published.',
    copyConfig: 'Copy easyp.gen.yaml',
    agents: 'For AI agents',
    agentsBody:
      'The same listing over MCP, as the plugins_list tool. Connect any agent by URL, or Claude Code with one command.',
    mcpEndpoint: 'MCP endpoint',
    copyMcpUrl: 'Copy MCP URL',
    copyCommand: 'Copy command',
    docs: 'Client usage docs',
  },
  browser: {
    ariaPlugins: 'Plugins',
    ariaPublishers: 'Publishers',
    search: 'go, grpc, typescript, validate…',
    all: 'All',
    latest: 'latest',
    versions: (n: number) => `${n} ${n === 1 ? 'version' : 'versions'}`,
    updated: 'Updated',
    copy: 'Copy plugin entry',
    copied: 'Copied',
    showVersions: 'All versions',
    hideVersions: 'Hide versions',
    versionHint: 'Click a version to copy its plugin entry',
    recipe: 'Recipe',
    empty: 'No plugin matches',
    clear: 'Clear filters',
    shown: (n: number, total: number) => `${n} of ${total}`,
  },
  footer: {
    catalogTitle: 'Running your own service?',
    catalogBody:
      'The plugin catalog lists every recipe the service repository can build — including versions not registered here.',
    catalogLink: 'Plugin catalog',
    roadmapLink: 'Roadmap',
  },
}

const ru: typeof en = {
  metaTitle: 'Плагины на plugins.easyp.tech',
  metaDescription:
    'Все генераторы кода в публичном реестре EasyP: protoc-плагины для Go, TypeScript, Python, Java, Rust, Swift и других языков, готовые к использованию из easyp.gen.yaml.',
  badgeLive: 'Онлайн',
  badgeSnapshot: 'Снимок',
  service: 'сервис',
  title: 'Плагины на',
  subtitle:
    'Все генераторы кода в публичном реестре EasyP. Укажите плагин в easyp.gen.yaml — он запустится на сервисе: ничего не нужно ставить, версия одна и та же на любой машине и в CI.',
  stats: { plugins: 'плагинов', versions: 'версий', groups: 'издателей' },
  listedAt: 'Список на',
  snapshotNote:
    'Реестр не ответил, поэтому показан последний сохранённый список. С тех пор плагины и версии могли измениться.',
  quickstart: {
    title: 'Подключение в easyp.gen.yaml',
    body: 'Укажите плагин через remote: и version: — зафиксируйте версию, чтобы результат не менялся, когда выйдет новая.',
    copyConfig: 'Скопировать easyp.gen.yaml',
    agents: 'Для AI-агентов',
    agentsBody:
      'Тот же список через MCP — инструмент plugins_list. Подключите любого агента по адресу или Claude Code одной командой.',
    mcpEndpoint: 'Адрес MCP',
    copyMcpUrl: 'Скопировать адрес MCP',
    copyCommand: 'Скопировать команду',
    docs: 'Документация по подключению',
  },
  browser: {
    ariaPlugins: 'Плагины',
    ariaPublishers: 'Издатели',
    search: 'go, grpc, typescript, validate…',
    all: 'Все',
    latest: 'latest',
    versions: (n: number) => {
      const mod10 = n % 10
      const mod100 = n % 100
      const word =
        mod10 === 1 && mod100 !== 11
          ? 'версия'
          : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
            ? 'версии'
            : 'версий'
      return `${n} ${word}`
    },
    updated: 'Обновлён',
    copy: 'Скопировать блок плагина',
    copied: 'Скопировано',
    showVersions: 'Все версии',
    hideVersions: 'Скрыть версии',
    versionHint: 'Нажмите на версию, чтобы скопировать блок плагина',
    recipe: 'Рецепт',
    empty: 'Ничего не найдено',
    clear: 'Сбросить фильтры',
    shown: (n: number, total: number) => `${n} из ${total}`,
  },
  footer: {
    catalogTitle: 'Свой сервис?',
    catalogBody:
      'В каталоге плагинов — все рецепты, которые умеет собирать репозиторий сервиса, включая версии, которых здесь нет.',
    catalogLink: 'Каталог плагинов',
    roadmapLink: 'Роадмап',
  },
}

export type PluginsCopy = typeof en
export type BrowserCopy = PluginsCopy['browser']

export function pluginsCopy(locale: AppLocale): PluginsCopy {
  return locale === 'ru' ? ru : en
}
