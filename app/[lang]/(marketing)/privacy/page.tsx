import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isAppLocale, type AppLocale } from '@/lib/i18n'
import { OptOut } from '@/components/analytics-opt-out'

type Props = { params: Promise<{ lang: string }> }

type Copy = {
  metaTitle: string
  title: string
  intro: string
  sections: Array<{ title: string; items: string[] }>
  optOut: { title: string; body: string; off: string; on: string; disabled: string; enabled: string }
  contact: string
}

const copy: Record<AppLocale, Copy> = {
  en: {
    metaTitle: 'Privacy',
    title: 'Privacy',
    intro:
      'easyp.tech counts visits with Umami, an open-source analytics tool that we run on our own server (pulse.sipki.tech). No cookies, no advertising networks, nothing is sold or shared.',
    sections: [
      {
        title: 'What is collected',
        items: [
          'Pages you open, the site you came from and UTM tags in the link.',
          'Browser, operating system, device type, screen size, language, and country and city derived from the IP address. The IP address itself is not stored.',
          'Clicks on a few buttons: copying the install command, code examples and plugin settings, switching language, opening search, links to other sites.',
          'What you type into the plugin catalog search, so we can see which plugins people look for.',
          'How fast pages load (Web Vitals) and JavaScript errors in your browser.',
          'A recording of how you move around a page (scrolls, clicks, what is on the screen), used to find places where the docs are confusing. Input fields are hidden in the recording.',
        ],
      },
      {
        title: 'What is not collected',
        items: [
          'Names, emails or accounts: the site has no sign-in.',
          'Anything that follows you to other sites.',
        ],
      },
    ],
    optOut: {
      title: 'Turning it off',
      body: 'The switch below is remembered in this browser and stops both counting and recording.',
      off: 'Turn off analytics in this browser',
      on: 'Turn analytics back on',
      disabled: 'Analytics is off in this browser.',
      enabled: 'Analytics is on in this browser.',
    },
    contact:
      'Questions, or want your data removed? Write to us in Telegram (t.me/easyptech) or open an issue on GitHub (github.com/easyp-tech/easyp).',
  },
  ru: {
    metaTitle: 'Приватность',
    title: 'Приватность',
    intro:
      'easyp.tech считает посещения с помощью Umami — открытой системы аналитики, которая работает на нашем собственном сервере (pulse.sipki.tech). Без cookie и рекламных сетей, данные никому не продаются и не передаются.',
    sections: [
      {
        title: 'Что собирается',
        items: [
          'Какие страницы вы открываете, с какого сайта пришли и UTM-метки в ссылке.',
          'Браузер, операционная система, тип устройства, размер экрана, язык, а также страна и город, определённые по IP-адресу. Сам IP-адрес не сохраняется.',
          'Нажатия на несколько кнопок: копирование команды установки, примеров кода и настроек плагинов, смена языка, открытие поиска, ссылки на другие сайты.',
          'Что вы ищете в каталоге плагинов, чтобы видеть, каких плагинов не хватает.',
          'Скорость загрузки страниц (Web Vitals) и ошибки JavaScript в браузере.',
          'Запись того, как вы двигаетесь по странице (прокрутка, нажатия, что на экране), чтобы находить места, где документация непонятна. Поля ввода в записи скрыты.',
        ],
      },
      {
        title: 'Что не собирается',
        items: [
          'Имена, почта и учётные записи: входа на сайте нет.',
          'Ничего, что следило бы за вами на других сайтах.',
        ],
      },
    ],
    optOut: {
      title: 'Как отключить',
      body: 'Переключатель ниже запоминается в этом браузере и выключает и подсчёт, и запись.',
      off: 'Отключить аналитику в этом браузере',
      on: 'Включить аналитику обратно',
      disabled: 'Аналитика в этом браузере выключена.',
      enabled: 'Аналитика в этом браузере включена.',
    },
    contact:
      'Вопросы или хотите, чтобы мы удалили ваши данные? Напишите нам в Telegram (t.me/easyptech) или в issue на GitHub (github.com/easyp-tech/easyp).',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()
  return { title: copy[lang].metaTitle }
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  if (!isAppLocale(lang)) notFound()
  const c = copy[lang]

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pt-24 pb-24 text-fd-foreground lg:pt-32">
      <h1 className="mb-6 text-4xl font-bold tracking-tight">{c.title}</h1>
      <p className="mb-10 leading-relaxed text-fd-muted-foreground">{c.intro}</p>
      {c.sections.map((section) => (
        <section key={section.title} className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed text-fd-muted-foreground">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">{c.optOut.title}</h2>
        <p className="mb-4 leading-relaxed text-fd-muted-foreground">{c.optOut.body}</p>
        <OptOut labels={c.optOut} />
      </section>
      <p className="leading-relaxed text-fd-muted-foreground">{c.contact}</p>
    </main>
  )
}
