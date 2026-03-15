const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const tree = document.getElementById("tree")
const scoreUI = document.getElementById("score")

canvas.width = window.innerWidth
canvas.height = window.innerHeight


/* DATA 이미지 */

const dataImg1 = new Image()
dataImg1.src = "image/data1.png"

const dataImg2 = new Image()
dataImg2.src = "image/data2.png"

const dataImages = [dataImg1,dataImg2]


/* 커서 이미지 */

const cursorImg = new Image()
cursorImg.src = "image/watering_can.png"


/* 게임 데이터 */

let data = 0
let time = 100
let gameOver = false


/* 타이머 UI 생성 */

const timeUI = document.createElement("div")
timeUI.innerText = "TEMPS : 100"

timeUI.style.position="fixed"
timeUI.style.right="20px"
timeUI.style.top="20px"
timeUI.style.color="white"
timeUI.style.fontSize="20px"
timeUI.style.fontFamily="monospace"
timeUI.style.fontWeight="bold"
timeUI.style.zIndex="5"

document.body.appendChild(timeUI)


/* SCORE 위치 강제 수정 */

scoreUI.style.position="fixed"
scoreUI.style.right="20px"
scoreUI.style.top="50px"
scoreUI.style.color="white"
scoreUI.style.fontSize="20px"
scoreUI.style.fontFamily="monospace"
scoreUI.style.fontWeight="bold"
scoreUI.style.zIndex="5"


/* 플레이어 */

let player = {
x: canvas.width/2,
y: canvas.height-120,
size:40
}


/* 떨어지는 데이터 */

let drops=[]

function spawn(){

if(gameOver) return

let isVirus = Math.random() < 0.40

drops.push({
x:Math.random()*canvas.width,
y:-80,
speed:isVirus ? 4.5 : 3.5,
type:isVirus ? "virus" : "data",
img:dataImages[Math.floor(Math.random()*2)]
})

}

setInterval(spawn,450)


/* 마우스 이동 */

window.addEventListener("mousemove",e=>{
player.x = e.clientX
})


/* 나무 성장 */

function updateTree(){

if(data < 10){
tree.src="image/spring_tree_0.png"
tree.style.width="90px"
tree.style.bottom="145px"
}

else if(data < 30){
tree.src="image/spring_tree_10.png"
tree.style.width="100px"
tree.style.bottom="145px"
}

else if(data < 50){
tree.src="image/spring_tree_30.png"
tree.style.width="195px"
tree.style.bottom="145px"
}

else if(data < 70){
tree.src="image/spring_tree_50.png"
tree.style.width="390px"
tree.style.bottom="145px"
}

else if(data < 100){
tree.src="image/spring_tree_70.png"
tree.style.width="900px"
tree.style.bottom="145px"
}

else{
tree.src="image/spring_tree_100.png"
tree.style.width="950px"
tree.style.bottom="145px"
}

scoreUI.innerText="DONNÉES : "+data

}


/* 게임 루프 */

function loop(){

ctx.clearRect(0,0,canvas.width,canvas.height)

for(let i=drops.length-1;i>=0;i--){

let d=drops[i]

d.y+=d.speed


/* DATA */

if(d.type==="data"){
ctx.drawImage(d.img,d.x,d.y,80,80)
}


/* VIRUS */

if(d.type==="virus"){
ctx.fillStyle="red"
ctx.font="bold 20px monospace"
ctx.fillText("VIRUS",d.x,d.y)
}


/* 충돌 */

let dx=player.x-d.x
let dy=player.y-d.y
let dist=Math.sqrt(dx*dx+dy*dy)

if(dist < player.size+75){

if(d.type==="data"){
data++
}

if(d.type==="virus"){
data--
if(data<0) data=0
}

drops.splice(i,1)

updateTree()

continue

}


/* 화면 밖 제거 */

if(d.y > canvas.height){
drops.splice(i,1)
}

}


/* 물뿌리개 커서 */

ctx.drawImage(cursorImg,player.x-50,player.y-50,100,100)

requestAnimationFrame(loop)

}

updateTree()
loop()


/* 타이머 */

setInterval(()=>{

if(gameOver) return

time--

timeUI.innerText="TEMPS : "+time

if(time<=0){

gameOver = true

setTimeout(()=>{

if(data >= 100){
alert("PRINTEMPS TERMINÉ 🌸")
}else{
alert("ÉCHEC")
}

location.reload()

},500)

}

},1000)


/* 화면 리사이즈 */

window.addEventListener("resize",()=>{

canvas.width=window.innerWidth
canvas.height=window.innerHeight
player.y=canvas.height-120

})