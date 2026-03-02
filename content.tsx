import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const OmniTranslateContent = () => {

  useEffect(() => {
    // Setting the elements as true to put it through translation logic.
    const handleTranslationTrue = async (element: HTMLElement) => {

      if (element.dataset.translated === "true") return

      const originalText = element.innerText.trim()
      console.log("🚀 Translating:", originalText.substring(0, 30))
      
      // MOCK TRANSLATION (We will plug in AI in the next step)
      // element.innerText = `[TR] ${originalText}` 
      element.dataset.translated = "true";
    }

    // Setting the elements as false to put it through untranslation logic or delete. 
    const handleTranslationFalse = async (element: HTMLElement) => {
  
      if (element.dataset.translated === "false") return

      const originalText = element.innerText.trim()
      console.log("🚀 Untranslating:", originalText.substring(0, 30))
      
      // MOCK TRANSLATION (We will plug in AI in the next step)
      // element.innerText = `[TR] ${originalText}` 
      element.dataset.translated = "false";
    }

    // The scanner checks the elements watched my mutation observe. If it's intersecting, or in viewport, 
    // we call the respective handleTranslation functions.
    const scanner = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Set the meta data as true to translate
          handleTranslationTrue(entry.target as HTMLElement);
        } else {
          // Set the meta data as false to untranslate and delete.
          handleTranslationFalse(entry.target as HTMLElement);
        }
      })
    }, { threshold: 0.1 })

    // The mutation observer watches for new elements being added to the page. If it's a instance of HTMLelement, it trims the text for efficiency
    // and if the text length is greater than 0, meaning there's actual content inside, it calls the scanner function to observe it to see if it's in the viewport. 
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const text = node.innerText?.trim()
            // now observing changes or new nodes. 
            if (text && text.length > 0) {
              scanner.observe(node)
            }
          }
        })
      }
    })

    // Start by scanning everything already on the page. First line that executes or the initial scan. The observer takes care of new elements.
    document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, li").forEach((el) => {
      scanner.observe(el)
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      scanner.disconnect()
    }
  }, [])

  return null
}

export default OmniTranslateContent