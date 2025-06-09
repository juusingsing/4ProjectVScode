import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Avatar, Tabs, Tab, IconButton, Checkbox
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { PhotoCamera } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../css/plantSunlighting.css';

import PlantWatering from './PlantWatering'; // 물주기 탭
import PlantSunlighting from './PlantSunlighting'; // 일조량 탭
import PlantRepotting from './PlantRepotting'; // 분갈이 탭

//메인 컴포넌트
const PlantPest = () => {
  const [currentTab, setCurrentTab] = useState(3); // 병충해 탭 기본 선택
  const [date, setDate] = useState(null);
  const [memo, setMemo] = useState('');
  const [image, setImage] = useState(null);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // 저장 로직 구현 예정
    console.log('저장:', { date, memo, image });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="pest-tab-content">
        {/* 병충해 입력 영역 */}
        <Box className="repotting-tab-content">
          <Typography variant="h6">병충해 날짜</Typography>
          <DatePicker
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ mt: 1, mb: 2, width: '100%' }}
          />

          <Typography variant="h6">사진</Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
            sx={{ my: 2 }}
          >
            업로드
            <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
          </Button>
          {image && <img src={image} alt="upload" style={{ width: '100%', maxHeight: 150, objectFit: 'cover' }} />}

          <Typography variant="h6">메모</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>저장</Button>
        </Box>

        {/* 기록 리스트 토글 */}
        <Box display="flex" alignItems="center" mt={4}>
          <Typography variant="h6">기록 리스트</Typography>
          <IconButton className="log-dropdown-arrow">
            <ArrowDropDownIcon />
          </IconButton>
        </Box>
      </Box>

       <Box className="tab-content-display">
            {currentTab === 0 && <PlantWatering tabName="물주기" />}
            {currentTab === 1 && <PlantSunlighting tabName="일조량" />}
            {currentTab === 2 && <PlantRepotting tabName="분갈이" />}
        </Box>

    </LocalizationProvider>
  );
};

export default PlantPest;
