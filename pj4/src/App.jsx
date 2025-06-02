
import './App.css';

import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import { setNavigate } from './cm/CmNavigateUtil';
import CmRouteChangeNotifier from './cm/CmRouteChangeNotifier';
import Home_Pet from './page/home/Home_Pet';
import Home_Plant from './page/home/Home_Plant';
import DiaryCreate from './page/diary/DiaryCreate';
import Main from './page/main';
import Position from './page/position/dnlcl';
import Combo from './page/combo/combo'
import Camera from './page/camera/camera'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* 각페이지로 이동하는 버튼구현 */}
        {/* 안드로이드에서 확인하려는데 기본페이지만떠서 */}
        

        <Route path="/" element={<Main />} />     

        <Route path="/position" element={<Position />} />
        <Route path="/combo" element={<Combo />} />
        <Route path="/camera" element={<Camera />} />
        {/* 홈화면 */}
        <Route path="/Home_Pet.do" element={<Home_Pet />} />
        <Route path="/Home_Plant.do" element={<Home_Plant />} />
        <Route path="/diaryCreate.do" element={<DiaryCreate/>}/>
      
      </Routes>
      <CmRouteChangeNotifier />
      </>
      
  );
};

export default App;
