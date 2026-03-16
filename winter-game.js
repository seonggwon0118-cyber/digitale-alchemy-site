const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ---------- 모바일 감지 ---------- */

const isMobile = window.innerWidth < 700;

/* ---------- canvas 설정 ---------- */

function setCanvasSize() {
  if (isMobile) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

setCanvasSize();

/* ---------- UI ---------- */

const uiTemp = document.getElementById("temp");
const uiLife = document.getElementById("life");
const uiDb = document.getElementById("db");
const uiTime = document.getElementById("time");

/* ---------- 상태 ---------- */

let temp = 50;
let life = 5;
let database = 0;
let combo = 0;
let time = 60;

let gameOver = false;
let gameStarted = false;
let animationId = null;
let spawnIntervalId = null;
let timerIntervalId = null;

/* ---------- DATA 이미지 ---------- */

const data5 = new Image();
data5.src = "image/data5.png";

const data6 = new Image();
data6.src = "image/data6.png";

/* ---------- 화로 이미지 ---------- */

const furnaceOff = new Image();
furnaceOff.src = "image/furnace_off.png";

const furnaceSmall = new Image();
furnaceSmall.src = "image/furnace_small.png";

const furnaceMedium = new Image();
furnaceMedium.src = "image/furnace_medium.png";

const furnaceBig = new Image();
furnaceBig.src = "image/furnace_big.png";

/* ---------- 레인 / 판정선 ---------- */

let laneOffset = isMobile ? 80 : 140;
let lanes = [];
let hitLine = 0;

function updateLayoutValues() {
  laneOffset = isMobile ? 80 : 140;

  lanes = [
    canvas.width / 2 - laneOffset,
    canvas.width / 2,
    canvas.width / 2 + laneOffset
  ];

  hitLine = canvas.height - (isMobile ? 110 : 140);
}

updateLayoutValues();

const keys = ["a", "s", "d"];
let speed = 3.5;
const notes = [];

/* ---------- 노트 타입 ---------- */

const types = [
  "DATA", "DATA",
  "BRUIT",
  "CACHE",
  "OBSOLETE"
];

/* ---------- 노트 생성 ---------- */

function spawnNote() {
  if (gameOver) return;

  const lane = Math.floor(Math.random() * 3);
  const type = types[Math.floor(Math.random() * types.length)];

  notes.push({
    lane,
    type,
    y: -60,
    img: Math.random() < 0.5 ? data5 : data6,
    missed: false,
    alpha: 1
  });
}

/* ---------- UI ---------- */

function updateUI() {
  uiTemp.innerText = Math.max(0, Math.floor(temp)) + "°";
  uiLife.innerText = Math.max(0, life);
  uiDb.innerText = database;
  uiTime.innerText = Math.max(0, time);
}

/* ---------- 게임 종료 ---------- */

function endGame(message) {
  if (gameOver) return;

  gameOver = true;

  if (spawnIntervalId) clearInterval(spawnIntervalId);
  if (timerIntervalId) clearInterval(timerIntervalId);
  if (animationId) cancelAnimationFrame(animationId);

  updateUI();

  setTimeout(() => {
    alert(message);
    location.reload();
  }, 400);
}

/* ---------- 타이머 ---------- */

function startTimer() {
  timerIntervalId = setInterval(() => {
    if (gameOver) return;

    time--;

    if (time <= 0) {
      time = 0;

      if (temp >= 100) {
        endGame("HIVER TERMINÉ");
      } else {
        endGame("ÉCHEC");
      }
      return;
    }

    updateUI();
  }, 1000);
}

/* ---------- 노트 판정 ---------- */

function hitLane(lane) {
  if (gameOver) return;

  let target = null;
  let index = -1;
  let bestDist = 9999;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];

    if (note.lane !== lane) continue;
    if (note.missed) continue;

    const dist = Math.abs(note.y - hitLine);

    if (dist < bestDist && dist < 160) {
      bestDist = dist;
      target = note;
      index = i;
    }
  }

  if (!target) return;

  if (target.type === "DATA") {
    temp += 5;
    life -= 1;
    combo = 0;
  } else {
    combo++;
    const bonus = Math.floor(combo / 3);
    temp += 3 + bonus;
  }

  notes.splice(index, 1);

  temp = Math.min(temp, 100);
  life = Math.max(life, 0);

  updateUI();

  if (life <= 0) {
    endGame("ÉCHEC");
    return;
  }

  if (temp >= 100) {
    endGame("HIVER TERMINÉ");
  }
}

/* ---------- 키 입력 ---------- */

document.addEventListener("keydown", (e) => {
  const lane = keys.indexOf(e.key.toLowerCase());

  if (lane !== -1) {
    hitLane(lane);
  }
});

/* ---------- 모바일 터치 ---------- */

canvas.addEventListener("touchstart", (e) => {
  if (gameOver) return;

  const touch = e.touches[0];
  const x = touch.clientX;

  let lane = 0;

  if (x < canvas.width / 3) lane = 0;
  else if (x < canvas.width * 2 / 3) lane = 1;
  else lane = 2;

  hitLane(lane);
  e.preventDefault();
}, { passive: false });

/* ---------- 화로 상태 ---------- */

function getFurnace() {
  if (gameOver && temp >= 100) return furnaceBig;
  if (combo >= 10) return furnaceMedium;
  if (temp >= 55) return furnaceSmall;
  return furnaceOff;
}

/* ---------- 이미지 비율 유지 ---------- */

function drawImageRatio(img, x, y, height, alpha = 1) {
  if (!img || !img.complete || !img.naturalWidth) return;

  const ratio = img.width / img.height;
  const width = height * ratio;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(
    img,
    x - width / 2,
    y - height / 2,
    width,
    height
  );
  ctx.restore();
}

/* ---------- 콤보 ---------- */

function drawCombo() {
  if (combo > 1) {
    ctx.font = isMobile ? "22px monospace" : "28px monospace";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      "COMBO x" + combo,
      canvas.width / 2,
      isMobile ? 90 : 120
    );
  }
}

/* ---------- 레인 ---------- */

function drawLanes() {
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(lanes[i], 0);
    ctx.lineTo(lanes[i], canvas.height);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(
    lanes[0] - 100,
    hitLine - 80,
    lanes[2] - lanes[0] + 200,
    160
  );

  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.moveTo(lanes[0] - 100, hitLine);
  ctx.lineTo(lanes[2] + 100, hitLine);
  ctx.stroke();

  ctx.font = isMobile ? "16px monospace" : "20px monospace";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.fillText("A", lanes[0], hitLine + 40);
  ctx.fillText("S", lanes[1], hitLine + 40);
  ctx.fillText("D", lanes[2], hitLine + 40);
}

/* ---------- 노트 업데이트 & 그리기 ---------- */

function updateNotes() {
  for (let i = notes.length - 1; i >= 0; i--) {
    const n = notes[i];
    n.y += speed;

    /* 판정선 지나면 바로 삭제하지 않고 miss 처리만 */
    if (!n.missed && n.y > hitLine + 60) {
      n.missed = true;
      n.alpha = 0.35;

      if (n.type === "DATA") {
        database++;
      } else {
        life--;
        combo = 0;

        if (life <= 0) {
          life = 0;
          updateUI();
          endGame("ÉCHEC");
          return;
        }
      }
    }

    /* 그리기 */
    if (n.type === "DATA") {
      drawImageRatio(
        n.img,
        lanes[n.lane],
        n.y,
        isMobile ? 60 : 90,
        n.alpha
      );
    } else {
      ctx.save();
      ctx.globalAlpha = n.alpha;
      ctx.fillStyle = "white";
      ctx.font = isMobile ? "18px monospace" : "24px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        n.type,
        lanes[n.lane],
        n.y
      );
      ctx.restore();
    }

    /* 화면 아래로 완전히 내려간 뒤 삭제 */
    if (n.y > canvas.height + 120) {
      notes.splice(i, 1);
    }
  }
}

/* ---------- 게임 루프 ---------- */

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* 화로 */
  const furnace = getFurnace();
  const furnaceSize = isMobile ? 320 : 600;

  drawImageRatio(
    furnace,
    canvas.width * 0.15,
    canvas.height * 0.5,
    furnaceSize
  );

  drawImageRatio(
    furnace,
    canvas.width * 0.85,
    canvas.height * 0.5,
    furnaceSize
  );

  /* 노트 */
  updateNotes();

  /* 자연 감소 */
  temp -= 0.02;
  temp = Math.max(temp, 0);

  updateUI();

  if (temp <= 0) {
    endGame("ÉCHEC");
    return;
  }

  drawLanes();
  drawCombo();

  speed += 0.0005;

  animationId = requestAnimationFrame(update);
}

/* ---------- preload ---------- */

function preloadImages(callback) {
  const assets = [
    data5, data6,
    furnaceOff, furnaceSmall, furnaceMedium, furnaceBig
  ];

  let loaded = 0;

  function checkDone() {
    loaded++;
    if (loaded === assets.length) {
      callback();
    }
  }

  assets.forEach((img) => {
    if (img.complete) {
      checkDone();
    } else {
      img.onload = checkDone;
      img.onerror = checkDone;
    }
  });
}

/* ---------- 클릭 비활성화 ---------- */

nodes?.forEach?.((node) => {
  node.style.cursor = "default";
});

/* ---------- 시작 ---------- */

function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  updateUI();

  spawnIntervalId = setInterval(spawnNote, 700);
  startTimer();
  update();
}

preloadImages(() => {
  startGame();
});

/* ---------- resize (웹만 허용) ---------- */

if (!isMobile) {
  window.addEventListener("resize", () => {
    setCanvasSize();
    updateLayoutValues();
  });
}