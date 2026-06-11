
const STORAGE_KEY = 'timses-site-content-v2'

export const getStorageKey = () => STORAGE_KEY

export const saveContentToStorage = (value: unknown) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export const loadContentFromStorage = <T,>(fallback: T): T => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return fallback

  try {
    const parsed = JSON.parse(raw) as T

    if (
      typeof fallback === 'object' &&
      fallback !== null &&
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(fallback) &&
      !Array.isArray(parsed)
    ) {
      return {
        ...(fallback as Record<string, unknown>),
        ...(parsed as Record<string, unknown>)
      } as T
    }

    return parsed
  } catch {
    return fallback
  }
}

export const clearContentStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
}
