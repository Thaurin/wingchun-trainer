<template>
    <div>
        <h1 class="choices-header">What is this technique called?</h1>
        <div class="choices">
            <ol>
                <li v-for="(item, index) in props.choices" :key="index" :class="hightlightClassObject(item)">
                    <a href="#" @click="emit('choiceClicked', item)">{{ (item as any).name }}</a>
                </li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'

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

const hightlightClassObject = (item: any) => {
    return {
        // @ts-ignore
        'true': item.name === props.correctAnswer.name && props.hasAnswered && props.hasAnsweredCorrectly,
        // @ts-ignore
        'false': item.name === props.correctAnswer.name && props.hasAnswered && !props.hasAnsweredCorrectly
    }
}

const { Digit1, Digit2, Digit3, Digit4, Digit5, Digit6 } = useMagicKeys()
// @ts-ignore
watch([Digit1, Digit2, Digit3, Digit4, Digit5, Digit6], (v) => {
    if (Digit1.value) emit('choiceClicked', props.choices[0])
    else if (Digit2.value) emit('choiceClicked', props.choices[1])
    else if (Digit3.value) emit('choiceClicked', props.choices[2])
    else if (Digit4.value) emit('choiceClicked', props.choices[3])
    else if (Digit5.value) emit('choiceClicked', props.choices[4])
    else if (Digit6.value) emit('choiceClicked', props.choices[5])
})
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
.false > a {
    color: white !important;
}
.true {
    background-color: lime;
}
</style>
