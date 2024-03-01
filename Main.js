const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
let surfaceImg = new Image();
surfaceImg.src = "RockSurface.png";
let surface2Img = new Image();
surface2Img.src = "RockSurf2.png";
let botImage = new Image();
botImage.src = "Warrior_Red.png";
let buttonImage = new Image();
buttonImage.src = "Zoom_buttons.svg";
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

function changeCanvas() {
    canvas.width = document.getElementById("width").value;
    canvas.height = document.getElementById("height").value;   
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
            createImage(map[iter], 80 * n * camZ + camX, 80 * i * camZ + camY, camZ);
            iter++;
        }
    }
    createImage(buttonImage, canvas.width - 70, canvas.height - 130, 2.5);
}

function createImage(img, x, y, size) {
    c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * size, img.height * size);
}

gameLoop();

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 8;
    mouseY = e.clientY - 80;
})
canvas.addEventListener('mousedown', (e) => {
    clicking = true;
    clickX = e.clientX - 25;
    clickY = e.clientY - 171;
    if(clickX > canvas.width - 70 && clickX < canvas.width - 18) {
        if(camZ != 4.5 && clickY > canvas.height - 130 && clickY < canvas.height - 78) {
            camZ += 0.5;
        }
        
        if(camZ != 0.5 && clickY > canvas.height - 70 && clickY < canvas.height - 22) {
            camZ -= 0.5;
        }
    }
})
window.addEventListener('mouseup', () => {
    clicking = false;
    dispX += mouseX - clickX;
    dispY += mouseY - clickY;
})