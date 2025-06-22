import React, { useState, useEffect, useSearchParams } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  CardContent,

} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import Combo from "../combo/combo";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { usePet_Form_Training_And_ActionMutation } from "../../features/pet/petApi"; // 경로는 실제 프로젝트에 맞게 조정
import { usePet_Form_Training_And_Action_UpdateMutation } from "../../features/pet/petApi";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckBoxIcon from "@mui/icons-material/CheckBox"; // 체크된 박스 아이콘
import { useComboListByGroupQuery } from "../../features/combo/combo";
import { useGetPetByIdQuery } from "../../features/pet/petApi";

import { Height } from "@mui/icons-material";

const RepottingContent = ({
  animalRecordDate,
  setAnimalRecordDate,
  setAnimalTrainingType,
  animalTrainingType,
  animalTrainingMemo,
  setAnimalTrainingMemo,
  handleSubmit,
  isEditing,
  toggleDropdown,
  handleLoadMore,
  expanded,
  records,
  visibleCount,
  trainingTypeMap,
  handleDelete,
  handleEdit,
}) => {
  return (
    <>
      {/* 알림 설정 영역 */}
    <Box>
        <Box sx={{
           display: "flex",
           justifyContent: "space-between",
           alignItems:"center",
        }}>
          <Typography sx={{fontWeight:"700", marginTop:1}}>날짜 🔔</Typography>
            <Box sx={{marginTop:"10px"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DatePicker
                    format="YYYY.MM.DD"
                    value={animalRecordDate}
                    onChange={(newValue) => {
                    setAnimalRecordDate(newValue);
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
                            width: "150px",
                            pl:'28px'
                          },
                        },
                      },
                    }}
                    />
                </LocalizationProvider>
            </Box>
        </Box>

        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems:"center",
            marginBottom:2
            }}>
            <Typography sx={{marginTop:2}}>훈련행동일지</Typography>
            <Combo
              groupId="Exercise"
              onSelectionChange={setAnimalTrainingType}
              defaultValue={animalTrainingType}
              sx={{
                  fontSize:14,
                  width: "150px",
                  height: "37px",
                  backgroundColor: "#F8F8F8",
                  borderRadius:"8px",
              }}
            />
     
        </Box>

        <Box className="light-status-section">
            <Typography className="light-status-title">훈련행동일지</Typography>
            <TextField
            className="sunlight-status-textfield"
            multiline
            rows={5}
            value={animalTrainingMemo}
            onChange={(e) => setAnimalTrainingMemo(e.target.value)}
            variant="outlined"
            />
        </Box>

        <Button
              variant="contained"
              className="save-button"
              onClick={handleSubmit}
              sx={
                !isEditing
                  ? {
                      backgroundColor: "#6e927e !important",        // 저장
                      "&:hover": {
                        backgroundColor: "#88AE97 !important",
                      },
                    }
                  : undefined   // 수정
              }
            >
              {!isEditing ? "저장" : "수정"}
        </Button>

    </Box>



      <Typography
          variant="h6"
          onClick={toggleDropdown}
          sx={{ cursor: "pointer", fontWeight: "bold", mt:2 }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} 기록 리스트
        </Typography>

      {expanded && (
        <Box mt={3} sx={{ maxHeight: 400, overflowY: "auto" }}>
          {records.slice(0, visibleCount).map((record) => (
            <Box
              component="fieldset"
              key={record.animalTrainingAction}
              sx={{
                mb: 2,
                border: "1px solid #ccc",
                p: 2,
                position: "relative",
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
                훈련/행동 확인
              </legend>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {dayjs(record.animalRecordDate).format("YYYY.MM.DD")} |{" "}
                {record.animalTrainingType
                  ? trainingTypeMap[record.animalTrainingType]
                  : "없음"}
              </Typography>

              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {record.animalTrainingMemo}
              </Typography>
              <Box position="absolute" top={8} right={8}>
                <Button color="black">
                  <span
                    onClick={() =>
                      handleDelete(record.animalTrainingAction)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    삭제
                  </span>
                  <span style={{ margin: "0 6px" }}>|</span>
                  <span
                    onClick={() => handleEdit(record)}
                    style={{ cursor: "pointer" }}
                  >
                    수정
                  </span>
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {expanded && visibleCount < records.length && (
        <Box textAlign="center" mt={1}>
          <Button variant="outlined" onClick={handleLoadMore}>
            + 더보기
          </Button>
        </Box>
      )}
    </>
  );
};


const Pet_Form_Training_And_Action = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const animalId = searchParams.get("animalId"); // 동물아이디 animalId parm에 저장
  
  const pathToTabIndex = {
    "/pet/petFormHospital.do": 0,
    "/pet/petFormEatAlarm.do": 1,
    "/pet/petFormTrainingAndAction.do": 2,
  };

  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(dayjs());
  const [animalTrainingAction, setAnimalTrainingAction] = useState("");
  const [animalRecordDate, setAnimalRecordDate] = useState(dayjs());
  const [animalTrainingType, setAnimalTrainingType] = useState("");
  const [animalTrainingMemo, setAnimalTrainingMemo] = useState("");
  const [animalName, setAnimalName] = useState("");
  const { showAlert } = useCmDialog();
  const [selectedTab, setSelectedTab] = useState(
    pathToTabIndex[location.pathname] || 0
  );
  const [petFormTrainingAndAction] = usePet_Form_Training_And_ActionMutation();
  const [petFormTrainingAndActionUpdate] =
    usePet_Form_Training_And_Action_UpdateMutation();
  const [records, setRecords] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // 현재 보여줄 데이터 개수
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState();
  console.log("동물 ID 확인:", animalId); // → 8이어야 정상
  const { data: comboData, isLoading: comboLoading } =
    useComboListByGroupQuery("Exercise");
  const [trainingTypeMap, setTrainingTypeMap] = useState({}); // codeId → codeName 매핑 객체
  // animalId가 null이면 쿼리 실행하지 않음
  const { data : petInfo, isLoading: isPetLoading } = useGetPetByIdQuery(animalId, {
    skip: !animalId,
  });

  const tabIndexToPath = [
    `/pet/petFormHospital.do?animalId=${animalId}`,
    `/pet/petFormEatAlarm.do?animalId=${animalId}`,
    `/pet/petFormTrainingAndAction.do?animalId=${animalId}`,
  ];

  useEffect(() => {
    console.log("petInfo : ", petInfo);
    if (petInfo?.data) {
      const fetchedPet = petInfo?.data;
      setAnimalName(fetchedPet.animalName || "");

      setAnimalAdoptionDate(
        fetchedPet.animalAdoptionDate
          ? dayjs(fetchedPet.animalAdoptionDate)
          : null
      );

      // 서버에서 받아온 이미지 URL 저장

      if (fetchedPet.fileUrl) {
        setFileUrl(fetchedPet.fileUrl); // ✅ 이거 추가
        console.log("fileUrl", fetchedPet.fileUrl);
      } else {
        setExistingImageUrl("");
      }
    }

  }, [petInfo]);

  useEffect(() => {
    console.log("existingImageUrl 상태 업데이트 됨:", existingImageUrl);
  }, [existingImageUrl]);
  useEffect(() => {
    if (!expanded) {
      setVisibleCount(5);
    }
  }, [expanded]);

  const toggleDropdown = () => {
    setExpanded((prev) => !prev);
  };
  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, records.length));
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditId(record.animalTrainingAction);
    setAnimalRecordDate(dayjs(record.animalRecordDate)); // 날짜 상태 설정
    setAnimalTrainingMemo(record.animalTrainingMemo); // 메모 입력 필드 설정
    setAnimalTrainingType(record.animalTrainingType);
    setExpanded(true);
  };

  const handleDelete = async (id) => {
    try {
      // API 호출해서 서버에 del_yn='Y'로 변경 요청
      const response = await fetch(
        `http://192.168.0.30:8081/api/petTrainingAndAction/delete.do`,
        {
          method: "POST", // 혹은 DELETE (백엔드에 맞게)
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ animalTrainingAction: id }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("삭제 실패");

      // 성공하면 화면에서 해당 항목 제거
      setRecords((prev) => prev.filter((r) => r.animalTrainingAction !== id));
      showAlert("삭제가 완료되었습니다.");
    } catch (error) {
      console.error("삭제 오류:", error);
      showAlert("삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (comboData?.data) {
      const map = {};
      comboData.data.forEach((item) => {
        map[item.codeId] = item.codeName;
      });
      setTrainingTypeMap(map);
    }
  }, [comboData]);

  useEffect(() => {
    if (!animalId) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch(
          "http://192.168.0.30:8081/api/petTrainingAndAction/list.do",
          {
            method: "GET",
            credentials: "include", // 세션 쿠키 포함
          }
        );
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        console.log("Fetched data:", data);
        const filtered = data.filter(
          (item) => String(item.animalId) === String(animalId)
        );
        const sorted = [...filtered].sort(
          (a, b) => new Date(b.createDt) - new Date(a.createDt)
        );
        setRecords(sorted);
      } catch (err) {
        console.error("Fetch 에러:", err);
      }
    };

    fetchRecords();
  }, [animalId]);
  // 탭 클릭 시 경로 이동
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalId) return showAlert("동물을 선택해주세요.");
    if (!dayjs(animalRecordDate).isValid())
      return showAlert("훈련행동 날짜를 선택해주세요.");

    const formData = new FormData();

    if (isEditing && editId != null) {
      formData.append("animalTrainingAction", editId);
    }

    formData.append("animalId", animalId);
    formData.append(
      "animalRecordDate",
      dayjs(animalRecordDate).format("YYYY-MM-DD")
    );
    formData.append("animalTrainingAction", animalTrainingAction);
    formData.append("animalTrainingMemo", animalTrainingMemo);
    formData.append("animalTrainingType", animalTrainingType);
    try {
      if (isEditing) {
        const updatedData = await petFormTrainingAndActionUpdate(
          formData
        ).unwrap();
        setRecords((prev) =>
          prev.map((r) => (r.animalTrainingAction === editId ? updatedData : r))
        );
        showAlert("수정이 완료되었습니다.");
      } else {
        const result = await petFormTrainingAndAction(formData).unwrap();
        const newRecord = {
          animalTrainingAction: result.animalTrainingAction,
          animalId,
          animalRecordDate: dayjs(animalRecordDate).format("YYYY-MM-DD"),
          animalTrainingType,
          animalTrainingMemo,
        };
        setRecords((prev) => [newRecord, ...prev]);
        showAlert("등록이 완료되었습니다.");
      }

      // 초기화
      setAnimalRecordDate(dayjs());
      setAnimalTrainingType("");
      setAnimalTrainingMemo("");
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error("저장 실패:", error);
      showAlert("저장 중 오류가 발생했습니다.");
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
                animalRecordDate={animalRecordDate}
                setAnimalRecordDate={setAnimalRecordDate}
                setAnimalTrainingType={setAnimalTrainingType}
                animalTrainingType={animalTrainingType}
                animalTrainingMemo={animalTrainingMemo}
                setAnimalTrainingMemo={setAnimalTrainingMemo}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
                toggleDropdown={toggleDropdown}
                handleLoadMore={handleLoadMore}
                expanded={expanded}
                records={records}
                visibleCount={visibleCount}
                trainingTypeMap={trainingTypeMap}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            </Box>
          </Box>
        </LocalizationProvider>

  );
};
export default Pet_Form_Training_And_Action;
