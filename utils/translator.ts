// utils/translator.ts

export async function translateText(text: string, targetLanguage: string = 'en'): Promise<string> {
  if (!text.trim()) return "";

  try {
    // 1. Detect the Source Language
    if (!('LanguageDetector' in window)) throw new Error("Detector not found");
    const detectorCapabilities = await (window as any).LanguageDetector.capabilities();
    if (detectorCapabilities.available === 'after-download') {
        // You can send a message to the SidePanel here to show a "Downloading AI..." bar
        console.log("Downloading Language Detection model...");
    }
    const detector = await (window as any).LanguageDetector.create();
    const results = await detector.detect(text);
    
    // Get the most likely language (e.g., 'ko', 'ja', 'fr')
    const sourceLanguage = results[0].detectedLanguage;
    console.log(`Detected: ${sourceLanguage}, Target: ${targetLanguage}`);
    
    // If it's already the target language, don't waste resources
    if (sourceLanguage === targetLanguage) {
        console.warn("Source and Target are the same. Skipping.");
        return text;
    }

    // 2. Translate using the detected source
    const translationAPI = (window as any).translation;
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
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.responseData.translatedText;
}