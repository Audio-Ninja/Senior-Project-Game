const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
let testImage = new Image();
testImage.src = "stuff.png";

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    c.drawImage(testImage.image, 0, 0, testImage.image.width, testImage.image.height, testImage.position.x, testImage.position.y, testImage.image.width * testImage.scale, testImage.image.height * testImage.scale)
}

gameLoop();