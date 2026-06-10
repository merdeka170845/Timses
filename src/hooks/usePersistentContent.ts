import { useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import { clearContentStorage, loadContentFromStorage, saveContentToStorage } from '../lib/storage'
import type { SiteContent } from '../types'

export const usePersistentContent = () => {
  const [content, setContent] = useState<SiteContent>(() => loadContentFromStorage(defaultContent))

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
