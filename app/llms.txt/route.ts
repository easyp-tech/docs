import { source } from '@/lib/source'
import { llms } from 'fumadocs-core/source'

export const revalidate = false

export function GET() {
  const formatter = llms(source)

  const formatTree = (lang: 'en' | 'ru') =>
    source
      .getPageTree(lang)
      .children.map((node) => formatter.indexNode(node, lang))
      .join('\n')

  const body = [
    '# EasyP Documentation',
    '',
    '> Open-source, Git-native Protobuf toolchain: CLI (linter, generator, breaking-change detector, package manager), pure-Go easyprotoc compiler, and remote plugin service.',
    '',
    '## Platform',
    '',
    '- [Plugin Registry (EN)](/plugins): Live catalog of remote plugins on plugins.easyp.tech',
    '- [Plugin Registry (RU)](/ru/plugins): Каталог удалённых плагинов на plugins.easyp.tech',
    '- [Roadmap (EN)](/roadmap): Shipped milestones and upcoming work across EasyP',
    '- [Roadmap (RU)](/ru/roadmap): Вышедшие релизы и ближайшие планы развития EasyP',
    '- [Full Documentation (EN)](/llms-full.txt): Complete English documentation in a single Markdown file',
    '- [Full Documentation (RU)](/llms-full.txt?locale=ru): Полная русская документация в одном Markdown-файле',
    '',
    '## Documentation (English — /docs)',
    '',
    formatTree('en'),
    '',
    '## Документация (Русский — /ru/docs)',
    '',
    formatTree('ru'),
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
