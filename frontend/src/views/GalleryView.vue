<script setup lang="ts">
import { onMounted } from "vue";
import FilterBar from "../components/FilterBar.vue";
import MasonryGrid from "../components/MasonryGrid.vue";
import UploadPanel from "../components/UploadPanel.vue";
import WorkDetail from "../components/WorkDetail.vue";
import { useWorkStore } from "../stores/workStore";
const store = useWorkStore();
onMounted(store.hydrate);
function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}
</script>

<template>
  <main class="page">
    <header class="hero"><div><h1>手工作品瀑布流展示墙</h1><p>上传、收藏并探索每一件有温度的手作。</p></div><button @click="toggleTheme">切换主题</button></header>
    <UploadPanel />
    <FilterBar />
    <MasonryGrid :works="store.displayed" @select="store.selected = $event" @like="store.like" />
    <WorkDetail :work="store.selected" @close="store.selected = null" @follow="store.follow" />
  </main>
</template>
