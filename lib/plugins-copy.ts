import type { AppLocale } from './i18n'

const en = {
  metaTitle: 'Plugins on plugins.easyp.tech',
  metaDescription:
    'Every code generator registered on the public EasyP plugin registry: protoc plugins for Go, TypeScript, Python, Java, Rust, Swift and more, ready to use from easyp.yaml.',
  badgeLive: 'Live',
  badgeSnapshot: 'Snapshot',
  title: 'Plugins on',
  subtitle:
    'Every code generator registered on the public EasyP registry. Reference one from easyp.yaml and it runs on the service — nothing to install, the same version on every machine and in CI.',
  stats: { plugins: 'plugins', versions: 'versions', groups: 'publishers' },
  listedAt: 'Listing from',
  snapshotNote:
    'The registry did not answer, so this is the last saved listing. Plugins and versions may have changed since.',
  quickstart: {
    title: 'Use it in easyp.yaml',
    body: 'Point a plugin at the registry with remote: — pin the version so the output does not move when a newer one is published.',
    agents: 'For AI agents',
    agentsBody: 'The same listing over MCP, tool plugins_list:',
    docs: 'Client usage docs',
  },
  browser: {
    search: 'go, grpc, typescript, validate…',
    all: 'All',
    latest: 'latest',
    versions: (n: number) => `${n} ${n === 1 ? 'version' : 'versions'}`,
    updated: 'Updated',
    copy: 'Copy remote line',
    copied: 'Copied',
    showVersions: 'All versions',
    hideVersions: 'Hide versions',
    versionHint: 'Click a version to copy its remote line',
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
    'Все генераторы кода в публичном реестре EasyP: protoc-плагины для Go, TypeScript, Python, Java, Rust, Swift и других языков, готовые к использованию из easyp.yaml.',
  badgeLive: 'Онлайн',
  badgeSnapshot: 'Снимок',
  title: 'Плагины на',
  subtitle:
    'Все генераторы кода в публичном реестре EasyP. Укажите плагин в easyp.yaml — он запустится на сервисе: ничего не нужно ставить, версия одна и та же на любой машине и в CI.',
  stats: { plugins: 'плагинов', versions: 'версий', groups: 'издателей' },
  listedAt: 'Список на',
  snapshotNote:
    'Реестр не ответил, поэтому показан последний сохранённый список. С тех пор плагины и версии могли измениться.',
  quickstart: {
    title: 'Подключение в easyp.yaml',
    body: 'Укажите плагин через remote: и зафиксируйте версию, чтобы результат не менялся, когда выйдет новая.',
    agents: 'Для AI-агентов',
    agentsBody: 'Тот же список через MCP, инструмент plugins_list:',
    docs: 'Документация по подключению',
  },
  browser: {
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
    copy: 'Скопировать строку remote',
    copied: 'Скопировано',
    showVersions: 'Все версии',
    hideVersions: 'Скрыть версии',
    versionHint: 'Нажмите на версию, чтобы скопировать её строку remote',
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
