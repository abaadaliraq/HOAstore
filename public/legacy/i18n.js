/* i18n.js - House of Antiques (AR/EN/KU)
   - Lightweight i18n helper (no libs)
   - Translates:
     [data-i18n] textContent
     [data-i18n-html] innerHTML
     [data-i18n-placeholder] placeholder
     [data-i18n-title] title
     [data-i18n-aria] aria-label
     [data-i18n-alt] alt
     option[data-i18n] textContent

   Usage:
     I18N.setLang('ar'|'en'|'ku')
     I18N.t('key')
*/

(function () {
  "use strict";

  const STORAGE_KEY = "hoa_lang";
  const SUPPORTED = ["ar", "en", "ku"];

  const DICT = {
    ar: {
      page_title: "بيت التحفيات | متجر التحف",
      store_name: "متجر بيت التحفيات",
      store_sub: "متجر التحف والقطع النادرة",
      hero_title: "اقتني قطعة تروي تاريخ",
      hero_desc: "اكتشف تحفنا: سجاد، اكسسوارات، فضة، نحاس، أعمال فنية، كريستال...",
      search_placeholder: "ابحث باسم القطعة أو الكود...",

      theme_toggle: "تبديل المظهر",
      lang_label: "اللغة",
      lang_ar: "AR",
      lang_en: "EN",
      lang_ku: "KU",

      categories: "التصنيفات",
      auction_info: "معلومات المزاد",
      store_items_count: "قطع المتجر",
      auction_items_count: "قطع المزاد القادم",
      view_auction: "استعرض قطع المزاد",
      auction_note_1: "يتم تحديث القطع المشاركة باستمرار",
      auction_note_2: "قائمة المزاد تتحدث حسب تجهيز القطع.",

      available_items: "القطع المتاحة",
      sort_label: "الترتيب",
      show_label: "عرض",
      show_all: "الكل",
      show_favorites: "المفضلة",
      sort_featured: "مميز",
      sort_newest: "الأحدث",
      sort_price_asc: "السعر:من الاقل للاعلى ",
      sort_price_desc: "السعر:من الأعلى للاقل",

      badge_auction: "مزاد",
      status_available: "متوفرة",
      status_reserved: "محجوزة للمعاينة",
      status_sold: "انتقلت لمقتنٍ",
      sold: "مباعة",

      btn_details: "تفاصيل",
      btn_order: "اطلب",
      fav_on: "❤️ في المفضلة",
      fav_off: "♡ إضافة للمفضلة",

      no_results: "لا يوجد نتائج",
      try_filter: "جرّب تبدّيل التصنيف أو تقليل كلمات البحث.",
      results_count: "نتيجة",
      results_count_plural: "نتائج",

      copied_link: "تم نسخ رابط القطعة ✅",
      cannot_copy: "تعذر النسخ تلقائياً. انسخ الرابط يدوياً.",

      close: "إغلاق",
      item_image_alt: "صورة القطعة",
      more_images: "صور إضافية",

      code_label: "الكود",
      price_label: "السعر",

      tab_details: "تفاصيل",
      tab_order: "اطلب",
      info_tabs: "تبويبات المعلومات",

      share_item: "مشاركة القطعة",
      share_whatsapp: "مشاركة واتساب",
      copy_link: "نسخ الرابط",
      share: "مشاركة",

      similar_suggestions: "اقتراحات مشابهة",

      customer_data: "بيانات الزبون",
      full_name: "الاسم الكامل",
      phone: "رقم الهاتف",
      governorate: "المحافظة",
      area: "المنطقة",
      nearest_landmark: "أقرب نقطة دالة",
      notes_optional: "ملاحظات (اختياري)",
      order_whatsapp: "ارسل الطلب",
      copy_order_details: "نسخ تفاصيل الطلب",

      ph_full_name: "مثال: طارق محمد علي",
      ph_phone: "07xxxxxxxxx",
      ph_governorate: "مثال: بغداد",
      ph_area: "مثال: أبو نؤاس",
      ph_landmark: "مثال: قرب مجمع كورنيش أبو نؤاس",
      ph_notes: "مثال: أريد معاينة القطعة / تغليف هدية...",

      mobile_order: "اطلب الآن",

      footer_brand: "بيت التحفيات",
      footer_link_title: "House of Antiques",
      footer_tagline: "بغداد - أبو نؤاس / للذاكرة، للتوثيق، وللأثر",

      // Auction page
      auction_page_title: "بيت التحفيات | المزاد",
      auction_title: "قطع المزاد",
      back_to_store: "الرجوع للمتجر",
      auction_hint: "هذه القائمة تخص القطع المشاركة في المزاد فقط.",

            // Validation / Alerts
      alert_missing_fields: "يرجى إكمال الحقول المطلوبة.",
      alert_missing_name: "الاسم الكامل مطلوب.",
      alert_missing_phone: "رقم الهاتف مطلوب.",
      alert_missing_gov: "المحافظة مطلوبة.",
      alert_missing_area: "المنطقة مطلوبة.",
      alert_missing_landmark: "أقرب نقطة دالة مطلوبة.",
      sending: "جارٍ إرسال الطلب...",
      email_sent: "تم إرسال الطلب إلى البريد بنجاح ✅",
      email_failed: "تعذر إرسال الإيميل، سيتم المتابعة عبر واتساب.",
       cart_title: "السلة",
    cart_empty: "السلة فارغة",
    cart_total: "المجموع",
    cart_checkout: "إتمام الطلب",
    cart_clear: "تفريغ السلة",
    cart_remove: "حذف",
    product: "منتج",

    },

   

    en: {
      page_title: "House of Antiques | Store",
      store_name: "House of Antiques Store",
      store_sub: "Antiques & rare items store",
      hero_title: "Own a piece of history",
      hero_desc: "Explore: rugs, accessories, silver, copper, artworks, crystal...",
      search_placeholder: "Search by item name or code...",

      theme_toggle: "Toggle theme",
      lang_label: "Language",
      lang_ar: "AR",
      lang_en: "EN",
      lang_ku: "KU",

      categories: "Categories",
      auction_info: "Auction info",
      store_items_count: "Store items",
      auction_items_count: "Upcoming auction items",
      view_auction: "View auction items",
      auction_note_1: "Items are updated continuously",
      auction_note_2: "Auction list updates as items are prepared.",

      available_items: "Available items",
      sort_label: "Sort",
      show_label: "Show",
      show_all: "All",
      show_favorites: "Favorites",
      sort_featured: "Featured",
      sort_newest: "Newest",
      sort_price_asc: "Price: Low to High",
      sort_price_desc: "Price: High to Low",

      badge_auction: "Auction",
      status_available: "Available",
      status_reserved: "Reserved for viewing",
      status_sold: "Collected",
      sold: "Sold",

      btn_details: "Details",
      btn_order: "Order",
      fav_on: "❤️ Saved",
      fav_off: "♡ Save",

      no_results: "No results",
      try_filter: "Try changing the category or reducing your search keywords.",
      results_count: "result",
      results_count_plural: "results",

      copied_link: "Item link copied ✅",
      cannot_copy: "Couldn’t copy automatically. Please copy the link manually.",

      close: "Close",
      item_image_alt: "Item image",
      more_images: "More images",

      code_label: "Code",
      price_label: "Price",

      tab_details: "Details",
      tab_order: "Order",
      info_tabs: "Information tabs",

      share_item: "Share item",
      share_whatsapp: "Share WhatsApp",
      copy_link: "Copy link",
      share: "Share",

      similar_suggestions: "Similar suggestions",

      customer_data: "Customer details",
      full_name: "Full name",
      phone: "Phone",
      governorate: "Governorate",
      area: "Area",
      nearest_landmark: "Nearest landmark",
      notes_optional: "Notes (optional)",
      order_whatsapp: "send order",
      copy_order_details: "Copy order details",

      ph_full_name: "Example: Tariq Mohammed Ali",
      ph_phone: "07xxxxxxxxx",
      ph_governorate: "Example: Baghdad",
      ph_area: "Example: Abu Nuwas",
      ph_landmark: "Example: Near Abu Nuwas Corniche",
      ph_notes: "Example: I want to view the item / gift wrap...",

      mobile_order: "Order now",

      footer_brand: "House of Antiques",
      footer_link_title: "House of Antiques",
      footer_tagline: "Baghdad - Abu Nuwas / memory, documentation, and legacy",

      auction_page_title: "House of Antiques | Auction",
      auction_title: "Auction items",
      back_to_store: "Back to store",
      auction_hint: "This list includes auction items only.",

            // Validation / Alerts
      alert_missing_fields: "Please complete the required fields.",
      alert_missing_name: "Full name is required.",
      alert_missing_phone: "Phone number is required.",
      alert_missing_gov: "Governorate is required.",
      alert_missing_area: "Area is required.",
      alert_missing_landmark: "Nearest landmark is required.",
      sending: "Sending your order...",
      email_sent: "Order email sent successfully ✅",
      email_failed: "Couldn’t send email. We’ll continue via WhatsApp.",
      
      cart_title: "Cart",
      cart_empty: "Your cart is empty",
      cart_total: "Total",
      cart_checkout: "Checkout",
      cart_clear: "Clear cart",
      cart_remove: "Remove",
      product: "Product",

    },

      cart_title: "Cart",
      cart_empty: "Your cart is empty",
      cart_total: "Total",
      cart_checkout: "Checkout",
      cart_clear: "Clear cart",
      cart_remove: "Remove",
      product: "Product",
    ku: {
      // Kurdish (Sorani) – basic UI (RTL)
      page_title: "خانەی کۆنەکان | فرۆشگا",
      store_name: "فرۆشگای خانەی کۆنەکان",
      store_sub: "فرۆشگای کۆنەکان و شتە دەگمەنەکان",
      hero_title: "پارچەیەک لە مێژوو بەدەست بهێنە",
      hero_desc: "بگەڕێ بۆ: قالی، ئێکسسوار، زیو، مس، کاری هونەری، کریستال...",
      search_placeholder: "گەڕان بە ناوی شت یان کۆد...",

      theme_toggle: "گۆڕینی ڕووکار",
      lang_label: "زمان",
      lang_ar: "AR",
      lang_en: "EN",
      lang_ku: "KU",

      categories: "پۆلەکان",
      auction_info: "زانیاری مزاد",
      store_items_count: "شتەکانی فرۆشگا",
      auction_items_count: "شتەکانی مزادی داهاتوو",
      view_auction: "بینینی شتەکانی مزاد",
      auction_note_1: "شتەکان بەردەوام نوێ دەکرێنەوە",
      auction_note_2: "لیستی مزاد بە پێی ئامادەکردن نوێ دەبێتەوە.",

      available_items: "شتە بەردەستەکان",
      sort_label: "ڕیزکردن",
      show_label: "پیشاندان",
      show_all: "هەموو",
      show_favorites: "دڵخوازەکان",
      sort_featured: "دیاریکراو",
      sort_newest: "نوێترین",
      sort_price_asc: "نرخ: لە کەم بۆ زۆر",
      sort_price_desc: "نرخ: لە زۆر بۆ کەم",

      badge_auction: "مزاد",
      status_available: "بەردەست",
      status_reserved: "گیراو بۆ بینین",
      status_sold: "گەیاندراو",
      sold: "فرۆشراو",

      btn_details: "وردەکاری",
      btn_order: "داواکردن",
      fav_on: "❤️ دڵخواز",
      fav_off: "♡ زیادکردن بۆ دڵخواز",

      no_results: "هیچ ئەنجامێک نییە",
      try_filter: "پۆل بگۆڕە یان وشەکانی گەڕان کەم بکە.",
      results_count: "ئەنجام",
      results_count_plural: "ئەنجام",

      copied_link: "بەستەری شت کۆپی کرا ✅",
      cannot_copy: "کۆپی نەکرا. تکایە بە دەستی کۆپی بکە.",

      close: "داخستن",
      item_image_alt: "وێنەی شت",
      more_images: "وێنەی زیاتەر",

      code_label: "کۆد",
      price_label: "نرخ",

      tab_details: "وردەکاری",
      tab_order: "داواکردن",
      info_tabs: "تابی زانیاری",

      share_item: "هاوبەشی کردن",
      share_whatsapp: "هاوبەشی واتساپ",
      copy_link: "کۆپی بەستەر",
      share: "هاوبەش",

      similar_suggestions: "پێشنیاری هاوشێوە",

      customer_data: "زانیاری کڕیار",
      full_name: "ناوی تەواو",
      phone: "ژمارەی تەلەفۆن",
      governorate: "پارێزگا",
      area: "ناوچە",
      nearest_landmark: "نزیکترین نیشانە",
      notes_optional: "تێبینی (ئارەزوومەندانە)",
      order_whatsapp: "داواکاری بنێرە",
      copy_order_details: "کۆپی وردەکاری داواکاری",

      ph_full_name: "نموونە: طارق محمد علي",
      ph_phone: "07xxxxxxxxx",
      ph_governorate: "نموونە: بەغدا",
      ph_area: "نموونە: ئەبو نؤاس",
      ph_landmark: "نموونە: نزیک کۆرنیشی ئەبو نؤاس",
      ph_notes: "نموونە: دەمەوێت ببینم / پاکێتی هەدیە...",

      mobile_order: "ئێستا داوا بکە",

      footer_brand: "خانەی کۆنەکان",
      footer_link_title: "House of Antiques",
      footer_tagline: "بەغدا - ئەبو نؤاس / بۆ بیرکردنەوە، تۆمارکردن، و ئاثر",

      auction_page_title: "خانەی کۆنەکان | مزاد",
      auction_title: "شتەکانی مزاد",
      back_to_store: "گەڕانەوە بۆ فرۆشگا",
      auction_hint: "ئەم لیستە تەنها شتەکانی مزادە.",
      
      cart_title: "سەبەتە",
      cart_empty: "سەبەتەکەت بەتاڵە",
      cart_total: "کۆی گشتی",
      cart_checkout: "تەواوکردنی داوا",
      cart_clear: "بەتاڵکردنی سەبەتە",
      cart_remove: "سڕینەوە",
      product: "بەرهەم",

            // Validation / Alerts
      alert_missing_fields: "تکایە خانە پێویستەکان پڕ بکە.",
      alert_missing_name: "ناوی تەواو پێویستە.",
      alert_missing_phone: "ژمارەی تەلەفۆن پێویستە.",
      alert_invalid_phone: "ژمارەی تەلەفۆن هەڵەیە. تکایە ژمارەی عێراقی دروست بنووسە.",
      alert_missing_gov: "پارێزگا پێویستە.",
      alert_missing_area: "ناوچە پێویستە.",
      alert_missing_landmark: "نزیکترین نیشانە پێویستە.",
      sending: "داواکاری دەنیردرێت...",
      email_sent: "داواکاری بە سەرکەوتوویی نێردرا ✅",
      email_failed: "نەتوانرا ئیمەیڵ بنێردرێت، بە واتساپ بەردەوام دەبین."

    }
  };

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved && DICT[saved]) ? saved : "ar";
  }

  function setRoot(lang) {
    document.documentElement.lang = lang;
    // Kurdish Sorani is RTL in Arabic script
    document.documentElement.dir = (lang === "en") ? "ltr" : "rtl";
  }

  function t(key, fallback = "") {
    const lang = getLang();
    const v = DICT[lang] && DICT[lang][key];
    return (v != null) ? v : fallback;
  }

  function applyToDOM(lang) {
    setRoot(lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = DICT[lang]?.[key];
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = DICT[lang]?.[key];
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = DICT[lang]?.[key];
      if (val != null) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const val = DICT[lang]?.[key];
      if (val != null) el.setAttribute("title", val);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = DICT[lang]?.[key];
      if (val != null) el.setAttribute("aria-label", val);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      const val = DICT[lang]?.[key];
      if (val != null) el.setAttribute("alt", val);
    });

    document.querySelectorAll("option[data-i18n]").forEach((opt) => {
      const key = opt.getAttribute("data-i18n");
      const val = DICT[lang]?.[key];
      if (val != null) opt.textContent = val;
    });

    // sync language selector if present
    const sel = document.getElementById("langSelect");
    if (sel && sel.value !== lang) sel.value = lang;

    // update lang badge button if present
    const badge = document.getElementById("langBadge");
    if (badge) badge.textContent = (lang === "ar") ? DICT.ar.lang_ar : (lang === "en") ? DICT.en.lang_en : DICT.ku.lang_ku;
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = "ar";
    localStorage.setItem(STORAGE_KEY, lang);
    applyToDOM(lang);

    // re-render dynamic UI (cards/chips/etc.)
    if (typeof window.renderAll === "function") window.renderAll();
  }

  window.I18N = { DICT, getLang, setLang, apply: applyToDOM, t };

  document.addEventListener("DOMContentLoaded", () => {
    applyToDOM(getLang());

    const sel = document.getElementById("langSelect");
    if (sel) {
      sel.value = getLang();
      sel.addEventListener("change", (e) => setLang(e.target.value));
    }
  });
})();