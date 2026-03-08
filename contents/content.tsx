import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import { translateText } from "~utils/translator" 

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const handleViewportEntry = async (element: HTMLElement) => {
  if (element.dataset.translated === "true") return;

  const originalText = element.innerText.trim();
  
  // 1. Get the user's chosen target language from storage
  const { targetLang } = await chrome.storage.local.get("targetLang");
  const finalTarget = targetLang || "en"; 

  element.dataset.translated = "true";
  console.log("✅ Translate:", originalText.substring(0, 30));
 
  const translated = await translateText(originalText, finalTarget);
  
  chrome.runtime.sendMessage({
    type: "NEW_TRANSLATION",
    payload: { original: originalText, translated: translated }
  });
};

// Setting the elements as false to put it through untranslation logic or delete. 
const handleViewportExit = async (element: HTMLElement) => {

  if (element.dataset.translated === "false") return

  const originalText = element.innerText.trim()
  console.log("❌ unregister:", originalText.substring(0, 30))
  
  element.dataset.translated = "false";
}

const OmniTranslateContent = () => {

  useEffect(() => {

    // The scanner checks the elements watched my mutation observe. If it's intersecting, or in viewport, 
    // we call the respective handleTranslation functions.
    const scanner = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Set the meta data as true to translate
          handleViewportEntry(entry.target as HTMLElement);
        } else {
          // Set the meta data as false to deregister and delete.
          handleViewportExit(entry.target as HTMLElement);
        }
      })
    }, { 
      threshold: 0.1,
    })

    // The mutation observer watches for new elements being added to the page. If it's a instance of HTMLelement, it trims the text for efficiency
    // and if the text length is greater than 0, meaning there's actual content inside, it calls the scanner function to observe it to see if it's in the viewport. 
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // now observing changes or new nodes. 
            const textNodes = node.querySelectorAll(TEXT_SELECTORS)
            textNodes.forEach((el) => {
              if (isTranslatable(el as HTMLElement)) {
                scanner.observe(el);
              }
            })

            if (node.innerText && node.innerText.trim().length > 0) {
              scanner.observe(node);
            }
          }
        })
      }
    })

    const TEXT_SELECTORS = "p, h1, h2, h3, h4, h5, h6, li, a, td, th, blockquote, label"

    const isTranslatable = (el: HTMLElement): boolean => {
      const text = el.innerText?.trim()
      if (!text || text.length < 1) return false         
      if (/^[\d\s\W]+$/.test(text)) return false        
      if (el.closest("script, style, code, pre")) return false  
      if (el.dataset.translated) return false           
      return true
    }
    
    const initialEls = Array.from(document.querySelectorAll(TEXT_SELECTORS))
      .filter((el) => isTranslatable(el as HTMLElement)) as HTMLElement[];

    initialEls
      .sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (Math.abs(ra.top - rb.top) > 10) return ra.top - rb.top;
        return ra.left - rb.left;
      })
      .forEach((el) => scanner.observe(el));

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      scanner.disconnect()
    }
  }, [])

  return null
}

export default OmniTranslateContent