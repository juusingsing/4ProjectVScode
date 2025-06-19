import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import {
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";


import CheckBoxIcon from "@mui/icons-material/CheckBox";
import "../../css/plantWatering.css"; // Make sure this CSS file exists
import Combo from "../combo/combo"; // 이 경로가 정확한지 확인하세요.
//훅
import {
  useAlarmCreateMutation,
  useAlarmOneListQuery,
  useAlarmUpdateMutation,
  useAlarmAllUpdateMutation,
} from "../../features/alarm/alarmApi";
//훅
import {
  usePlantInfoQuery,
  useWaterCreateMutation,
  useWaterListQuery,
} from "../../features/plant/plantApi";

import { useSelector } from "react-redux";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const WateringContent = ({
  alarmList,
  setAlarmList,
  alarmTime,
  setAlarmTime,
  alarmDate,
  setAlarmDate,
  setAlarmCycle,
  alarmCreate,
  alarmAllUpdateSend,
  toggleAlarm,
  user,
  waterList,
  waterAdd,
  formatDate,

}) => {
  return (
    <>
      {/* 알림 설정 영역 */}
      <Card className="care-section-card">
        <CardContent>
          <Typography className="section-title">알림 설정 🔔</Typography>

          <Box className="alarm-setting-row">
            <Combo
              groupId="AlarmCycle"
              onSelectionChange={setAlarmCycle}
              defaultValue={alarmList?.[0]?.alamrCycleCode}
            />

            <TimePicker
              label="알림 시간"
              value={alarmList?.[0]?.daysTime ?? alarmTime}
              onChange={(newValue) => {
                setAlarmTime(newValue);
                setAlarmList((prev) => {
                  const safePrev = Array.isArray(prev) ? prev : [];
                  const updated = [...safePrev];
                  updated[0] = { ...updated[0], daysTime: newValue };
                  return updated;
                });
              }}
              ampm
            />

        {user && ( alarmList?.[0]?.alarmId != null ? (
            <FormControlLabel
              control={
                <Switch
                  checked={alarmList?.[0]?.enabled}
                  onChange={() => toggleAlarm(alarmList[0].alarmId)}
                  color="primary"
                />
              }
              label=""
              className="alarm-toggle"
            /> ) :(<></>))}
          </Box>

          <Box className="alarm-date-row">
            <DatePicker
              label="알림 날짜"
              value={alarmList?.[0]?.daysDate ?? alarmDate}
              onChange={(newValue) => {
                setAlarmDate(newValue);
                setAlarmList((prev) => {
                const safePrev = Array.isArray(prev) ? prev : []; // ✅ 배열 체크
                const updated = [...safePrev];
                updated[0] = { ...(updated[0] ?? {}), daysDate: newValue }; // ✅ 첫 요소 없을 때 대비
                return updated;
              });
              }}
              renderInput={(params) => (
                <TextField size="small" {...params} fullWidth />
              )}
            />
          </Box>

          {/* 알람 디버그 정보 */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              알람번호 : {alarmList?.[0]?.alarmId} <br />
              펫아이디 : {alarmList?.[0]?.petId}
            </Typography>
          </Box>

          <Box className="save-and-allupdate-button-container">
            {user &&
              (alarmList?.[0]?.alarmId != null ? (
                <Button
                  variant="contained"
                  className="saveAndAllUpdateBt"
                  onClick={alarmAllUpdateSend}
                >
                  수정
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="saveAndAllUpdateBt"
                  onClick={alarmCreate}
                >
                  저장
                </Button>
              ))}
          </Box>
        </CardContent>
      </Card>

      <Typography className="section-title">💧 물주기 기록</Typography>

      <Box className="water-log-action">
        <Button onClick={() => waterAdd()} variant="contained" className="watered-button">
          물 줬어요!
        </Button>
      </Box>

      {/* 물주기 로그 리스트 영역 */}
      <Box className="watering-log-section">
        <Box className="log-header">
          <IconButton className="log-toggle-icon">
            <CheckBoxIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography className="log-title">기록 리스트</Typography>
          <IconButton className="log-dropdown-arrow">
            <ArrowDropDownIcon />
          </IconButton>
        </Box>

        {!waterList || waterList.length === 0 ? (
          <Typography>일지가 없습니다.</Typography>
        ) : (
          waterList.map((log) => (
            <Box key={log.plantWateringId} className="log-entry">
              <Box className="log-details">
                <Typography>
                  {formatDate(log.waterDt)} || {log.soilCondition}
                </Typography>
                <Typography>{log.wateringMemo}</Typography>
              </Box>
              <Box className="log-actions">{/* 버튼 or 메뉴 자리 */}</Box>
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

const PlantWatering = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const [searchParams] = useSearchParams();

  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장

  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const { showAlert } = useCmDialog();
  const { data, error, isLoading, refetch } = useAlarmOneListQuery({
    petId: plantId, // plantId 아이디조회  백단에서 이 아이디로만든 알람있으면 update, 없으면 insert
    category: "PLA",
  });
  const [alarmUpdate] = useAlarmUpdateMutation(); // 토글수정  활성화만 Y , N 수정
  const [alarmAllUpdate] = useAlarmAllUpdateMutation(); // 모든알람데이터수정
  const [alarmList, setAlarmList] = useState();
  const [alarmCycle, setAlarmCycle] = useState(""); // 선택된 물주기
  const [AlarmCreate] = useAlarmCreateMutation({});
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmToggle, setAlarmToggle] = useState(true);
  const newFormattedTimes = [];

  const [WaterCreate] = useWaterCreateMutation({});
  const { data: waterData, error: waterError, isLoading:WaterLoading, refetch:waterListLoad } = useWaterListQuery({
    plantId: plantId, // plantId 아이디조회
  });
  const [waterList, setWaterList] = useState([]);

  const pathToTabIndex = {
    "/plant/PlantWatering.do": 0,
    "/plant/PlantSunlighting.do": 1,
    "/plant/PlantRepotting.do": 2,
    "/plant/PlantPest.do": 3,
  };

  const [currentTab, setCurrentTab] = useState(0);

  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };

  useEffect(() => {
    alarmSet();
    waterListLoad();
  }, []);

  // 불러온데이터확인
  useEffect(() => {
    console.log("plantInfo : ", plantInfo);
  }, [plantInfo]);

  useEffect(() => {
    console.log("waterData : ", waterData);
    setWaterList(waterData);
  }, [waterData]);

  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setCurrentTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);

  const alarmSet = async () => {
    // 알람아이디없으면 catch 로감
    try {
      const response = await refetch();
      if(response?.data?.data.length == 0) {
        // alert("데이터없음");
        return;
      };
      console.log("aaaaaaa", response);
      console.log("response.data:", response.data);
      console.log("response.data.success:", response.data.success, typeof response.data.success);
      console.log("response.data.data:", response.data.data, Array.isArray(response.data.data));

      if (
        response.data &&
        Array.isArray(response.data?.data) &&
        response.data.success
      ) {
        console.log("전체 알람 리스트:", response.data.data);

        const alarms = response.data.data.map((alarm) => {
          const alarmId = parseInt(alarm.alarmId, 10);
          const petId = parseInt(alarm.petId, 10);
          const year = 2000 + parseInt(alarm.year, 10);
          const month = alarm.month;
          const day = parseInt(alarm.day, 10);
          const hour = parseInt(alarm.hour, 10);
          const min = parseInt(alarm.min, 10);
          const daysDate = dayjs(alarm.startDate); // 불러온 세팅날짜 dayjs 로
          const daysTime = dayjs(alarm.alarmTime, "HH:mm"); // 불러온 세팅시간 dayjs 로

          setAlarmDate(daysDate); // 알람리스트가 있으면 초기 alarmdate설정
          setAlarmTime(daysTime); // 알람리스트가 있으면 초기 alarmtime설정

          let cycleDays = 0;
          switch (alarm.alarmCycle) {
            case "A01":
              cycleDays = 1;
              break;
            case "A02":
              cycleDays = 2;
              break;
            case "A03":
              cycleDays = 3;
              break;
            case "A04":
              cycleDays = 5;
              break;
            case "A05":
              cycleDays = 7;
              break;
            case "A06":
              cycleDays = 14;
              break;
            default:
              cycleDays = 0;
          }

          let isactive;
          switch (alarm.activeYn) {
            case "Y":
              isactive = true;
              break;
            case "N":
              isactive = false;
              break;
          }

          // 시간 문자열 생성
          const formatted = `${year}-${month}-${day} ${hour}:${min} (주기: ${cycleDays}일)`;
          newFormattedTimes.push(formatted);

          return {
            alamrCycleCode: alarm.alarmCycle,
            daysDate,
            daysTime,
            types: "SET_ALARM",
            alarmId,
            petId,
            year,
            month,
            day,
            hour,
            min,
            alarmCycle: cycleDays,
            enabled: isactive, // 초기에는 켜져있다고 가정
            message: "알람아이디 : " + alarmId + " // " + cycleDays + "분주기",
            // message: "물 주는 시간입니다!"
          };
        });

        setAlarmList(alarms);

        // Android로 넘길 때는 enabled=true인 것만 필터해서 JSON 변환
        const activeData = alarms.filter((alarm) => alarm.enabled === true);
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
        showAlert("데이터조회실패1");
        console.log("응답 구조 이상:", response.data);
      }
    } catch (error) {
      showAlert("데이터조회실패2");
      console.error(error);
    }
  };

  const alarmCreate = async () => {
    console.log("alarmCreate 실행");
    console.log("alarmTime : " + alarmTime + "\n" + "alarmDate : " + alarmDate);
    const data = {
      petId: plantId, // << 변수값 넣으면됨
      alarmName: "WaterAlarm",
      alarmCycle: alarmCycle,
      alarmTime: alarmTime.format("HH:mm"),
      startDate: alarmDate.format("YY/MM/DD"),
      type: "WAT", // 먹이종류 때문에 NOT NULL 이라 임의값 넣음.
      category: "PLA", // 식물물주기는 PLA    동물먹이는 ANI
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
        alarmTime: alarmTime.format("HH:mm"),
        startDate: alarmDate.format("YY/MM/DD"),
        category: "PLA", // 혹은 "ANI"
      });

      console.log(`서버 알람 ${alarmList[0].alarmId} 상태 업데이트 완료`);

      // 프론트 상태 업데이트 (불필요한 필드는 생략 가능)
      setAlarmList([
        {
          ...alarmList[0],
          alarmCycle: alarmCycle,
          alarmTime: alarmTime.format("HH:mm"),
          startDate: alarmDate.format("YY/MM/DD"),
        },
      ]);
    } catch (err) {
      console.error("알람 업데이트 실패", err);
      showAlert("알람 상태 업데이트 실패");
    }
  };

  const waterAdd = async () => {
    console.log("waterAdd 실행");
    // const formData = new FormData();
    // formData.append("plantId", plantId);
    const data = {
      plantId: plantId, // << 변수값 넣으면됨
    };

    try {
      const response = await WaterCreate(data).unwrap();
      console.log("응답 내용 >>", response); // 여기에 찍히는 걸 확인해야 해!
      alert("등록성공ㅎㅎㅎ");

      waterListLoad();  // 페이지 다시렌더링유도

    } catch (error) {
      console.error("요청 실패:", error);
      alert("등록실패!!!!!!!!!!");
    }
  }

  const toggleAlarm = (alarmId) => {
    console.log("toggleAlarm 실행");
    setAlarmList((prevList) =>
      prevList.map((alarm) => {
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
            activeYn: newEnabled ? "Y" : "N",
          })
            .unwrap()
            .then(() => {
              console.log("alarmUpdate 실행");
              console.log(`서버 알람 ${alarmId} 상태 업데이트 완료`);
            })
            .catch((err) => {
              console.error("알람 업데이트 실패", err);
              showAlert("알람 상태 업데이트 실패");
            });

          // 3. 프론트 상태 변경
          return { ...alarm, enabled: newEnabled };
        }
        return alarm;
      })
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';

    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0부터 시작하니 +1
    const day = date.getDate();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    if (hours === 0) hours = 12; // 12시 표시 처리

    return `${year}.${month}.${day}  ${ampm} ${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <Box className="plant-care-container">
        {/*식물 정보 수정 버튼*/}
        <Button onClick={()=>navigate(`/PlantUpdate.do?plantId=${plantId}`)} variant="contained" className="edit-top-button">
          수정
        </Button>

        <Box className="plant-info-header">
          <Box className="plant-details">
            <Box className="plant-detail-row">
              <Typography className="plant-label">식물 이름</Typography>
              <Box className="plant-value-box">
                <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                  {/* 배열안에 데이터 있음 */}
                  {plantInfo?.data && plantInfo.data.length > 0
                    ? plantInfo.data[0].plantName
                    : "정보 없음"}
                </Typography>
              </Box>
            </Box>
            <Box className="plant-detail-row">
              <Typography className="plant-label">입수일 날짜</Typography>
              <Box className="plant-value-box">
                <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                  {/* 배열안에 데이터 있음 */}
                  {plantInfo?.data && plantInfo.data.length > 0
                    ? plantInfo.data[0].plantPurchaseDate
                    : "정보 없음"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Avatar
            src={`${
              process.env.REACT_APP_API_BASE_URL
            }/file/imgDown.do?fileId=${
              plantInfo?.data && plantInfo.data.length > 0
                ? plantInfo.data[0].fileId
                : ""
            }`}
            className="plant-avatar"
          />
        </Box>

        <Box className="tab-menu-container">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="plant-care-tabs"
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
          >
            <Tab label="물주기" />
            <Tab label="일조량" />
            <Tab label="분갈이" />
            <Tab label="병충해" />
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          <WateringContent
          alarmList={alarmList}
          setAlarmList={setAlarmList}
          alarmTime={alarmTime}
          setAlarmTime={setAlarmTime}
          alarmDate={alarmDate}
          setAlarmDate={setAlarmDate}
          setAlarmCycle={setAlarmCycle}
          alarmCreate={alarmCreate}
          alarmAllUpdateSend={alarmAllUpdateSend} 
          toggleAlarm={toggleAlarm}
          user={user}    
          waterList={waterList} // 물주기 로그 데이터    
          waterAdd={waterAdd}
          formatDate={formatDate}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantWatering;
