import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Switch, FormControlLabel, MenuItem, Select,
  Card, CardContent, IconButton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FaTint } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import '../../css/plantWatering.css'; // Make sure this CSS file exists
import Combo from '../combo/combo'; // 이 경로가 정확한지 확인하세요.

const PlantWatering = () => {
  const [alarmCycle, setAlarmCycle] = useState('');   // 선택된 물주기
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmToggle, setAlarmToggle] = useState(true);
  const [cycle, setCycle] = useState('주1회');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card className="care-section-card">
        <CardContent>
          <Typography className="section-title">알림 설정 🔔</Typography>

          <Box className="alarm-setting-row">
            {/* <Select
              size="small"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}v
              className="alarm-select"
            > */}
            <Combo groupId="AlarmCycle"
            onSelectionChange={setAlarmCycle}
            />
            {/* </Select> */}

            <TimePicker
              label="시간"
              value={alarmTime}
              onChange={(newValue) => setAlarmTime(newValue)}
              ampm
              renderInput={(params) => <TextField size="small" {...params} className="alarm-time-picker" />}
            />

            <FormControlLabel
              control={
                <Switch checked={alarmToggle} onChange={() => setAlarmToggle(!alarmToggle)} />
              }
              label=""
              className="alarm-toggle"
            />
          </Box>

          <Box className="alarm-date-row">
            <DatePicker
              label="알림 날짜"
              value={alarmDate}
              onChange={(newValue) => setAlarmDate(newValue)}
              renderInput={(params) => <TextField size="small" {...params} fullWidth />}
            />
          </Box>

          <Box className="save-button-container">
            <Button variant="contained" className="save-button">저장</Button>
          </Box>
        </CardContent>
      </Card>

      <Card className="care-section-card">
        <CardContent>
          <Typography className="section-title">💧 물주기 기록</Typography>

          <Box className="water-log-action">
            <Button variant="contained" className="watered-button">물 줬어요!</Button>
          </Box>

          <Box className="record-list-section">
            <Typography className="record-list-title">📋 기록 리스트</Typography>

            <Box className="log-entry">
              <IconButton className="log-checkbox">
                <CheckBoxIcon sx={{ fontSize: 20 }} />
              </IconButton>
              <div className="log-details">
                <Typography className="log-date-icon">
                  <FaTint style={{ marginRight: 4, fontSize: '0.9rem' }} />
                  2025.03.25
                </Typography>
                <Typography className="log-description">
                  물 주기 완료.
                </Typography>
              </div>
              <div className="log-actions">
                <Button variant="text" className="log-action-button">삭제</Button>
                <Button variant="text" className="log-action-button">수정</Button>
              </div>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default PlantWatering;