let sides = 3;
let count = 0;
let totalCount = 0; // 通貨
let clickValue = 1;
let evolveCost = 10;
let rainbowCost = evolveCost; // ←追加
let autoCounting = false;
let autoInterval = null;

// 強化関連
let powerupLevel = 0;
let powerupCost = Math.floor(evolveCost / 10);

let polygonDiv;
let miniPolygons = [];

let miniUnlock = false; // ミニ生成解放フラグ
let polyhedronUnlock = false; // 多面体解放フラグ

const gameWrapper = document.getElementById('gameWrapper');
const totalCounter = document.getElementById('totalCounter');
const autoBtn = document.getElementById('autoBtn');
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


