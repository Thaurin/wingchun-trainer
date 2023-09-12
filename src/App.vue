<template>
<!DOCTYPE html>
    <header>Virtual Sifu</header>
    <div id="main">
        <article>
            <div class="vormSelector">
                <input type="checkbox" :checked="eersteVormChecked" @change="eersteCheckboxClicked"> Siu Lim Tao |
                <input type="checkbox" :checked="tweedeVormChecked" @change="tweedeCheckboxClicked"> Cham Kiu
            </div>
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
            <TechniqueVideo :videoSource="correctAnswer.file" />
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
import { eersteVorm, tweedeVorm } from './lib/vormen'
import TechniqueVideo from './components/TechniqueVideo.vue'
import Choices from './components/Choices.vue'

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

    let correctAnswerIndex = Math.floor(Math.random() * randomizedVormen.value.length)
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
