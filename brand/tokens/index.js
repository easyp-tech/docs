/**
 * Public token API for JS consumers (MUI theme, scripts).
 * JSON files are the source of truth; generate.mjs builds CSS/preset from them.
 *
 * Uses import attributes so Node 20+ and Vite both resolve JSON correctly.
 */
import colors from './colors.json' with { type: 'json' }
import typography from './typography.json' with { type: 'json' }
import radii from './radii.json' with { type: 'json' }
import shadows from './shadows.json' with { type: 'json' }
import spacing from './spacing.json' with { type: 'json' }
import semantic from './semantic.json' with { type: 'json' }

export { colors, typography, radii, shadows, spacing, semantic }

/** Resolve "{slate.500}" / "{white}" refs against colors palette */
export function resolveToken(ref) {
  if (typeof ref !== 'string') return ref
  const nested = ref.match(/^\{([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)\}$/)
  if (nested) {
    const [, group, key] = nested
    const g = colors[group]
    if (g == null) return ref
    if (typeof g === 'string') return g
    return g[key] ?? ref
  }
  const top = ref.match(/^\{([a-zA-Z0-9]+)\}$/)
  if (top) {
    const g = colors[top[1]]
    if (typeof g === 'string') return g
  }
  return ref
}

export function resolveSemantic(mode, key) {
  const map = semantic[mode]
  if (!map || map[key] == null) return undefined
  return resolveToken(map[key])
}
