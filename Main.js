const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
let surfaceImg = new Image();
surfaceImg.src = "RockSurface.png";
let surface2Img = new Image();
surface2Img.src = "RockSurf2.png";
let botImage = new Image();
botImage.src = "Robot_Warrior.png";
let mapRows = 5, mapCols = 10;
let map = [];
let iter, clicking = false;
for(let i = 0; i < mapRows * mapCols; i++) {
    if(Math.floor(Math.random() * 2) == 0) {
        map.push(surfaceImg);
    } else {5
        map.push(surface2Img);
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    c.fillRect(0,0,canvas.width,canvas.height);
    iter = 0;
    for(let i = 0; i < mapRows; i++) {
        for(let n = 0; n < mapCols; n++) {
            createImage(map[iter], 10 + 80 * n, 10 + 80 * i);
            iter++;
        }
    }
}

function createImage(img, x, y) {
    c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width, img.height);
}

gameLoop();

window.addEventListener('mousedown', () => {
    clicking = true;
})
window.addEventListener('mouseup', () => {
    clicking = false;
})