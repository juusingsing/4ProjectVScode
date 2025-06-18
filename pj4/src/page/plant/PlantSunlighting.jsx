import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { FaSun, FaTint, FaCloud, FaSnowflake } from "react-icons/fa";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
//훅
import {
  useSaveSunlightInfoMutation,
  useSunlightLogsQuery,
  useDeleteSunlightLogsMutation,
  useUpdateSunlightLogsMutation,
  useSunlightAlistQuery,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
import "../../css/plantSunlighting.css";

import PlantWatering from "./PlantWatering"; // 물주기 탭
import PlantRepotting from "./PlantRepotting"; // 분갈이 탭
import PlantPest from "./PlantPest"; // 병충해 탭

const sunlightOptions = [
  { id: "W01", icon: <FaSun />, label: "맑음", className: "selected-sun" },
  { id: "W02", icon: <FaTint />, label: "흐림", className: "selected-tint" },
  {
    id: "W03",
    icon: <FaCloud />,
    label: "구름 많음",
    className: "selected-cloud",
  },
  {
    id: "W04",
    icon: <FaSnowflake />,
    label: "눈/비",
    className: "selected-snow",
  },
];

const SunlightContent = ({
  sunlightStatusText,
  setSunlightStatusText,
  selectedSunlight,
  setSelectedSunlight,
  handleSave,
  sunlightLogs,
  onDeleteLog,
  onEditLog,
  editingLog,
}) => (
  <Box className="sunlight-tab-content">
    <Box className="daily-status-section">
      <Typography className="status-label">일조상태</Typography>
      <div className="icon-group">
        {sunlightOptions.map((opt) => (
          <div
            key={opt.id}
            className={`status-icon ${selectedSunlight === opt.id ? opt.className : ""
              }`}
            onClick={() => setSelectedSunlight(opt.id)}
            style={{ cursor: "pointer" }}
            title={opt.label}
          >
            {opt.icon}
          </div>
        ))}
      </div>
    </Box>

    <Box className="light-status-section">
      <Typography className="light-status-title">빛의 상태</Typography>
      <TextField
        className="sunlight-status-textfield"
        multiline
        rows={5}
        value={sunlightStatusText}
        onChange={(e) => setSunlightStatusText(e.target.value)}
        variant="outlined"
      />
    </Box>

    <Button
      variant="contained"
      className="save-button"
      onClick={handleSave}
      sx={
        editingLog !== null
          ? {
            backgroundColor: "#88AE97 !important",
            "&:hover": {
              backgroundColor: "#6e927e !important",
            },
          }
          : undefined
      }
    >
      {editingLog !== null ? "수정" : "저장"}
    </Button>

    <Box className="sunlight-log-section">
      <Box className="log-header">
        <IconButton className="log-toggle-icon">
          <CheckBoxIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography className="log-title">일조량 일지</Typography>
        <IconButton className="log-dropdown-arrow">
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      {!sunlightLogs || sunlightLogs.length === 0 ? (
        <Typography>일지가 없습니다.</Typography>
      ) : (
        sunlightLogs.map((log) => (
          <Box key={log.plantSunlightingId} className="log-entry">
            <Box className="log-details">
              <Typography>
                {
                  sunlightOptions.find((opt) => opt.id === log.sunlightStatus)
                    ?.icon
                }
                {log.createDt}
              </Typography>

              <Typography> {log.sunlightMemo}</Typography>
            </Box>
            <Box className="log-actions">
              <Button
                variant="text"
                className="log-action-button"
                onClick={() => onDeleteLog(log.plantSunlightingId)}
              >
                삭제
              </Button>
              <Button
                variant="text"
                className="log-action-button"
                onClick={() => onEditLog(log.plantSunlightingId)}
              >
                수정
              </Button>
            </Box>
          </Box>
        ))
      )}
    </Box>
  </Box>
);

// 메인 컴포넌트
const PlantSunlighting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useCmDialog();
  const [saveSunlightInfo] = useSaveSunlightInfoMutation(); // 등록용
  const [updateSunlightLogs] = useUpdateSunlightLogsMutation(); // 수정용

  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장
  const [plantName] = useState("몬스테라");
  const [purchaseDate] = useState("2023-01-15");
  // const [currentTab, setCurrentTab] = useState(1); // 분갈이 탭


  const [selectedSunlight, setSelectedSunlight] = useState(null);
  const [sunlightStatusText, setSunlightStatusText] = useState("");

  const [sunlightLogs, setSunlightLogs] = useState([]);
  const [deleteSunlightLogs] = useDeleteSunlightLogsMutation();
  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const [editingLog, setSelectedLog] = useState(null); // 현재 수정 중인 로그
  const [editStatus, setStatus] = useState(""); // 수정할 상태
  const [editMemo, setMemo] = useState(""); // 수정할 메모


  const pathToTabIndex = {
    '/plant/PlantWatering.do': 0,
    '/plant/PlantSunlighting.do': 1,
    '/plant/PlantRepotting.do': 2,
    '/plant/PlantPest.do': 3,
  };


  const [currentTab, setCurrentTab] = useState();


  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  const handleSelectLog = (log) => {
    setSelectedLog(log);
    setStatus(log.sunlightStatus); // 일조량 상태 채우기
    setMemo(log.sunlightMemo); // 메모 채우기
  };

  // const { data, isLoading } = useSunlightAlistQuery({ plantSunlightingId: id });
  const {
    data: fetchedLogs,
    error,
    refetch,
  } = useSunlightLogsQuery({ plantId: plantId });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };


  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setSunlightLogs(fetchedLogs.data);
    }
  }, [fetchedLogs, refetch]);

  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setCurrentTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);


  const handleSave = () => {
    const formData = {
      plantId: parseInt(plantId),
      sunlightStatus: selectedSunlight,
      sunlightMemo: sunlightStatusText,
    };

    if (editingLog !== null) {
      //수정
      formData.plantSunlightingId = editingLog;
      updateSunlightLogs(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setSelectedSunlight(null);
          setSunlightStatusText("");
          setSelectedLog(null);
          refetch();
        })
        .catch((err) => {
          console.error("수정 실패:", err);
          showAlert("수정 실패");
        });
    } else {
      //저장
      saveSunlightInfo(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setSelectedSunlight(null);
          setSunlightStatusText("");
          setSelectedLog(null);

          const plantData = new FormData();
          plantData.append("plantId", plantId);
          refetch();
        })
        .catch((err) => {
          console.error("저장 실패:", err);
          showAlert("저장 실패");
        });
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await deleteSunlightLogs(id).unwrap(); // 삭제 요청
      showAlert("일지가 성공적으로 삭제되었습니다.");

      // 삭제 성공 후, 서버에서 최신 일지 목록을 다시 가져와 UI 업데이트
      refetch();
    } catch (error) {
      console.error("삭제실패:", error);
      showAlert("삭제 중 오류 발생");
    }
  };

  const handleEditLog = (id) => {
    const logToEdit = sunlightLogs.find((log) => log.plantSunlightingId === id);
    if (logToEdit) {
      setSelectedSunlight(logToEdit.sunlightStatus); // ☀️ 선택된 아이콘 세팅
      setSunlightStatusText(logToEdit.sunlightMemo); // ✍️ 메모 세팅
      setSelectedLog(id);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-care-container">
        {/*식물 정보 수정 버튼*/}
        <Button
          variant="contained"
          className="edit-top-button"
          onClick={() => {
            navigate(`/PlantUpdate.do?plantId=${plantId}`);
          }}
        >
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
            src={`${process.env.REACT_APP_API_BASE_URL
              }/file/imgDown.do?fileId=${plantInfo?.data && plantInfo.data.length > 0
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
          <SunlightContent
            sunlightStatusText={sunlightStatusText}
            setSunlightStatusText={setSunlightStatusText}
            selectedSunlight={selectedSunlight}
            setSelectedSunlight={setSelectedSunlight}
            handleSave={handleSave}
            sunlightLogs={sunlightLogs}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantSunlighting;
