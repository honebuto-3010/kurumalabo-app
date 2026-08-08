// ===============================
// 給油データの読み込み
// ===============================
let oilData = JSON.parse(localStorage.getItem("oilData") || "[]");

// ===============================
// 初期化（oil.html 読み込み後に呼ばれる）
// ===============================
function initOil() {
    renderOilList();

    // 保存ボタンのイベント設定
    const saveBtn = document.querySelector(".submit-btn");
    saveBtn.onclick = addOil;
}

// ===============================
// 給油データの保存
// ===============================
function addOil() {
    const date = document.getElementById("oil-date").value;
    const liter = document.getElementById("oil-liter").value;
    const price = document.getElementById("oil-price").value;
    const place = document.getElementById("oil-place").value;
    const type = document.getElementById("oil-type").value;

    if (!date || !liter || !price) {
        alert("給油日・給油量・金額は必須です");
        return;
    }

    const record = {
        date,
        liter,
        price,
        place,
        type
    };

    oilData.push(record);
    saveOilData();
    renderOilList();

    alert("給油記録を保存しました！");

    // 🔥 保存後に自動でホームへ戻る
    loadView('home');
}

// ===============================
// localStorage に保存
// ===============================
function saveOilData() {
    localStorage.setItem("oilData", JSON.stringify(oilData));
}

// ===============================
// 給油履歴の表示
// ===============================
function renderOilList() {
    const listEl = document.getElementById("oil-history");
    if (!listEl) return;

    const sorted = [...oilData].sort((a, b) => new Date(b.date) - new Date(a.date));

    listEl.innerHTML = sorted.map((item, index) => `
        <li class="oil-item">
            <div>
                <strong>${item.date}</strong><br>
                種類：${item.type}<br>
                給油量：${item.liter} L<br>
                金額：${item.price} 円<br>
                ${item.place ? `給油場所：${item.place}` : ""}
            </div>
            <button class="delete-btn" onclick="deleteOil(${index})">削除</button>
        </li>
    `).join("");
}

// ===============================
// 給油データの削除
// ===============================
function deleteOil(index) {
    if (!confirm("この給油記録を削除しますか？")) return;

    const sorted = [...oilData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const target = sorted[index];

    oilData = oilData.filter(item => item !== target);

    saveOilData();
    renderOilList();
}

window.initOil = initOil;
