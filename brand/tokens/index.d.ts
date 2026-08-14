export interface ColorScale {
  [step: string]: string
}

export interface Colors {
  blue: ColorScale
  violet: ColorScale
  emerald: ColorScale
  red: ColorScale
  amber: ColorScale
  white: string
  slate: ColorScale
}

export interface Typography {
  fonts: {
    sans: string
    mono: string
  }
  sizes: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
}

export interface Radii {
  sm: string
  md: string
  lg: string
  full: string
}

export interface Shadows {
  sm: string
  md: string
  lg: string
}

export type Spacing = Record<string, string>

export interface SemanticMap {
  [key: string]: string
}

export interface Semantic {
  light: SemanticMap
  dark: SemanticMap
  marketing: SemanticMap
}

export const colors: Colors
export const typography: Typography
export const radii: Radii
export const shadows: Shadows
export const spacing: Spacing
export const semantic: Semantic

export function resolveToken(ref: string): string
export function resolveSemantic(
  mode: keyof Semantic,
  key: string,
): string | undefined
