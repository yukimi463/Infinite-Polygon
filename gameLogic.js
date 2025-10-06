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

evolveBtn.addEventListener('pointerdown', function() {
    if (totalCount < evolveCost) return;

    if (polyhedronUnlock) {
        // 多面体進化
        const polyType = (count % 2 === 0) ? "立方体" : "正八面体";
        const polyDiv = createPolyhedron(polyType, totalCount);
        gameWrapper.replaceChild(polyDiv, polygonDiv);
        polygonDiv = polyDiv;

        // オート再設定
        if (autoCounting) {
            clearInterval(autoInterval);
            autoInterval = setInterval(() => {
                totalCount += clickValue * 100;
                const countDiv = polygonDiv.querySelector('div:not(.polygon-name)');
                if (countDiv) countDiv.textContent = formatNumber(totalCount);
                updateTotalCounter();
                updateEvolveBtn();
                updatePowerupBtn();
                updateRainbowBtn();
                checkAutoUnlock();
            }, 1000);
        }
    } else {
        // 通常の進化
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
        polygonDiv.querySelector('.polygon').addEventListener('pointerdown', handleClick);

        // オート再設定
        if (autoCounting) {
            clearInterval(autoInterval);
            autoInterval = setInterval(autoCount, 1000);
        }
    }

    updateTotalCounter();
    updateEvolveBtn();
    updatePowerupBtn();
    updateRainbowBtn();
});

powerupBtn.addEventListener('pointerdown', function() {
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