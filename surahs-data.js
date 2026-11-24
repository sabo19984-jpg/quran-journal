/* =========================================================
   Quran Study Journal (Para 17–30) — Surah index
   ---------------------------------------------------------
   SURAH_LIST    : basic info for all 94 surahs (21–114); juz = [first, last] Para.
   SURAH_CONTENT : filled on demand. Each surah's study notes
                   live in surahs/NNN.js and call registerSurah().
   Arabic text   : quran-arabic.js (QURAN_AR), generated from Tanzil.

   Content shape (surahs/NNN.js):
     registerSurah(N, {
       revelationNote, overview, context: [..],
       // short surahs — one card per ayah:
       ayahs: [{ translation, tafsir: [..] }, ..]
       // OR longer surahs — logical sections:
       sections: [{ title, from, to, translations: [..], tafsir: [..] }, ..]
       lessons: [..], vocabulary: [{ word, transliteration, root, meaning }],
       reflectionPrompts: [..],
       references: [{ label, url?, note? }]   // sources for context / hadith claims
     });
   ========================================================= */

const SURAH_LIST = [
  { number: 21, name: "Al-Anbiya", arabic: "الأنبياء", meaning: "Anbiya (Nabi)", revelation: "Makki", verses: 112, juz: [17,17] },
  { number: 22, name: "Al-Hajj", arabic: "الحج", meaning: "Hajj", revelation: "Makki/Madani (ikhtilaf)", verses: 78, juz: [17,17] },
  { number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", meaning: "Imaan Wale", revelation: "Makki", verses: 118, juz: [18,18] },
  { number: 24, name: "An-Nur", arabic: "النور", meaning: "Noor (Roshni)", revelation: "Madani", verses: 64, juz: [18,18] },
  { number: 25, name: "Al-Furqan", arabic: "الفرقان", meaning: "Haq o Baatil ki Kasauti", revelation: "Makki", verses: 77, juz: [18,19] },
  { number: 26, name: "Ash-Shu'ara", arabic: "الشعراء", meaning: "Shayar", revelation: "Makki", verses: 227, juz: [19,19] },
  { number: 27, name: "An-Naml", arabic: "النمل", meaning: "Cheentiyan", revelation: "Makki", verses: 93, juz: [19,20] },
  { number: 28, name: "Al-Qasas", arabic: "القصص", meaning: "Waqiaat / Qisse", revelation: "Makki", verses: 88, juz: [20,20] },
  { number: 29, name: "Al-'Ankabut", arabic: "العنكبوت", meaning: "Makdi", revelation: "Makki", verses: 69, juz: [20,21] },
  { number: 30, name: "Ar-Rum", arabic: "الروم", meaning: "Rumi (Romans)", revelation: "Makki", verses: 60, juz: [21,21] },
  { number: 31, name: "Luqman", arabic: "لقمان", meaning: "Luqman (Hakeem)", revelation: "Makki", verses: 34, juz: [21,21] },
  { number: 32, name: "As-Sajdah", arabic: "السجدة", meaning: "Sajda", revelation: "Makki/Madani (ikhtilaf)", verses: 30, juz: [21,21] },
  { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", meaning: "Lashkar / Giroh", revelation: "Madani", verses: 73, juz: [21,22] },
  { number: 34, name: "Saba", arabic: "سبإ", meaning: "Saba (Qaum)", revelation: "Makki", verses: 54, juz: [22,22] },
  { number: 35, name: "Fatir", arabic: "فاطر", meaning: "Paida Karne Wala", revelation: "Makki", verses: 45, juz: [22,22] },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya-Sin", revelation: "Makki", verses: 83, juz: [22,23] },
  { number: 37, name: "As-Saffat", arabic: "الصافات", meaning: "Saf Baandhne Wale", revelation: "Makki", verses: 182, juz: [23,23] },
  { number: 38, name: "Sad", arabic: "ص", meaning: "Saad (Harf)", revelation: "Makki", verses: 88, juz: [23,23] },
  { number: 39, name: "Az-Zumar", arabic: "الزمر", meaning: "Giroh dar Giroh", revelation: "Makki", verses: 75, juz: [23,24] },
  { number: 40, name: "Ghafir", arabic: "غافر", meaning: "Bakhshne Wala", revelation: "Makki", verses: 85, juz: [24,24] },
  { number: 41, name: "Fussilat", arabic: "فصلت", meaning: "Khol kar Bayan ki Gayi", revelation: "Makki", verses: 54, juz: [24,25] },
  { number: 42, name: "Ash-Shura", arabic: "الشورى", meaning: "Mashwara", revelation: "Makki", verses: 53, juz: [25,25] },
  { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", meaning: "Sone ki Sajawat", revelation: "Makki", verses: 89, juz: [25,25] },
  { number: 44, name: "Ad-Dukhan", arabic: "الدخان", meaning: "Dhuan", revelation: "Makki", verses: 59, juz: [25,25] },
  { number: 45, name: "Al-Jathiyah", arabic: "الجاثية", meaning: "Ghutnon ke Bal Girne Wali", revelation: "Makki", verses: 37, juz: [25,25] },
  { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", meaning: "Ret ke Teele", revelation: "Makki", verses: 35, juz: [26,26] },
  { number: 47, name: "Muhammad", arabic: "محمد", meaning: "Muhammad ﷺ", revelation: "Madani", verses: 38, juz: [26,26] },
  { number: 48, name: "Al-Fath", arabic: "الفتح", meaning: "Fatah", revelation: "Madani", verses: 29, juz: [26,26] },
  { number: 49, name: "Al-Hujurat", arabic: "الحجرات", meaning: "Hujre (Kamre)", revelation: "Madani", verses: 18, juz: [26,26] },
  { number: 50, name: "Qaf", arabic: "ق", meaning: "Qaaf (Harf)", revelation: "Makki", verses: 45, juz: [26,26] },
  { number: 51, name: "Adh-Dhariyat", arabic: "الذاريات", meaning: "Bikherne Wali Hawayein", revelation: "Makki", verses: 60, juz: [26,27] },
  { number: 52, name: "At-Tur", arabic: "الطور", meaning: "Tur Pahad", revelation: "Makki", verses: 49, juz: [27,27] },
  { number: 53, name: "An-Najm", arabic: "النجم", meaning: "Sitara", revelation: "Makki", verses: 62, juz: [27,27] },
  { number: 54, name: "Al-Qamar", arabic: "القمر", meaning: "Chaand", revelation: "Makki", verses: 55, juz: [27,27] },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "Nihayat Meharban", revelation: "Makki/Madani (ikhtilaf)", verses: 78, juz: [27,27] },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", meaning: "Hone Wala Waqia", revelation: "Makki", verses: 96, juz: [27,27] },
  { number: 57, name: "Al-Hadid", arabic: "الحديد", meaning: "Loha", revelation: "Madani", verses: 29, juz: [27,27] },
  { number: 58, name: "Al-Mujadilah", arabic: "المجادلة", meaning: "Behes Karne Wali", revelation: "Madani", verses: 22, juz: [28,28] },
  { number: 59, name: "Al-Hashr", arabic: "الحشر", meaning: "Ikattha Karna (Jalawatni)", revelation: "Madani", verses: 24, juz: [28,28] },
  { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", meaning: "Jaanchi Jane Wali", revelation: "Madani", verses: 13, juz: [28,28] },
  { number: 61, name: "As-Saff", arabic: "الصف", meaning: "Saf", revelation: "Madani", verses: 14, juz: [28,28] },
  { number: 62, name: "Al-Jumu'ah", arabic: "الجمعة", meaning: "Jumu'ah", revelation: "Madani", verses: 11, juz: [28,28] },
  { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", meaning: "Munafiq", revelation: "Madani", verses: 11, juz: [28,28] },
  { number: 64, name: "At-Taghabun", arabic: "التغابن", meaning: "Haar Jeet ka Din", revelation: "Madani/Makki (ikhtilaf)", verses: 18, juz: [28,28] },
  { number: 65, name: "At-Talaq", arabic: "الطلاق", meaning: "Talaq", revelation: "Madani", verses: 12, juz: [28,28] },
  { number: 66, name: "At-Tahrim", arabic: "التحريم", meaning: "Haraam Kar Lena", revelation: "Madani", verses: 12, juz: [28,28] },
  { number: 67, name: "Al-Mulk", arabic: "الملك", meaning: "Badshahat", revelation: "Makki", verses: 30, juz: [29,29] },
  { number: 68, name: "Al-Qalam", arabic: "القلم", meaning: "Qalam", revelation: "Makki", verses: 52, juz: [29,29] },
  { number: 69, name: "Al-Haqqah", arabic: "الحاقة", meaning: "Saabit Hone Wali", revelation: "Makki", verses: 52, juz: [29,29] },
  { number: 70, name: "Al-Ma'arij", arabic: "المعارج", meaning: "Charhne ki Seedhiyan", revelation: "Makki", verses: 44, juz: [29,29] },
  { number: 71, name: "Nuh", arabic: "نوح", meaning: "Nuh (as)", revelation: "Makki", verses: 28, juz: [29,29] },
  { number: 72, name: "Al-Jinn", arabic: "الجن", meaning: "Jinn", revelation: "Makki", verses: 28, juz: [29,29] },
  { number: 73, name: "Al-Muzzammil", arabic: "المزمل", meaning: "Kapde mein Lipatne Wale", revelation: "Makki", verses: 20, juz: [29,29] },
  { number: 74, name: "Al-Muddaththir", arabic: "المدثر", meaning: "Chadar Odhne Wale", revelation: "Makki", verses: 56, juz: [29,29] },
  { number: 75, name: "Al-Qiyamah", arabic: "القيامة", meaning: "Qayamat", revelation: "Makki", verses: 40, juz: [29,29] },
  { number: 76, name: "Al-Insan", arabic: "الانسان", meaning: "Insaan", revelation: "Makki/Madani (ikhtilaf)", verses: 31, juz: [29,29] },
  { number: 77, name: "Al-Mursalat", arabic: "المرسلات", meaning: "Bheji Jane Wali Hawayein", revelation: "Makki", verses: 50, juz: [29,29] },
  { number: 78,  name: "An-Naba",       arabic: "النبأ",     meaning: "Badi Khabar",              revelation: "Makki",  verses: 40 },
  { number: 79,  name: "An-Nazi'at",    arabic: "النازعات",  meaning: "Kheench Nikalne Wale",     revelation: "Makki",  verses: 46 },
  { number: 80,  name: "'Abasa",        arabic: "عبس",       meaning: "Teyori Chadhai",           revelation: "Makki",  verses: 42 },
  { number: 81,  name: "At-Takwir",     arabic: "التكوير",   meaning: "Lapet Dena",               revelation: "Makki",  verses: 29 },
  { number: 82,  name: "Al-Infitar",    arabic: "الانفطار",  meaning: "Phat Jana",                revelation: "Makki",  verses: 19 },
  { number: 83,  name: "Al-Mutaffifin", arabic: "المطففين",  meaning: "Naap Tol Mein Kami Karne Wale", revelation: "Makki (ikhtilaf)", verses: 36 },
  { number: 84,  name: "Al-Inshiqaq",   arabic: "الانشقاق",  meaning: "Shaq Ho Jana",             revelation: "Makki",  verses: 25 },
  { number: 85,  name: "Al-Buruj",      arabic: "البروج",    meaning: "Burjon Wala Aasman",       revelation: "Makki",  verses: 22 },
  { number: 86,  name: "At-Tariq",      arabic: "الطارق",    meaning: "Raat Ko Aane Wala",        revelation: "Makki",  verses: 17 },
  { number: 87,  name: "Al-A'la",       arabic: "الأعلى",    meaning: "Sab Se Buland",            revelation: "Makki",  verses: 19 },
  { number: 88,  name: "Al-Ghashiyah",  arabic: "الغاشية",   meaning: "Chha Jane Wali",           revelation: "Makki",  verses: 26 },
  { number: 89,  name: "Al-Fajr",       arabic: "الفجر",     meaning: "Subah Ka Waqt",            revelation: "Makki",  verses: 30 },
  { number: 90,  name: "Al-Balad",      arabic: "البلد",     meaning: "Shehar",                   revelation: "Makki",  verses: 20 },
  { number: 91,  name: "Ash-Shams",     arabic: "الشمس",     meaning: "Suraj",                    revelation: "Makki",  verses: 15 },
  { number: 92,  name: "Al-Layl",       arabic: "الليل",     meaning: "Raat",                     revelation: "Makki",  verses: 21 },
  { number: 93,  name: "Ad-Duha",       arabic: "الضحى",     meaning: "Chasht Ka Waqt",           revelation: "Makki",  verses: 11 },
  { number: 94,  name: "Ash-Sharh",     arabic: "الشرح",     meaning: "Seena Khol Dena",          revelation: "Makki",  verses: 8 },
  { number: 95,  name: "At-Tin",        arabic: "التين",     meaning: "Anjeer",                   revelation: "Makki",  verses: 8 },
  { number: 96,  name: "Al-'Alaq",      arabic: "العلق",     meaning: "Jama Hua Khoon",           revelation: "Makki",  verses: 19 },
  { number: 97,  name: "Al-Qadr",       arabic: "القدر",     meaning: "Qadr Wali Raat",           revelation: "Makki",  verses: 5 },
  { number: 98,  name: "Al-Bayyinah",   arabic: "البينة",    meaning: "Wazeh Daleel",             revelation: "Madani", verses: 8 },
  { number: 99,  name: "Az-Zalzalah",   arabic: "الزلزلة",   meaning: "Zalzala",                  revelation: "Madani", verses: 8 },
  { number: 100, name: "Al-'Adiyat",    arabic: "العاديات",  meaning: "Daudne Wale Ghode",        revelation: "Makki",  verses: 11 },
  { number: 101, name: "Al-Qari'ah",    arabic: "القارعة",   meaning: "Khatkhatane Wali",         revelation: "Makki",  verses: 11 },
  { number: 102, name: "At-Takathur",   arabic: "التكاثر",   meaning: "Zyada Ki Hawas",           revelation: "Makki",  verses: 8 },
  { number: 103, name: "Al-'Asr",       arabic: "العصر",     meaning: "Zamana",                   revelation: "Makki",  verses: 3 },
  { number: 104, name: "Al-Humazah",    arabic: "الهمزة",    meaning: "Aib Lagane Wala",          revelation: "Makki",  verses: 9 },
  { number: 105, name: "Al-Fil",        arabic: "الفيل",     meaning: "Haathi",                   revelation: "Makki",  verses: 5 },
  { number: 106, name: "Quraysh",       arabic: "قريش",      meaning: "Quraish Qabeela",          revelation: "Makki",  verses: 4 },
  { number: 107, name: "Al-Ma'un",      arabic: "الماعون",   meaning: "Chhoti Chhoti Cheezein",   revelation: "Makki",  verses: 7 },
  { number: 108, name: "Al-Kawthar",    arabic: "الكوثر",    meaning: "Khair-e-Kaseer",           revelation: "Makki (ikhtilaf)",  verses: 3 },
  { number: 109, name: "Al-Kafirun",    arabic: "الكافرون",  meaning: "Inkar Karne Wale",         revelation: "Makki",  verses: 6 },
  { number: 110, name: "An-Nasr",       arabic: "النصر",     meaning: "Madad",                    revelation: "Madani", verses: 3 },
  { number: 111, name: "Al-Masad",      arabic: "المسد",     meaning: "Bati Hui Rassi",           revelation: "Makki",  verses: 5 },
  { number: 112, name: "Al-Ikhlas",     arabic: "الإخلاص",   meaning: "Khalis Tauheed",           revelation: "Makki",  verses: 4 },
  { number: 113, name: "Al-Falaq",      arabic: "الفلق",     meaning: "Subah Ki Roshni",          revelation: "Makki (ikhtilaf)",  verses: 5 },
  { number: 114, name: "An-Nas",        arabic: "الناس",     meaning: "Insaan / Log",             revelation: "Makki (ikhtilaf)",  verses: 6 }
];

/* Para (Juz) start points for Para 17–30 — checked against quran.com verse metadata (juz_number). */
const PARA_LIST = [
  { number: 17, name: "Iqtaraba lin-naas", start: "21:1" },
  { number: 18, name: "Qad aflaha", start: "23:1" },
  { number: 19, name: "Wa qaalal-ladheena", start: "25:21" },
  { number: 20, name: "Amman khalaqa", start: "27:56" },
  { number: 21, name: "Utlu ma oohiya", start: "29:46" },
  { number: 22, name: "Wa man yaqnut", start: "33:31" },
  { number: 23, name: "Wa maliya", start: "36:28" },
  { number: 24, name: "Faman azlamu", start: "39:32" },
  { number: 25, name: "Ilaihi yuraddu", start: "41:47" },
  { number: 26, name: "Ha Meem", start: "46:1" },
  { number: 27, name: "Qaala fama khatbukum", start: "51:31" },
  { number: 28, name: "Qad sami'allahu", start: "58:1" },
  { number: 29, name: "Tabarakal-ladhi", start: "67:1" },
  { number: 30, name: "'Amma yatasaa-aloon", start: "78:1" }
];

/* Content status per surah (used by the sidebar, header and filters):
     "ready" — every hadith citation checked on sunnah.com (number, wording, grade);
               tafsir attributions found in Ibn Kathir / Ma'arif al-Qur'an (English, quran.com);
               translation compared with Sahih International. Anything that could not be
               verified is labelled inside the notes. Scholarly review of the Roman Urdu is
               still pending for all surahs (see each surah's "Ehtiyat" reference).
     "partial" — every hadith citation and every attributed tafsir claim checked, BUT the
               notes also contain unattributed explanatory points (the project's own simple
               wazahat) that were not individually checked against a tafsir.
     "draft" — written, but references NOT yet verified; shown with a warning
     (missing) — no notes yet → "Coming Soon"

   Second independent audit (2026-11-24): only Surah 103 had every tafsir point sourced or
   labelled, so only 103 was "ready"; all others were "partial".

   Final scholarly verification (2026-11-24): every tafsir/context point in surahs 78–102
   and 104–114 was read against the Ibn Kathir passage for its ayat (and Ma'arif al-Qur'an
   where cited), then attributed, relabelled (Lughavi nukta / hamari wazahat / Ghaur /
   Amali sabaq), corrected or removed. No unlabelled point remains, so all 37 are "ready".
   Remaining limitations (English translations of the tafsirs, earlier mufassireen quoted
   through Ibn Kathir, no scholar review of the Roman Urdu) are stated in each surah's
   "Ehtiyat" reference and in the Verified notice.                                */
const SURAH_STATUS = {};
for (let n = 78; n <= 114; n++) SURAH_STATUS[n] = "ready";

/* Para 17–30 extension (Surahs 21–77, 2026-11-24): a surah gets a status only once its
   notes file exists. "partial" = every tafsir point attributed to Ibn Kathir / Ma'arif or
   labelled, BUT hadith numbers/wording quoted via Ibn Kathir were not separately checked on
   sunnah.com and the Roman Urdu has had no scholar review. Surahs without notes stay
   unlisted here and show "Coming Soon". */
const EXT_PARTIAL = [21];
EXT_PARTIAL.forEach((n) => { SURAH_STATUS[n] = "partial"; });

const SURAH_CONTENT = {};

function registerSurah(number, data) {
  SURAH_CONTENT[number] = data;
}
