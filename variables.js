let sides = 3;

// ▼ window経由で共有したい変数は window. を付ける
window.count = 0;
window.totalCount = 0; // 通貨
window.clickValue = 1;
window.autoSpeed = 1;
window.evolveCost = 10;
window.rainbowCost = window.evolveCost;
window.autoCounting = false;
window.autoInterval = null;

// 強化関連
window.powerupLevel = 0;
window.powerupCost = Math.floor(window.evolveCost / 10);

let polygonDiv;
window.miniPolygons = [];

window.miniUnlock = false; // ミニ生成解放フラグ
window.polyhedronUnlock = false; // 多面体解放フラグ

// 加速モード関連変数
window.accelerationMode = false;
window.accelerationMultiplier = 2.0;   // 倍率
window.accelerationDuration = 10000;   // 効果時間(ms)
window.accelerationCooldown = 20000;   // クールタイム(ms)
window.accelerationReady = true;

const gameWrapper = document.getElementById('gameWrapper');
const totalCounter = document.getElementById('totalCounter');
// 🧹 旧オートボタンは削除済み
// const autoBtn = document.getElementById('autoBtn');

const evolveBtn = document.getElementById('evolveBtn');
const evolveCostText = document.getElementById('evolveCostText');
const powerupBtn = document.getElementById('powerupBtn');
const powerupCostText = document.getElementById('powerupCostText');
const powerupLevelText = document.getElementById('powerupLevelText');
const rainbowBtn = document.getElementById('rainbowBtn');
const rainbowCostText = document.getElementById('rainbowCostText');

// 円度ゲージ要素参照
const roundnessDisplay = document.getElementById('roundnessDisplay');
const roundnessFill = document.getElementById('roundnessFill');
