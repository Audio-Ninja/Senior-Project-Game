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
let redWarriors = [2,5,4,0,2,5, 4,3,3,0,4,3];
let blueWarriors = [1,5,3,0,1,5, 1,6,3,0,1,6];
let iter, clicking = true, clickX, clickY, mouseX, mouseY, dispX = 0, dispY = 0;
let selectedRow, selectedCol, prevRow = -1, prevCol = -1, unitRow = -1, unitCol = -1, animating = false;
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
    if(clicking == true || animating == true) {
        animating = false;
        if(clicking == true) {
            camX = dispX + mouseX - clickX;
            camY = dispY + mouseY - clickY; 
        }
        c.fillStyle = "black";
        c.fillRect(0,0,canvas.width,canvas.height);
        iter = 0;
        for(let i = 0; i < mapRows; i++) {
            for(let n = 0; n < mapCols; n++) {
                createImage(map[iter], 80 * n * camZ + camX, 80 * i * camZ + camY, camZ);
                iter++;
            }
        }
        for(let i = 0; i < redWarriors.length; i+=6) {
            if(redWarriors[i+3] != 0) {
                animating = true;
                let split = redWarriors[i+3].split("b");
                split.pop();
                for(let c = 0; c < split.length; c++) {
                    split[c] = Number(split[c]);
                }
                redWarriors[i] = Number(redWarriors[i]);
                redWarriors[i+1] = Number(redWarriors[i+1]);
                redWarriors[i] += (split[2] - split[0]) / 10;
                redWarriors[i+1] += (split[3] - split[1]) / 10;
                redWarriors[i] = redWarriors[i].toFixed(2);
                redWarriors[i+1] = redWarriors[i+1].toFixed(2);
                if(redWarriors[i] == split[2] && redWarriors[i+1] == split[3]) {
                    let del = 2;
                    let d = 0;
                    while(del != 0) {
                        if(redWarriors[i+3].charAt(d) == "b") {
                            del--;
                        }
                        d++;
                    }
                    redWarriors[i+3] = redWarriors[i+3].substr(d);
                    split = redWarriors[i+3].split("b");
                    if(split.length == 3) {
                        selectedCol = -1;
                        selectedRow = -1;
                        prevRow = -1;
                        prevCol = -1;
                        unitRow = -1;
                        unitCol = -1;
                        redWarriors[i+3] = 0;
                        redWarriors[i] = Math.round(Number(redWarriors[i]));
                        redWarriors[i+1] = Math.round(Number(redWarriors[i+1]));
                        redWarriors[i+4] = redWarriors[i];
                        redWarriors[i+5] = redWarriors[i+1];
                    }
                }
            }
            if(clicking == true) {
                if(mouseX > redWarriors[i+1] * 80 * camZ + camX && mouseY > redWarriors[i] * 80 * camZ + camY &&
                    mouseX < (redWarriors[i+1] * 80 * camZ + camX) + 80 * camZ && mouseY < (redWarriors[i] * 80 * camZ + camY) + 80 * camZ) {
                    unitRow = redWarriors[i];
                    unitCol = redWarriors[i+1];
                }
            }
            if(redWarriors[i] == unitRow && redWarriors[i+1] == unitCol && redWarriors[i+3] == 0) {
                let moveOptions = [];
                let checkSpots = [redWarriors[i+4], redWarriors[i+5]];
                let temp = [];
                let path = [];
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
                        let open = isSpotOpen(checkSpots[r+1], checkSpots[r], redWarriors[i+5], redWarriors[i+4], moveOptions);
                        if(open == true) {
                            temp.push(checkSpots[r], checkSpots[r+1]);
                            for(let g = 0; g < redWarriors.length; g+=6) {
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
                    if(m != redWarriors[i+2] - 1) {
                        moveOptions.push("br", "br");
                    }
                }
                for(let w = 0; w < moveOptions.length; w+=2) {
                    if(moveOptions[w] != "br") {
                        if(mouseX > moveOptions[w+1] * 80 * camZ + camX && mouseY > moveOptions[w] * 80 * camZ + camY &&
                            mouseX < (moveOptions[w+1] * 80 * camZ + camX) + 80 * camZ && mouseY < (moveOptions[w] * 80 * camZ + camY) + 80 * camZ) {
                            selectedRow = moveOptions[w];
                            selectedCol = moveOptions[w+1];
                        }
                    }
                }
                let nextRow = selectedRow, nextCol = selectedCol;
                path.unshift(nextRow, nextCol);
                if(redWarriors[i+2] != 1) {
                    let section = 1;
                    let currentSection = 0;
                    for(let f = 0; f < moveOptions.length; f+=2) {
                        if(moveOptions[f] == "br" && currentSection == 0) {
                            section++;
                        } else if(moveOptions[f] == selectedRow && moveOptions[f+1] == selectedCol) {
                            currentSection = 1;
                        }
                    }
                    currentSection = redWarriors[i+2];
                    if(section != 1) {
                        for(let f = moveOptions.length - 1; f > -1; f-=2) {
                            if(moveOptions[f] == "br") {
                                currentSection--;
                            } else if(currentSection < section) {
                                if(Math.abs(nextRow - moveOptions[f-1]) == 1 && Math.abs(nextCol - moveOptions[f]) == 0 ||
                                Math.abs(nextCol - moveOptions[f]) == 1 && Math.abs(nextRow - moveOptions[f-1]) == 0 ) {
                                    nextRow = moveOptions[f-1];
                                    nextCol = moveOptions[f];
                                    path.unshift(nextRow, nextCol);
                                } 
                            }
                        }
                    }
                     
                } 
                for(let w = 0; w < moveOptions.length; w+=2) {
                    if(moveOptions[w] != "br") {
                        if(isPartOfPath(moveOptions[w], moveOptions[w+1], path) == true) {
                            c.fillStyle = "hsl(0, 0%, 90%, 0.4)";
                        } else {
                            c.fillStyle = "hsl(0, 0%, 90%, 0.2)";
                        }
                        c.fillRect(80 * moveOptions[w+1] * camZ + camX, 80 * moveOptions[w] * camZ + camY, 80 * camZ, 80 * camZ);
                    }
                }
                if(prevRow == selectedRow && prevCol == selectedCol && selectedRow != -1 && redWarriors[i+3] == 0) {
                    redWarriors[i+3] = "";
                    redWarriors[i+3] = redWarriors[i+4] + "b" + redWarriors[i+5] + "b";
                    for(let w = 0; w < path.length; w+=2) {
                        redWarriors[i+3] += path[w] + "b" + path[w+1] + "b";
                    }
                    selectedRow = -1;
                    selectedCol = -1;
                    prevRow = -1;
                    prevCol = -1;
                }
            }
            createImage(warriorRed, 80 * redWarriors[i+1] * camZ + camX, 80 * redWarriors[i] * camZ + camY, camZ);
        }
        
        for(let i = 0; i < blueWarriors.length; i+=6) {
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
    for(let g = 0; g < blueWarriors.length; g+=6) {
        if(spotY == blueWarriors[g] && spotX == blueWarriors[g+1]) {
            return false;
        }
    }
    return value;
}

function isPartOfPath(row, col, list) {
    for(let i = 0; i < list.length; i+=2) {
        if(list[i] == row && list[i+1] == col) {
            return true;
        }
    }
    return false;
}

gameLoop();

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - 25;
    mouseY = e.clientY - 171;
});
window.addEventListener('mousedown', (e) => {
    clicking = true;
    clickX = e.clientX - 25;
    clickY = e.clientY - 171;
    if(clickX > canvas.width - 70 && clickX < canvas.width - 18) {
        if(camZ != 4.5 && clickY > canvas.height - 96 && clickY < canvas.height - 45) {
            camZ += 0.5;
        }
        
        if(camZ != 0.5 && clickY > canvas.height - 37 && clickY < canvas.height + 13) {
            camZ -= 0.5;
        }
    }
});
window.addEventListener('mouseup', () => {
    clicking = false;
    dispX += mouseX - clickX;
    dispY += mouseY - clickY;
    prevRow = selectedRow;
    prevCol = selectedCol;
    selectedRow = -1;
    selectedCol = -1;
});