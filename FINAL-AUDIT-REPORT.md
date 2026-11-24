# Juz Amma Study Notes Journal — Final Scholarly Verification Report

**Date:** 2026-11-24 · **Baseline:** `2026-11-24_005019_second-audit-corrected-project.zip` (byte-identical to `D:\quran-journal` before work began)

## 1. Summary

| Item | Result |
|---|---|
| Surahs audited | 37 (78–114) |
| Verified | **37** (103 was already Verified; 36 upgraded from Partially Verified) |
| Partially Verified | 0 |
| Draft | 0 |
| Tafsir/context points in the journal | 539 |
| Previously unattributed points (36 Surahs) | 338 |
| …now carrying a specific source attribution | 319 |
| …now labelled only (reflection / practical lesson / lughavi / "hamari wazahat") | 19 |
| Points across the journal carrying a Ghaur (reflection) or Amali sabaq (istinbaat) label | 77 |
| Previously attributed points re-worded or corrected | 35 (142 kept unchanged) |
| Substantive corrections / disclosures logged | 51 (see §4) |
| Unsupported sub-claims removed | 6 |
| Translation corrections | 3 |
| New Hadith citations added (verified on sunnah.com) | 3 |
| Arabic SHA-256 before / after | `7dd5f43578bee0bd87165db3d4839c02be02ea8e709160d7cea723302aa4d120` / identical |

## 2. Method

1. Every tafsir and context point in Surahs 78–102 and 104–114 was read next to the Tafsir Ibn Kathir passage for the same ayat (quran.com English, abridged). Ma'arif al-Qur'an (Mufti Muhammad Shafi', English, quran.com) was searched for every point that cites it, and for points Ibn Kathir does not cover.
2. Each point was then attributed, relabelled, corrected or removed:
   - **Source-based:** `(Ibn Kathir)` or `(Ma'arif al-Qur'an)`, naming the earlier authority (Ibn Abbas, Mujahid, Qatadah…). Views of Ibn Jarir al-Tabari are marked as reported *through Ibn Kathir*. Tabari was not consulted directly.
   - **Direct Qur'anic:** "ayat ke alfaaz se".
   - **Linguistic:** "Lughavi nukta".
   - **Own explanation:** "hamari wazahat".
   - **Reflection / practical inference:** "Ghaur (reflection, tafsir nahi)" or "Amali sabaq (istinbaat)".
   - **Scholarly differences:** listed with the scholar for each view.
   - **Historical reports:** ungraded or disputed accounts are marked as such ("darja bayan nahi", or the differing accounts are shown side by side).
3. Surah 103 was not modified (byte-identical to baseline).

## 3. Hadith

- All existing citations still map to a sunnah.com reference (90 collection+number mentions; automated check).
- Second-audit corrections preserved byte-for-byte: Bukhari 4950 wording (93), Muslim 2958 narrator (102), Bukhari 3 (96).
- Weak narrations unchanged and still labelled: Tirmidhi 2429 (Da'if), Tirmidhi 3364 (Da'if). Abu Dawud 869 is still excluded; it appears only in the note explaining why.
- New citations, each read on sunnah.com:
  - Sahih Muslim 8a and Sahih al-Bukhari 50 (Hadith of Jibreel, "the one asked knows no more than the questioner") for 79:42–44.
  - Sahih Muslim 1017a ("good precedent in Islam") for 82:5, as cited by Ma'arif.
- Narrations that Ibn Kathir or Ma'arif quote without a grading are marked "darja bayan nahi" and are not presented as authentic.
- No existing citation needed a number or wording correction in this pass.

## 4. Corrections and disclosures

### Translation (Tarjuma)
- **81:7:** "roohein (jismon se) jod di jayengi" → "jaanein (nufoos) jod di jayengi". The interpretive gloss was removed. Ibn Kathir explains it as souls being joined with their peers.
- **98:3:** "durust (mazboot) ahkaam" → "seedhi, durust tehreerein (kutub)" (kutubun qayyimah).
- **101:5:** "rangeen oon" → "oon". Ibn Kathir and Sahih International both say wool, with no colour.

### Misattribution or wrong weighting
- **78:40:** the "animals become dust" explanation had been presented as Ibn Kathir's. His primary explanation is the disbeliever wishing he had never been created; the animals view he only introduces as "it has been said".
- **82:6:** "a loving question" → Ibn Kathir explicitly calls it a threat, while Ma'arif calls it a gentle rebuke. Both are now shown.
- **92:21:** "Allah will be pleased with him" → per Ibn Kathir (and the translation), *the person* will be pleased.

### Unsupported sub-claims removed or relocated
- Mid-Makkan / early-Makkan dating notes (78, 80, 81).
- "Their question was mockery" (79:42).
- "He flees lest they claim their rights" (80:34–36).
- "They called the Qur'an satanic speech" (81 context, now grounded in 15:6 / 68:51).
- The "souls joined to bodies" aside (81:7).
- "Without pillars" moved to Quran 13:2 (79:28). "No intoxication or headache" moved to 37:47 / 56:19 (83:25).

### Scholarly differences now disclosed (examples)
- 78:23 ahqab (including Ma'arif: the idea of disbelievers' release contradicts the texts and consensus)
- 80:20, 80:23, 83:23, 86:4, 88:3, 89:3, 90:2–3, 95:5, 96:15, 100:7, 101:9
- Asbab al-nuzul of 108:3 (four reports)
- Ashab al-Ukhdud: Sahih Muslim 3005 vs Ibn Ishaq's Najran account (85)
- The narrator's own doubt in Muslim 2797 (96)
- The 109 "one year each" offer reported by Ibn Kathir only as "it has been said"

### Notes added for readers
- 105:3: "ababeel" means flocks of birds, not the Urdu "ababeel" (swallow) (Ma'arif).
- 102: the Ibn Kathir English text covers only ayat 1–2 in detail; ayat 3–8 are sourced from Ma'arif, and this is disclosed.

## 5. Technical changes

- `surahs-data.js`: all 37 statuses set to `ready`, with the audit rationale documented in a comment.
- `app.js`: a status pill in the Surah header (Verified / Partially Verified / Draft); a Verified notice with the label legend and remaining limitations, which also prints; a descriptive sidebar dot tooltip.
- `styles.css`: `.verified-note`, `.pill-status`, `.pill-verified`.
- Reference lists (36 Surahs): standardised caution note; Ma'arif entry added where missing; Ibn Kathir note clarifies that earlier mufassireen are quoted through it; new Hadith references added.
- No change to `quran-arabic.js` or `surahs/103.js`, and no redesign.

## 6. Regression results (all executed)

- **Static (13/13 pass):**
  - JS syntax: 40 files
  - 37 registrations
  - Canonical ayah counts; 564/564 translations
  - Required fields, IK / Ma'arif / Ehtiyat references
  - All statuses
  - Sajdah markers at 84:21 and 96:19 only
  - Arabic SHA-256
  - Hadith → reference mapping
  - 539/539 points attributed or labelled
  - Da'if labels; Abu Dawud 869 excluded
- **Browser (built-in Chromium pane, localhost):** all 37 Surahs render with Arabic cards = ayah count, every Arabic ayah present, all translations, Tafsir sections, Verified pill and notice. Sajdah pills appear at 84:21 and 96:19. No console errors, and every network request returned 200 (apart from one deliberate simulated 404).
- **Features:**
  - Sidebar navigation, search (including the empty state), all four filters
  - Bookmarks, completion and progress
  - Notes autosave
  - Deep link `#/surah/96/19`
  - Copy (text captured via clipboard stub: Arabic + translation)
  - JSON export → clear → import round trip
  - Load-error card + Retry (simulated missing file)
  - Print button path
  - Browser storage was snapshotted first; only the exact test keys were removed, and the final state equals the snapshot.
- **Mobile (390px emulation):** no horizontal overflow on any of the 37 Surahs; minimum touch target 44px.
- **PDF (headless Edge print-to-PDF):**
  - Page counts: 78 (8 pages), 84 (8), 96 (7), 103 (6), 114 (7)
  - Amiri and Plus Jakarta Sans embedded as subsets; Segoe UI / Times New Roman appear only as glyph-level fallbacks
  - Print CSS check: Verified notice and status pill print; sidebar and toolbar hidden; ayah cards, verses, vocabulary rows and references set to `break-inside: avoid`

## 7. Remaining limitations

1. Both tafsirs were read in **English translation** (quran.com), not in the Arabic or Urdu originals. Page numbers are not given.
2. Views of al-Tabari and other early mufassireen are **as quoted by Ibn Kathir** (or Ma'arif); their own works were not consulted.
3. **No qualified scholar has reviewed** the Roman Urdu text.
4. Several tafseeri narrations (for example Ibn Abi Hatim / Tabarani reports, the Abu Bakr report in 92) are **ungraded** in the sources and are labelled as such.
5. Revelation order (e.g. 79 after 78, 82 after 81) is stated as unverified. Makki/Madani differences (83, 97, 108, 113, 114) are disclosed.
6. **Not tested on a real iPhone / Safari.** Mobile testing was Chromium emulation at 390px. PDF page images were not visually inspected because no PDF renderer was available; checks were structural plus print-CSS emulation.
