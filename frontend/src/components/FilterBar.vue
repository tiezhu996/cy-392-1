<script setup lang="ts">
import { CRAFT_TYPES, DIFFICULTIES } from "../constants/craft";
import { useWorkStore } from "../stores/workStore";
const store = useWorkStore();
</script>

<template>
  <section class="filters">
    <input v-model="store.filter.keyword" placeholder="搜索作品名称或描述" />
    <select v-model="store.filter.type"><option v-for="item in CRAFT_TYPES" :key="item.value" :value="item.value">{{ item.label }}</option></select>
    <select v-model="store.filter.difficulty"><option v-for="item in DIFFICULTIES" :key="item.value" :value="item.value">{{ item.label }}</option></select>
    <select v-model="store.filter.sort"><option value="latest">最新</option><option value="hot">最热</option></select>
    <select v-model="store.filter.collectionFolder">
      <option value="all">全部收藏</option>
      <option value="collected">已收藏</option>
      <option value="uncollected">未收藏</option>
      <option v-for="folder in store.folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
    </select>
  </section>
</template>
