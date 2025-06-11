import React, { useState, useEffect } from "react";

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
//훅
import {
  useSaveSunlightInfoMutation,
  useSunlightLogsQuery,
  useDeleteSunlightLogMutation,
  
} from "../../features/plant/plantApi";
import "../../css/plantSunlighting.css";

import PlantWatering from "./PlantWatering";
import PlantRepotting from "./PlantRepotting";
import PlantPest from "./PlantPest";

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
}) => (
  <Box className="sunlight-tab-content">
    <Box className="daily-status-section">
      <Typography className="status-label">일조상태</Typography>
      <div className="icon-group">
        {sunlightOptions.map((opt) => (
          <div
            key={opt.id}
            className={`status-icon ${
              selectedSunlight === opt.id ? opt.className : ""
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

    <Button variant="contained" className="save-button" onClick={handleSave}>
      저장
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

      {sunlightLogs.length === 0 && <Typography>일지가 없습니다.</Typography>}

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
               {/*이 수정버튼은 useSaveSunlightInfoMutationd을 이용해서 값을 화면에 다시 불러오는 역할을 해*/}
                수정
              </Button>
            </Box>
          </Box>
        ))
      )}
    </Box>
  </Box>
);

const PlantSunlighting = () => {
  const [saveSunlightInfo] = useSaveSunlightInfoMutation();
  const [plantId] = useState("1"); // 실제 값은 API에서 받아야 함
  const [plantName] = useState("몬스테라");
  const [purchaseDate] = useState("2023-01-15");
  const [currentTab, setCurrentTab] = useState(1);
  const [sunlightStatusText, setSunlightStatusText] = useState("");
  const [selectedSunlight, setSelectedSunlight] = useState(null);
  const [sunlightLogs, setSunlightLogs] = useState([]);
  const [deleteSunlightLog] = useDeleteSunlightLogMutation();

  const {
    data: fetchedLogs,
    error,
    refetch,
  } = useSunlightLogsQuery({ plantId: 1 });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setSunlightLogs(fetchedLogs.data);
    }
  }, [fetchedLogs, refetch]);

  const handleSave = () => {
    const formData = {
      plantId: parseInt(plantId),
      sunlightStatus: selectedSunlight,
      sunlightMemo: sunlightStatusText,
    };

    saveSunlightInfo(formData)
      .unwrap()
      .then((res) => {
        alert(res.message);
        setSelectedSunlight(null);
        setSunlightStatusText("");
        // 저장 후 다시 로그 요청
        console.log("triggering logs for:", plantId);
        const plantData = new FormData();
        plantData.append("plantId", 1);
        refetch();
      })
      .catch((err) => {
        console.error("저장 실패:", err);
        alert("저장 실패");
      });
  };

  const handleDeleteLog = async (id) => {
    console.log("Deleting log with ID:", id); // 여기에 로그 추가
  try {
    await deleteSunlightLog(id).unwrap(); // 삭제 요청 
    alert("일지가 성공적으로 삭제되었습니다."); // 사용자에게 알림

    // 삭제 성공 후, 서버에서 최신 일지 목록을 다시 가져와 UI 업데이트
    refetch(); // <--- 이 부분이 중요합니다.

  } catch (error) {
    console.error("삭제실패:", error); 
    alert("삭제 중 오류 발생");
  }
};

  const handleEditLog = (id) => {
    alert(`수정 기능은 아직 구현되지 않았습니다. (id: ${id})`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-care-container">
        {/*식물 정보 수정 버튼*/}
        <Button variant="contained" className="edit-top-button">
          수정
        </Button>

        <Box className="plant-info-header">
          <Box className="plant-details">
            <Box className="plant-detail-row">
              <Typography className="plant-label">식물 이름</Typography>
              <Box className="plant-value-box">
                <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                  {plantName}
                </Typography>
              </Box>
            </Box>
            <Box className="plant-detail-row">
              <Typography className="plant-label">입수일 날짜</Typography>
              <Box className="plant-value-box">
                <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
                  {purchaseDate}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Avatar src="/plant.png" className="plant-avatar" />
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
          {currentTab === 0 && <PlantWatering tabName="물주기" />}
          {currentTab === 1 && (
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
          )}
          {currentTab === 2 && <PlantRepotting tabName="분갈이" />}
          {currentTab === 3 && <PlantPest tabName="병충해" />}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantSunlighting;
