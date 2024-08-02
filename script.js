const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 320;

const playerWidth = 40;
const playerHeight = 20;
const playerSpeed = 5;
const bulletSpeed = 3;
const alienRowCount = 3;
const alienColumnCount = 5;
const alienWidth = 40;
const alienHeight = 20;
const alienSpeed = 1;

let playerX = (canvas.width - playerWidth) / 2;
let playerY = canvas.height - playerHeight - 10;
let bullets = [];
let aliens = [];
let rightPressed = false;
let leftPressed = false;
let alienDirection = 1;  // 1 for right, -1 for left

function createAliens() {
    for (let c = 0; c < alienColumnCount; c++) {
        aliens[c] = [];
        for (let r = 0; r < alienRowCount; r++) {
            aliens[c][r] = { x: c * (alienWidth + 10) + 30, y: r * (alienHeight + 10) + 30, alive: true };
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

function drawAliens() {
    ctx.fillStyle = 'green';
    aliens.forEach(column => {
        column.forEach(alien => {
            if (alien.alive) {
                ctx.fillRect(alien.x, alien.y, alienWidth, alienHeight);
            }
        });
    });
}

function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= bulletSpeed;
        return bullet.y > 0; // Remove bullets that are off-screen
    });
}

function updateAliens() {
    let hitEdge = false;

    aliens.forEach(column => {
        column.forEach(alien => {
            if (alien.alive) {
                alien.x += alienDirection;
                if (alien.x + alienWidth > canvas.width || alien.x < 0) {
                    hitEdge = true;
                }
            }
        });
    });

    if (hitEdge) {
        alienDirection = -alienDirection;
        aliens.forEach(column => {
            column.forEach(alien => {
                alien.y += alienHeight;
            });
        });
    }
}

function collisionDetection() {
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach(column => {
            column.forEach((alien, aIndex) => {
                if (alien.alive && bullet.x < alien.x + alienWidth && bullet.x + 5 > alien.x && bullet.y < alien.y + alienHeight && bullet.y + 10 > alien.y) {
                    alien.alive = false;
                    bullets.splice(bIndex, 1);
                }
            });
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawAliens();
    updateBullets();
    updateAliens();
    collisionDetection();

    if (rightPressed && playerX < canvas.width - playerWidth) {
        playerX += playerSpeed;
    }
    if (leftPressed && playerX > 0) {
        playerX -= playerSpeed;
    }

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        bullets.push({ x: playerX + playerWidth / 2 - 2.5, y: playerY });
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

createAliens();
draw();

