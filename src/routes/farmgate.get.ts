import {
  buyers,
  cropMeta,
  fallbackLabels,
  fallbackWeather,
  markets,
  produce,
} from '@/data/farmgate';

const serialize = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

export default defineEventHandler(async (event) => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FarmGate Meru Prototype</title>
    <style>
      :root {
        --soil: #21301c;
        --soil-2: #2e4427;
        --paper: #f7f4ec;
        --card: #ffffff;
        --ink: #1c2419;
        --sub: #6b7363;
        --gold: #d98e04;
        --gold-bg: #fbefd3;
        --up: #2e7d32;
        --up-bg: #e4f0e4;
        --down: #c0392b;
        --down-bg: #f7e4e1;
        --sky: #2f7db5;
        --sky-bg: #e1eef6;
        --line: #e7e3d6;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background: #e9e5d8;
        color: var(--ink);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      button,
      input,
      select {
        font: inherit;
      }

      button,
      a {
        -webkit-tap-highlight-color: transparent;
      }

      .shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 16px;
      }

      .app {
        width: min(100%, 430px);
        min-height: min(840px, calc(100vh - 32px));
        background: var(--paper);
        border: 10px solid #1a2417;
        border-radius: 40px;
        box-shadow: 0 30px 70px rgba(33, 48, 28, 0.28);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .topbar,
      .nav {
        background: var(--card);
        border-color: var(--line);
        flex-shrink: 0;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px 10px;
        border-bottom: 1px solid var(--line);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
      }

      .brand-mark,
      .avatar,
      .crop-badge {
        display: grid;
        place-items: center;
        border-radius: 14px;
        font-weight: 800;
      }

      .brand-mark {
        width: 30px;
        height: 30px;
        background: var(--up-bg);
        color: var(--up);
      }

      .market-select {
        border: 0;
        border-radius: 999px;
        color: var(--soil);
        background: var(--gold-bg);
        padding: 8px 11px;
        font-size: 12px;
        font-weight: 700;
        max-width: 160px;
      }

      main {
        flex: 1;
        overflow-y: auto;
        padding: 14px 16px 96px;
      }

      .nav {
        border-top: 1px solid var(--line);
        display: grid;
        grid-template-columns: repeat(5, 1fr);
      }

      .nav button {
        border: 0;
        background: transparent;
        color: var(--sub);
        padding: 10px 4px 11px;
        display: grid;
        gap: 3px;
        place-items: center;
        font-size: 10px;
        font-weight: 700;
        cursor: pointer;
      }

      .nav button.active {
        color: var(--up);
      }

      .eyebrow,
      .mono {
        font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
      }

      .eyebrow {
        color: var(--gold);
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 800;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        font-size: 26px;
        line-height: 1.05;
        letter-spacing: -0.03em;
      }

      h2 {
        font-size: 19px;
        letter-spacing: -0.02em;
      }

      .muted {
        color: var(--sub);
      }

      .small {
        font-size: 12px;
        line-height: 1.45;
      }

      .tiny {
        font-size: 10px;
      }

      .stack {
        display: grid;
        gap: 12px;
      }

      .row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .between {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .card,
      .soft,
      .hero,
      .alert {
        border-radius: 20px;
      }

      .card {
        background: var(--card);
        border: 1px solid var(--line);
      }

      .card-pad {
        padding: 15px;
      }

      .hero {
        background: var(--soil);
        color: white;
        padding: 20px;
        position: relative;
        overflow: hidden;
      }

      .hero:after {
        content: "";
        position: absolute;
        width: 150px;
        height: 150px;
        right: -50px;
        top: -60px;
        border-radius: 50%;
        background: rgba(217, 142, 4, 0.18);
      }

      .hero > * {
        position: relative;
        z-index: 1;
      }

      .hero h2 {
        font-size: 24px;
        margin: 8px 0;
      }

      .hero p {
        color: #dce4d3;
        line-height: 1.55;
      }

      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 15px;
      }

      .btn,
      .pill,
      .chip {
        border-radius: 999px;
        border: 1px solid var(--line);
        font-weight: 800;
        cursor: pointer;
      }

      .btn {
        padding: 10px 14px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn.primary {
        background: var(--gold);
        border-color: var(--gold);
        color: var(--soil);
      }

      .btn.ghost {
        color: white;
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.18);
      }

      .pill {
        padding: 8px 11px;
        background: var(--card);
        color: var(--ink);
      }

      .pill.active {
        background: var(--soil);
        color: white;
        border-color: var(--soil);
      }

      .chip {
        padding: 6px 9px;
        border: 0;
        font-size: 11px;
      }

      .grid2 {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .grid3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .metric {
        padding: 14px;
      }

      .metric strong {
        display: block;
        margin-top: 8px;
        font-size: 19px;
      }

      .source-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .source {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 10px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }

      .list {
        overflow: hidden;
      }

      .list-item {
        width: 100%;
        border: 0;
        border-top: 1px solid var(--line);
        background: transparent;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 13px 14px;
        text-align: left;
        color: inherit;
      }

      .list-item:first-child {
        border-top: 0;
      }

      .crop-badge {
        width: 38px;
        height: 38px;
        background: var(--gold-bg);
        color: var(--soil);
        font-size: 12px;
        flex: 0 0 auto;
      }

      .grow {
        flex: 1;
        min-width: 0;
      }

      .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .spark {
        width: 70px;
        height: 26px;
        flex: 0 0 auto;
      }

      .alert {
        padding: 12px;
        display: flex;
        gap: 9px;
        align-items: flex-start;
      }

      .alert.warn {
        background: var(--down-bg);
        color: var(--down);
      }

      .alert.info {
        background: var(--sky-bg);
        color: var(--sky);
      }

      .alert.gold {
        background: var(--gold-bg);
        color: var(--soil);
      }

      .tabs {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .day {
        display: grid;
        grid-template-columns: 42px 34px 50px 48px 1fr;
        gap: 8px;
        align-items: center;
        padding: 11px;
      }

      .action {
        justify-self: end;
      }

      .gauge {
        width: 112px;
        height: 68px;
        flex: 0 0 auto;
      }

      .check {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 0;
        border-top: 1px solid var(--line);
      }

      .check:first-child {
        border-top: 0;
      }

      .check input {
        width: 18px;
        height: 18px;
        accent-color: var(--up);
      }

      .profile-form {
        display: grid;
        gap: 10px;
      }

      .field {
        display: grid;
        gap: 5px;
      }

      .field label {
        font-size: 11px;
        color: var(--sub);
        font-weight: 800;
      }

      .field input,
      .field select {
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 11px 12px;
        background: white;
        color: var(--ink);
      }

      .hidden {
        display: none !important;
      }

      @media (max-width: 520px) {
        .shell {
          padding: 0;
        }

        .app {
          min-height: 100vh;
          width: 100%;
          border: 0;
          border-radius: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <div class="app">
        <header class="topbar">
          <div class="brand">
            <span class="brand-mark">FG</span>
            <div>
              <div>FarmGate <span class="muted">Meru</span></div>
              <div class="tiny muted">Improved prototype</div>
            </div>
          </div>
          <select class="market-select" id="marketSelect" aria-label="Nearest market"></select>
        </header>
        <main id="appMain"></main>
        <nav class="nav" id="appNav" aria-label="Main navigation"></nav>
      </div>
    </div>
    <script>
      const seed = {
        markets: ${serialize(markets)},
        produce: ${serialize(produce)},
        buyers: ${serialize(buyers)},
        cropMeta: ${serialize(cropMeta)},
        fallbackWeather: ${serialize(fallbackWeather)},
        fallbackLabels: ${serialize(fallbackLabels)}
      };

      const SHEET_CSV_URL = "";
      const C = {
        soil: "#21301c",
        line: "#e7e3d6",
        up: "#2e7d32",
        upBg: "#e4f0e4",
        down: "#c0392b",
        downBg: "#f7e4e1",
        gold: "#d98e04",
        goldBg: "#fbefd3",
        sky: "#2f7db5",
        skyBg: "#e1eef6",
        sub: "#6b7363"
      };
      const labels = {
        en: {
          home: "Home",
          market: "Market",
          field: "Field",
          buyers: "Buyers",
          tools: "Tools",
          greeting: "Habari",
          advisory: "Advisory only. Confirm spray and major crop decisions with a local extension officer."
        },
        sw: {
          home: "Nyumbani",
          market: "Soko",
          field: "Shamba",
          buyers: "Wanunuzi",
          tools: "Zana",
          greeting: "Habari",
          advisory: "Ni ushauri tu. Thibitisha dawa na maamuzi makubwa na afisa ugani."
        }
      };
      const navItems = [
        ["home", "Home", "HM"],
        ["market", "Market", "MK"],
        ["field", "Field", "FL"],
        ["buyers", "Buyers", "BY"],
        ["tools", "Tools", "TL"]
      ];
      const state = {
        tab: "home",
        picked: null,
        crop: "Tomatoes",
        buyerCrop: "All",
        alertCrop: "Tomatoes",
        alertPrice: 70,
        checklist: {},
        market: seed.markets[0],
        profile: loadProfile(),
        prices: { list: seed.produce, live: false, loading: Boolean(SHEET_CSV_URL), note: SHEET_CSV_URL ? "Updating prices" : "Sample prices" },
        weather: { days: seed.fallbackWeather, labels: seed.fallbackLabels, live: false, loading: true, note: "Updating weather" },
        fx: { kes: null, live: false, loading: true, note: "Updating FX" }
      };

      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
          return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
        });
      }

      function loadProfile() {
        try {
          return Object.assign(
            { name: "Joseph", crops: ["Tomatoes", "Irish potatoes"], farmSize: 2, irrigation: "yes", language: "en" },
            JSON.parse(localStorage.getItem("farmgate-profile") || "{}")
          );
        } catch (_error) {
          return { name: "Joseph", crops: ["Tomatoes", "Irish potatoes"], farmSize: 2, irrigation: "yes", language: "en" };
        }
      }

      function saveProfile() {
        localStorage.setItem("farmgate-profile", JSON.stringify(state.profile));
      }

      function t(key) {
        return (labels[state.profile.language] || labels.en)[key] || labels.en[key] || key;
      }

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function r1(value) {
        return Math.round((value || 0) * 10) / 10;
      }

      function mean(values) {
        return values.length ? values.reduce(function (sum, value) { return sum + value; }, 0) / values.length : null;
      }

      function wmo(code) {
        if (code === 0 || code === 1) return "sun";
        if (code === 2 || code === 3) return "cloud";
        if (code === 45 || code === 48) return "fog";
        return "rain";
      }

      function parseCSV(text) {
        const rows = [];
        let row = [];
        let cell = "";
        let quoted = false;
        for (let i = 0; i < text.length; i += 1) {
          const char = text[i];
          const next = text[i + 1];
          if (char === '"' && quoted && next === '"') {
            cell += '"';
            i += 1;
          } else if (char === '"') {
            quoted = !quoted;
          } else if (char === "," && !quoted) {
            row.push(cell.trim());
            cell = "";
          } else if ((char === "\\n" || char === "\\r") && !quoted) {
            if (char === "\\r" && next === "\\n") i += 1;
            row.push(cell.trim());
            if (row.some(Boolean)) rows.push(row);
            row = [];
            cell = "";
          } else {
            cell += char;
          }
        }
        row.push(cell.trim());
        if (row.some(Boolean)) rows.push(row);
        const header = (rows.shift() || []).map(function (item) { return item.toLowerCase(); });
        return rows.map(function (cells) {
          return header.reduce(function (acc, key, index) {
            acc[key] = cells[index] || "";
            return acc;
          }, {});
        });
      }

      function computeAgronomy(days, cropName) {
        const meta = seed.cropMeta[cropName] || seed.cropMeta.Tomatoes;
        const series = days.map(function (day) {
          const blight = day.humMax >= 80 && day.lo >= 8 && day.hi <= 26 && (day.rain > 0 || day.cond === "fog")
            ? "High"
            : day.humMax >= 75 && day.hi <= 27
              ? "Moderate"
              : "Low";
          let action = "Hold";
          let color = C.sub;
          let bg = "#edeae0";
          if (day.smIndex < 25) {
            action = "Irrigate";
            color = C.sky;
            bg = C.skyBg;
          } else if (day.rain < 2 && day.hum < 68 && (day.cond === "sun" || day.cond === "cloud")) {
            action = "Harvest";
            color = C.gold;
            bg = C.goldBg;
          } else if (meta.kind === "annual" && day.smIndex >= 45 && day.rain >= 1) {
            action = "Plant";
            color = C.up;
            bg = C.upBg;
          }
          return Object.assign({}, day, { blight: blight, action: action, color: color, bg: bg });
        });
        const harvestDays = series.filter(function (day) { return day.action === "Harvest"; }).length;
        const highBlight = meta.blight && series.some(function (day) { return day.blight === "High"; });
        const dryNow = (series[0] && series[0].smIndex ? series[0].smIndex : 50) < 30;
        const confidence = highBlight || state.weather.live || state.prices.live ? "High" : "Medium";
        const reasons = [
          harvestDays + " dry harvest day" + (harvestDays === 1 ? "" : "s"),
          "soil moisture " + (series[0] ? series[0].smIndex : 45) + "%",
          state.weather.live ? "live weather" : "sample forecast",
          state.prices.live ? "live prices" : "sample prices"
        ];
        let headline;
        if (meta.kind === "tree") {
          headline = dryNow
            ? "Soil is drying. Irrigate " + cropName.toLowerCase() + " and harvest on dry days."
            : "Good week to harvest " + cropName.toLowerCase() + ". Pick on dry days and deliver same day.";
        } else if (harvestDays >= 2) {
          headline = "Harvest window: " + harvestDays + " dry days ahead for " + cropName.toLowerCase() + ".";
        } else {
          headline = "Mixed week for " + cropName.toLowerCase() + ". Use dry hours carefully.";
        }
        return { series: series, meta: meta, highBlight: highBlight, headline: headline, confidence: confidence, reasons: reasons };
      }

      function sourceStatus(item) {
        const color = item.loading ? C.sub : item.live ? C.up : C.gold;
        const label = item.loading ? "Updating" : item.live ? "Live" : "Sample";
        return '<span class="row tiny mono" style="gap:5px;color:' + color + '"><span class="dot" style="background:' + color + '"></span>' + label + '</span>';
      }

      function sparkline(data, up) {
        const min = Math.min.apply(null, data);
        const max = Math.max.apply(null, data);
        const points = data.map(function (value, index) {
          const x = (index / Math.max(1, data.length - 1)) * 70;
          const y = 24 - ((value - min) / (max - min || 1)) * 22;
          return x.toFixed(1) + "," + y.toFixed(1);
        }).join(" ");
        return '<svg class="spark" viewBox="0 0 70 26" aria-hidden="true"><polyline points="' + points + '" fill="none" stroke="' + (up ? C.up : C.down) + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }

      function gauge(value) {
        const dash = ((value / 100) * 132).toFixed(1);
        return '<svg class="gauge" viewBox="0 0 112 68" aria-label="Soil moisture ' + value + ' percent"><path d="M14 56 A42 42 0 0 1 98 56" fill="none" stroke="' + C.line + '" stroke-width="10" stroke-linecap="round"/><path d="M14 56 A42 42 0 0 1 98 56" fill="none" stroke="' + (value < 25 ? C.gold : C.sky) + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + dash + ' 999"/><text x="56" y="50" text-anchor="middle" class="mono" font-size="20" font-weight="800" fill="#1c2419">' + value + '%</text></svg>';
      }

      function bestProduce() {
        return state.prices.list.slice().sort(function (a, b) { return b.chg - a.chg; })[0];
      }

      function netMarketRows(item) {
        return seed.markets.map(function (market) {
          const basis = market.id === state.market.id ? 0 : market.transport;
          const estimated = Math.round(item.price * (1 + (market.id === "maua" ? 0.03 : market.id === "mak" ? 0.015 : 0)));
          return Object.assign({}, market, { estimated: estimated, net: estimated - basis, transportCost: basis });
        }).sort(function (a, b) { return b.net - a.net; });
      }

      function renderHome() {
        const top = bestProduce();
        const agro = computeAgronomy(state.weather.days, top.name);
        const alertHtml = agro.highBlight
          ? '<div class="alert warn"><b>!</b><p class="small"><b>Blight watch.</b> Humid, misty conditions favor late blight. Scout tomatoes and potatoes before damp days.</p></div>'
          : "";
        return '<div class="stack">' +
          '<div class="between"><div><p class="small muted">' + escapeHtml(state.market.name) + ' Market</p><h1>' + t("greeting") + ', ' + escapeHtml(state.profile.name) + '</h1></div><div class="avatar" style="width:44px;height:44px;background:var(--up-bg);color:var(--up)">' + escapeHtml(state.profile.name.slice(0, 1).toUpperCase()) + '</div></div>' +
          '<div class="hero"><p class="eyebrow">This week signal</p><h2>Sell ' + escapeHtml(top.name.toLowerCase()) + ' now</h2><p>' + (top.chg >= 0 ? 'Up ' : 'Down ') + Math.abs(top.chg) + '% at ' + escapeHtml(state.market.name) + '. ' + escapeHtml(agro.headline) + '</p><div class="actions"><button class="btn primary" data-go="buyers">Find buyers</button><button class="btn ghost" data-go="field">Field plan</button></div></div>' +
          alertHtml +
          '<div class="source-grid"><div class="source"><div class="between"><b class="tiny">Weather</b>' + sourceStatus(state.weather) + '</div><p class="tiny muted">' + escapeHtml(state.weather.note) + '</p></div><div class="source"><div class="between"><b class="tiny">Prices</b>' + sourceStatus(state.prices) + '</div><p class="tiny muted">' + escapeHtml(state.prices.note) + '</p></div><div class="source"><div class="between"><b class="tiny">FX</b>' + sourceStatus(state.fx) + '</div><p class="tiny muted">' + escapeHtml(state.fx.note) + '</p></div></div>' +
          '<div class="grid2"><button class="card metric" data-go="market"><span class="small muted">Top price</span><strong>KSh ' + top.price + '</strong><span class="small">per ' + escapeHtml(top.unit) + '</span></button><button class="card metric" data-go="field"><span class="small muted">Soil moisture</span><strong>' + agro.series[0].smIndex + '%</strong><span class="small">' + (agro.series[0].smIndex < 30 ? 'Drying. Irrigate' : 'Adequate') + '</span></button></div>' +
          '<div class="card card-pad"><div class="between"><h2>Why this signal?</h2><span class="chip" style="background:' + C.upBg + ';color:' + C.up + '">' + agro.confidence + ' confidence</span></div><ul class="small muted">' + agro.reasons.map(function (reason) { return '<li>' + escapeHtml(reason) + '</li>'; }).join("") + '</ul></div>' +
          '<div class="alert gold"><b>i</b><p class="small">' + t("advisory") + '</p></div>' +
          '</div>';
      }

      function renderMarket() {
        const rows = state.prices.list.map(function (item, index) {
          const up = item.chg >= 0;
          return '<button class="list-item" data-pick="' + index + '"><span class="crop-badge">' + escapeHtml(item.icon) + '</span><div class="grow"><b class="truncate">' + escapeHtml(item.name) + (item.blight ? ' <span style="color:' + C.down + '">risk</span>' : '') + (item.exportCrop ? ' <span style="color:' + C.gold + '">USD</span>' : '') + '</b><p class="tiny muted">per ' + escapeHtml(item.unit) + '</p></div>' + sparkline(item.hist, up) + '<div style="width:86px;text-align:right"><b class="mono">KSh ' + item.price + '</b><p class="tiny mono" style="color:' + (up ? C.up : C.down) + '">' + (up ? '+' : '') + item.chg + '%</p></div></button>';
        }).join("");
        return '<div class="stack"><div class="between"><div><h1>Market prices</h1><p class="small muted">' + escapeHtml(state.market.name) + ', ' + escapeHtml(state.market.town) + '</p></div>' + sourceStatus(state.prices) + '</div>' +
          '<div class="alert gold"><b>FX</b><p class="small"><b>Export rate ' + (state.fx.live ? 'live' : 'sample') + ':</b> ' + (state.fx.kes ? '1 USD = KSh ' + state.fx.kes.toFixed(1) : 'Waiting for FX') + '. Avocado and bean prices often track the dollar.</p></div>' +
          '<div class="card list">' + rows + '</div><p class="small muted" style="text-align:center">' + escapeHtml(state.prices.note) + '. "risk" marks blight-prone crops; "USD" marks export crops.</p></div>';
      }

      function renderProduceDetail() {
        const item = state.picked || bestProduce();
        const rows = netMarketRows(item).map(function (market) {
          return '<div class="between check"><div><b>' + escapeHtml(market.name) + '</b><p class="tiny muted">Price KSh ' + market.estimated + ' - transport KSh ' + market.transportCost + '</p></div><b class="mono">Net ' + market.net + '</b></div>';
        }).join("");
        return '<div class="stack"><button class="pill" data-back="market" style="justify-self:start">Back to market</button><div class="row"><span class="crop-badge">' + escapeHtml(item.icon) + '</span><div><h1>' + escapeHtml(item.name) + '</h1><p class="small muted">per ' + escapeHtml(item.unit) + '</p></div></div><div class="card card-pad"><div class="between"><div><p class="muted small">Today price</p><h1>KSh ' + item.price + '</h1></div>' + sparkline(item.hist, item.chg >= 0) + '</div></div><div class="card card-pad"><h2>Market comparison after transport</h2>' + rows + '</div><div class="alert gold"><b>Tip</b><p class="small">' + (item.chg >= 0 ? 'Demand is climbing. Sort and grade before delivery.' : 'Prices are easing. If storage is clean and dry, holding may help.') + '</p></div></div>';
      }

      function renderField() {
        const crops = Object.keys(seed.cropMeta);
        const agro = computeAgronomy(state.weather.days, state.crop);
        const cropTabs = crops.map(function (crop) {
          return '<button class="pill ' + (crop === state.crop ? 'active' : '') + '" data-crop="' + escapeHtml(crop) + '">' + escapeHtml(crop) + '</button>';
        }).join("");
        const days = agro.series.map(function (day, index) {
          return '<div class="card day"><b class="small">' + escapeHtml(state.weather.labels[index] || '') + '</b><span class="small">' + escapeHtml(day.cond) + '</span><span class="mono tiny">' + day.hi + '/' + day.lo + ' C</span><span class="mono tiny">' + day.smIndex + '%</span><span class="chip action" style="background:' + day.bg + ';color:' + day.color + '">' + day.action + '</span></div>';
        }).join("");
        const blight = agro.highBlight ? '<div class="alert warn"><b>!</b><p class="small"><b>Late-blight risk.</b> Apply protectant only if advised locally; avoid overhead watering at dusk.</p></div>' : "";
        return '<div class="stack"><div class="between"><div><h1>Field plan</h1><p class="small muted">' + escapeHtml(state.market.town) + ' foothills</p></div>' + sourceStatus(state.weather) + '</div><div class="tabs">' + cropTabs + '</div><div class="alert info"><div><p class="eyebrow" style="color:' + C.sky + '">Root-zone moisture</p><p class="small" style="color:#1c2419">' + (agro.series[0].smIndex < 30 ? 'Drying out. Irrigate before transplanting.' : 'Adequate moisture in the root zone.') + '</p><p class="tiny muted">' + escapeHtml(agro.meta.ideal) + '</p></div>' + gauge(agro.series[0].smIndex) + '</div>' + blight + '<div class="stack">' + days + '</div><div class="hero"><p class="eyebrow">For ' + escapeHtml(state.crop.toLowerCase()) + '</p><p>' + escapeHtml(agro.headline) + '</p><div class="actions"><span class="chip" style="background:' + C.upBg + ';color:' + C.up + '">' + agro.confidence + ' confidence</span></div></div><p class="small muted" style="text-align:center">Soil moisture and ET0 use Open-Meteo when available.</p></div>';
      }

      function renderBuyers() {
        const allCrops = ["All"].concat(seed.produce.map(function (item) { return item.name; }));
        const tabs = allCrops.map(function (crop) {
          return '<button class="pill ' + (crop === state.buyerCrop ? 'active' : '') + '" data-buyer-crop="' + escapeHtml(crop) + '">' + escapeHtml(crop) + '</button>';
        }).join("");
        const filtered = seed.buyers.filter(function (buyer) {
          return state.buyerCrop === "All" || buyer.crops.includes(state.buyerCrop);
        });
        const cards = filtered.map(function (buyer) {
          const crop = state.buyerCrop === "All" ? buyer.crops[0] : state.buyerCrop;
          const msg = "Habari " + buyer.name + ", I am a farmer near " + state.market.town + ". I have fresh " + crop.toLowerCase() + " ready this week. Are you buying?";
          const link = "https://wa.me/" + buyer.phone + "?text=" + encodeURIComponent(msg);
          return '<div class="card card-pad"><div class="between"><div><h3>' + escapeHtml(buyer.name) + '</h3><p class="small muted">' + escapeHtml(buyer.type) + ' - ' + escapeHtml(buyer.volume) + '</p><p class="small muted">Buys: ' + escapeHtml(buyer.crops.join(", ")) + '</p></div><span class="crop-badge">BY</span></div><a class="btn primary" style="margin-top:12px;width:100%" target="_blank" rel="noopener noreferrer" href="' + link + '">Message on WhatsApp</a></div>';
        }).join("");
        return '<div class="stack"><div><h1>Buyers</h1><p class="small muted">Filter by crop and message matched buyers.</p></div><div class="tabs">' + tabs + '</div>' + (cards || '<div class="alert gold"><p class="small">No buyer match yet. Try another crop.</p></div>') + '</div>';
      }

      function renderTools() {
        const cropOptions = seed.produce.map(function (item) {
          return '<option ' + (item.name === state.alertCrop ? 'selected' : '') + '>' + escapeHtml(item.name) + '</option>';
        }).join("");
        const checks = ["Grade and sort produce", "Remove damaged items", "Pack clean crates", "Confirm buyer price", "Calculate transport", "Send WhatsApp message"].map(function (label) {
          const checked = state.checklist[label] ? "checked" : "";
          return '<label class="check"><input type="checkbox" data-check="' + escapeHtml(label) + '" ' + checked + ' /><span>' + escapeHtml(label) + '</span></label>';
        }).join("");
        return '<div class="stack"><div><h1>Tools</h1><p class="small muted">Profile, alerts, checklist, and language.</p></div><div class="card card-pad"><h2>Farmer profile</h2><form class="profile-form" id="profileForm"><div class="field"><label>Name</label><input name="name" value="' + escapeHtml(state.profile.name) + '" /></div><div class="grid2"><div class="field"><label>Farm size acres</label><input name="farmSize" type="number" min="0" step="0.5" value="' + escapeHtml(state.profile.farmSize) + '" /></div><div class="field"><label>Irrigation</label><select name="irrigation"><option value="yes" ' + (state.profile.irrigation === "yes" ? "selected" : "") + '>Yes</option><option value="no" ' + (state.profile.irrigation === "no" ? "selected" : "") + '>No</option></select></div></div><div class="field"><label>Language</label><select name="language"><option value="en" ' + (state.profile.language === "en" ? "selected" : "") + '>English</option><option value="sw" ' + (state.profile.language === "sw" ? "selected" : "") + '>Kiswahili</option></select></div><button class="btn primary" type="submit">Save profile</button></form></div><div class="card card-pad"><h2>Price alert</h2><div class="grid2"><div class="field"><label>Crop</label><select id="alertCrop">' + cropOptions + '</select></div><div class="field"><label>Target KSh</label><input id="alertPrice" type="number" value="' + state.alertPrice + '" /></div></div><p class="small muted" style="margin-top:8px">' + renderAlertStatus() + '</p></div><div class="card card-pad"><h2>Harvest checklist</h2>' + checks + '</div></div>';
      }

      function renderAlertStatus() {
        const item = state.prices.list.find(function (entry) { return entry.name === state.alertCrop; });
        if (!item) return "Choose a crop to monitor.";
        return item.price >= state.alertPrice
          ? "Alert ready: " + item.name + " is KSh " + item.price + ", above your target."
          : "Watching " + item.name + ". Current KSh " + item.price + ", target KSh " + state.alertPrice + ".";
      }

      function render() {
        document.getElementById("marketSelect").innerHTML = seed.markets.map(function (market) {
          return '<option value="' + market.id + '" ' + (market.id === state.market.id ? "selected" : "") + '>' + escapeHtml(market.name) + '</option>';
        }).join("");
        document.getElementById("appNav").innerHTML = navItems.map(function (item) {
          const id = item[0];
          const key = id === "field" ? "field" : id;
          return '<button class="' + (state.tab === id ? "active" : "") + '" data-go="' + id + '"><b>' + item[2] + '</b><span>' + t(key) + '</span></button>';
        }).join("");
        const views = {
          home: renderHome,
          market: function () { return state.picked ? renderProduceDetail() : renderMarket(); },
          field: renderField,
          buyers: renderBuyers,
          tools: renderTools
        };
        document.getElementById("appMain").innerHTML = views[state.tab]();
      }

      function setTab(tab) {
        state.tab = tab;
        if (tab !== "market") state.picked = null;
        render();
      }

      document.addEventListener("click", function (event) {
        const go = event.target.closest("[data-go]");
        const pick = event.target.closest("[data-pick]");
        const back = event.target.closest("[data-back]");
        const crop = event.target.closest("[data-crop]");
        const buyerCrop = event.target.closest("[data-buyer-crop]");
        if (go) setTab(go.dataset.go);
        if (pick) {
          state.picked = state.prices.list[Number(pick.dataset.pick)];
          render();
        }
        if (back) {
          state.picked = null;
          render();
        }
        if (crop) {
          state.crop = crop.dataset.crop;
          render();
        }
        if (buyerCrop) {
          state.buyerCrop = buyerCrop.dataset.buyerCrop;
          render();
        }
      });

      document.addEventListener("change", function (event) {
        if (event.target.id === "marketSelect") {
          const next = seed.markets.find(function (market) { return market.id === event.target.value; });
          if (next) {
            state.market = next;
            state.weather.loading = true;
            state.weather.note = "Updating weather";
            render();
            loadWeather();
          }
        }
        if (event.target.id === "alertCrop") {
          state.alertCrop = event.target.value;
          render();
        }
        if (event.target.id === "alertPrice") {
          state.alertPrice = Number(event.target.value) || 0;
          render();
        }
        if (event.target.dataset.check) {
          state.checklist[event.target.dataset.check] = event.target.checked;
          localStorage.setItem("farmgate-checklist", JSON.stringify(state.checklist));
        }
      });

      document.addEventListener("submit", function (event) {
        if (event.target.id === "profileForm") {
          event.preventDefault();
          const data = new FormData(event.target);
          state.profile.name = data.get("name") || state.profile.name;
          state.profile.farmSize = Number(data.get("farmSize")) || state.profile.farmSize;
          state.profile.irrigation = data.get("irrigation") || state.profile.irrigation;
          state.profile.language = data.get("language") || state.profile.language;
          saveProfile();
          render();
        }
      });

      async function loadWeather() {
        const controller = new AbortController();
        const market = state.market;
        const url = "https://api.open-meteo.com/v1/forecast?latitude=" + market.lat + "&longitude=" + market.lon + "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration&hourly=relative_humidity_2m,soil_moisture_3_to_9cm&timezone=auto&forecast_days=7";
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error("weather");
          const json = await res.json();
          const days = json.daily.time.map(function (time, index) {
            const indexes = json.hourly.time.map(function (hour, hourIndex) { return hour.slice(0, 10) === time ? hourIndex : -1; }).filter(function (hourIndex) { return hourIndex >= 0; });
            const hums = indexes.map(function (hourIndex) { return json.hourly.relative_humidity_2m[hourIndex]; }).filter(function (value) { return value != null; });
            const sms = indexes.map(function (hourIndex) { return json.hourly.soil_moisture_3_to_9cm[hourIndex]; }).filter(function (value) { return value != null; });
            const vwc = mean(sms);
            return {
              cond: wmo(json.daily.weather_code[index]),
              hi: Math.round(json.daily.temperature_2m_max[index]),
              lo: Math.round(json.daily.temperature_2m_min[index]),
              rain: r1(json.daily.precipitation_sum[index]),
              pop: json.daily.precipitation_probability_max[index] || 0,
              wind: Math.round(json.daily.wind_speed_10m_max[index]),
              et0: r1(json.daily.et0_fao_evapotranspiration[index]),
              hum: hums.length ? Math.round(mean(hums)) : 60,
              humMax: hums.length ? Math.round(Math.max.apply(null, hums)) : 70,
              smIndex: vwc == null ? 45 : clamp(Math.round(((vwc - 0.05) / 0.35) * 100), 0, 100)
            };
          });
          state.weather = {
            days: days,
            labels: json.daily.time.map(function (time, index) { return index === 0 ? "Today" : new Date(time + "T00:00").toLocaleDateString("en", { weekday: "short" }); }),
            live: true,
            loading: false,
            note: "Open-Meteo forecast"
          };
        } catch (_error) {
          state.weather = { days: seed.fallbackWeather, labels: seed.fallbackLabels, live: false, loading: false, note: "Using saved sample forecast. Check connection for live weather." };
        }
        render();
        return function abortWeather() { controller.abort(); };
      }

      async function loadFx() {
        try {
          const res = await fetch("https://open.er-api.com/v6/latest/USD");
          const json = await res.json();
          if (!json || !json.rates || !json.rates.KES) throw new Error("fx");
          state.fx = { kes: json.rates.KES, live: true, loading: false, note: "open.er-api.com" };
        } catch (_error) {
          state.fx = { kes: 129, live: false, loading: false, note: "Using sample FX rate" };
        }
        render();
      }

      async function loadPrices() {
        if (!SHEET_CSV_URL) {
          state.prices = { list: seed.produce, live: false, loading: false, note: "Sample prices. Publish a Google Sheet CSV to go live." };
          render();
          return;
        }
        try {
          const res = await fetch(SHEET_CSV_URL);
          if (!res.ok) throw new Error("prices");
          const rows = parseCSV(await res.text()).filter(function (row) { return row.name && row.price; });
          const known = seed.produce.reduce(function (acc, item) {
            acc[item.name.toLowerCase()] = item;
            return acc;
          }, {});
          const list = rows.map(function (row) {
            const base = known[row.name.toLowerCase()] || { icon: "PR", unit: "kg", hist: [], crop: "annual", blight: false };
            const price = Number(row.price) || base.price || 0;
            return Object.assign({}, base, {
              name: row.name,
              price: price,
              chg: row.change === "" || row.change == null ? base.chg || 0 : Number(row.change),
              unit: row.unit || base.unit || "kg",
              hist: base.hist && base.hist.length ? base.hist : [price, price, price, price, price, price, price]
            });
          });
          state.prices = { list: list.length ? list : seed.produce, live: list.length > 0, loading: false, note: "Prices live from market sheet" };
        } catch (_error) {
          state.prices = { list: seed.produce, live: false, loading: false, note: "Price sheet unavailable. Showing sample prices." };
        }
        render();
      }

      try {
        state.checklist = JSON.parse(localStorage.getItem("farmgate-checklist") || "{}");
      } catch (_error) {
        state.checklist = {};
      }

      render();
      loadWeather();
      loadFx();
      loadPrices();
    </script>
  </body>
</html>`;

  setHeader(event, 'content-type', 'text/html; charset=utf-8');
  return send(event, html);
});
