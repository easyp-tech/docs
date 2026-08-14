import { Shield } from 'lucide-react'
import { en } from '@/lib/home-copy'
import Link from 'next/link'
import { EasyPLogo } from '@/components/easyp-logo'

export function Footer() {
  const t = en.footer
  return (
    <footer className="border-t border-fd-border bg-fd-card py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <EasyPLogo size={24} className="size-6 shrink-0" />
              <span className="font-bold tracking-tight text-fd-foreground">
                EasyP
              </span>
            </div>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-fd-muted-foreground">
              {t.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-fd-muted-foreground">
              <Shield size={12} /> {t.license}
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-fd-foreground">{t.product.title}</h4>
            <ul className="space-y-3 text-sm text-fd-muted-foreground">
              <li>
                <Link href="/docs/cli/linter" className="transition-colors hover:text-fd-primary">
                  {t.product.cliTool}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api-service/overview"
                  className="transition-colors hover:text-fd-primary"
                >
                  {t.product.apiService}
                </Link>
              </li>
              <li>
                <Link href="/docs" className="transition-colors hover:text-fd-primary">
                  {t.product.documentation}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-fd-foreground">{t.community.title}</h4>
            <ul className="space-y-3 text-sm text-fd-muted-foreground">
              <li>
                <a
                  href="https://github.com/easyp-tech/easyp"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-fd-primary"
                >
                  {t.community.github}
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/easyptech"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-fd-primary"
                >
                  {t.community.telegram}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between border-t border-fd-border pt-8 text-xs text-fd-muted-foreground md:flex-row">
          <p>{t.rights}</p>
        </div>
      </div>
    </footer>
  )
}
