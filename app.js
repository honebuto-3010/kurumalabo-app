window.addEventListener("load", () => {
    loadView("home");
});

// ===============================
// Service Worker
// ===============================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

// ===============================
// SPAビュー切り替え
// ===============================
async function loadView(page) {
    const html = await fetch(`${page}.html`).then(res => res.text());

    document.getElementById("app").innerHTML = html;

    if (page === "oil" && typeof initOil === "function") initOil();
    if (page === "graph" && typeof initGraph === "function") initGraph();
}

window.loadView = loadView;


// ===============================
// ホーム画面（カードUI）
// ===============================
function homeView() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="home-intro">
            <h2>車の健康診断ラボ</h2>
            <p>
                給油記録とグラフで、車の燃費を科学的に管理できます。
            </p>
        </div>

        <section class="cards">

            <a class="card" onclick="loadView('oil')">
                <div class="card-icon">⛽</div>
                給油記録
            </a>

            <a class="card" onclick="loadView('graph')">
                <div class="card-icon">📊</div>
                給油量グラフ
            </a>

        </section>
    `;
}

window.homeView = homeView;
