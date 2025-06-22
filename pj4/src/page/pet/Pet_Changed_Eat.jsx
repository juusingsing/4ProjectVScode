import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Switch,
  Grid,
  Avatar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CmUtil } from "../../cm/CmUtil";

import { useCmDialog } from "../../cm/CmDialogUtil";
import { Tabs, Tab } from "@mui/material";
import Combo from "../combo/combo";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useGetPetByIdQuery } from "../../features/pet/petApi";
import {
  useAlarmCreateMutation,
  useAlarmListQuery,
  useAlarmUpdateMutation,
  useAlarmDeleteMutation,
} from "../../features/alarm/alarmApi";
import AlarmMinus from "../../image/alarmMinus.png";

const RepottingContent = ({
setEatType,
eatType,
alarmName,
setAlarmName,
setAlarmCycle,
alarmCycle,
alarmTime,
setAlarmTime,
alarmDate,
setAlarmDate,
alarmCreate,
alarmList,
toggleAlarm,
alarmDelete,
}) => {
  return (
    <>
      {/* 알림 설정 영역 */}
    <Box>
        <Box sx={{
           display: "flex",
           alignItems:"center",
           marginBottom:1
        }}>
          <Typography sx={{fontWeight:"700", marginTop:1, marginRight:2}}>먹이 알림설정 🔔</Typography>
          <Combo
              groupId="EatType"
              onSelectionChange={setEatType}
              defaultValue={eatType}
              sx={{
                fontSize:14,
                width: "150px",
                height: "37px",
                backgroundColor: "#F8F8F8",
                borderRadius:"8px",
              }}
            />
        </Box>

        <Box sx={{
           display: "flex",
           justifyContent: "space-between",
           alignItems:"center",
           marginBottom:1,
        }}>
            <Typography className="light-status-title">먹이이름</Typography>
            <TextField
              className="sunlight-status-textfield"
              multiline
              rows={1.2}
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
              variant="outlined"
              sx={{
                  width:"273px",
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F8F8F8',
                    borderRadius: '8px',
                    padding: '0px', // 내부 패딩 제거
                  },
                  '& .MuiInputBase-input': {
                    padding: '6px 8px', // 텍스트 입력 공간의 패딩 조절
                    fontSize: '14px',   // 폰트 사이즈 줄이면 높이도 줄어듦
                  },
              }}
            />
        </Box>


        <Box>
            <Box sx={{
                display:"flex",
                justifyContent: "space-between",
                alignItems:"center",
                marginLeft:10,
                gap:3}}>
                <Box>
                    <Typography className="light-status-title">주기</Typography>
                    <Combo
                        groupId="AlarmCycle"
                        onSelectionChange={setAlarmCycle}
                        defaultValue={alarmCycle}
                        sx={{
                            fontSize:14,
                            width: "120px",
                            height: "37px",
                            backgroundColor: "#F8F8F8",
                            borderRadius:"8px",
                            mt:-2,
                        }}
                    />
                </Box>

                <Box sx={{marginTop:-0.5}}>
                    <Typography className="light-status-title">시각</Typography>
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                            <TimePicker
                            ampm
                            value={alarmTime}
                            onChange={(newValue) => {
                            setAlarmTime(newValue);
                            }}
                            slotProps={{
                              textField: {
                                size: "small",
                                InputProps: {
                                  sx: {
                                    fontSize:14,
                                    borderRadius: "8px",
                                    backgroundColor: "#F8F8F8",
                                    width: "130px",
                                    pl:"15px"
                                  },
                                },
                              },
                            }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
            </Box>
        </Box>


        <Box sx={{
           display: "flex",
           alignItems:"center",
           gap:3,
           marginBottom:1,
        }}>
            <Typography className="light-status-title">알림날짜</Typography>
            <Box sx={{marginTop:"10px"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                    format="YYYY.MM.DD"
                    value={alarmDate}
                    onChange={(newValue) => {
                    setAlarmDate(newValue);
                    }}
                    renderInput={(params) => (
                    <TextField size="small" {...params} fullWidth />
                    )}
                    slotProps={{
                      textField: {
                        size: "small",
                        InputProps: {
                          sx: {
                            fontSize:14,
                            borderRadius: "8px",
                            backgroundColor: "#F8F8F8",
                            width: "273px",
                            pl:"28px"
                          },
                        },
                      },
                    }}
                    />
                </LocalizationProvider>
            </Box>
        </Box>

        

        <Button
              variant="contained"
              className="save-button"
              onClick={alarmCreate}
              sx={{
                backgroundColor: "#6e927e !important",        // 저장
                "&:hover": {
                  backgroundColor: "#88AE97 !important",
                },
              }}
            >
              알림등록
        </Button>

        <Box sx={{
              width: "320px",
              mx: "auto",
              mt: 2,
              border: "1px solid #ccc",
              borderRadius: "10px",
              p: 2,
              boxShadow: "0 0 4px rgba(0,0,0,0.1)",
            }}>
                <Typography
                    variant="h6"
                    align="center"
                    sx={{
                        fontWeight: "bold",
                        borderBottom: "1px solid #ccc",
                    }}
                >
                    알림 목록
                </Typography>

                {alarmList.map((alarm, idx) => (
                    <Grid
                    key={idx}
                    container
                    alignItems="center"
                    spacing={1}
                    sx={{ py: 1, position: "relative", top: 0 }}
                    >
                    {/* 알람 이름 + 종류 */}
                    <Grid item xs={5}>
                        <Typography
                        sx={{
                            width: 100,
                            fontSize: 14,
                            left: -10,
                            position: "relative",
                            textAlign: "center",
                        }}
                        >
                        {alarm.alarmName}
                        </Typography>
                        <Typography
                        sx={{
                            width: 100,
                            fontSize: 12,
                            color: "#777",
                            left: 60,
                            position: "relative",
                            top: -18,
                            textAlign: "center",
                        }}
                        >
                        {alarm.type}
                        </Typography>
                    </Grid>
    
                    {/* 주기 + 시간 */}
                    <Grid item xs={3}>
                        <Typography
                        sx={{
                            width: 100,
                            fontSize: 13,
                            left: 16,
                            position: "relative",
                            top: 3,
                            textAlign: "center",
                        }}
                        >
                        {alarm.alarmCycle}일
                        </Typography>
                        <Typography
                        sx={{
                            width: 100,
                            fontSize: 13,
                            left: 90,
                            position: "relative",
                            top: -17,
                            textAlign: "center",
                        }}
                        >
                        {`${alarm.hour}:${alarm.min.toString().padStart(2, "0")}`}
                        </Typography>
                    </Grid>
    
                    {/* 스위치 */}
                    <Grid item xs={2}>
                        <Switch
                        checked={alarm.enabled}
                        onChange={() => toggleAlarm(alarm.alarmId)}
                        color="default"
                        size="small"
                        sx={{
                            width: 50,
                            height: 30,
                            left: 70,
                            top: -6,
                            padding: 0,
                            "& .MuiSwitch-switchBase": {
                            padding: "2px",
                            "&.Mui-checked": {
                                transform: "translateX(16px)",
                                color: "#fff",
                                "& + .MuiSwitch-track": {
                                backgroundColor: "#90caf9",
                                opacity: 1,
                                },
                            },
                            },
                            "& .MuiSwitch-thumb": {
                            //스위치 동그라미 크기 조절
                            width: 25,
                            height: 25,
                            boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
                            },
                            "& .MuiSwitch-track": {
                            borderRadius: 10,
                            backgroundColor: "#e0e0e0",
                            opacity: 1,
                            },
                        }}
                        />
                        {/* 삭제 버튼 */}
                        <Grid item xs={2}>
                        <IconButton
                            onClick={() => alarmDelete(alarm.alarmId)}
                            size="small"
                            sx={{ p: 0, left: 30, top: -7 }}
                        >
                            <img
                            src={AlarmMinus}
                            alt="알람 삭제"
                            style={{ width: 24, height: 24 }}
                            />
                        </IconButton>
                        </Grid>
                    </Grid>
    
    
                    </Grid>
                ))}

        </Box>

    </Box>

    </>
  );
};

const Pet_Form_Eat_Alarm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathToTabIndex = {
    "/pet/petFormHospital.do": 0,
    "/pet/petFormEatAlarm.do": 1,
    "/pet/petFormTrainingAndAction.do": 2,
  };

  const [AlarmCreate] = useAlarmCreateMutation({});
  const [alarmUpdate] = useAlarmUpdateMutation();
  const [alarmDel] = useAlarmDeleteMutation();

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get("animalId"); // 동물아이디 animalId parm에 저장
  const [alarmName, setAlarmName] = useState("");
  const newFormattedTimes = [];
  const [alarmDate, setAlarmDate] = useState(dayjs());
  const [alarmTime, setAlarmTime] = useState(dayjs().hour(9).minute(0));
  const [alarmList, setAlarmList] = useState([]);
  const [isActive, setIsActive] = useState("");
  const { showAlert } = useCmDialog();
  const [animalName, setAnimalName] = useState("");
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(dayjs());
  const { data: petInfo, isLoading: isPetLoading } = useGetPetByIdQuery(animalId, {
    skip: !animalId,
  }); // 그 동물아이디의 정보 가져오기 ( 헤더 삽입할 데이터 조회 )
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState();

  const alarmTimeRef = useRef();
  const alarmNameRef = useRef();
  const alarmDateRef = useRef();
  const [eatType, setEatType] = useState(""); // 선택된 먹이
  const [alarmCycle, setAlarmCycle] = useState(""); // 선택된 주기
  const {data: dbAlarmList, error, isLoading, refetch } = useAlarmListQuery({
    petId: animalId, // plantId 아이디조회  백단에서 이 아이디로만든 알람있으면 update, 없으면 insert
    category: "ANI",
  });

  useEffect(() => {
    alarmSet();
  }, []);

  const alarmSet = async () => {
    // 알람아이디없으면 catch 로감
    try {
      const response = await refetch();
      console.log("aaaaaaa", response);
      console.log("response.data:", response.data);
      console.log(
        "response.data.success:",
        response.data.success,
        typeof response.data.success
      );
      console.log(
        "response.data.data:",
        response.data.data,
        Array.isArray(response.data.data)
      );

      if (
        response.data &&
        Array.isArray(response.data?.data) &&
        response.data.success
      ) {
        console.log("전체 알람 리스트:", response.data.data);

        const alarms = response.data.data.map((alarm) => {
          const alarmId = parseInt(alarm.alarmId, 10);
          const petId = parseInt(alarm.petId, 10);
          const alarmName = alarm.alarmName;
          const year = 2000 + parseInt(alarm.year, 10);
          const month = alarm.month;
          const day = parseInt(alarm.day, 10);
          const hour = parseInt(alarm.hour, 10);
          const min = parseInt(alarm.min, 10);
          const daysDate = dayjs(alarm.startDate); // 불러온 세팅날짜 dayjs 로
          const daysTime = dayjs(alarm.alarmTime, "HH:mm"); // 불러온 세팅시간 dayjs 로

          let type = "";
          switch (alarm.type) {
            case "E01":
              type = "사료";
              break;
            case "E02":
              type = "간식";
              break;
            case "E03":
              type = "영양제";
              break;
            case "E04":
              type = "약";
              break;
            default:
              type = "";
          }

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
            alarmName,
            year,
            month,
            day,
            hour,
            min,
            alarmCycle: cycleDays,
            type: type,
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
          // console.error("Android Alarm 호출 중 오류:", e);
          alert("Android Alarm 호출 중 오류:");
        }
      } else {
        // showAlert("데이터조회실패1");
        console.log("응답 구조 이상:", response.data);
      }
    } catch (error) {
      // showAlert("데이터조회실패2");
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
    console.log("petInfo : ", petInfo);
    if (petInfo?.data) {
      const fetchedPet = petInfo.data;
      setAnimalName(fetchedPet.animalName || "");

      setAnimalAdoptionDate(
        fetchedPet.animalAdoptionDate
          ? dayjs(fetchedPet.animalAdoptionDate)
          : null
      );

      // 서버에서 받아온 이미지 URL 저장
      console.log("fileUrl", fileUrl);
      if (fetchedPet.fileUrl) {
        setFileUrl(fetchedPet.fileUrl); // ✅ 이거 추가
        console.log("fileUrl", fetchedPet.fileUrl);
      } else {
        setExistingImageUrl("");
      }
    }
  }, [petInfo]);

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
    console.log("alarmTime : " + alarmTime + "\n" + "alarmDate : " + alarmDate);
    const data = {
      petId: animalId, // << 변수값 넣으면됨
      alarmName: alarmName,
      alarmCycle: alarmCycle,
      alarmTime: alarmTime.format("HH:mm"),
      startDate: alarmDate.format("YY/MM/DD"),
      type: eatType,
      category: "ANI", // 식물물주기는 PLA    동물먹이는 ANI
    };
    if (CmUtil.isEmpty(alarmName)) {
      showAlert("먹이 이름을 입력해주세요.");
      alarmNameRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(alarmTime)) {
      showAlert("알람 시각을 입력해주세요.");
      alarmTimeRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(alarmDate)) {
      showAlert("알람 시각을 입력해주세요.");
      alarmDateRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(eatType)) {
      showAlert("먹이 종류를 선택해주세요.");
      return;
    }

    if (CmUtil.isEmpty(alarmCycle)) {
      showAlert("먹이 주기를 선택해주세요.");
      return;
    }
    try {
      const response = await AlarmCreate(data).unwrap();
      console.log("응답 내용 >>", response); // 여기에 찍히는 걸 확인해야 해!
      setEatType(""); // 먹이 종류 초기화
      setAlarmName(""); // 먹이 이름 초기화
      setAlarmCycle(""); // 주기 초기화
      setAlarmTime(dayjs().hour(9).minute(0)); // 시간 초기화
      setAlarmDate(dayjs()); // 날짜 초기화

      alert("등록성공ㅎㅎㅎ");

      await alarmSet();
    } catch (error) {
      console.error("요청 실패:", error);
      alert("등록실패!!!!!!!!!!");
    }
  };

  const toggleAlarm = (alarmId) => {
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

  const alarmDelete = (alarmId) => {
    const isConfirmed = window.confirm("알람을 삭제하시겠습니까?");

    if (!isConfirmed) return; // 아니오를 누르면 종료

    // 2. 서버 상태 업데이트
    alarmDel({
      alarmId: alarmId,
      delYn: "Y",
    })
      .unwrap()
      .then(() => {
        console.log(`서버 알람 ${alarmId} 상태 업데이트 완료`);

        // 알람 끄기 - Android cancelAlarm 호출
        if (window.Android && window.Android.cancelAlarm) {
          window.Android.cancelAlarm(String(alarmId));
        }

        // 프론트 상태에서 제거
        setAlarmList((prevList) =>
          prevList.filter((alarm) => alarm.alarmId !== alarmId)
        );
      })
      .catch((err) => {
        console.error("알람 업데이트 실패", err);
        showAlert("알람 상태 업데이트 실패");
      });
  };

  return (
    <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="plant-care-container">
            {/*식물 정보 수정 버튼*/}
            <Button
                variant="contained"
                className="edit-top-button"
                onClick={() => {
                navigate(`/pet/petFormUpdate.do?animalId=${animalId}`);
                }}
            >
                수정
            </Button>
    
            <Box className="plant-info-header">
                <Box className="plant-details">
                <Box className="plant-detail-row">
                    <Typography className="plant-label">동물 이름</Typography>
                    <Box className="plant-value-box">
                    <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                        {/* 배열안에 데이터 있음 */}
                        {petInfo?.data
                        ? petInfo.data.animalName
                        : "정보 없음"}
                    </Typography>
                    </Box>
                </Box>
                <Box className="plant-detail-row">
                    <Typography className="plant-label">입양일 날짜</Typography>
                    <Box className="plant-value-box">
                    <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                        {/* 배열안에 데이터 있음 */}
                        {petInfo?.data
                        ? petInfo.data.animalAdoptionDate
                        : "정보 없음"}
                    </Typography>
                    </Box>
                </Box>
                <Box className="plant-detail-row">
                    <Box className="plant-value-box">
                    <Button onClick={() => navigate(`/pet/walk.do?animalId=${animalId}`)}>산책하기</Button>
                    </Box>
                </Box>
                </Box>
                <Avatar
                src={petInfo?.data?.fileUrl ? "http://192.168.0.30:8081" + petInfo?.data?.fileUrl : ""}
                className="plant-avatar"
                />
            </Box>
    
            <Box className="tab-menu-container">
                <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                className="plant-care-tabs"
                TabIndicatorProps={{ style: { backgroundColor: "black" } }}
                >
                <Tab label="병원진료" />
                <Tab label="먹이알림" />
                <Tab label="훈련/행동" />
                </Tabs>
            </Box>
    
            <Box className="tab-content-display">
                <RepottingContent
                    setEatType={setEatType}
                    eatType={eatType}
                    alarmName={alarmName}
                    setAlarmName={setAlarmName}
                    setAlarmCycle={setAlarmCycle}
                    alarmCycle={alarmCycle}
                    alarmTime={alarmTime}
                    setAlarmTime={setAlarmTime}
                    alarmDate={alarmDate}
                    setAlarmDate={setAlarmDate}
                    alarmCreate={alarmCreate}
                    alarmList={alarmList}
                    toggleAlarm={toggleAlarm}
                    alarmDelete={alarmDelete}
                />
            </Box>
            </Box>
        </LocalizationProvider>

    </>

  );
};
export default Pet_Form_Eat_Alarm;
