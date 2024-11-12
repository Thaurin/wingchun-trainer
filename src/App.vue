<template>
    <div class="row">
        <div class="main">
            <TechniqueVideo :videoSource="correctAnswer.file" />

            <div class="video-status">
                <label>
                    <input type="checkbox" :checked="eersteVormChecked" @change="eersteCheckboxClicked">
                    Siu Lim Tao
                </label>
                <label style="margin-left: 1em">
                    <input type="checkbox" :checked="tweedeVormChecked" @change="tweedeCheckboxClicked">
                    Cham Kiu
                </label>
                <br>
                <label>
                    <input type="checkbox" :checked="multipleChoice" @change="multipleChoiceClicked">
                    Multiple choice
                </label>

                <div style="font-weight: bold; font-size: 1.2em; margin-top: 0.5em">
                    {{ currentTechnique + 1 }} / {{ randomizedVormen.length }} |
                    Correct: {{ correctCount }} | Wrong: {{ falseList.length }}
                </div>

                <div v-if="gameFinished">
                    <span class="game-ended-message">
                      <br>
                      Score: {{ Math.round(correctCount / randomizedVormen.length * 100) }}%&nbsp;
                      <button class="reset-button" @click="resetGame(false)">Play again</button>
                    </span>
                </div>
            </div>
        </div>
        <div class="side">
            <div v-if="multipleChoice">
                <Choices @choiceClicked="choiceClicked" :choices="avaiableAnswers" :correctAnswer="correctAnswer" :hasAnswered="hasAnswered" :hasAnsweredCorrectly="hasAnsweredCorrectly" />
            </div>
            <div v-else>
                <div style="padding: 1em">
                    <input ref="answerTextRef" type="text" v-model="typedAnswer" id="answer_text" @keypress="answerEntered" style="font-size: 1.3em; width: 20em; height: 2em">
                </div>
            </div>

            <div v-if="statusMessage" :class="{ status: true, 'status-false': !hasAnsweredCorrectly, 'status-correct': hasAnsweredCorrectly }">
                {{ statusMessage }}
                <br>
                <span style="font-size: 0.7em">{{ statusSubMessage }}</span>
            </div>

            <div class="false-list">
                <h2>Wrong answers:</h2>
                <span v-if="falseList.length === 0">None so far!</span>
                <ul>
                    <li v-for="(item, index) in falseList" :key="index">
                        {{ item.name }}
                    </li>
                </ul>
                <button class="falselist-button" @click="resetGame(true)" :disabled="falseList.length == 0">Practive wrong answers</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import { eersteVorm, tweedeVorm } from './lib/vormen'
import TechniqueVideo from './components/TechniqueVideo.vue'
import Choices from './components/Choices.vue'

const multipleChoice = ref(false)
const typedAnswer = ref()
const eersteVormChecked = ref(true)
const tweedeVormChecked = ref(true)
const practiceFalseList = ref(false)
const currentTechnique = ref(0)
const correctCount = ref(0)
const falseList = ref()
const gameFinished = ref(false)
const correctAnswer = ref({ name: '', file: ''})
const hasAnswered = ref()
const hasAnsweredCorrectly = ref()
const avaiableAnswers = ref()
const statusMessage = ref()
const statusSubMessage = ref()
avaiableAnswers.value = []
falseList.value = []
const answerTextRef = ref()

function eersteCheckboxClicked(event: any) {
    eersteVormChecked.value = event.target.checked
    if (!eersteVormChecked.value) {
        tweedeVormChecked.value = true
    }
    resetGame()
}

function tweedeCheckboxClicked(event: any) {
    tweedeVormChecked.value = event.target.checked
    if (!tweedeVormChecked.value) {
        eersteVormChecked.value = true
    }
    resetGame()
}

function multipleChoiceClicked(event: any) {
    multipleChoice.value = event.target.checked
    if (!multipleChoice.value) {
        nextTick(() => {
            answerTextRef.value.focus()
        })
    }
}

const randomizedVormen = computed(() => {
    let techniqueList: any[] = []

    if (!practiceFalseList.value) {
        if (eersteVormChecked.value) {
            const eersteVormFixed = eersteVorm.value.techniques.map(item => ({
                name: item.name,
                //file: `${eersteVorm.value.location}/${item.files[0]}`
                file: item.files[0]
            }))
            techniqueList = techniqueList.concat(eersteVormFixed)
        }

        if (tweedeVormChecked.value) {
            const tweedeVormFixed = tweedeVorm.value.techniques.map(item => ({
                name: item.name,
                //file: `${tweedeVorm.value.location}/${item.files[0]}`
                file: item.files[0]
            }))
            techniqueList = techniqueList.concat(tweedeVormFixed)
        }
    }
    else {
        techniqueList = structuredClone(falseList.value);
    }

    for (let i=0; i < techniqueList.length; i++) {
        const newIndex = Math.floor(Math.random() * techniqueList.length)
        const temp = techniqueList[i]
        techniqueList[i] = techniqueList[newIndex]
        techniqueList[newIndex] = temp
    }
    return techniqueList
})

function getRandomTechnique(techniqueList: any) {
    return techniqueList[Math.floor(Math.random() * techniqueList.length)]
}

function loadVideo() {
    correctAnswer.value = randomizedVormen.value[currentTechnique.value]
    avaiableAnswers.value = []
    typedAnswer.value = ''

    for (let i=0; i < 5; i++) {
        let answer: any
        do {
            answer = getRandomTechnique(randomizedVormen.value)
        } while (avaiableAnswers.value.some((el: any) => el.name === answer.name) || correctAnswer.value.name === answer.name)

        avaiableAnswers.value.push(answer)
    }

    let correctAnswerIndex = Math.floor(Math.random() * avaiableAnswers.value.length)
    avaiableAnswers.value.splice(correctAnswerIndex, 0, correctAnswer.value)

    if (!multipleChoice.value) {
        answerTextRef.value.focus()
    }
}

onMounted(() => {
    if (!multipleChoice.value) {
        answerTextRef.value.focus()
    }
    loadVideo()
})

function choiceClicked(item: any) {
    if (gameFinished.value || hasAnswered.value) {
        return
    }

    hasAnsweredCorrectly.value = item.name === correctAnswer.value.name
    handleAnswer(hasAnsweredCorrectly.value)
}

function answerEntered(event: any) {
    if (event.keyCode !== 13 || gameFinished.value || hasAnswered.value) {
        return
    }

    answerTextRef.value.blur()
    let answer = typedAnswer.value.trim().toLowerCase()
    if (answer === '') {
        typedAnswer.value = ''
        return
    }

    hasAnsweredCorrectly.value = answer === correctAnswer.value.name.toLowerCase()
    handleAnswer(hasAnsweredCorrectly.value)
}

function handleAnswer(isCorrect: Boolean) {
    hasAnswered.value = true
    statusMessage.value = isCorrect ? 'Correct!' : 'False'
    statusSubMessage.value = isCorrect ? '' : `Correct answer: ${correctAnswer.value.name}`

    if (isCorrect) {
        correctCount.value++
    } else {
        falseList.value.push(correctAnswer.value)
    }

    if (currentTechnique.value + 1 < randomizedVormen.value.length) {
        setTimeout(() => {
            currentTechnique.value++
            hasAnswered.value = false
            statusMessage.value = statusSubMessage.value = ''
            loadVideo()
        }, 2000)
    }
    else {
        gameFinished.value = true
    }
}

function resetGame(practiceWrongAnswers = false) {
    currentTechnique.value = 0
    correctCount.value = 0
    falseList.value = []
    practiceFalseList.value = practiceWrongAnswers
    gameFinished.value = false
    hasAnswered.value = false
    statusMessage.value = ''
    loadVideo()
}
</script>

<style>
  .video-status {

  }

  .false-list {
    margin-left: 1em;
  }

  .status {
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    padding: 0.5em;
  }
  .status-correct {
    color: black;
    background-color: lime;
  }
  .status-false {
    color: white;
    background-color: red;
  }

  .game-ended-message {
    font-weight: bold;
    white-space: nowrap;
  }

  .reset-button {
    border: 0;
    outline: 0;
    cursor: pointer;
    color: rgb(60, 66, 87);
    background-color: rgb(255, 255, 255);
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    display: inline-block;
    min-height: 28px;
    transition: background-color .24s,box-shadow .24s;
    :hover {
        box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px, rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 8%) 0px 3px 9px 0px, rgb(60 66 87 / 8%) 0px 2px 5px 0px;
    }
  }
</style>
