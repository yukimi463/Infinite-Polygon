// ===============================
// ⚡ 加速モード制御（完全同期・確実解除）
// ===============================

window.addEventListener("DOMContentLoaded", () => {

  const accelBtn = document.getElementById("accelerationModeBtn");
  if (!accelBtn) return;

  // ==== グローバル状態 ====
  window.accelerationMode = false;
  window.accelerationReady = true;
  window.accelerationTimer = null;
  window.accelerationCooldownTimer = null;

  // 既定パラメータ（未設定なら代入）
  window.accelerationMultiplier ??= 2.0;
  window.accelerationDuration ??= 10000;   // 10秒
  window.accelerationCooldown ??= 20000;   // 20秒

  accelBtn.addEventListener("click", () => {
    if (window.accelerationMode || !window.accelerationReady) return;
    window.startAcceleration();
  });

  // ===== 開始 =====
  window.startAcceleration = function () {
    // 多重防止
    clearTimeout(window.accelerationTimer);
    clearTimeout(window.accelerationCooldownTimer);

    window.accelerationMode = true;
    window.accelerationReady = false;

    accelBtn.textContent = "加速中...";
    accelBtn.disabled = true;

    // 背景エフェクト
    document.body.classList.add("acceleration-active");

    // 倍率適用
    window.clickValue *= window.accelerationMultiplier;
    window.autoSpeed *= window.accelerationMultiplier;

    console.log("⚡ 加速モード開始");

    // 効果終了タイマー
    window.accelerationTimer = setTimeout(() => {
      console.log("🕒 加速解除トリガー発動");
      window.endAcceleration();
    }, window.accelerationDuration);
  };

  // ===== 終了 =====
  window.endAcceleration = function () {
    if (!window.accelerationMode) {
      console.log("（加速解除スキップ：既に解除済）");
      return;
    }

    window.accelerationMode = false;
    document.body.classList.remove("acceleration-active");

    // 元に戻す
    window.clickValue /= window.accelerationMultiplier;
    window.autoSpeed /= window.accelerationMultiplier;

    accelBtn.textContent = "クールダウン中...";
    accelBtn.disabled = true;

    console.log("🧊 加速モード終了");

    // クールタイマー
    window.accelerationCooldownTimer = setTimeout(() => {
      window.accelerationReady = true;
      accelBtn.textContent = "加速モード";
      accelBtn.disabled = false;
      console.log("✅ クールダウン終了 → 再使用可能");
    }, window.accelerationCooldown);
  };
});
