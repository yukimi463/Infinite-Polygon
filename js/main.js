window.onload = function() {
    // ここに元の初期化処理（polygonDiv = createPolygon...など）を記述
    polygonDiv = createPolygon(sides, count);
    gameWrapper.appendChild(polygonDiv);
    polygonDiv.querySelector('.polygon').addEventListener('pointerdown', handleClick);

    updateEvolveBtn();
    updatePowerupBtn();
    updateRainbowBtn();
    updateRoundness(); // ← これを追加
};