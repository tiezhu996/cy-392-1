<script setup lang="ts">
import type { CraftWork } from "../types/work";
defineProps<{ work: CraftWork | null }>();
defineEmits<{ close: []; follow: [string] }>();
</script>

<template>
  <div v-if="work" class="detail-mask" @click.self="$emit('close')">
    <section class="detail">
      <button class="close" @click="$emit('close')">×</button>
      <div class="carousel"><img v-for="img in work.images" :key="img" :src="img" :alt="work.title" /></div>
      <h2>{{ work.title }}</h2>
      <p>{{ work.description }}</p>
      <h3>材料清单</h3><ul><li v-for="m in work.materials" :key="m">{{ m }}</li></ul>
      <h3>制作步骤</h3><ol><li v-for="step in work.steps" :key="step">{{ step }}</li></ol>
      <footer><strong>{{ work.author.name }}</strong><span>{{ work.author.bio }}</span><button @click="$emit('follow', work.author.id)">{{ work.author.followed ? "已关注" : "关注作者" }}</button></footer>
    </section>
  </div>
</template>
