<template>
    <nav class="navbar">
        <router-link to="/wingchun">Home</router-link>
        <router-link to="/wingchun/Quiz">Quiz</router-link>
        <router-link to="/wingchun/Motor">Motoriek</router-link>
    </nav>
    <div class="row">
        <router-view />
    </div>
</template>
