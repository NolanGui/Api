<template>
  <div class="history-container">
    <h1>Historique des Parties</h1>
    
    <router-link to="/" class="back-button">Retour au jeu</router-link>
    
    <div v-if="gameHistory.length === 0" class="no-history">
      <p>Aucune partie enregistrée pour le moment.</p>
    </div>
    
    <div v-else>
      <div class="stats">
        <div class="stat-card">
          <h3>Meilleur score</h3>
          <p class="stat-value">{{ bestStreak }}</p>
        </div>
        <div class="stat-card">
          <h3>Parties jouées</h3>
          <p class="stat-value">{{ gameHistory.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Moyenne</h3>
          <p class="stat-value">{{ averageStreak.toFixed(1) }}</p>
        </div>
      </div>
      
      <h2>Dernières parties</h2>
      <div class="history-list">
        <div v-for="(game, index) in gameHistory" :key="index" class="history-item">
          <div class="game-info">
            <span class="game-date">{{ formatDate(game.date) }}</span>
            <span class="game-streak" :class="getStreakClass(game.streak)">{{ game.streak }} bonnes réponses</span>
          </div>
          <div class="game-details">
            <p>Dernier personnage: <strong>{{ game.character }}</strong> ({{ game.house }})</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    gameHistory: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const bestStreak = computed(() => {
      return Math.max(...props.gameHistory.map(game => game.streak), 0);
    });
    
    const averageStreak = computed(() => {
      if (props.gameHistory.length === 0) return 0;
      const total = props.gameHistory.reduce((sum, game) => sum + game.streak, 0);
      return total / props.gameHistory.length;
    });
    
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    };
    
    const getStreakClass = (streak) => {
      if (streak >= 10) return 'excellent';
      if (streak >= 5) return 'good';
      return 'average';
    };
    
    return { bestStreak, averageStreak, formatDate, getStreakClass };
  }
};
</script>

<style scoped>
.history-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: inline-block;
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.no-history {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  width: 30%;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 10px;
}

.history-list {
  margin-top: 20px;
}

.history-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.game-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.game-date {
  color: #666;
}

.game-streak {
  font-weight: bold;
}

.game-streak.excellent {
  color: #27ae60;
}

.game-streak.good {
  color: #f39c12;
}

.game-streak.average {
  color: #e74c3c;
}

.game-details {
  color: #555;
}
</style>
