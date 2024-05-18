const gameBoard = document.getElementById('game-board');
const playerScoreElement = document.getElementById('player-score');
const botScoreElement = document.getElementById('bot-score');
const timerElement = document.getElementById('time-left');
const resultMessageElement = document.getElementById('result-message');
let playerScore = 0;
let botScore = 0;
let gameActive = false;
let playerTurn = true;
let botTurnActive = false;
let difficulty = 'easy';
let timeLeft = 30;
let timer;

function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    playerScore = 0;
    botScore = 0;
    timeLeft = 30;
    gameActive = true;
    playerTurn = true;
    gameBoard.innerHTML = '';
    clearInterval(timer);
    timerElement.innerText = timeLeft;
    resultMessageElement.classList.add('hidden');
    resultMessageElement.classList.remove('show');

    // Create a 5x5 grid of buttons
    for (let i = 0; i < 25; i++) {
        const button = document.createElement('button');
        button.className = 'game-btn';
        button.addEventListener('click', () => handlePlayerClick(button));
        gameBoard.appendChild(button);
    }

    updateScores();
    startTimer();
    setTimeout(botTurn, getBotDelay());
}

function handlePlayerClick(button) {
    if (gameActive && playerTurn && !button.classList.contains('clicked')) {
        button.classList.add('clicked');
        button.innerText = 'P';
        playerScore++;
        playerTurn = false;
        updateScores();
        if (!gameActive) return; // Prevent bot from playing after game end
        setTimeout(botTurn, getBotDelay());
    }
}

function getBotDelay() {
    switch (difficulty) {
        case 'easy': return Math.random() * 1000 + 500;
        case 'medium': return Math.random() * 700 + 300;
        case 'hard': return Math.random() * 500 + 200;
    }
}

function botTurn() {
    if (!gameActive) return;
    botTurnActive = true;

    const availableButtons = Array.from(gameBoard.children).filter(btn => !btn.classList.contains('clicked'));
    if (availableButtons.length > 0) {
        const botButton = chooseBotMove(availableButtons);
        botButton.classList.add('clicked');
        botButton.innerText = 'B';
        botScore++;
        updateScores();
        playerTurn = true;
        botTurnActive = false;
    }
}

function chooseBotMove(availableButtons) {
    if (difficulty === 'hard') {
        // Bot tries to block player or win if possible
        let strategicMove = findStrategicMove(availableButtons, 'B');
        if (strategicMove) return strategicMove;
        strategicMove = findStrategicMove(availableButtons, 'P');
        if (strategicMove) return strategicMove;
    }
    // Random move for other cases or if no strategic move found
    const randomIndex = Math.floor(Math.random() * availableButtons.length);
    return availableButtons[randomIndex];
}

function findStrategicMove(availableButtons, marker) {
    for (let btn of availableButtons) {
        btn.innerText = marker;
        if (checkWinningCondition(marker)) {
            btn.innerText = '';
            return btn;
        }
        btn.innerText = '';
    }
    return null;
}

function updateScores() {
    playerScoreElement.innerText = playerScore;
    botScoreElement.innerText = botScore;
    if (playerScore + botScore === 25 || timeLeft <= 0) {
        gameActive = false;
        clearInterval(timer);
        displayResultMessage(getWinnerMessage());
        setTimeout(() => gameBoard.innerHTML = '', 500); // Disappear grid smoothly
    }
}

function getWinnerMessage() {
    if (playerScore > botScore) {
        return 'Player wins!';
    } else if (botScore > playerScore) {
        return 'Bot wins!';
    } else {
        return 'It\'s a draw!';
    }
}

function displayResultMessage(message) {
    resultMessageElement.innerText = message;
    resultMessageElement.classList.remove('hidden');
    setTimeout(() => resultMessageElement.classList.add('show'), 10);
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.innerText = timeLeft;
        } else {
            gameActive = false;
            clearInterval(timer);
            displayResultMessage(getWinnerMessage());
            setTimeout(() => gameBoard.innerHTML = '', 500); // Disappear grid smoothly
        }
    }, 1000);
}

function checkWinningCondition(marker) {
    const winningCombos = [
        [0, 1, 2, 3], [1, 2, 3, 4],
        [5, 6, 7, 8], [6, 7, 8, 9],
        [10, 11, 12, 13], [11, 12, 13, 14],
        [15, 16, 17, 18], [16, 17, 18, 19],
        [20, 21, 22, 23], [21, 22, 23, 24],
        [0, 5, 10, 15], [5, 10, 15, 20],
        [1, 6, 11, 16], [6, 11, 16, 21],
        [2, 7, 12, 17], [7, 12, 17, 22],
        [3, 8, 13, 18], [8, 13, 18, 23],
        [4, 9, 14, 19], [9, 14, 19, 24]
    ];

    const buttons = Array.from(gameBoard.children);
    for (const combo of winningCombos) {
        if (combo.every(index => buttons[index].innerText === marker)) {
            return true;
        }
    }
    return false;
}
