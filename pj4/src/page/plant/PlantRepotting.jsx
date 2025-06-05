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
import PlantWatering from './PlantWatering';
import PlantSunlighting from './PlantSunlighting';

const PlantRepotting = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const [sunlightStatusText, setSunlightStatusText] = useState();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const SunlightContent = () => (
    <Box className="sunlight-tab-content">
      <Box className="light-status-section">
        <Typography className="light-status-title">흙종류</Typography>
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
          <Typography className="log-title">기록 리스트</Typography>
          <IconButton className="log-dropdown-arrow">
            <ArrowDropDownIcon />
          </IconButton>
        </Box>

        <Box className="log-entry">
          <IconButton className="log-checkbox">
            <CheckBoxIcon sx={{ fontSize: 20 }} />
          </IconButton>
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
              <Box className="plant-value-box">
              </Box>
            </Box>
            <Box className="plant-detail-row">
              <Typography className="plant-label">입수일 날짜</Typography>
              <Box className="plant-value-box">
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
            TabIndicatorProps={{ style: { backgroundColor: '#4CAF50' } }}
          >
            <Tab label="물주기" />
            <Tab label="일조량" />
            <Tab label="분갈이" />
            <Tab label="병충해" />
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          {currentTab === 0 && <PlantWatering />}
          {currentTab === 1 && <PlantSunlighting />}
          {currentTab === 2 && <PlantRepotting />}
          {currentTab === 3 && <OtherTabContent tabName="병충해" />}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantRepotting;