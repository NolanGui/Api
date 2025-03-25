<template>
    <div class="game-container">  
      <h1>Devine la Maison de l'Élève</h1>
      <p v-if="streak > 0">Streak actuel : {{ streak }}</p>
      <p v-if="gameOver" class="game-over">Game Over ! Streak final : {{ streak }}</p>
  
      <div v-if="!gameOver && !showLibrary" class="game-area">
        <h2>{{ currentCharacter.name }}</h2>
        <img 
          :src="currentCharacter.image || placeholderImage" 
          :alt="currentCharacter.name" 
          width="150" 
          class="character-image"
        />
  
        <div class="houses-buttons">
          <button 
            v-for="house in houses" 
            :key="house.name" 
            @click="checkAnswer(house.name)"
            class="house-button"
            :class="house.name.toLowerCase()"
          >
            {{ house.label }}
          </button>
        </div>
      </div>
  
      <button v-if="gameOver" @click="restartGame" class="restart-button">Rejouer</button>
  
      <div v-if="showLibrary" class="library">
        <h2>Bibliothèque des Personnages</h2>
        <div class="character-list">
          <div v-for="character in allCharacters" :key="character.id" class="character-card">
            <img 
              :src="character.image || placeholderImage" 
              :alt="character.name" 
              width="100" 
              class="character-thumbnail"
            />
            <p>{{ character.name }} - {{ character.house || 'Maison inconnue' }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import placeholderImage from '@/assets/images/placeholder.jpg';
  
  export default {
    name: 'HomeView',
    setup() {
      const router = useRouter();
      const characters = ref([]);
      const allCharacters = ref([]);
      const currentCharacter = ref({});
      const streak = ref(0);
      const gameOver = ref(false);
      const showLibrary = ref(false);
      const gameHistory = ref(JSON.parse(localStorage.getItem('hpGameHistory')) || []);
  
      const houses = [
        { name: "Gryffindor", label: "Gryffondor" },
        { name: "Hufflepuff", label: "Poufsouffle" },
        { name: "Ravenclaw", label: "Serdaigle" },
        { name: "Slytherin", label: "Serpentard" }
      ];
  
      const fetchCharacters = async () => {
        try {
          const studentResponse = await fetch('https://hp-api.onrender.com/api/characters/students');
          characters.value = (await studentResponse.json())
            .filter(c => c.house && c.image)
            .map((c, index) => ({ ...c, id: index })); // Ajout d'un ID unique
          
          const allResponse = await fetch('https://hp-api.onrender.com/api/characters');
          allCharacters.value = (await allResponse.json()).map((c, index) => ({ ...c, id: index }));
  
          pickRandomCharacter();
        } catch (error) {
          console.error('Erreur lors du chargement des élèves :', error);
        }
      };
  
      const pickRandomCharacter = () => {
        if (characters.value.length > 0) {
          const availableCharacters = characters.value.filter(c => c.id !== currentCharacter.value.id);
          currentCharacter.value = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
        }
      };
  
      const checkAnswer = (selectedHouse) => {
        if (selectedHouse === currentCharacter.value.house) {
          streak.value++;
          pickRandomCharacter();
        } else {
          gameOver.value = true;
          addToHistory();
        }
      };
  
      const addToHistory = () => {
        const newEntry = {
          date: new Date().toISOString(),
          streak: streak.value,
          character: currentCharacter.value.name,
          house: currentCharacter.value.house
        };
        
        gameHistory.value.unshift(newEntry);
        if (gameHistory.value.length > 20) {
          gameHistory.value = gameHistory.value.slice(0, 20);
        }
        
        localStorage.setItem('hpGameHistory', JSON.stringify(gameHistory.value));
      };
  
      const restartGame = () => {
        streak.value = 0;
        gameOver.value = false;
        pickRandomCharacter();
      };
  
      const goToHistory = () => {
        router.push({
          path: '/history',
          state: { gameHistory: gameHistory.value }
        });
      };
  
      onMounted(fetchCharacters);
  
      return { 
        currentCharacter, 
        houses, 
        checkAnswer, 
        streak, 
        gameOver, 
        restartGame, 
        showLibrary, 
        allCharacters,
        gameHistory,
        placeholderImage,
        goToHistory
      };
    }
  };
  </script>
  
  <style scoped>
  .game-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .nav-buttons {
    margin-bottom: 30px;
  }
  
  .library-button, .history-button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    color: white;
    transition: all 0.3s;
  }
  
  .library-button {
    background-color: #4CAF50;
  }
  
  .library-button:hover {
    background-color: #3e8e41;
  }
  
  .history-button {
    background-color: #3498db;
    text-decoration: none;
    display: inline-block;
  }
  
  .history-button:hover {
    background-color: #2980b9;
  }
  
  .game-over {
    color: red;
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
  }
  
  .game-area {
    margin: 30px 0;
  }
  
  .character-image {
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .houses-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
  }
  
  .house-button {
    padding: 12px 25px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    color: white;
  }
  
  .house-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .gryffindor {
    background-color: #ae0001;
  }
  
  .hufflepuff {
    background-color: #ffdb00;
    color: #000;
  }
  
  .ravenclaw {
    background-color: #222f5b;
  }
  
  .slytherin {
    background-color: #2a623d;
  }
  
  .restart-button {
    padding: 12px 30px;
    font-size: 16px;
    background-color: #f39c12;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
  }
  
  .restart-button:hover {
    background-color: #e67e22;
  }
  
  .library {
    margin-top: 30px;
  }
  
  .character-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .character-card {
    background: white;
    border-radius: 10px;
    padding: 15px;
    width: 150px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }
  
  .character-card:hover {
    transform: scale(1.05);
  }
  
  .character-thumbnail {
    border-radius: 5px;
    margin-bottom: 10px;
  }
  </style>