<template>
  <div class="choice-group">
    <label class="choice" :class="{ 'is-selected': model === 'yes' }">
      <input v-model="model" type="radio" value="yes" />
      <span>{{ yesLabel }}</span>
    </label>
    <label class="choice" :class="{ 'is-selected': model === 'no' }">
      <input v-model="model" type="radio" value="no" />
      <span>{{ noLabel }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  yesLabel: {
    type: String,
    default: 'yes',
  },
  noLabel: {
    type: String,
    default: 'no',
  },
})

const emit = defineEmits(['update:modelValue'])

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
