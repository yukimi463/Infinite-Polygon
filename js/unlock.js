function checkMiniUnlock() {
  // すでに解放済みなら何もしない
  if (miniUnlock) return;

  // 機能が実際に解放されたか確認
  if (window.features && window.features.miniPolygon) {
    miniUnlock = true;
  }
}

function checkPolyhedronUnlock() {
    // 1Gg = 1e100
    if (!polyhedronUnlock && totalCount >= 1e100) {
        polyhedronUnlock = true;
        alert("次元拡張！正多面体が解放されました！");
        updateEvolveBtn(); // ボタン状態更新
    }
}

// ===============================
// 🔓 機能解放モーダル制御
// ===============================

document.getElementById("unlockFeatureBtn").addEventListener("click", () => {
  document.getElementById("unlockModal").classList.remove("hidden");
  updateUnlockButtons();
});

function closeUnlockModal() {
  document.getElementById("unlockModal").classList.add("hidden");
}

// 🔐 機能状態を保存・読込
if (!window.features) {
  window.features = JSON.parse(localStorage.getItem("features") || "{}");
}

// ===============================
// 💰 機能解放処理
// ===============================

function unlockFeature(key, cost) {
  if (totalCount < cost) {
    alert("コインが足りません！");
    return;
  }

  if (window.features[key]) {
    alert("すでに解放済みです！");
    return;
  }

  totalCount -= cost;
  window.features[key] = true;
  localStorage.setItem("features", JSON.stringify(window.features));
  document.getElementById("totalCounter").textContent = `所持金: ${totalCount}`;
  updateUnlockButtons();

  // ✅ 機能名を日本語に変換
  const featureNames = {
    autoCount: "オートカウント機能",
    miniPolygon: "ミニ正多角形生成機能",
    rainbow: "虹色変色機能",
    modeChange: "モード変更機能",
    eventResonance: "イベント機能"
  };

  const name = featureNames[key] || key;

  // ✅ 解放時の個別処理
  if (key === "autoCount" && typeof createAutoToggleButton === "function") {
    createAutoToggleButton();
  }

  if (key === "miniPolygon" && typeof checkMiniUnlock === "function") {
    checkMiniUnlock();
  }

  if (key === "rainbow") {
    createRainbowButton();
  }

  // ✅ 汎用メッセージ
  alert(`${name}を解放しました！`);
}

// ===============================
// 🎛️ 機能UI更新
// ===============================

function updateUnlockButtons() {
  const features = window.features;
  const map = {
    autoCount: "feature-auto",
    miniPolygon: "feature-mini",
    rainbow: "feature-rainbow",
    modeChange: "feature-mode",
    eventResonance: "feature-event",
  };
  for (const key in map) {
    const el = document.getElementById(map[key]);
    const btn = el.querySelector("button");
    if (features[key]) {
      btn.textContent = "解放済み";
      btn.disabled = true;
      el.style.opacity = 0.6;
    } else {
      btn.disabled = totalCount < parseInt(btn.getAttribute("onclick").match(/\d+/)[0]);
    }
  }
}

// ===============================
// 🟢 オートカウントON/OFFボタン生成
// ===============================

function createAutoToggleButton() {
  if (document.getElementById("autoToggleBtn")) return;
  const container = document.getElementById("autoToggleContainer");
  const btn = document.createElement("button");
  btn.id = "autoToggleBtn";
  btn.classList.add("off");
  btn.textContent = "AUTO: OFF";
  btn.addEventListener("click", toggleAutoCount);
  container.appendChild(btn);
}

function toggleAutoCount() {
  const btn = document.getElementById("autoToggleBtn");
  if (btn.classList.contains("off")) {
    btn.classList.remove("off");
    btn.textContent = "AUTO: ON";
    startAutoCount();
  } else {
    btn.classList.add("off");
    btn.textContent = "AUTO: OFF";
    stopAutoCount();
  }
}

// ===============================
// 🔄 ページロード時の復元
// ===============================

window.addEventListener("load", () => {
  const f = JSON.parse(localStorage.getItem("features") || "{}");
  if (f.autoCount) createAutoToggleButton();
});

// ===============================
// 🧭 モード変更ボタン生成
// ===============================
function createModeButton() {
  if (document.getElementById("modeChangeBtn")) return;
  const container = document.getElementById("modeToggleContainer");

  const btn = document.createElement("button");
  btn.id = "modeChangeBtn";
  btn.textContent = "MODE";
  btn.classList.add("mode-btn");
  btn.addEventListener("click", openModeModal);

  container.appendChild(btn);
}

// 🔄 解放後に呼ばれるようフック
const originalUnlockFeature = unlockFeature;
unlockFeature = function (key, cost) {
  originalUnlockFeature(key, cost);
  if (key === "autoCount") createAutoToggleButton();
  if (key === "modeChange") createModeButton();
};

// 🔁 ページ読み込み時に再生成
window.addEventListener("load", () => {
  const f = JSON.parse(localStorage.getItem("features") || "{}");
  if (f.autoCount) createAutoToggleButton();
  if (f.modeChange) createModeButton();
});
