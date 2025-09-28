import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
  ScrollView,
  BackHandler
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const categories = [
  "Kız İsmi",
  "Erkek İsmi", 
  "Meyveler",
  "Sebzeler",
  "İçecekler",
  "Hayvanlar",
  "Şehirler",
  "Ülkeler",
  "Araba Markaları",
  "Giyim Markaları",
  "Markalar",
  "Futbol Kulüpleri",
  "Basketbol Kulüpleri",
  "Ünlüler",
  "Şarkı İsimleri",
  "Kitap İsimleri",
  "Meslekler",
  "Grup veya Sanatçı",
  "TV Dizileri",
  "Filmler",
  "Kurgusal Karakterler",
  "Sıcak Şeyler",
  "Soğuk Şeyler",
  "Evdeki Eşyalar",
  "Yazar",
  "Mobil Uygulamalar"
];

export default function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'game', 'gameOver'
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [passCount, setPassCount] = useState({ player1: 0, player2: 0 });
  const [usedLetters, setUsedLetters] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [usedCategories, setUsedCategories] = useState([]);
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showRules, setShowRules] = useState(false);
  
  const timerRef = useRef(null);
  const letters = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');

  useEffect(() => {
    const backAction = () => {
      if (gameState === 'game') {
        Alert.alert('Oyundan Çık', 'Ana menüye dönmek istediğinizden emin misiniz?', [
          { text: 'İptal', style: 'cancel' },
          { text: 'Evet', onPress: () => resetGame() }
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [gameState]);

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, isTimerRunning]);

  const suggestCategory = () => {
    let availableCategories = categories.filter(cat => !usedCategories.includes(cat));
    if (availableCategories.length === 0) {
      setUsedCategories([]);
      availableCategories = categories;
    }
    const randomIndex = Math.floor(Math.random() * availableCategories.length);
    const suggested = availableCategories[randomIndex];
    setUsedCategories([...usedCategories, suggested]);
    return suggested;
  };

  const startGame = () => {
    if (!player1Name.trim()) setPlayer1Name('Oyuncu 1');
    if (!player2Name.trim()) setPlayer2Name('Oyuncu 2');
    
    const category = suggestCategory();
    setCurrentCategory(category);
    setGameState('game');
    startTimer();
  };

  const startTimer = () => {
    setTimer(10);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleTimeUp = () => {
    stopTimer();
    const currentPlayerKey = currentPlayer === 1 ? 'player1' : 'player2';
    setScores(prev => ({
      ...prev,
      [currentPlayerKey]: prev[currentPlayerKey] - 1
    }));
    
    switchPlayer();
    checkGameOver();
  };

  const handleLetterPress = (letter) => {
    if (usedLetters.includes(letter)) return;
    
    stopTimer();
    setUsedLetters([...usedLetters, letter]);
    
    const currentPlayerKey = currentPlayer === 1 ? 'player1' : 'player2';
    setScores(prev => ({
      ...prev,
      [currentPlayerKey]: prev[currentPlayerKey] + 1
    }));
    
    switchPlayer();
    checkGameOver();
  };

  const handlePass = () => {
    const currentPlayerKey = currentPlayer === 1 ? 'player1' : 'player2';
    setPassCount(prev => ({
      ...prev,
      [currentPlayerKey]: prev[currentPlayerKey] + 1
    }));
    
    switchPlayer();
    checkGameOver();
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    if (gameState === 'game') {
      const category = suggestCategory();
      setCurrentCategory(category);
      startTimer();
    }
  };

  const checkGameOver = () => {
    if (passCount.player1 >= 2 || passCount.player2 >= 2 || usedLetters.length === letters.length) {
      stopTimer();
      setGameState('gameOver');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setPassCount({ player1: 0, player2: 0 });
    setUsedLetters([]);
    setUsedCategories([]);
    setTimer(10);
    stopTimer();
  };

  const getWinner = () => {
    if (scores.player1 > scores.player2) {
      return { name: player1Name, color: '#007bff' };
    } else if (scores.player2 > scores.player1) {
      return { name: player2Name, color: '#ff0000' };
    }
    return { name: 'Berabere', color: '#666' };
  };

  const renderLetterWheel = () => {
    const radius = width * 0.35;
    const centerX = width / 2;
    const centerY = height * 0.45;

    return (
      <View style={styles.wheelContainer}>
        {letters.map((letter, index) => {
          const angle = (index * 2 * Math.PI) / letters.length;
          const x = centerX + radius * Math.cos(angle) - 25;
          const y = centerY + radius * Math.sin(angle) - 25;
          
          const isUsed = usedLetters.includes(letter);
          const playerColor = isUsed ? 
            (usedLetters.indexOf(letter) % 2 === 0 ? '#007bff' : '#ff0000') : 
            '#04AA6D';

          return (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterBox,
                {
                  position: 'absolute',
                  left: x,
                  top: y,
                  backgroundColor: isUsed ? playerColor : 'white',
                  opacity: isUsed ? 0.6 : 1,
                  borderColor: playerColor
                }
              ]}
              onPress={() => handleLetterPress(letter)}
              disabled={isUsed}
            >
              <Text style={[styles.letterText, { color: isUsed ? 'white' : '#333' }]}>
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderMenu = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.logoContainer}>
        <Ionicons name="game-controller" size={80} color="#04AA6D" />
        <Text style={styles.logoText}>Harfler Çarkı</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="1. Oyuncu İsmi"
          value={player1Name}
          onChangeText={setPlayer1Name}
          maxLength={15}
        />
        <TextInput
          style={styles.input}
          placeholder="2. Oyuncu İsmi"
          value={player2Name}
          onChangeText={setPlayer2Name}
          maxLength={15}
        />
        
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>Oyunu Başlat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.rulesButton} onPress={() => setShowRules(true)}>
          <Text style={styles.rulesButtonText}>Kurallar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGame = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{currentCategory}</Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Kalan Süre:</Text>
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      {renderLetterWheel()}

      <TouchableOpacity style={styles.passButton} onPress={handlePass}>
        <Text style={styles.passButtonText}>Pas</Text>
      </TouchableOpacity>

      <View style={styles.scoreContainer}>
        <Text style={[
          styles.scoreText,
          currentPlayer === 1 && styles.currentPlayerScore
        ]}>
          {player1Name || 'Oyuncu 1'}: {scores.player1}
        </Text>
        <Text style={[
          styles.scoreText,
          currentPlayer === 2 && styles.currentPlayerScore
        ]}>
          {player2Name || 'Oyuncu 2'}: {scores.player2}
        </Text>
      </View>
    </View>
  );

  const renderGameOver = () => {
    const winner = getWinner();
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        
        <View style={styles.gameOverContainer}>
          <Text style={[styles.winnerText, { color: winner.color }]}>
            {winner.name === 'Berabere' ? 'Berabere! 🤝' : `${winner.name} Kazandı! 🥳 🎉`}
          </Text>
          <Text style={styles.gameOverText}>Oyun Bitti</Text>
          
          <View style={styles.finalScores}>
            <Text style={styles.finalScoreText}>
              {player1Name || 'Oyuncu 1'}: {scores.player1}
            </Text>
            <Text style={styles.finalScoreText}>
              {player2Name || 'Oyuncu 2'}: {scores.player2}
            </Text>
          </View>

          <TouchableOpacity style={styles.replayButton} onPress={resetGame}>
            <Text style={styles.buttonText}>Tekrar Oyna</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={resetGame}>
            <Text style={styles.buttonText}>Ana Menü</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRulesModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showRules}
      onRequestClose={() => setShowRules(false)}
    >
      <View style={styles.rulesContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        
        <View style={styles.rulesHeader}>
          <TouchableOpacity onPress={() => setShowRules(false)}>
            <Ionicons name="arrow-back" size={24} color="#f75c7b" />
          </TouchableOpacity>
          <Text style={styles.rulesTitle}>Kurallar</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.rulesContent}>
          <Text style={styles.ruleText}>
            1- Her oyuncu, verilen kategoriyle ilgili cevabının baş harfini harf çemberinde işaretleyerek puan kazanır.
          </Text>
          <Text style={styles.ruleText}>
            2- Her cevap, harf çemberindeki farklı bir harfle başlamalıdır.
          </Text>
          <Text style={styles.ruleText}>
            3- Soruları cevaplamak için gereken süre 10 saniyedir.
          </Text>
          <Text style={styles.ruleText}>
            4- 10 saniye içinde cevap verilmezse, oyuncu -1 puan alır ve sıra diğer oyuncuya geçer.
          </Text>
          <Text style={styles.ruleText}>
            5- Her oyuncunun soruyu eksi puan almadan geçmek için 2 kez pas hakkı vardır.
          </Text>
          <Text style={styles.ruleText}>
            6- 2. pasın kullanılması veya çemberdeki tüm harflerin kullanılması oyunu bitirir.
          </Text>
          <Text style={styles.ruleText}>
            7- 5 tur boyunca oyuna devam edebilirsiniz, puanlarınız kalacaktır.
          </Text>
        </ScrollView>

        <TouchableOpacity 
          style={styles.backHomeButton} 
          onPress={() => setShowRules(false)}
        >
          <Text style={styles.buttonText}>Ana Menüye Dön</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'game' && renderGame()}
      {gameState === 'gameOver' && renderGameOver()}
      {renderRulesModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#04AA6D',
    marginTop: 10,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#275e95',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#04AA6D',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  rulesButton: {
    borderWidth: 2,
    borderColor: '#f75c7b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  rulesButtonText: {
    color: '#f75c7b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryContainer: {
    position: 'absolute',
    top: 80,
    backgroundColor: 'purple',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  categoryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerContainer: {
    position: 'absolute',
    top: 140,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 16,
    color: '#333',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  wheelContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  letterBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  passButton: {
    position: 'absolute',
    top: height * 0.45 - 45,
    left: width / 2 - 45,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#04AA6D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passButtonText: {
    color: '#04AA6D',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333',
  },
  currentPlayerScore: {
    fontWeight: 'bold',
    color: '#04AA6D',
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  finalScores: {
    marginBottom: 30,
    alignItems: 'center',
  },
  finalScoreText: {
    fontSize: 20,
    marginVertical: 5,
    color: '#333',
  },
  replayButton: {
    backgroundColor: '#555',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  homeButton: {
    backgroundColor: '#04AA6D',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  rulesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  rulesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f75c7b',
  },
  rulesContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ruleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: '#333',
    textAlign: 'left',
  },
  backHomeButton: {
    backgroundColor: '#04AA6D',
    margin: 20,
    borderRadius: 20,
    paddingVertical: 15,
  },
});