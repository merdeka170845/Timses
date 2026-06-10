const STORAGE_KEY = 'timses-site-content-v1'

export const saveContentToStorage = (value: unknown) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export const loadContentFromStorage = <T,>(fallback: T): T => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const clearContentStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
}
