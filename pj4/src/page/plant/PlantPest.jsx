import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { FaCamera } from "react-icons/fa";

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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DefaultImage from "../../image/default-plant.png";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
//훅
import {
  useSavePestInfoMutation,
  usePestLogsQuery,
  useDeletePestLogsMutation,
  useUpdatePestLogsMutation,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
// import "../../css/plantPest.css";

const PestContent = ({
  plantPestDate,
  setPlantPestDate,
  plantPestMemo,
  setPlantPestMemo,
  pestLogs,
  handleSave,
  editingLog,
  onDeleteLog,
  onEditLog,
  selectedFileName,
  handleFileChange,
  showWaterLogs,
  setShowWaterLogs,
}) => (
  <Box className="pest-tab-content">
    <Box className="pest-date">
      <Box sx={{ display: "flex" }}>
        <Typography
          className="date-label"
          sx={{
            marginBottom: 500,
          }}
        >
          병충해 날짜
        </Typography>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocal="ko"
        ></LocalizationProvider>
        <DatePicker
          value={dayjs(plantPestDate)}
          onChange={(newValue) => setPlantPestDate(newValue)}
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
    </Box>

    {/* 파일 업로드*/}
    <Box
      sx={{
        textAlign: "center",
        position: "relative",
        marginBottom: 3,
        display: "flex",
      }}
    >
      {selectedFileName && (
        <Typography sx={{ marginTop: 1, display: "block" }}>
          선택된 파일: {selectedFileName}
        </Typography>
      )}

      <input
        id="file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <label htmlFor="file">
        <IconButton
          component="span"
          sx={{
            position: "relative",
            top: "0px",
            left: "0px",
            backgroundColor: "white",
            boxShadow: 1,
            width: 30,
            height: 30,
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          <FaCamera style={{ fontSize: "1rem" }} />
        </IconButton>
      </label>
    </Box>

    <Box>
      <Typography>메모</Typography>
      <TextField
        sx={{
          width: 270,
          marginLeft: 8,
          marginTop: -3,
        }}
        multiline
        rows={5}
        value={plantPestMemo}
        onChange={(e) => setPlantPestMemo(e.target.value)}
        variant="outlined"
      />
    </Box>

    <Button
      variant="contained"
      onClick={handleSave}
      sx={
        editingLog !== false
          ? {
              width: "200px",
              marginTop: "20px",
              marginInline: "22%",
              borderRadius: "20px",
              backgroundColor: "#4B6044 !important",
              "&:hover": {
                backgroundColor: "#6e927e !important",
              },
            }
          : undefined
      }
    >
      {editingLog !== false ? "저장" : "수정"}
    </Button>

    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton onClick={() => setShowWaterLogs(!showWaterLogs)}>
          <ArrowDropDownIcon />
        </IconButton>
        <Typography>기록 리스트</Typography>
      </Box>

      {showWaterLogs &&
        (!pestLogs || pestLogs.length === 0 ? (
          <Typography>일지가 없습니다.</Typography>
        ) : (
          pestLogs.map((log) => (
            <Box
              key={log.plantPestId}
              className="log-entry"
              component="fieldset"
              sx={{
                mb: 2,
                border: "1px solid #ccc",
                p: 2,
              }}
            >
              <legend
                style={{
                  fontWeight: "bold",
                  padding: "0 8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CheckBoxIcon sx={{ fontSize: 18, color: "#333", mr: 1 }} />
                일조량 확인
              </legend>

              <Box className="log-details">
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>
                    {dayjs(log.plantPestDate).format("YYYY.MM.DD")}
                  </Typography>
                  <Box className="log-actions" sx={{ marginTop: "-40px" }}>
                    <Button
                      variant="text"
                      className="log-action-button"
                      onClick={() => onDeleteLog(log.plantPestId)}
                    >
                      삭제
                    </Button>
                    <Button
                      variant="text"
                      className="log-action-button"
                      onClick={() => onEditLog(log.plantPestId)}
                    >
                      수정
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: "flex" }}>
                  {log.fileId && (
                    <img
                      src={`${
                        process.env.REACT_APP_API_BASE_URL
                      }/file/imgDown.do?fileId=${log.fileId}&t=${Date.now()}`}
                      alt="Pest Log"
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "4px",
                        marginRight: "8px",
                        marginBlock: "auto",
                      }}
                    />
                  )}
                  <Box>
                    <Typography>{log.plantPestMemo}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))
        ))}
    </Box>
  </Box>
);

// 메인 컴포넌트
const PlantPest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useCmDialog();
  const [savePestInfo] = useSavePestInfoMutation(); // 등록용
  const [updatePestLogs] = useUpdatePestLogsMutation(); // 수정용

  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장

  // 중앙에서 탭 상태를 관리합니다.
  // const [currentTab, setCurrentTab] = useState(3); // 일조량 탭이 기본 선택

  const [editPlantPestId, setEditPlantPestId] = useState();
  const [plantPestDate, setPlantPestDate] = useState(dayjs());
  const [plantPestMemo, setPlantPestMemo] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const [pestLogs, setPestLogs] = useState([]); // 로그 조회용
  const [deletePestLogs] = useDeletePestLogsMutation(); // 로그 삭제용
  const { data: plantInfo } = usePlantInfoQuery(plantId);

  const [editingLog, setEditingLog] = useState(true); // true저장   false 수정
  const [editStatus, setStatus] = useState("");
  const [editMemo, setMemo] = useState("");
  const [fileId, setFileId] = useState();

  const pathToTabIndex = {
    "/plant/PlantWatering.do": 0,
    "/plant/PlantSunlighting.do": 1,
    "/plant/PlantRepotting.do": 2,
    "/plant/PlantPest.do": 3,
  };
  const [showWaterLogs, setShowWaterLogs] = useState({});

  const [currentTab, setCurrentTab] = useState(3);

  const tabIndexToPath = [
    `/PlantWatering.do?plantId=${plantId}`,
    `/PlantSunlighting.do?plantId=${plantId}`,
    `/PlantRepotting.do?plantId=${plantId}`,
    `/PlantPest.do?plantId=${plantId}`,
  ];

  const id = searchParams.get("id");
  const { data: fetchedLogs, error, refetch } = usePestLogsQuery({ plantId });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabIndexToPath[newValue]);
  };

  // 처음 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (fetchedLogs) {
      setPestLogs(fetchedLogs.data);
    }
  }, [fetchedLogs]);

  // 페이지가 바뀌면 selectedTab도 바뀌도록 설정
  useEffect(() => {
    const currentPath = location.pathname;
    if (pathToTabIndex.hasOwnProperty(currentPath)) {
      setCurrentTab(pathToTabIndex[currentPath]);
    }
  }, [location.pathname]);

  const handleSave = () => {
    const formData = new FormData();

    formData.append("plantId", plantId);
    formData.append(
      "plantPestDate",
      plantPestDate ? plantPestDate.format("YYYY-MM-DD") : ""
    );
    formData.append("plantPestMemo", plantPestMemo);

    if (selectedFile) {
      formData.append("files", selectedFile);
    }

    if (editingLog != true) {
      console.log("수정시작");
      formData.append("plantPestId", editPlantPestId);
      formData.append("fileId", fileId);

      updatePestLogs(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setPlantPestDate(null);
          setPlantPestMemo("");
          setEditingLog(true);
          setSelectedFile(null);
          setSelectedFileName("");

          refetch();
        })
        .catch((err) => {
          console.error("수정 실패:", err);
          showAlert("수정 실패");
        });
    } else {
      console.log("저장 시작");
      savePestInfo(formData)
        .unwrap()
        .then((res) => {
          showAlert(res.message);
          setPlantPestDate(null);
          setPlantPestMemo("");
          setEditingLog(true);
          setSelectedFile(null);
          setSelectedFileName("");

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
      await deletePestLogs(id).unwrap(); // 삭제 요청
      showAlert("일지가 성공적으로 삭제되었습니다.");

      refetch();
    } catch (error) {
      console.error("삭제실패:", error);
      showAlert("삭제 중 오류 발생");
    }
  };

  const handleEditLog = (id) => {
    const logToEdit = pestLogs.find((log) => log.plantPestId === id);
    if (logToEdit) {
      console.log("logToEdit", logToEdit);
      setPlantPestDate(dayjs(logToEdit.plantPestDate));
      setPlantPestMemo(logToEdit.plantPestMemo);
      setEditingLog(false);
      setEditPlantPestId(id);
      setFileId(logToEdit.fileId);
      if (logToEdit.fileOriginName) {
        setSelectedFileName(logToEdit.fileOriginName);
        // 만약 기존 파일을 미리보기로 보여주고 싶다면 여기에서 URL을 설정해야 할 수 있습니다.
        // setSelectedFile(null); // 새 파일 선택을 위해 null로 초기화
      } else {
        setSelectedFileName(""); // 기존 파일이 없다면 파일명도 초기화
      }
      setSelectedFile(null); // 새 파일 선택을 위해 기존 선택된 파일 초기화
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("file : ", file);
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } else {
      setSelectedFile(null); // 선택된 파일 저장
      setSelectedFileName(""); // 파일 이름 저장
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        {/*식물 정보 수정 버튼*/}
        <Button
          sx={{
            marginTop: "10",
            marginLeft: 40,
            backgroundColor: "#889F7F",
            width: 40,
            height: 30,
            minWidth: "unset",
            padding: 0,
            fontSize: "12px",
            borderRadius: "55%",
            color: "#fff",
          }}
          onClick={() => {
            navigate(`/PlantUpdate.do?plantId=${plantId}`);
          }}
        >
          수정
        </Button>

        <Box
          className="plant-info-header"
          sx={{
            marginLeft: 3,
          }}
        >
          <Box
            className="plant-details"
            sx={{
              marginTop: 3,
            }}
          >
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
            src={
              plantInfo?.data[0]?.fileId && plantInfo.data.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${plantInfo.data[0].fileId}`
                : DefaultImage
            }
            className="plant-avatar"
          />
        </Box>

        <Box className="tab-menu-container">
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            className="plant-care-tabs"
            TabIndicatorProps={{ style: { backgroundColor: "black" } }}
            sx={{
              "& .MuiTab-root": {
                color: "#aaa", // 기본 글자 색
              },
              "& .Mui-selected": {
                color: "#303030",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#000",
              },
            }}
          >
            <Tab label="물주기" />
            <Tab label="일조량" />
            <Tab label="분갈이" />
            <Tab label="병충해" />
          </Tabs>
        </Box>

        <Box className="tab-content-display">
          <PestContent
            plantPestDate={plantPestDate}
            setPlantPestDate={setPlantPestDate}
            plantPestMemo={plantPestMemo}
            setPlantPestMemo={setPlantPestMemo}
            handleSave={handleSave}
            pestLogs={pestLogs}
            onDeleteLog={handleDeleteLog}
            onEditLog={handleEditLog}
            selectedFileName={selectedFileName}
            handleFileChange={handleFileChange}
            editingLog={editingLog}
            showWaterLogs={showWaterLogs}
            setShowWaterLogs={setShowWaterLogs}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantPest;
