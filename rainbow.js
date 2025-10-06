// 虹色変色ボタンの処理
rainbowBtn.addEventListener('pointerdown', function() {
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