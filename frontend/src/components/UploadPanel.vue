<script setup lang="ts">
import { ref } from "vue";
import { useWorkStore } from "../stores/workStore";
import type { CraftWork } from "../types/work";
const store = useWorkStore();
const title = ref("我的新作品");
const material = ref("棉线,木片");
function add() {
  const work: CraftWork = { id: crypto.randomUUID(), title: title.value, type: "other", difficulty: "beginner", materials: material.value.split(",").map((i) => i.trim()), durationHours: 3, images: [`https://picsum.photos/seed/${Date.now()}/520/760`], description: "通过上传面板添加的手工作品示例。", steps: ["整理材料", "制作主体", "完成装饰"], author: { id: "me", name: "我的工作台", bio: "记录自己的手作过程。", followed: false }, likes: 0, collectionIds: [], createdAt: new Date().toISOString() };
  store.addWork(work);
}
</script>

<template>
  <section class="upload">
    <input v-model="title" />
    <input v-model="material" />
    <button @click="add">上传作品示例</button>
  </section>
</template>
