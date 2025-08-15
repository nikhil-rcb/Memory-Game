const gameContainer = document.querySelector('.game-container');
const movesSpan = document.getElementById('moves');
const timerSpan = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const winScreen = document.getElementById('win-screen');
const music = document.getElementById('music-bg');
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;
const cardFaces = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];

function shuffle(array) {
  array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  resetGame();
  const gameCards = [...cardFaces, ...cardFaces];
  shuffle(gameCards);

  gameCards.forEach(face => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.face = face;
    card.innerHTML = `
      <div class="card-face card-back"></div>
      <div class="card-face card-front">${face}</div>
    `;
    gameContainer.appendChild(card);
    card.addEventListener('click', flipCard);
  });
}
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  if (!gameStarted) {
    startTimer();
    music.play();
    gameStarted = true;
  }

  flipSound.currentTime = 0;
  flipSound.play();

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  updateMoves();
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.face === secondCard.dataset.face;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  matchSound.currentTime = 0;
  matchSound.play();
  matches++;
  resetTurn();

  if (matches === cardFaces.length) {
    stopTimer();
    showWinScreen();
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetTurn();
  }, 1000);
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateMoves() {
  moves++;
  movesSpan.textContent = moves;
}

function startTimer() {
  timer = 0;
  timerSpan.textContent = timer;
  timerInterval = setInterval(() => {
    timer++;
    timerSpan.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function showWinScreen() {
  music.pause();
  winSound.play();
  document.getElementById('final-time').textContent = `${timer} seconds`;
  document.getElementById('final-moves').textContent = `${moves} moves`;
  winScreen.classList.remove('hidden');
}

function hideWinScreen() {
  winScreen.classList.add('hidden');
}

function resetGame() {
  stopTimer();
  music.pause();
  music.currentTime = 0;
  moves = 0;
  matches = 0;
  timer = 0;
  movesSpan.textContent = moves;
  timerSpan.textContent = timer;
  lockBoard = false;
  gameStarted = false;
  [firstCard, secondCard] = [null, null];
  gameContainer.innerHTML = '';
}
function restartGame() {
  hideWinScreen();
  createBoard();
}
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);
createBoard();