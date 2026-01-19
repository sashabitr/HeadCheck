<template>
  <Transition name="modal-fade">
    <div v-if="open" class="modal-backdrop" @click.self="handleClose">
      <div class="modal">
        <h3 v-if="title">{{ title }}</h3>
        <slot />
        <div v-if="$slots.actions" class="modal-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

function handleClose() {
  if (props.open) emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  z-index: 30;
}

.modal {
  background: #4b455a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 20px 20px 18px;
  color: #f1e9f0;
  width: min(320px, 88vw);
  max-height: 70vh;
  overflow: auto;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
  text-align: center;
}

.modal h3 {
  margin: 0 0 10px;
  font-size: 1.08rem;
  color: #ffffff;
  font-weight: 800;
}

.modal :deep(p) {
  margin: 0 0 16px;
  line-height: 1.5;
  opacity: 0.95;
  color: #fdf9ff;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.modal :deep(.secondary-btn) {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #f1e9f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.modal :deep(.secondary-btn:hover) {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.5);
}

.modal :deep(.secondary-btn:active) {
  transform: translateY(1px);
}

.modal :deep(.close-btn) {
  width: 100%;
  background: #7d5c9f;
  border: none;
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    background 0.2s ease;
}

.modal :deep(.close-btn:active) {
  transform: translateY(1px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
