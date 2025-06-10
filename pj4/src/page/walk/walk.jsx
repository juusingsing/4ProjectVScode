import React from "react";
import { useNavigate } from 'react-router-dom';

export default function RunTracker() {
  const navigate = useNavigate();
  
  const images = [
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1513785077084-84adb77e90ab",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "448px",
          height: "240px",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
          alt="Running Dog"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <button
          onClick={() => navigate('/pet/walkRecord.do')}
          style={{
            position: "absolute",
            right: "1rem",
            bottom: "1rem",
            backgroundColor: "#ca8a04", // yellow
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
            borderRadius: "9999px",
            width: "6rem",
            height: "6rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: "1.25rem",
          }}
        >
          RUN<br />START
        </button>
      </div>


      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        <p style={{ color: "#4b5563" }}>오늘의 마지막 기록</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "0.5rem",
          }}
        >
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>시작 시간</p>
            <div
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                padding: "0.5rem 1rem",
                marginTop: "0.25rem",
              }}
            >
              PM 6:22
            </div>
          </div>

          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>소요 시간</p>
            <div
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                padding: "0.5rem 1rem",
                marginTop: "0.25rem",
              }}
            >
              02:10:03
            </div>
          </div>

        </div>
      </div>

      {/* Photo gallery */}
      <div style={{ width: "100%", maxWidth: "448px" }}>
        <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>오늘의 풍경</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
          }}
        >
          {images.map((src, idx) => (
            <img
              key={idx}
              src={`${src}?w=100&h=100&fit=crop`}
              alt={`오늘의 풍경 ${idx + 1}`}
              style={{
                width: "100%",
                height: "6rem",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
