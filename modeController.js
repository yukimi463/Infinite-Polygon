// ===============================
// 🎛 モードコントローラー（完全排他＋堅牢版）
// ===============================
// 加速モード中は瞑想ボタン完全無効化。
// 瞑想中は加速ボタン完全無効化。
// ===============================

window.addEventListener("DOMContentLoaded", () => {
  const meditationBtn = document.getElementById("meditationModeBtn");
  const accelBtn = document.getElementById("accelerationModeBtn");

  if (!meditationBtn || !accelBtn) return;

  // 状態管理
  const modeState = { current: "none" }; // "none" | "meditation" | "acceleration"

  // ===============================
  // 🔘 UI更新関数
  // ===============================
  function updateButtonStates() {
    console.log("🧩 updateButtonStates:", modeState.current);
    switch (modeState.current) {
        
      case "meditation":
        meditationBtn.disabled = false;
        meditationBtn.textContent = "瞑想解除";
        accelBtn.disabled = true;
        break;

      case "acceleration":
        meditationBtn.disabled = true;
        meditationBtn.textContent = "瞑想モード（加速中）";
        accelBtn.disabled = false;
        accelBtn.textContent = "加速中...";
        break;

      default:
        meditationBtn.disabled = false;
        meditationBtn.textContent = "瞑想モード";
        accelBtn.disabled = !window.accelerationReady;
        accelBtn.textContent = "加速モード";
        break;
    }
  }

  // ===============================
  // 🧘‍♂️ 瞑想モード操作
  // ===============================
  meditationBtn.addEventListener("click", () => {
    // 🚫 加速中は完全ブロック
    if (modeState.current === "acceleration" || window.accelerationMode) {
      console.warn("⚠️ 加速中のため瞑想モードは使用できません");
      return;
    }

    if (!window.meditationMode) startMeditationExternally();
    else stopMeditationExternally();
  });

  function startMeditationExternally() {
    if (window.accelerationMode) return; // 二重保険
    modeState.current = "meditation";
    if (typeof window.startMeditation === "function") window.startMeditation();
    updateButtonStates();
  }

  function stopMeditationExternally() {
    modeState.current = "none";
    if (typeof window.stopMeditation === "function") window.stopMeditation();
    updateButtonStates();
  }

  // ===============================
  // ⚡ 加速モード操作
  // ===============================
  accelBtn.addEventListener("click", () => {
    // 🚫 瞑想中は加速禁止
    if (modeState.current === "meditation" || window.meditationMode) {
      console.warn("⚠️ 瞑想中のため加速モードは使用できません");
      return;
    }

    if (!window.accelerationMode && window.accelerationReady) {
      startAccelerationExternally();
    }
  });

  function startAccelerationExternally() {
  console.log("🎮 加速モード開始要求: current =", modeState.current);
  modeState.current = "acceleration";
  updateButtonStates();
  console.log("🎮 startAccelerationExternally → state:", modeState.current);

  // 🔹 Controllerのstateをグローバルに共有（他ファイルから参照可能にする）
  window.currentModeState = "acceleration";

  if (typeof window.startAcceleration === "function") window.startAcceleration();

  const duration = window.accelerationDuration || 10000;
  setTimeout(() => {
    if (!window.accelerationMode) {
      modeState.current = "none";
      window.currentModeState = "none"; // 同期解除
      updateButtonStates();
    }
  }, duration + 200);
}

  window.stopAccelerationExternally = function () {
  if (modeState.current !== "acceleration") return;
  modeState.current = "none";
  if (typeof window.endAcceleration === "function") window.endAcceleration();
  updateButtonStates();
};

  // ===============================
  // 🩺 クールダウン監視（再有効化）
  // ===============================
  // ===============================
// 🩺 クールダウン監視（再有効化）
// ===============================
setInterval(() => {
  // ✅ 現在「none」で、かつ実際にボタンが使用可能なときだけ更新
  if (modeState.current === "none" && window.accelerationReady && !window.accelerationMode && !window.meditationMode) {
    updateButtonStates();
  }
}, 1000);

});
