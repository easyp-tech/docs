interface GithubRelease {
  tag_name: string
}

interface GithubTag {
  name: string
}

const REPO = 'easyp-tech/easyp'

function isStable(name: string): boolean {
  const v = name.toLowerCase()
  return (
    !v.includes('-rc') &&
    !v.includes('-alpha') &&
    !v.includes('-beta') &&
    !v.includes('-pre') &&
    !v.includes('-dev')
  )
}

/**
 * Server-friendly latest stable version (Next fetch cache).
 * Prefer /releases/latest; fall back to tags list.
 */
export async function getLatestRelease(): Promise<string> {
  try {
    const releaseRes = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'easyp-docs',
        },
        next: { revalidate: 3600 },
      },
    )

    if (releaseRes.ok) {
      const data = (await releaseRes.json()) as GithubRelease
      if (data.tag_name) return data.tag_name
    }

    const tagsRes = await fetch(`https://api.github.com/repos/${REPO}/tags`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'easyp-docs',
      },
      next: { revalidate: 3600 },
    })

    if (!tagsRes.ok) {
      throw new Error(`GitHub tags status ${tagsRes.status}`)
    }

    const tags = (await tagsRes.json()) as GithubTag[]
    if (tags.length === 0) throw new Error('No tags')

    const stable = tags.find((t) => isStable(t.name))
    return stable?.name ?? tags[0].name
  } catch (error) {
    console.error(error)
    return 'unknown version'
  }
}
