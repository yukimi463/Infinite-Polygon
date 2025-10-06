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

autoBtn.addEventListener('pointerdown', function() {
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