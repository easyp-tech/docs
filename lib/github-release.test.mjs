import assert from 'node:assert/strict'
import test from 'node:test'
import { getLatestRelease } from './github-release.ts'

const latestURL = 'https://api.github.com/repos/easyp-tech/easyp/releases/latest'
const releasesURL = 'https://api.github.com/repos/easyp-tech/easyp/releases?per_page=100'
const release = (tag, flags = {}) => ({
  tag_name: tag,
  name: tag,
  draft: false,
  prerelease: false,
  ...flags,
})

function mockGitHub(t, latest, releases) {
  t.mock.method(console, 'error', () => {})
  return t.mock.method(globalThis, 'fetch', async (url) => {
    const value = url === latestURL ? latest : releases
    if (value instanceof Error) throw value
    return value instanceof Response ? value : Response.json(value)
  })
}

test('uses the validated published stable latest release and keeps Next cache options', async (t) => {
  const fetch = mockGitHub(t, release('v0.17.1'), [])
  assert.equal(await getLatestRelease(), 'v0.17.1')
  assert.equal(fetch.mock.callCount(), 1)
  const [url, options] = fetch.mock.calls[0].arguments
  assert.equal(url, latestURL)
  assert.equal(options.next.revalidate, 3600)
  assert.equal(options.headers.Accept, 'application/vnd.github+json')
})

test('allows a future published stable v1 release without a major-version ceiling', async (t) => {
  mockGitHub(t, release('v1.0.0'), [])
  assert.equal(await getLatestRelease(), 'v1.0.0')
})

for (const [name, latest] of [
  ['HTTP error', new Response('', { status: 404 })],
  ['network error', new Error('network unavailable')],
  ['invalid JSON', new Response('{invalid', { headers: { 'Content-Type': 'application/json' } })],
  ['malformed JSON shape', { tag_name: 42, draft: false, prerelease: false }],
  ['nightly tag with false prerelease flag', release('v1.0.0-nightly.20261005.1')],
  ['stable-shaped prerelease', release('v1.0.0', { prerelease: true })],
  ['stable-shaped draft', release('v1.0.0', { draft: true })],
  ['missing publication flags', { tag_name: 'v1.0.0' }],
  ['non-boolean publication flags', { tag_name: 'v1.0.0', draft: 0, prerelease: 'false' }],
]) {
  test(`falls back to published stable releases after latest ${name}`, async (t) => {
    const fetch = mockGitHub(t, latest, [
      release('v1.0.0-nightly.20261005.1', { prerelease: true }),
      release('v0.17.1'),
    ])
    assert.equal(await getLatestRelease(), 'v0.17.1')
    assert.equal(fetch.mock.calls[1].arguments[0], releasesURL)
  })
}

test('fallback chooses the highest stable version numerically, independently of list order', async (t) => {
  mockGitHub(t, new Response('', { status: 503 }), [
    release('v0.9.9'),
    release('v2.0.0-nightly.20261005.1'),
    release('v1.0.0', { draft: true }),
    release('v1.0.0', { prerelease: true }),
    release('v0.10.2'),
    release('v0.10.1'),
    release('v0.10.3-rc.1'),
  ])
  assert.equal(await getLatestRelease(), 'v0.10.2')
})

for (const [name, releases] of [
  ['nightlies and prereleases only', [release('v1.0.0-nightly.20261005.1'), release('v1.0.0-rc.1'), release('v1.0.0-beta.2')]],
  ['drafts and stable-shaped prereleases only', [release('v1.0.0', { draft: true }), release('v0.17.1', { prerelease: true })]],
  ['unknown and malformed tags only', [release('nightly'), release('v1.0'), release('v01.2.3'), { name: 'v0.17.1' }, null]],
  ['empty list', []],
  ['invalid list shape', { tag_name: 'v0.17.1' }],
  ['fallback HTTP failure', new Response('', { status: 500 })],
  ['fallback network failure', new Error('network unavailable')],
  ['fallback invalid JSON', new Response('{invalid')],
]) {
  test(`fails closed when fallback contains ${name}`, async (t) => {
    mockGitHub(t, new Response('', { status: 404 }), releases)
    assert.equal(await getLatestRelease(), 'unknown version')
  })
}
