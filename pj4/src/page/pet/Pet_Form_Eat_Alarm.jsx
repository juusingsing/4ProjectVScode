import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  InputBase,
  TextField,
  Switch
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
  useAlarmUpdateMutation,
  useAlarmDeleteMutation,
} from "../../features/alarm/alarmApi";
import {InputAdornment} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 'normal', mt: multiline ? '6px' : 0, position: 'relative', left:16, top: -29 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={'ex)브랜드/양'}
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
          left: '-2px',  
          top: '-35px',
          width: '240px',
          height: '35px',
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
  const [alarmUpdate] = useAlarmUpdateMutation();
  const [alarmDel] = useAlarmDeleteMutation();


  const [selectedTab, setSelectedTab] = useState(0);
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get('animalId');    // 동물아이디 animalId parm에 저장
  const [alarmName, setAlarmName] = useState('');
  const newFormattedTimes = [];
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmList, setAlarmList] = useState([]);
  const [isActive, setIsActive] = useState('');
  const { showAlert } = useCmDialog();
  const [animalName, setAnimalName] = useState('');
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(dayjs());
  const { data, isLoading: isPetLoading } = useGetPetByIdQuery(animalId, {
      skip: !animalId,
  });         // 그 동물아이디의 정보 가져오기 ( 헤더 삽입할 데이터 조회 )
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [fileUrl, setFileUrl] = useState();
   

  const alarmNameRef = useRef();
  const [eatType, setEatType] = useState('');   // 선택된 먹이
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
        const alarmName = alarm.alarmName;
        const year = 2000 + parseInt(alarm.year, 10);
        const month = alarm.month;
        const day = parseInt(alarm.day, 10);
        const hour = parseInt(alarm.hour, 10);
        const min = parseInt(alarm.min, 10);
        const daysDate = dayjs(alarm.startDate);               // 불러온 세팅날짜 dayjs 로
        const daysTime = dayjs(alarm.alarmTime, 'HH:mm');      // 불러온 세팅시간 dayjs 로


        let type = "";
        switch (alarm.type) {
          case 'E01': type = "사료"; break;
          case 'E02': type = "간식"; break;
          case 'E03': type = "영양제"; break;
          case 'E04': type = "약"; break;
          default: type = "";
        }

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
          alarmName,
          year,
          month,
          day,
          hour,
          min,
          alarmCycle: cycleDays,
          type: type,
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
    console.log("data : ", data);
  if (data?.data) {
      const fetchedPet = data.data;
      setAnimalName(fetchedPet.animalName || '');
      
      setAnimalAdoptionDate(fetchedPet.animalAdoptionDate ? dayjs(fetchedPet.animalAdoptionDate) : null);
      
      // 서버에서 받아온 이미지 URL 저장
     console.log("fileUrl", fileUrl);  
    if (fetchedPet.fileUrl) {
      setFileUrl(fetchedPet.fileUrl); // ✅ 이거 추가
      console.log("fileUrl", fetchedPet.fileUrl);
    } else {
      setExistingImageUrl('');
    }
  }

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
      type: eatType,
      category: "ANI",       // 식물물주기는 PLA    동물먹이는 ANI
    };
     
    try {
      const response = await AlarmCreate(data).unwrap();
      console.log("응답 내용 >>", response); // 여기에 찍히는 걸 확인해야 해!
      alert("등록성공ㅎㅎㅎ");

      await alarmSet();

    } catch (error) {
      console.error("요청 실패:", error);
      alert("등록실패!!!!!!!!!!");
    } 

  };


  const toggleAlarm = (alarmId) => {
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
  
  const alarmDelete = (alarmId) => {

    const isConfirmed = window.confirm('알람을 삭제하시겠습니까?');

    if (!isConfirmed) return; // 아니오를 누르면 종료
        
    // 2. 서버 상태 업데이트
    alarmDel({
      alarmId: alarmId,
      delYn: 'Y',
    }).unwrap()
      .then(() => {
        console.log(`서버 알람 ${alarmId} 상태 업데이트 완료`);

        // 알람 끄기 - Android cancelAlarm 호출
        if (window.Android && window.Android.cancelAlarm) {
          window.Android.cancelAlarm(String(alarmId));
        }

        // 프론트 상태에서 제거
        setAlarmList(prevList => prevList.filter(alarm => alarm.alarmId !== alarmId));

      })
      .catch(err => {
        console.error('알람 업데이트 실패', err);
        showAlert('알람 상태 업데이트 실패');
      });
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
              onClick={() => navigate(`/pet/walk.do?animalId=${animalId}`)}
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
              src={
                fileUrl
                  ? 'http://localhost:8081'+fileUrl
                  : imageFile
              }
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

        <Box sx={{ position: 'relative', left: '17px', top: -2 }}>
            <Typography fontWeight= 'bold' fontSize='14px'>먹이 알림 설정🔔</Typography>
        </Box>
          <Combo
            sx={{
              width: 95,
              height: 22,
              position: 'relative',
              left: 125,
              top: -40,
              borderRadius: '8px',
              border: '1px solid black',
              fontSize: '13px',
              padding: '0 8px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',

              // 내부 선택 영역 스타일
              '& .MuiSelect-select': {
                paddingRight: '0px',
                paddingLeft: '0px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                border: 'none',
              },

              // 드롭다운 화살표 아이콘 스타일
              '& .MuiSvgIcon-root': {
                position: 'absolute',
                right: 3, // 우측방향 조절
                top: '40%', //화살표 위쪽 위치
                transform: 'translateY(-50%)', //y축방향 위 아래
                fontSize: '22px', // 화살표 크기 
                pointerEvents: 'none',
              },

              // 세로줄
              '&::before': {
                content: '""',
                position: 'absolute',
                right: 24, // 아이콘 왼쪽 여백
                top: '-2px', // 세로 길이 윗부분
                bottom: '0px', // 세로 길이 아랫부분
                width: '2px', // 굵기 조절 
                
                backgroundColor: 'black',
              },
              
            }}
          groupId="EatType"
          onSelectionChange={setEatType}
        />
        <FormRow1 label="먹이 이름:" value={alarmName} onChange={setAlarmName} inputRef={alarmNameRef}/>
            
            <Typography sx={{ top: -40, position: 'relative', left: 100 }}>
                  주기
              </Typography>
            <Combo
                sx={{
                width: 80,
                height: 30,
                position: 'relative',
                left: 100,
                top: -50,
                borderRadius: '8px',
                border: '1px solid black',
                fontSize: '13px',
                padding: '0 8px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',

                // 내부 선택 영역 스타일
                '& .MuiSelect-select': {
                  paddingRight: '0px',
                  paddingLeft: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  border: 'none',
                },

                // 드롭다운 화살표 아이콘 스타일
                '& .MuiSvgIcon-root': {
                  position: 'absolute',
                  right: 3, // 우측방향 조절
                  top: '40%', //화살표 위쪽 위치
                  transform: 'translateY(-50%)', //y축방향 위 아래
                  fontSize: '22px', // 화살표 크기 
                  pointerEvents: 'none',
                },

                // 세로줄
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  right: 24, // 아이콘 왼쪽 여백
                  top: '-2px', // 세로 길이 윗부분
                  bottom: '0px', // 세로 길이 아랫부분
                  width: '2px', // 굵기 조절 
                  
                  backgroundColor: 'black',
                },
              }}
              groupId="AlarmCycle"
              onSelectionChange={setAlarmCycle}
            >
            </Combo>
        <Typography sx={{ top: -110, position: 'relative', left: 210 }}>
              주기
          </Typography>
          <TimePicker
            value={alarmTime}
            onChange={(newValue) => setAlarmTime(newValue)}
            ampm
            closeOnSelect
            slotProps={{
              textField: {
                InputProps: { readOnly: true },
                sx: { display: 'none' }, // 숨기기
              },
            }}
            renderInput={() => null}
          >
            {/* Custom Button UI */}
            <Box
              onClick={(e) => {
                // 클릭 시 focus 강제 트리거
                e.currentTarget.previousSibling.click();
              }}
              sx={{
                width: 135,
                height: 34,
                borderRadius: '20px',
                border: '1px solid black',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: 1,
                position: 'relative',
                left: 100,
                top: -50,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 13 }}>
                {alarmTime ? alarmTime.format('A h:mm') : '시간 선택'}
              </Typography>
            </Box>
          </TimePicker> 

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button onClick={alarmCreate} variant="contained" sx={{ backgroundColor: '#556B2F', borderRadius: '20px', px: 4, py: 1, fontSize: 14 }}>
                알림 등록
            </Button>
        </Box>

        <DatePicker
          label="알림 날짜"
          value={alarmDate}
          onChange={(newValue) => {
            setAlarmDate(newValue);
          }}

          renderInput={(params) => <TextField size="small" {...params} fullWidth />}
        />

      </Box>
    </Box> 
     <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        알람 시간 목록:
      </Typography>
      {alarmList.map((alarm, idx) => (
        <Typography key={idx} variant="body1" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          • {`알람이름: ${alarm.alarmName} / 먹이종류: ${alarm.type} /`} <br/>
            {`(주기: ${alarm.alarmCycle}일) ${alarm.year}-${alarm.month}-${alarm.day} ${alarm.hour}:${alarm.min}`} 
          <Switch
            checked={alarm.enabled}
            onChange={() => toggleAlarm(alarm.alarmId)}
            color="primary"
            inputProps={{ 'aria-label': 'toggle alarm' }}
          />
          <button onClick={() => alarmDelete(alarm.alarmId)}>삭제</button>
        </Typography>
      ))}
      </Box>
  </LocalizationProvider>
  </>
);
};
export default Pet_Form_Eat_Alarm; 
