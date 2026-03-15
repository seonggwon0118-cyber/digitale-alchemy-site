const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let phase = "clean"

let cleanTime = 30
let shakeTime = 20

let virusCount = 0
let fallCount = 0

let gameOver = false
let spawnEnabled = true

const viruses = []
const leaves = []
const groundLeaves = []

let dragging = null

const tree = {
x: canvas.width/2,
y: canvas.height/2,
size:120
}

const trash = {
x: canvas.width-120,
y: canvas.height-120,
size:40
}

function spawnVirus(){

if(phase !== "clean" || gameOver) return

virusCount++

viruses.push({
x: tree.x + (Math.random()*200-100),
y: tree.y + (Math.random()*200-100),
size:12
})

document.getElementById("virus").innerText = virusCount

}

setInterval(spawnVirus,2000)

function updateTimer(){

if(gameOver) return

if(phase === "clean"){

cleanTime--

document.getElementById("time").innerText = cleanTime

if(cleanTime <= 0){

phase = "shake"
document.getElementById("phase").innerText = "SHAKE TREE"
document.getElementById("time").innerText = shakeTime

}

}

else if(phase === "shake"){

shakeTime--

document.getElementById("time").innerText = shakeTime

if(shakeTime <= 0){

spawnEnabled = false

}

}

}

setInterval(updateTimer,1000)

canvas.addEventListener("mousedown",(e)=>{

if(gameOver || phase !== "clean") return

const mx = e.clientX
const my = e.clientY

viruses.forEach(v=>{

const dx = v.x - mx
const dy = v.y - my

if(Math.sqrt(dx*dx+dy*dy)<v.size){
dragging=v
}

})

})

canvas.addEventListener("mousemove",(e)=>{

if(dragging){

dragging.x = e.clientX
dragging.y = e.clientY

}

})

canvas.addEventListener("mouseup",()=>{

if(!dragging) return

const dx = dragging.x-trash.x
const dy = dragging.y-trash.y

if(Math.sqrt(dx*dx+dy*dy)<trash.size){

viruses.splice(viruses.indexOf(dragging),1)

virusCount--

document.getElementById("virus").innerText = virusCount

}

dragging=null

})

canvas.addEventListener("click",()=>{

if(phase !== "shake") return
if(!spawnEnabled) return
if(gameOver) return

leaves.push({
x: tree.x + (Math.random()*200-100),
y: tree.y,
vy:3
})

})

function drawLeaf(x,y,r){

ctx.fillStyle="#ffd84a"

ctx.beginPath()

ctx.moveTo(x,y-r)
ctx.lineTo(x+r*0.4,y-r*0.3)
ctx.lineTo(x+r,y)
ctx.lineTo(x+r*0.4,y+r*0.3)
ctx.lineTo(x,y+r)
ctx.lineTo(x-r*0.4,y+r*0.3)
ctx.lineTo(x-r,y)
ctx.lineTo(x-r*0.4,y-r*0.3)

ctx.closePath()
ctx.fill()

}

function update(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="#5c3b1e"

ctx.beginPath()
ctx.arc(tree.x,tree.y,tree.size,0,Math.PI*2)
ctx.fill()

if(phase==="clean"){

viruses.forEach(v=>{

ctx.fillStyle="black"

ctx.beginPath()
ctx.arc(v.x,v.y,v.size,0,Math.PI*2)
ctx.fill()

})

}

ctx.fillStyle="gray"

ctx.beginPath()
ctx.arc(trash.x,trash.y,trash.size,0,Math.PI*2)
ctx.fill()

leaves.forEach((l,i)=>{

l.y+=l.vy
l.x+=Math.sin(l.y*0.05)

drawLeaf(l.x,l.y,10)

if(l.y>canvas.height-60){

groundLeaves.push(l)
leaves.splice(i,1)

fallCount++

document.getElementById("fall").innerText = fallCount

}

})

groundLeaves.forEach((l,i)=>{

drawLeaf(l.x,l.y-(Math.floor(i/8)*3),10)

})

if(!spawnEnabled && leaves.length===0 && !gameOver){

gameOver = true

if(fallCount >= 100){

document.getElementById("phase").innerText = "AUTUMN COMPLETE"

}else{

document.getElementById("phase").innerText = "SYSTEM FAILURE"

}

}

requestAnimationFrame(update)

}

update()