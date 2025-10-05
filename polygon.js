
        function getPolygonPoints(sides) {
            const points = [];
            const coords = [];
            for (let i = 0; i < sides; i++) {
                const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
                const x = 50 + 48 * Math.cos(angle);
                const y = 50 + 48 * Math.sin(angle);
                points.push(`${x}% ${y}%`);
                coords.push({ x: x, y: y });
            }
            return { 
                clipPath: `polygon(${points.join(', ')})`,
                coords: coords
            };
        }

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

        let polygonDiv;

        // ミニ多角形の参照を保持
        let miniPolygons = [];

        function adjustFontSize(element, value, isMini = false) {
            // formatNumberで表示する文字数で調整
            let length = String(formatNumber(value)).length;
            let baseSize = isMini ? 1 : 3; // ミニは小さめ
            let size = baseSize;
            if (length >= 7) size = isMini ? 0.5 : 1.5;
            else if (length >= 5) size = isMini ? 0.7 : 2;
            else if (length >= 3) size = isMini ? 0.9 : 2.5;
            element.style.fontSize = size + "rem";
        }

        function createPolygon(sides, count, isMini = false, miniClickValue = 1) {
            const wrapper = document.createElement('div');
            wrapper.className = 'polygon-wrapper';

            const name = document.createElement('div');
            name.className = 'polygon-name';
            name.textContent = isMini ? `正${sides}角形(ミニ)` : `正${sides}角形`;
            wrapper.appendChild(name);

            const { clipPath, coords } = getPolygonPoints(sides);

            const polygon = document.createElement('div');
            polygon.className = 'polygon';
            polygon.style.clipPath = clipPath;
            polygon.style.background = isMini
                ? `hsl(${200 + sides * 20}, 70%, 80%)`
                : `hsl(${200 + sides * 20}, 70%, 55%)`;
            polygon.textContent = formatNumber(count);
            adjustFontSize(polygon, count, isMini);

            // サイズ調整（ミニの場合は3分の1）
            if (isMini) {
                polygon.style.width = "66px";
                polygon.style.height = "66px";
                wrapper.style.width = "86px";
                wrapper.style.height = "86px";
                name.style.fontSize = "0.7rem";
                name.style.marginBottom = "4px";
            }

            wrapper.appendChild(polygon);

            coords.forEach(pt => {
                const dot = document.createElement('div');
                dot.className = 'vertex-dot';
                dot.style.left = isMini ? `${pt.x * 0.66}px` : `${pt.x * 2}px`;
                dot.style.top = isMini ? `${pt.y * 0.66}px` : `${pt.y * 2}px`;
                polygon.appendChild(dot);
            });

            // ミニ多角形のクリックイベント
            if (isMini) {
                const countObj = { value: count };
                polygon.addEventListener('click', function(e) {
                    // miniPolygonsから自分のobjを取得
                    const obj = miniPolygons.find(o => o.polygon === polygon);
                    const valueToAdd = obj ? obj.clickValue : miniClickValue;
                    countObj.value += valueToAdd;
                    polygon.textContent = formatNumber(countObj.value);
                    adjustFontSize(polygon, countObj.value, true);
                    totalCount += valueToAdd;
                    updateTotalCounter();
                    updateEvolveBtn();
                    updatePowerupBtn();
                    updateRainbowBtn();
                    checkAutoUnlock();
                    e.stopPropagation();
                });
                miniPolygons.push({ polygon, countRef: () => countObj.value, clickValue: miniClickValue, _countObj: countObj, isRainbow: false, rainbowTimeout: null });
                updateRainbowBtn();
            }

            return wrapper;
        }

        function updatePolygonValue() {
            const polygon = polygonDiv.querySelector('.polygon');
            polygon.textContent = formatNumber(count);
            adjustFontSize(polygon, count, false);
        }

        function updateMiniPolygonValues() {
            // ミニ多角形の数値表示・フォントサイズを自動調整
            miniPolygons.forEach(obj => {
                obj.polygon.textContent = formatNumber(obj.countRef());
                adjustFontSize(obj.polygon, obj.countRef(), true);
            });
            updateRainbowBtn();
        }

        function updateTotalCounter() {
            totalCounter.textContent = `所持金: ${formatNumber(totalCount)}`;
        }
        function updateEvolveBtn() {
            evolveBtn.disabled = totalCount < evolveCost;
            evolveCostText.textContent = formatNumber(evolveCost);
        }
        function updatePowerupBtn() {
            powerupBtn.disabled = totalCount < powerupCost;
            powerupCostText.textContent = formatNumber(powerupCost);
            powerupLevelText.textContent = powerupLevel;
        }
        // 虹色変色ボタンの状態更新
        function updateRainbowBtn() {
            rainbowBtn.disabled = totalCount < rainbowCost || miniPolygons.length === 0;
            rainbowCostText.textContent = formatNumber(rainbowCost);
            if (rainbowBtn.disabled) {
                console.log("虹色変色ボタン未解放: 所持金", totalCount, "ミニ多角形数", miniPolygons.length);
            } else {
                console.log("虹色変色ボタン解放: 所持金", totalCount, "ミニ多角形数", miniPolygons.length);
            }
        }

        let miniUnlock = false; // ミニ生成解放フラグ
        let polyhedronUnlock = false; // 多面体解放フラグ

        function checkMiniUnlock() {
            if (!miniUnlock && totalCount >= 1000) {
                miniUnlock = true;
                // 必要なら通知など追加
                alert("ミニ正n角形生成機能が解放されました！");
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

        // オートカウント解放判定関数（コンソール出力追加）
function checkAutoUnlock() {
    if (totalCount >= 100) {
        autoBtn.disabled = false;
        console.log("オートカウント解放: 所持金", totalCount);
    } else {
        autoBtn.disabled = true;
        console.log("オートカウント未解放: 所持金", totalCount);
    }
}

        function handleClick() {
            count += clickValue;
            totalCount += clickValue;
            updatePolygonValue();
            updateMiniPolygonValues();
            updateTotalCounter();
            updateEvolveBtn();
            updatePowerupBtn();
            checkAutoUnlock();
            checkMiniUnlock();
            checkPolyhedronUnlock(); // ←追加
            if (miniUnlock && Math.random() < 0.01) {
                const miniDiv = createPolygon(
                    sides,
                    0,
                    true,
                    Math.max(1, Math.floor(clickValue / 3))
                );
                gameWrapper.appendChild(miniDiv);
            }
        }

        function autoCount() {
            count += clickValue;
            totalCount += clickValue;
            updatePolygonValue();
            miniPolygons.forEach(obj => {
                obj._countObj.value += obj.clickValue;
                obj.polygon.textContent = formatNumber(obj._countObj.value);
                adjustFontSize(obj.polygon, obj._countObj.value, true);
                totalCount += obj.clickValue;
            });
            updateMiniPolygonValues();
            updateTotalCounter();
            updateEvolveBtn();
            updatePowerupBtn();
            checkAutoUnlock();
            checkPolyhedronUnlock(); // ←追加
        }

        evolveBtn.addEventListener('click', function() {
            if (totalCount >= evolveCost) {
                if (polyhedronUnlock) {
                    // 1Gg到達後は多面体へ
                    const polyType = (count % 2 === 0) ? "立方体" : "正八面体";
                    const polyDiv = createPolyhedron(polyType, totalCount);
                    gameWrapper.replaceChild(polyDiv, polygonDiv);
                    polygonDiv = polyDiv;
                } else {
                    sides++;
                    clickValue *= 2;
                    totalCount -= evolveCost;
                    count = 0;
                    evolveCost *= 10;
                    powerupCost = Math.floor(evolveCost / 10); // 強化コストも更新
                    rainbowCost = evolveCost; // 虹色コストも進化コストと同じ
                    const newPolygon = createPolygon(sides, count);
                    gameWrapper.replaceChild(newPolygon, polygonDiv);
                    polygonDiv = newPolygon;
                    polygonDiv.querySelector('.polygon').addEventListener('click', handleClick);
                }
                updateTotalCounter();
                updateEvolveBtn();
                updatePowerupBtn();
                updateRainbowBtn();
            }
        });

        powerupBtn.addEventListener('click', function() {
            if (totalCount >= powerupCost) {
                powerupLevel++;
                totalCount -= powerupCost;
                clickValue = Math.floor(clickValue * 1.5);
                powerupCost = Math.floor(powerupCost * 1.1);
                updateTotalCounter();
                updatePowerupBtn();
                updateEvolveBtn();
            }
        });

        // 虹色変色ボタンの処理
        rainbowBtn.addEventListener('click', function() {
            if (totalCount < rainbowCost || miniPolygons.length === 0) return;
            totalCount -= rainbowCost;
            updateTotalCounter();
            updateRainbowBtn();
            // ミニ多角形選択
            const target = window.prompt("虹色にするミニ正多角形の番号を入力（1～" + miniPolygons.length + "）");
            const idx = parseInt(target, 10) - 1;
            if (isNaN(idx) || idx < 0 || idx >= miniPolygons.length) return alert("番号が不正です");
            const obj = miniPolygons[idx];
            if (obj.isRainbow) return alert("すでに虹色です");

            // 虹色化
            obj.isRainbow = true;
            obj.polygon.style.background = "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
            obj.polygon.style.border = "2px solid #fff";
            obj._originalClickValue = obj.clickValue;
            obj.clickValue *= 10;

            // 10秒後に消滅（名称も同時に削除）
            obj.rainbowTimeout = setTimeout(() => {
                // 配列から削除する前に元の値に戻す（他の図形に影響しないように）
                obj.clickValue = obj._originalClickValue;
                obj.isRainbow = false;
                // 親のpolygon-wrapperを削除
                if (obj.polygon.parentElement) {
                    obj.polygon.parentElement.remove();
                }
                miniPolygons.splice(idx, 1);
                updateRainbowBtn();
            }, 10000);
        });

        // 例：最初にwindow.onloadで初期化するのが安全です
window.onload = function() {
    // ここに元の初期化処理（polygonDiv = createPolygon...など）を記述
    polygonDiv = createPolygon(sides, count);
    gameWrapper.appendChild(polygonDiv);
    polygonDiv.querySelector('.polygon').addEventListener('click', handleClick);

    updateEvolveBtn();
    updatePowerupBtn();
    updateRainbowBtn();
    checkAutoUnlock();
};


        function formatNumber(num) {
            // ショートスケール単位表記（1e100まで対応・省略名）
            const shortScale = [
                { value: 1e100, symbol: "Gg" },   // Googol
                { value: 1e93, symbol: "Tg" },    // Trigintillion
                { value: 1e90, symbol: "Nv" },    // Novemvigintillion
                { value: 1e87, symbol: "Ov" },    // Octovigintillion
                { value: 1e84, symbol: "Sv" },    // Septenvigintillion
                { value: 1e81, symbol: "Xv" },    // Sexvigintillion
                { value: 1e78, symbol: "Qv" },    // Quinvigintillion
                { value: 1e75, symbol: "Qtv" },   // Quattuorvigintillion
                { value: 1e72, symbol: "Tv" },    // Tresvigintillion
                { value: 1e69, symbol: "Dv" },    // Duovigintillion
                { value: 1e66, symbol: "Uv" },    // Unvigintillion
                { value: 1e63, symbol: "Vg" },    // Vigintillion
                { value: 1e60, symbol: "Nd" },    // Novemdecillion
                { value: 1e57, symbol: "Od" },    // Octodecillion
                { value: 1e54, symbol: "Sd" },    // Septendecillion
                { value: 1e51, symbol: "Xd" },    // Sexdecillion
                { value: 1e48, symbol: "Qd" },    // Quindecillion
                { value: 1e45, symbol: "Qtd" },   // Quattuordecillion
                { value: 1e42, symbol: "Td" },    // Tredecillion
                { value: 1e39, symbol: "Dd" },    // Duodecillion
                { value: 1e36, symbol: "Ud" },    // Undecillion
                { value: 1e33, symbol: "Dc" },    // Decillion
                { value: 1e30, symbol: "No" },    // Nonillion
                { value: 1e27, symbol: "Oc" },    // Octillion
                { value: 1e24, symbol: "Sp" },    // Septillion
                { value: 1e21, symbol: "Sx" },    // Sextillion
                { value: 1e18, symbol: "Qt" },    // Quintillion
                { value: 1e15, symbol: "Qd" },    // Quadrillion
                { value: 1e12, symbol: "T" },     // Trillion
                { value: 1e9,  symbol: "B" },     // Billion
                { value: 1e6,  symbol: "M" },     // Million
                { value: 1e3,  symbol: "k" }      // Thousand
            ];
            for (let i = 0; i < shortScale.length; i++) {
                if (num >= shortScale[i].value) {
                    return (num / shortScale[i].value).toFixed(2) + shortScale[i].symbol;
                }
            }
            return num.toString();
        }

        // 多面体描画関数（簡易ワイヤーフレーム）
function createPolyhedron(type, count) {
    const wrapper = document.createElement('div');
    wrapper.className = 'polygon-wrapper';

    const name = document.createElement('div');
    name.className = 'polygon-name';
    name.textContent = `正${type}面体`;
    wrapper.appendChild(name);

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.style.background = "#333";
    canvas.style.borderRadius = "12px";
    wrapper.appendChild(canvas);

    // 頂点・辺データ
    let vertices = [];
    let edges = [];
    if (type === "立方体") {
        vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        edges = [
            [0,1],[1,2],[2,3],[3,0],
            [4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
        ];
    } else if (type === "正八面体") {
        vertices = [
            [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]
        ];
        edges = [
            [0,2],[0,3],[0,4],[0,5],
            [1,2],[1,3],[1,4],[1,5],
            [2,4],[2,5],[3,4],[3,5]
        ];
    }
    function project([x, y, z]) {
        const scale = 60;
        const px = canvas.width/2 + x * scale * 0.8 + z * scale * 0.3;
        const py = canvas.height/2 + y * scale * 0.8 - z * scale * 0.2;
        return [px, py];
    }
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    edges.forEach(([a, b]) => {
        const [x1, y1] = project(vertices[a]);
        const [x2, y2] = project(vertices[b]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });

    // カウント表示
    const countDiv = document.createElement('div');
    countDiv.style.position = "absolute";
    countDiv.style.top = "50%";
    countDiv.style.left = "50%";
    countDiv.style.transform = "translate(-50%, -50%)";
    countDiv.style.color = "#fff";
    countDiv.style.fontSize = "2rem";
    countDiv.style.pointerEvents = "none";
    countDiv.textContent = formatNumber(count);
    wrapper.appendChild(countDiv);

    // クリックイベント
    wrapper.addEventListener('click', function() {
        totalCount += clickValue * 100; // 多面体は100倍
        countDiv.textContent = formatNumber(totalCount);
        updateTotalCounter();
        updateEvolveBtn();
        updatePowerupBtn();
        updateRainbowBtn();
        checkAutoUnlock();
    });

    // 多面体状態でもオートカウント・虹色変色が使えるように
    polygonDiv = wrapper;
    // オートカウント
    if (autoCounting) {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(function() {
            totalCount += clickValue * 100;
            countDiv.textContent = formatNumber(totalCount);
            updateTotalCounter();
            updateEvolveBtn();
            updatePowerupBtn();
            updateRainbowBtn();
            checkAutoUnlock();
        }, 1000);
    }

    return wrapper;
}

        autoBtn.addEventListener('click', function() {
    if (autoCounting) {
        autoCounting = false;
        clearInterval(autoInterval);
        autoInterval = null;
        autoBtn.textContent = "オートカウントON";
    } else {
        autoCounting = true;
        // 多面体状態かどうか判定
        if (polygonDiv && polygonDiv.querySelector('canvas')) {
            // 多面体状態
            autoInterval = setInterval(function() {
                // 多面体のカウント表示を更新
                totalCount += clickValue * 100;
                const countDiv = polygonDiv.querySelector('div:not(.polygon-name)');
                if (countDiv) {
                    countDiv.textContent = formatNumber(totalCount);
                }
                updateTotalCounter();
                updateEvolveBtn();
                updatePowerupBtn();
                updateRainbowBtn();
                checkAutoUnlock();
            }, 1000);
        } else {
            // 正多角形状態
            autoInterval = setInterval(function() {
                autoCount();
            }, 1000);
        }
        autoBtn.textContent = "オートカウントOFF";
    }
});

// 進化時にもオートカウントを再設定
evolveBtn.addEventListener('click', function() {
    if (totalCount >= evolveCost) {
        if (polyhedronUnlock) {
            const polyType = (count % 2 === 0) ? "立方体" : "正八面体";
            const polyDiv = createPolyhedron(polyType, totalCount);
            gameWrapper.replaceChild(polyDiv, polygonDiv);
            polygonDiv = polyDiv;
            // オートカウントがONなら再設定
            if (autoCounting) {
                clearInterval(autoInterval);
                autoInterval = setInterval(function() {
                    totalCount += clickValue * 100;
                    const countDiv = polygonDiv.querySelector('div:not(.polygon-name)');
                    if (countDiv) {
                        countDiv.textContent = formatNumber(totalCount);
                    }
                    updateTotalCounter();
                    updateEvolveBtn();
                    updatePowerupBtn();
                    updateRainbowBtn();
                    checkAutoUnlock();
                }, 1000);
            }
        } else {
            sides++;
            clickValue *= 2;
            totalCount -= evolveCost;
            count = 0;
            evolveCost *= 10;
            powerupCost = Math.floor(evolveCost / 10);
            rainbowCost = evolveCost;
            const newPolygon = createPolygon(sides, count);
            gameWrapper.replaceChild(newPolygon, polygonDiv);
            polygonDiv = newPolygon;
            polygonDiv.querySelector('.polygon').addEventListener('click', handleClick);
            // オートカウントがONなら再設定
            if (autoCounting) {
                clearInterval(autoInterval);
                autoInterval = setInterval(function() {
                    autoCount();
                }, 1000);
            }
        }
        updateTotalCounter();
        updateEvolveBtn();
        updatePowerupBtn();
        updateRainbowBtn();
    }
});

// 初期化時にボタン状態を必ず更新
updateEvolveBtn();
updatePowerupBtn();
updateRainbowBtn();
checkAutoUnlock(); // ←追加
    