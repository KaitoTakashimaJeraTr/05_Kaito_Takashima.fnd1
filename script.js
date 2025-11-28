'use strict'
// 1行目に記載している 'use strict' は削除しないでください

const input = document.getElementById("input-prime");
const result = document.getElementById("result");
const targetNumberSpan = document.getElementById("target-number");
const initialNumberSpan = document.getElementById("initial-number");
const resetButton = document.getElementById("reset-button");
const imageContainer = document.getElementById("image-container");

const modeUnlimitedButton = document.getElementById("mode-unlimited");
const modeLimitedButton = document.getElementById("mode-limited");

const timerSpan = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const startArea = document.getElementById("start-area");

let initialValue;
let target;
let factors = [];

let mode = ""; 
let attemptCount = 0;
const MAX_ATTEMPTS = 13;

let timerInterval;
let elapsedSeconds = 0;
let gameStarted = false;

input.disabled = true;
resetButton.disabled = true;

modeUnlimitedButton.addEventListener("click", () => {
  mode = "unlimited";
  result.innerHTML = "<div>無制限モードを選択しました。スタートボタンを押してね！</div>";
  input.disabled = true;
  resetButton.disabled = true;
  startArea.style.display = "block";

  modeUnlimitedButton.classList.add("selected");
  modeLimitedButton.classList.remove("selected");
});

modeLimitedButton.addEventListener("click", () => {
  mode = "limited";
  result.innerHTML = "<div>制限ありモードを選択しました。スタートボタンを押してね！</div>";
  input.disabled = true;
  resetButton.disabled = true;
  startArea.style.display = "block";

  modeLimitedButton.classList.add("selected");
  modeUnlimitedButton.classList.remove("selected");
});

startButton.addEventListener("click", () => {
  if (mode !== "unlimited" && mode !== "limited") {
    result.innerHTML = `<div style="color: red;">モードを選んでからスタートしてください！</div>`;
    return;
  }

  gameStarted = true;
  startArea.style.display = "none";
  input.disabled = false;
  resetButton.disabled = false;
  initialize();
});

// 素数判定関数（while文）
function isPrime(num) {
  if (num < 2) return false;
  let i = 2;
  while (i <= Math.sqrt(num)) {
    if (num % i === 0) {
      return false;
    }
    i++;
  }
  return true;
}

// 初期化関数
function initialize() {
  if (!gameStarted) return;

  initialValue = Math.floor(Math.random() * 9900) + 100;
  // initialValue = 840;
  target = initialValue;
  factors = [];
  initialNumberSpan.textContent = initialValue;
  targetNumberSpan.textContent = target;
  result.innerHTML = "";
  imageContainer.innerHTML = "";
  input.readOnly = false;
  input.value = "";
  input.focus();
  attemptCount = 0;

  clearInterval(timerInterval);
  elapsedSeconds = 0;
  timerSpan.textContent = "0";
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    timerSpan.textContent = elapsedSeconds;
  }, 1000);
}

// 入力処理
input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  if (target === 1) {
    initialize();
    return;
  }

  if (mode === "limited" && attemptCount >= MAX_ATTEMPTS) {
    result.innerHTML += `<div style="color: red;">回数制限を超えました！Enterキーで次の問題へ</div>`;
    input.readOnly = true;
    clearInterval(timerInterval);
    return;
  }

  hideSpecialImage();

  const value = Number(input.value);
  if (isNaN(value)) return;

  if (value === 1) {
    result.innerHTML += `<div>1 は素数ではありません</div>`;
    input.value = "";
    return;
  }

  if (value < 2 || value > 9999) {
    result.innerHTML += `<div>${value} は 2〜9999 の範囲で入力してください</div>`;
    input.value = "";
    return;
  }

  if (!isPrime(value)) {
    result.innerHTML += `<div>${value} は素数ではありません</div>`;
    input.value = "";
    return;
  }

  attemptCount++;

  if (target % value === 0) {
    target /= value;
    factors.push(value);

    if (target === 1) {
      targetNumberSpan.textContent = "正解！";

      let expression = "";
      for (const factor of factors) {
        expression += factor + " × ";
      }
      expression = expression.slice(0, -3); // 最後の " × " を削除

      result.innerHTML += `<div>${expression} = ${initialValue}</div>`;
      result.innerHTML += `<div style="color: green;">Enterキーで次の問題へ</div>`;
      input.readOnly = true;
      clearInterval(timerInterval);
    } else {
      targetNumberSpan.textContent = target;

      let expression = "";
      for (const factor of factors) {
        expression += factor + " × ";
      }
      expression = expression.slice(0, -3);

      result.innerHTML += `<div>${expression}</div>`;

      if (specialImages[target]) {
        showSpecialImage(target);
      }
    }
  } else {
    result.innerHTML += `<div>${value} では割れません</div>`;
  }

  input.value = "";
});

// リセットボタン
resetButton.addEventListener("click", () => {
  initialize();
});

// 特定の数字と画像＋説明の対応表
const specialImages = {
  57: {
    img: "Alexander_Grothendieck.jpg",
    desc: "数学者グロタンディークに関連する数"
  },
  42: {
    img: "b006f86_w1.jpg",
    desc: "『銀河ヒッチハイク・ガイド』で“生命、宇宙、そして万物の答え”とされる数"
  },
  1729: {
    img: "Srinivasa_Ramanujan.jpg",
    desc: "ラマヌジャンの“タクシー数”として有名な数"
  }
};

// 画像＋説明表示（for...in）
function showSpecialImage(number) {
  for (const key in specialImages) {
    if (Number(key) === number) {
      const data = specialImages[key];
      imageContainer.innerHTML = `
        <div style="margin-top: 10px;">
          <img src="${data.img}" alt="${number}の画像" style="max-width: 200px;"><br>
          <div style="margin-top: 0.5em; font-size: 0.9em; color: #333;">${data.desc}</div>
        </div>
      `;
      break;
    }
  }
}

// 画像消去
function hideSpecialImage() {
  imageContainer.innerHTML = "";
}

initialize();
