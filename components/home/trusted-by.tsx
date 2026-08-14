'use client'

import { useState } from 'react'
import { en } from '@/lib/home-copy'

interface Partner {
  name: string
  url: string
  logo?: string
}

const partners: Partner[] = [
  { name: 'comazo', url: 'https://comazo.ru/site_new/index.php', logo: '/assets/partners/comazo.svg' },
  { name: 'YADRO', url: 'https://yadro.com/', logo: '/assets/partners/yadro.svg' },
  { name: 'h3', url: 'https://h3llo.cloud/', logo: '/assets/partners/h3.png' },
  { name: 'OpenIDE', url: 'https://openide.ru/', logo: '/assets/partners/openide.svg' },
  { name: 'Positive Tech', url: 'https://ptsecurity.com/', logo: '/assets/partners/pt.svg' },
]

function PartnerItem({ partner }: { partner: Partner }) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 whitespace-nowrap opacity-50 grayscale transition-opacity hover:opacity-100"
    >
      {partner.logo && !imgError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-8 w-auto object-contain rounded-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-xl font-bold text-fd-foreground">{partner.name}</span>
      )}
    </a>
  )
}

export function TrustedBy() {
  const t = en.trustedBy
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners]

  return (
    <section className="relative overflow-hidden border-y border-fd-border bg-fd-muted/40 py-12">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-8 text-sm font-medium uppercase tracking-wider text-fd-muted-foreground">
          {t.title}
        </p>

        <div className="relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex items-center gap-12 hover:[animation-play-state:paused]">
            {duplicatedPartners.map((partner, index) => (
              <PartnerItem key={`${partner.name}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
