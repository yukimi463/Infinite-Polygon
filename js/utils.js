function formatNumber(num) {
    const shortScale = [
        { value: 1e100, symbol: "Gg" },
        { value: 1e93, symbol: "Tg" },
        { value: 1e90, symbol: "Nv" },
        { value: 1e87, symbol: "Ov" },
        { value: 1e84, symbol: "Sv" },
        { value: 1e81, symbol: "Xv" },
        { value: 1e78, symbol: "Qv" },
        { value: 1e75, symbol: "Qtv" },
        { value: 1e72, symbol: "Tv" },
        { value: 1e69, symbol: "Dv" },
        { value: 1e66, symbol: "Uv" },
        { value: 1e63, symbol: "Vg" },
        { value: 1e60, symbol: "Nd" },
        { value: 1e57, symbol: "Od" },
        { value: 1e54, symbol: "Sd" },
        { value: 1e51, symbol: "Xd" },
        { value: 1e48, symbol: "Qd" },
        { value: 1e45, symbol: "Qtd" },
        { value: 1e42, symbol: "Td" },
        { value: 1e39, symbol: "Dd" },
        { value: 1e36, symbol: "Ud" },
        { value: 1e33, symbol: "Dc" },
        { value: 1e30, symbol: "No" },
        { value: 1e27, symbol: "Oc" },
        { value: 1e24, symbol: "Sp" },
        { value: 1e21, symbol: "Sx" },
        { value: 1e18, symbol: "Qt" },
        { value: 1e15, symbol: "Qd" },
        { value: 1e12, symbol: "T" },
        { value: 1e9,  symbol: "B" },
        { value: 1e6,  symbol: "M" },
        { value: 1e3,  symbol: "k" }
    ];
    for (let i = 0; i < shortScale.length; i++) {
        if (num >= shortScale[i].value) {
            return (num / shortScale[i].value).toFixed(2) + shortScale[i].symbol;
        }
    }
    return num.toString();
}

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

// ---------- UI 更新系 ----------
function updatePolygonValue() {
    if (!polygonDiv) return;
    const polygon = polygonDiv.querySelector('.polygon');
    if (!polygon) return;
    polygon.textContent = formatNumber(count);
    adjustFontSize(polygon, count, false);
}

function updateMiniPolygonValues() {
    if (!miniPolygons || miniPolygons.length === 0) return;
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
    updateRoundness();
}

function updatePowerupBtn() {
    powerupBtn.disabled = totalCount < powerupCost;
    powerupCostText.textContent = formatNumber(powerupCost);
    powerupLevelText.textContent = powerupLevel;
}

function updateRainbowBtn() {
    rainbowBtn.disabled = totalCount < rainbowCost || miniPolygons.length === 0;
    rainbowCostText.textContent = formatNumber(rainbowCost);
}

function updateRoundness() {
    const roundness = Math.min(100, Math.floor((sides / 100) * 100));
    if (roundnessDisplay && roundnessFill) {
        roundnessDisplay.textContent = `円度: ${roundness}%`;
        roundnessFill.style.width = `${roundness}%`;
    }
}
