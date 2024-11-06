<template>
    <div>
        <video ref="video" id="technique-video" style="width: 100%" autoplay muted playsinline @ended="videoEnded">
            <source :src="props.videoSource" type="video/mp4">
        </video>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const video = ref(null)
const props = defineProps({
    videoSource: {
        type: String,
        required: trueTTT
    }
})

// @ts-ignore
watch(() => props.videoSource, (videoUrl) => {
    // @ts-ignore
    video.value.load()
    // @ts-ignore
    video.value.play()
});

function videoEnded() {
    // @ts-ignore
    setTimeout(() => { video.value.play() }, 1500)
}
</script>

<style scoped>
</style>
