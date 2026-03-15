const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const uiTemp = document.getElementById("temp")
const uiLife = document.getElementById("life")
const uiDb = document.getElementById("db")
const uiPhase = document.getElementById("phase")

let temp = 50
let life = 5
let database = 0
let combo = 0

let gameOver = false

const lanes = [
canvas.width/2 - 140,
canvas.width/2,
canvas.width/2 + 140
]

const keys = ["a","s","d"]

const hitLine = canvas.height - 140

let speed = 3.5

const notes = []

const types = [
"DATA","DATA",
"NOISE",
"CACHE",
"OLD"
]

function spawnNote(){

if(gameOver) return

const lane = Math.floor(Math.random()*3)

notes.push({
lane: lane,
type: types[Math.floor(Math.random()*types.length)],
y: -40
})

}

setInterval(spawnNote,700)

function updateUI(){

uiTemp.innerText = Math.floor(temp)
uiLife.innerText = life
uiDb.innerText = database

}

function endGame(text){

gameOver = true
uiPhase.innerText = text

}

document.addEventListener("keydown",(e)=>{

if(gameOver) return

const lane = keys.indexOf(e.key)

if(lane === -1) return

let target = null
let index = -1
let bestDist = 9999

for(let i=0;i<notes.length;i++){

if(notes[i].lane === lane){

const dist = Math.abs(notes[i].y - hitLine)

if(dist < bestDist && dist < 160){

bestDist = dist
target = notes[i]
index = i

}

}

}

if(!target) return

if(target.type === "DATA"){

temp += 5
life -= 1
combo = 0

}else{

combo++

let bonus = Math.floor(combo/3)

temp += 3 + bonus

}

notes.splice(index,1)

updateUI()

if(life <= 0){

life = 0
updateUI()
endGame("SYSTEM FAILURE")
return

}

if(temp >= 100){

endGame("WINTER SURVIVED")
return

}

})

function update(){

if(gameOver){

ctx.fillStyle="black"
ctx.font="40px monospace"
ctx.textAlign="center"
ctx.fillText(uiPhase.innerText,canvas.width/2,canvas.height/2)

return
}

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.textAlign="center"
ctx.font="28px monospace"

for(let i=notes.length-1;i>=0;i--){

const n = notes[i]

n.y += speed

ctx.fillStyle="black"
ctx.fillText(n.type,lanes[n.lane],n.y)

if(n.type==="DATA" && n.y > hitLine+60){

database++
notes.splice(i,1)

}

if(n.type!=="DATA" && n.y > hitLine+60){

life--
combo = 0
notes.splice(i,1)

}

}

temp -= 0.02

updateUI()

if(temp <=0){

endGame("SYSTEM FROZEN")
return

}

drawLanes()
drawCombo()

speed += 0.0005

requestAnimationFrame(update)

}

function drawLanes(){

ctx.strokeStyle="rgba(0,0,0,0.2)"

for(let i=0;i<3;i++){

ctx.beginPath()
ctx.moveTo(lanes[i],0)
ctx.lineTo(lanes[i],canvas.height)
ctx.stroke()

}

ctx.fillStyle="rgba(0,0,0,0.08)"
ctx.fillRect(
lanes[0]-100,
hitLine-80,
lanes[2]-lanes[0]+200,
160
)

ctx.strokeStyle="black"
ctx.lineWidth=6

ctx.beginPath()
ctx.moveTo(lanes[0]-100,hitLine)
ctx.lineTo(lanes[2]+100,hitLine)
ctx.stroke()

ctx.font="20px monospace"

ctx.fillStyle="black"

ctx.fillText("A",lanes[0],hitLine+40)
ctx.fillText("S",lanes[1],hitLine+40)
ctx.fillText("D",lanes[2],hitLine+40)

}

function drawCombo(){

if(combo > 1){

ctx.font="26px monospace"
ctx.fillStyle="red"
ctx.fillText("COMBO x"+combo,canvas.width/2,120)

}

}

update()
updateUI()