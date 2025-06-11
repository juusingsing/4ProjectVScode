import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetImgLoadQuery } from '../../features/pet/petWalkApi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const Main = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const { data: imgResult, refetch, isLoading } = usePetImgLoadQuery({
    postFileKey: 999,    // < walk 아이디
    postFileCategory: "WAL"
  });

  useEffect(() => {
    setImages(imgResult || []);
  }, [imgResult]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        // padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* 상단 대표 이미지 및 버튼 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "448px",
          height: "240px",
          // borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
          alt="Running Dog"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <button
          onClick={() => navigate('/pet/walkRecord.do')}
          style={{
            position: "absolute",
            right: "1rem",
            bottom: "1rem",
            backgroundColor: "#ca8a04",
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

      {/* 최근 기록 표시 */}
      <div style={{ width: "100%", textAlign: "center", marginBottom: "4rem" }}>
        <p style={{ color: "#4b5563" }}>최근 기록</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "0.5rem",
          }}
        >
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>시작 시간</p>
            <div style={{ backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "0.5rem 1rem", marginTop: "0.25rem" }}>
              2025.06.11 PM 6:22
            </div>
          </div>

          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>소요 시간</p>
            <div style={{ backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "0.5rem 1rem", marginTop: "0.25rem" }}>
              02:10:03
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 갤러리 */}
      <div style={{ width: "100%", maxWidth: "448px", padding: "1rem", }}>
        {isLoading || !images ? (
          <div>이미지 로딩 중...</div>
        ) : images.length <= 8 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {images.map((image, idx) => (
              <div key={idx} style={{ flex: '0 0 23%', borderRadius: 8, overflow: 'hidden' }}>
                <img
                  src={`http://192.168.0.32:8081${image.postFilePath.replace(/\\/g, '/')}`}
                  alt={`img-${idx}`}
                  style={{
                    width: '100%',
                    height: '6rem',
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
          >
            {chunkArray(images, 8).map((group, idx) => (
              <SwiperSlide key={idx}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {group.map((image, i) => (
                    <div key={i} style={{ flex: '0 0 23%', borderRadius: 8, overflow: 'hidden' }}>
                      <img
                        src={`http://192.168.0.32:8081${image.postFilePath.replace(/\\/g, '/')}`}
                        alt={`img-${i}`}
                        style={{
                          width: '100%',
                          height: '6rem',
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Main;
