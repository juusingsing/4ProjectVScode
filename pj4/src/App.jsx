
import './App.css';

import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import { setNavigate } from './cm/CmNavigateUtil';
import CmRouteChangeNotifier from './cm/CmRouteChangeNotifier';
import Home_Pet from './page/home/Home_Pet';
import Home_Plant from './page/home/Home_Plant';
import WriteBoardCreate from './page/write/WriteBoardCreate';
import WriteBoardList from './page/write/WriteBoardList';
import WriteBoardUpdate from './page/write/WriteBoardUpdate';
import WriteBoardView from './page/write/WriteBoardView';
import DiaryCreate from './page/diary/DiaryCreate';
import Main from './page/main';
import Position from './page/position/dnlcl';
import Combo from './page/combo/combo'
import Camera from './page/camera/camera'
import Alarm from './page/alarm/alarm'
import PlantCreate from './page/plant/PlantCreate';

import DiaryList from './page/diary/DiaryList';

import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';
import Login from './page/user/Login';
import Register from './page/user/Register';
import UserUpdate from './page/user/UserUpdate';
import UserView from './page/user/UserView';

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
        <Route path="/alarm" element={<Alarm/>}/>
        {/* 회원가입, 로그인, 회원정보 */}
        <Route path="/user/join.do" element={<LayoutNoLogin><Register /></LayoutNoLogin>} />
        <Route path="/user/login.do" element={<LayoutNoLogin><Login /></LayoutNoLogin>} />
        <Route path="/user/update.do" element={<LayoutLogin><UserUpdate /></LayoutLogin>} />
        <Route path="/user/view.do" element={<LayoutLogin><UserView /></LayoutLogin>} />
        {/* 홈화면 */}
        <Route path="/Home_Pet.do" element={<Home_Pet />} />
        <Route path="/Home_Plant.do" element={<Home_Plant />} />
        <Route path="/diaryCreate.do" element={<DiaryCreate/>}/>
        <Route path="/PlantCreate.do" element={<PlantCreate/>}/>
      
        {/* 게시판 */}
        <Route path="/write/create.do" element={<LayoutLogin><WriteBoardCreate /></LayoutLogin>} />
        <Route path="/write/list.do" element={<LayoutLogin><WriteBoardList /></LayoutLogin>} />
        <Route path="/write/update.do" element={<LayoutLogin><WriteBoardUpdate /></LayoutLogin>} />
        <Route path="/write/view.do" element={<LayoutLogin><WriteBoardView /></LayoutLogin>} />
        {/* 다이어리 */}
         <Route path="/diary/create.do" element={<DiaryCreate/>}/>
        <Route path="/diary/list.do" element={<DiaryList/>}/>
      </Routes>
      <CmRouteChangeNotifier />
      </>
      
  );
};

export default App;
