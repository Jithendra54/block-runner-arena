export function registerPwa() {
  const isProduction = (import.meta as ImportMeta & { env: { PROD: boolean } }).env.PROD
  if (!('serviceWorker' in navigator) || !isProduction) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
      console.warn('Offline app support could not be enabled.', error)
    })
  })
}

export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: InstallPromptEvent
  }
}