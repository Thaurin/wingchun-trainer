<template>
    <div>
        <h1 class="choices-header">What is this technique called?</h1>
        <div class="choices">
            <ol>
                <li v-for="(item, index) in props.choices" :key="index" :class="hightlightClassObject(item)">
                    <a href="#" @click="emit('choiceClicked', item)">{{ item.name }}</a>
                </li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['choiceClicked'])
const props = defineProps({
    choices: {
        type: Array,
        required: true
    },
    correctAnswer: {
        type: Object,
        required: true
    },    
    hasAnswered: {
        type: Boolean,
        default: false
    },
    hasAnsweredCorrectly: {
        type: Boolean,
        default: false
    }
})

const hightlightClassObject = (item: Object) => {
    return {
        'true': item.name === props.correctAnswer.name && props.hasAnswered && props.hasAnsweredCorrectly,
        'false': item.name === props.correctAnswer.name && props.hasAnswered && !props.hasAnsweredCorrectly
    }
}
</script>

<style scoped>
.choices-header {
    font-size: 1.7em;
}
.choices > ol > li > a {
    color: black;
    font-size: 1.5em;
    text-decoration: none;
}
.choices > ol > li > a:visited, .choices > ol > li > a:hover {
    color: black;
}
.choices > ol > li > a:active {
    color: #eee;
}
.choices > ol > li > a:hover {
    background-color: #bbb;
}
.false {
    background-color: red;
}
.true {
    background-color: lime;
}
</style>
