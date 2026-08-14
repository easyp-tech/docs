import { Hero } from '@/components/home/hero'
import { TrustedBy } from '@/components/home/trusted-by'
import { FeatureSwitcher } from '@/components/home/feature-switcher'
import { ArchitectureComparison } from '@/components/home/architecture-comparison'
import { Footer } from '@/components/home/footer'
import { getLatestRelease } from '@/lib/github-release'

export default async function HomePage() {
  const version = await getLatestRelease()
  const versionLabel =
    version && version !== 'unknown version' ? version : 'vX.X.X'

  // Use <div> not <main> — Fumadocs HomeLayout already wraps children in <main id="nd-home-layout">.
  // Theme-aware surfaces via --color-fd-* (light + dark).
  return (
    <div className="relative isolate flex flex-1 flex-col bg-fd-background text-fd-foreground">
      <Hero version={versionLabel} />
      <TrustedBy />
      <FeatureSwitcher />
      <ArchitectureComparison />
      <Footer />
    </div>
  )
}
