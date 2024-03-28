const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
let surfaceImg = new Image();
surfaceImg.src = "RockSurface.png";
let surface2Img = new Image();
surface2Img.src = "RockSurf2.png";
let warriorRed = new Image();
warriorRed.src = "Warrior_Red.png";
let warriorBlue = new Image();
warriorBlue.src = "Warrior_Blue.png";
let buttonImage = new Image();
buttonImage.src = "Zoom_buttons.svg";
let mapRows = 10, mapCols = 15;
let test;
let map = [];
let redWarriors = [2,5,4, 4,3,2];
let blueWarriors = [1,5,3];
let iter, clicking = true, clickX, clickY, mouseX, mouseY, dispX = 0, dispY = 0, mouseMoving, prevX = 5, prevY = 5;
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
    if(prevX == mouseX && prevY == mouseY) {
        mouseMoving = false;
    } else {
        mouseMoving = true;
    }
    prevX = mouseX;
    prevY = mouseY;
    console.log(mouseMoving);
    if(clicking == true) {
        camX = dispX + mouseX - clickX;
        camY = dispY + mouseY - clickY;

        c.fillStyle = "black";
        c.fillRect(0,0,canvas.width,canvas.height);
        iter = 0;
        for(let i = 0; i < mapRows; i++) {
            for(let n = 0; n < mapCols; n++) {
                createImage(map[iter], 80 * n * camZ + camX, 80 * i * camZ + camY, camZ);
                iter++;
            }
        }
        for(let i = 0; i < redWarriors.length; i+=3) {
            if(i == 0) {
                let moveOptions = [];
                let checkSpots = [redWarriors[i], redWarriors[i+1]];
                let temp = [];
                for(let m = 0; m < redWarriors[i+2]; m++) {
                    for(let r = 0; r < checkSpots.length; r+=2) {
                        temp.push(checkSpots[r] + 1, checkSpots[r+1]);
                        temp.push(checkSpots[r], checkSpots[r+1] + 1);
                        temp.push(checkSpots[r] - 1, checkSpots[r+1]);
                        temp.push(checkSpots[r], checkSpots[r+1] - 1);
                    }
                    checkSpots = temp;
                    temp = [];
                    for(let r = 0; r < checkSpots.length; r+=2) {
                        let open = isSpotOpen(checkSpots[r+1], checkSpots[r], redWarriors[i+1], redWarriors[i], moveOptions);
                        if(open == true) {
                            temp.push(checkSpots[r], checkSpots[r+1]);
                            for(let g = 0; g < redWarriors.length; g+=3) {
                                if(checkSpots[r] == redWarriors[g] && checkSpots[r+1] == redWarriors[g+1]) {
                                    open = false;
                                }
                            }
                            if(open == true) {
                               moveOptions.push(checkSpots[r], checkSpots[r+1]); 
                            }
                            
                        }
                    }
                    checkSpots = temp;
                    temp = [];
                }
                for(let w = 0; w < moveOptions.length; w+=2) {
                    if(clickX > moveOptions[w+1] * 80 * camZ + camX && clickY > moveOptions[w] * 80 * camZ + camY && mouseMoving == false &&
                        clickX < (moveOptions[w+1] * 80 * camZ + camX) + 80 * camZ && clickY < (moveOptions[w] * 80 * camZ + camY) + 80 * camZ) {
                        c.fillStyle = "hsl(0, 0%, 90%, 0.4)";
                    } else {
                        c.fillStyle = "hsl(0, 0%, 90%, 0.2)";
                    }
                    c.fillRect(80 * moveOptions[w+1] * camZ + camX, 80 * moveOptions[w] * camZ + camY, 80 * camZ, 80 * camZ);
                } 
            }
            createImage(warriorRed, 80 * redWarriors[i+1] * camZ + camX, 80 * redWarriors[i] * camZ + camY, camZ);
        }
        
        for(let i = 0; i < blueWarriors.length; i+=3) {
            createImage(warriorBlue, 80 * blueWarriors[i+1] * camZ + camX, 80 * blueWarriors[i] * camZ + camY, camZ);
        }
        createImage(buttonImage, canvas.width - 70, canvas.height - 130, 2.5);
    }
}

function createImage(img, x, y, size) {
    c.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * size, img.height * size);
}

function isSpotOpen(spotX, spotY, unitX, unitY, spotsList) {
    let value = true;
    if(spotX < 0 || spotY < 0 || spotX > mapCols - 1 || spotY > mapRows - 1) {
        return false;
    }
    if(spotY == unitY && spotX == unitX) {
        return false;
    }
    for(let g = 0; g < spotsList.length; g+=2) {
        if(spotY == spotsList[g] && spotX == spotsList[g+1]) {
            return false;
        }
    }
    for(let g = 0; g < blueWarriors.length; g+=3) {
        if(spotY == blueWarriors[g] && spotX == blueWarriors[g+1]) {
            return false;
        }
    }
    return value;
}

gameLoop();

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 25;
    mouseY = e.clientY - 171;
});
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
});
window.addEventListener('mouseup', () => {
    clicking = false;
    dispX += mouseX - clickX;
    dispY += mouseY - clickY;
});