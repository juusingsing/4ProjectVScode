import React, { useState, useEffect, useRef } from 'react';

const WalkTracker = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '20px' }}>{'←'}</button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>산책 기록</h2>
        <button style={{ background: 'none', border: 'none', fontSize: '20px' }}>⚙️</button>
      </div>

      {/* 드롭다운 영역 오른쪽 정렬 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              backgroundColor: '#6a8f6b',
              color: 'white',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '160px',
              textAlign: 'left'
            }}
          >
            동물 병원 찾기 ⌄
          </button>

          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              maxHeight: menuOpen ? '300px' : '0px',
              opacity: menuOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: menuOpen ? '10px' : '0 10px',
              boxShadow: menuOpen ? '0px 2px 5px rgba(0,0,0,0.1)' : 'none',
              zIndex: 10
            }}
          >
            <div style={{ padding: '5px 0' }}>꽃집 찾기</div>
            <div style={{ padding: '5px 0' }}>공원 찾기</div>
            <div style={{ padding: '5px 0' }}>동물 병원 찾기</div>
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div style={{
        width: '100%',
        height: '250px',
        backgroundColor: '#dbe9f4',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #ccc'
      }}>
        <p style={{ textAlign: 'center', paddingTop: '100px', color: '#555' }}>지도 영역</p>
      </div>

      {/* 시작/종료 버튼 */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            backgroundColor: '#6a8f6b',
            color: 'white',
            padding: '10px 40px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          {isRunning ? '종료' : '시작'}
        </button>
      </div>

      {/* 스톱워치 */}
      <div style={{ textAlign: 'center', fontSize: '28px', fontFamily: 'monospace' }}>
        {formatTime(time)}
      </div>
    </div>
  );
};

export default WalkTracker;
