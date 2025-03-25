<template>
  <div>
    <div class="nav-buttons">
      <button class="library-button" @click="showLibrary = !showLibrary">
        {{ showLibrary ? 'Revenir au jeu' : 'Bibliothèque des Personnages' }}
      </button>
      <button class="history-button" @click="goToHistory">Voir l'historique</button>
    </div>
      <router-view/>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
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

    const goToHistory = () => {
      router.push({
        path: '/history',
        state: { gameHistory: gameHistory.value }
      });
    };

    const fetchCharacters = async () => {
      try {
        const studentResponse = await fetch('https://hp-api.onrender.com/api/characters/students');
        characters.value = (await studentResponse.json()).filter(c => c.house && c.image);
        
        const allResponse = await fetch('https://hp-api.onrender.com/api/characters');
        allCharacters.value = await allResponse.json();

        pickRandomCharacter();
      } catch (error) {
        console.error('Erreur lors du chargement des élèves :', error);
      }
    };

    const pickRandomCharacter = () => {
      if (characters.value.length > 0) {
        currentCharacter.value = characters.value[Math.floor(Math.random() * characters.value.length)];
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

    onMounted(fetchCharacters);

    return { 
      goToHistory,
      currentCharacter, 
      houses, 
      checkAnswer, 
      streak, 
      gameOver, 
      restartGame, 
      showLibrary, 
      allCharacters,
      gameHistory
    };
  }
};
</script>

<style>
button {
  margin: 5px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
}

.library-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.history-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  text-decoration: none;
}

.game-over {
  color: red;
  font-size: 20px;
  font-weight: bold;
}

.character-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.character-card {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  width: 120px;
}
</style>  