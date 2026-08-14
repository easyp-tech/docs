/**
 * Nav mark as on production https://easyp.tech (Navbar.tsx):
 * rounded square + "EP" — not the geometric path SVG (looks distorted at 28px).
 *
 * Static files still live in public/ (favicon, logo.svg) for browser chrome / OG.
 */
export function EasyPLogo({
  size = 32,
  className,
}: {
  size?: number
  className?: string
}) {
  const fontSize = Math.max(10, Math.round(size * 0.375))

  return (
    <span
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="flex size-full items-center justify-center rounded-lg border border-fd-primary/30 bg-fd-primary/20 font-bold tracking-tight text-fd-primary"
        style={{ fontSize }}
      >
        EP
      </span>
    </span>
  )
}

/** Optional: file-based mark (public/logo.svg from easyp-logo.svg) for places that need an image. */
export function EasyPLogoImage({
  size = 28,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="EasyP"
      width={size}
      height={size}
      className={className}
    />
  )
}
