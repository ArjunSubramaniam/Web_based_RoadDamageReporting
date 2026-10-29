import { useCallback, useEffect, useState } from 'react'
import { getNotifications, subscribeReports } from '../services/reportService.js'
import { useAuth } from './useAuth.jsx'

export function useStoreTick() {
  const [tick, setTick] = useState(0)
  useEffect(() => subscribeReports(() => setTick((value) => value + 1)), [])
  return tick
}

export function useNotifications() {
  const { user } = useAuth()
  const tick = useStoreTick()
  const [items, setItems] = useState([])

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    const list = await getNotifications(user.id)
    setItems(list)
  }, [user, tick])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    items,
    unread: items.filter((item) => !item.read).length,
    refresh,
  }
}
