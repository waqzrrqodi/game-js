// Game buttons
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');

// Game button event listeners
// Start button event listener, starts the game loop if not already running
startButton.addEventListener('click', () => {
    if (startButton.innerHTML === 'Start') {
        running = true;
        gameLoop();
        startButton.innerHTML = 'Pause';
    } else if (startButton.innerHTML === 'Pause') {
        running = false;
        startButton.innerHTML = 'Resume';
    } else if (startButton.innerHTML === 'Resume') {
        running = true;
        gameLoop();
        startButton.innerHTML = 'Pause';
    }
});

// Pause button event listener, stops the game loop
resetButton.addEventListener('click', () => {
    running = false;
    startButton.innerHTML = 'Start';
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(image, 0, 0, canvas.width, canvas.height);
    enemyReset();
    buildingReset();
    hearts = 10;
    coins = 100;
    document.querySelector('#hearts').innerHTML = hearts;
    document.querySelector('#coins').innerHTML = coins;
    document.querySelector('#game-over').style.display = 'none';
});

let selectedBuildingType = "";


// Event listener for the building buttons
document.getElementById("badbuild-button").addEventListener("click", function() {
    selectedBuildingType = "badbuild";
    document.getElementById("badbuild").classList.add("chosen-building");
    document.getElementById("mediumbuild").classList.remove("chosen-building");
    document.getElementById("goodbuild").classList.remove("chosen-building");
    console.log(selectedBuildingType);
});

document.getElementById("mediumbuild-button").addEventListener("click", function() {
    selectedBuildingType = "mediumbuild";
    document.getElementById("badbuild").classList.remove("chosen-building");
    document.getElementById("mediumbuild").classList.add("chosen-building");
    document.getElementById("goodbuild").classList.remove("chosen-building");
    console.log(selectedBuildingType);
});

document.getElementById("goodbuild-button").addEventListener("click", function() {
    selectedBuildingType = "goodbuild";
    document.getElementById("badbuild").classList.remove("chosen-building");
    document.getElementById("mediumbuild").classList.remove("chosen-building");
    document.getElementById("goodbuild").classList.add("chosen-building");
    console.log(selectedBuildingType);
});