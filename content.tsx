import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const OmniTranslateContent = () => {
  useEffect(() => {
    // 1. THE ACTION: This is where the translation happens
    const handleTranslation = async (element: HTMLElement) => {
      // Check if we already translated this to avoid loops
      if (element.dataset.translated === "true") return

      const originalText = element.innerText.trim()
      console.log("🚀 Translating:", originalText.substring(0, 30))
      
      // MOCK TRANSLATION (We will plug in AI in the next step)
      // element.innerText = `[TR] ${originalText}` 
      element.dataset.translated = "true"
    }

    // 2. THE FOCUS: Intersection Observer
    // This knows exactly what is on your screen right now
    const scanner = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If the text is on screen, translate it!
          handleTranslation(entry.target as HTMLElement)
        } else {
          // If it leaves the screen, we could reset it if we wanted "bilingual" toggles
          // console.log("👋 Text left screen")
        }
      })
    }, { threshold: 0.1 })

    // 3. THE RADAR: Mutation Observer
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const text = node.innerText?.trim()
            if (text && text.length > 0) {
              // Instead of just logging, we tell the scanner to WATCH this element
              scanner.observe(node)
            }
          }
        })
      }
    })

    // Start by scanning everything already on the page
    document.querySelectorAll("p, span, h1, h2, h3, li").forEach((el) => {
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