import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, Tabs, Tab, IconButton, FormControl, MenuItem, Select
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FaSun, FaTint, FaCloud, FaSnowflake } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../css/plantSunlighting.css';

import PlantWatering from './PlantWatering'; // PlantWatering 컴포넌트 불러오기
import PlantRepotting from './PlantRepotting'; // PlantRepotting 컴포넌트 불러오기

const PlantSunlighting = () => {
  // '일조량' 탭이 기본으로 선택되도록 1로 설정합니다.
  const [currentTab, setCurrentTab] = useState(1);
  // 일조상태 텍스트의 초기값을 설정합니다.
  const [sunlightStatusText, setSunlightStatusText] = useState('');

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // 일조량 탭의 내용을 정의하는 함수 컴포넌트
  const SunlightContent = () => (
    <Box className="sunlight-tab-content">
      <Box className="daily-status-section">
        <Typography className="status-label">일조상태</Typography>
        <div className="icon-group">
          <FaSun className="status-icon" />
          <FaTint className="status-icon" />
          <FaCloud className="status-icon" />
          <FaSnowflake className="status-icon" />
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
          InputProps={{ readOnly: false }}
        />
      </Box>

      <Button variant="contained" className="save-button">
        저장
      </Button>

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
      
          </Box>
          <Box className="log-actions">
            <Button variant="text" className="log-action-button">삭제</Button>
            <Button variant="text" className="log-action-button">수정</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // 다른 탭들의 내용을 정의하는 범용 함수 컴포넌트
  const OtherTabContent = ({ tabName }) => (
    <Box className="generic-tab-content">
      <Typography variant="h6">{tabName} 기록</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography>{tabName} 관련 기록은 여기에 표시됩니다.</Typography>
      </Box>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-care-container">
        <Button variant="contained" className="edit-top-button">수정</Button>
        <Box className="plant-info-header">
          <Box className="plant-details">
            <Box className="plant-detail-row">
              <Typography className="plant-label">식물 이름</Typography>
              <Box className="plant-value-box"
              sx={{
                width: '93px',
                height: '24px',
                left: '10px',
                background: '#D9D9D9',
                borderRadius: '10px;'
              }}>
              </Box>
            </Box>
            <Box className="plant-detail-row">
              <Typography className="plant-label">입수일 날짜</Typography>
              <Box className="plant-value-box"
              sx={{
                width: '93px',
                height: '24px',
                left: '10px',
                top: '2px',
                background: '#D9D9D9',
                borderRadius: '10px;'
              }}>
              </Box>
            </Box>
          </Box>
          <Avatar
            src="/plant.png"
            className="plant-avatar"
          />
        </Box>

        <Box className="tab-menu-container">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="plant-care-tabs"
            TabIndicatorProps={{ style: { backgroundColor: 'black' } }}
          >
            <Tab label="물주기" />   {/* 인덱스 0 */}
            <Tab label="일조량" />   {/* 인덱스 1 */}
            <Tab label="분갈이" />   {/* 인덱스 2 */}
            <Tab label="병충해" />   {/* 인덱스 3 */}
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          {currentTab === 0 && <PlantWatering tabName="물주기"/>}
          {currentTab === 1 && <SunlightContent tabName="일조량"/>}
          {currentTab === 2 && <PlantRepotting tabName="분갈이"/>}
          {currentTab === 3 && <OtherTabContent tabName="병충해" />}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantSunlighting;