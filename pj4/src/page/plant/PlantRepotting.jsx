import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, Tabs, Tab, IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FaSun, FaTint, FaCloud, FaSnowflake } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../css/plantRepotting.css';

import PlantWatering from './PlantWatering'; // 물주기 탭
import PlantSunlighting from './PlantSunlighting'; // 일조량 탭
import PlantPest from './PlantPest'; // 병충해 탭

// 메인 컴포넌트
const PlantRepotting = () => {
  const [currentTab, setCurrentTab] = useState(2); // 일조량 탭이 기본 선택
  const [repottingSoilText,setRepottingSoilText] = useState('');
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="repotting-tab-content">
        <Typography className="repotting-label">분갈이 날짜</Typography>
        <TextField type="date" fullWidth sx={{ mt: 2, mb: 2 }} />

        <Typography className="plant-repotting-soil-condition">흙종류</Typography>
        <TextField
          className="repotting-soil-textfield"
          multiline
          rows={5}
          value={repottingSoilText}
          onChange={(e) => setRepottingSoilText(e.target.value)}
          variant="outlined"
         />

        <Typography className="plant-repotting-memo">메모</Typography>
        <TextField
          className="repotting-soil-textfield"
          multiline
          rows={5}
          value={repottingSoilText}
          onChange={(e) => setRepottingSoilText(e.target.value)}
          variant="outlined"
         />

        <Button variant="contained" className="save-button">저장</Button>
        
        <Typography className="log-title">기록리스트</Typography>
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
        
     
        <Box className="tab-content-display">
          {currentTab === 0 && <PlantWatering tabName="물주기" />}
          {currentTab === 1 && <PlantSunlighting tabName="일조량" />}
          {currentTab === 3 && <PlantPest tabName="병충해" />}
        </Box>


    </LocalizationProvider>
  );
};

export default PlantRepotting;
