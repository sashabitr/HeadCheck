import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import YesNoChoice from '@/components/YesNoChoice.vue'

describe('YesNoChoice', () => {
  it('emits update:modelValue when selecting yes/no', async () => {
    const wrapper = mount(YesNoChoice, {
      props: {
        modelValue: '',
      },
    })

    await wrapper.find('input[value="yes"]').setValue()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('yes')

    await wrapper.find('input[value="no"]').setValue()
    expect(wrapper.emitted('update:modelValue')?.[1]?.[0]).toBe('no')
  })
})
