let isGameOver = false;
let isGameStarted = false;
const dino = document.getElementById('dino');
const dinoArea = document.querySelector('.dino-area');
const video = document.getElementById('background-video');
let isJumping = false;
let obstacleIntervals = [];

document.addEventListener('keydown', function(event) {
    if (event.key === ' ' && !isGameStarted) {
        startGame();
    } else if (event.key === ' ' && isGameStarted && !isJumping) {
        jump();
    }
});

function jump() {
    if (isJumping) return;
    isJumping = true;
    dino.classList.add('jump');

    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 1000);
}

function createObstacle() {
    if (isGameOver) return; // Do not create new obstacles if the game is over

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const obstacleTree = document.createElement('img');
    obstacleTree.src = "./tree.png"
    obstacle.append(obstacleTree)
    dinoArea.appendChild(obstacle);

    let obstaclePosition = 0;
    obstacle.style.right = obstaclePosition + 'px';

    const moveObstacle = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveObstacle);
            return;
        }

        obstaclePosition += 10; // Move obstacle to the right
        obstacle.style.right = obstaclePosition + 'px';

        // Check for collision
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            dinoRect.right >= obstacleRect.left &&
            dinoRect.left <= obstacleRect.right &&
            dinoRect.bottom >= obstacleRect.top &&
            dinoRect.top <= obstacleRect.bottom
        ) {
            gameOver();
            clearInterval(moveObstacle);
            return;
        }

        // Remove obstacle if it goes off screen
        if (obstaclePosition > dinoArea.offsetWidth) {
            clearInterval(moveObstacle);
            dinoArea.removeChild(obstacle);
        }
    }, 20);

    obstacleIntervals.push(moveObstacle); // Store the interval to clear later

    setTimeout(createObstacle, Math.random() * 1000 + 3000); // Random interval between 5-6 seconds
}

function gameOver() {
    isGameOver = true;
    video.pause();
    isGameStarted = false;
    alert('Game Over!');
    
}

function resetGame() {
    // Clear all obstacles
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());

    // Reset dino position (if necessary)
    dino.style.left = '80px';
    dino.style.bottom = '0px';

    // Clear all obstacle intervals
    obstacleIntervals.forEach(interval => clearInterval(interval));
    obstacleIntervals = [];

    isGameOver = false; // Allow game to start again
}

function startGame() {
    isGameStarted = true;
    video.play();
    resetGame();
    createObstacle();
}

// Start the game only when the space bar is pressed
document.addEventListener('DOMContentLoaded', () => {
    // alert('Press Space Bar to Start the Game!');
});
