import type { RealtimeChannel } from '@supabase/supabase-js'
import type { SiteContent } from '../types'
import { supabase } from './supabase'

const TABLE_NAME = 'site_content'
const PRIMARY_ROW_ID = 1

export const canUseRemoteContent = () => Boolean(supabase)

export const getContentStorageKey = () => 'timses-site-content-v2'

export const saveContentToStorage = (value: unknown) => {
  localStorage.setItem(getContentStorageKey(), JSON.stringify(value))
}

export const loadContentFromStorage = <T,>(fallback: T): T => {
  const raw = localStorage.getItem(getContentStorageKey())

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
  localStorage.removeItem(getContentStorageKey())
}

export const fetchRemoteContent = async (): Promise<SiteContent | null> => {
  if (!supabase) return null

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('content')
    .eq('id', PRIMARY_ROW_ID)
    .maybeSingle()

  if (error) throw error

  return (data?.content as SiteContent | null) ?? null
}

export const saveRemoteContent = async (content: SiteContent) => {
  if (!supabase) return

  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(
      {
        id: PRIMARY_ROW_ID,
        content,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    )

  if (error) throw error
}

export const subscribeToRemoteContent = (onChange: () => void): RealtimeChannel | null => {
  if (!supabase) return null

  return supabase
    .channel('public:site_content')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME, filter: `id=eq.${PRIMARY_ROW_ID}` },
      onChange
    )
    .subscribe()
}

export const unsubscribeFromRemoteContent = (channel: RealtimeChannel | null) => {
  if (!supabase || !channel) return
  supabase.removeChannel(channel)
}
