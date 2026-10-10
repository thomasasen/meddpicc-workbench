<script setup lang="ts">
defineProps<{
  modelValue: 1 | 2 | 3
  steps: readonly string[]
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [step: 1 | 2 | 3]
}>()

function choose(index: number): void {
  if (index < 0 || index > 2) return
  emit('update:modelValue', (index + 1) as 1 | 2 | 3)
}
</script>

<template>
  <nav class="tool-step-navigation" :aria-label="label">
    <button
      v-for="(title, index) in steps"
      :key="title"
      type="button"
      class="tool-step-navigation__item"
      :aria-current="modelValue === index + 1 ? 'step' : undefined"
      @click="choose(index)"
    >
      {{ title }}
    </button>
  </nav>
</template>
