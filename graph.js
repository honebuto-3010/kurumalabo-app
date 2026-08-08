function initGraph() {
    const ctx = document.getElementById("oilChart");

    const oilData = JSON.parse(localStorage.getItem("oilData") || "[]");

    if (oilData.length === 0) {
        ctx.innerHTML = "給油データがありません";
        return;
    }

    // 日付順に並べ替え
    oilData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 色設定
    function getColorByType(type) {
        switch (type) {
            case "レギュラー": return "#cc0000";
            case "ハイオク":   return "#ff8800";
            case "軽油":       return "#009933";
            default:          return "#003c82";
        }
    }

    // 種類ごとに分類
    const regular = oilData.filter(i => i.type === "レギュラー");
    const premium = oilData.filter(i => i.type === "ハイオク");
    const diesel  = oilData.filter(i => i.type === "軽油");

    // 折れ線データセット（給油量）
    function toLineDataset(list, label) {
    return {
        label: `${label}（給油量）`,
        type: "line",
        data: list.map(i => Number(i.liter)),

        /* 色（既存の色をそのまま使用） */
        borderColor: getColorByType(label),
        backgroundColor: getColorByType(label) + "22", /* 透明度を薄く */

        /* 線デザイン */
        borderWidth: 2,        /* 線を細く */
        tension: 0.4,          /* 滑らかに */
        fill: false,           /* 塗りつぶしなし（ミニマル） */

        /* 点デザイン */
        pointRadius: 3,        /* 小さく */
        pointHoverRadius: 6,   /* hover時だけ大きく */
        pointBackgroundColor: getColorByType(label),
        pointBorderWidth: 0,

        /* 軸 */
        yAxisID: "y1"
    };
}

    // 棒グラフデータセット（金額）
    const priceDataset = {
    label: "金額（円）",
    type: "bar",
    data: oilData.map(i => Number(i.price)),

    backgroundColor: "rgba(0, 60, 130, 0.25)", /* 柔らかい青 */
    borderColor: "rgba(0, 60, 130, 0.5)",
    borderWidth: 1,
    borderRadius: 6, /* 角丸でApple風 */

    yAxisID: "y2"
};

    // 既存グラフ破棄
    if (window.oilChartInstance) {
        window.oilChartInstance.destroy();
    }

    // 複合グラフ作成
    window.oilChartInstance = new Chart(ctx, {
        data: {
            labels: oilData.map(i => i.date),
            datasets: [
                toLineDataset(regular, "レギュラー"),
                toLineDataset(premium, "ハイオク"),
                toLineDataset(diesel, "軽油"),
                priceDataset
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y1: {
                    type: "linear",
                    position: "left",
                    beginAtZero: true,
                    title: { display: true, text: "給油量（L）" }
                },
                y2: {
                    type: "linear",
                    position: "right",
                    beginAtZero: true,
                    title: { display: true, text: "金額（円）" },
                    grid: { drawOnChartArea: false } // 左軸と重ならないように
                },
                x: {
                    title: { display: true, text: "給油日" }
                }
            }
        }
    });

    // ラボ風カード表示（既存）
    const priceList = document.getElementById("oilPriceList");
    if (priceList) {
        priceList.innerHTML = oilData.map(item => `
            <div class="price-item" style="--bar-color:${getColorByType(item.type)};">
                <strong>${item.date}</strong><br>
                種類：${item.type}<br>
                給油量：${item.liter} L<br>
                金額：${item.price} 円<br>
                ${item.place ? `給油場所：${item.place}` : ""}
            </div>
        `).join("");
    }
}

window.initGraph = initGraph;
