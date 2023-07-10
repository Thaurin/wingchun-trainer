<template>
    <div>
        <ul>
            <li v-for="choice in props.choices">
                {{ choice.name }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">


const props = defineProps({
    choices: {
        type: Array,
        required: true
    }
})

</script>

<style scoped>
</style>
