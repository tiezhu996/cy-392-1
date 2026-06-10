<script setup lang="ts">
import { ref } from "vue";
import type { CraftWork } from "../types/work";
import LazyImage from "./LazyImage.vue";
import CollectionPicker from "./CollectionPicker.vue";

defineProps<{ work: CraftWork }>();
defineEmits<{ select: [CraftWork]; like: [string] }>();

const picker = ref<InstanceType<typeof CollectionPicker> | null>(null);

function openPicker(workId: string) {
  picker.value?.open(workId);
}
</script>

<template>
  <article class="work-card">
    <LazyImage :src="work.images[0]" :alt="work.title" @click="$emit('select', work)" />
    <div class="card-body">
      <h3>{{ work.title }}</h3>
      <p>{{ work.description }}</p>
      <div class="meta"><span>{{ work.difficulty }}</span><span>{{ work.durationHours }} 小时</span></div>
      <div class="actions">
        <button @click="$emit('like', work.id)">赞 {{ work.likes }}</button>
        <button @click="openPicker(work.id)">{{ work.collectionIds.length ? `已收藏(${work.collectionIds.length})` : "收藏" }}</button>
      </div>
    </div>
    <CollectionPicker ref="picker" />
  </article>
</template>
