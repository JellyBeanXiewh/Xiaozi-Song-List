import { Ref, watchEffect } from 'vue'

export function useTitle(title: Ref<string, string>) {
  watchEffect(() => {
    document.title = title.value
  })
}