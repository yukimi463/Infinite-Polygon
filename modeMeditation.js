// ===============================
// 🧘‍♂️ 瞑想モード & 哲学スコアシステム
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  // 共通変数
  window.meditationMode = false;
  window.philosophyScore = 0;
  let meditationInterval = null;

  // 要素取得
  const meditationBtn = document.getElementById("meditationModeBtn");
  const meditationBgm = document.getElementById("meditationBgm");
  const roundnessDisplay = document.getElementById("roundnessDisplay");
  const gameWrapper = document.getElementById("gameWrapper");

  // 要素が存在するかチェック
  if (!meditationBtn || !roundnessDisplay || !gameWrapper) {
    console.error("瞑想モード: 要素が見つかりません");
    return;
  }

  // イベント登録
  meditationBtn.addEventListener("click", () => {
    meditationMode = !meditationMode;
    if (meditationMode) {
      startMeditation();
    } else {
      stopMeditation();
    }
  });

  function startMeditation() {
    document.body.classList.add("meditation-active");
    meditationBtn.textContent = "瞑想解除";
    gameWrapper.style.pointerEvents = "none";

    // BGM再生
    if (meditationBgm) {
      meditationBgm.volume = 0.4;
      meditationBgm.play().catch(err => console.log("BGM再生失敗:", err));
    }

    // スコア上昇ループ
    meditationInterval = setInterval(() => {
      if (philosophyScore < 100) {
        philosophyScore += 0.05;
        updatePhilosophyUI();
        applyPhilosophyBonus();
      }
    }, 1000);
  }

  function stopMeditation() {
    document.body.classList.remove("meditation-active");
    meditationBtn.textContent = "瞑想モード";
    gameWrapper.style.pointerEvents = "auto";

    if (meditationBgm) meditationBgm.pause();
    clearInterval(meditationInterval);
  }

  function updatePhilosophyUI() {
    roundnessDisplay.textContent = `円への近づき率: ${philosophyScore.toFixed(2)}%`;
  }

  function applyPhilosophyBonus() {
    // variables.jsの変数を利用
    if (typeof evolveCost === "undefined") return;
    if (philosophyScore >= 10 && philosophyScore < 25) {
      evolveCost *= 0.98;
    } else if (philosophyScore >= 25 && philosophyScore < 50) {
      clickValue *= 1.05;
    } else if (philosophyScore >= 50 && philosophyScore < 75) {
      autoSpeed *= 1.1;
    } else if (philosophyScore >= 75 && philosophyScore < 90) {
      maxLevel += 1;
    } else if (philosophyScore >= 90 && philosophyScore < 100) {
      triggerLightRing();
    } else if (philosophyScore >= 100) {
      unlockDreamMode();
    }
  }

  // 光の円演出
  function triggerLightRing() {
    if (!document.getElementById("lightRing")) {
      const ring = document.createElement("div");
      ring.id = "lightRing";
      ring.style.cssText = `
        position: fixed;
        top: 50%; left: 50%;
        width: 400px; height: 400px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        box-shadow: 0 0 80px 30px rgba(255,255,200,0.4);
        animation: ringExpand 5s forwards;
        pointer-events: none;
        z-index: 0;
      `;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 6000);
    }
  }

  // 夢現モード（仮）
  function unlockDreamMode() {
    stopMeditation();
    alert("✨ あなたは完全なる円に到達しました。『夢現モード』が解放されました。");
  }

});
