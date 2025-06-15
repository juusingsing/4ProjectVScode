import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  TextField,
  Typography,
  InputBase
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CmUtil } from '../../cm/CmUtil';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { Tabs, Tab } from '@mui/material';
import Combo from '../../page/combo/combo';
import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { usePet_Form_HospitalMutation } from '../../features/pet/petApi'; // 경로는 실제 프로젝트에 맞게 조정
import { usePet_Form_Hospital_UpdateMutation } from '../../features/pet/petApi';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckBoxIcon from '@mui/icons-material/CheckBox'; // 체크된 박스 아이콘
import { useComboListByGroupQuery } from '../../features/combo/combo';
import { useGetPetByIdQuery } from '../../features/pet/petApi';
const FormRow = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  let backgroundColor = '#E0E0E0';
  let border = '1px solid #ccc';
  let borderRadius = '20px';
  let textDecoration = 'none';
  let fontWeight = 'normal';
  let color = 'inherit';
  let minHeight = undefined;

  if (fieldKey === 'notes') {
    backgroundColor = '#D9D9D9';
    fontWeight = 'bold';
    color = '#000';
    minHeight = 80;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:30, top: 7 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: 'center',
            fontSize: '8px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          top: 7,
          left: '20px',  
          width: '70px',
          height: '20px',
          backgroundColor,
          border,
          borderRadius,
          px: 1,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};
const FormRow1 = ({ label, value = '', onChange, multiline = false, inputRef, fieldKey = '' }) => {
  let backgroundColor = '#E0E0E0';
  let border = '1px solid #ccc';
  let borderRadius = '20px';
  let textDecoration = 'none';
  let fontWeight = 'normal';
  let color = 'inherit';
  let minHeight = undefined;

  if (fieldKey === 'notes') {
    backgroundColor = '#D9D9D9';
    fontWeight = 'bold';
    color = '#000';
    minHeight = 80;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 'normal', mt: multiline ? '6px' : 0, position: 'relative', left:20, top: 5 }}>
        {label}
      </Typography>
      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} 입력`}
        multiline={multiline}
        inputRef={inputRef}
        inputProps={{
          style: {
            padding: 0,
            textAlign: 'center',
            fontSize: '14px',
            ...(multiline ? { paddingTop: 4 } : {}),
          }
        }}
        sx={{
          left: '100px',  
          width: '142px',
          height: '30px',
          backgroundColor,
          border,
          borderRadius: '11px',
          px: 1,
          py: 1,
          fontWeight,
          textDecoration,
          color,
          ...(multiline && { minHeight }),
        }}
      />
    </Box>
  );
};

const DateInputRow = ({ label, value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography
        sx={{
          width: 66, // 넉넉한 고정 너비
          fontSize: 14,
          fontWeight: 500,
          textAlign: 'center',
          mr: -1, // label과 DatePicker 사이 간격
        }}
      >
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <DatePicker
          value={value}
          onChange={onChange}
          format="YYYY.MM.DD"
          slotProps={{
            textField: {
              variant: 'outlined',
              size: 'small',
              fullWidth: false,
              InputProps: {
                readOnly: true,
                sx: {
                
                  left: 133,
                  width: 141,
                  height: 30,
                  backgroundColor: '#D9D9D9',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 'normal',
                  pr: '12px',
                  pl: '12px',
                  '& input': {
                    textAlign: 'center',
                    padding: 0,
                  },
                },
              },
              inputProps: {
                style: {
                  textAlign: 'center',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

const Pet_Form_Hospital = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
   const pathToTabIndex = {
    '/pet/petFormHospital.do': 0,
    '/pet/petFormEatAlarm.do': 1,
    '/pet/petFormTrainingAndAction.do': 2,
  };

  const tabIndexToPath = [
    '/pet/petFormHospital.do',
    '/pet/petFormEatAlarm.do',
    '/pet/petFormTrainingAndAction.do',
  ];
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState(dayjs()); 
  const [animalVisitDate, setAnimalVisitDate] = useState(dayjs());
  const [animalTreatmentMemo, setAnimalTreatmentMemo] = useState('');
  const animalTreatmentMemoRef = useRef();
  const [animalHospitalName, setAnimalHospitalName] = useState('');
  const animalHospitalNameRef = useRef();
  const [animalTreatmentType, setAnimalTreatmentType] = useState('');
  const [petFormHospital] = usePet_Form_HospitalMutation();
  const [petFormHospitalUpdate] = usePet_Form_Hospital_UpdateMutation();
  const [animalMedication, setAnimalMedication] = useState('');
  const animalMedicationRef = useRef();
  const { showAlert } = useCmDialog();
  const [selectedTab, setSelectedTab] = useState(pathToTabIndex[location.pathname] || 0);
  const [animalName, setAnimalName] = useState('');
  const [animalId, setAnimalId] = useState(null);
  const [records, setRecords] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5); // 현재 보여줄 데이터 개수
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [animalHospitalTreatmentId, setAnimalHospitalTreatmentId] = useState(null);
  const { data: comboData, isLoading: comboLoading } = useComboListByGroupQuery('Medical');
  const { data, isLoading: isPetLoading } = useGetPetByIdQuery(animalId, {
      skip: !animalId,
  });
  const [treatmentTypeMap, setTreatmentTypeMap] = useState({}); // codeId → codeName 매핑 객체
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const safeUrl = existingImageUrl || '';
 
  console.log("동물 ID 확인:", animalId); // → 8이어야 정상
  useEffect(() => {
      if (data?.data) {
        const fetchedPet = data.data;
        setAnimalName(fetchedPet.animalName || '');
        
        setAnimalAdoptionDate(fetchedPet.animalAdoptionDate ? dayjs(fetchedPet.animalAdoptionDate) : null);
       
        // 서버에서 받아온 이미지 URL 저장
        
      if (fetchedPet.fileUrl) {
        setExistingImageUrl(fetchedPet.fileUrl);  // 이미 전체 URL임
      }
      }
      console.log("✅ RTK Query 응답 data:", data);
      console.log("existingImageUrl:", existingImageUrl);
      console.log("imageFile:", imageFile);
    }, [data]);

  useEffect(() => {
    if (!expanded) {
      setVisibleCount(5);
    }
  }, [expanded]);
  
  const toggleDropdown = () => {
    setExpanded(prev => !prev);
  };
  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, records.length));
  };
  

  const handleEdit = (record) => {
    setAnimalVisitDate(dayjs(record.animalVisitDate));
    setAnimalHospitalName(record.animalHospitalName);
    setAnimalMedication(record.animalMedication);
    console.log("수정할 진료 내용 값:", record.animalTreatmentType);
    setAnimalTreatmentType(record.animalTreatmentType);
    setAnimalTreatmentMemo(record.animalTreatmentMemo);
    setIsEditing(true);
    setEditId(record.animalHospitalTreatmentId);
    setExpanded(true);
  };

  const handleDelete = async (id) => {
    try {
      // API 호출해서 서버에 del_yn='Y'로 변경 요청
      const response = await fetch(`http://localhost:8081/api/petHospital/delete.do`, {
        method: 'POST', // 혹은 DELETE (백엔드에 맞게)
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animalHospitalTreatmentId: id }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('삭제 실패');

      // 성공하면 화면에서 해당 항목 제거
      setRecords(prev => prev.filter(r => r.animalHospitalTreatmentId !== id));
      showAlert('삭제가 완료되었습니다.');
    } catch (error) {
      console.error('삭제 오류:', error);
      showAlert('삭제 중 오류가 발생했습니다.');
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idFromQuery = searchParams.get('animalId');
    if (idFromQuery) {
      setAnimalId(idFromQuery);
    }
  }, [location.search]);
  
  useEffect(() => {
    if (comboData?.data) {
      const map = {};
      comboData.data.forEach(item => {
        map[item.codeId] = item.codeName;
      });
      setTreatmentTypeMap(map);
    }
  }, [comboData]); 

  useEffect(() => {
    if (!animalId) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/petHospital/list.do', {
          method: 'GET',
          credentials: 'include', // 세션 쿠키 포함
        });
        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        console.log('Fetched data:', data);
        const filtered = data.filter(item => String(item.animalId) === String(animalId));
        const sorted = [...filtered].sort((a, b) => new Date(b.createDt) - new Date(a.createDt));
        setRecords(sorted);
      } catch (err) {
        console.error('Fetch 에러:', err);
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

    if (!animalId) return showAlert('동물을 선택해주세요.');
    if (!dayjs(animalVisitDate).isValid()) return showAlert('방문 날짜를 선택해주세요.');
    if (CmUtil.isEmpty(animalHospitalName)) return showAlert('병원 이름을 입력해주세요.');
    if (CmUtil.isEmpty(animalMedication)) return showAlert('처방약을 입력해주세요.');

    const formData = new FormData();

    if (isEditing && editId != null) {
      formData.append("animalHospitalTreatmentId", editId);
    }

    formData.append('animalId', animalId);
    formData.append('animalVisitDate', dayjs(animalVisitDate).format('YYYY-MM-DD'));
    formData.append('animalHospitalName', animalHospitalName);
    formData.append('animalMedication', animalMedication);
    formData.append('animalTreatmentType', animalTreatmentType);
    formData.append('animalTreatmentMemo', animalTreatmentMemo);

    try {
      if (isEditing) {
        const updatedData = await petFormHospitalUpdate(formData).unwrap();
        setRecords(prev =>
          prev.map(r =>
            r.animalHospitalTreatmentId === editId ? updatedData : r
          )
        );
        showAlert('수정이 완료되었습니다.');
      } else {
        const result = await petFormHospital(formData).unwrap();
        const newRecord = {
          animalHospitalTreatmentId: result.animalHospitalTreatmentId,
          animalId,
          animalVisitDate: dayjs(animalVisitDate).format('YYYY-MM-DD'),
          animalHospitalName,
          animalMedication,
          animalTreatmentType,
          animalTreatmentMemo,
        };
        setRecords(prev => [newRecord, ...prev]);
        showAlert('등록이 완료되었습니다.');
      }

      // 초기화
      setAnimalVisitDate(dayjs());
      setAnimalHospitalName('');
      setAnimalMedication('');
      setAnimalTreatmentType('');
      setAnimalTreatmentMemo('');
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('저장 실패:', error);
      showAlert('저장 중 오류가 발생했습니다.');
    }
  };

   
  

  return (
  <Box>
    {/* 전체 폼 박스 */}
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 360, // Android 화면 폭
        height: 640,   // Android 화면 높이
        margin: '0 auto',
        overflowY: 'auto', // 스크롤 가능하게
        borderRadius: '12px',
        backgroundColor: '#fff',
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        padding: 2,
      }}
    >
      {/* 왼쪽 입력 */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1">동물 이름</Typography>
          <Typography>{animalName}</Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1">입양일</Typography>
          <Typography>{animalAdoptionDate?.format('YYYY-MM-DD')}</Typography>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bottom: 3,
              left: 25,
              backgroundColor: '#88AE97',
              borderRadius: '30px',
              width: 150,
              height: 20,
              px: 6,
              py: 1.5,
              fontSize: 13,
              fontWeight: 'bold',
            }}
          >
            산책하기
          </Button>
        </Box>
      </Box>
             {/* 오른쪽 이미지 */}
      <Box sx={{ position: 'relative', left: '35px', top: 8 }}>
        <Box
          src={imageFile ? URL.createObjectURL(imageFile) : existingImageUrl}
          key={imageFile ? imageFile.name : existingImageUrl} // key로 강제 리렌더링 유도
          sx={{
            width: 100,
            height: 76,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid white',
            backgroundColor: '#A5B1AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      
        <Button
          variant="contained"
          size="small"
          sx={{
            position: 'relative',
            top: -101,
            right: -80,
            backgroundColor: '#889F7F',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'normal',
            borderRadius: '55%',
            width: 40,
            height: 26,
            minWidth: 'unset',
            padding: 0,
            zIndex: 2,
            textTransform: 'none',
          }}
          onClick={() => {
            window.location.href = '/pet/petFormUpdate.do';
          }}
        >
          수정
        </Button>
      </Box>
    </Box>
   
    {/* ✅ 탭은 폼 바깥에 위치 */}
    {/* 폼 컴포넌트 아래 탭 - 간격 좁히기 */}
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: -70 }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          width: 360,
          minHeight: '36px',
          '& .MuiTab-root': {
            fontSize: '13px',
            color: '#777',
            fontWeight: 500,
            minHeight: '36px',
            borderBottom: '2px solid transparent',
          },
          '& .Mui-selected': {
            color: '#000',
            fontWeight: 600,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#000',
          },
        }}
      >
        <Tab label="병원진료" />
        <Tab label="먹이알림" />
        <Tab label="훈련/행동" />
      </Tabs>
    </Box>
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 2 }}>
      <DateInputRow label="병원진료 날짜" value={animalVisitDate} onChange={setAnimalVisitDate} />
      <FormRow1 label="병원 이름" value={animalHospitalName} onChange={setAnimalHospitalName} inputRef={animalHospitalNameRef}/>
      <FormRow1 label="처방약" value={animalMedication} onChange={setAnimalMedication} inputRef={animalMedicationRef} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 13 }}>
        <Typography
          sx={{
            width: 92,
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
            height: 30,
          }}
        >
          진료 내용
        </Typography>
        <Combo
          key={animalTreatmentType || 'default'} // ← 이 줄이 중요합니다!
          groupId="Medical"
          value={animalTreatmentType}
          onSelectionChange={(val) => setAnimalTreatmentType(val)}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
          <InputBase
            value={animalTreatmentMemo}
            onChange={(e) => setAnimalTreatmentMemo(e.target.value)}
            inputRef={animalTreatmentMemoRef}
            multiline
            inputProps={{
              style: {
                padding: 0,
                paddingTop: 4,
                fontSize: 13,
              }
            }}
            sx={{
              backgroundColor: '#D9D9D9',
              borderRadius: '12px',
              px: 2,
              py: 1,
              left: 18,
              width : 314,
              minHeight: 70,
              textDecoration: 'none',
              fontWeight: 'normal',
              color: '#000',
              display: 'flex',
              alignItems: 'flex-start',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              left: -3,
              backgroundColor: '#556B2F',
              borderRadius: '20px',
              px: 4,
              py: 1,
              fontSize: 14,
            }}
          >
            {isEditing ? '수정' : '저장'}
          </Button>
        </Box>
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              variant="h6"
              onClick={toggleDropdown}
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} 기록 리스트
            </Typography>
          </Box>

          {expanded && (
            <Box mt={3} sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {records.slice(0, visibleCount).map((record) => (
                <Box
                  component="fieldset"
                  key={record.animalHospitalTreatmentId}
                  sx={{
                    mb: 2,
                    border: '1px solid #ccc',
                    p: 2,
                    position: 'relative',
                  }}
                >
                 <legend style={{ fontWeight: 'bold', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <CheckBoxIcon sx={{ fontSize: 18, color: '#333', mr: 1 }} />
                  병원 진료 확인
                 </legend>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {dayjs(record.animalVisitDate).format('YYYY.MM.DD')} {record.animalHospitalName} | {treatmentTypeMap[record.animalTreatmentType] || '없음'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'normal', mb: 0.5 }}>
                    처방약 : {record.animalMedication}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    진료 내용 : {record.animalTreatmentMemo}
                  </Typography>
                  <Box position="absolute" top={8} right={8}>
                    <IconButton onClick={() => handleEdit(record)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(record.animalHospitalTreatmentId)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
        </Box>
      </Box>
  </Box>
);
};
export default Pet_Form_Hospital; 