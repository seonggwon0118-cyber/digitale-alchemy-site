const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

/* 이미지 */

const treeImg = new Image()
treeImg.src = "image/autumn_tree.png"

const treeEmptyImg = new Image()
treeEmptyImg.src = "image/autumn_tree_empty.png"

const virusImg = new Image()
virusImg.src = "image/virus_warning.png"

const trashClosedImg = new Image()
trashClosedImg.src = "image/trash_closed.png"

const trashOpenImg = new Image()
trashOpenImg.src = "image/trash_open.png"

let currentTrashImg = trashClosedImg

const leaf1 = new Image()
leaf1.src = "image/leaf_data1.png"

const leaf2 = new Image()
leaf2.src = "image/leaf_data2.png"

/* 상태 */

let phase = "clean"

let cleanTime = 30
let shakeTime = 10

let virusCount = 0
let fallCount = 0

let gameOver = false
let endResult = null

const viruses = []
const leaves = []
const groundLeaves = []

let dragging = null
let leafToggle = false
let lastShake = 0

/* 나무 */

const tree = {
x: canvas.width/2,
y: canvas.height/2,
width:800,
height:800
}

/* 휴지통 */

const trash = {
x: canvas.width-130,
y: canvas.height-130,
size:65,
width:110,
height:110
}

/* UI 업데이트 */

function updateUI(){
document.getElementById("time").innerText = phase === "clean" ? cleanTime : shakeTime
document.getElementById("virus").innerText = virusCount
document.getElementById("fall").innerText = fallCount
}

updateUI()

/* 바이러스 생성 */

function spawnViruses(){

for(let i=0;i<15;i++){
viruses.push({
x: tree.x + (Math.random()*tree.width - tree.width/2),
y: tree.y + (Math.random()*tree.height/2 - tree.height/4),
size:30
})
}

virusCount = viruses.length
updateUI()

}

spawnViruses()

/* 타이머 */

function updateTimer(){

if(gameOver) return

if(phase === "clean"){

cleanTime--

if(cleanTime < 0) cleanTime = 0

if(cleanTime === 0 && virusCount > 0){
gameOver = true

setTimeout(()=>{
alert("ÉCHEC")
location.reload()
},400)
}

}

else if(phase === "shake"){

shakeTime--

if(shakeTime < 0) shakeTime = 0

if(shakeTime === 0){
phase = "end"
}

}

updateUI()

}

setInterval(updateTimer,1000)

/* ---------- 공통 좌표 함수 ---------- */

function pickVirus(mx,my){

for(let i=viruses.length-1;i>=0;i--){

const v = viruses[i]
const dx = v.x - mx
const dy = v.y - my

if(Math.sqrt(dx*dx + dy*dy) < v.size){
dragging = v
break
}

}

}

function moveDragging(mx,my){

if(!dragging) return

dragging.x = mx
dragging.y = my

}

function releaseDragging(){

if(!dragging) return

const dx = dragging.x - trash.x
const dy = dragging.y - trash.y

if(Math.sqrt(dx*dx + dy*dy) < trash.size){

const index = viruses.indexOf(dragging)

if(index !== -1){
viruses.splice(index,1)
virusCount--
updateUI()
}

currentTrashImg = trashOpenImg

setTimeout(()=>{
currentTrashImg = trashClosedImg
},250)

if(virusCount === 0 && phase === "clean"){
phase = "shake"
updateUI()
}

}

dragging = null

}

function shakeTree(mx,my){

if(phase !== "shake") return
if(gameOver) return

if(
mx < tree.x - tree.width/2 ||
mx > tree.x + tree.width/2 ||
my < tree.y - tree.height/2 ||
my > tree.y + tree.height/2
){
return
}

const now = Date.now()

if(now - lastShake < 120) return

lastShake = now

for(let i=0;i<2;i++){

leafToggle = !leafToggle

leaves.push({
x: tree.x + (Math.random()*tree.width - tree.width/2),
y: tree.y - 40,
vy: 3 + Math.random()*1.2,
drift: Math.random()*1.5 + 1,
img: leafToggle ? leaf1 : leaf2,
size: 80
})

}

}

/* ---------- PC 입력 ---------- */

canvas.addEventListener("mousedown",(e)=>{

if(gameOver || phase !== "clean") return

pickVirus(e.clientX,e.clientY)

})

canvas.addEventListener("mousemove",(e)=>{

moveDragging(e.clientX,e.clientY)

})

canvas.addEventListener("mouseup",()=>{

releaseDragging()

})

canvas.addEventListener("click",(e)=>{

shakeTree(e.clientX,e.clientY)

})

/* ---------- 모바일 입력 ---------- */

canvas.addEventListener("touchstart",(e)=>{

const touch = e.touches[0]
if(!touch) return

if(phase === "clean" && !gameOver){
pickVirus(touch.clientX,touch.clientY)
}

if(phase === "shake" && !gameOver){
shakeTree(touch.clientX,touch.clientY)
}

e.preventDefault()

},{passive:false})

canvas.addEventListener("touchmove",(e)=>{

const touch = e.touches[0]
if(!touch) return

moveDragging(touch.clientX,touch.clientY)

e.preventDefault()

},{passive:false})

canvas.addEventListener("touchend",()=>{

releaseDragging()

})

/* 게임 루프 */

function update(){

ctx.clearRect(0,0,canvas.width,canvas.height)

/* 나무 */

const treeImage = fallCount >= 100 ? treeEmptyImg : treeImg

ctx.drawImage(
treeImage,
tree.x - tree.width/2,
tree.y - tree.height/2,
tree.width,
tree.height
)

/* 바이러스 */

if(phase === "clean"){
viruses.forEach(v=>{
ctx.drawImage(virusImg,v.x-30,v.y-30,60,60)
})
}

/* 휴지통 */

ctx.drawImage(
currentTrashImg,
trash.x - trash.width/2,
trash.y - trash.height/2,
trash.width,
trash.height
)

/* 낙엽 */

for(let i=leaves.length-1;i>=0;i--){

const l = leaves[i]

l.y += l.vy
l.x += Math.sin(l.y*0.05) * l.drift

ctx.drawImage(
l.img,
l.x - l.size/2,
l.y - l.size/2,
l.size,
l.size
)

if(l.y > canvas.height - 100){

groundLeaves.push({
x: l.x,
y: canvas.height - 80,
img: l.img,
size: l.size
})

leaves.splice(i,1)

fallCount++
updateUI()

}

}

/* 바닥 낙엽 */

groundLeaves.forEach((l,i)=>{

const row = Math.floor(i/6)
const offsetY = row*10
const offsetX = (i%6)*2

ctx.drawImage(
l.img,
l.x - l.size/2 + offsetX,
l.y - offsetY,
l.size,
l.size
)

})

/* 최종 판정 */

if(phase === "end" && leaves.length === 0 && !gameOver){

gameOver = true

if(fallCount >= 100){
endResult = "success"
}else{
endResult = "fail"
}

setTimeout(()=>{

if(endResult === "success"){
alert("AUTOMNE TERMINÉ")
}else{
alert("ÉCHEC")
}

location.reload()

},400)

}

requestAnimationFrame(update)

}

update()

/* 리사이즈 */

window.addEventListener("resize",()=>{

canvas.width = window.innerWidth
canvas.height = window.innerHeight

tree.x = canvas.width/2
tree.y = canvas.height/2

trash.x = canvas.width-130
trash.y = canvas.height-130

})