const centerImage = document.getElementById("centerImage");
const nodes = document.querySelectorAll(".node");

const images = [
"image/day1.png",
"image/day2.png",
"image/day3.png",
"image/day4.png",
"image/day5.png",
"image/day6.png",
"image/day7.png",
"image/day8.png",
"image/day9.png",
"image/day10.png"
];

/* 연결될 페이지 */
const pages = [
"day1.html",
"day2.html",
"day3.html",
"day4.html",
"day5.html",
"day6.html",
"day7.html",
"day8.html",
"day9.html",
"day10.html"
];

const schedule = [
1,   // day10 시작
5,   // day1 시작
7,   // day2 시작
9,   // day3 시작
11,  // day4 시작
13,  // day5 시작
15,  // day6 시작
17,  // day7 시작
19,  // day8 시작
21   // day9 시작
];

function getParisHour(){

const now = new Date();

const hour = new Intl.DateTimeFormat("en-GB",{
timeZone:"Europe/Paris",
hour:"numeric",
hour12:false
}).format(now);

return parseInt(hour);

}

function getCurrentIndex(){

const hour = getParisHour();
let index = 9;

for(let i=0;i<schedule.length;i++){

if(hour >= schedule[i]){
index = i-1;
}

}

if(index < 0){
index = 9;
}

return index;

}

/* ---------- 시계 회전 ---------- */

let rotation = 0;

function animateClock(){

rotation += 0.002;

const radius = 400;

const clock = document.querySelector(".clock");

const cx = clock.offsetWidth / 2;
const cy = clock.offsetHeight / 2;

nodes.forEach((node,i)=>{

const angle = rotation + (i * (Math.PI*2/nodes.length));

const x = cx + Math.cos(angle)*radius;
const y = cy + Math.sin(angle)*radius;

node.style.left = x+"px";
node.style.top = y+"px";

});

requestAnimationFrame(animateClock);

}

/* ---------- 중앙 이미지 업데이트 ---------- */

function updateImage(){

const index = getCurrentIndex();

centerImage.style.opacity = 0;

setTimeout(()=>{
centerImage.src = images[index];
centerImage.style.opacity = 1;
},300);

/* 중앙 이미지와 같은 노드 숨기기 */

nodes.forEach((node,i)=>{
node.style.opacity = (i===index)?0:1;
});

}

/* ---------- 클릭 이벤트 ---------- */

nodes.forEach((node,i)=>{

node.style.cursor = "pointer";

node.addEventListener("click",()=>{
window.location.href = pages[i];
});

});

/* 중앙 이미지 클릭 */

centerImage.style.cursor = "pointer";

centerImage.addEventListener("click",()=>{
const index = getCurrentIndex();
window.location.href = pages[index];
});

/* ---------- 실행 ---------- */

animateClock();
updateImage();

setInterval(updateImage,60000);