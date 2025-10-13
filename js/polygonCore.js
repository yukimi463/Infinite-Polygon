function getPolygonPoints(sides) {
    const points = [];
    const coords = [];
    for (let i = 0; i < sides; i++) {
        const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
        const x = 50 + 50 * Math.cos(angle);
        const y = 50 + 50 * Math.sin(angle);
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
        name.style.marginBottom = "0px";
    }

    wrapper.appendChild(polygon);

    coords.forEach(pt => {
    const dot = document.createElement('div');
    dot.className = 'vertex-dot';

    const baseSize = isMini ? 86 : 260; // wrapper基準
    const polygonSize = isMini ? 66 : 200; // polygon基準

    // polygon中心をwrapper中央に合わせる補正値
    const offset = (baseSize - polygonSize) / 2;

    // %→px換算 + 中心補正
    const scale = polygonSize / 100;
    const x = pt.x * scale + offset;
    const y = pt.y * scale + offset + (isMini ? 4 : 8); // ←ここで微調整！

    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    wrapper.appendChild(dot);
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
            e.stopPropagation();
        });
        miniPolygons.push({ polygon, countRef: () => countObj.value, clickValue: miniClickValue, _countObj: countObj, isRainbow: false, rainbowTimeout: null });
        updateRainbowBtn();
    }

    return wrapper;
}

    