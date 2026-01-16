import { defineStore } from 'pinia'

// Reset bei Reload = gewollt (kein Storage)
export const useDailyStore = defineStore('daily', {
  state: () => ({
    didDailySurveyToday: false,
  }),
})

export function resetDailyStateIfNewDay(todayStr) {
  // optional: falls du irgendwann doch “über Mitternacht” korrekt sein willst
  // ohne Storage bringt das nur was, wenn App durchläuft
  void todayStr
}
