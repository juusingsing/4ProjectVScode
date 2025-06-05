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
import { useAlarmCreateMutation } from "../../features/alarm/alarmApi";
import { useSelector } from "react-redux";

const PlantWatering = () => {
  const user = useSelector((state) => state.user.user);
  const [alarmCycle, setAlarmCycle] = useState('');   // 선택된 물주기
  const [AlarmCreate] = useAlarmCreateMutation({});
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmToggle, setAlarmToggle] = useState(true);

  const AlarmSave = async () => {

    const data = {
      startDate: alarmDate.format('YY/MM/DD'),
      alarmTime: alarmTime.format('HH:mm'),
      alarmCycle: alarmCycle,
    };
     
    try {
      const response = await AlarmCreate(data).unwrap();
      console.log("응답 내용 >>", response); // 여기에 찍히는 걸 확인해야 해!
      alert("등록성공ㅎㅎㅎ");
      

    } catch (error) {
      console.error("요청 실패:", error);
      alert("등록실패!!!!!!!!!!");
    }

    

  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card className="care-section-card">
        <CardContent>
          <Typography className="section-title">알림 설정 🔔</Typography>

          <Box className="alarm-setting-row">
            {/* <Select
              size="small"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
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
            {user && (
            <Button variant="contained" className="save-button" onClick={AlarmSave}>저장</Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box className="log-entry">
        알람 날짜: {alarmDate ? alarmDate.format('YY/MM/DD') : '날짜 없음'}   <br/>
        알람 주기: {alarmCycle ? alarmCycle : '주기 없음'}                      <br/>
        알람 시간: {alarmTime ? alarmTime.format('HH:mm') : '시간 없음'}        <br/>
      </Box>

      <Card className="care-section-card">
        <CardContent>
          <Typography className="section-title">💧 물주기 기록</Typography>

          <Box className="water-log-action">
            <Button variant="contained" className="watered-button">물 줬어요!</Button>
          </Box>

          <Box className="record-list-section">
            <Typography className="record-list-title">📋 기록 리스트</Typography>

            <Box className="log-entry">
              
            </Box>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default PlantWatering;