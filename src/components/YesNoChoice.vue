<template>
  <!-- Container für die Ja/Nein-Auswahl -->
  <div class="choice-group">
    <!-- YES-Option -->
    <label
      class="choice"
      :class="{ 'is-selected': model === 'yes' }"
    >
      <!-- Radio-Input für "yes" -->
      <input
        v-model="model"
        type="radio"
        value="yes"
      />
      <span>{{ yesLabel }}</span>
    </label>

    <!-- NO-Option -->
    <label
      class="choice"
      :class="{ 'is-selected': model === 'no' }"
    >
      <!-- Radio-Input für "no" -->
      <input
        v-model="model"
        type="radio"
        value="no"
      />
      <span>{{ noLabel }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * YesNoChoice-Komponente
 *
 * Wiederverwendbare Ja/Nein-Auswahl basierend auf Radio-Buttons.
 * Die Komponente ist vollständig kompatibel mit v-model.
 *
 * Einsatz z.B.:
 * <YesNoChoice v-model="answers.headache" />
 */

/**
 * Props der Komponente.
 */
const props = defineProps({
  /**
   * Aktueller Wert des v-model.
   * Erwartete Werte:
   * - 'yes'
   * - 'no'
   * - '' (noch keine Auswahl)
   */
  modelValue: {
    type: String,
    default: '',
  },

  /**
   * Beschriftung für die "Ja"-Option.
   */
  yesLabel: {
    type: String,
    default: 'yes',
  },

  /**
   * Beschriftung für die "Nein"-Option.
   */
  noLabel: {
    type: String,
    default: 'no',
  },
})

/**
 * Events, die von der Komponente emittiert werden.
 */
const emit = defineEmits([
  /**
   * Update-Event für v-model.
   * Wird ausgelöst, wenn der Nutzer eine Auswahl trifft.
   */
  'update:modelValue',
])

/**
 * Computed Property als v-model-Bridge.
 *
 * - get(): liefert den aktuellen Wert aus den Props
 * - set(): emittiert Änderungen an die Parent-Komponente
 */
const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>


<style scoped>
.choice-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.choice {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 12px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.choice input {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  position: relative;
}

.choice input:checked {
  background: #b18385;
  border-color: #b18385;
}

.choice.is-selected {
  background: rgba(255, 255, 255, 0.1);
  border-color: #b18385;
}

.choice span {
  text-transform: lowercase;
  letter-spacing: 0.05em;
}
</style>
