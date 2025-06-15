// import React, { useState, useEffect } from "react";
// import { useCmDialog } from "../../cm/CmDialogUtil";
// import { useSearchParams } from "react-router-dom";
// import { FaCamera } from "react-icons/fa";

// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Avatar,
//   Tabs,
//   Tab,
//   IconButton,
// } from "@mui/material";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import dayjs from "dayjs";
// //훅
// import {
//   useSavePestInfoMutation,
//   usePestLogsQuery,
//   useDeletePestLogsMutation,
//   useUpdatePestLogsMutation,
//   usePlantInfoQuery,
// } from "../../features/plant/plantApi";
// // import "../../css/plantPest.css";

// import PlantWatering from "./PlantWatering"; // 물주기 탭
// import PlantSunlighting from "./PlantSunlighting"; // 일조량 탭
// import PlantRepotting from "./PlantRepotting"; // 분갈이 탭
// import DefaultImage from "../../image/default-plant.png";

// const PestContent = ({
//   plantPestDate,
//   setPlantPestDate,
//   plantPestMemo,
//   setPlantPestMemo,
//   pestLogs,
//   handleSave,
//   editingLog,
//   onDeleteLog,
//   onEditLog,
//   imagePreview,
//   handleImageChange,
// }) => (
//   <Box className="pest-tab-content">
//     <Box className="pest-date">
//       <Typography className="date-label">병충해날짜</Typography>
//       <DatePicker
//         value={plantPestDate}
//         onChange={(newValue) => setPlantPestDate(newValue)}
//         inputFormat="YYYY-MM-DD"
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             variant="outlined"
//             size="small"
//             className="input-field-wrapper"
//             InputProps={{
//               sx: {
//                 borderRadius: "8px",
//                 backgroundColor: "#f0f0f0",
//                 "& .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "transparent",
//                 },
//                 "&:hover .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "transparent",
//                 },
//                 "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                   borderColor: "transparent",
//                 },
//               },
//             }}
//           />
//         )}
//       />
//     </Box>

//     {/* 이미지 업로드 섹션 시작 */}
//     <Box sx={{ textAlign: "center", position: "relative", marginBottom: 3 }}>
//       <Avatar
//         src={imagePreview || DefaultImage} // 미리보기 이미지가 없으면 기본 이미지 표시
//         sx={{ width: 100, height: 100, margin: "auto" }}
//       />
//       <input
//         id="pestImageUpload" // 고유한 ID 사용
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         style={{ display: "none" }}
//       />
//       <label htmlFor="pestImageUpload">
//         <IconButton
//           component="span"
//           sx={{
//             position: "absolute",
//             top: "65px",
//             left: "calc(50% + 15px)",
//             backgroundColor: "white",
//             boxShadow: 1,
//             width: 30,
//             height: 30,
//             "&:hover": { backgroundColor: "#e0e0e0" },
//           }}
//         >
//           <FaCamera style={{ fontSize: "1rem" }} />
//         </IconButton>
//       </label>
//     </Box>
//     {/* 이미지 업로드 섹션 끝 */}

//     <Box className="pest-memo">
//       <Typography className="pest-memo-label">메모</Typography>
//       <TextField
//         className="pest-memo-textfield"
//         multiline
//         rows={3}
//         value={plantPestMemo}
//         onChange={(e) => setPlantPestMemo(e.target.value)}
//         variant="outlined"
//       />
//     </Box>

//     <Button
//       variant="contained"
//       className="save-button"
//       onClick={handleSave}
//       sx={
//         editingLog !== null
//           ? {
//               backgroundColor: "#88AE97 !important",
//               "&:hover": {
//                 backgroundColor: "#6e927e !important",
//               },
//             }
//           : undefined
//       }
//     >
//       {editingLog !== null ? "수정" : "저장"}
//     </Button>

//     <Box className="pest-log-section">
//       <Box className="log-header">
//         <IconButton className="log-toggle-icon">
//           <CheckBoxIcon sx={{ fontSize: 20 }} />
//         </IconButton>
//         <Typography className="log-title">기록 리스트</Typography>
//         <IconButton className="log-dropdown-arrow">
//           <ArrowDropDownIcon />
//         </IconButton>
//       </Box>
//       {!pestLogs || pestLogs.length === 0 ? (
//         <Typography>일지가 없습니다.</Typography>
//       ) : (
//         pestLogs.map((log) => (
//           <Box key={log.plantPestId} className="log-entry">
//             <Box className="log-details">
//               <Typography>{log.plantPestDate}</Typography>
//               {log.fileId && (
//                 <img 
//                   src={`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${log.fileId}`} 
//                   alt="Pest Log" 
//                   style={{ width: '50px', height: '50px', borderRadius: '4px', marginRight: '8px' }}
//                 />
//               )}
//               <Typography>{log.plantPestMemo}</Typography>
//             </Box>
//             <Box className="log-actions">
//               <Button
//                 variant="text"
//                 className="log-action-button"
//                 onClick={() => onDeleteLog(log.plantPestId)}
//               >
//                 삭제
//               </Button>
//               <Button
//                 variant="text"
//                 className="log-action-button"
//                 onClick={() => onEditLog(log.plantPestId)}
//               >
//                 수정
//               </Button>
//             </Box>
//           </Box>
//         ))
//       )}
//     </Box>
//   </Box>
// );

// // 메인 컴포넌트
// const PlantPest = () => {
//   const { showAlert } = useCmDialog();
//   const [savePestInfo] = useSavePestInfoMutation(); // 등록용
//   const [updatePestLogs] = useUpdatePestLogsMutation(); // 수정용

//   const [plantId] = useState(6); //동적으로 가져오게 수정해야함

//   // 중앙에서 탭 상태를 관리합니다.
//   const [currentTab, setCurrentTab] = useState(3); // 일조량 탭이 기본 선택

//   const [plantPestDate, setPlantPestDate] = useState(null);
//   const [plantPestMemo, setPlantPestMemo] = useState("");

//   const [pestLogs, setPestLogs] = useState([]); // 로그 조회용
//   const [deletePestLogs] = useDeletePestLogsMutation(); // 로그 삭제용
//   const { data: plantInfo } = usePlantInfoQuery(plantId);

//   const [searchParams] = useSearchParams();

//   const [editingLog, setSelectedLog] = useState(null);
//   const [editStatus, setStatus] = useState("");
//   const [editMemo, setMemo] = useState("");

  
//   const handleSelectLog = (log) => {
//     setSelectedLog(log);
//     setStatus(log.soilCondition);
//     setMemo(log.repottingMemo);
//   };

//   const id = searchParams.get("id");
//   const { data: fetchedLogs, error, refetch } = usePestLogsQuery({ plantId });

  
//   const handleTabChange = (event, newValue) => {
//     setCurrentTab(newValue);
//   };

//   // 처음 렌더링 시 데이터 가져오기
//   useEffect(() => {
//     if (fetchedLogs) {
//       setPestLogs(fetchedLogs.data);
//     }
//   }, [fetchedLogs]);

//   const handleSave = () => {
//     const formData = {
//       plantId: parseInt(plantId),
//       plantPestDate: plantPestDate ? plantPestDate.format("YYYY-MM-DD") : null,
//       plantPestMemo: plantPestMemo,
//     };

//     if (editingLog !== null) {
//       //수정
//       formData.plantPestId = editingLog;
//       updatePestLogs(formData)
//         .unwrap()
//         .then((res) => {
//           showAlert(res.message);
//           setPlantPestDate(null);
//           setPlantPestMemo("");
//           setSelectedLog(null);
//           refetch();
//         })
//         .catch((err) => {
//           console.error("수정 실패:", err);
//           showAlert("수정 실패");
//         });
//     } else {
//       //저장
//       savePestInfo(formData)
//         .unwrap()
//         .then((res) => {
//           showAlert(res.message);
//           setPlantPestDate(null);
//           setPlantPestMemo("");
//           setSelectedLog(null);

//           const plantData = new FormData();
//           plantData.append("plantId", 1);
//           refetch();
//         })
//         .catch((err) => {
//           console.error("저장 실패:", err);
//           showAlert("저장 실패");
//         });
//     }
//   };

//   const handleDeleteLog = async (id) => {
//     try {
//       await deletePestLogs(id).unwrap(); // 삭제 요청
//       showAlert("일지가 성공적으로 삭제되었습니다.");

//       refetch();
//     } catch (error) {
//       console.error("삭제실패:", error);
//       showAlert("삭제 중 오류 발생");
//     }
//   };

//   const handleEditLog = (id) => {
//     const logToEdit = pestLogs.find((log) => log.plantPestId === id);
//     if (logToEdit) {
//       setPlantPestDate(dayjs(logToEdit.plantPestDate));
//       setPlantPestMemo(logToEdit.plantPestMemo);
//       setSelectedLog(id);
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box className="plant-care-container">
//         {/*식물 정보 수정 버튼*/}
//         <Button variant="contained" className="edit-top-button">
//           수정
//         </Button>

//         <Box className="plant-info-header">
//           <Box className="plant-details">
//             <Box className="plant-detail-row">
//               <Typography className="plant-label">식물 이름</Typography>
//               <Box className="plant-value-box">
//                 <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
//                   {/* 배열안에 데이터 있음 */}
//                   {plantInfo?.data && plantInfo.data.length > 0
//                     ? plantInfo.data[0].plantName
//                     : "정보 없음"}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box className="plant-detail-row">
//               <Typography className="plant-label">입수일 날짜</Typography>
//               <Box className="plant-value-box">
//                 <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
//                   {/* 배열안에 데이터 있음 */}
//                   {plantInfo?.data && plantInfo.data.length > 0
//                     ? plantInfo.data[0].plantPurchaseDate
//                     : "정보 없음"}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//           <Avatar
//             src={`${
//               process.env.REACT_APP_API_BASE_URL
//             }/file/imgDown.do?fileId=${
//               plantInfo?.data && plantInfo.data.length > 0
//                 ? plantInfo.data[0].fileId
//                 : ""
//             }`}
//             className="plant-avatar"
//           />
//         </Box>

//         <Box className="tab-menu-container">
//           <Tabs
//             value={currentTab}
//             onChange={handleTabChange}
//             className="plant-care-tabs"
//             TabIndicatorProps={{ style: { backgroundColor: "black" } }}
//           >
//             <Tab label="물주기" />
//             <Tab label="일조량" />
//             <Tab label="분갈이" />
//             <Tab label="병충해" />
//           </Tabs>
//         </Box>

//         <Box className="tab-content-display">
//           {currentTab === 0 && <PlantWatering tabName="물주기" />}
//           {currentTab === 1 && <PlantSunlighting tabName="일조량" />}
//           {currentTab === 2 && <PlantRepotting tabName="분갈이" />}
//           {currentTab === 3 && (
//             <PestContent
//               plantPestDate={plantPestDate}
//               setPlantPestDate={setPlantPestDate}
//               plantPestMemo={plantPestMemo}
//               setPlantPestMemo={setPlantPestMemo}
//               handleSave={handleSave}
//               pestLogs={pestLogs}
//               onDeleteLog={handleDeleteLog}
//               onEditLog={handleEditLog}
//             />
//           )}
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default PlantPest;
