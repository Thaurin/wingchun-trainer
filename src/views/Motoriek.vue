<template>
  <div class="static-view">
    <iframe
      ref="iframeRef"
      :src="staticUrl"
      frameborder="0"
      style="width: 100%; height: 100%; border: none;"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const iframeRef = ref<HTMLIFrameElement | null>(null)
const staticUrl = 'motoriek.html'

onMounted(() => {
  iframeRef.value?.focus()
});

</script>

<style>
.static-view {
  width: 100%;
  height: 100vh; /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
