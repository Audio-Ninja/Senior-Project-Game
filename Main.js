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
let test;
let map = [];
let iter, clicking = false, clickX, clickY, mouseX, mouseY, dispX = 0, dispY = 0;
let camX = 0, camY = 0, camZ = 1;
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
    if(clicking == true) {
        camX = dispX + mouseX - clickX;
        camY = dispY + mouseY - clickY;
    }
    for(let i = 0; i < mapRows; i++) {
        for(let n = 0; n < mapCols; n++) {
            createImage(map[iter], 80 * n * camZ + camX, 80 * i * camZ + camY);
            iter++;
        }
    }
}

function createImage(img, x, y) {
    c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * camZ, img.height * camZ);
}

gameLoop();

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 8;
    mouseY = e.clientY - 80;
})
canvas.addEventListener('mousedown', (e) => {
    clicking = true;
    clickX = e.clientX - 8;
    clickY = e.clientY - 80;
})
window.addEventListener('mouseup', () => {
    clicking = false;
    dispX += mouseX - clickX;
    dispY += mouseY - clickY;
})