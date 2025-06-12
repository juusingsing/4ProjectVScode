// import React, { useState, useEffect } from "react";
// import { useCmDialog } from "../../cm/CmDialogUtil";
// import { useSearchParams } from "react-router-dom";
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
// } from "../../features/plant/plantApi";
// import "../../css/plantPest.css";

// import PlantWatering from "./PlantWatering"; // 물주기 탭
// import PlantSunlighting from "./PlantSunlighting"; // 일조량 탭
// import PlantRepotting from "./PlantRepotting"; // 분갈이 탭

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
//           <Box key={log.plantRepottingId} className="log-entry">
//             <Box className="log-details">
//               <Typography>
//                 {log.repottingDate} | {log.soilCondition}
//               </Typography>
//               <Typography>{log.pestMemo}</Typography>
//             </Box>
//             <Box className="log-actions">
//               <Button
//                 variant="text"
//                 className="log-action-button"
//                 onClick={() => onDeleteLog(log.plantRepottingId)}
//               >
//                 삭제
//               </Button>
//               <Button
//                 variant="text"
//                 className="log-action-button"
//                 onClick={() => onEditLog(log.plantRepottingId)}
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
//   const [repottingUpdateLogs] = useRepottingUpdateLogsMutation(); // 수정용

//   const [plantId] = useState("1"); // 실제 값은 API에서 받아야 함
//   const [plantName] = useState("몬스테라");
//   const [purchaseDate] = useState("2023-01-15");
//   const [currentTab, setCurrentTab] = useState(2); // 일조량 탭이 기본 선택

//   const [repottingDate, setRepottingDate] = useState(null);
//   const [soilConditionText, setSoilConditionText] = useState("");
//   const [repottingMemoText, setRepottingMemoText] = useState("");

//   const [pestLogs, setPestLogs] = useState([]); // 조회용
//   const [deleteRepottingLogs] = useDeleteRepottingLogsMutation(); // 삭제용
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
//   const {
//     data: fetchedLogs,
//     error,
//     refetch,
//   } = usePestLogsQuery({ plantId: 1 });

//   const handleTabChange = (event, newValue) => {
//     setCurrentTab(newValue);
//   };

//   // 처음 렌더링 시 데이터 가져오기
//   useEffect(() => {
//     if (fetchedLogs) {
//       setPestLogs(fetchedLogs.data);
//     }
//   }, [fetchedLogs, refetch]);

//   const handleSave = () => {
//     const formData = {
//       plantId: parseInt(plantId),
//       repottingDate: repottingDate ? repottingDate.format("YYYY-MM-DD") : null,
//       soilCondition: soilConditionText,
//       repottingMemo: repottingMemoText
//     };

//     if (editingLog !== null) {
//       //수정
//       formData.plantRepottingId = editingLog;
//       repottingUpdateLogs(formData)
//         .unwrap()
//         .then((res) => {
//           showAlert(res.message);
//           setRepottingDate(null);
//           setSoilConditionText("");
//           setRepottingMemoText("");
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
//           setRepottingDate(null);
//           setSoilConditionText("");
//           setRepottingMemoText("");
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
//       await deleteRepottingLogs(id).unwrap(); // 삭제 요청
//       showAlert("일지가 성공적으로 삭제되었습니다.");
      
//       refetch();
//     } catch (error) {
//       console.error("삭제실패:", error);
//       showAlert("삭제 중 오류 발생");
//     }
//   };

//   const handleEditLog = (id) => {
//     const logToEdit = pestLogs.find((log) => log.plantRepottingId === id);
//     if (logToEdit) {
//       setRepottingDate(dayjs(logToEdit.repottingDate));
//       setSoilConditionText(logToEdit.soilCondition); 
//       setRepottingMemoText(logToEdit.repottingMemo); 
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
//                   {plantName}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box className="plant-detail-row">
//               <Typography className="plant-label">입수일 날짜</Typography>
//               <Box className="plant-value-box">
//                 <Typography sx={{ fontSize: "0.8rem", textAlign: "center" }}>
//                   {purchaseDate}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>
//           <Avatar src="/plant.png" className="plant-avatar" />
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
//           {currentTab === 2 && (
//             <PestContent
//               repottingDate={repottingDate}
//               setRepottingDate={setRepottingDate}
//               soilConditionText={soilConditionText}
//               setSoilConditionText={setSoilConditionText}
//               repottingMemoText={repottingMemoText}
//               setRepottingMemoText={setRepottingMemoText}
//               handleSave={handleSave}
//               pestLogs={pestLogs}
//               onDeleteLog={handleDeleteLog}
//               onEditLog={handleEditLog}
//             />
//           )}
//           {currentTab === 3 && <PlantPest tabName="병충해" />}
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default PlantRepotting;

