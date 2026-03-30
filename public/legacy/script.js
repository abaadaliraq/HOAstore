
(() => {
  "use strict";
  /* =========================
     CONFIG
  ========================= */
  const EMAILJS_PUBLIC_KEY = "tivoinl7MHIKAOORE";
  const EMAILJS_SERVICE_ID = "service_bm4mbb9";
  const EMAILJS_TEMPLATE_ID = "template_yksn5vh";

  const WHATSAPP_NUMBER_INTL = "9647777045544";
 const STORE_CANONICAL_URL = "https://houseofantiques.store/";

  const FAV_KEY = "hoa_favorites_v7";
  const LANG_KEY = "hoa_lang_v7";
  const CAT_KEY = "hoa_category_v7";

  /* =========================
     Utils
  ========================= */
  const $ = (id) => document.getElementById(id);
  const safeText = (x) => (x == null ? "" : String(x));
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);

  function normalizeArabic(s) {
    return safeText(s)
      .toLowerCase()
      .trim()
      .replace(/[ـ]/g, "")
      .replace(/[ًٌٍَُِّْ]/g, "")
      .replace(/[أإآا]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/\s+/g, " ");
  }

function getRawPrice(product) {
  const direct = product?.priceNumber ?? product?.price ?? product?._priceNum ?? 0;
  const n = Number(direct);
  return Number.isFinite(n) ? n : 0;

}
function pickText(obj, field, getLang) {
  const lang = getLang();

  const pickLocalized = (base) => {
    const direct =
      lang === "en"
        ? obj?.[`${base}_en`]
        : lang === "ku"
        ? obj?.[`${base}_ku`]
        : obj?.[`${base}_ar`];

    if (direct != null && direct !== "") return safeText(direct);

    const raw = obj?.[base];

    if (isObj(raw)) {
      return safeText(raw?.[lang] || raw?.ar || raw?.en || raw?.ku || "");
    }

    return safeText(raw || "");
  };

  if (field === "name") {
    return pickLocalized("name");
  }

  if (field === "desc") {
    if (lang === "en" && (obj?.description_en != null && obj?.description_en !== "")) {
      return safeText(obj.description_en);
    }
    if (lang === "ku" && (obj?.description_ku != null && obj?.description_ku !== "")) {
      return safeText(obj.description_ku);
    }
    if (lang === "ar" && (obj?.description_ar != null && obj?.description_ar !== "")) {
      return safeText(obj.description_ar);
    }

    const raw = obj?.description ?? obj?.desc ?? "";

    if (isObj(raw)) {
      return safeText(raw?.[lang] || raw?.ar || raw?.en || raw?.ku || "");
    }

    return safeText(raw);
  }

  if (field === "price") {
    const rawPrice = obj?.price;

    if (rawPrice === null || rawPrice === undefined || rawPrice === "") {
      return "";
    }

    const price = Number(rawPrice);

    if (!Number.isFinite(price)) {
      return "";
    }

    return `${price.toLocaleString()} $`;
  }

  const v = obj?.[field];
  if (isObj(v)) return safeText(v[lang] || v.ar || v.en || v.ku || "");
  return safeText(v);
}
  /* =========================
     DOM (IDs unchanged)
  ========================= */
  const els = {};
  function bindEls() {
    els.langSelect = $("langSelect");
    els.searchInput = $("searchInput");
    els.resultsCount = $("resultsCount");
    els.chipsWrap = $("chipsWrap");
    els.sortSelect = $("sortSelect");
    els.showSelect = $("showSelect");
    els.productsGrid = $("productsGrid");
    els.emptyState = $("emptyState");
   els.cartTitle = $("cartTitle");
els.cartEmptyText = $("cartEmptyText");
els.cartTotalLabel = $("cartTotalLabel");
els.cartCheckoutBtn = $("cartCheckoutBtn");
els.cartClearBtn = $("cartClearBtn");

    // modal
    els.modal = $("modal");
    els.modalClose = $("modalClose");
    els.modalBody = $("modalBody");
    els.modalMainImg = $("modalMainImg");

    els.pinPrice = $("pinPrice");
    els.modalTitle = $("modalTitle");
    els.modalBadge = $("modalBadge");
    els.modalCode = $("modalCode");
    els.modalStatus = $("modalStatus");

    els.pinDimsWrap = $("pinDimsWrap");
    els.itemDimensions = $("itemDimensions");

    els.pinDetailsToggle = $("pinDetailsToggle");
    els.pinOrderToggle = $("pinOrderToggle");
    els.pinDetails = $("pinDetails");
    els.pinDesc = $("pinDesc");
    els.pinMoreBtn = $("pinMoreBtn");
    els.pinOrderPanel = $("pinOrderPanel");

    els.favBtn = $("favBtn");
    els.shareWaBtn = $("shareWaBtn");
    els.copyLinkBtn = $("copyLinkBtn");

    els.similarProducts = $("similarProducts");

    // order
    els.orderName = $("orderName");
    els.orderPhone = $("orderPhone");
    els.orderEmail = $("orderEmail");
    els.orderGov = $("orderGov");
    els.orderArea = $("orderArea");
    els.orderLandmark = $("orderLandmark");
    els.orderNotes = $("orderNotes");
    els.orderWhatsApp = $("orderWhatsApp");
    els.copyOrder = $("copyOrder");
  }

  /* =========================
     TEXT (same keys)
  ========================= */
  const TXT = {
    all: { ar: "الكل", en: "All", ku: "هەموو" },
    results: { ar: "نتائج", en: "Results", ku: "ئەنجامەکان" },
    available: { ar: "متوفرة", en: "Available", ku: "بەردەستە" },
    reserved: { ar: "محجوزة للمعاينة", en: "Reserved", ku: "گیراوە" },
    acquired: { ar: "تم اقتناؤها", en: "Acquired", ku: "وەرگیرا" },
    auction: { ar: "مزاد", en: "Auction", ku: "مەزاد" },
    similar: { ar: "قطع مشابهة", en: "Similar items", ku: "دانە هاوشێوەکان" },
    seeMore: { ar: "اضغط للمزيد", en: "See more", ku: "زیاتر ببینە" },
    seeLess: { ar: "إخفاء", en: "See less", ku: "کەمتر ببینە" },
    linkCopied: { ar: "تم نسخ الرابط", en: "Link copied", ku: "بەستەر کۆپی کرا" },
    copied: { ar: "تم النسخ", en: "Copied", ku: "کۆپی کرا" },
    copyFail: { ar: "تعذر النسخ", en: "Could not copy", ku: "نەتوانرا کۆپی بکرێت" },
    noResults: { ar: "لا توجد نتائج", en: "No results", ku: "هیچ ئەنجامێک نییە" },

    // Order UI
    orderDetails: { ar: "تفاصيل", en: "Details", ku: "وردەکاری" },
    orderRequest: { ar: "طلب", en: "Order", ku: "داواکردن" },
    customerInfo: { ar: "بيانات الزبون", en: "Customer details", ku: "زانیاری کڕیار" },

    ph_name: { ar: "الاسم الكامل", en: "Full name", ku: "ناوی تەواو" },
    ph_phone: { ar: "رقم الهاتف", en: "Phone number", ku: "ژمارەی تەلەفۆن" },
    ph_email: { ar: "البريد الإلكتروني", en: "Email", ku: "ئیمەیڵ" },
    ph_gov: { ar: "المحافظة", en: "Governorate", ku: "پارێزگا" },
    ph_area: { ar: "المنطقة", en: "Area", ku: "ناوچە" },
    ph_landmark: { ar: "أقرب نقطة دالة (اختياري)", en: "Nearest landmark (optional)", ku: "نیشانەی نزیک (هەڵبژاردەیی)" },
    ph_notes: { ar: "ملاحظات (اختياري)", en: "Notes (optional)", ku: "تێبینی (هەڵبژاردەیی)" },

    sendOrder: { ar: "إرسال الطلب", en: "Send order", ku: "ناردنی داوا" },
    copyOrderBtn: { ar: "نسخ تفاصيل الطلب", en: "Copy order details", ku: "کۆپی کردنی زانیاری داوا" },
    closeTxt: { ar: "إغلاق", en: "Close", ku: "داخستن" },

    req: { ar: "رجاءً أكمل الحقول المطلوبة", en: "Please complete required fields", ku: "تکایە خانە پێویستەکان پڕ بکەوە" },
    badEmail: { ar: "البريد الإلكتروني غير صحيح", en: "Invalid email address", ku: "ئیمەیڵ دروست نییە" },
    badName: { ar: "الاسم لازم يكون ثلاثي (3 كلمات)", en: "Full name must be at least 3 words", ku: "ناو پێویستە 3 وشە یان زیاتر بێت" },
    badPhone: { ar: "رقم الهاتف غير صحيح", en: "Invalid phone number", ku: "ژمارەی تەلەفۆن دروست نییە" },
  };

  /* =========================
     ✅ Categories (FIXED)
     - MUST match lengths + order to avoid "undefined"
  ========================= */
  const CATEGORY_KEYS = [
    "artworks",
    "paintings",
    "wood",
    "copper",
    "silver", // ✅ added
    "crystal",
    "furniture",
    "arabicCalligraphy",
    "accessories",
    "carpets",
    "vases",  // ✅ added
  ];

  const CAT_AR = [
    "اعمال فنية",
    "لوحات",
    "خشب",
    "نحاس",
    "فضة",     // ✅ added
    "كريستال",
    "اثاث",
    "خطوط عربية",
    "اكسسوارات",
    "سجاد",
    "فازات",   // ✅ added
  ];

  const CAT_EN = [
    "Artworks",
    "Paintings",
    "Wood",
    "Copper",
    "Silver",  // ✅ added
    "Crystal",
    "Furniture",
    "Arabic Calligraphy",
    "Accessories",
    "Carpets",
    "Vases",   // ✅ added
  ];

  const CAT_KU = [
    "کاری هونەری",
    "تابلۆکان",
    "دار",
    "مەس",
    "زیو",     // ✅ added
    "کریستاڵ",
    "کەلوپەلی ناوماڵ",
    "خەتاطی عەرەبی",
    "ئاکسسوار",
    "فرش",
    "گۆڵدان",  // ✅ added
  ];

  function getLang() {
    return (els.langSelect && els.langSelect.value) || localStorage.getItem(LANG_KEY) || "ar";
  }
  function t(k) {
    const lang = getLang();
    return (TXT[k] && TXT[k][lang]) || k;
  }
  function catLabel(key) {
    if (key === "all") return t("all");
    const i = CATEGORY_KEYS.indexOf(key);
    if (i === -1) return key;
    const lang = getLang();
    return lang === "en" ? CAT_EN[i] : lang === "ku" ? CAT_KU[i] : CAT_AR[i];
  }
  function applyLangToDOM(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  }
function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  applyLangToDOM(lang);
  renderAll();
  applyOrderI18n();
  applyCartI18n();
  if (typeof renderCart === "function") renderCart();
  if (state.openKey) openModal(state.openKey, true);
}

function applyOrderI18n() {
  if (els.pinDetailsToggle) {
    els.pinDetailsToggle.textContent = t("orderDetails");
  }

  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.textContent =
      getLang() === "en"
        ? "Add to cart"
        : getLang() === "ku"
        ? "زیادکردن بۆ سەبەتە"
        : "أضف إلى السلة";
  }
}

function applyCartI18n() {
  if (els.cartTitle) els.cartTitle.textContent = t("cart_title");
  if (els.cartEmptyText) els.cartEmptyText.textContent = t("cart_empty");
  if (els.cartTotalLabel) els.cartTotalLabel.textContent = t("cart_total");
  if (els.cartCheckoutBtn) els.cartCheckoutBtn.textContent = t("cart_checkout");
  if (els.cartClearBtn) els.cartClearBtn.textContent = t("cart_clear");
}
  /* =========================
     Category normalize (FIXED)
  ========================= */
  function normCatInput(s) {
    // ✅ better Arabic normalization (handles ة/ه, أ/ا, etc.)
    return normalizeArabic(s);
  }

  function normalizeCategoryKey(input) {
    const s = normCatInput(input);
    if (!s) return "other";
    if (CATEGORY_KEYS.includes(s)) return s;

    // AR
    if (s.includes("اعمال") || s.includes("اعمال") || s.includes("عمل فني") || s.includes("فن")) return "artworks";
    if (s.includes("لوحات") || s.includes("لوحه") || s.includes("لوحه")) return "paintings";
    if (s.includes("خشب") || s.includes("اخشاب")) return "wood";
    if (s.includes("نحاس")) return "copper";
    if (s.includes("فضه") || s.includes("فضيات") || s.includes("سلفر")) return "silver"; // ✅ silver
    if (s.includes("كريستال")) return "crystal";
    if (s.includes("اثاث") || s.includes("اثاث") || s.includes("كنب") || s.includes("كرسي") || s.includes("طاولة")) return "furniture";
    if (s.includes("خطوط") || s.includes("خط عربي") || s.includes("calligraphy")) return "arabicCalligraphy";
    if (s.includes("اكسسوارات") || s.includes("اكسسوار")) return "accessories";
    if (s.includes("سجاد") || s.includes("زوليه") || s.includes("زوالي")) return "carpets";
    if (s.includes("فازه") || s.includes("فازات") || s.includes("مزهرية") || s.includes("مزاهير")) return "vases"; // ✅ vases

    // EN
    if (s.includes("artwork") || s === "art" || s.includes("artworks")) return "artworks";
    if (s.includes("painting")) return "paintings";
    if (s.includes("wood")) return "wood";
    if (s.includes("copper")) return "copper";
    if (s.includes("silver")) return "silver";
    if (s.includes("crystal")) return "crystal";
    if (s.includes("furniture")) return "furniture";
    if (s.includes("arabic calligraphy") || (s.includes("calligraphy") && s.includes("arabic"))) return "arabicCalligraphy";
    if (s.includes("accessor")) return "accessories";
    if (s.includes("carpet") || s.includes("rug")) return "carpets";
    if (s.includes("vase") || s.includes("vases")) return "vases";

    // KU
    if (s.includes("کاری هونەری") || s.includes("هونەری")) return "artworks";
    if (s.includes("تابلۆ")) return "paintings";
    if (s.includes("دار")) return "wood";
    if (s.includes("مەس")) return "copper";
    if (s.includes("زيو") || s.includes("زیو")) return "silver";
    if (s.includes("کریستاڵ")) return "crystal";
    if (s.includes("کەلوپەل")) return "furniture";
    if (s.includes("خەتاطی")) return "arabicCalligraphy";
    if (s.includes("ئاکسسوار")) return "accessories";
    if (s.includes("فرش")) return "carpets";
    if (s.includes("گۆڵدان") || s.includes("ڤاز")) return "vases";

    return "other";
  }

  /* =========================
     Products hydrate
  ========================= */
  function getProductsRaw() {
    if (Array.isArray(window.PRODUCTS)) return window.PRODUCTS;
    if (Array.isArray(window.HOA_PRODUCTS)) return window.HOA_PRODUCTS;
    if (Array.isArray(window.products)) return window.products;
    return [];
  }

  function normalizeStatusKey(p) {
    const raw = safeText(p.statusKey || p.status || "").toLowerCase();
    if (raw.includes("acquired") || raw.includes("تم")) return "acquired";
    if (raw.includes("reserved") || raw.includes("محجوز")) return "reserved";
    return "available";
  }
  function statusText(key) {
    if (key === "available") return t("available");
    if (key === "reserved") return t("reserved");
    if (key === "acquired") return t("acquired");
    return "—";
  }

  function getImages(p) {
    const arr = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
    const one = safeText(p.image || p._image || "");
    if (one && !arr.includes(one)) arr.unshift(one);
    return arr.filter(Boolean);
  }

  // Small helper to reduce scroll jumps:
  const AR_KEY = "hoa_img_ar_v1";
  let AR_MAP = {};
  function loadAR() {
    try {
      AR_MAP = JSON.parse(localStorage.getItem(AR_KEY) || "{}") || {};
    } catch {
      AR_MAP = {};
    }
  }
  function saveAR() {
    try {
      localStorage.setItem(AR_KEY, JSON.stringify(AR_MAP));
    } catch {}
  }
  function getAR(url) {
    return AR_MAP[url] || null;
  }
  function setAR(url, w, h) {
    if (!url || !w || !h) return;
    const ar = `${w}/${h}`;
    if (AR_MAP[url] !== ar) {
      AR_MAP[url] = ar;
      saveAR();
    }
  }
function formatUSD(num) {
  const n = Number(num || 0);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `$${n.toLocaleString("en-US")}`;
}

function getRawPrice(product) {
  const direct = product?.priceNumber ?? product?.price ?? product?._priceNum ?? 0;
  const n = Number(direct);
  return Number.isFinite(n) ? n : 0;
}

let ALL = [];

function hydrate() {
  const raw = getProductsRaw();
  const seen = new Map();

  ALL = raw.map((p, idx) => {
    const code = safeText(p.product_code || p.code || p.id || `ITEM-${idx + 1}`);
    const n = (seen.get(code) || 0) + 1;
    seen.set(code, n);
    const key = n === 1 ? code : `${code}__${n}`;

    const catText = pickText(p, "category", getLang) || safeText(p.category || p.cat || "");
    const catKey = normalizeCategoryKey(catText);

    const rawPrice = getRawPrice(p);
    const priceText = formatUSD(rawPrice);
    const images = getImages(p);
    const cover = images[0] || "";

    return {
      ...p,
      _key: key,
      _code: code,
      _catKey: catKey,
      _statusKey: normalizeStatusKey(p),
      _priceText: priceText,
      _priceNum: rawPrice,
      _createdNum: Date.parse(p.createdAt || "") || 0,
      _images: images,
      _cover: cover,
    };
  });
}
function getByKey(key) {
  return ALL.find((p) => String(p._key) === String(key)) || null;
}
  /* =========================
     Favorites
  ========================= */
  let favs = new Set();
  function loadFavs() {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      favs = new Set(Array.isArray(arr) ? arr : []);
    } catch {
      favs = new Set();
    }
  }
  function saveFavs() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
    } catch {}
  }
  function toggleFav(key) {
    if (!key) return;
    favs.has(key) ? favs.delete(key) : favs.add(key);
    saveFavs();
    renderGrid();
    if (state.openKey === key) updateFavBtn(key);
  }
  function updateFavBtn(key) {
    if (!els.favBtn) return;
    els.favBtn.textContent = favs.has(key) ? "♥" : "♡";
  }

  /* =========================
     State
  ========================= */
  const state = {
    q: "",
    cat: localStorage.getItem(CAT_KEY) || "all",
    sort: "featured",
    show: "all",
    openKey: null,
  };

  /* =========================
     Filtering + sorting
  ========================= */
  function matchesSearch(p, qNorm) {
    if (!qNorm) return true;
    const name = normalizeArabic(pickText(p, "name", getLang));
    const code = normalizeArabic(p._code);
    const desc = normalizeArabic(pickText(p, "desc", getLang));
    return name.includes(qNorm) || code.includes(qNorm) || desc.includes(qNorm);
  }

  function passes(p) {
    if (state.show === "fav" && !favs.has(p._key)) return false;
    if (state.cat !== "all" && p._catKey !== state.cat) return false;
    return matchesSearch(p, normalizeArabic(state.q));
  }

function sortList(list) {
  const out = list.slice();

  if (state.sort === "newest") {
    out.sort((a, b) => {
      const da = Date.parse(a.createdAt || "") || 0;
      const db = Date.parse(b.createdAt || "") || 0;
      return db - da;
    });
    return out;
  }

  if (state.sort === "priceAsc") {
    out.sort((a, b) => getRawPrice(a) - getRawPrice(b));
    return out;
  }

  if (state.sort === "priceDesc") {
    out.sort((a, b) => getRawPrice(b) - getRawPrice(a));
    return out;
  }

  // fallback مهم حتى ما ينكسر الكود
  return out;
}

  /* =========================
   Categories chips
========================= */
function renderChips() {
  if (!els.chipsWrap) return;
  const keys = ["all", ...CATEGORY_KEYS];

  els.chipsWrap.innerHTML = keys
    .map((k) => {
      const active = state.cat === k ? "is-active" : "";
      return `<button class="chip ${active}" type="button" data-cat="${k}">${catLabel(k)}</button>`;
    })
    .join("");
}

/* =========================
   Grid (Pinterest masonry stability fix)
========================= */
function tileHTML(p) {
  const name = pickText(p, "name", getLang);
  const st = statusText(p._statusKey);
  const fav = favs.has(p._key);

  const ar = getAR(p._cover) || "4/3";

  const mediaStyle = [
    "width:100%",
    `aspect-ratio:${ar}`,
    "border-radius:18px",
    "overflow:hidden",
    "background:rgba(255,255,255,.06)",
    "position:relative",
  ].join(";");

  const imgStyle = [
    "width:100%",
    "height:100%",
    "display:block",
    "object-fit:cover",
  ].join(";");

  const imgs = Array.isArray(p._images) ? p._images.filter(Boolean) : [];
  const hasMany = imgs.length > 1;
  const framesAttr = hasMany ? encodeURIComponent(JSON.stringify(imgs)) : "";

  return `
    <div class="tile" data-key="${safeText(p._key)}">
      <div class="tileMedia" style="${mediaStyle}" data-sensitive="${p.sensitive ? "1" : "0"}">

        ${
          p.sensitive
            ? `
              <div class="contentWarning">
                <div class="warningBox">
                  <p data-i18n="sensitive_text">${t("sensitive_text")}</p>
                  <button class="revealBtn" type="button" data-i18n="view_content">
                    ${t("view_content")}
                  </button>
                </div>
              </div>
            `
            : ""
        }

        <img class="tileImg tileImg--base"
          data-cover="1"
          ${hasMany ? `data-frames="${framesAttr}"` : ""}
          src="${safeText(p._cover)}"
          alt="${safeText(name)}"
          loading="lazy"
          decoding="async"
          style="${imgStyle}; position:absolute; inset:0;">

        ${
          hasMany
            ? `
              <img class="tileImg tileImg--top"
                src="${safeText(p._cover)}"
                alt=""
                aria-hidden="true"
                decoding="async"
                style="${imgStyle};
                  position:absolute; inset:0;
                  opacity:0;
                  transition:opacity .6s ease;
                  will-change:opacity;
                  pointer-events:none;
                ">

              <div class="multiBadge" style="
                position:absolute; top:10px; left:10px; z-index:3;
                background:rgba(0,0,0,.55);
                color:#fff; font-size:12px;
                padding:6px 10px; border-radius:999px;
                backdrop-filter: blur(6px);
              ">${imgs.length} صور</div>
            `
            : ""
        }
      </div>

      <div class="tileMeta">
        <div class="tileName">${safeText(name)}</div>

        <div class="tileSub">
          <span>${safeText(p._code)}</span>
          <span>${safeText(p._priceText)}</span>
        </div>

        <div class="tileSub">
          <span>${safeText(st)}</span>
          <span class="favDot" title="Fav">${fav ? "♥" : "♡"}</span>
        </div>
      </div>
    </div>
  `;
}

function renderGrid() {
  const list = sortList(ALL.filter(passes));
  if (els.resultsCount) els.resultsCount.textContent = `${list.length} ${t("results")}`;

  if (!list.length) {
    if (els.productsGrid) {
      els.productsGrid.innerHTML = "";
      els.productsGrid.classList.remove("is-rows");
    }
    if (els.emptyState) {
      els.emptyState.style.display = "block";
      els.emptyState.textContent = t("noResults");
    }
    return;
  }

  if (els.emptyState) els.emptyState.style.display = "none";

  if (els.productsGrid) {
    const useRowGrid = state.sort === "priceAsc" || state.sort === "priceDesc" || state.sort === "newest";
    els.productsGrid.classList.toggle("is-rows", useRowGrid);
    els.productsGrid.innerHTML = list.map(tileHTML).join("");
  }
  

  primeAspectRatios();
  initTileAutoFlip();
}
function renderAll() {
  renderChips();
  renderGrid();
  renderFeatured();
}

function primeAspectRatios() {
  if (!els.productsGrid) return;
  const imgs = Array.from(els.productsGrid.querySelectorAll('img[data-cover="1"]'));
  imgs.forEach((img) => {
    if (img.__arBound) return;
    img.__arBound = true;

    const onDone = () => {
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 0;
      if (w > 0 && h > 0) setAR(img.currentSrc || img.src, w, h);
    };

    if (img.complete) onDone();
    else img.addEventListener("load", onDone, { once: true });
  });
}

/* =========================
   Tile auto flip (smooth crossfade - NO broken img)
========================= */
let __hoaTileObs = null;

function initTileAutoFlip() {
  if (!els.productsGrid) return;

  // افصل أي مراقب قديم
  try { __hoaTileObs && __hoaTileObs.disconnect(); } catch {}
  __hoaTileObs = null;

  const SPEED = 2400;  // وقت الانتظار بين التقليب
  const FADE  = 650;   // مدة السلايد (لازم تطابق transition تقريباً)

  const decodeFrames = (baseImg) => {
    const raw = baseImg.getAttribute("data-frames") || "";
    if (!raw) return [];
    try { return JSON.parse(decodeURIComponent(raw)) || []; } catch { return []; }
  };

  const preload = (src) =>
    new Promise((resolve) => {
      if (!src) return resolve(false);
      const im = new Image();
      im.onload = () => resolve(true);
      im.onerror = () => resolve(false);
      im.src = src;
    });

  const start = (baseImg) => {
    if (!baseImg || baseImg.__hoaFlipStarted) return;

    const frames = decodeFrames(baseImg).filter(Boolean);
    if (frames.length < 2) return;

    const media = baseImg.closest(".tileMedia");
    if (!media) return;

    const topImg = media.querySelector(".tileImg--top");
    if (!topImg) return;

    baseImg.__hoaFlipStarted = true;

    // خلي topImg مهيأ
    topImg.style.opacity = "0";
    topImg.style.transition = `opacity ${FADE}ms ease`;
    topImg.style.willChange = "opacity";

    // مؤشر داخل الفريمات
    let i = Math.max(0, frames.indexOf(baseImg.currentSrc || baseImg.src));
    if (i < 0) i = 0;

    let busy = false;

    const tick = async () => {
      if (!document.contains(baseImg)) {
        stop(baseImg);
        return;
      }
      if (busy) return;
      busy = true;

      // التالي
      i = (i + 1) % frames.length;
      const nextSrc = frames[i];

      // preload قبل ما نطلع fade
      const ok = await preload(nextSrc);
      if (!ok) {
        busy = false;
        return;
      }

      // حط الصورة الجديدة بالطبقة العلوية
      topImg.src = nextSrc;

      // ابدأ الفيد بس بعد frame حتى المتصفح يلتقط التغيير
      requestAnimationFrame(() => {
        topImg.style.opacity = "1";

        // بعد انتهاء الفيد: ثبتها كـ base ورجّع top مخفي
        setTimeout(() => {
          baseImg.src = nextSrc;
          topImg.style.opacity = "0";

          // مهم: لا تمسح src، خليه نفس base حتى ما يظهر broken نهائيًا
          setTimeout(() => {
            topImg.src = nextSrc;
            busy = false;
          }, 40);
        }, FADE + 20);
      });
    };

    baseImg.__hoaFlipTick = tick;
    baseImg.__hoaFlipSpeed = SPEED;
    baseImg.__hoaFlipTimer = setInterval(tick, SPEED);

    // وقف عند hover (مرة وحدة)
    if (!media.__hoaHoverBound) {
      media.__hoaHoverBound = true;

      media.addEventListener("mouseenter", () => {
        const bi = media.querySelector(".tileImg--base");
        if (bi?.__hoaFlipTimer) clearInterval(bi.__hoaFlipTimer);
        if (bi) bi.__hoaFlipTimer = null;
      });

      media.addEventListener("mouseleave", () => {
        const bi = media.querySelector(".tileImg--base");
        if (!bi) return;
        if (!bi.__hoaFlipTimer && bi.__hoaFlipTick) {
          bi.__hoaFlipTimer = setInterval(bi.__hoaFlipTick, bi.__hoaFlipSpeed || SPEED);
        }
      });
    }
  };

  const stop = (baseImg) => {
    if (!baseImg) return;
    if (baseImg.__hoaFlipTimer) clearInterval(baseImg.__hoaFlipTimer);
    baseImg.__hoaFlipTimer = null;
  };

  const baseImgs = Array.from(
    els.productsGrid.querySelectorAll(".tileImg--base[data-frames]")
  );

  if (!("IntersectionObserver" in window)) {
    baseImgs.forEach(start);
    return;
  }

  __hoaTileObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        const img = ent.target;
        if (ent.isIntersecting) start(img);
        else stop(img);
      });
    },
    { root: null, rootMargin: "250px 0px", threshold: 0.01 }
  );

  baseImgs.forEach((img) => __hoaTileObs.observe(img));
}

  function setBodyScrollLock(lock) {
    document.body.classList.toggle("noScroll", !!lock);
  }

  function buildItemLink(p) {
    try {
      const base = new URL(STORE_CANONICAL_URL);
      if (!base.pathname.endsWith("/")) base.pathname += "/";
      base.hash = `item=${encodeURIComponent(p._key)}`;
      return base.toString();
    } catch {
      const url = new URL(window.location.href);
      url.hash = `item=${encodeURIComponent(p._key)}`;
      return url.toString();
    }
  }

  /* =========================
     Modal media (FIX #1 + #2)
  ========================= */
  function clearModalSlider() {
    const old = els.modalBody?.querySelector(".hoaSlider");
    if (old) old.remove();
    if (els.modalMainImg) {
      els.modalMainImg.style.display = "";
      els.modalMainImg.removeAttribute("data-hidden");
    }
  }

  function renderModalMedia(p) {
    if (!els.modalBody) return;

    const images = Array.isArray(p._images) ? p._images : [];
    const many = images.length > 1;

    clearModalSlider();

    if (els.modalMainImg) {
      els.modalMainImg.style.maxWidth = "100%";
      els.modalMainImg.style.width = "100%";
      els.modalMainImg.style.height = "auto";
      els.modalMainImg.style.maxHeight = "70vh";
      els.modalMainImg.style.objectFit = "contain";
      els.modalMainImg.style.display = many ? "none" : "";
      els.modalMainImg.setAttribute("data-hidden", many ? "1" : "0");
    }

    if (!many) {
      const src = images[0] || p._cover || "";
      els.modalMainImg.src = src;
      return;
    }

    const slider = document.createElement("div");
    slider.className = "hoaSlider";
    slider.setAttribute(
      "style",
      [
        "width:100%",
        "margin:0 0 10px 0",
        "border-radius:18px",
        "overflow:hidden",
        "background:rgba(255,255,255,.05)",
        "position:relative",
      ].join(";")
    );

    slider.innerHTML = `
      <div class="hoaSliderTrack" style="
        display:flex;
        overflow-x:auto;
        scroll-snap-type:x mandatory;
        -webkit-overflow-scrolling:touch;
        gap:8px;
        scrollbar-width:none;
      ">
      ${images
        .map(
          (src) => `
  <div class="hoaSlide" style="
    flex:0 0 100%;
    scroll-snap-align:center;
    height:70vh;
    display:flex;
    align-items:center;
    justify-content:center;
    position:relative;
  ">
    <img src="${safeText(src)}" alt="" loading="lazy" decoding="async"
      style="
        width:100%;
        height:100%;
        object-fit:contain;
        display:block;
        margin:0 auto;
        background:transparent;
      ">
  </div>
`
        )
        .join("")}
      </div>

      <button type="button" class="hoaPrev" aria-label="prev" style="
        position:absolute; top:50%; transform:translateY(-50%);
        left:10px; z-index:2;
        width:40px; height:40px; border-radius:999px;
        border:0; background:rgba(0,0,0,.45); color:#fff;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">‹</button>

      <button type="button" class="hoaNext" aria-label="next" style="
        position:absolute; top:50%; transform:translateY(-50%);
        right:10px; z-index:2;
        width:40px; height:40px; border-radius:999px;
        border:0; background:rgba(0,0,0,.45); color:#fff;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">›</button>

      <div class="hoaDots" style="
        position:absolute; left:0; right:0; bottom:10px; z-index:2;
        display:flex; gap:6px; justify-content:center; align-items:center;
        pointer-events:auto;
      ">
        ${images
          .map(
            (_, i) => `
          <button type="button" data-i="${i}" aria-label="dot ${i + 1}" style="
            width:8px; height:8px; border-radius:999px;
            border:0; background:rgba(255,255,255,.55);
            cursor:pointer; padding:0;
          "></button>
        `
          )
          .join("")}
      </div>
    `;

    const anchor = els.modalMainImg;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(slider, anchor.nextSibling);
    else els.modalBody.prepend(slider);

    const track = slider.querySelector(".hoaSliderTrack");
    const btnPrev = slider.querySelector(".hoaPrev");
    const btnNext = slider.querySelector(".hoaNext");
    const dotsWrap = slider.querySelector(".hoaDots");
    const dots = Array.from(dotsWrap.querySelectorAll("button"));

    let idx = 0;
    const clamp = (n) => Math.max(0, Math.min(images.length - 1, n));

    const updateDots = () => {
      dots.forEach((d, i) => {
        d.style.background = i === idx ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.55)";
        d.style.transform = i === idx ? "scale(1.2)" : "scale(1)";
      });
    };

    const go = (i) => {
      idx = clamp(i);
      const w = track.clientWidth;
      track.scrollTo({ left: w * idx, behavior: "smooth" });
      updateDots();
    };

    let raf = 0;
    const calcIdxByCenter = () => {
      const slides = Array.from(track.querySelectorAll(".hoaSlide"));
      if (!slides.length) return 0;

      const tr = track.getBoundingClientRect();
      const trackCenter = tr.left + tr.width / 2;

      let bestI = 0;
      let bestD = Infinity;

      slides.forEach((sl, i) => {
        const r = sl.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - trackCenter);
        if (d < bestD) {
          bestD = d;
          bestI = i;
        }
      });

      return bestI;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        idx = clamp(calcIdxByCenter());
        updateDots();
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });

    btnPrev.addEventListener("click", () => go(idx - 1));
    btnNext.addEventListener("click", () => go(idx + 1));
    dotsWrap.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (!b) return;
      go(Number(b.getAttribute("data-i") || 0));
    });

    updateDots();
    track.scrollLeft = 0;
  }
/* =========================
   Similar - smart + infinite
========================= */

const SIMILAR_BATCH_SIZE = 12;
let similarState = {
  baseKey: null,
  items: [],
  shown: 0,
  observer: null,
};

function normText(v) {
  return normalizeArabic(safeText(v || ""));
}

function splitWords(txt) {
  return normText(txt)
    .split(/[\s,،\-_/|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((w) => w.length >= 2);
}

function uniqueWords(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function getProductTextBag(p) {
  const name = pickText(p, "name", getLang);
  const desc = pickText(p, "desc", getLang);
  const artist = safeText(p.artist);
  const year = safeText(p.year);
  const keywords = safeText(p.keywords);
  const dims = pickText(p, "dimensions", getLang);
  const category = pickText(p, "category", getLang);

  const words = uniqueWords([
    ...splitWords(name),
    ...splitWords(desc),
    ...splitWords(artist),
    ...splitWords(year),
    ...splitWords(keywords),
    ...splitWords(dims),
    ...splitWords(category),
  ]);

  return {
    name: normText(name),
    desc: normText(desc),
    artist: normText(artist),
    year: normText(year),
    keywords: normText(keywords),
    dims: normText(dims),
    category: normText(category),
    words,
    wordSet: new Set(words),
  };
}

function wordIntersectionScore(aSet, bSet) {
  let score = 0;
  for (const w of aSet) {
    if (bSet.has(w)) score += 1;
  }
  return score;
}

/*
  Optional metadata you can add later inside products:
  palette: ["black", "brown", "beige"]
  tone: "dark"
  period: "modern"
*/
function getPaletteList(p) {
  if (Array.isArray(p.palette)) {
    return p.palette.map((x) => normText(x)).filter(Boolean);
  }
  return [];
}

function seededHash(str) {
  let h = 2166136261;
  const s = safeText(str);

  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }

  return Math.abs(h >>> 0);
}

function getSimilar(p, limit = 120) {
  const baseBag = getProductTextBag(p);
  const basePalette = getPaletteList(p);
  const baseTone = normText(p.tone);

  const scored = ALL
    .filter((x) => x._key !== p._key)
    .map((x) => {
      const bag = getProductTextBag(x);
      const palette = getPaletteList(x);
      const tone = normText(x.tone);

      let score = 0;

      if (x._catKey === p._catKey) score += 60;

      if (normText(x.artist) && normText(x.artist) === baseBag.artist) score += 80;

      if (safeText(x.year) && safeText(p.year) && safeText(x.year) === safeText(p.year)) {
        score += 20;
      }

      score += wordIntersectionScore(baseBag.wordSet, bag.wordSet) * 6;

      if (baseBag.keywords && bag.keywords) {
        const kwOverlap = wordIntersectionScore(
          new Set(splitWords(baseBag.keywords)),
          new Set(splitWords(bag.keywords))
        );
        score += kwOverlap * 10;
      }

      if (baseBag.dims && bag.dims && baseBag.dims === bag.dims) score += 12;

      if (basePalette.length && palette.length) {
        const palScore = wordIntersectionScore(new Set(basePalette), new Set(palette));
        score += palScore * 18;
      }

      if (baseTone && tone && baseTone === tone) score += 12;

      if (x.featured) score += 2;

      const tie = seededHash(`${p._key}__${x._key}`) % 1000;

      return { item: x, score, tie };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tie - b.tie;
    })
    .slice(0, limit)
    .map((row) => row.item);

  if (scored.length < 12) {
    const fallback = ALL
      .filter((x) => x._key !== p._key && x._catKey === p._catKey)
      .sort((a, b) => {
        const ah = seededHash(`${p._key}__${a._key}`);
        const bh = seededHash(`${p._key}__${b._key}`);
        return ah - bh;
      });

    const merged = [...scored];
    const seen = new Set(merged.map((x) => x._key));

    for (const f of fallback) {
      if (!seen.has(f._key)) {
        merged.push(f);
        seen.add(f._key);
      }
      if (merged.length >= limit) break;
    }

    return merged;
  }

  return scored;
}

function destroySimilarObserver() {
  if (similarState.observer) {
    try {
      similarState.observer.disconnect();
    } catch {}
    similarState.observer = null;
  }
}

function similarItemHTML(x) {
  return `
    <button class="similar-item" type="button" data-key="${x._key}">
      <img src="${safeText(x._cover)}" alt="" loading="lazy" decoding="async">
      <div class="t">${safeText(pickText(x, "name", getLang))}</div>
      <div class="pr">${safeText(x._priceText)}</div>
    </button>
  `;
}

function appendSimilarBatch() {
  if (!els.similarProducts) return;
  if (!similarState.items.length) return;

  const grid = els.similarProducts.querySelector(".similarGrid");
  if (!grid) return;

  const start = similarState.shown;
  const end = Math.min(start + SIMILAR_BATCH_SIZE, similarState.items.length);
  const chunk = similarState.items.slice(start, end);

  if (!chunk.length) return;

  grid.insertAdjacentHTML("beforeend", chunk.map(similarItemHTML).join(""));
  similarState.shown = end;

  const info = els.similarProducts.querySelector(".similarInfo");
  if (info) {
    info.textContent = `${similarState.shown} / ${similarState.items.length}`;
  }

  const sentinel = els.similarProducts.querySelector(".similarSentinel");
  if (sentinel && similarState.shown >= similarState.items.length) {
    sentinel.remove();
    destroySimilarObserver();
  }
}

function setupSimilarInfiniteScroll() {
  destroySimilarObserver();

  const sentinel = els.similarProducts?.querySelector(".similarSentinel");
  if (!sentinel) return;

  const rootEl = els.modalBody || null;

  similarState.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        appendSimilarBatch();
      });
    },
    {
      root: rootEl,
      rootMargin: "400px 0px",
      threshold: 0.01,
    }
  );

  similarState.observer.observe(sentinel);
}

function renderSimilar(p) {
  if (!els.similarProducts) return;

  const items = getSimilar(p, 120);

  similarState = {
    baseKey: p._key,
    items,
    shown: 0,
    observer: null,
  };

  if (!items.length) {
    els.similarProducts.innerHTML = "";
    return;
  }

  els.similarProducts.innerHTML = `
    <div class="similarHeadRow">
      <div class="similarHead">${t("similar")}</div>
      <div class="similarInfo">0 / ${items.length}</div>
    </div>
    <div class="similarGrid"></div>
    <div class="similarSentinel" aria-hidden="true" style="height:1px;"></div>
  `;

  appendSimilarBatch();
  setupSimilarInfiniteScroll();
}

/* =========================
   Order validation + phone
========================= */
let iti = null;

function initPhoneInput() {
  if (!els.orderPhone) return;

  if (window.intlTelInput) {
    iti = window.intlTelInput(els.orderPhone, {
      initialCountry: "iq",
      separateDialCode: true,
      nationalMode: false,
      autoPlaceholder: "aggressive",
    });
  }
}

function isValidEmail(email) {
  const e = safeText(email).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(e);
}

function isTripleName(name) {
  const parts = safeText(name).trim().split(/\s+/).filter(Boolean);
  return parts.length >= 3;
}

function getPhoneValue() {
  const raw = safeText(els.orderPhone?.value).trim();

  if (iti) {
    const ok =
      typeof iti.isValidNumber === "function"
        ? iti.isValidNumber()
        : raw.replace(/\D/g, "").length >= 7;

    const val = iti.getNumber ? iti.getNumber() : raw;
    return { ok, value: val };
  }

  const ok = raw.replace(/\D/g, "").length >= 7;
  return { ok, value: raw };
}

function validateOrder() {
  const name = safeText(els.orderName?.value).trim();
  const email = safeText(els.orderEmail?.value).trim();
  const gov = safeText(els.orderGov?.value).trim();
  const area = safeText(els.orderArea?.value).trim();

  if (!name || !email || !gov || !area) return { ok: false, msg: t("req") };
  if (!isTripleName(name)) return { ok: false, msg: t("badName") };
  if (!isValidEmail(email)) return { ok: false, msg: t("badEmail") };

  const ph = getPhoneValue();
  if (!ph.value || !ph.ok) return { ok: false, msg: t("badPhone") };

  return { ok: true, msg: "ok" };
}

function getCustomer() {
  const ph = getPhoneValue();

  return {
    name: safeText(els.orderName?.value).trim(),
    phone: safeText(ph.value).trim(),
    email: safeText(els.orderEmail?.value).trim(),
    gov: safeText(els.orderGov?.value).trim(),
    area: safeText(els.orderArea?.value).trim(),
    landmark: safeText(els.orderLandmark?.value).trim(),
    notes: safeText(els.orderNotes?.value).trim(),
  };
}

function buildOrderMessage(p, includeLink = true) {
  const lang = getLang();
  const c = getCustomer();
  const name = pickText(p, "name", getLang);
  const desc = pickText(p, "desc", getLang);
  const link = includeLink ? buildItemLink(p) : "";
  const st = statusText(p._statusKey);

  if (lang === "en") {
    return [
      "Hello House of Antiques 👋",
      "I would like to order / reserve this item:",
      `• Item: ${name}`,
      `• Code: ${p._code}`,
      `• Status: ${st}`,
      `• Price: ${p._priceText}`,
      desc ? `• Details: ${desc}` : "",
      link ? `• Link: ${link}` : "",
      "",
      "Customer details:",
      `• Full name: ${c.name}`,
      `• Phone: ${c.phone}`,
      `• Email: ${c.email}`,
      `• Governorate/City: ${c.gov}`,
      `• Area: ${c.area}`,
      c.landmark ? `• Landmark: ${c.landmark}` : "",
      c.notes ? `• Notes: ${c.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (lang === "ku") {
    return [
      "سڵاو بیت التحفیات 👋",
      "دەمەوێت ئەم دانە داوا/گیربکەم:",
      `• شت: ${name}`,
      `• کۆد: ${p._code}`,
      `• دۆخ: ${st}`,
      `• نرخ: ${p._priceText}`,
      desc ? `• وردەکاری: ${desc}` : "",
      link ? `• بەستەر: ${link}` : "",
      "",
      "زانیاری کڕیار:",
      `• ناو: ${c.name}`,
      `• ژمارە: ${c.phone}`,
      `• ئیمەیڵ: ${c.email}`,
      `• پارێزگا/شار: ${c.gov}`,
      `• ناوچە: ${c.area}`,
      c.landmark ? `• نیشانە: ${c.landmark}` : "",
      c.notes ? `• تێبینی: ${c.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    "مرحباً بيت التحفيات 👋",
    "أرغب بطلب / حجز هذه القطعة:",
    `• القطعة: ${name}`,
    `• الكود: ${p._code}`,
    `• الحالة: ${st}`,
    `• السعر: ${p._priceText}`,
    desc ? `• الوصف: ${desc}` : "",
    link ? `• الرابط: ${link}` : "",
    "",
    "بيانات الزبون:",
    `• الاسم الثلاثي: ${c.name}`,
    `• الهاتف: ${c.phone}`,
    `• البريد الإلكتروني: ${c.email}`,
    `• المحافظة/المدينة: ${c.gov}`,
    `• المنطقة: ${c.area}`,
    c.landmark ? `• أقرب نقطة دالة: ${c.landmark}` : "",
    c.notes ? `• ملاحظات: ${c.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function sendOrderEmail(p, messageText) {
  return new Promise((resolve) => {
    if (!window.emailjs) {
      console.warn("EmailJS not loaded");
      toast("EmailJS غير محمّل");
      return resolve(false);
    }

    if (!window.__hoa_emailjs_inited) {
      try {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      } catch {
        try {
          window.emailjs.init(EMAILJS_PUBLIC_KEY);
        } catch (e) {
          console.warn(e);
          toast("تعذر تهيئة EmailJS");
          return resolve(false);
        }
      }
      window.__hoa_emailjs_inited = true;
    }

    const c = getCustomer();

    const params = {
      item_name: pickText(p, "name", getLang),
      item_code: p._code,
      item_price: p._priceText,
      item_status: statusText(p._statusKey),
      item_link: buildItemLink(p),
      item_image: p._cover || "",
      customer_name: c.name,
      customer_phone: c.phone,
      customer_email: c.email,
      customer_gov: c.gov,
      customer_area: c.area,
      customer_landmark: c.landmark || "-",
      customer_notes: c.notes || "-",
      message: messageText,
    };

    window.emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
      .then(() => {
        toast("تم إرسال الطلب إلى الإيميل ✅");
        resolve(true);
      })
      .catch((err) => {
        console.error("EmailJS send error:", err);
        toast("فشل إرسال الإيميل ❌");
        resolve(false);
      });
  });
}

/* =========================
   Modal open/close
========================= */

function openModal(key, silent = false) {
  const p = getByKey(key);
  if (!p || !els.modal) return;

  state.openKey = key;

  const name = pickText(p, "name", getLang);
  const desc = pickText(p, "desc", getLang);
  const dims =
    pickText(p, "dimensions", getLang) ||
    safeText(p.dimension || p.size || "").trim();

  els.modalTitle.textContent = safeText(name);
  els.modalCode.textContent = safeText(p._code);
  els.modalStatus.textContent = statusText(p._statusKey);
  els.pinPrice.textContent = safeText(p._priceText);

  if (els.modalBadge) {
    els.modalBadge.style.display = p.auction ? "inline-flex" : "none";
    if (p.auction) els.modalBadge.textContent = t("auction");
  }

  if (els.itemDimensions) els.itemDimensions.textContent = dims;
  if (els.pinDimsWrap) els.pinDimsWrap.style.display = dims ? "block" : "none";

  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn && typeof addToCart === "function") {
    addToCartBtn.onclick = () => {
      addToCart(p.product_code || p.code || p.id || p._code || p._key);
    };
  }

  renderModalMedia(p);

  els.pinDesc.textContent = safeText(desc) || "—";
  els.pinDesc.classList.add("is-collapsed");

  const long = safeText(desc).length > 120;
  els.pinMoreBtn.style.display = long ? "inline-block" : "none";
  els.pinMoreBtn.textContent = t("seeMore");
  els.pinMoreBtn.onclick = () => {
    const collapsed = els.pinDesc.classList.toggle("is-collapsed");
    els.pinMoreBtn.textContent = collapsed ? t("seeMore") : t("seeLess");
  };

  showPanel("details");
  applyOrderI18n();

  if (els.pinDetailsToggle) {
    els.pinDetailsToggle.onclick = () => showPanel("details");
  }

  function showPanel(which) {
    if (els.pinDetails) {
      els.pinDetails.style.display = "block";
    }

    if (els.pinOrderPanel) {
      els.pinOrderPanel.style.display = "none";
    }

    if (els.pinDetailsToggle) {
      els.pinDetailsToggle.classList.add("active");
    }
  }

  updateFavBtn(key);
  els.favBtn.onclick = () => toggleFav(key);

  els.copyLinkBtn.onclick = async () => {
    const ok = await copyToClipboard(buildItemLink(p));
    toast(ok ? t("linkCopied") : t("copyFail"));
  };

  els.shareWaBtn.onclick = () => {
    const msg = buildOrderMessage(p, true);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  els.orderWhatsApp.onclick = async () => {
    const check = validateOrder();
    if (!check.ok) {
      toast(check.msg);
      return;
    }

    const msg = buildOrderMessage(p, true);
    await sendOrderEmail(p, msg);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER_INTL}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  els.copyOrder.onclick = async () => {
    const check = validateOrder();
    if (!check.ok) {
      toast(check.msg);
      return;
    }

    const ok = await copyToClipboard(buildOrderMessage(p, true));
    toast(ok ? t("copied") : t("copyFail"));
  };

  renderSimilar(p);

  els.modal.classList.add("is-open");
  els.modal.setAttribute("aria-hidden", "false");
  setBodyScrollLock(true);

  if (els.modalBody) els.modalBody.scrollTop = 0;

  if (!silent) {
    const url = new URL(window.location.href);
    url.hash = `item=${encodeURIComponent(p._key)}`;
    history.pushState({ modal: true, key: p._key }, "", url.toString());
  }
}

function closeModal(pushClean = true) {
  if (!els.modal) return;

  els.modal.classList.remove("is-open");
  els.modal.setAttribute("aria-hidden", "true");

  setBodyScrollLock(false);
  state.openKey = null;

  clearModalSlider();

  window.HOA_SFX?.play?.("click");

  if (pushClean) {
    const url = new URL(window.location.href);
    url.hash = "";
    history.pushState({}, "", url.toString());
  }
}

/* =========================
   Featured (unchanged idea)
========================= */
function renderFeatured() {
  const wrap = document.getElementById("featuredWrap");
  if (!wrap) return;

  const featured = ALL.filter((p) => p.featured === true).slice(0, 10);

  if (!featured.length) {
    wrap.innerHTML = "";
    return;
  }

  const lang = getLang();
  const title =
    lang === "en"
      ? "Featured"
      : lang === "ku"
      ? "هەڵبژاردەکان"
      : "قطع مميزة";

  wrap.innerHTML = `
    <div class="featuredHead"><div class="title">${title}</div></div>
    <div class="featuredRail">
      ${featured
        .map((p) => {
          const name = pickText(p, "name", getLang) || p._code;
          return `
            <div class="featuredCard" data-key="${p._key}">
              <div class="featuredImg"><img src="${safeText(p._cover)}" alt="" loading="lazy" decoding="async"></div>
              <div class="featuredBody">
                <div class="featuredName">${safeText(name)}</div>
                <div class="featuredMeta">
                  <span>${safeText(p._code)}</span>
                  <span>${safeText(p._priceText)}</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  wrap.querySelectorAll(".featuredCard").forEach((card) => {
    card.addEventListener("click", () => {
      const k = card.getAttribute("data-key");
      if (k) openModal(k);
    });
  });
}

/* =========================
   Hash open
========================= */
function tryOpenFromHash() {
  const h = safeText(location.hash);
  const m = h.match(/item=([^&]+)/);
  if (!m) return;

  const key = decodeURIComponent(m[1]);
  if (getByKey(key)) setTimeout(() => openModal(key, true), 50);
}

/* =========================
   Hero slider (same logic)
========================= */
function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  const track = document.getElementById("heroTrack");
  const dotsWrap = document.getElementById("heroDots");
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  if (total <= 1) return;

  const isRTL = () => (document.documentElement.dir || "").toLowerCase() === "rtl";

  dotsWrap.innerHTML = slides
    .map((_, i) => `<button type="button" aria-label="slide ${i + 1}"></button>`)
    .join("");

  const dots = Array.from(dotsWrap.querySelectorAll("button"));

  let idx = 0;
  let timer = null;

  const apply = () => {
    const x = idx * 100;
    track.style.transform = isRTL()
      ? `translateX(${x}%)`
      : `translateX(-${x}%)`;

    dots.forEach((d, di) => d.classList.toggle("is-active", di === idx));
  };

  const go = (i, user = false) => {
    idx = (i + total) % total;
    apply();
    if (user) restart();
  };

  const next = () => go(idx + 1);

  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, 4000);
  }

  dots.forEach((d, i) => d.addEventListener("click", () => go(i, true)));
  slider?.addEventListener("mouseenter", () => timer && clearInterval(timer));
  slider?.addEventListener("mouseleave", () => restart());

  go(0);
  restart();
  window.addEventListener("resize", apply);
}

/* =========================
   Events
========================= */
function bindEvents() {
  if (els.langSelect) {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) els.langSelect.value = saved;

    applyLangToDOM(getLang());
    els.langSelect.addEventListener("change", (e) => setLang(e.target.value || "ar"));
  }

  els.searchInput?.addEventListener("input", (e) => {
    state.q = e.target.value || "";
    renderGrid();
  });

  els.sortSelect?.addEventListener("change", (e) => {
    state.sort = e.target.value || "featured";
    renderGrid();
  });

  els.showSelect?.addEventListener("change", (e) => {
    state.show = e.target.value || "all";
    renderGrid();
  });

  els.chipsWrap?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;

    state.cat = btn.getAttribute("data-cat") || "all";
    localStorage.setItem(CAT_KEY, state.cat);
    renderAll();
  });

  els.productsGrid?.addEventListener("click", (e) => {
    const revealBtn = e.target.closest(".revealBtn");
    if (revealBtn) {
      e.preventDefault();
      e.stopPropagation();

      const media = revealBtn.closest(".tileMedia");
      if (!media) return;

      media.classList.add("is-revealed");
      return;
    }

    if (e.target.closest(".contentWarning")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const tile = e.target.closest(".tile");
    if (!tile) return;

    const key = tile.getAttribute("data-key");
    if (!key) return;

    if (e.target.closest(".favDot")) {
      toggleFav(key);
      window.HOA_SFX?.play("click");
      return;
    }

    openModal(key);
  });

  els.modalClose?.addEventListener("click", () => closeModal(true));
  els.modal?.addEventListener("click", (e) => {
    if (e.target === els.modal) closeModal(true);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && els.modal?.classList.contains("is-open")) {
      closeModal(true);
    }
  });

  function ensureBaseHistoryState() {
    const hasItem = /item=/.test(String(location.hash || ""));
    if (!hasItem && (!history.state || !history.state.storeBase)) {
      history.replaceState({ storeBase: true }, "", location.href);
    }
  }

  ensureBaseHistoryState();

  window.addEventListener("popstate", () => {
    const hasItem = /item=/.test(String(location.hash || ""));

    if (hasItem) {
      tryOpenFromHash();
      return;
    }

    if (els.modal?.classList.contains("is-open")) {
      closeModal(false);
    }
  });

  document.addEventListener("click", (e) => {
    const sim = e.target.closest(".similar-item");
    if (!sim) return;

    const k = sim.getAttribute("data-key");
    if (k) openModal(k);
  });
}

/* =========================
   Init
========================= */
function init() {
  try {
    bindEls();
    loadAR();
    loadFavs();
    hydrate();

    initPhoneInput();
    initHeroSlider();

    if (state.cat !== "all" && !CATEGORY_KEYS.includes(state.cat)) {
      state.cat = "all";
    }

    initCart();
    bindEvents();
    renderAll();
    tryOpenFromHash();

    if (window.emailjs && EMAILJS_PUBLIC_KEY) {
      try {
        if (typeof window.emailjs.init === "function") {
          try {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
          } catch {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
          }
        }
      } catch (e) {
        console.warn("EmailJS init failed:", e);
      }
    }
  } catch (err) {
    console.error("HOA script error:", err);

    try {
      if (els.emptyState) {
        els.emptyState.style.display = "block";
        els.emptyState.textContent = "JS Error — افتحي Console";
      }
    } catch {}
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* Fix product images sizing without needing refresh */
window.addEventListener("load", () => {
  document
    .querySelectorAll(".product-card img, .card img, .product img")
    .forEach((img) => {
      if (img.complete) return;

      img.addEventListener("load", () => {
        img.style.transform = "translateZ(0)";
        requestAnimationFrame(() => {
          img.style.transform = "";
        });
      });
    });
});

function findProductById(id) {
  const target = String(id || "").trim();

  return ALL.find((p) => {
    return (
      String(p.product_code || "").trim() === target ||
      String(p.code || "").trim() === target ||
      String(p.id || "").trim() === target ||
      String(p._code || "").trim() === target ||
      String(p._key || "").trim() === target
    );
  }) || null;
}

function getProductPriceNumber(product) {
  return getRawPrice(product);
}

/* =========================
   CART
========================= */

const CART_KEY = "hoa_cart_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const product = findProductById(productId);
  if (!product) return;

  const cart = getCart();
  const stableKey = String(
    product.product_code || product.code || product.id || product._code || product._key || ""
  ).trim();

  if (!stableKey) return;

  const exists = cart.some((item) => String(item.id || "").trim() === stableKey);

  if (exists) {
    if (typeof toast === "function") {
      toast("هذه القطعة موجودة بالفعل في السلة");
    }
    return;
  }

  cart.push({
    id: stableKey,
    qty: 1,
  });

  saveCart(cart);
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  const key = String(productId || "").trim();
  const cart = getCart().filter((item) => String(item.id || "").trim() !== key);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function getCartDetailedItems() {
  const cart = getCart();

  return cart
    .map((item) => {
      const product = findProductById(item.id);
      if (!product) return null;

      return {
        ...item,
        product,
        lineTotal: getProductPriceNumber(product) * (item.qty || 1),
      };
    })
    .filter(Boolean);
}

function renderCart() {
  const cartCountEl = document.getElementById("cartCount");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartCountEl || !cartItemsEl || !cartTotalEl) return;

  const items = getCartDetailedItems();
  const removeLabel = typeof t === "function" ? t("cart_remove") : "Remove";

  cartCountEl.textContent = String(items.length);

  if (!items.length) {
    const emptyText = typeof t === "function" ? t("cart_empty") : "السلة فارغة";
    cartItemsEl.innerHTML = `<div class="cartDrawer__empty">${emptyText}</div>`;
    cartTotalEl.textContent = "$0";
    return;
  }

  const total = items.reduce((sum, item) => {
    const val = Number(item?.lineTotal || 0);
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);

  cartTotalEl.textContent = `$${total.toLocaleString("en-US")}`;

  cartItemsEl.innerHTML = items
    .map((item) => {
      const p = item.product || {};

      const img =
        p.image ||
        p.image_url ||
        p.img ||
        p.thumbnail ||
        (Array.isArray(p.images) ? p.images[0] : "") ||
        "https://placehold.co/200x200?text=HOA";

      const title =
        (typeof pickText === "function" && typeof getLang === "function"
          ? pickText(p, "name", getLang)
          : null) ||
        p.title ||
        "Product";

      const code = p.product_code || p.code || p.id || "—";

      const priceNum = Number(getProductPriceNumber(p) || 0);
      const price =
        Number.isFinite(priceNum) && priceNum > 0
          ? `$${priceNum.toLocaleString("en-US")}`
          : "";

      const removeKey = p.product_code || p.code || p.id || "";

      return `
        <div class="cartItem">
          <div class="cartItem__media">
            <img src="${img}" alt="${title}">
          </div>

          <div class="cartItem__content">
            <div class="cartItem__title">${title}</div>
            <div class="cartItem__meta">${code}</div>
            <div class="cartItem__price">${price}</div>
          </div>

          <button
            class="cartItem__remove"
            type="button"
            data-remove-cart="${removeKey}"
            aria-label="${removeLabel}"
          >
            ×
          </button>
        </div>
      `;
    })
    .join("");

  cartItemsEl.querySelectorAll("[data-remove-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-remove-cart"));
    });
  });
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;

  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;

  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function initCart() {
  const cartToggle = document.getElementById("cartToggle");
  const cartClose = document.getElementById("cartClose");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartClearBtn = document.getElementById("cartClearBtn");
  const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");

  if (cartToggle) {
    cartToggle.addEventListener("click", openCart);
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", closeCart);
  }

  if (cartClearBtn) {
    cartClearBtn.addEventListener("click", clearCart);
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener("click", () => {
      const cart = getCart();

      if (!Array.isArray(cart) || cart.length === 0) {
        alert("السلة فارغة");
        return;
      }

      window.location.href = "order.html";
    });
  }

  renderCart();
}

})();