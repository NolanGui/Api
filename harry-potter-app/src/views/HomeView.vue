<template>
<h1>Devine la Maison de l'Élève</h1>
<p v-if="streak > 0">Streak actuel : {{ streak }}</p>
<p v-if="gameOver" class="game-over">Game Over ! Streak final : {{ streak }}</p>

<div v-if="!gameOver && !showLibrary">
  <h2>{{ currentCharacter.name }}</h2>
  <img :src="currentCharacter.image || 'https://via.placeholder.com/150'" :alt="currentCharacter.name" width="150" />

  <div>
    <button v-for="house in houses" :key="house.name" @click="checkAnswer(house.name)">
      {{ house.label }}
    </button>
  </div>
</div>

<button v-if="gameOver" @click="restartGame">Rejouer</button>

<div v-if="showLibrary">
  <h2>Bibliothèque des Personnages</h2>
  <div class="character-list">
    <div v-for="character in allCharacters" :key="character.name" class="character-card">
      <img :src="character.image || 'https://via.placeholder.com/150'" :alt="character.name" width="100" />
      <p>{{ character.name }} - {{ character.house || 'Maison inconnue' }}</p>
    </div>
  </div>
</div>
    
</template>
