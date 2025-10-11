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
    window.currentModeState = "acceleration";

    if (typeof window.startAcceleration === "function") window.startAcceleration();

    const duration = window.accelerationDuration || 10000;
    setTimeout(() => {
      if (!window.accelerationMode) {
        modeState.current = "none";
        window.currentModeState = "none";
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
  setInterval(() => {
    if (
      modeState.current === "none" &&
      window.accelerationReady &&
      !window.accelerationMode &&
      !window.meditationMode
    ) {
      updateButtonStates();
    }
  }, 1000);
});

// ===============================
// 🧭 モード切替処理
// ===============================
function openModeModal() {
  document.getElementById("modeModal").classList.remove("hidden");
  updateModeModal();
}

function closeModeModal() {
  document.getElementById("modeModal").classList.add("hidden");
}

function unlockMode(mode, cost) {
  if (totalCount < cost) {
    alert("コインが足りません！");
    return;
  }

  const key = mode + "Mode";
  if (window.features[key]) {
    alert("すでに解放済みです！");
    return;
  }

  totalCount -= cost;
  window.features[key] = true;
  if (typeof saveFeatures === "function") saveFeatures();

  // 💰 ショートスケール表記を維持
  document.getElementById("totalCounter").textContent = `所持金: ${formatNumber(totalCount)}`;

  updateModeModal();

  // 🔹 モード変更ボタン自動生成（modeChange機能解放済み時）
  if (window.features.modeChange && typeof createModeToggleButton === "function") {
    createModeToggleButton();
  }

  alert(mode === "meditation" ? "🧘‍♂️ 瞑想モードを解放しました！" : "⚡ 加速モードを解放しました！");
}

function updateModeModal() {
  const f = window.features || {};
  const current = window.currentMode || "none";

  // 対象アイテム取得
  const normalItem = document.getElementById("modeModalNormal");
  const meditationItem = document.getElementById("meditationModeItem");
  const accelItem = document.getElementById("accelerationModeItem");

  const normalBtn = normalItem.querySelector("button");
  const meditationBtn = meditationItem.querySelector("button");
  const accelBtn = accelItem.querySelector("button");

  // 🔹 すべてのボタンからクラスをリセット
  [meditationBtn, accelBtn].forEach(btn => {
    btn.classList.remove("lock", "unlocked", "selected");
    btn.disabled = false;
  });

  if (true) { // 通常モードは常に解放済み扱い
    if (current === "normal") {
      // 現在選択中 → グレー
      normalBtn.classList.add("selected");
      normalBtn.textContent = "選択中";
    } else {
      // 解放済み（未選択）→ 青
      normalBtn.classList.add("unlocked");
      normalBtn.textContent = "選択";
      normalBtn.onclick = () => selectMode("normal");
    }
  }

  // ===============================
  // 🧘‍♂️ 瞑想モード
  // ===============================
  if (f.meditationMode) {
    if (current === "meditation") {
      // 現在選択中 → グレー
      meditationBtn.classList.add("selected");
      meditationBtn.textContent = "選択中";
    } else {
      // 解放済み（未選択）→ 青
      meditationBtn.classList.add("unlocked");
      meditationBtn.textContent = "選択";
      meditationBtn.onclick = () => selectMode("meditation");
    }
  } else {
    // 未解放 → 緑
    meditationBtn.classList.add("lock");
    meditationBtn.textContent = "解放";
    meditationBtn.onclick = () => unlockMode("meditation", 10000);
  }

  // ===============================
  // ⚡ 加速モード
  // ===============================
  if (f.accelerationMode) {
    if (current === "acceleration") {
      accelBtn.classList.add("selected");
      accelBtn.textContent = "選択中";
    } else {
      accelBtn.classList.add("unlocked");
      accelBtn.textContent = "選択";
      accelBtn.onclick = () => selectMode("acceleration");
    }
  } else {
    accelBtn.classList.add("lock");
    accelBtn.textContent = "解放";
    accelBtn.onclick = () => unlockMode("acceleration", 100000);
  }
}

function selectMode(mode) {
  if (typeof window.stopMeditation === "function") window.stopMeditation();
  if (typeof window.stopAccelerationExternally === "function") window.stopAccelerationExternally();

  window.currentMode = mode; // ← これを関数冒頭に追加（確実に更新）

  switch (mode) {
    case "meditation":
      if (typeof window.startMeditation === "function") {
        window.startMeditation();
        alert("🧘‍♂️ 瞑想モードを開始しました。");
      }
      break;

    case "acceleration":
      if (typeof window.startAccelerationExternally === "function") {
        window.startAccelerationExternally();
        alert("⚡ 加速モードを開始しました。");
      }
      break;

    default:
      alert("🔄 通常モードに戻りました。");
      break;
  }

  closeModeModal();
}

// ===============================
// 🚀 起動時に既存解放状態を復元
// ===============================
window.addEventListener("load", () => {
  const f = window.features || {};
  if (f.modeChange && typeof createModeToggleButton === "function") {
    createModeToggleButton();
  }
  if (typeof checkMiniUnlock === "function") {
    checkMiniUnlock(); // ← リロード直後にも状態復元
  }
});
