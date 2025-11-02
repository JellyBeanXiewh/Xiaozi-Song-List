<script lang="ts">
import { defineComponent } from 'vue'

interface Option {
  label: string;
  value: string | number;
}

export default defineComponent({
  name: 'CustomSelect',
  props: {
    options: {
      type: [Array as () => Array<Option>],
      required: true,
      default: () => [] as Array<Option>,
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'change', 'clear'],
  data() {
    return {
      isOpen: false,
      isSelected: false,
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    closeDropdown() {
      this.isOpen = false
    },
    selectOption(option: Option) {
      this.$emit('update:modelValue', option.value)
      this.$emit('change')
      this.closeDropdown()
    },
    clearSelection(event: Event) {
      event.stopPropagation()
      this.$emit('update:modelValue', '')
      this.$emit('change')
      this.$emit('clear')
    },
    test() {
      addEventListener('click', this.closeDropdown)
    }
  },
  computed: {
    selectedLabel() {
      const selected = this.options.find(opt => opt.value === this.modelValue)
      return selected ? selected.label : ''
    },
  },
})
</script>

<template>
  <div class="relative w-full">
    <div
      class="bg-white w-full p-2 rounded-2xl cursor-pointer transition-all duration-200 flex items-center focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
      @click="toggleDropdown"
      @blur="closeDropdown"
      tabindex="0"
    >
      <span
        :class="[selectedLabel ? '' : 'select-none text-gray-500']"
        class="flex-1 text-center p-0"
      >
          {{ selectedLabel || placeholder }}
      </span>

      <div class="flex items-center">
        <button
          v-if="clearable && selectedLabel"
          class="clear-button text-gray-400 hover:text-red-500 rounded-full cursor-pointer absolute right-3"
          title="清除"
          @click="clearSelection"
        >
          <i class="fa-regular fa-circle-xmark"></i>
        </button>

        <i
          v-else
          :class="[isOpen ? 'rotate-180' : 'rotate-none']"
          class="dropdown-arrow fas fa-regular fa-angle-down text-gray-400 duration-300 absolute right-3"
        ></i>
      </div>
    </div>

    <transition name="fade">
      <div
        v-show="isOpen"
        class="bg-white absolute top-full left-0 right-0 z-50 mt-1 border rounded-2xl shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="(option, index) in options"
          :key="index"
          :class="[modelValue === option.value ? 'bg-fuchsia-600 text-white' : 'hover:bg-gray-100']"
          class="p-2 cursor-pointer transition-all duration-200 border-b border-gray-50 last:border-b-0'"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>

        <div
          v-if="options.length === 0"
          class="p-2 text-gray-500 text-center"
        >
          无选项
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.clear-button {
  transition: all 0.3s ease;
}

.dropdown-arrow {
  transition: all 0.3s ease;
}

.selected-option {
  transition: all 0.3s ease;
}
</style>