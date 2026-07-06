import { useCallback, useSyncExternalStore } from 'react'

interface LegacyMediaQueryList {
  addListener?: (handler: () => void) => void
  removeListener?: (handler: () => void) => void
}

function getMatches(query: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false
}

function subscribeToQuery(query: string, onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mql = window.matchMedia(query)
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', onStoreChange)
    return () => mql.removeEventListener('change', onStoreChange)
  }

  const legacy = mql as unknown as LegacyMediaQueryList
  legacy.addListener?.(onStoreChange)
  return () => legacy.removeListener?.(onStoreChange)
}

/** Subscribes to a media query's live match state, updating on OS/browser changes. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onStoreChange: () => void) => subscribeToQuery(query, onStoreChange), [query])
  const getSnapshot = useCallback(() => getMatches(query), [query])

  return useSyncExternalStore(subscribe, getSnapshot)
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function usePrefersFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)')
}
