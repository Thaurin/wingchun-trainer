<template>
  <div class="static-view">
    <iframe
      :src="staticUrl"
      frameborder="0"
      style="width: 100%; height: 100%; border: none;"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StaticView',
  data() {
    return {
      staticUrl: '/wingchun/motoriek.html', // Replace with your desired URL
    };
  },
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
