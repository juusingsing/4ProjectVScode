
import './App.css';

import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import { setNavigate } from './cm/CmNavigateUtil';
import CmRouteChangeNotifier from './cm/CmRouteChangeNotifier';
import Home_Pet from './page/home/Home_Pet';
import Home_Plant from './page/home/Home_Plant';
import WriteCreate from './page/write/WriteCreate';
import WriteList from './page/write/WriteList';
import WriteUpdate from './page/write/WriteUpdate';
import WriteView from './page/write/WriteView';
import DiaryCreate from './page/diary/DiaryCreate';
import Main from './page/main';
import Position from './page/position/dnlcl';
import Combo from './page/combo/combo'
import Camera from './page/camera/camera'
import Alarm from './page/alarm/alarm'
import Alarmdb from './page/alarm/alarmdb'
import PlantCreate from './page/plant/PlantCreate';
import PlantWatering from './page/plant/PlantWatering';
import PlantSunlighting from './page/plant/PlantSunlighting';
import PlantRepotting from './page/plant/PlantRepotting.jsx';

import DiaryList from './page/diary/DiaryList';
import DiaryView from './page/diary/DiaryView';
import DiaryUpdate from './page/diary/DiaryUpdate';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';
import Login from './page/user/Login';
import Register from './page/user/Register';
import UserUpdate from './page/user/UserUpdate';
import UserView from './page/user/UserView';
import Pet_Form from './page/pet/Pet_Form';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Pet_Form_Update from './page/pet/Pet_Form_Update';
import Pet_Form_Hospital from './page/pet/Pet_Form_Hospital';
import FindId from './page/find/FindId';
import FindPw from './page/find/FindPw';
import ResetPassword from './page/find/ResetPassword';
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
        <Route path="/alarmdb" element={<Alarmdb/>}/>
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
        <Route path="/PlantWatering.do" element={<LayoutLogin><PlantWatering/></LayoutLogin>} />
        <Route path="/PlantSunlighting.do" element={<PlantSunlighting/>} />
        <Route path="/PlantRepotting.do" element={<PlantRepotting/>}/>

        
      
        {/* 게시판 */}
        <Route path="/write/create.do" element={<LayoutLogin><WriteCreate /></LayoutLogin>} />
        <Route path="/write/list.do" element={<LayoutLogin><WriteList /></LayoutLogin>} />
        <Route path="/write/update.do" element={<LayoutLogin><WriteUpdate /></LayoutLogin>} />
        <Route path="/write/view.do" element={<LayoutLogin><WriteView /></LayoutLogin>} />
        {/* 다이어리 */}
         <Route path="/diary/create.do" element={<DiaryCreate/>}/>
        <Route path="/diary/list.do" element={<DiaryList/>}/>
        <Route path="/diary/view.do" element={<DiaryView/>}/>
        <Route path="/diary/update.do" element={<DiaryUpdate/>}/>
        {/* 동물 탭*/}
        <Route path="/pet/petForm.do" element={<Pet_Form/>}/>
        <Route path="/pet/petFormUpdate.do" element={<Pet_Form_Update/>}/>
        <Route path="/pet/petHospital.do" element={<Pet_Form_Hospital/>}/>


        {/*아이디, 비번 찾기*/}
        <Route path="/find/findId.do" element={<FindId/>} />
        <Route path="/find/findPw.do" element={<FindPw/>} />
        <Route path="/find/resetPassword.do" element={<ResetPassword/>} />
      </Routes>
      <CmRouteChangeNotifier />
      </>
      
  );
};

export default App;
