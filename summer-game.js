const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

function resize(){
canvas.width = window.innerWidth
canvas.height = window.innerHeight
}
resize()
window.addEventListener("resize",resize)

let score = 0
let time = 30
let lineDown = false
let gameOver = false

const fish = []

/* 이미지 */

const carpImg = new Image()
carpImg.src = "image/carp.png"

const koiImg = new Image()
koiImg.src = "image/koi.png"

const canImg = new Image()
canImg.src = "image/can.png"

const dataImg3 = new Image()
dataImg3.src = "image/data3.png"

const dataImg4 = new Image()
dataImg4.src = "image/data4.png"

/* 낚시 바늘 */

const hook = {
x: canvas.width/2,
y: canvas.height*0.35,
size:12
}

/* 좌우 이동 제한 */

const waterLeft = canvas.width * 0.15
const waterRight = canvas.width * 0.85

document.addEventListener("mousemove",(e)=>{

let x = e.clientX

if(x < waterLeft) x = waterLeft
if(x > waterRight) x = waterRight

hook.x = x

})

document.addEventListener("mousedown",()=>{
lineDown = true
})

document.addEventListener("mouseup",()=>{
lineDown = false
})

/* 타이머 */

const timer = setInterval(()=>{

if(gameOver) return

time--

if(time < 0) time = 0

document.getElementById("time").innerText = "TEMPS : " + time

if(time === 0){

gameOver = true

setTimeout(()=>{

if(score >= 100){
alert("ÉTÉ TERMINÉ")
}else{
alert("ÉCHEC")
}

location.reload()

},500)

}

},1000)

/* 스폰 */

function spawnFish(){

if(gameOver) return

let r = Math.random()
const dir = Math.random() < 0.5 ? 1 : -1

let obj = {}

if(r < 0.40){

obj = {
type:"small",
x: dir === 1 ? -40 : canvas.width + 40,
y:Math.random()*canvas.height*0.4 + canvas.height*0.4,
vx:(2 + Math.random()*1.5) * dir,
size:30
}

}

else if(r < 0.60){

obj = {
type:"trash",
x: dir === 1 ? -40 : canvas.width + 40,
y:Math.random()*canvas.height*0.4 + canvas.height*0.4,
vx:(2 + Math.random()*1.5) * dir,
size:30
}

}

else if(r < 0.75){

obj = {
type:"big",
x: dir === 1 ? -40 : canvas.width + 40,
y:Math.random()*canvas.height*0.4 + canvas.height*0.4,
vx:(1.5) * dir,
size:42
}

}

else if(r < 0.875){

obj = {
type:"data3",
x: dir === 1 ? -40 : canvas.width + 40,
y:Math.random()*canvas.height*0.4 + canvas.height*0.4,
vx:(2) * dir,
size:36
}

}

else{

obj = {
type:"data4",
x: dir === 1 ? -40 : canvas.width + 40,
y:Math.random()*canvas.height*0.4 + canvas.height*0.4,
vx:(2) * dir,
size:36
}

}

fish.push(obj)

}

setInterval(spawnFish,1200)

/* 게임 루프 */

function update(){

ctx.clearRect(0,0,canvas.width,canvas.height)

/* 낚시줄 */

if(lineDown){
hook.y += 5
}else{
hook.y -= 4
}

if(hook.y < canvas.height*0.35){
hook.y = canvas.height*0.35
}

if(hook.y > canvas.height*0.8){
hook.y = canvas.height*0.8
}

/* 물고기 */

fish.forEach((f,i)=>{

f.x += f.vx

let img = null

if(f.type==="small") img = carpImg
if(f.type==="big") img = koiImg
if(f.type==="trash") img = canImg
if(f.type==="data3") img = dataImg3
if(f.type==="data4") img = dataImg4

let w = f.size * 2
let h = img.height / img.width * w

ctx.save()

if(f.vx < 0){
ctx.scale(-1,1)
ctx.drawImage(img,-f.x-w/2,f.y-h/2,w,h)
}else{
ctx.drawImage(img,f.x-w/2,f.y-h/2,w,h)
}

ctx.restore()

/* 충돌 */

const dx = f.x - hook.x
const dy = f.y - hook.y
const dist = Math.sqrt(dx*dx + dy*dy)

if(dist < f.size + hook.size){

fish.splice(i,1)

if(f.type==="small"){
score += 3
}

if(f.type==="big"){
score += 5
}

if(f.type==="trash"){
score -= 3
time -= 3
}

if(f.type==="data3"){
time += 4
}

if(f.type==="data4"){
time += 4
}

if(time < 0) time = 0

document.getElementById("score").innerText = "POISSONS : " + score

/* 목표 점수 도달 */

if(score >= 100 && !gameOver){

gameOver = true

setTimeout(()=>{

alert("ÉTÉ TERMINÉ")
location.reload()

},500)

}

}

if(f.x > canvas.width + 50 || f.x < -50){
fish.splice(i,1)
}

})

/* 낚시줄 */

ctx.strokeStyle="white"
ctx.lineWidth=2

ctx.beginPath()
ctx.moveTo(hook.x,0)
ctx.lineTo(hook.x,hook.y)
ctx.stroke()

ctx.fillStyle="white"

ctx.beginPath()
ctx.arc(hook.x,hook.y,hook.size,0,Math.PI*2)
ctx.fill()

if(gameOver) return

requestAnimationFrame(update)

}

update()