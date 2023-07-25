const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const highScore = document.cookie;
const highScoreSpan = document.getElementById("highScoreSpan")
highScoreSpan.innerHTML = highScore


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let backgroundImage = new Image();
backgroundImage.src = "img/spaceBackground.png";

// Game variables
let running = true;
let player = undefined;
let garbage = [];
let foregroundObjects = []; // Array of planet objects
let MaxgarbageOnScreen = 10;
let garbageOnScreen = 0;
let garbageSpawnRate = 2000;
let lastGarbageSpawn = -1;
let garbageSpeed = 1;
let planetDefaultGravity = 0.1;
let defaultPlanetSpawnRate = 2000;
let maxPlanetSpawnRate = 750;
let lastPlanetSpawn = -1;
let planetImages = [
  { src: "img/planet1.png", frameCount: 50, frameDuration: 40 },
  { src: "img/planet2.png", frameCount: 50, frameDuration: 40 },
  { src: "img/planet3.png", frameCount: 50, frameDuration: 40 },
  { src: "img/planet4.png", frameCount: 50, frameDuration: 40 },
];
let garbageImages = [
  { src: "img/foods/garbage1.png" },
  { src: "img/foods/garbage2.png" },
  { src: "img/foods/garbage3.png" },
  { src: "img/foods/garbage4.png" },
  { src: "img/foods/garbage5.png" },
  { src: "img/foods/garbage6.png" },
  { src: "img/foods/garbage7.png" },
  { src: "img/foods/garbage8.png" },
  { src: "img/foods/garbage9.png" },
  { src: "img/foods/garbage10.png" },
];

let idleSpritesheet = {
  src: "img/player_idle.png",
  frameCount: 1,
  frameDuration: 10,
};
let thrustSpritesheet = {
  src: "img/player_thrust.png",
  frameCount: 5,
  frameDuration: 50,
};

// Check if all images are loaded, then start the game
Promise.all([
  new Promise((resolve, reject) => {
    backgroundImage.onload = resolve;
    backgroundImage.onerror = reject;
  }),
  ...planetImages.map((spritesheet) => {
    return new Promise((resolve, reject) => {
      spritesheet.image = new Image();
      spritesheet.image.onload = resolve;
      spritesheet.image.onerror = reject;
      spritesheet.image.src = spritesheet.src;
    });
  }),
  new Promise((resolve, reject) => {
    idleSpritesheet.image = new Image();
    idleSpritesheet.image.onload = resolve;
    idleSpritesheet.image.onerror = reject;
    idleSpritesheet.image.src = idleSpritesheet.src;
  }),
  new Promise((resolve, reject) => {
    thrustSpritesheet.image = new Image();
    thrustSpritesheet.image.onload = resolve;
    thrustSpritesheet.image.onerror = reject;
    thrustSpritesheet.image.src = thrustSpritesheet.src;
  }),
  ...garbageImages.map((garbage) => {
    return new Promise((resolve, reject) => {
      garbage.image = new Image();
      garbage.image.onload = resolve;
      garbage.image.onerror = reject;
      garbage.image.src = garbage.src;
    });
  }),
])
  .then(() => {
    // Start the animation loop
    requestAnimationFrame(gameLoop);
  })
  .catch((error) => {
    console.error("Error loading images:", error);
  });

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  backgroundX -= backgroundSpeed;
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
  }

  let currentTime = Date.now();
  // The interval of planets spawning decreases as the score increases
  let planetSpawnRate = defaultPlanetSpawnRate - player.score * 10;
  if (planetSpawnRate < maxPlanetSpawnRate) {
    planetSpawnRate = maxPlanetSpawnRate;
  }
  // console.log(planetSpawnRate);
  if (currentTime - lastPlanetSpawn > planetSpawnRate) {
    lastPlanetSpawn = currentTime;
    spawnPlanet();
  }
  if (currentTime - lastGarbageSpawn > garbageSpawnRate) {
    lastGarbageSpawn = currentTime;
    spawnGarbage();
  }
  drawPlanet();
  drawGarbage();
  drawPlayer();
  player.update();

  // Check for collision with garbage
  for (let i = 0; i < garbage.length; i++) {
    let object = garbage[i];
    if (player.collidesWith(object)) {
      player.handleObjectCollisions(object);
      garbage.splice(i, 1);
    }
  }
  if (running) {
    requestAnimationFrame(gameLoop);
  }
}

function drawPlanet() {
  // Update and draw planets
  for (let i = foregroundObjects.length - 1; i >= 0; i--) {
    let planet = foregroundObjects[i];

    // Update planets position
    planet.update(backgroundSpeed);

    if (planet.x <= -planet.width) {
      foregroundObjects.splice(i, 1);
    } else {
      // Draw planet
      planet.draw(ctx);
    }
  }
}

// Planet spawner
function spawnPlanet() {
  let randomIndex = Math.floor(Math.random() * planetImages.length);
  let randomPlanet = new Image();
  randomPlanet = planetImages[randomIndex];
  // The scale of the planet is a random number between 0.6 and 1.5
  let scale = Math.random() * (1.5 - 0.6) + 0.6;

  // Create a new planet object (Image, width, height, x, y, frameCount, frameDuration, gravity, scale)
  let planet = new Planet(
    randomPlanet.image,
    128,
    128,
    canvas.width,
    getRandomHeight(),
    randomPlanet.frameCount,
    randomPlanet.frameDuration,
    scale
  );
  foregroundObjects.push(planet);
}

function drawGarbage() {
  // Update and draw garbage
  for (let i = garbage.length - 1; i >= 0; i--) {
    let garbageObject = garbage[i];

    // Update garbage position
    garbageObject.update(backgroundSpeed);

    if (garbageObject.x <= -garbageObject.width) {
      garbage.splice(i, 1);
    } else {
      // Draw garbage
      garbageObject.draw(ctx);
    }
  }
}

function spawnGarbage() {
  // Create a new garbage object (Image, width, height, x, y, scale)
  let randomGarbage = Math.floor(Math.random() * garbageImages.length);
  let randomGarbageImage = new Image();
  randomGarbageImage = garbageImages[randomGarbage].image;

  // Create a new garbage object (Image, width, height, x, y, scale)
  let garbageObject = new Garbage(
    randomGarbageImage,
    16,
    16,
    canvas.width,
    getRandomHeight(),
    3
  );
  garbage.push(garbageObject);
}

// Get a random height for the planet to spawn at (between 10% and 90% of the canvas height)
function getRandomHeight() {
  let minHeight = canvas.height * 0.1;
  let maxHeight = canvas.height * 0.9;
  return Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
}

// Generate player
player = new Player(
  idleSpritesheet.image,
  thrustSpritesheet.image,
  80,
  108,
  1,
  50,
  5,
  50
);

// Background position tracking
let backgroundX = 0;
let backgroundSpeed = 5 + player.score / 25; // 5px of background movment per frame + 1px per 25 points

// Draw player
function drawPlayer() {
  player.draw(ctx);
}

function drawBackground() {
  ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(
    backgroundImage,
    backgroundX + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
}

function gameOver() {
  running = false;
  const gameOverScreen = document.querySelector(".gameOverDiv");
  console.log(highScore)

  const score = document.getElementById("score");
  // the score is a span which the score is written in
  score.innerHTML = player.score;

  // If score is higher than high score, make high score the score
  if (player.score > highScore) {
    console.log(highScore);
    console.log(player.score);
    document.cookie = player.score;
    highScoreSpan.innerHTML = player.score;
  };

  gameOverScreen.classList.remove("hidden");
}
