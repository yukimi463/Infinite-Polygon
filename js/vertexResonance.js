function triggerVertexResonance() {
  if (meteorActive) return; // 重複防止
  meteorActive = true;

  // 🌠 流星群演出開始
  createMeteorShower();

  // 頂点をランダムで選択
  const vertexCount = getPolygonPoints(sides).coords.length;
  const glowCount = Math.floor(Math.random() * 3) + 2; // 2～4個が光る
  glowingVertices = [];

  for (let i = 0; i < glowCount; i++) {
    const index = Math.floor(Math.random() * vertexCount);
    glowingVertices.push(index);
  }

  renderGlowingVertices();

  // 5秒後に終了
  setTimeout(() => {
    clearGlowingVertices();
    meteorActive = false;
  }, 10000);
}

function renderGlowingVertices(isMini = false) {
  // polygon-wrapperを取得
  const wrapper = document.querySelector(".polygon-wrapper");
  if (!wrapper) return;

  // 頂点座標を取得
  const { coords } = getPolygonPoints(window.sides);

  glowingVertices.forEach(i => {
    const pt = coords[i];
    if (!pt) return;
    
    const dot = document.createElement('div');
    dot.className = 'vertex-glow';

    // サイズ基準（miniと通常で切替）
    const baseSize = isMini ? 86 : 260;       // wrapper基準（.polygon-wrapper）
    const polygonSize = isMini ? 66 : 200;    // polygonサイズ（.polygon）
    const offset = (baseSize - polygonSize) / 2; // polygonを中央に置くための補正

    // % → px換算
    const scale = polygonSize / 100;
    const x = pt.x * scale + offset;
    const y = pt.y * scale + offset + (isMini ? 4 : 8); // 垂直方向の微調整

    // 位置設定
    dot.style.position = "absolute";
    dot.style.left = `${x}px`;
    dot.style.top  = `${y}px`;

    // クリックでエネルギー加算
    dot.addEventListener("click", () => {
      accelEnergy += 1;
      dot.classList.add("collected");
      setTimeout(() => dot.remove(), 300);
    });

    // wrapper内に追加
    wrapper.appendChild(dot);
  });
}

function clearGlowingVertices() {
  document.querySelectorAll(".vertex-glow").forEach(e => e.remove());
  glowingVertices = [];
}

function createMeteorShower() {
  const sky = document.body;
  for (let i = 0; i < 5; i++) {
    const meteor = document.createElement("div");
    meteor.className = "meteor";
    meteor.style.left = `${Math.random() * 100}%`;
    meteor.style.animationDelay = `${Math.random() * 2}s`;
    sky.appendChild(meteor);
    setTimeout(() => meteor.remove(), 3000);
  }
}

// 自動的に一定確率で発生
setInterval(() => {
  if (Math.random() < 0.5) { // 約5%の確率で発生
    triggerVertexResonance();
  }
}, 5000);
