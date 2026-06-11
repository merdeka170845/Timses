
import { useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import { clearContentStorage, getStorageKey, loadContentFromStorage, saveContentToStorage } from '../lib/storage'
import type { SiteContent } from '../types'

export const usePersistentContent = () => {
  const [content, setContent] = useState<SiteContent>(() => loadContentFromStorage(defaultContent))

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== getStorageKey()) return
      setContent(loadContentFromStorage(defaultContent))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const actions = useMemo(
    () => ({
      update(next: SiteContent) {
        setContent(next)
        saveContentToStorage(next)
      },
      reset() {
        clearContentStorage()
        setContent(defaultContent)
      }
    }),
    []
  )

  return { content, actions }
}
