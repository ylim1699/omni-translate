// utils/translator.ts

export async function translateText(text: string, targetLanguage: string = 'en'): Promise<string> {
  if (!text.trim()) return "";

  try {
    // 1. Detect the Source Language
    if (!('LanguageDetector' in window)) throw new Error("Detector not found");
    const detectorAvailability = await (window as any).LanguageDetector.availability();
    if (detectorAvailability === 'downloadable' || detectorAvailability === 'downloading') {
        console.log("Downloading Language Detection model...");
    }
    const detector = await (window as any).LanguageDetector.create();
    const results = await detector.detect(text);
    
    const sourceLanguage = results[0].detectedLanguage;
    console.log(`Detected: ${sourceLanguage}, Target: ${targetLanguage}`);
    
    // If it's already the target language, don't waste resources
    if (sourceLanguage === targetLanguage) {
        console.warn("Source and Target are the same. Skipping.");
        return text;
    }

    // 2. Translate using the detected source
    const translationAPI = (window as any).translation;
    if (!translationAPI) {
      return await fallbackTranslate(text, sourceLanguage, targetLanguage);
    }
    const canTranslate = await translationAPI.canTranslate({
      sourceLanguage,
      targetLanguage,
    });

    if (canTranslate === 'no') {
      return await fallbackTranslate(text, sourceLanguage, targetLanguage);
    }

    const session = await translationAPI.create({
      sourceLanguage,
      targetLanguage,
      context: `Translate this from a ${sourceLanguage} website naturally into ${targetLanguage}.`
    });

    const translated = await session.translate(text);
    session.destroy();
    return translated;

  } catch (error) {
    console.error("Omni-Translate Error:", error);
    return text;
  }
}

async function fallbackTranslate(text: string, source: string, target: string) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  const data = await response.json();
  // Response is a nested array; extract all translated segments and join them
  return data[0].map((segment: any[]) => segment[0]).join('');
}