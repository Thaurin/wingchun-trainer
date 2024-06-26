<template>
    <div class="row">
        <div class="main">
            <TechniqueVideo :videoSource="correctAnswer.file" />

            <div class="video-status">
                <input type="checkbox" :checked="eersteVormChecked" @change="eersteCheckboxClicked"> Siu Lim Tao |
                <input type="checkbox" :checked="tweedeVormChecked" @change="tweedeCheckboxClicked"> Cham Kiu
                <br>
                {{ currentTechnique + 1 }} / {{ randomizedVormen.length }} |
                Correct: {{ correctCount }} | False: {{ falseCount }}

                <div v-if="gameFinished">
                    <span class="game-ended-message">
                      <br>
                      Score: {{ Math.round(correctCount / randomizedVormen.length * 100) }}%&nbsp;
                      <button class="reset-button" @click="resetGame">Play again</button>
                    </span>
                </div>
            </div>
        </div>
        <div class="side">
            <Choices @choiceClicked="choiceClicked" :choices="avaiableAnswers" :correctAnswer="correctAnswer" :hasAnswered="hasAnswered" :hasAnsweredCorrectly="hasAnsweredCorrectly" />

            <div v-if="statusMessage" :class="{ status: true, 'status-false': !hasAnsweredCorrectly, 'status-correct': hasAnsweredCorrectly }">
                {{ statusMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { supabase } from './lib/supabaseClient'
import { eersteVorm, tweedeVorm } from './lib/vormen'
import TechniqueVideo from './components/TechniqueVideo.vue'
import Choices from './components/Choices.vue'

async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })

  console.log(data, error)
}

signInWithGithub()

const eersteVormChecked = ref(true)
const tweedeVormChecked = ref(true)
const currentTechnique = ref(0)
const correctCount = ref(0)
const falseCount = ref(0)
const gameFinished = ref(false)
const correctAnswer = ref({ name: '', file: ''})
const hasAnswered = ref()
const hasAnsweredCorrectly = ref()
const avaiableAnswers = ref()
const statusMessage = ref()
avaiableAnswers.value = []

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

const randomizedVormen = computed(() => {
    let techniqueList: any[] = []

    if (eersteVormChecked.value) {
        const eersteVormFixed = eersteVorm.value.techniques.map(item => ({
            name: item.name,
            file: `${eersteVorm.value.location}/${item.files[0]}`
        }))
        techniqueList = techniqueList.concat(eersteVormFixed)
    }

    if (tweedeVormChecked.value) {
        const tweedeVormFixed = tweedeVorm.value.techniques.map(item => ({
            name: item.name,
            file: `${tweedeVorm.value.location}/${item.files[0]}`
        }))
        techniqueList = techniqueList.concat(tweedeVormFixed)
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

    for (let i=0; i < 5; i++) {
        let answer: any
        do {
            answer = getRandomTechnique(randomizedVormen.value)
        } while (avaiableAnswers.value.some((el: any) => el.name === answer.name) || correctAnswer.value.name === answer.name)

        avaiableAnswers.value.push(answer)
    }

    let correctAnswerIndex = Math.floor(Math.random() * avaiableAnswers.value.length)
    avaiableAnswers.value.splice(correctAnswerIndex, 0, correctAnswer.value)
}

onMounted(() => {
    loadVideo()
})

function choiceClicked(item: any) {
    if (gameFinished.value || hasAnswered.value) {
        return
    }

    hasAnswered.value = true
    hasAnsweredCorrectly.value = item.name === correctAnswer.value.name
    statusMessage.value = item.name === correctAnswer.value.name ? 'Correct!' : 'False'

    if (hasAnsweredCorrectly.value) {
        correctCount.value++
    } else {
        falseCount.value++
    }

    if (currentTechnique.value + 1 < randomizedVormen.value.length) {
        setTimeout(() => {
            currentTechnique.value++
            hasAnswered.value = false
            statusMessage.value = ''
            loadVideo()
        }, 2000)
    }
    else {
        gameFinished.value = true
    }
}

function resetGame() {
    currentTechnique.value = 0
    correctCount.value = falseCount.value = 0
    gameFinished.value = false
    hasAnswered.value = false
    statusMessage.value = ''
    loadVideo()
}
</script>

<style>
  .video-status {

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
