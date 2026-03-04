import { useState, useEffect } from "react"

function SidePanel() {
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("en")
  const [status, setStatus] = useState("Ready")
  
  // 1. Add state to hold the incoming translations
  const [translationLog, setTranslationLog] = useState<{original: string, translated: string}[]>([])

  // 2. Setup the Listener
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === "NEW_TRANSLATION") {
        // Add the new translation to the top of the list
        setTranslationLog((prev) => [message.payload, ...prev].slice(0, 10)) 
        setStatus("Translated!")
      }
    }

    chrome.runtime.onMessage.addListener(messageListener)
    chrome.storage.local.set({ targetLang });

    // Cleanup: stop listening when the side panel is closed
    return () => chrome.runtime.onMessage.removeListener(messageListener)
  }, [targetLang])

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", fontFamily: "sans-serif" }}>
      <h2>Omni-Translator</h2>
      
      {/* Settings Section */}
      <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "8px" }}>
        <label>From: </label>
        <label>Translate To: </label>
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="ko">Korean</option>
            </select>
      </div>

      <hr />

      {/* Translation Display Section */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <strong>Live Feed:</strong>
        {translationLog.length === 0 && <p style={{ color: "#888" }}>Scroll on a page to see translations...</p>}
        
        {translationLog.map((item, index) => (
          <div key={index} style={{ marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
            <div style={{ fontSize: "0.8em", color: "#666" }}>{item.original}</div>
            <div style={{ fontWeight: "bold", color: "#2d5af0" }}>{item.translated}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "0.8em" }}>Status: <strong>{status}</strong></p>
    </div>
  )
}

export default SidePanel