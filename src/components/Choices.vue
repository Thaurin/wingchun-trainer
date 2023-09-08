<template>
    <h1 class="choices-header">What is this technique called?</h1>
    <div class="choices">
        <ol>
            <li v-for="(item, index) in props.choices" :key="index">
                <a href="#" @click="emit('choiceClicked', item)">{{ item.name }}</a>
            </li>
        </ol>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['choiceClicked'])
const props = defineProps({
    choices: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
.choices-header {
    font-size: 1.7em;
}

.choices {
    font-size: 1.5em;
}
</style>
