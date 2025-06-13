import React, { useState, useEffect } from 'react';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import {
  Box, Typography, TextField, Button, Switch, FormControlLabel, MenuItem, Select,
  Card, CardContent, IconButton
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { koKR } from '@mui/x-date-pickers/locales';

import { FaTint } from 'react-icons/fa';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import '../../css/plantWatering.css'; // Make sure this CSS file exists
import Combo from '../combo/combo'; // 이 경로가 정확한지 확인하세요.
import { 
  useAlarmCreateMutation,
  useAlarmOneListQuery,
  useAlarmUpdateMutation,
  useAlarmAllUpdateMutation
} from "../../features/alarm/alarmApi";
import { useSelector } from "react-redux";
import { useSearchParams } from 'react-router-dom';
import Days from 'react-calendar/dist/MonthView/Days';

const PlantWatering = () => {
  const user = useSelector((state) => state.user.user);
  const [searchParams] = useSearchParams();
  const plantId = searchParams.get('id');    // 식물아이디 plantId parm에 저장

  const { showAlert } = useCmDialog();
  const { data, error, isLoading, refetch } = useAlarmOneListQuery({
    petId: plantId,     // plantId 아이디조회  백단에서 이 아이디로만든 알람있으면 update, 없으면 insert
    category:"PLA"
  });
  const [alarmUpdate] = useAlarmUpdateMutation();             // 토글수정  활성화만 Y , N 수정
  const [alarmAllUpdate] = useAlarmAllUpdateMutation();       // 모든알람데이터수정
  const [alarmList, setAlarmList] = useState();
  const [alarmCycle, setAlarmCycle] = useState('');   // 선택된 물주기
  const [AlarmCreate] = useAlarmCreateMutation({});
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmToggle, setAlarmToggle] = useState(true);
  const newFormattedTimes = [];

  useEffect(() => {
    alarmSet();
  }, []);

  const alarmSet = async () => {
     
    try {
      const response = await refetch();
      console.log('aaaaaaa', response);
      console.log("response.data:", response.data);
      console.log("response.data.success:", response.data.success, typeof response.data.success);
      console.log("response.data.data:", response.data.data, Array.isArray(response.data.data));

      if (response.data && Array.isArray(response.data?.data) && response.data.success) {
      console.log('전체 알람 리스트:', response.data.data);

      const alarms = response.data.data.map((alarm) => {
        const alarmId = parseInt(alarm.alarmId, 10);
        const petId = parseInt(alarm.petId, 10);
        const year = 2000 + parseInt(alarm.year, 10);
        const month = alarm.month;
        const day = parseInt(alarm.day, 10);
        const hour = parseInt(alarm.hour, 10);
        const min = parseInt(alarm.min, 10);
        const daysDate = dayjs(alarm.startDate);               // 불러온 세팅날짜 dayjs 로
        const daysTime = dayjs(alarm.alarmTime, 'HH:mm');      // 불러온 세팅시간 dayjs 로

        setAlarmDate(daysDate);        // 알람리스트가 있으면 초기 alarmdate설정
        setAlarmTime(daysTime);        // 알람리스트가 있으면 초기 alarmtime설정


        let cycleDays = 0;
        switch (alarm.alarmCycle) {
          case 'A01': cycleDays = 1; break;
          case 'A02': cycleDays = 2; break;
          case 'A03': cycleDays = 3; break;
          case 'A04': cycleDays = 5; break;
          case 'A05': cycleDays = 7; break;
          case 'A06': cycleDays = 14; break;
          default: cycleDays = 0;
        }

        let isactive;
        switch (alarm.activeYn) {
          case 'Y': isactive = true; break;
          case 'N': isactive = false; break;
        }

        // 시간 문자열 생성
        const formatted = `${year}-${month}-${day} ${hour}:${min} (주기: ${cycleDays}일)`;
        newFormattedTimes.push(formatted);

        return {
          alamrCycleCode : alarm.alarmCycle,
          daysDate,
          daysTime,
          type: "SET_ALARM",
          alarmId,
          petId,
          year,
          month,
          day,
          hour,
          min,
          alarmCycle: cycleDays,
          enabled: isactive,  // 초기에는 켜져있다고 가정
          message: "알람아이디 : " + alarmId + " // " + cycleDays + "분주기"
          // message: "물 주는 시간입니다!"
        };
      });

      setAlarmList(alarms);
      

      // Android로 넘길 때는 enabled=true인 것만 필터해서 JSON 변환
      const activeData = alarms.filter(alarm => alarm.enabled === true);
      const alarmData = JSON.stringify(activeData);


        try {
          if (window.Android && window.Android.AlarmSet) {
            window.Android.AlarmSet(alarmData);
          } else {
            console.warn("Android 인터페이스를 찾을 수 없습니다.");
          }
        } catch (e) {
          console.error("Android Alarm 호출 중 오류:", e);
          alert("Android Alarm 호출 중 오류:");
        }


      } else {
        showAlert('데이터조회실패1');
        console.log('응답 구조 이상:', response.data);
      }
    } catch (error) {
      showAlert('데이터조회실패2');
      console.error(error);
    }
  };


  const alarmCreate = async () => {
    console.log("alarmCreate 실행");
    console.log("alarmTime : " + alarmTime+"\n"+
          "alarmDate : " + alarmDate);
    const data = {
      petId: 1,     // << 변수값 넣으면됨  
      alarmName: "WaterAlarm",
      alarmCycle: alarmCycle,
      alarmTime: alarmTime.format('HH:mm'),
      startDate: alarmDate.format('YY/MM/DD'),
      type: "WAT",           // 먹이종류 때문에 NOT NULL 이라 임의값 넣음.
      category: "PLA",       // 식물물주기는 PLA    동물먹이는 ANI
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


  const alarmAllUpdateSend = async () => {
    console.log("alarmAllUpdate 실행");
    console.log("alarmCycle : " + alarmCycle);

    // 서버 상태 업데이트
    try {
      await alarmAllUpdate({
        alarmId: alarmList[0].alarmId,
        petId: alarmList[0].petId,
        alarmCycle: alarmCycle,
        alarmTime: alarmTime.format('HH:mm'),
        startDate: alarmDate.format('YY/MM/DD'),
        category: "PLA", // 혹은 "ANI"
      });

      console.log(`서버 알람 ${alarmList[0].alarmId} 상태 업데이트 완료`);

      // 프론트 상태 업데이트 (불필요한 필드는 생략 가능)
      setAlarmList([
        {
          ...alarmList[0],
          alarmCycle: alarmCycle,
          alarmTime: alarmTime.format('HH:mm'),
          startDate: alarmDate.format('YY/MM/DD'),
        },
      ]);
    } catch (err) {
      console.error('알람 업데이트 실패', err);
      showAlert('알람 상태 업데이트 실패');
    }
  };

  const toggleAlarm = (alarmId) => {
    console.log("toggleAlarm 실행");
    setAlarmList(prevList =>
      prevList.map(alarm => {
        if (alarm.alarmId === alarmId) {
          const newEnabled = !alarm.enabled;

          if (newEnabled) {
            // 알람 켜기 - Android AlarmSet 호출
            if (window.Android && window.Android.AlarmSet) {
              const alarmData = JSON.stringify([alarm]);
              window.Android.AlarmSet(alarmData);
            }
          } else {
            // 알람 끄기 - Android cancelAlarm 호출
            if (window.Android && window.Android.cancelAlarm) {
              window.Android.cancelAlarm(String(alarmId));
            }
          }

          // 2. 서버 상태 업데이트
          alarmUpdate({
            alarmId: alarm.alarmId,
            activeYn: newEnabled ? 'Y' : 'N'
          }).unwrap()
            .then(() => {
              console.log("alarmUpdate 실행");
              console.log(`서버 알람 ${alarmId} 상태 업데이트 완료`);
            })
            .catch(err => {
              console.error('알람 업데이트 실패', err);
              showAlert('알람 상태 업데이트 실패');
            });

          // 3. 프론트 상태 변경
          return { ...alarm, enabled: newEnabled };
        }
        return alarm;
      })
    );
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
            
            <Combo
              groupId="AlarmCycle"
              onSelectionChange={setAlarmCycle}
              defaultValue={alarmList?.[0]?.alamrCycleCode}
            />
            {/* </Select> */}

            <TimePicker
            label="알림 시간"
            value={alarmList?.[0]?.daysTime ?? alarmTime}
            onChange={(newValue) => {
              setAlarmTime(newValue);
              setAlarmList(prev => {
                const updated = [...prev];
                updated[0] = { ...updated[0], daysTime: newValue };
                return updated;
              });
            }}
            ampm
            />

            <FormControlLabel
              control={
                <Switch
                  checked={alarmList?.[0]?.enabled}
                  onChange={() => toggleAlarm(alarmList[0].alarmId)}
                  color="primary"
                  inputProps={{ 'aria-label': 'toggle alarm' }}
                />
              }
              label=""
              className="alarm-toggle"
            />
          </Box>

          <Box className="alarm-date-row">
            <DatePicker
              label="알림 날짜"
              value={alarmList?.[0]?.daysDate ?? alarmDate}
              onChange={(newValue) => {
                setAlarmDate(newValue);
                setAlarmList(prev => {
                  const updated = [...prev];
                  updated[0] = { ...updated[0], daysDate: newValue };
                  return updated;
                });
              }}

              renderInput={(params) => <TextField size="small" {...params} fullWidth />}
            />
          </Box>

          {/* 알람아이디확인 */}
          <div>알람번호 : {alarmList?.[0]?.alarmId}  <br/>
               펫아이디 : {alarmList?.[0]?.petId}
          </div>

          <Box className="save and allupdate-button-container">
            {user && (
              alarmList?.length > 0 ? (
                <Button
                  variant="contained"
                  className="saveAndAllUpdateBt"
                  onClick={alarmAllUpdateSend}>
                수정</Button>
              ) : (
                <Button
                  variant="contained"
                  className="saveAndAllUpdateBt"
                  onClick={alarmCreate}>
                저장</Button>
              )
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