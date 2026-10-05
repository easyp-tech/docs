interface GithubRelease {
  tag_name: string
  draft: boolean
  prerelease: boolean
}

const REPO = 'easyp-tech/easyp'

function isPublishedStable(value: unknown): value is GithubRelease {
  if (typeof value !== 'object' || value === null) return false
  const release = value as Partial<GithubRelease>
  return (
    release.draft === false &&
    release.prerelease === false &&
    typeof release.tag_name === 'string' &&
    /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(release.tag_name)
  )
}

async function readReleases(path: string): Promise<unknown> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/${path}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'easyp-docs',
        },
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

function compareVersions(left: string, right: string): number {
  const a = left.slice(1).split('.').map(BigInt)
  const b = right.slice(1).split('.').map(BigInt)
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1
  }
  return 0
}

/** Server-friendly published stable version, cached with Next fetch. */
export async function getLatestRelease(): Promise<string> {
  const latest = await readReleases('releases/latest')
  if (isPublishedStable(latest)) return latest.tag_name

  const releases = await readReleases('releases?per_page=100')
  if (!Array.isArray(releases)) return 'unknown version'

  let stable: string | undefined
  for (const release of releases) {
    if (
      isPublishedStable(release) &&
      (stable === undefined || compareVersions(release.tag_name, stable) > 0)
    ) {
      stable = release.tag_name
    }
  }
  return stable ?? 'unknown version'
}
