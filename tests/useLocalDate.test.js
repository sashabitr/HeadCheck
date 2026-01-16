import { describe, it, expect } from 'vitest'
import { useLocalDate } from '@/composables/useLocalDate'

describe('useLocalDate', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    const { toLocalIsoDate } = useLocalDate()
    const date = new Date(2024, 0, 2)

    expect(toLocalIsoDate(date)).toBe('2024-01-02')
  })

  it('adds days to an ISO date string', () => {
    const { addDays } = useLocalDate()

    expect(addDays('2024-01-02', 1)).toBe('2024-01-03')
    expect(addDays('2024-01-02', -1)).toBe('2024-01-01')
  })
})
