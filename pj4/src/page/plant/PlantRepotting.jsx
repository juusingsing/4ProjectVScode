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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
//훅
import {
  useRepottingLogsQuery,
  useDeleteRepottingLogsMutation,
  useRepottingUpdateLogsMutation,
  useRepottingBlistQuery,
  useSaveRepottingInfoMutation,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
import "../../css/plantRepotting.css";

import PlantWatering from "./PlantWatering"; // 물주기 탭
import PlantSunlighting from "./PlantSunlighting"; // 일조량 탭
import PlantPest from "./PlantPest"; // 병충해 탭

const RepottingContent = ({
  repottingDate,
  setRepottingDate,
  soilConditionText,
  setSoilConditionText,
  repottingMemoText,
  setRepottingMemoText,
  handleSave,
  editingLog,
  repottingLogs,
  onDeleteLog,
  onEditLog,
}) => (
  <Box className="repotting-tab-content">
    <Box className="repotting-date">
      <Typography className="date-label">분갈이날짜</Typography>
      <DatePicker
        value={repottingDate}
        onChange={(newValue) => setRepottingDate(newValue)}
        format="YYYY.MM.DD"
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            className="input-field-wrapper"
            InputProps={{
              sx: {
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
              },
            }}
          />
        )}
      />
    </Box>

    <Box className="soil-status-section">
      <Typography className="soil-status-label">흙종류</Typography>
      <TextField
        className="soil-status-textfield"
        multiline
        rows={1}
        value={soilConditionText}
        onChange={(e) => setSoilConditionText(e.target.value)}
        variant="outlined"
      />
    </Box>

    <Box className="repotting-memo">
      <Typography className="repotting-memo-label">메모</Typography>
      <TextField
        className="repotting-memo-textfield"
        multiline
        rows={3}
        value={repottingMemoText}
        onChange={(e) => setRepottingMemoText(e.target.value)}
        variant="outlined"
      />
    </Box>

    <Button
      variant="contained"
      className="save-button"
      onClick={handleSave}
      sx={
        editingLog !== false
          ? {
              backgroundColor: "#6e927e !important",        // 저장
              "&:hover": {
                backgroundColor: "#88AE97 !important",
              },
            }
          : undefined
      }
    >
      {editingLog !== false ? "저장" : "수정"}
    </Button>

    <Box className="repotting-log-section">
      <Box className="log-header">
        <IconButton className="log-toggle-icon">
          <CheckBoxIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography className="log-title">기록 리스트</Typography>
        <IconButton className="log-dropdown-arrow">
          <ArrowDropDownIcon />
        </IconButton>
      </Box>

      {!repottingLogs || repottingLogs.length === 0 ? (
        <Typography>일지가 없습니다.</Typography>
      ) : (
        repottingLogs.map((log) => (
          <Box key={log.plantRepottingId} className="log-entry">
            <Box className="log-details">
              <Typography>
                {log.repottingDate} | {log.soilCondition}
              </Typography>
              <Typography>{log.repottingMemo}</Typography>
            </Box>
            <Box className="log-actions">
              <Button
                variant="text"
                className="log-action-button"
                onClick={() => onDeleteLog(log.plantRepottingId)}
              >
                삭제
              </Button>
              <Button
                variant="text"
                className="log-action-button"
                onClick={() => onEditLog(log.plantRepottingId)}
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
const PlantRepotting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useCmDialog();
  const [saveRepottingInfo] = useSaveRepottingInfoMutation(); // 등록용
  const [repottingUpdateLogs] = useRepottingUpdateLogsMutation(); // 수정용

  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장
  const [plantName] = useState("몬스테라");
  const [purchaseDate] = useState(null);
  // const [currentTab, setCurrentTab] = useState(2); // 일조량 탭이 기본 선택

  const [repottingDate, setRepottingDate] = useState(null);
  const [soilConditionText, setSoilConditionText] = useState("");
  const [repottingMemoText, setRepottingMemoText] = useState("");

  const [plantRepottingId, setPlantRepottingId] = useState();
  const [repottingLogs, setRepottingLogs] = useState([]);
  const [deleteRepottingLogs] = useDeleteRepottingLogsMutation();
  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const [editingLog, setEditingLog] = useState(true);  // true저장   false 수정
  const [editStatus, setStatus] = useState("");
  const [editMemo, setMemo] = useState("");

  const pathToTabIndex = {
    "/plant/PlantWatering.do": 0,
    "/plant/PlantSunlighting.do": 1,
    "/plant/PlantRepotting.do": 2,
    "/plant/PlantPest.do": 3,
  };

  const [currentTab, setCurrentTab] = useState(2);

  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  const {
    data: fetchedLogs,
    error,
    refetch,
  } = useRepottingLogsQuery({ plantId: plantId });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setRepottingLogs(fetchedLogs.data);
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
      repottingDate: repottingDate ? repottingDate.format("YYYY-MM-DD") : null,
      soilCondition: soilConditionText,
      repottingMemo: repottingMemoText,
    };

    if (editingLog !== true) {
      //수정
      formData.plantRepottingId = plantRepottingId;
      repottingUpdateLogs(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setRepottingDate(null);
          setSoilConditionText("");
          setRepottingMemoText("");
          setEditingLog(true);
          refetch();
        })
        .catch((err) => {
          console.error("수정 실패:", err);
          showAlert("수정 실패");
        });
    } else {
      //저장
      saveRepottingInfo(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setRepottingDate(null);
          setSoilConditionText("");
          setRepottingMemoText("");
          setEditingLog(true);

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
      await deleteRepottingLogs(id).unwrap(); // 삭제 요청
      showAlert("일지가 성공적으로 삭제되었습니다.");

      refetch();
    } catch (error) {
      console.error("삭제실패:", error);
      showAlert("삭제 중 오류 발생");
    }
  };

  const handleEditLog = (id) => {
    const logToEdit = repottingLogs.find((log) => log.plantRepottingId === id);
    if (logToEdit) {
      setRepottingDate(dayjs(logToEdit.repottingDate));
      setSoilConditionText(logToEdit.soilCondition);
      setRepottingMemoText(logToEdit.repottingMemo);
      setPlantRepottingId(id);
      setEditingLog(false);
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
          <RepottingContent
            repottingDate={repottingDate}
            setRepottingDate={setRepottingDate}
            soilConditionText={soilConditionText}
            setSoilConditionText={setSoilConditionText}
            repottingMemoText={repottingMemoText}
            setRepottingMemoText={setRepottingMemoText}
            handleSave={handleSave}
            repottingLogs={repottingLogs}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
            editingLog={editingLog}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantRepotting;
