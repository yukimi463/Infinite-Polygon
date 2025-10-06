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
        polygon.addEventListener('pointerdown', function(e) {
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

    