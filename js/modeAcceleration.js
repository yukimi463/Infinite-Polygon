// ===============================
// ⚡ 加速モード制御（Controller連携対応版）
// ===============================

// ===== 開始 =====
window.startAcceleration = function () {
  clearTimeout(window.accelerationTimer);
  clearTimeout(window.accelerationCooldownTimer);

  window.accelerationMode = true;
  window.accelerationReady = false;

  document.body.classList.add("acceleration-active");

  // 倍率適用
  window.clickValue *= window.accelerationMultiplier;
  window.autoSpeed *= window.accelerationMultiplier;

  console.log("⚡ 加速モード開始");
  // 残り時間を毎秒コンソールに表示
  const startTime = Date.now();
  const bonus = accelEnergy * 1000;
  const duration = (10000 + bonus); // ← ここで毎回リセットして新しく計算
  accelerationDuration = duration;
  const countdown = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, accelerationDuration - elapsed);
    console.log(`⏱ 残り加速時間: ${(remaining / 1000).toFixed(1)} 秒`);
    if (!window.accelerationMode || remaining <= 0) clearInterval(countdown);
  }, 1000);

  // 効果終了タイマー
  window.accelerationTimer = setTimeout(() => {
    console.log("🕒 加速解除トリガー発動");
    window.endAcceleration();
  }, window.accelerationDuration);
};

// ===== 終了 =====
window.endAcceleration = function () {
  if (!window.accelerationMode) return;

  window.accelerationMode = false;
  document.body.classList.remove("acceleration-active");

  // 元に戻す
  window.clickValue /= window.accelerationMultiplier;
  window.autoSpeed /= window.accelerationMultiplier;

  const accelBtn = document.getElementById("accelerationModeBtn");
  if (accelBtn) {
    accelBtn.textContent = "クールダウン中...";
    accelBtn.disabled = true;
  }

  console.log("🧊 加速モード終了");

  // Controllerへ通知
  if (typeof window.stopAccelerationExternally === "function") {
    console.log("🔁 Controllerへ終了通知");
    window.stopAccelerationExternally();
  }

  // クールタイマー
  window.accelerationCooldownTimer = setTimeout(() => {
    window.accelerationReady = true;
    if (accelBtn) {
      accelBtn.textContent = "加速モード";
      accelBtn.disabled = false;
    }
    console.log("✅ クールダウン終了 → 再使用可能");
  }, window.accelerationCooldown);
};

// ===============================
// 🧩 Controller連携用 外部呼び出し関数
// ===============================
window.startAccelerationExternally = function () {
  if (window.accelerationMode || !window.accelerationReady) {
    console.warn("⚠️ 加速モードは使用できません（再使用待機中）");
    return;
  }
  console.log("🎮 Controller → startAccelerationExternally 呼び出し");
  window.startAcceleration();
};

window.stopAccelerationExternally = function () {
  // すでに通常なら何もしない（←これが超重要）
  if (window.currentMode === "normal") return;

  console.log("🧭 加速終了 → 通常モードへ");
  window.currentMode = "normal";
};


function updateAccelerationDescription() {
  const base = 10;
  const bonus = accelEnergy;
  const total = base + bonus;
  const desc = document.getElementById("accelerationDescription");
  if (desc) desc.textContent = `${total}秒間クリック倍率2倍`;
}

