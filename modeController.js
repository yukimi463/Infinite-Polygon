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
  localStorage.setItem("features", JSON.stringify(window.features));
  document.getElementById("totalCounter").textContent = `所持金: ${totalCount}`;
  updateModeModal();
  alert(mode === "meditation" ? "瞑想モードを解放しました！" : "加速モードを解放しました！");
}

function updateModeModal() {
  const f = window.features || {};
  const meditationItem = document.getElementById("meditationModeItem");
  const accelItem = document.getElementById("accelerationModeItem");

  const meditationBtn = meditationItem.querySelector("button");
  const accelBtn = accelItem.querySelector("button");

  if (f.meditationMode) {
    meditationBtn.textContent = "選択";
    meditationBtn.onclick = () => selectMode("meditation");
  } else {
    meditationBtn.textContent = "解放";
    meditationBtn.disabled = totalCount < 10000;
  }

  if (f.accelerationMode) {
    accelBtn.textContent = "選択";
    accelBtn.onclick = () => selectMode("acceleration");
  } else {
    accelBtn.textContent = "解放";
    accelBtn.disabled = totalCount < 100000;
  }
}

function selectMode(mode) {
  // すべてのモードをリセット（重複動作防止）
  if (typeof window.stopMeditation === "function") window.stopMeditation();
  if (typeof window.stopAccelerationExternally === "function") window.stopAccelerationExternally();

  switch (mode) {
    case "meditation":
      // 瞑想モード開始
      if (typeof window.startMeditation === "function") {
        window.startMeditation();
        window.currentMode = "meditation";
        alert("🧘‍♂️ 瞑想モードを開始しました。");
      } else {
        console.warn("⚠️ startMeditation 関数が見つかりません。");
      }
      break;

    case "acceleration":
      // 加速モード開始
      if (typeof window.startAccelerationExternally === "function") {
        window.startAccelerationExternally();
        window.currentMode = "acceleration";
        alert("⚡ 加速モードを開始しました。");
      } else {
        console.warn("⚠️ startAccelerationExternally 関数が見つかりません。");
      }
      break;

    default:
      // 通常モードに戻る
      window.currentMode = "normal";
      alert("🔄 通常モードに戻りました。");
      break;
  }

  closeModeModal();
}

