// ===============================
// 🎛 モードコントローラー（修正版）
// ===============================
// 瞑想モードと加速モードを排他制御し、状態を自動同期
// ===============================

window.addEventListener("DOMContentLoaded", () => {
  const meditationBtn = document.getElementById("meditationModeBtn");
  const accelBtn = document.getElementById("accelerationModeBtn");

  // モード状態
  const modeState = { current: "none" }; // "none" | "meditation" | "acceleration"

  // ===============================
  // 🎧 イベント登録
  // ===============================
  if (meditationBtn) {
    meditationBtn.addEventListener("click", () => {
      if (modeState.current === "acceleration") {
        // 加速中なら強制停止してから瞑想へ
        stopAccelerationExternally(true);
      }

      if (!window.meditationMode) {
        startMeditationExternally();
      } else {
        stopMeditationExternally();
      }
    });
  }

  if (accelBtn) {
    accelBtn.addEventListener("click", () => {
      if (modeState.current === "meditation") {
        // 瞑想中なら強制停止してから加速へ
        stopMeditationExternally(true);
      }

      if (!window.accelerationMode && window.accelerationReady) {
        startAccelerationExternally();
      }
    });
  }

  // ===============================
  // 🧘‍♂️ 瞑想モード制御
  // ===============================
  function startMeditationExternally() {
    modeState.current = "meditation";
    if (typeof window.startMeditation === "function") window.startMeditation();
    if (accelBtn) accelBtn.disabled = true;
  }

  function stopMeditationExternally(force = false) {
    if (modeState.current !== "meditation" && !force) return;
    modeState.current = "none";
    if (typeof window.stopMeditation === "function") window.stopMeditation();
    if (accelBtn) accelBtn.disabled = false;
  }

  // ===============================
  // ⚡ 加速モード制御
  // ===============================
  function startAccelerationExternally() {
    modeState.current = "acceleration";
    if (typeof window.startAcceleration === "function") window.startAcceleration();
    if (meditationBtn) meditationBtn.disabled = true;

    // 🔁 加速解除後、自動でstateを戻す
    const duration = window.accelerationDuration || 10000;
    setTimeout(() => {
      if (window.accelerationMode === false) return; // 既に解除済みなら無視
      modeState.current = "none";
      if (meditationBtn) meditationBtn.disabled = false;
    }, duration + 100); // 少し余裕を持たせて安全解除
  }

  function stopAccelerationExternally(force = false) {
    if (modeState.current !== "acceleration" && !force) return;
    modeState.current = "none";
    if (typeof window.endAcceleration === "function") window.endAcceleration();
    if (meditationBtn) meditationBtn.disabled = false;
  }

  // ===============================
  // 🧩 自動状態同期（開発デバッグ用）
  // ===============================
  setInterval(() => {
    // console.log("🛰 現在のモード:", modeState.current);
  }, 5000);
});
