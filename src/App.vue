<template>
    <header>Virtual Sifu</header>
    <div id="main">
        <article>
            <TechniqueVideo :videoSource="randomVideo" />
        </article>
        <aside>
          <Choices :choices="avaiableAnswers" />
        </aside>
    </div>
    <footer>Wing Chun Dong Rotterdam</footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { eersteVorm } from './lib/vormen'
import TechniqueVideo from './components/TechniqueVideo.vue'
import Choices from './components/Choices.vue'

const randomVideo = ref()
const correctAnswer = ref()
const avaiableAnswers = ref()
avaiableAnswers.value = []

function getRandomTechnique(vorm: any) {
    return vorm.techniques[Math.floor(Math.random() * eersteVorm.techniques.length)]
}

correctAnswer.value = getRandomTechnique(eersteVorm)

for (let i=0; i < 5; i++) {
    let answer: any
    do {
        answer = getRandomTechnique(eersteVorm)
    } while (avaiableAnswers.value.some((el: any) => el.name === answer.name))

    avaiableAnswers.value.push(answer)
}

randomVideo.value = `${eersteVorm.location}/${correctAnswer.value.files[0]}`

let correctAnswerIndex = Math.floor(Math.random() * eersteVorm.techniques.length)
avaiableAnswers.value.splice(correctAnswerIndex, 0, correctAnswer.value)

</script>

<style scoped>
  * {
    box-sizing: border-box;
  }
  body {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
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
    height: 20vh;
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
</style>
