<script setup lang="ts">
import type { CraftWork } from "../types/work";
import WorkCard from "./WorkCard.vue";
defineProps<{ works: CraftWork[] }>();
defineEmits<{ select: [CraftWork]; like: [string]; collect: [string] }>();
</script>

<template>
  <section class="masonry">
    <WorkCard v-for="work in works" :key="work.id" :work="work" @select="$emit('select', $event)" @like="$emit('like', $event)" @collect="$emit('collect', $event)" />
  </section>
</template>
