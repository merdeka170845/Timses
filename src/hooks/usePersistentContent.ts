import { useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/defaultContent'
import {
  canUseRemoteContent,
  clearContentStorage,
  fetchRemoteContent,
  getContentStorageKey,
  loadContentFromStorage,
  saveContentToStorage,
  saveRemoteContent,
  subscribeToRemoteContent,
  unsubscribeFromRemoteContent
} from '../lib/contentStore'
import type { SiteContent } from '../types'

export const usePersistentContent = () => {
  const [content, setContent] = useState<SiteContent>(() => loadContentFromStorage(defaultContent))

  useEffect(() => {
    const syncFromRemote = async () => {
      if (!canUseRemoteContent()) return

      try {
        const remote = await fetchRemoteContent()
        if (remote) {
          saveContentToStorage(remote)
          setContent(remote)
        }
      } catch (error) {
        console.error('Gagal mengambil data dari Supabase:', error)
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== getContentStorageKey()) return
      setContent(loadContentFromStorage(defaultContent))
    }

    void syncFromRemote()
    const channel = subscribeToRemoteContent(() => {
      void syncFromRemote()
    })

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      unsubscribeFromRemoteContent(channel)
    }
  }, [])

  const actions = useMemo(
    () => ({
      async update(next: SiteContent) {
        setContent(next)
        saveContentToStorage(next)

        try {
          await saveRemoteContent(next)
        } catch (error) {
          console.error('Gagal menyimpan data ke Supabase:', error)
          alert('Perubahan tersimpan di browser ini, tetapi gagal sinkron ke Supabase.')
        }
      },
      async reset() {
        clearContentStorage()
        setContent(defaultContent)

        try {
          await saveRemoteContent(defaultContent)
        } catch (error) {
          console.error('Gagal mereset data di Supabase:', error)
          alert('Data lokal berhasil direset, tetapi reset Supabase gagal.')
        }
      }
    }),
    []
  )

  return { content, actions }
}
