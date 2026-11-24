/* =========================================================
   Juz Amma Journal — App logic (Vanilla JS)
   Depends on: QURAN_AR, QURAN_SAJDA (quran-arabic.js)
               SURAH_LIST, SURAH_STATUS, SURAH_CONTENT, registerSurah (surahs-data.js)
   Surah notes are lazy-loaded from surahs/NNN.js.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Storage (safe wrappers) ---------- */
  const PREFIX = "qj:";
  const KEY = {
    done: "qj:completed",
    last: "qj:lastSurah",
    bookmarks: "qj:bookmarks",
    filter: "qj:filter",
    note: (surah, i) => `qj:note:${surah}:${i}`
  };
  const NOTE_KEY_RE = /^qj:note:(\d{2,3}):\d{1,3}$/;
  const BOOKMARK_RE = /^\d{2,3}:\d{1,3}$/; // ayah numbers go up to 227 (Surah 26)

  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); return true; }
      catch (e) { return false; }
    },
    keys() {
      const out = [];
      try {
        for (let i = 0; i < localStorage.length; i++) out.push(localStorage.key(i));
      } catch (e) { /* storage unavailable */ }
      return out;
    }
  };

  function readJSONSet(key, filter) {
    try {
      const arr = JSON.parse(store.get(key, "[]"));
      return new Set(Array.isArray(arr) ? arr.filter(filter) : []);
    } catch (e) { return new Set(); }
  }

  const getCompleted = () => readJSONSet(KEY.done, Number.isInteger);
  const setCompleted = (set) => store.set(KEY.done, JSON.stringify([...set].sort((a, b) => a - b)));
  const getBookmarks = () => readJSONSet(KEY.bookmarks, (x) => typeof x === "string" && BOOKMARK_RE.test(x));
  const setBookmarks = (set) => store.set(KEY.bookmarks, JSON.stringify([...set].sort(byRef)));

  function byRef(a, b) {
    const [s1, a1] = a.split(":").map(Number);
    const [s2, a2] = b.split(":").map(Number);
    return s1 - s2 || a1 - a2;
  }

  /* Which surahs have at least one non-empty saved note */
  function surahsWithNotes() {
    const out = new Set();
    store.keys().forEach((k) => {
      const m = k && k.match(NOTE_KEY_RE);
      if (m && store.get(k, "").trim()) out.add(Number(m[1]));
    });
    return out;
  }

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  const toArabicNum = (n) => String(n).replace(/\d/g, (d) => AR_DIGITS[d]);
  const pad3 = (n) => String(n).padStart(3, "0");
  const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const statusOf = (n) => (typeof SURAH_STATUS === "object" && SURAH_STATUS[n]) || null;

  /* ---------- Para (Juz) helpers — PARA_LIST lives in surahs-data.js ---------- */
  const PARAS = typeof PARA_LIST !== "undefined" ? PARA_LIST : [];
  const paraStartAt = (num, n) => PARAS.find((p) => p.start === `${num}:${n}`);
  const parasStartingIn = (num) => PARAS.filter((p) => Number(p.start.split(":")[0]) === num);
  const paraLabel = (meta) => {
    const j = meta.juz || [30, 30];
    return j[0] === j[1] ? `Para ${j[0]}` : `Para ${j[0]}–${j[1]}`;
  };
  const paraLink = (p) => {
    const [s, a] = p.start.split(":");
    return a === "1" ? `#/surah/${s}` : `#/surah/${s}/${a}`;
  };

  const ICON = {
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    print: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="7" rx="1"/><path d="M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/></svg>',
    bulb: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>',
    pen: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    penSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    clock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    bookmark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    bookmarkSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    book: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>',
    warn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
  };

  /* ---------- State ---------- */
  const TOTAL = SURAH_LIST.length;
  let completed = getCompleted();
  let bookmarks = getBookmarks();
  let current = null;
  let renderToken = 0;
  let filter = store.get(KEY.filter, "all");
  if (!["all", "ready", "done", "bookmarks"].includes(filter)) filter = "all";

  const el = {
    list: $("#surahList"),
    search: $("#searchInput"),
    emptySearch: $("#emptySearch"),
    filters: $("#filters"),
    page: $("#page"),
    main: $("#main"),
    progressText: $("#progressText"),
    progressFill: $("#progressFill"),
    topbarTitle: $("#topbarTitle"),
    menuBtn: $("#menuBtn"),
    scrim: $("#scrim"),
    printTop: $("#printBtnTop"),
    exportBtn: $("#exportBtn"),
    importBtn: $("#importBtn"),
    importFile: $("#importFile"),
    toast: $("#toast")
  };

  /* ---------- Lazy loading of surah files ---------- */
  const loading = {};
  function loadSurah(num) {
    if (SURAH_CONTENT[num]) return Promise.resolve(SURAH_CONTENT[num]);
    if (!statusOf(num)) return Promise.reject(new Error("no content"));
    if (loading[num]) return loading[num];
    loading[num] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `surahs/${pad3(num)}.js`;
      s.async = true;
      s.onload = () => (SURAH_CONTENT[num] ? resolve(SURAH_CONTENT[num]) : reject(new Error("not registered")));
      s.onerror = () => { delete loading[num]; s.remove(); reject(new Error("load failed")); };
      document.head.appendChild(s);
    });
    return loading[num];
  }

  /* ---------- Sidebar ---------- */
  function renderFilters() {
    el.filters.querySelectorAll("[data-filter]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
    });
  }

  function renderSidebar() {
    const q = el.search.value.trim().toLowerCase();
    const normalize = (s) => s.toLowerCase().replace(/['\-\s]/g, "");
    const nq = normalize(q);
    const withNotes = surahsWithNotes();
    const bmCount = {};
    bookmarks.forEach((ref) => { const s = Number(ref.split(":")[0]); bmCount[s] = (bmCount[s] || 0) + 1; });

    const items = SURAH_LIST.filter((s) => {
      if (filter === "ready" && !statusOf(s.number)) return false;
      if (filter === "done" && !completed.has(s.number)) return false;
      if (filter === "bookmarks" && !bmCount[s.number]) return false;
      if (!q) return true;
      return (
        normalize(s.name).includes(nq) ||
        s.arabic.includes(q) ||
        String(s.number).startsWith(q) ||
        s.meaning.toLowerCase().includes(q)
      );
    });

    const showParaHeads = !q && filter === "all";
    el.list.innerHTML = items.map((s) => {
      const heads = showParaHeads ? parasStartingIn(s.number).map((p) => {
        const mid = !p.start.endsWith(":1");
        return `<li class="para-head"><a href="${paraLink(p)}" class="para-head-link">Para ${p.number} · ${esc(p.name)}${mid ? ` <span class="para-head-at">(${p.start} se)</span>` : ""}</a></li>`;
      }).join("") : "";
      const isDone = completed.has(s.number);
      const isActive = current === s.number;
      const st = statusOf(s.number);
      const tags = [
        st === "draft" ? '<span class="dot-draft" title="Draft — hawale verify nahi hue" aria-label="Draft"></span>' : "",
        st === "partial" ? '<span class="dot-partial" title="Partially verified — kuch wazahati nukte alag se check nahi hue" aria-label="Partially verified"></span>' : "",
        withNotes.has(s.number) ? `<span class="mini" title="Aap ki notes maujood hain">${ICON.penSm}</span>` : "",
        bmCount[s.number] ? `<span class="mini mini-bm" title="${bmCount[s.number]} bookmark">${ICON.bookmarkSm}${bmCount[s.number]}</span>` : ""
      ].join("");
      return `${heads}
        <li class="surah-item${isActive ? " active" : ""}${st ? "" : " is-soon"}${isDone ? " is-done" : ""}">
          <button class="surah-link" data-go="${s.number}" title="${s.number}. ${esc(s.name)} — ${esc(s.meaning)}" ${isActive ? 'aria-current="page"' : ""}>
            <span class="surah-num">${s.number}</span>
            <span class="surah-names">
              <span class="surah-en"><span class="surah-en-text">${esc(s.name)}</span>${st === "ready" ? '<span class="dot-ready" title="Verified — har tafseeri nukte ka hawala ya label check kiya gaya" aria-label="Verified"></span>' : ""}${tags}</span>
              <span class="surah-meta"><span class="surah-meta-text">${st ? "" : "Soon · "}${s.verses} ayaat · ${paraLabel(s)} · ${esc(s.meaning)}</span></span>
            </span>
            <span class="surah-ar" lang="ar">${s.arabic}</span>
          </button>
          <button class="check" data-toggle="${s.number}" aria-pressed="${isDone}" aria-label="${esc(s.name)} complete mark karein" title="${isDone ? "Completed" : "Complete mark karein"}">
            <span class="check-box">${ICON.check}</span>
          </button>
        </li>`;
    }).join("");

    el.emptySearch.hidden = items.length > 0;
    el.emptySearch.textContent = filter === "bookmarks" && !q
      ? "Abhi koi bookmark nahi. Kisi ayat par bookmark icon dabayein."
      : filter === "done" && !q ? "Abhi koi surah complete mark nahi ki gayi." : "Koi surah nahi mili.";
  }

  function renderProgress() {
    const n = completed.size;
    el.progressText.textContent = `${n} / ${TOTAL}`;
    el.progressFill.style.width = `${(n / TOTAL) * 100}%`;
  }

  function toggleComplete(num) {
    if (completed.has(num)) completed.delete(num);
    else completed.add(num);
    setCompleted(completed);
    renderSidebar();
    renderProgress();
    syncDoneButton();
  }

  /* ---------- Main page ---------- */
  function renderSurah(num, focusAyah) {
    const meta = SURAH_LIST.find((s) => s.number === num);
    if (!meta) return;
    flushNotes();
    current = num;
    store.set(KEY.last, String(num));
    document.title = `${meta.name} · Quran Study Journal`;
    el.topbarTitle.textContent = `${meta.number}. ${meta.name}`;
    renderSidebar();

    const token = ++renderToken;
    const cached = SURAH_CONTENT[num];
    if (cached) { paint(meta, cached, false, focusAyah); return; }

    paint(meta, null, statusOf(num) !== null);
    loadSurah(num)
      .then((data) => { if (token === renderToken) paint(meta, data, false, focusAyah); })
      .catch(() => { if (token === renderToken) paint(meta, null); });
  }

  function paint(meta, data, isLoading, focusAyah) {
    el.page.innerHTML = `
      ${toolbar(meta)}
      ${heroCard(meta, data)}
      ${data ? fullContent(meta, data) : isLoading ? loadingCard() : statusOf(meta.number) ? loadErrorCard(meta) : comingSoon(meta)}
      <p class="footer-note">Notes aap ke isi browser mein mehfooz hain. Doosre device par le jaane ya backup ke liye sidebar mein "Export" istemal karein.</p>
      <p class="print-only print-footer">Quran Study Journal (Para 17–30) · Surah ${esc(meta.name)} (${meta.number}) · ${new Date().toLocaleDateString()}</p>
    `;
    if (data) wireNotes(meta.number);
    syncDoneButton();
    if (isLoading) return;
    const target = focusAyah && document.getElementById(`ayah-${focusAyah}`);
    if (target) {
      target.scrollIntoView({ block: "start" });
      target.classList.add("flash");
      setTimeout(() => target.classList.remove("flash"), 1600);
    } else {
      window.scrollTo(0, 0);
    }
  }

  function toolbar(meta) {
    return `
      <div class="toolbar no-print">
        <div class="crumbs">${paraLabel(meta)} <span aria-hidden="true">/</span> <span>${esc(meta.name)}</span></div>
        <div class="toolbar-actions">
          <button class="btn" data-done-btn>Mark complete</button>
          <button class="btn btn-accent" data-print>${ICON.print} Print / Save as PDF</button>
        </div>
      </div>`;
  }

  function heroCard(meta, data) {
    const revelation = data && data.revelationNote ? data.revelationNote : meta.revelation;
    const st = statusOf(meta.number);
    const bms = [...bookmarks].filter((r) => r.startsWith(meta.number + ":")).map((r) => Number(r.split(":")[1]));

    const refs = data && data.references && data.references.length ? `
      <details class="refs" open>
        <summary>${ICON.book} Hawale (References)</summary>
        <ul class="refs-list">${data.references.map((r) => `
          <li>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)}</a>` : esc(r.label)}${r.note ? ` <span class="ref-note">— ${esc(r.note)}</span>` : ""}</li>`).join("")}
        </ul>
      </details>` : "";

    return `
      <section class="card hero" aria-labelledby="surahTitle">
        <div class="hero-top">
          <div class="hero-titles">
            <div class="hero-num">Surah ${meta.number} · ${paraLabel(meta)}</div>
            <h1 id="surahTitle">${esc(meta.name)}</h1>
            <p class="hero-meaning">${esc(meta.meaning)}</p>
          </div>
          <div class="hero-ar" lang="ar" dir="rtl">${meta.arabic}</div>
        </div>

        <ul class="pills">
          <li class="pill pill-accent">${esc(meta.revelation)}</li>
          <li class="pill"><b>${meta.verses}</b> Ayaat</li>
          ${st === "ready" ? '<li class="pill pill-status pill-verified">Verified</li>' : st === "partial" ? '<li class="pill pill-status">Partially Verified</li>' : st === "draft" ? '<li class="pill pill-status">Draft</li>' : ""}
          ${completed.has(meta.number) ? '<li class="pill pill-done">✓ Completed</li>' : ""}
          ${bms.length ? `<li class="pill pill-bm no-print">${ICON.bookmarkSm} ${bms.map((n) => `<a href="#/surah/${meta.number}/${n}" class="bm-link">${n}</a>`).join(" · ")}</li>` : ""}
        </ul>

        ${st === "draft" ? `
          <div class="draft-note" role="note">
            ${ICON.warn}
            <p><b>Draft notes.</b> Is surah ki tafsir aur hawale abhi verify nahi hue. Hadees ke hawale aur tareekhi baatein mustanad kitabon se check kiye baghair yaqeeni na samjhein.</p>
          </div>` : ""}
        ${st === "ready" ? `
          <div class="draft-note verified-note" role="note">
            ${ICON.book}
            ${data && data.verificationNote ? `<p><b>Verified.</b> ${esc(data.verificationNote)}</p>` : `<p><b>Verified (final audit, 24 Nov 2026).</b> Is surah ke har tafseeri nukte ko Tafsir Ibn Kathir aur Ma'arif al-Qur'an (quran.com par English tarjuma) se mila kar us ke saath hawala ya label likha gaya hai, aur hadees ke hawale sunnah.com par check kiye gaye. <b>Labels:</b> \"Ghaur (reflection)\" aur \"Amali sabaq (istinbaat)\" tafsir nahi balki naseehat hain; \"hamari wazahat\" / \"ayat ke alfaaz se\" is project ki apni tashreeh hai; tarjume mein qausain (brackets) ke alfaaz wazahati izafa hain. <b>Had-bandiyan:</b> tafseerein English tarjume se padhi gayin; pehle mufassireen ke aqwaal Ibn Kathir ke zariye hain; jin riwayaat ka darja bayan nahi wo wahin likha hai; Roman Urdu par kisi aalim ki nazar-e-saani abhi baqi hai.</p>`}
          </div>` : ""}
        ${st === "partial" ? `
          <div class="draft-note partial-note" role="note">
            ${ICON.warn}
            ${data && data.verificationNote ? `<p><b>Partially verified.</b> ${esc(data.verificationNote)}</p>` : `<p><b>Partially verified.</b> Is surah ke tamaam hadees aur jin baaton ke saath tafsir ka hawala diya gaya hai, wo sources se check kiye gaye hain. Lekin \"Tafsir · Wazahat\" ke jin nukton ke saath koi hawala ya label nahi, wo is project ki apni aasaan wazahat hain jinhein kisi tafsir se alag alag nahi milaya gaya. Roman Urdu par kisi aalim ki nazar-e-saani abhi baqi hai.</p>`}
          </div>` : ""}

        ${data ? `
          <div class="hero-divider"></div>
          <h2>Surah Overview</h2>
          <p class="overview-text">${esc(data.overview)}</p>

          <div class="context">
            <h2>Kyun aur kahan nazil hui?</h2>
            <p class="context-note">${esc(revelation)}</p>
            <ul class="bullets">${data.context.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          </div>
          ${refs}
        ` : ""}
      </section>`;
  }

  function arabicLine(num, n) {
    const text = (QURAN_AR[num] && QURAN_AR[num][n - 1]) || "";
    return `<p class="ayah-ar" lang="ar" dir="rtl">${text} <span class="ayah-end">﴿${toArabicNum(n)}﴾</span></p>`;
  }

  const isSajda = (num, n) => QURAN_SAJDA.includes(`${num}:${n}`);
  const sajdaPill = '<span class="sajda-pill" title="Is ayat par sajda-e-tilawat hai">۩ Sajdah</span>';
  const bullets = (arr) => `<ul class="bullets">${arr.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  function ayahActions(num, n) {
    const ref = `${num}:${n}`;
    const on = bookmarks.has(ref);
    return `
      <div class="ayah-actions no-print">
        <button class="act" data-copy="${ref}" type="button" aria-label="Ayat ${n} copy karein" title="Copy">${ICON.copy}</button>
        <button class="act act-bm" data-bookmark="${ref}" type="button" aria-pressed="${on}" aria-label="Ayat ${n} bookmark ${on ? "hatayein" : "karein"}" title="${on ? "Bookmark hatayein" : "Bookmark"}">${ICON.bookmark}</button>
      </div>`;
  }

  function ayahCards(num, ayahs) {
    return ayahs.map((a, i) => {
      const n = i + 1;
      return `
      <article class="card ayah${bookmarks.has(`${num}:${n}`) ? " is-bookmarked" : ""}" id="ayah-${n}" aria-label="Ayat ${n}">
        <div class="ayah-head">
          <div class="ayah-badge"><span>${n}</span> Ayat ${isSajda(num, n) ? sajdaPill : ""}</div>
          ${ayahActions(num, n)}
        </div>
        ${arabicLine(num, n)}
        <p class="mini-label">Tarjuma</p>
        <p class="translation">${esc(a.translation)}</p>
        <p class="tafsir-label">Tafsir · Wazahat</p>
        ${bullets(a.tafsir)}
      </article>`;
    }).join("");
  }

  function sectionCards(num, sections) {
    return sections.map((sec) => {
      const verses = [];
      for (let n = sec.from; n <= sec.to; n++) {
        const tr = sec.translations[n - sec.from] || "";
        const pm = n > 1 && paraStartAt(num, n);
        if (pm) verses.push(`<div class="para-mark" role="note">Para ${pm.number} (${esc(pm.name)}) yahan se shuru — ayat ${num}:${n}</div>`);
        verses.push(`
          <div class="verse${bookmarks.has(`${num}:${n}`) ? " is-bookmarked" : ""}" id="ayah-${n}">
            <div class="verse-top">
              <span class="vnum-badge">${n}</span>
              ${isSajda(num, n) ? sajdaPill : ""}
              ${ayahActions(num, n)}
            </div>
            ${arabicLine(num, n)}
            <p class="translation">${esc(tr)}</p>
          </div>`);
      }
      const range = sec.from === sec.to ? `${sec.from}` : `${sec.from}–${sec.to}`;
      return `
      <article class="card ayah section-card" aria-label="Ayaat ${range}">
        <div class="section-head">
          <div class="ayah-badge"><span>${range}</span> Ayaat</div>
          <h3 class="section-title">${esc(sec.title)}</h3>
        </div>
        <p class="mini-label">Arabic aur Tarjuma</p>
        <div class="verses">${verses.join("")}</div>
        <div class="section-tafsir">
          <p class="tafsir-label">Tafsir · Wazahat (Ayat ${range})</p>
          ${bullets(sec.tafsir)}
        </div>
      </article>`;
    }).join("");
  }

  function fullContent(meta, data) {
    const num = meta.number;
    const body = data.sections ? sectionCards(num, data.sections) : ayahCards(num, data.ayahs || []);

    const vocab = (data.vocabulary || []).map((v) => `
      <div class="vocab-row">
        <span class="vocab-ar" lang="ar" dir="rtl">${esc(v.word)}</span>
        <dl class="vocab-fields">
          <div><dt>Lafz</dt><dd>${esc(v.transliteration)}</dd></div>
          <div><dt>Root</dt><dd><bdi class="vocab-root" lang="ar" dir="rtl">${esc(v.root)}</bdi></dd></div>
          <div><dt>Maani</dt><dd>${esc(v.meaning)}</dd></div>
        </dl>
      </div>`).join("");

    // lessons: plain array (older surahs) or { themes, applications }
    const L = data.lessons || [];
    const lessonsHtml = Array.isArray(L) ? bullets(L) : `
      <p class="lesson-sub">Quran ka seedha paighaam</p>
      ${bullets(L.themes || [])}
      <p class="lesson-sub">Amali sabaq aur istinbaat</p>
      <p class="lesson-hint">Ye ayaat, hadees aur tafsir se nikale gaye amali nukte hain — Quran ke alfaaz ka seedha tarjuma nahi.</p>
      ${bullets(L.applications || [])}`;

    const prompts = [...(data.reflectionPrompts || []), "Meri apni notes / dua"];
    const reflect = prompts.map((p, i) => `
      <div class="reflect-item">
        <label for="note-${i}">${esc(p)}</label>
        <textarea class="note" id="note-${i}" data-note="${i}" rows="3" placeholder="Yahan likhein…"></textarea>
        <div class="note-print" data-note-print="${i}"></div>
      </div>`).join("");

    return `
      <div class="section-label">${data.sections ? "Tafsir · Hisson Mein" : "Ayat ba Ayat Tafsir"}</div>
      <p class="bismillah" lang="ar" dir="rtl">${BISMILLAH}</p>
      <div class="ayahs">${body}</div>

      <div class="wide">
      <div class="section-label">Sabaq &amp; Reflection</div>
      <div class="grid-2">
        <section class="card box">
          <div class="box-icon">${ICON.bulb}</div>
          <h2>Lessons / Main Themes</h2>
          ${lessonsHtml}
          <p class="box-sub">Ahem Alfaaz &amp; Roots</p>
          <div class="vocab">${vocab}</div>
        </section>

        <section class="card box">
          <div class="box-icon">${ICON.pen}</div>
          <h2>Personal Reflection</h2>
          <p class="box-hint no-print">Har surah ki notes alag save hoti hain.</p>
          <div class="reflect">${reflect}</div>
          <div class="save-status" id="saveStatus" aria-live="polite">Auto-save on</div>
        </section>
      </div>
      </div>`;
  }

  function loadingCard() {
    return `<section class="card soon"><p>Load ho raha hai…</p></section>`;
  }

  function loadErrorCard(meta) {
    return `
      <section class="card soon" role="alert">
        <div class="soon-icon">${ICON.warn}</div>
        <h2>Notes load nahi ho sakin</h2>
        <p>Surah ${esc(meta.name)} ki file (surahs/${pad3(meta.number)}.js) load nahi hui. Internet / server check kar ke dobara koshish karein.</p>
        <p style="margin-top:14px"><button class="btn" type="button" data-retry="${meta.number}">Dobara koshish karein</button></p>
      </section>`;
  }

  function comingSoon(meta) {
    return `
      <section class="card soon">
        <div class="soon-icon">${ICON.clock}</div>
        <h2>Coming Soon</h2>
        <p>Surah ${esc(meta.name)} ki tafsir aur study notes abhi shamil nahi kiye gaye. Tab tak aap ise sidebar se complete mark kar sakte hain.</p>
      </section>`;
  }

  /* ---------- Notes (auto-save, flushed on navigation / app hide) ---------- */
  const pending = new Map(); // storage key -> value not yet written

  function flushNotes() {
    pending.forEach((value, key) => store.set(key, value));
    const had = pending.size > 0;
    pending.clear();
    return had;
  }

  function autoSize(t) {
    t.style.height = "auto";
    t.style.height = t.scrollHeight + 2 + "px";
  }

  function wireNotes(num) {
    const status = $("#saveStatus");
    let timer = null;

    el.page.querySelectorAll("textarea[data-note]").forEach((t) => {
      const i = t.dataset.note;
      const key = KEY.note(num, i);
      const printEl = el.page.querySelector(`[data-note-print="${i}"]`);
      const saved = store.get(key, "");
      t.value = saved;
      printEl.textContent = saved;
      requestAnimationFrame(() => autoSize(t));

      t.addEventListener("input", () => {
        autoSize(t);
        printEl.textContent = t.value;
        pending.set(key, t.value);
        status.classList.remove("saved");
        status.textContent = "Saving…";
        clearTimeout(timer);
        timer = setTimeout(() => {
          const ok = store.set(key, t.value);
          if (ok) pending.delete(key);
          status.classList.toggle("saved", ok);
          status.textContent = ok
            ? `Saved · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Save nahi ho saka (storage band hai)";
          renderSidebar();
        }, 400);
      });
    });
  }

  function syncDoneButton() {
    const btn = el.page.querySelector("[data-done-btn]");
    if (!btn || current === null) return;
    const done = completed.has(current);
    btn.classList.toggle("is-done", done);
    btn.textContent = done ? "✓ Completed" : "Mark complete";
    btn.setAttribute("aria-pressed", String(done));
  }

  /* ---------- Copy & Bookmark ---------- */
  function ayahText(ref) {
    const [num, n] = ref.split(":").map(Number);
    const meta = SURAH_LIST.find((s) => s.number === num);
    const data = SURAH_CONTENT[num];
    let tr = "";
    if (data && data.ayahs) tr = (data.ayahs[n - 1] || {}).translation || "";
    if (data && data.sections) {
      const sec = data.sections.find((s) => n >= s.from && n <= s.to);
      if (sec) tr = sec.translations[n - sec.from] || "";
    }
    const ar = (QURAN_AR[num] || [])[n - 1] || "";
    return `${ar} ﴿${toArabicNum(n)}﴾\n\nTarjuma: ${tr}\n\n— Surah ${meta.name} (${num}:${n})`;
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* fall through to legacy copy */ }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  function toggleBookmark(ref, btn) {
    const on = !bookmarks.has(ref);
    if (on) bookmarks.add(ref); else bookmarks.delete(ref);
    setBookmarks(bookmarks);
    const n = ref.split(":")[1];
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", `Ayat ${n} bookmark ${on ? "hatayein" : "karein"}`);
    btn.title = on ? "Bookmark hatayein" : "Bookmark";
    const holder = btn.closest(".verse, .ayah");
    if (holder) holder.classList.toggle("is-bookmarked", on);
    renderSidebar();
    toast(on ? `Ayat ${n} bookmark ho gayi` : `Ayat ${n} ka bookmark hata diya`);
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    requestAnimationFrame(() => el.toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.classList.remove("show");
      setTimeout(() => { el.toast.hidden = true; }, 250);
    }, 2800);
  }

  /* ---------- Export / Import (JSON backup) ---------- */
  function collectBackup() {
    flushNotes();
    const notes = {};
    store.keys().forEach((k) => {
      if (k && NOTE_KEY_RE.test(k)) {
        const v = store.get(k, "");
        if (v.trim()) notes[k.slice(PREFIX.length)] = v;
      }
    });
    return {
      app: "juz-amma-journal",
      version: 2,
      exportedAt: new Date().toISOString(),
      completed: [...completed].sort((a, b) => a - b),
      bookmarks: [...bookmarks].sort(byRef),
      notes
    };
  }

  async function exportNotes() {
    const backup = collectBackup();
    const json = JSON.stringify(backup, null, 2);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `juz-amma-notes-${date}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const count = Object.keys(backup.notes).length;

    // On phones, the share sheet lets you "Save to Files" or AirDrop to the laptop.
    const isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && navigator.canShare && typeof File === "function") {
      try {
        const file = new File([blob], filename, { type: "application/json" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "Juz Amma Notes Backup" });
          toast(`Backup tayyar: ${count} notes`);
          return;
        }
      } catch (e) {
        if (e && e.name === "AbortError") return; // user closed the share sheet
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast(`Backup download hua: ${count} notes`);
  }

  function validateBackup(obj) {
    if (!obj || typeof obj !== "object" || obj.app !== "juz-amma-journal") return null;
    const notes = {};
    if (obj.notes && typeof obj.notes === "object") {
      Object.keys(obj.notes).forEach((k) => {
        const full = PREFIX + k;
        if (NOTE_KEY_RE.test(full) && typeof obj.notes[k] === "string") notes[full] = obj.notes[k];
      });
    }
    const valid = new Set(SURAH_LIST.map((s) => s.number));
    const done = Array.isArray(obj.completed) ? obj.completed.filter((n) => valid.has(n)) : [];
    const bms = Array.isArray(obj.bookmarks)
      ? obj.bookmarks.filter((r) => typeof r === "string" && BOOKMARK_RE.test(r) && valid.has(Number(r.split(":")[0])))
      : [];
    return { notes, done, bms };
  }

  function importNotes(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast("File bahut badi hai."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try { parsed = JSON.parse(String(reader.result)); }
      catch (e) { toast("Ye JSON file sahi nahi hai."); return; }

      const data = validateBackup(parsed);
      if (!data) { toast("Ye Juz Amma Journal ka backup nahi lagta."); return; }

      flushNotes();
      const keys = Object.keys(data.notes);
      const conflicts = keys.filter((k) => {
        const existing = store.get(k, "");
        return existing.trim() && existing !== data.notes[k];
      }).length;

      const msg =
        `${keys.length} notes, ${data.bms.length} bookmarks aur ${data.done.length} completed surahs import honge.` +
        (conflicts ? `\n\n${conflicts} notes is device par pehle se alag likhe hue hain — wo backup wale se badal jayenge.` : "") +
        `\n\nIs device ki baqi notes waise hi rahengi. Continue karein?`;
      if (!window.confirm(msg)) return;

      let failed = 0;
      keys.forEach((k) => { if (!store.set(k, data.notes[k])) failed++; });
      data.done.forEach((n) => completed.add(n));
      data.bms.forEach((r) => bookmarks.add(r));
      setCompleted(completed);
      setBookmarks(bookmarks);

      renderProgress();
      if (current !== null) renderSurah(current);
      toast(failed ? `Import hua, lekin ${failed} notes save nahi ho sake.` : `Import mukammal: ${keys.length} notes`);
    };
    reader.onerror = () => toast("File parhi nahi ja saki.");
    reader.readAsText(file);
  }

  /* ---------- Mobile nav ---------- */
  function openNav(open) {
    document.body.classList.toggle("nav-open", open);
    el.scrim.hidden = !open;
    el.menuBtn.setAttribute("aria-expanded", String(open));
    if (open) {
      const active = el.list.querySelector(".surah-item.active");
      if (active) active.scrollIntoView({ block: "center" });
    }
  }

  /* ---------- Routing: #/surah/114 or #/surah/114/3 ---------- */
  function parseHash() {
    const m = location.hash.match(/^#\/surah\/(\d{2,3})(?:\/(\d{1,3}))?/);
    if (!m) return null;
    const num = Number(m[1]);
    if (!SURAH_LIST.some((s) => s.number === num)) return null;
    return { num, ayah: m[2] ? Number(m[2]) : null };
  }

  function go(num) {
    if (location.hash !== `#/surah/${num}`) location.hash = `#/surah/${num}`;
    else renderSurah(num);
  }

  /* ---------- Events ---------- */
  el.list.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-toggle]");
    if (toggle) { toggleComplete(Number(toggle.dataset.toggle)); return; }
    const link = e.target.closest("[data-go]");
    if (link) { go(Number(link.dataset.go)); openNav(false); }
  });

  el.filters.addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.dataset.filter;
    store.set(KEY.filter, filter);
    renderFilters();
    renderSidebar();
  });

  el.page.addEventListener("click", async (e) => {
    if (e.target.closest("[data-print]")) { flushNotes(); window.print(); return; }
    if (e.target.closest("[data-done-btn]") && current !== null) { toggleComplete(current); return; }
    const retry = e.target.closest("[data-retry]");
    if (retry) { renderSurah(Number(retry.dataset.retry)); return; }
    const c = e.target.closest("[data-copy]");
    if (c) {
      const ok = await copyText(ayahText(c.dataset.copy));
      toast(ok ? "Ayat aur tarjuma copy ho gaye" : "Copy nahi ho saka");
      return;
    }
    const b = e.target.closest("[data-bookmark]");
    if (b) toggleBookmark(b.dataset.bookmark, b);
  });

  el.search.addEventListener("input", renderSidebar);
  const paraJump = $("#paraJump");
  if (paraJump) {
    paraJump.innerHTML = '<option value="">Para par jayein…</option>' + PARAS.map((p) => `<option value="${p.number}">Para ${p.number} · ${esc(p.name)} (${p.start})</option>`).join("");
    paraJump.addEventListener("change", () => {
      const p = PARAS.find((x) => String(x.number) === paraJump.value);
      paraJump.value = "";
      if (p) { location.hash = paraLink(p); openNav(false); }
    });
  }
  el.menuBtn.addEventListener("click", () => openNav(!document.body.classList.contains("nav-open")));
  el.scrim.addEventListener("click", () => openNav(false));
  el.printTop.addEventListener("click", () => { flushNotes(); window.print(); });
  el.exportBtn.addEventListener("click", exportNotes);
  el.importBtn.addEventListener("click", () => el.importFile.click());
  el.importFile.addEventListener("change", () => {
    importNotes(el.importFile.files[0]);
    el.importFile.value = "";
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") openNav(false); });

  // iPhone Safari may suspend the page without warning — write pending notes first.
  window.addEventListener("pagehide", flushNotes);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushNotes(); });

  window.addEventListener("hashchange", () => {
    const h = parseHash();
    if (!h) return;
    if (h.num === current && h.ayah && SURAH_CONTENT[h.num]) {
      const t = document.getElementById(`ayah-${h.ayah}`);
      if (t) {
        t.scrollIntoView({ block: "start", behavior: "smooth" });
        t.classList.add("flash");
        setTimeout(() => t.classList.remove("flash"), 1600);
        return;
      }
    }
    renderSurah(h.num, h.ayah);
  });

  /* ---------- Init ---------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  renderProgress();
  renderFilters();
  const start = parseHash();
  if (start) renderSurah(start.num, start.ayah);
  else {
    const last = Number(store.get(KEY.last, ""));
    go(SURAH_LIST.some((s) => s.number === last) ? last : 114);
  }
})();
