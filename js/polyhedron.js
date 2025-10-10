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

    // 頂点と辺の定義
    let vertices = [];
    let edges = [];
    if (type === "立方体") {
        vertices = [
            [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
            [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
        ];
        edges = [
            [0,1],[1,2],[2,3],[3,0],
            [4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
        ];
    } else if (type === "正八面体") {
        vertices = [
            [1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]
        ];
        edges = [
            [0,2],[0,3],[0,4],[0,5],
            [1,2],[1,3],[1,4],[1,5],
            [2,4],[2,5],[3,4],[3,5]
        ];
    }

    function project([x, y, z]) {
        const scale = 60;
        const px = canvas.width / 2 + x * scale * 0.8 + z * scale * 0.3;
        const py = canvas.height / 2 + y * scale * 0.8 - z * scale * 0.2;
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
    wrapper.addEventListener('pointerdown', () => {
        totalCount += clickValue * 100;
        countDiv.textContent = formatNumber(totalCount);
        updateTotalCounter();
        updateEvolveBtn();
        updatePowerupBtn();
        updateRainbowBtn();
        checkAutoUnlock();
    });

    // オートカウント（ON時に再セット）
    polygonDiv = wrapper;
    if (autoCounting) {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => {
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
