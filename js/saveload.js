function saveGame() {
  const data = {
    sides, count, totalCount, clickValue,
    evolveCost, powerupLevel, powerupCost,
    miniUnlock, polyhedronUnlock,
    miniPolygons: miniPolygons.map(p => ({
      count: p._countObj.value,
      clickValue: p.clickValue,
      isRainbow: p.isRainbow
    }))
  };
  localStorage.setItem("polygonSave", JSON.stringify(data));
  alert("宇宙の記録が保存されました。");
}

function showStatusOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'status-overlay';
  overlay.innerHTML = `
    <div class="status-content">
      <h2>🪐 宇宙記録 再構成完了</h2>
      <p>図形：正${sides}角形${polyhedronUnlock ? " → 多面体領域" : ""}</p>
      <p>総通貨：${formatNumber(totalCount)}</p>
      <p>クリック値：${clickValue}</p>
      <p>強化Lv：${powerupLevel}</p>
      <p>${miniPolygons.length}個のミニ多角形が活動中</p>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('visible'), 10);
  setTimeout(() => overlay.classList.remove('visible'), 4000);
  setTimeout(() => overlay.remove(), 4500);
}

function flashBackground() {
  const aurora = document.querySelector('.aurora');
  if (!aurora) return;
  aurora.style.transition = 'filter 0.8s ease';
  aurora.style.filter = 'brightness(2)';
  setTimeout(() => aurora.style.filter = 'brightness(1)', 1200);
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("polygonSave"));
  if (!data) return alert("保存データがありません。");

  ({ sides, count, totalCount, clickValue,
     evolveCost, powerupLevel, powerupCost,
     miniUnlock, polyhedronUnlock } = data);

  miniPolygons = [];
  gameWrapper.innerHTML = "";
  polygonDiv = createPolygon(sides, count);
  gameWrapper.appendChild(polygonDiv);
  polygonDiv.querySelector('.polygon').addEventListener('pointerdown', handleClick);

  if (data.miniPolygons) {
    data.miniPolygons.forEach(m => {
      const mini = createPolygon(sides, m.count, true, m.clickValue);
      gameWrapper.appendChild(mini);
      if (m.isRainbow) {
        mini.querySelector('.polygon').style.background =
          "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
      }
    });

    if (typeof checkMiniUnlock === "function") {
    checkMiniUnlock(); // ← ロードボタン経由でも反映
  }
  }

  updateTotalCounter();
  updateEvolveBtn();
  updatePowerupBtn();
  updateRainbowBtn();
  updateRoundness();

  flashBackground();
  showStatusOverlay();
}

function resetGameData() {
  if (!confirm("本当に全データをリセットしますか？")) return;

  localStorage.clear();
  totalCount = 0;
  count = 0;
  powerupLevel = 0;
  features = {};
  document.getElementById("totalCounter").textContent = "所持金: 0";
  alert("データをリセットしました。ページを再読み込みします。");
  location.reload();
}

