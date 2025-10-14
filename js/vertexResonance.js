function triggerVertexResonance() {
  if (!window.features?.eventResonance) {
    console.log("🚫 イベント機能未解放のため、頂点共鳴は発生しません。");
    return;
  }
  if (meteorActive) return; // 重複防止
  meteorActive = true;

  // 頂点をランダムで選択
  const vertexCount = getPolygonPoints(sides).coords.length;
  const glowCount = Math.floor(Math.random() * vertexCount) + 1; // 1～頂点数までランダム
  glowingVertices = [];

  const available = Array.from({ length: vertexCount }, (_, i) => i); // [0,1,2,3,...]
  for (let i = 0; i < glowCount && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available.splice(randomIndex, 1)[0]; // 取り出して配列から削除
    glowingVertices.push(chosen);
  }

  // 🌠 流星群演出開始（頂点数と連動）
  createMeteorShower(glowCount);

  // 頂点発光
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
      console.log(`加速エネルギー +1 (現在: ${accelEnergy})`);
    });

    // wrapper内に追加
    wrapper.appendChild(dot);
    updateAccelerationDescription();
  });
}

function clearGlowingVertices() {
  document.querySelectorAll(".vertex-glow").forEach(e => e.remove());
  glowingVertices = [];
}

function createMeteorShower(glowCount = 5) {
  const sky = document.body;

  // ベースとなる流星の出現位置パターン
  const basePositions = [
    { top: "10%", left: "80%" },
    { top: "30%", left: "70%" },
    { top: "50%", left: "90%" },
    { top: "60%", left: "60%" },
    { top: "80%", left: "85%" },
  ];

  // 光っている頂点の数だけループ
  for (let i = 0; i < glowCount; i++) {
    const meteor = document.createElement("div");
    meteor.className = "meteor";

    // ベース位置を参照（数が足りなければループ）
    const pos = basePositions[i % basePositions.length];
    meteor.style.top = pos.top;
    meteor.style.left = pos.left;

    // スタート時間をずらして流れるように
    meteor.style.animationDelay = `${i * 0.6}s`;

    sky.appendChild(meteor);

    // アニメーション終了後に削除
    setTimeout(() => meteor.remove(), 4000);
  }
}

// 自動的に一定確率で発生
setInterval(() => {
  // 🔹 イベント機能が解放されていない場合はスキップ
  if (!window.features?.eventResonance) return;

  if (Math.random() < 0.5) { // 約5%の確率で発生
    triggerVertexResonance();
  }
}, 5000);