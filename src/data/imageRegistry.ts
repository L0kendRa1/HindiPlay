/**
 * Centralized Image Registry for HindiPlay
 *
 * Maps Hindi words to verified, reachable vector/image assets with full metadata:
 * - wordId: stable identifier
 * - word: target Hindi word in Devanagari
 * - url: static path served by Vite (/images/words/...)
 * - alt: descriptive Hindi text for accessibility
 * - source: provenance of asset
 * - license: license terms
 *
 * Provides runtime availability checks and error reporting so broken images
 * can be blacklisted during a session to prevent repeated errors.
 */

export interface ImageMetadata {
  url: string;
  alt: string;
  source: string;
  license: string;
}

export interface WordImageEntry extends ImageMetadata {
  wordId: string;
  word: string;
  category: string;
}

// Runtime set of unavailable / broken image URLs detected during this session
const runtimeUnavailableUrls = new Set<string>();

/**
 * Marks an image URL as unavailable for the rest of the current session.
 */
export function markImageUnavailable(url: string): void {
  if (url) {
    runtimeUnavailableUrls.add(url);
  }
}

/**
 * Checks whether an image URL is currently available.
 */
export function isImageAvailable(url: string): boolean {
  if (!url) return false;
  return !runtimeUnavailableUrls.has(url);
}

/**
 * Resets the runtime unavailable image registry (e.g. for testing).
 */
export function resetImageAvailability(): void {
  runtimeUnavailableUrls.clear();
}

/**
 * Master Registry of all 82 verified HindiPlay image assets.
 * Each entry is guaranteed to correspond to a concrete, child-friendly Hindi word.
 */
export const HINDI_IMAGE_REGISTRY: Record<string, WordImageEntry> = {
  "इमली": {
    "wordId": "img_इमली",
    "word": "इमली",
    "category": "फल",
    "url": "/images/words/imli.svg",
    "alt": "इमली का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "फल": {
    "wordId": "img_फल",
    "word": "फल",
    "category": "फल",
    "url": "/images/words/phal.svg",
    "alt": "ताजे फल",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "आम": {
    "wordId": "img_आम",
    "word": "आम",
    "category": "फल",
    "url": "/images/words/aam.svg",
    "alt": "आम का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "अनार": {
    "wordId": "img_अनार",
    "word": "अनार",
    "category": "फल",
    "url": "/images/words/anar.svg",
    "alt": "अनार का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "अंगूर": {
    "wordId": "img_अंगूर",
    "word": "अंगूर",
    "category": "फल",
    "url": "/images/words/angoor.svg",
    "alt": "अंगूर का गुच्छा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "तरबूज": {
    "wordId": "img_तरबूज",
    "word": "तरबूज",
    "category": "फल",
    "url": "/images/words/tarbooj.svg",
    "alt": "तरबूज का टुकड़ा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ईख": {
    "wordId": "img_ईख",
    "word": "ईख",
    "category": "फल",
    "url": "/images/words/eekh.svg",
    "alt": "ईख का पौधा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "केला": {
    "wordId": "img_केला",
    "word": "केला",
    "category": "फल",
    "url": "/images/words/kela.svg",
    "alt": "मीठा पीला केला",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "सेब": {
    "wordId": "img_सेब",
    "word": "सेब",
    "category": "फल",
    "url": "/images/words/seb.svg",
    "alt": "लाल सेब",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "संतरा": {
    "wordId": "img_संतरा",
    "word": "संतरा",
    "category": "फल",
    "url": "/images/words/santara.svg",
    "alt": "रसीला संतरा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "पपीता": {
    "wordId": "img_पपीता",
    "word": "पपीता",
    "category": "फल",
    "url": "/images/words/papeeta.svg",
    "alt": "मीठा पपीता",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "अमरूद": {
    "wordId": "img_अमरूद",
    "word": "अमरूद",
    "category": "फल",
    "url": "/images/words/amrood.svg",
    "alt": "ताजा अमरूद",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "टमाटर": {
    "wordId": "img_टमाटर",
    "word": "टमाटर",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/tamatar.svg",
    "alt": "लाल टमाटर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "मटर": {
    "wordId": "img_मटर",
    "word": "मटर",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/matar.svg",
    "alt": "हरी मटर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "शलजम": {
    "wordId": "img_शलजम",
    "word": "शलजम",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/shaljam.svg",
    "alt": "शलजम का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "गाजर": {
    "wordId": "img_गाजर",
    "word": "गाजर",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/gajar.svg",
    "alt": "लाल गाजर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "आलू": {
    "wordId": "img_आलू",
    "word": "आलू",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/aaloo.svg",
    "alt": "गोल आलू",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "प्याज": {
    "wordId": "img_प्याज",
    "word": "प्याज",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/pyaaz.svg",
    "alt": "बैंगनी प्याज",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "बैंगन": {
    "wordId": "img_बैंगन",
    "word": "बैंगन",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/baingan.svg",
    "alt": "चमकदार बैंगन",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "मूली": {
    "wordId": "img_मूली",
    "word": "मूली",
    "category": "सब्ज़ियाँ",
    "url": "/images/words/mooli.svg",
    "alt": "सफेद मूली",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "मछली": {
    "wordId": "img_मछली",
    "word": "मछली",
    "category": "जानवर",
    "url": "/images/words/machhli.svg",
    "alt": "रंग-बिरंगी मछली",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "भालू": {
    "wordId": "img_भालू",
    "word": "भालू",
    "category": "जानवर",
    "url": "/images/words/bhalu.svg",
    "alt": "जंगल का भालू",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "हाथी": {
    "wordId": "img_हाथी",
    "word": "हाथी",
    "category": "जानवर",
    "url": "/images/words/hathi.svg",
    "alt": "बड़ा हाथी",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "खरगोश": {
    "wordId": "img_खरगोश",
    "word": "खरगोश",
    "category": "जानवर",
    "url": "/images/words/khargosh.svg",
    "alt": "खरगोश का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "शेर": {
    "wordId": "img_शेर",
    "word": "शेर",
    "category": "जानवर",
    "url": "/images/words/sher.svg",
    "alt": "बब्बर शेर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "चीता": {
    "wordId": "img_चीता",
    "word": "चीता",
    "category": "जानवर",
    "url": "/images/words/cheeta.svg",
    "alt": "तेज दौड़ता चीता",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "बंदर": {
    "wordId": "img_बंदर",
    "word": "बंदर",
    "category": "जानवर",
    "url": "/images/words/bandar.svg",
    "alt": "नटखट बंदर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "गाय": {
    "wordId": "img_गाय",
    "word": "गाय",
    "category": "जानवर",
    "url": "/images/words/gaay.svg",
    "alt": "सफेद गाय",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "बकरी": {
    "wordId": "img_बकरी",
    "word": "बकरी",
    "category": "जानवर",
    "url": "/images/words/bakri.svg",
    "alt": "प्यारी बकरी",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "घोड़ा": {
    "wordId": "img_घोड़ा",
    "word": "घोड़ा",
    "category": "जानवर",
    "url": "/images/words/ghoda.svg",
    "alt": "दौड़ता घोड़ा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कुत्ता": {
    "wordId": "img_कुत्ता",
    "word": "कुत्ता",
    "category": "जानवर",
    "url": "/images/words/kutta.svg",
    "alt": "वफादार कुत्ता",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "बिल्ली": {
    "wordId": "img_बिल्ली",
    "word": "बिल्ली",
    "category": "जानवर",
    "url": "/images/words/billi.svg",
    "alt": "प्यारी बिल्ली",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ऊँट": {
    "wordId": "img_ऊँट",
    "word": "ऊँट",
    "category": "जानवर",
    "url": "/images/words/oont.svg",
    "alt": "रेगिस्तान का ऊँट",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कछुआ": {
    "wordId": "img_कछुआ",
    "word": "कछुआ",
    "category": "जानवर",
    "url": "/images/words/kachhua.svg",
    "alt": "धीमा कछुआ",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "चूहा": {
    "wordId": "img_चूहा",
    "word": "चूहा",
    "category": "जानवर",
    "url": "/images/words/chooha.svg",
    "alt": "छोटा चूहा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "बत्तख": {
    "wordId": "img_बत्तख",
    "word": "बत्तख",
    "category": "पक्षी",
    "url": "/images/words/battakh.svg",
    "alt": "सफेद बत्तख",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "उल्लू": {
    "wordId": "img_उल्लू",
    "word": "उल्लू",
    "category": "पक्षी",
    "url": "/images/words/ullu.svg",
    "alt": "उल्लू का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "तोता": {
    "wordId": "img_तोता",
    "word": "तोता",
    "category": "पक्षी",
    "url": "/images/words/tota.svg",
    "alt": "हरा तोता",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "मोर": {
    "wordId": "img_मोर",
    "word": "मोर",
    "category": "पक्षी",
    "url": "/images/words/mor.svg",
    "alt": "राष्ट्रीय पक्षी मोर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कौआ": {
    "wordId": "img_कौआ",
    "word": "कौआ",
    "category": "पक्षी",
    "url": "/images/words/kauwa.svg",
    "alt": "काला कौआ",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कबूतर": {
    "wordId": "img_कबूतर",
    "word": "कबूतर",
    "category": "पक्षी",
    "url": "/images/words/kabootar.svg",
    "alt": "सलेटी कबूतर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "चिड़िया": {
    "wordId": "img_चिड़िया",
    "word": "चिड़िया",
    "category": "पक्षी",
    "url": "/images/words/chidiya.svg",
    "alt": "छोटी चिड़िया",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "हंस": {
    "wordId": "img_हंस",
    "word": "हंस",
    "category": "पक्षी",
    "url": "/images/words/hans.svg",
    "alt": "सफेद हंस",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कमल": {
    "wordId": "img_कमल",
    "word": "कमल",
    "category": "प्रकृति",
    "url": "/images/words/kamal.svg",
    "alt": "कमल का फूल",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "गमला": {
    "wordId": "img_गमला",
    "word": "गमला",
    "category": "प्रकृति",
    "url": "/images/words/gamla.svg",
    "alt": "फूलों का गमला",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "वृक्ष": {
    "wordId": "img_वृक्ष",
    "word": "वृक्ष",
    "category": "प्रकृति",
    "url": "/images/words/vriksh.svg",
    "alt": "हरा-भरा वृक्ष",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "सूरज": {
    "wordId": "img_सूरज",
    "word": "सूरज",
    "category": "प्रकृति",
    "url": "/images/words/sooraj.svg",
    "alt": "चमकता सूरज",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "चाँद": {
    "wordId": "img_चाँद",
    "word": "चाँद",
    "category": "प्रकृति",
    "url": "/images/words/chand.svg",
    "alt": "रात का चाँद",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "घर": {
    "wordId": "img_घर",
    "word": "घर",
    "category": "घर",
    "url": "/images/words/ghar.svg",
    "alt": "सुंदर घर",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "नल": {
    "wordId": "img_नल",
    "word": "नल",
    "category": "घर",
    "url": "/images/words/nal.svg",
    "alt": "पानी का नल",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "चम्मच": {
    "wordId": "img_चम्मच",
    "word": "चम्मच",
    "category": "घर",
    "url": "/images/words/chammach.svg",
    "alt": "चम्मच का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "छाता": {
    "wordId": "img_छाता",
    "word": "छाता",
    "category": "घर",
    "url": "/images/words/chhata.svg",
    "alt": "रंग-बिरंगा छाता",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "थाली": {
    "wordId": "img_थाली",
    "word": "थाली",
    "category": "घर",
    "url": "/images/words/thali.svg",
    "alt": "भोजन की थाली",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "घड़ी": {
    "wordId": "img_घड़ी",
    "word": "घड़ी",
    "category": "घर",
    "url": "/images/words/ghadi.svg",
    "alt": "दीवार घड़ी",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "दरवाजा": {
    "wordId": "img_दरवाजा",
    "word": "दरवाजा",
    "category": "घर",
    "url": "/images/words/darwaja.svg",
    "alt": "घर का दरवाजा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "दीपक": {
    "wordId": "img_दीपक",
    "word": "दीपक",
    "category": "घर",
    "url": "/images/words/deepak.svg",
    "alt": "जलती मिट्टी का दीपक",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ताला": {
    "wordId": "img_ताला",
    "word": "ताला",
    "category": "घर",
    "url": "/images/words/taala.svg",
    "alt": "लोहे का ताला",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "चाबी": {
    "wordId": "img_चाबी",
    "word": "चाबी",
    "category": "घर",
    "url": "/images/words/chaabi.svg",
    "alt": "सुनहरी चाबी",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "किताब": {
    "wordId": "img_किताब",
    "word": "किताब",
    "category": "स्कूल",
    "url": "/images/words/kitaab.svg",
    "alt": "खुली किताब",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कलम": {
    "wordId": "img_कलम",
    "word": "कलम",
    "category": "स्कूल",
    "url": "/images/words/kalam.svg",
    "alt": "लिखने की कलम",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "जहाज": {
    "wordId": "img_जहाज",
    "word": "जहाज",
    "category": "वाहन",
    "url": "/images/words/jahaj.svg",
    "alt": "पानी का जहाज",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "रथ": {
    "wordId": "img_रथ",
    "word": "रथ",
    "category": "वाहन",
    "url": "/images/words/rath.svg",
    "alt": "सुंदर रथ",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "कार": {
    "wordId": "img_कार",
    "word": "कार",
    "category": "वाहन",
    "url": "/images/words/car.svg",
    "alt": "लाल कार",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "बस": {
    "wordId": "img_बस",
    "word": "बस",
    "category": "वाहन",
    "url": "/images/words/bus.svg",
    "alt": "पीली बस",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "नाव": {
    "wordId": "img_नाव",
    "word": "नाव",
    "category": "वाहन",
    "url": "/images/words/naav.svg",
    "alt": "पानी में नाव",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "रेलगाड़ी": {
    "wordId": "img_रेलगाड़ी",
    "word": "रेलगाड़ी",
    "category": "वाहन",
    "url": "/images/words/railgaadi.svg",
    "alt": "छुक-छुक रेलगाड़ी",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "साइकिल": {
    "wordId": "img_साइकिल",
    "word": "साइकिल",
    "category": "वाहन",
    "url": "/images/words/cycle.svg",
    "alt": "दो पहियों की साइकिल",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "पतंग": {
    "wordId": "img_पतंग",
    "word": "पतंग",
    "category": "वस्तुएँ",
    "url": "/images/words/patang.svg",
    "alt": "उड़ती पतंग",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "लट्टू": {
    "wordId": "img_लट्टू",
    "word": "लट्टू",
    "category": "वस्तुएँ",
    "url": "/images/words/lattu.svg",
    "alt": "घूमता लट्टू",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "डमरू": {
    "wordId": "img_डमरू",
    "word": "डमरू",
    "category": "वस्तुएँ",
    "url": "/images/words/damru.svg",
    "alt": "शिवजी का डमरू",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ढक्कन": {
    "wordId": "img_ढक्कन",
    "word": "ढक्कन",
    "category": "वस्तुएँ",
    "url": "/images/words/dhakkan.svg",
    "alt": "बर्तन का ढक्कन",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "धनुष": {
    "wordId": "img_धनुष",
    "word": "धनुष",
    "category": "वस्तुएँ",
    "url": "/images/words/dhanush.svg",
    "alt": "धनुष-बाण",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "झंडा": {
    "wordId": "img_झंडा",
    "word": "झंडा",
    "category": "वस्तुएँ",
    "url": "/images/words/jhanda.svg",
    "alt": "तिरंगा झंडा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ऐनक": {
    "wordId": "img_ऐनक",
    "word": "ऐनक",
    "category": "वस्तुएँ",
    "url": "/images/words/ainak.svg",
    "alt": "ऐनक का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ओखली": {
    "wordId": "img_ओखली",
    "word": "ओखली",
    "category": "वस्तुएँ",
    "url": "/images/words/okhli.svg",
    "alt": "ओखली का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ऊन": {
    "wordId": "img_ऊन",
    "word": "ऊन",
    "category": "वस्तुएँ",
    "url": "/images/words/oon.svg",
    "alt": "ऊन का गोला",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ठप्पा": {
    "wordId": "img_ठप्पा",
    "word": "ठप्पा",
    "category": "वस्तुएँ",
    "url": "/images/words/thappa.svg",
    "alt": "मुहर या ठप्पा",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "षट्कोण": {
    "wordId": "img_षट्कोण",
    "word": "षट्कोण",
    "category": "वस्तुएँ",
    "url": "/images/words/shatkon.svg",
    "alt": "षट्कोण आकृति",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "यज्ञ": {
    "wordId": "img_यज्ञ",
    "word": "यज्ञ",
    "category": "वस्तुएँ",
    "url": "/images/words/yagya.svg",
    "alt": "पवित्र यज्ञ",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "औरत": {
    "wordId": "img_औरत",
    "word": "औरत",
    "category": "परिवार",
    "url": "/images/words/aurat.svg",
    "alt": "औरत का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "एक": {
    "wordId": "img_एक",
    "word": "एक",
    "category": "संख्या",
    "url": "/images/words/ek.svg",
    "alt": "एक की संख्या",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  },
  "ऋषि": {
    "wordId": "img_ऋषि",
    "word": "ऋषि",
    "category": "सामान्य",
    "url": "/images/words/rishi.svg",
    "alt": "ऋषि का चित्र",
    "source": "HindiPlay Vector Assets",
    "license": "Original HindiPlay asset"
  }
};

/**
 * Looks up the image metadata for a given Hindi word.
 * Returns null if the word has no verified image or is marked unavailable.
 */
export function getImageForWord(word: string): WordImageEntry | null {
  if (!word) return null;
  const entry = HINDI_IMAGE_REGISTRY[word.trim()];
  if (!entry) return null;
  if (!isImageAvailable(entry.url)) return null;
  return entry;
}

/**
 * Checks if a word has a valid, reachable image asset.
 */
export function hasValidImage(word: string): boolean {
  return getImageForWord(word) !== null;
}

/**
 * Returns all currently verified and available image words.
 */
export function getAllImageWords(): WordImageEntry[] {
  return Object.values(HINDI_IMAGE_REGISTRY).filter((entry) => isImageAvailable(entry.url));
}
