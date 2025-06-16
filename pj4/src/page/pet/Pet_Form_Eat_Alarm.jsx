import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  InputBase,
  TextField
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { Tabs, Tab } from '@mui/material';
import Combo from '../../page/combo/combo';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { useGetPetByIdQuery } from '../../features/pet/petApi';
import { 
  useAlarmCreateMutation,
  useAlarmListQuery,
} from "../../features/alarm/alarmApi";


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

const Pet_Form_Eat_Alarm = () => { 
  const navigate = useNavigate();
  const location = useLocation();

   const pathToTabIndex = {
    '/pet/petFormHospital.do': 0,
    '/pet/petFormEatAlarm.do': 1,
    '/pet/petFormTrainingAndAction.do': 2,
  };


  const [AlarmCreate] = useAlarmCreateMutation({});


  const [selectedTab, setSelectedTab] = useState(0);
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get('id');    // 식물아이디 plantId parm에 저장
  const [alarmId, setAlarmId] = useState('');
  const [alarmName, setAlarmName] = useState('');
  const [frequency, setFrequency] = useState('');
  const newFormattedTimes = [];
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmList, setAlarmList] = useState();
  const [isActive, setIsActive] = useState('');
  const { showAlert } = useCmDialog();
  const [animalName, setAnimalName] = useState('');
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(dayjs());
  const { data, isLoading: isPetLoading } = useGetPetByIdQuery(animalId, {
      skip: !animalId,
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const safeUrl = existingImageUrl || '';

  const alarmNameRef = useRef();
  const [alarmCycle, setAlarmCycle] = useState('');   // 선택된 주기
  const { data: dbAlarmList, error, isLoading, refetch } = useAlarmListQuery({
    petId: animalId,     // plantId 아이디조회  백단에서 이 아이디로만든 알람있으면 update, 없으면 insert
    category:"ANI"
  });

  useEffect(() => {
    alarmSet();
  }, []);

  const alarmSet = async () => {
      // 알람아이디없으면 catch 로감
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


const tabIndexToPath = [
    `/pet/petFormHospital.do?animalId=${animalId}`,
    `/pet/petFormEatAlarm.do?animalId=${animalId}`,
    `/pet/petFormTrainingAndAction.do?animalId=${animalId}`,
  ];


  console.log("동물 ID 확인:", animalId); // → 8이어야 정상
  useEffect(() => {
  if (data?.data) {
      const fetchedPet = data.data;
      setAnimalName(fetchedPet.animalName || '');
      
      setAnimalAdoptionDate(fetchedPet.animalAdoptionDate ? dayjs(fetchedPet.animalAdoptionDate) : null);
      
      // 서버에서 받아온 이미지 URL 저장
      
    if (fetchedPet.fileUrl) {
      setExistingImageUrl(fetchedPet.fileUrl);  // 이미 전체 URL임
    }
  }
    console.log("✅ RTK Query 응답 data:", data);
    console.log("existingImageUrl:", existingImageUrl);
    console.log("imageFile:", imageFile);
  }, [data]);
  

  const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
      navigate(tabIndexToPath[newValue]);
  };
  
  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setSelectedTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);
    // 각 경로에 대응하는 탭 인덱스 설정
 

    //수정창으로 보내기
  const handleSubmit = async (e) => {
    e.preventDefault();

  };   


  const alarmCreate = async () => {
    console.log("alarmCreate 실행");
    console.log("alarmTime : " + alarmTime+"\n"+
          "alarmDate : " + alarmDate);
    const data = {
      petId: animalId,     // << 변수값 넣으면됨  
      alarmName: alarmName,
      alarmCycle: alarmCycle,
      alarmTime: alarmTime.format('HH:mm'),
      startDate: alarmDate.format('YY/MM/DD'),
      type: "WAT",
      category: "ANI",       // 식물물주기는 PLA    동물먹이는 ANI
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
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
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
            <Typography>{animalAdoptionDate?.format('YYYY-MM-DD')}</Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/pet/walk.do?id=${animalId}`)}
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
            src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl}
            key={imageFile ? imageFile.name : existingImageUrl} // key로 강제 리렌더링 유도
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
            onClick={() => {
              navigate(`/pet/petFormUpdate.do?animalId=${animalId}`);
            }}
          >
            수정
          </Button>
        </Box>
      </Box>

      {/* /////////////////////////////////////////////////////// */}
      {/* /////////////////////////////////////////////////////// */}

    
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

      <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 2 }}>

        <Box sx={{ position: 'relative', left: '35px', top: 8 }}>
            <Typography>먹이알림 설정</Typography>
        </Box>

        <FormRow1 label="알림 이름" value={alarmName} onChange={setAlarmName} inputRef={alarmNameRef}/>
        주기 <Combo
            groupId="AlarmCycle"
            onSelectionChange={setAlarmCycle}
            defaultValue={alarmList?.[0]?.alamrCycleCode}
        />

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

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button onClick={alarmCreate} variant="contained" sx={{ backgroundColor: '#556B2F', borderRadius: '20px', px: 4, py: 1, fontSize: 14 }}>
                알림 등록
            </Button>
        </Box>

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
    </Box> 
  </LocalizationProvider>
  </>
);
};
export default Pet_Form_Eat_Alarm; 