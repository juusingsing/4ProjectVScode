// src/components/PlantRepotting.js

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, Tabs, Tab, IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FaSun, FaTint, FaCloud, FaSnowflake } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../css/plantSunlighting.css';

import PlantWatering from './PlantWatering'; // 물주기 탭
import PlantSunlighting from './PlantSunlighting'; // ✅ 누락된 컴포넌트 추가 import

// 분갈이 탭 내용 컴포넌트
const PlantRepottingContent = () => {

  return (
      <Box className="repotting-tab-content">
        <Typography variant="h6">분갈이 날짜</Typography>
        <TextField type="date" fullWidth sx={{ mt: 2, mb: 2 }} />

        <Typography variant="h6">분갈이 메모</Typography>
        <TextField multiline rows={4} fullWidth variant="outlined" />

        <Button variant="contained" sx={{ mt: 2 }}>저장</Button>
      </Box>
    );
  };

// 병충해 등 다른 탭 공통 컴포넌트
const OtherTabContent = ({ tabName }) => (
  <Box className="generic-tab-content">
    <Typography variant="h6">{tabName} 기록</Typography>
    <Box sx={{ mt: 2 }}>
      <Typography>{tabName} 관련 기록은 여기에 표시됩니다.</Typography>
    </Box>
  </Box>
);

// 메인 컴포넌트
const PlantRepotting = () => {
  const [currentTab, setCurrentTab] = useState(2); // 일조량 탭이 기본 선택

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-care-container">
        <Button variant="contained" className="edit-top-button">수정</Button>
        
        <Box className="plant-info-header">
          <Box className="plant-details">
            <Box className="plant-detail-row">
              <Typography className="plant-label">식물 이름</Typography>
              <Box className="plant-value-box" sx={{
                position: 'relative',
                width: '93px',
                height: '24px',
                left: '10px',
                background: '#D9D9D9',
                borderRadius: '10px'
              }} />
            </Box>
            <Box className="plant-detail-row">
              <Typography className="plant-label">입수일 날짜</Typography>
              <Box className="plant-value-box" sx={{
                position: 'relative',
                width: '93px',
                height: '24px',
                left: '10px',
                top: '2px',
                background: '#D9D9D9',
                borderRadius: '10px'
              }} />
            </Box>
          </Box>
          <Avatar src="/plant.png" className="plant-avatar" />
        </Box>

        <Box className="tab-menu-container">
           {/* 탭 메뉴 */}
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="물주기" />
          <Tab label="일조량" />
          <Tab label="분갈이" />
          <Tab label="병충해" />
        </Tabs>
        </Box>

        <Box className="tab-content-display">
          {currentTab === 0 && <PlantWatering />}
          {currentTab === 1 && <PlantSunlighting />}
          {currentTab === 2 && <PlantRepottingContent />}
          {currentTab === 3 && <OtherTabContent tabName="병충해" />}
        </Box>

      </Box>
    </LocalizationProvider>
  );
};

export default PlantRepotting;
