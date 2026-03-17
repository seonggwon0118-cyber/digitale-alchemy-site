const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

/* ---------- canvas 설정 ---------- */

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const isMobile = window.innerWidth < 700

/* ---------- UI ---------- */

const uiTemp = document.getElementById("temp")
const uiLife = document.getElementById("life")
const uiDb = document.getElementById("db")
const uiTime = document.getElementById("time")

/* ---------- 상태 ---------- */

let temp = 50
let life = 5
let database = 0
let combo = 0
let time = 60

let gameOver = false

/* ---------- DATA 이미지 ---------- */

const data5 = new Image()
data5.src = "image/data5.png"

const data6 = new Image()
data6.src = "image/data6.png"

/* ---------- 화로 이미지 ---------- */

const furnaceOff = new Image()
furnaceOff.src = "image/furnace_off.png"

const furnaceSmall = new Image()
furnaceSmall.src = "image/furnace_small.png"

const furnaceMedium = new Image()
furnaceMedium.src = "image/furnace_medium.png"

const furnaceBig = new Image()
furnaceBig.src = "image/furnace_big.png"

/* ---------- 레인 ---------- */

const laneOffset = isMobile ? 80 : 140

const lanes = [
canvas.width / 2 - laneOffset,
canvas.width / 2,
canvas.width / 2 + laneOffset
]

const keys = ["a","s","d"]
const hitLine = canvas.height - (isMobile ? 110 : 140)

let speed = 3.5
const notes = []

/* ---------- 노트 타입 ---------- */

const types = [
"DATA","DATA",
"BRUIT",
"CACHE",
"OBSOLETE"
]

/* ---------- 노트 생성 ---------- */

function spawnNote(){

if(gameOver) return

const lane = Math.floor(Math.random() * 3)
const type = types[Math.floor(Math.random() * types.length)]

notes.push({
lane: lane,
type: type,
y: -40,
img: Math.random() < 0.5 ? data5 : data6
})

}

setInterval(spawnNote,700)

/* ---------- UI ---------- */

function updateUI(){
uiTemp.innerText = Math.floor(temp) + "°"
uiLife.innerText = life
uiDb.innerText = database
uiTime.innerText = time
}

updateUI()

/* ---------- 타이머 ---------- */

setInterval(()=>{

if(gameOver) return

time--

if(time <= 0){

time = 0
gameOver = true

setTimeout(()=>{

if(temp >= 100){
alert("HIVER TERMINÉ")
}else{
alert("ÉCHEC")
}

location.reload()

},400)

}

updateUI()

},1000)

/* ---------- 노트 판정 ---------- */

function hitLane(lane){

if(gameOver) return

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
let bonus = Math.floor(combo / 3)
temp += 3 + bonus

}

notes.splice(index,1)
updateUI()

if(life <= 0){

life = 0
updateUI()

gameOver = true

setTimeout(()=>{
alert("ÉCHEC")
location.reload()
},400)

return

}

if(temp >= 100){

gameOver = true

setTimeout(()=>{
alert("HIVER TERMINÉ")
location.reload()
},400)

return

}

}

/* ---------- 키 입력 ---------- */

document.addEventListener("keydown",(e)=>{

const lane = keys.indexOf(e.key)

if(lane !== -1){
hitLane(lane)
}

})

/* ---------- 모바일 터치 ---------- */

canvas.addEventListener("touchstart",(e)=>{

const touch = e.touches[0]
const x = touch.clientX

let lane = 0

if(x < canvas.width / 3){
lane = 0
}else if(x < canvas.width * 2 / 3){
lane = 1
}else{
lane = 2
}

hitLane(lane)
e.preventDefault()

},{passive:false})

/* ---------- 화로 상태 ---------- */

function getFurnace(){

if(gameOver && temp >= 100) return furnaceBig
if(combo >= 10) return furnaceMedium
if(temp >= 55) return furnaceSmall

return furnaceOff

}

/* ---------- 비율 유지 이미지 ---------- */

function drawImageRatio(img,x,y,height){

const ratio = img.width / img.height
const width = height * ratio

ctx.drawImage(
img,
x - width / 2,
y - height / 2,
width,
height
)

}

/* ---------- 콤보 ---------- */

function drawCombo(){

if(combo > 1){

ctx.font = isMobile ? "22px monospace" : "28px monospace"
ctx.fillStyle = "white"
ctx.textAlign = "center"

ctx.fillText(
"COMBO x" + combo,
canvas.width / 2,
isMobile ? 90 : 120
)

}

}

/* ---------- 레인 ---------- */

function drawLanes(){

ctx.strokeStyle = "rgba(255,255,255,0.2)"

for(let i=0;i<3;i++){

ctx.beginPath()
ctx.moveTo(lanes[i],0)
ctx.lineTo(lanes[i],canvas.height)
ctx.stroke()

}

ctx.fillStyle = "rgba(255,255,255,0.08)"
ctx.fillRect(
lanes[0] - 100,
hitLine - 80,
lanes[2] - lanes[0] + 200,
160
)

ctx.strokeStyle = "white"
ctx.lineWidth = 6

ctx.beginPath()
ctx.moveTo(lanes[0] - 100, hitLine)
ctx.lineTo(lanes[2] + 100, hitLine)
ctx.stroke()

ctx.font = isMobile ? "16px monospace" : "20px monospace"
ctx.fillStyle = "white"

ctx.fillText("A",lanes[0],hitLine + 40)
ctx.fillText("S",lanes[1],hitLine + 40)
ctx.fillText("D",lanes[2],hitLine + 40)

}

/* ---------- 게임 루프 ---------- */

function update(){

ctx.clearRect(0,0,canvas.width,canvas.height)

/* 화로 */

const furnace = getFurnace()
const furnaceSize = isMobile ? 320 : 600

drawImageRatio(
furnace,
canvas.width * 0.15,
canvas.height * 0.5,
furnaceSize
)

drawImageRatio(
furnace,
canvas.width * 0.85,
canvas.height * 0.5,
furnaceSize
)

/* 노트 */

ctx.textAlign = "center"
ctx.font = isMobile ? "22px monospace" : "28px monospace"

for(let i=notes.length-1;i>=0;i--){

const n = notes[i]
n.y += speed

if(n.type === "DATA"){

drawImageRatio(
n.img,
lanes[n.lane],
n.y,
isMobile ? 60 : 90
)

}else{

ctx.fillStyle = "white"
ctx.fillText(n.type, lanes[n.lane], n.y)

}

if(n.type === "DATA" && n.y > hitLine + 60){
database++
notes.splice(i,1)
}

if(n.type !== "DATA" && n.y > hitLine + 60){
life--
combo = 0
notes.splice(i,1)
}

}

/* 상태 업데이트 */

temp -= 0.02
updateUI()

if(temp <= 0){

gameOver = true

setTimeout(()=>{
alert("ÉCHEC")
location.reload()
},400)

return

}

/* 레인과 콤보는 항상 마지막에 다시 그림 */

drawLanes()
drawCombo()

speed += 0.0005

requestAnimationFrame(update)

}

update()