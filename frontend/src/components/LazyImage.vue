<script setup lang="ts">
import { useLazyImage } from "../composables/useLazyImage";
const props = defineProps<{ src: string; alt: string }>();
const { el, visibleSrc } = useLazyImage(props.src);
</script>

<template>
  <img ref="el" class="lazy-image" :src="visibleSrc || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22/%3E'" :alt="alt" />
</template>
