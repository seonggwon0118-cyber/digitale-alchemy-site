const centerImage = document.getElementById("centerImage");
const nodes = document.querySelectorAll(".node");
const background = document.querySelector(".background");
const clock = document.querySelector(".clock");

/* 중심 좌표 */
let cx = 0;
let cy = 0;

/* 중심 계산 (clock 기준) */
function updateCenter(){

  const rect = clock.getBoundingClientRect();

  cx = rect.left + rect.width / 2;
  cy = rect.top + rect.height / 2;

}

/* day 데이터 */
const dayData = [
  { id: 1, image: "image/day1.png", background: "image/bg_day1.png", page: "day1.html" },
  { id: 2, image: "image/day2.png", background: "image/bg_day2.png", page: "day2.html" },
  { id: 3, image: "image/day3.png", background: "image/bg_day3.png", page: "day3.html" },
  { id: 4, image: "image/day4.png", background: "image/bg_day4.png", page: "day4.html" },
  { id: 5, image: "image/day5.png", background: "image/bg_day5.png", page: "day5.html" },
  { id: 6, image: "image/day6.png", background: "image/bg_day6.png", page: "day6.html" },
  { id: 7, image: "image/day7.png", background: "image/bg_day7.png", page: "day7.html" },
  { id: 8, image: "image/day8.png", background: "image/bg_day8.png", page: "day8.html" },
  { id: 9, image: "image/day9.png", background: "image/bg_day9.png", page: "day9.html" },
  { id: 10, image: "image/day10.png", background: "image/bg_day10.png", page: "day10.html" }
];

/* 시간 구조 */
const schedule = [
  { hour: 1, dayId: 10 },
  { hour: 5, dayId: 1 },
  { hour: 7, dayId: 2 },
  { hour: 9, dayId: 3 },
  { hour: 11, dayId: 4 },
  { hour: 13, dayId: 5 },
  { hour: 15, dayId: 6 },
  { hour: 17, dayId: 7 },
  { hour: 19, dayId: 8 },
  { hour: 21, dayId: 9 }
];

/* 파리 시간 */

function getParisHour(){

  const parts = new Intl.DateTimeFormat("en-GB",{
    timeZone:"Europe/Paris",
    hour:"2-digit",
    hour12:false
  }).formatToParts(new Date());

  return Number(parts.find(p=>p.type==="hour").value);

}

/* 현재 day */

function getCurrentDayId(){

  const hour = getParisHour();

  for(let i=schedule.length-1;i>=0;i--){

    if(hour >= schedule[i].hour){
      return schedule[i].dayId;
    }

  }

  return 10;

}

function getCurrentDayIndex(){

  const id = getCurrentDayId();
  return dayData.findIndex(d=>d.id===id);

}

/* orbit */

let rotation = 0;

function animateClock(){

  rotation += 0.002;

  const radius = 390;

  nodes.forEach((node,i)=>{

    const angle = rotation + (i * (Math.PI*2/nodes.length));

    const x = Math.cos(angle)*radius;
    const y = Math.sin(angle)*radius;

    node.style.left = `calc(50% + ${x}px)`;
    node.style.top = `calc(50% + ${y}px)`;

  });

  requestAnimationFrame(animateClock);

}

/* 이미지 업데이트 */

function updateVisual(){

  const index = getCurrentDayIndex();
  const day = dayData[index];

  centerImage.style.opacity = 0;

  setTimeout(()=>{

    centerImage.src = day.image;
    centerImage.style.opacity = 1;

  },300);

  background.style.backgroundImage = `url("${day.background}")`;

  nodes.forEach((node,i)=>{
    node.style.opacity = (i===index)?0:1;
  });

}

/* preload */

function preloadImages(){

  dayData.forEach(d=>{

    const img1 = new Image();
    img1.src = d.image;

    const img2 = new Image();
    img2.src = d.background;

  });

}

/* 클릭 비활성화 */

nodes.forEach((node)=>{
  node.style.cursor="default";
});

/* 실행 */

window.onload = function(){

  preloadImages();

  updateCenter();

  animateClock();

  updateVisual();

  setInterval(updateVisual,60000);

};

/* 화면 변경 */

window.addEventListener("resize",()=>{
  updateCenter();
});