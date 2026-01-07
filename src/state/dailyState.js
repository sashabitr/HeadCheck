import { ref } from 'vue'

// Reset bei Reload = gewollt (kein Storage)
export const didDailySurveyToday = ref(false)

export function resetDailyStateIfNewDay(todayStr) {
  // optional: falls du irgendwann doch “über Mitternacht” korrekt sein willst
  // ohne Storage bringt das nur was, wenn App durchläuft
}
