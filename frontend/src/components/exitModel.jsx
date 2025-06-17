export default function ExitModel({ setShowExitModal, setExitPopupDismissed }) {
    return(
        <>
         <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.3s ease-out"
            }}
            onClick={(e) => e.target === e.currentTarget && setShowExitModal(false)}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #1e293b 0%, #334155 100%)",
                borderRadius: "20px",
                padding: "40px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                textAlign: "center",
                minWidth: "400px",
                maxWidth: "90vw",
                position: "relative",
                animation: "slideIn 0.3s ease-out",
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}
            >
              {/* Close button */}
              <button
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setShowExitModal(false)}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(148, 163, 184, 0.1)";
                  e.target.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#94a3b8";
                }}
              >
                ×
              </button>

              {/* Header */}
              <div style={{ marginBottom: "32px" }}>
                <h2 style={{
                  color: "#ffffff",
                  margin: "0 0 8px 0",
                  fontSize: "28px",
                  fontWeight: "700",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                }}>
                  Choose Your Destination
                </h2>
                <p style={{
                  color: "#94a3b8",
                  margin: 0,
                  fontSize: "16px"
                }}>
                  Select where you'd like to go
                </p>
              </div>

              {/* Buttons */}
              <div style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}>
                {[
                  {
                    label: "☕ Cafe",
                    color: "#059669",
                    hoverColor: "#047857",
                    action: () => {
                      setShowExitModal(false);
                      // TODO: Load cafe map/scene
                    }
                  },
                  {
                    label: "🏢 Meeting",
                    color: "#2563eb",
                    hoverColor: "#1d4ed8",
                    action: () => {
                      setShowExitModal(false);
                      // TODO: Load meeting map/scene
                    }
                  },
                  {
                    label: "Cancel",
                    color: "#64748b",
                    hoverColor: "#475569",
                    action: () => {
                      setShowExitModal(false);
                      setExitPopupDismissed(true);
                      window.setExitPopupDismissed(true);
                    }
                  }
                ].map((btn, index) => (
                  <button
                    key={index}
                    style={{
                      background: `linear-gradient(145deg, ${btn.color}, ${btn.hoverColor})`,
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "14px 28px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      minWidth: "120px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onClick={btn.action}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = "translateY(0) scale(0.95)";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = "translateY(-2px) scale(1)";
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
          </div>
          </>
    )
}