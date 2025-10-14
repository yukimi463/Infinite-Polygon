function createRainbowButton() {
  // すでにある場合は作らない
  if (document.getElementById("rainbowBtn")) return;

  window.rainbowCost = evolveCost * 10;

  // どこに挿入するか（進化・強化ボタン群のすぐ下に挿入）
  const container = document.querySelector("div[style*='margin-top:24px;']");
  if (!container) return;

  // 新しいボタン生成
  const rainbowBtn = document.createElement("button");
  rainbowBtn.id = "rainbowBtn";
  rainbowBtn.className = "auto-btn";
  rainbowBtn.innerHTML = `虹色変色（解放コスト: <span id="rainbowCostText">${formatNumber(rainbowCost)}</span>）`;
  rainbowBtn.disabled = false;

  // 🌈 イベント処理統合（rainbow.jsから移植）
  rainbowBtn.addEventListener('pointerdown', function() {
    if (totalCount < rainbowCost || miniPolygons.length === 0) return;

    // 解放コスト減算
    totalCount -= rainbowCost;
    updateTotalCounter();
    updateRainbowBtn();

    // ミニ多角形の選択
    const target = window.prompt(
      "虹色にするミニ正多角形の番号を入力（1～" + miniPolygons.length + "）"
    );
    const idx = parseInt(target, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= miniPolygons.length) return alert("番号が不正です");
    const obj = miniPolygons[idx];
    if (obj.isRainbow) return alert("すでに虹色です");

    // 虹色化処理
    obj.isRainbow = true;
    obj.polygon.style.background =
      "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
    obj.polygon.style.border = "2px solid #fff";
    obj._originalClickValue = obj.clickValue;
    obj.clickValue *= 10;

    // 10秒後に消滅
    obj.rainbowTimeout = setTimeout(() => {
      obj.clickValue = obj._originalClickValue;
      obj.isRainbow = false;
      if (obj.polygon.parentElement) {
        obj.polygon.parentElement.remove();
      }
      miniPolygons.splice(idx, 1);
      updateRainbowBtn();
    }, 10000);
  });

  // DOMに追加
  container.appendChild(rainbowBtn);
}
