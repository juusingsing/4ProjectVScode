import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  InputBase
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { Tabs, Tab } from '@mui/material';
import Combo from '../../page/combo/combo';
import { useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';

import { useComboListByGroupQuery } from '../../features/combo/combo';
const FormRow = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  let backgroundColor = '#E0E0E0';
  let border = '1px solid #ccc';
  let borderRadius = '20px';
  let textDecoration = 'none';
  let fontWeight = 'normal';
  let color = 'inherit';
  let minHeight = undefined;

  if (fieldKey === 'notes') {
    backgroundColor = '#D9D9D9';
    fontWeight = 'bold';
    color = '#000';
    minHeight = 80;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:30, top: 7 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: 'center',
            fontSize: '8px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          top: 7,
          left: '20px',  
          width: '70px',
          height: '20px',
          backgroundColor,
          border,
          borderRadius,
          px: 1,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};
const FormRow1 = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  let backgroundColor = '#E0E0E0';
  let border = '1px solid #ccc';
  let borderRadius = '20px';
  let textDecoration = 'none';
  let fontWeight = 'normal';
  let color = 'inherit';
  let minHeight = undefined;

  if (fieldKey === 'notes') {
    backgroundColor = '#D9D9D9';
    fontWeight = 'bold';
    color = '#000';
    minHeight = 80;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 'normal', mt: multiline ? '6px' : 0, position: 'relative', left:20, top: 5 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: 'center',
            fontSize: '14px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          left: '100px',  
          width: '142px',
          height: '30px',
          backgroundColor,
          border,
          borderRadius: '11px',
          px: 1,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};

const DateInputRow = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography
        sx={{
          width: 66, // 넉넉한 고정 너비
          fontSize: 14,
          fontWeight: 500,
          textAlign: 'center',
          mr: -1, // label과 DatePicker 사이 간격
        }}
      >
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          value={value}
          onChange={onChange}
          format="YYYY.MM.DD"
          slotProps={{
            textField: {
              variant: 'outlined',
              size: 'small',
              fullWidth: false,
              InputProps: {
                readOnly: true,
                sx: {
                
                  left: 133,
                  width: 141,
                  height: 30,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'normal',
                  pr: '12px',
                  pl: '12px',
                  '& input': {
                    textAlign: 'center',
                    padding: 0,
                  },
                },
              },
              inputProps: {
                style: {
                  textAlign: 'center',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
const TimeInputRow = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography
        sx={{
          width: 66, // 넉넉한 고정 너비
          fontSize: 14,
          fontWeight: 500,
          textAlign: 'center',
          mr: -1, // label과 DatePicker 사이 간격
        }}
      >
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <TimePicker
          value={value}
          onChange={onChange}
          format="HH:mm:ss"
          slotProps={{
            textField: {
              variant: 'outlined',
              size: 'small',
              fullWidth: false,
              InputProps: {
                readOnly: true,
                sx: {
                
                  left: 133,
                  width: 141,
                  height: 30,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'normal',
                  pr: '12px',
                  pl: '12px',
                  '& input': {
                    textAlign: 'center',
                    padding: 0,
                  },
                },
              },
              inputProps: {
                style: {
                  textAlign: 'center',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
const Pet_Form_Eat_Alarm = () => { 
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [animalId, setAnimalId] = useState(null);
  const [alarmId, setAlarmId] = useState('');
  const [alarmName, setAlarmName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [alarmTime, setAlarmTime] = useState(dayjs());
  const [startDate, setStartDate] = useState(dayjs());
  const [isActive, setIsActive] = useState('');
  const [category, setCategory] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState('');
  const { data: comboData, isLoading: comboLoading } = useComboListByGroupQuery('AlarmCycle');
  const alarmNameRef = useRef();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idFromQuery = searchParams.get('animalId');
    if (idFromQuery) {
      setAnimalId(idFromQuery);
    }
  }, [location.search]);
  useEffect(() => {
    if (comboData?.data) {
    const map = {};
    comboData.data.forEach(item => {
        map[item.codeId] = item.codeName;
    });
    //setTreatmentTypeMap(map);
    }
  }, [comboData]); 
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    
  };

   
  

  return (
  <Box>
    {/* 전체 폼 박스 */}
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 360, // Android 화면 폭
        height: 640,   // Android 화면 높이
        margin: '0 auto',
        overflowY: 'auto', // 스크롤 가능하게
        borderRadius: '12px',
        backgroundColor: '#fff',
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        padding: 2,
      }}
    >
      {/* 왼쪽 입력 */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1">동물 이름</Typography>
          <Typography>{animalName}</Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1">입양일</Typography>
          <Typography>{animalAdoptionDate}</Typography>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bottom: 3,
              left: 25,
              backgroundColor: '#88AE97',
              borderRadius: '30px',
              width: 150,
              height: 20,
              px: 6,
              py: 1.5,
              fontSize: 13,
              fontWeight: 'bold',
            }}
          >
            산책하기
          </Button>
        </Box>
      </Box>
             {/* 오른쪽 이미지 */}
      <Box sx={{ position: 'relative', left: '35px', top: 8 }}>
        <Box
          sx={{
            width: 100,
            height: 76,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid white',
            backgroundColor: '#A5B1AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      <Button
                variant="contained"
                size="small"
                sx={{
                  position: 'relative',
                  top: -101,
                  right: -80,
                  backgroundColor: '#889F7F',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'normal',
                  borderRadius: '55%',
                  width: 40,
                  height: 26,
                  minWidth: 'unset',
                  padding: 0,
                  zIndex: 2,
                  textTransform: 'none',
                }}
                component="label"
              >
                수정
                <input
                  type="file"
                  accept="image/*"
                  hidden
                 
                />
              </Button>
        </Box>
    </Box>
   
    {/* ✅ 탭은 폼 바깥에 위치 */}
    {/* 폼 컴포넌트 아래 탭 - 간격 좁히기 */}
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: -70 }}>
        <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
            width: 360,
            minHeight: '36px',
            '& .MuiTab-root': {
                fontSize: '13px',
                color: '#777',
                fontWeight: 500,
                minHeight: '36px',
                borderBottom: '2px solid transparent',
            },
            '& .Mui-selected': {
                color: '#000',
                fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
                backgroundColor: '#000',
            },
            }}
        >
            <Tab label="병원진료" />
            <Tab label="먹이알림" />
            <Tab label="훈련/행동" />
        </Tabs>
    </Box>
    <Box sx={{ position: 'relative', left: '35px', top: 8 }}>
        <Typography>먹이알림 설정</Typography>
    </Box>
    <FormRow1 label="알림 이름" value={alarmName} onChange={setAlarmName} inputRef={alarmNameRef}/>
    주기 <Combo
        key={frequency || 'default'} // ← 이 줄이 중요합니다!
        groupId="AlarmCycle"
        value={frequency}
        onSelectionChange={(val) => setFrequency(val)}
    />
    <TimeInputRow label="시각" value={alarmTime} onChange={setAlarmTime} />
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#556B2F', borderRadius: '20px', px: 4, py: 1, fontSize: 14 }}>
            알림 등록
        </Button>
    </Box>
    <DateInputRow label="알림 날짜" value={startDate} onChange={setStartDate} />
    </Box>
  
);
};
export default Pet_Form_Eat_Alarm; 