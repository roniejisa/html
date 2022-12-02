const colorPicker = document.querySelector('[type="color"]');
const eraser = document.querySelector(".eraser");
const sizePlus = document.querySelector(".plus");
const sizeMinus = document.querySelector(".minus");
const save = document.querySelector(".save");
const clear = document.querySelector(".clear");
const size = document.querySelector('input[type="text"]');
const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 700;
canvas.style.border = "1px solid";
let radius = 16;
updateSize(5);
let colorPaint = colorPicker.value  ;
const ctx = canvas.getContext("2d");
let isDrawing = false;
let currentPos = {
    x: window.innerWidth,
    y: window.innerHeight,
};

canvas.addEventListener("mousedown", function (e) {
    currentPos = {
        x: e.offsetX,
        y: e.offsetY,
    };
    isDrawing = true;
});
canvas.addEventListener("mouseup", function (e) {
    isDrawing = false;
});
canvas.addEventListener("mousemove", function (e) {
    const currentPosAfter = {
        x: e.offsetX,
        y: e.offsetY,
    };
    if (isDrawing) {
        console.log(colorPaint);
        ctx.beginPath();
        ctx.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colorPaint
        ctx.fill()

        ctx.beginPath();
        ctx.moveTo(currentPos.x, currentPos.y);
        ctx.lineTo(currentPosAfter.x, currentPosAfter.y);
        ctx.strokeStyle = colorPaint
        ctx.lineWidth = radius * 2;
        ctx.stroke();


        currentPos = {
            x: currentPosAfter.x,
            y: currentPosAfter.y,
        };
    }
});

colorPicker.addEventListener("change", function (e) {
    colorPaint = e.target.value;
});

sizePlus.addEventListener("click", function (e) {
    updateSize(Number(size.value) + 1);
});

sizeMinus.addEventListener("click", function (e) {
    updateSize(Number(size.value) - 1);
});

size.addEventListener('change', e => updateSize(Number(e.target.value)));

function updateSize(number){
    radius = number;
    size.value = number
}


eraser.addEventListener("click", function (e) {
    if (!eraser.classList.contains("active")) {
        colorPaint = 'white'
    }else{
        colorPaint = colorPicker.value 
    }
    eraser.classList.toggle('active');
});

clear.onclick = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

save.onclick = function(){
    var output = canvas.toDataURL();
    save.setAttribute('href', output);
    
}