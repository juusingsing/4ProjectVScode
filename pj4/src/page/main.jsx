import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: '12px', marginTop: '40px' }}>
      <button onClick={() => navigate('/position')} style={{ padding: '12px 24px' }}>
        위치 페이지 이동
      </button>
      <button onClick={() => navigate('/combo')} style={{ padding: '12px 24px' }}>
        콤보 페이지 이동
      </button>
      <button onClick={() => navigate('/camera')} style={{ padding: '12px 24px' }}>
        카메라 페이지 이동
      </button>
    </div>
  );
};

export default Main;
