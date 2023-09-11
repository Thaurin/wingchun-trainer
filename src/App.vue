<template>
<!DOCTYPE html>
    <header>Virtual Sifu</header>
    <div id="main">
        <article>
            <div class="score">
                Correct: {{ correctCount }} | False: {{ falseCount }}
            </div>
            <TechniqueVideo :videoSource="randomVideo" />
        </article>
        <aside>
        <Choices @choiceClicked="choiceClicked" :choices="avaiableAnswers" :correctAnswer="correctAnswer" :hasAnswered="hasAnswered" :hasAnsweredCorrectly="hasAnsweredCorrectly" />
        <div v-if="statusMessage" :class="{ status: true, 'status-false': !hasAnsweredCorrectly, 'status-correct': hasAnsweredCorrectly }">
            {{ statusMessage }}
        </div>
        </aside>
    </div>
    <footer>Wing Chun Dong Rotterdam</footer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { eersteVorm } from './lib/vormen'
import TechniqueVideo from './components/TechniqueVideo.vue'
import Choices from './components/Choices.vue'

const correctCount = ref(0)
const falseCount = ref(0)
const randomVideo = ref('')
const correctAnswer = ref({})
const hasAnswered = ref()
const hasAnsweredCorrectly = ref()
const avaiableAnswers = ref()
const statusMessage = ref()
avaiableAnswers.value = []

function getRandomTechnique(vorm: any) {
    return vorm.techniques[Math.floor(Math.random() * eersteVorm.techniques.length)]
}

function loadVideo() {
    correctAnswer.value = getRandomTechnique(eersteVorm)
    avaiableAnswers.value = []

    for (let i=0; i < 5; i++) {
        let answer: any
        do {
            answer = getRandomTechnique(eersteVorm)
        } while (avaiableAnswers.value.some((el: any) => el.name === answer.name) || correctAnswer.value.name === answer.name)

        avaiableAnswers.value.push(answer)
    }

    randomVideo.value = `${eersteVorm.location}/${correctAnswer.value.files[0]}`

    let correctAnswerIndex = Math.floor(Math.random() * eersteVorm.techniques.length)
    avaiableAnswers.value.splice(correctAnswerIndex, 0, correctAnswer.value)
}

onMounted(() => {
    loadVideo()
})

function choiceClicked(item: any) {
    hasAnswered.value = true
    hasAnsweredCorrectly.value = item.name === correctAnswer.value.name
    statusMessage.value = item.name === correctAnswer.value.name ? 'Correct!' : 'False'

    if (hasAnsweredCorrectly.value) {
        correctCount.value++
    } else {
        falseCount.value++
    }

    setTimeout(() => {
        hasAnswered.value = false
        statusMessage.value = ''
        loadVideo()
    }, 2000)
}
</script>

<style>
  * {
    box-sizing: border-box;
  }
  html {
    padding: 0;
    margin: 0;
  }
  body {
    display: flex;
    min-height: 50vh;
    flex-direction: column;
    padding: 0;
    margin: 0;
  }
  #main {
    display: flex;
    flex: 1;
  }
  #main > article {
    flex: 1;
    order: 1;
  }
  #main > aside {
    flex: 0 0 20vw;
  }
  #main > aside {
    background: lightgray;
    order: 2;
  }
  header, footer {
    background: #FFC20E;
    height: 10vh;
    padding: 0.5em !important;
    margin: 0;
  }
  footer {
    height: 10vh;
  }
  header {
    font-size: 3em;
    font-weight: bold;
  }
  header, footer, article, aside {
    padding: 1em;
  }
  article {
    text-align: center;
  }

  .score {
    font-size: 2em;
    padding-bottom: 0.5em;
  }

  .status {
    font-size: 2em;
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
</style>
