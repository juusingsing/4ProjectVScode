import React from 'react';
import { Box } from '@mui/material';

const Home_Plant = () => {
  return (
    <Box
      sx={{
        padding: 0, // padding을 0으로 설정하여 불필요한 여백 제거
        margin: 0,  // margin도 제거
        height: 'calc(100vh - 40px)', // 네비게이션(40px)를 고려하여 높이 설정
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // 화면을 벗어난 부분이 스크롤로 표시되지 않도록 함
      }}
    >


      
    </Box>
  );
};

export default Home_Plant;
