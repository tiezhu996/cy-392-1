import { onBeforeUnmount, onMounted, ref } from "vue";

export function useLazyImage(src: string) {
  const el = ref<HTMLImageElement>();
  const visibleSrc = ref("");
  let observer: IntersectionObserver | undefined;
  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        visibleSrc.value = src;
        observer?.disconnect();
      }
    });
    if (el.value) observer.observe(el.value);
  });
  onBeforeUnmount(() => observer?.disconnect());
  return { el, visibleSrc };
}
