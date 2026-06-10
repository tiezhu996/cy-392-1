<script setup lang="ts">
import { ref } from "vue";
import { useWorkStore } from "../stores/workStore";

const store = useWorkStore();
const visible = ref(false);
const workId = ref("");
const newFolderName = ref("");
const showNewFolder = ref(false);

function open(id: string) {
  workId.value = id;
  newFolderName.value = "";
  showNewFolder.value = false;
  visible.value = true;
}

function close() {
  visible.value = false;
}

function toggleFolder(folderId: string) {
  const work = store.works.find((w) => w.id === workId.value);
  if (!work) return;
  if (work.collectionIds.includes(folderId)) {
    store.removeFromCollection(workId.value, folderId);
  } else {
    store.addToCollection(workId.value, folderId);
  }
}

function createAndAdd() {
  const name = newFolderName.value.trim();
  if (!name) return;
  const folder = store.addFolder(name);
  store.addToCollection(workId.value, folder.id);
  newFolderName.value = "";
  showNewFolder.value = false;
}

defineExpose({ open, close });
</script>

<template>
  <div v-if="visible" class="picker-mask" @click.self="close">
    <div class="picker">
      <h3>选择收藏夹</h3>
      <ul class="picker-list">
        <li v-for="folder in store.folders" :key="folder.id" class="picker-item" @click="toggleFolder(folder.id)">
          <span class="picker-check">{{ store.works.find(w => w.id === workId)?.collectionIds.includes(folder.id) ? "☑" : "☐" }}</span>
          <span>{{ folder.name }}</span>
          <button class="picker-remove" @click.stop="store.removeFolder(folder.id)">×</button>
        </li>
      </ul>
      <div v-if="!showNewFolder" class="picker-new" @click="showNewFolder = true">+ 新建收藏夹</div>
      <div v-else class="picker-new-form">
        <input v-model="newFolderName" placeholder="收藏夹名称" @keyup.enter="createAndAdd" />
        <button @click="createAndAdd">创建</button>
        <button @click="showNewFolder = false">取消</button>
      </div>
      <button class="picker-done" @click="close">完成</button>
    </div>
  </div>
</template>
