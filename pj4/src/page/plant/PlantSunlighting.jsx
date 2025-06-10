import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, Tabs, Tab, IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FaSun, FaTint, FaCloud, FaSnowflake } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useSaveSunlightInfoMutation } from '../../features/plant/plantApi'; //
import '../../css/plantSunlighting.css';

import PlantWatering from './PlantWatering'; // 물주기 탭
import PlantRepotting from './PlantRepotting'; // 분갈이 탭
import PlantPest from './PlantPest'; // 병충해 탭

// 일조량 아이콘 옵션 정의
const sunlightOptions = [
  { id: 'W01', icon: <FaSun />, label: '맑음', className: 'selected-sun' },
  { id: 'W02', icon: <FaTint />, label: '흐림', className: 'selected-tint' },
  { id: 'W03', icon: <FaCloud />, label: '구름 많음', className: 'selected-cloud' },
  { id: 'W04', icon: <FaSnowflake />, label: '눈/비', className: 'selected-snow' }
];

// 일조량 탭 내용 컴포넌트
const SunlightContent = ({
  sunlightStatusText,
  setSunlightStatusText,
  selectedSunlight,
  setSelectedSunlight,
  handleSave // handleSave 함수를 props로 받음
}) => (
  <Box className="sunlight-tab-content">
    <Box className="daily-status-section">
      <Typography className="status-label">일조상태</Typography>
      <div className="icon-group">
        {sunlightOptions.map(opt => (
          <div
            key={opt.id}
            className={`status-icon ${selectedSunlight === opt.id ? opt.className : ''}`}
            onClick={() => setSelectedSunlight(opt.id)}
            style={{ cursor: 'pointer' }}
            title={opt.label}
          >
            {opt.icon}
          </div>
        ))}
      </div>
    </Box>

    <Box className="light-status-section">
      <Typography className="light-status-title">빛의 상태</Typography>
      <TextField
        className="sunlight-status-textfield"
        multiline
        rows={5}
        value={sunlightStatusText}
        onChange={(e) => setSunlightStatusText(e.target.value)}
        variant="outlined"
      />
    </Box>

    <Button variant="contained" className="save-button" onClick={handleSave}>저장</Button>

    <Box className="sunlight-log-section">
      <Box className="log-header">
        <IconButton className="log-toggle-icon">
          <CheckBoxIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography className="log-title">일조량 일지</Typography>
        <IconButton className="log-dropdown-arrow">
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      <Box className="log-entry">
        <Box className="log-details">
          {/* 로그 내용 추가 예정 */}
        </Box>
        <Box className="log-actions">
          <Button variant="text" className="log-action-button">삭제</Button>
          <Button variant="text" className="log-action-button">수정</Button>
        </Box>
      </Box>
    </Box>
  </Box>
);

const PlantSunlighting = () => {
  const [saveSunlightInfo] = useSaveSunlightInfoMutation();
  const [plantId, setplantId] = useState('1'); // 예시를 위해 임시 plantId 설정
  const [plantName, setPlantName] = useState('몬스테라');
  const [purchaseDate, setPurchaseDate] = useState('2023-01-15');
  const [currentTab, setCurrentTab] = useState(1);
  const [sunlightStatusText, setSunlightStatusText] = useState('');
  const [selectedSunlight, setSelectedSunlight] = useState(null);

  // 실제 plantId와 plantName, purchaseDate를 불러오는 로직이 필요합니다.
  // useEffect(() => {
  //   // 예: API 호출하여 식물 정보 가져오기
  //   // const fetchedPlantId = ...;
  //   // const fetchedPlantName = ...;
  //   // const fetchedPurchaseDate = ...;
  //   // setplantId(fetchedPlantId);
  //   // setPlantName(fetchedPlantName);
  //   // setPurchaseDate(fetchedPurchaseDate);
  // }, []);


  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSave = () => {
    console.log("저장 버튼 클릭됨"); // 이게 콘솔에 안 찍히면 버튼 문제
    // 백엔드의 Plant 모델 필드명에 맞게 formData 구성
    const formData = {
      plantId: plantId,
      sunlightStatus: selectedSunlight, // 백엔드의 sunlightStatus 필드에 매핑
      sunlightMemo: sunlightStatusText // 백엔드의 sunlightMemo 필드에 매핑
    };

    // 각 변수의 값과 최종 formData 객체를 콘솔에 출력
    console.log('--- 일조량 정보 저장 시도 ---');
    console.log('plantId:', plantId);
    console.log('selectedSunlight (일조상태 ID):', selectedSunlight);
    console.log('sunlightStatusText (빛의 상태 메모):', sunlightStatusText);
    console.log('전송될 formData (페이로드):', formData);
    console.log('------------------------------');

    saveSunlightInfo(formData)
      .unwrap()
      .then(res => {
        console.log('응답:', res);
        alert(res.message);
      })
      .catch(err => {
        console.error(err);
        alert('저장 실패');
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-care-container">
        <Button variant="contained" className="edit-top-button">수정</Button>

        <Box className="plant-info-header">
          <Box className="plant-details">
            <Box className="plant-detail-row">
              <Typography className="plant-label">식물 이름</Typography>
              <Box className="plant-value-box">
                <Typography sx={{ fontSize: '0.8rem', textAlign: 'center' }}>{plantName}</Typography>
              </Box>
            </Box>
            <Box className="plant-detail-row">
              <Typography className="plant-label">입수일 날짜</Typography>
              <Box className="plant-value-box">
                <Typography sx={{ fontSize: '0.8rem', textAlign: 'center' }}>{purchaseDate}</Typography>
              </Box>
            </Box>
          </Box>
          <Avatar src="/plant.png" className="plant-avatar" />
        </Box>

        <Box className="tab-menu-container">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="plant-care-tabs"
            TabIndicatorProps={{ style: { backgroundColor: 'black' } }}
          >
            <Tab label="물주기" />
            <Tab label="일조량" />
            <Tab label="분갈이" />
            <Tab label="병충해" />
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          {currentTab === 0 && <PlantWatering tabName="물주기" />}
          {currentTab === 1 && <PlantSunlighting tabName="일조량" />}
          {currentTab === 2 && <PlantRepotting tabName="분갈이" />}
          {currentTab === 3 && <PlantPest tabName="병충해" />}
        </Box>
        <SunlightContent
          sunlightStatusText={sunlightStatusText}
          setSunlightStatusText={setSunlightStatusText}
          selectedSunlight={selectedSunlight}
          setSelectedSunlight={setSelectedSunlight}
          handleSave={handleSave}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default PlantSunlighting;