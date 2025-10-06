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