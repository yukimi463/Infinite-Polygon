let autoCounting = false;
let autoInterval = null;

// 安全にグローバル変数を参照するためのヘルパー
function safeGet(id) {
  return document.getElementById(id);
}

// ✅ 通常の自動クリック処理
function autoCount() {
  if (typeof clickValue === "undefined") return;

  count += clickValue;
  totalCount += clickValue;

  if (typeof updatePolygonValue === "function") updatePolygonValue();

  if (typeof miniPolygons !== "undefined") {
    miniPolygons.forEach(obj => {
      obj._countObj.value += obj.clickValue;
      obj.polygon.textContent = formatNumber(obj._countObj.value);
      if (typeof adjustFontSize === "function")
        adjustFontSize(obj.polygon, obj._countObj.value, true);
      totalCount += obj.clickValue;
    });
  }

  if (typeof updateMiniPolygonValues === "function") updateMiniPolygonValues();
  if (typeof updateTotalCounter === "function") updateTotalCounter();
  if (typeof updateEvolveBtn === "function") updateEvolveBtn();
  if (typeof updatePowerupBtn === "function") updatePowerupBtn();
  if (typeof checkAutoUnlock === "function") checkAutoUnlock();
  if (typeof checkPolyhedronUnlock === "function") checkPolyhedronUnlock();
}

// ▶️ オートカウント開始
function startAutoCount() {
  if (autoCounting) return;
  autoCounting = true;

  // 多面体状態かを確認
  const polygonDiv = document.querySelector("#gameWrapper canvas")?.parentElement;

  if (polygonDiv && polygonDiv.querySelector("canvas")) {
    // 多面体（3Dモード）
    autoInterval = setInterval(() => {
      if (typeof clickValue === "undefined") return;
      totalCount += clickValue * 100;
      const countDiv = polygonDiv.querySelector("div:not(.polygon-name)");
      if (countDiv) countDiv.textContent = formatNumber(totalCount);
      if (typeof updateTotalCounter === "function") updateTotalCounter();
      if (typeof updateEvolveBtn === "function") updateEvolveBtn();
      if (typeof updatePowerupBtn === "function") updatePowerupBtn();
      if (typeof updateRainbowBtn === "function") updateRainbowBtn();
      if (typeof checkAutoUnlock === "function") checkAutoUnlock();
    }, 1000);
  } else {
    // 通常の正多角形モード
    autoInterval = setInterval(() => {
      autoCount();
    }, 1000);
  }

  console.log("▶️ オートカウント開始");
}

// ⏹ 停止
function stopAutoCount() {
  clearInterval(autoInterval);
  autoInterval = null;
  autoCounting = false;
  console.log("⏹ オートカウント停止");
}
