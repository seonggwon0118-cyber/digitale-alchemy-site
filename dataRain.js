const canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;

const columns = canvas.width / fontSize;

let mouse = {x:-1000,y:-1000};

document.addEventListener("mousemove",(e)=>{
mouse.x = e.clientX;
mouse.y = e.clientY;
});

const drops = [];

for(let i = 0; i < columns; i++){
drops[i] = Math.random() * canvas.height;
}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle = "#00ff9c";
ctx.font = fontSize + "px monospace";

for(let i = 0; i < drops.length; i++){

const text = letters[Math.floor(Math.random()*letters.length)];

let x = i * fontSize;
let y = drops[i] * fontSize;

let dx = x - mouse.x;
let dy = y - mouse.y;

let dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 80){
drops[i] -= 2;
}

ctx.fillText(text,x,y);

if(drops[i] * fontSize > canvas.height && Math.random() > 0.975){
drops[i] = 0;
}

drops[i]++;

}

requestAnimationFrame(draw);

}

draw();