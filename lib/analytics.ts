/**
 * Umami custom events (pulse.sipki.tech, website "EasyP").
 *
 * The tracker loads after hydration and only reports on easyp.tech, so every
 * call is a no-op until it is there. Event data never carries text people
 * typed, except the plugin catalog search (`plugins-search`), which is a
 * catalog lookup, not free text about the person.
 */

export const umamiHost = 'https://pulse.sipki.tech'
export const umamiWebsiteId = '6a3c3583-67aa-49ed-8c19-837751e72374'
export const siteHost = 'easyp.tech'

type EventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: { track: (event: string, data?: EventData) => void }
  }
}

export function track(event: string, data?: EventData): void {
  try {
    window.umami?.track(event, data)
  } catch {
    // Analytics must never break the page.
  }
}
