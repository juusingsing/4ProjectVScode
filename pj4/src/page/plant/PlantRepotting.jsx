import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { useSearchParams } from "react-router-dom";
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
import dayjs from 'dayjs';
//훅
import {
  useRepottingLogsQuery,
  useDeleteRepottingLogsMutation,
  useRepottingUpdateLogsMutation,
  useRepottingBlistQuery,
  useSaveRepottingInfoMutation,
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
        inputFormat="YYYY-MM-DD"
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
              <Typography>{log.repottingDate} | {log.soilCondition}</Typography>
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
  const { showAlert } = useCmDialog();
  const [saveRepottingInfo] = useSaveRepottingInfoMutation(); // 등록용
  const [repottingUpdateLogs] = useRepottingUpdateLogsMutation(); // 수정용

  const [plantId] = useState("1"); // 실제 값은 API에서 받아야 함
  const [plantName] = useState("몬스테라");
  const [purchaseDate] = useState("2023-01-15");
  const [currentTab, setCurrentTab] = useState(2); // 일조량 탭이 기본 선택

  const [repottingDate, setRepottingDate] = useState(null);
  const [soilConditionText, setSoilConditionText] = useState("");
  const [repottingMemoText, setRepottingMemoText] = useState("");

  const [repottingLogs, setRepottingLogs] = useState([]);
  const [deleteRepottingLogs] = useDeleteRepottingLogsMutation();
  const [searchParams] = useSearchParams();

  const [editingLog, setSelectedLog] = useState(null); 
  const [editStatus, setStatus] = useState(""); 
  const [editMemo, setMemo] = useState(""); 

  const handleSelectLog = (log) => {
    setSelectedLog(log);
    setStatus(log.soilCondition); 
    setMemo(log.repottingMemo); 
  };

  const id = searchParams.get("id");
  const {
    data: fetchedLogs,
    error,
    refetch,
  } = useRepottingLogsQuery({ plantId: 1 });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setRepottingLogs(fetchedLogs.data);
    }
  }, [fetchedLogs, refetch]);

  const handleSave = () => {
    const formData = {
      plantId: parseInt(plantId),
      repottingDate: repottingDate ? repottingDate.format("YYYY-MM-DD") : null,
      soilCondition: soilConditionText,
      repottingMemo: repottingMemoText
    };

    if (editingLog !== null) {
      //수정
      formData.plantRepottingId = editingLog;
      repottingUpdateLogs(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setRepottingDate(null);
          setSoilConditionText("");
          setRepottingMemoText("");
          setSelectedLog(null);
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
          setSelectedLog(null);

          const plantData = new FormData();
          plantData.append("plantId", 1);
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
      setSelectedLog(id);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            />
    </LocalizationProvider>
  );
};

export default PlantRepotting;
