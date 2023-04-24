const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

// Using the canvas to draw the map in the background

const img = new Image();
img.onload = () => {
    gameLoop();
};
img.src = 'img/gamemap.png';

class Enemy {
    constructor ({position = { x: 0, y: 0 }}) {
        this.position = position
        this.waypointIndex = 0;
        this.size = {
            width: 50,
            height: 50
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }

    update() {
        this.draw();
        ;

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.position.y;
        const xDistance = waypoint.x - this.position.x;
        const angle = Math.atan2(yDistance, xDistance);
        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)

        if (
            Math.round(this.position.x) === Math.round(waypoint.x) && 
            Math.round(this.position.y) === Math.round(waypoint.y)
        ) {
            this.waypointIndex++;
        }

        if (this.waypointIndex === waypoints.length) {
            this.waypointIndex = 0;
        }
        console.log(this.position)
        console.log(waypoint)
    }
}

const enemy = new Enemy({position: { x: 180, y: 0 }});
const enemy2 = new Enemy({position: { x: 180, y: -120 }});
console.log(enemy);

function gameLoop() {
    requestAnimationFrame(gameLoop);
    console.log('Game Loop')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    enemy.update();
    enemy2.update();
}

gameLoop();

// Using Waypoints to create the path instead of collision detection
