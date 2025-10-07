// ===============================
// 🧘‍♂️ 瞑想モード & 哲学スコアシステム（Controller連携対応版）
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  // 共通変数
  window.meditationMode = false;
  window.philosophyScore = 0;
  window.meditationInterval = null;

  // 要素取得
  const meditationBtn = document.getElementById("meditationModeBtn");
  const meditationBgm = document.getElementById("meditationBgm");
  const roundnessDisplay = document.getElementById("roundnessDisplay");
  const gameWrapper = document.getElementById("gameWrapper");

  if (!meditationBtn || !roundnessDisplay || !gameWrapper) {
    console.error("瞑想モード: 要素が見つかりません");
    return;
  }

  // ✅ Controllerがクリック処理を持っているので削除
  // meditationBtn.addEventListener("click", () => { ... }) は不要！

  // ===== 開始 =====
  window.startMeditation = function startMeditation() {
    if (window.meditationInterval !== null) return; // 二重開始防止

    window.meditationMode = true;
    document.body.classList.add("meditation-active");
    meditationBtn.textContent = "瞑想解除";
    gameWrapper.style.pointerEvents = "none";

    // BGM再生
    if (meditationBgm) {
      meditationBgm.volume = 0.4;
      meditationBgm.play().catch(err => console.log("BGM再生失敗:", err));
    }

    // スコア上昇ループ
    window.meditationInterval = setInterval(() => {
      if (window.meditationMode && window.philosophyScore < 100) {
        window.philosophyScore += 0.05;
        updatePhilosophyUI();
        applyPhilosophyBonus();
      }
    }, 1000);
  };

  // ===== 停止 =====
  window.stopMeditation = function stopMeditation() {
    window.meditationMode = false;
    document.body.classList.remove("meditation-active");
    meditationBtn.textContent = "瞑想モード";
    gameWrapper.style.pointerEvents = "auto";

    if (meditationBgm) meditationBgm.pause();

    if (window.meditationInterval) {
      clearInterval(window.meditationInterval);
      window.meditationInterval = null;
    }
  };

  function updatePhilosophyUI() {
    roundnessDisplay.textContent = `円への近づき率: ${window.philosophyScore.toFixed(2)}%`;
  }

  function applyPhilosophyBonus() {
    if (typeof evolveCost === "undefined") return;

    if (window.philosophyScore >= 10 && window.philosophyScore < 25) {
      evolveCost *= 0.98;
    } else if (window.philosophyScore >= 25 && window.philosophyScore < 50) {
      clickValue *= 1.05;
    } else if (window.philosophyScore >= 50 && window.philosophyScore < 75) {
      autoSpeed *= 1.1;
    } else if (window.philosophyScore >= 75 && window.philosophyScore < 90) {
      maxLevel += 1;
    } else if (window.philosophyScore >= 90 && window.philosophyScore < 100) {
      triggerLightRing();
    } else if (window.philosophyScore >= 100) {
      unlockDreamMode();
    }
  }

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

  function unlockDreamMode() {
    stopMeditation();
    alert("✨ あなたは完全なる円に到達しました。『夢現モード』が解放されました。");
  }

});
