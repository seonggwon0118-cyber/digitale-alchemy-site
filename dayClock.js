const centerImage = document.getElementById("centerImage");
const nodes = document.querySelectorAll(".node");
const background = document.querySelector(".background");
const clock = document.querySelector(".clock");

/* 중앙 이미지 */

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

/* 배경 이미지 */

const backgrounds = [
"image/bg_day1.png",
"image/bg_day2.png",
"image/bg_day3.png",
"image/bg_day4.png",
"image/bg_day5.png",
"image/bg_day6.png",
"image/bg_day7.png",
"image/bg_day8.png",
"image/bg_day9.png",
"image/bg_day10.png"
];

/* 연결 페이지 */

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

/* 시간 스케줄 */

const schedule = [
1,   // day10
5,   // day1
7,   // day2
9,   // day3
11,  // day4
13,  // day5
15,  // day6
17,  // day7
19,  // day8
21   // day9
];

/* ---------- 파리 시간 ---------- */

function getParisHour(){

const now = new Date();

const hour = new Intl.DateTimeFormat("en-GB",{
timeZone:"Europe/Paris",
hour:"numeric",
hour12:false
}).format(now);

return parseInt(hour);

}

/* ---------- 현재 index ---------- */

function getCurrentIndex(){

const hour = getParisHour();

for(let i=schedule.length-1;i>=0;i--){

if(hour >= schedule[i]){
return i;
}

}

return 0;

}

/* ---------- 시계 orbit ---------- */

let rotation = 0;

function animateClock(){

rotation += 0.002;

const radius = 400;



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

/* ---------- 이미지 + 배경 업데이트 ---------- */

function updateVisual(){

const index = getCurrentIndex();
const background = document.querySelector(".background");

/* 중앙 이미지 */

centerImage.style.opacity = 0;

setTimeout(()=>{
centerImage.src = images[index];
centerImage.style.opacity = 1;
},300);

/* 배경 */

document.querySelector(".background").style.backgroundImage = "url(" + backgrounds[index] + ")";

/* 현재 노드 숨기기 */

nodes.forEach((node,i)=>{
node.style.opacity = (i===index)?0:1;
});

}

/* ---------- preload ---------- */

function preloadImages(){

[...images,...backgrounds].forEach(src=>{
const img = new Image();
img.src = src;
});

}

/* ---------- 클릭 이벤트 ---------- */

nodes.forEach((node,i)=>{

node.style.cursor="pointer";

node.addEventListener("click",()=>{
window.location.href = pages[i];
});

});

/* 중앙 이미지 클릭 */

centerImage.style.cursor="pointer";

centerImage.addEventListener("click",()=>{

const index = getCurrentIndex();

window.location.href = pages[index];

});

/* ---------- 실행 ---------- */
window.onload = function(){
preloadImages();

animateClock();

updateVisual();

setInterval(updateVisual,60000);
};