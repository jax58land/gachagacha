// script.js

// カードデータ（imagesフォルダ内の画像を使用）
const cards = [
  { id: 1, name: "かなえる", image: "images/card1.png" },
  { id: 2, name: "なんでも", image: "images/card2.png" },
  { id: 3, name: "マッサージ", image: "images/card3.png" },
  { id: 4, name: "あまえて", image: "images/card4.png" },
  { id: 5, name: "どこでも", image: "images/card5.png" },
  { id: 6, name: "おむかえ", image: "images/card6.png" },
  { id: 7, name: "好きなもの", image: "images/card7.png" },
];

// 状態管理
let remainingTries = 7;
let collectedCards = [];

// ローカルストレージのデータ読み込み
function loadState() {
  const savedTries = localStorage.getItem("remainingTries");
  const savedCards = localStorage.getItem("collectedCards");

  if (savedTries !== null) {
    remainingTries = parseInt(savedTries, 10);
  }

  if (savedCards !== null) {
    collectedCards = JSON.parse(savedCards);
  }
}

// ローカルストレージにデータ保存
function saveState() {
  localStorage.setItem("remainingTries", remainingTries);
  localStorage.setItem("collectedCards", JSON.stringify(collectedCards));
}

// ガチャロジック
function drawCard() {
  if (remainingTries <= 0) {
    alert("もう回数がありません！");
    return null;
  }

  const availableCards = cards.filter(
    (card) => !collectedCards.some((c) => c.id === card.id)
  );

  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const selectedCard = availableCards[randomIndex];

  collectedCards.push(selectedCard);
  remainingTries--;

  saveState(); // 状態を保存

  return selectedCard;
}

// UI更新
function updateUI(card) {
  const resultDiv = document.getElementById("result");
  const remainingDiv = document.getElementById("remaining");

  remainingDiv.textContent = `残り回数: ${remainingTries}`;

  const cardElement = document.createElement("div");
  cardElement.className = "card-result";
  cardElement.innerHTML = `
    <img src="${card.image}" alt="${card.name}">
    <p>${card.name}</p>
  `;

  // クリックで拡大表示
  cardElement.addEventListener("click", () => {
    showLargeCard(card);
  });

  resultDiv.appendChild(cardElement);
}

// 大きな画像を表示するダイアログ
function showLargeCard(card) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");

  modalContent.innerHTML = `
    <img src="${card.image}" alt="${card.name}">
    <p>${card.name}</p>
  `;
  modal.style.display = "block";

  modalClose.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// エフェクトを実行
function runEffect() {
  const effectOverlay = document.getElementById("effect-overlay");
  effectOverlay.classList.add("active");

  // アニメーション終了後に効果を解除
  setTimeout(() => {
    effectOverlay.classList.remove("active");
  }, 500);
}

// 初期化処理
function init() {
  loadState(); // 状態を読み込む

  const remainingDiv = document.getElementById("remaining");
  remainingDiv.textContent = `残り回数: ${remainingTries}`;

  document.getElementById("gachaButton").addEventListener("click", () => {
    runEffect(); // 点灯エフェクトを起動
    const card = drawCard();
    if (card) {
      updateUI(card);
    }
  });

  // 初期表示用
  const resultDiv = document.getElementById("result");
  collectedCards.forEach((card) => {
    updateUI(card);
  });
}

init();
