<template>
<!DOCTYPE html>
    <header>Virtual Sifu</header>
    <div id="main">
        <article>
            <div class="score">
                Technique {{ currentTechnique + 1 }} / {{ randomizedVormen.length }}
                <br>
                <div v-if="!gameFinished">
                    Correct: {{ correctCount }} | False: {{ falseCount }}
                </div>
                <div v-else>
                    Out of {{ randomizedVormen.length }}, you had {{ correctCount }} right. That is {{ Math.round(correctCount / randomizedVormen.length * 100) }}%!
                    <button @click="resetGame">Play again</button>
                </div>
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
import { onMounted, ref, computed } from 'vue'
import { eersteVorm } from './lib/vormen'
import TechniqueVideo from './components/TechniqueVideo.vue'
import Choices from './components/Choices.vue'

const currentTechnique = ref(0)
const correctCount = ref(0)
const falseCount = ref(0)
const gameFinished = ref(false)
const randomVideo = ref('')
const correctAnswer = ref({})
const hasAnswered = ref()
const hasAnsweredCorrectly = ref()
const avaiableAnswers = ref()
const statusMessage = ref()
avaiableAnswers.value = []

const randomizedVormen = computed(() => {
    let vormen: any[] = [...eersteVorm.value.techniques]
    for (let i=0; i < vormen.length; i++) {
        const newIndex = Math.floor(Math.random() * eersteVorm.value.techniques.length)
        const temp = vormen[i]
        vormen[i] = vormen[newIndex]
        vormen[newIndex] = temp
    }
    return vormen
})

function getRandomTechnique(vorm: any) {
    return vorm.techniques[Math.floor(Math.random() * eersteVorm.value.techniques.length)]
}

function loadVideo() {
    correctAnswer.value = randomizedVormen.value[currentTechnique.value]
    avaiableAnswers.value = []

    for (let i=0; i < 5; i++) {
        let answer: any
        do {
            answer = getRandomTechnique(eersteVorm.value)
        } while (avaiableAnswers.value.some((el: any) => el.name === answer.name) || correctAnswer.value.name === answer.name)

        avaiableAnswers.value.push(answer)
    }

    randomVideo.value = `${eersteVorm.value.location}/${correctAnswer.value.files[0]}`

    let correctAnswerIndex = Math.floor(Math.random() * eersteVorm.value.techniques.length)
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
