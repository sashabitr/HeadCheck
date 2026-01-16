import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDailyStore } from '@/state/dailyState'

describe('useDailyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with didDailySurveyToday = false', () => {
    const store = useDailyStore()

    expect(store.didDailySurveyToday).toBe(false)
  })

  it('allows updating didDailySurveyToday', () => {
    const store = useDailyStore()

    store.didDailySurveyToday = true
    expect(store.didDailySurveyToday).toBe(true)
  })
})
