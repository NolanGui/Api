<template>
  <div>
    <div class="nav-buttons">
      <button class="library-button" @click="toggleLibrary">
        {{ showLibrary ? 'Revenir au jeu' : 'Bibliothèque des Personnages' }}
      </button>
      <button class="history-button" @click="goToHistory">Voir l'historique</button>
    </div>
    
    <router-view v-slot="{ Component }">
      <component 
        :is="Component" 
        :game-state="{ 
          showLibrary, 
          toggleLibrary, 
          gameHistory 
        }"
      />
    </router-view>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const showLibrary = ref(false);
    const gameHistory = ref(JSON.parse(localStorage.getItem('hpGameHistory')) || []);

    const toggleLibrary = () => {
      showLibrary.value = !showLibrary.value;
      // Si on montre la bibliothèque, on navigue vers la home
      if (showLibrary.value) {
        router.push('/');
      }
    };

    const goToHistory = () => {
      router.push({
        path: '/history',
        state: { gameHistory: gameHistory.value }
      });
      // Ferme la bibliothèque si ouverte
      showLibrary.value = false;
    };

    return { 
      showLibrary,
      gameHistory,
      toggleLibrary,
      goToHistory
    };
  }
};
</script>

<style scoped>
.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.library-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.library-button:hover {
  background-color: #3e8e41;
}

.history-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.history-button:hover {
  background-color: #2980b9;
}
</style>