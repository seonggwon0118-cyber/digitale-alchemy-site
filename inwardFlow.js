const canvas = document.getElementById("flow");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {x:-9999,y:-9999};

document.addEventListener("mousemove", e=>{
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

let time = 0;

function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const centerX = canvas.width/2;
  const centerY = canvas.height/2;

  for(let r=0;r<canvas.width;r+=12){

    let radius = r - (time % 30);

    if(radius < 0) continue;

ctx.beginPath();

let first = true;

for(let a=0;a<Math.PI*2;a+=0.08){

  let x = centerX + Math.cos(a)*radius;
  let y = centerY + Math.sin(a)*radius;

  // wave distortion
  let wave = Math.sin(a*6 + time*0.1) * 10;
  x += Math.cos(a)*wave;
  y += Math.sin(a)*wave;

  // mouse influence
  let dx = x - mouse.x;
  let dy = y - mouse.y;
  let dist = Math.sqrt(dx*dx + dy*dy);

  if(dist < 200){
    x += (dx/dist)*(200-dist)*0.5;
    y += (dy/dist)*(200-dist)*0.5;
  }

  if(first){
    ctx.moveTo(x,y);
    first = false;
  } else {
    ctx.lineTo(x,y);
  }

}

ctx.closePath();
ctx.strokeStyle="rgba(0,255,156,0.35)";
ctx.lineWidth=3;
ctx.lineCap="round";
ctx.stroke();
  }

  time += 1;

  requestAnimationFrame(draw);
}

draw();