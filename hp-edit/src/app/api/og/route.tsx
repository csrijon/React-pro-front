import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "HP Edit Enterprise | Next-Gen AI & Software";
    const category = searchParams.get("category") || "Enterprise Architecture";
    const readTime = searchParams.get("readTime") || "4 min read";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#030712",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient Cyber Glow Orbs */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(3, 7, 18, 0) 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-150px",
              left: "-100px",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(3, 7, 18, 0) 70%)",
            }}
          />

          {/* Top Brand Header Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#030712",
                  fontWeight: 900,
                  fontSize: "22px",
                }}
              >
                &gt;_
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  HP EDIT ENTERPRISE
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#06b6d4",
                    fontFamily: "monospace",
                    letterSpacing: "1px",
                  }}
                >
                  AI SYSTEMS &amp; ENTERPRISE SOFTWARE
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(6, 182, 212, 0.15)",
                border: "1px solid rgba(6, 182, 212, 0.4)",
                color: "#22d3ee",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              <span>{category}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </div>

          {/* Center Main Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1000px",
              zIndex: 10,
              margin: "30px 0",
            }}
          >
            <h1
              style={{
                fontSize: "52px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-1.5px",
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Security & Tech Horizon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                color: "#9ca3af",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <span>Next.js 15</span>
              <span>•</span>
              <span>React 19</span>
              <span>•</span>
              <span>Gemini 2.0 Flash</span>
              <span>•</span>
              <span>Flutter</span>
              <span>•</span>
              <span>WhatsApp API</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#06b6d4",
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "monospace",
              }}
            >
              <span>www.hpedit.com</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG Image generation failed:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
