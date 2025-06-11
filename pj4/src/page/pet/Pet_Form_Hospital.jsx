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
import { useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { usePet_Form_HospitalMutation } from '../../features/pet/petApi'; // 경로는 실제 프로젝트에 맞게 조정
import { usePet_Form_UpdateMutation } from '../../features/pet/petApi';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
      <Typography sx={{ width: '90px', fontSize: 14, fontWeight: 500, mt: multiline ? '6px' : 0, position: 'relative', left:20, top: 5 }}>
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
  const location = useLocation();
  const [animalAdoptionDate, setAnimalAdoptionDate] = useState('');
  const [animalVisitDate, setAnimalVisitDate] = useState(dayjs());
  const [animalTreatmentMemo, setAnimalTreatmentMemo] = useState('');
  const animalTreatmentMemoRef = useRef();
  const [animalHospitalName, setAnimalHospitalName] = useState('');
  const animalHospitalNameRef = useRef();
  const [animalTreatmentType, setAnimalTreatmentType] = useState('');
  const [petFormHospital] = usePet_Form_HospitalMutation();
  const [petFormHospitalUpdate] = usePet_Form_UpdateMutation();
  const [animalMedication, setAnimalMedication] = useState('');
  const animalMedicationRef = useRef();
  const { showAlert } = useCmDialog();
  const [selectedTab, setSelectedTab] = useState(0);
  const [animalName, setAnimalName] = useState('');
  const [animalId, setAnimalId] = useState(null);
  const [records, setRecords] = useState([]);
  const [expanded, setExpanded] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const toggleDropdown = () => setExpanded(!expanded);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'animalHospitalName') setAnimalHospitalName(value);
    else if (name === 'animalMedication') setAnimalMedication(value);
    else if (name === 'animalTreatmentType') setAnimalTreatmentType(value);
    else if (name === 'animalTreatmentMemo') setAnimalTreatmentMemo(value);
    else if (name === 'animalVisitDate') setAnimalVisitDate(dayjs(value));
  };
  const handleAddOrUpdate = () => {
    const newRecord = {
      animalHospitalTreatmentId: isEditing ? editId : Date.now(),
      animalId,
      animalVisitDate: dayjs(animalVisitDate).format('YYYY-MM-DD'),
      animalHospitalName,
      animalMedication,
      animalTreatmentType,
      animalTreatmentMemo,
    };

    if (isEditing) {
      setRecords(prev =>
        prev.map(r =>
          r.animalHospitalTreatmentId === editId ? newRecord : r
        )
      );
    } else {
      setRecords([newRecord, ...records]);
    }

    // 초기화
    setAnimalVisitDate(dayjs());
    setAnimalHospitalName('');
    setAnimalMedication('');
    setAnimalTreatmentType('');
    setAnimalTreatmentMemo('');
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (record) => {
    setAnimalVisitDate(dayjs(record.animalVisitDate));
    setAnimalHospitalName(record.animalHospitalName);
    setAnimalMedication(record.animalMedication);
    setAnimalTreatmentType(record.animalTreatmentType);
    setAnimalTreatmentMemo(record.animalTreatmentMemo);
    setIsEditing(true);
    setEditId(record.animalHospitalTreatmentId);
    setExpanded(true);
  };

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.animalHospitalTreatmentId !== id));
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idFromQuery = searchParams.get('animalId');
    if (idFromQuery) {
      setAnimalId(idFromQuery);
    }
  }, [location.search]);

  useEffect(() => {
    if (!animalId) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/petHospital/list');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          console.error('❌ JSON이 아닌 응답을 받음:', text);
          throw new Error('서버로부터 JSON이 아닌 응답을 받았습니다.');
        }

        const data = await res.json();
        const sorted = data
          .filter(item => item.animalId === animalId) // 필터 추가
          .sort((a, b) => new Date(b.createDt) - new Date(a.createDt));
        setRecords(sorted);
      } catch (err) {
        console.error('리스트 불러오기 실패:', err);
      }
    };

    fetchRecords();
  }, [animalId]);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalId) return showAlert('동물을 선택해주세요.');
    if (!dayjs(animalVisitDate).isValid()) return showAlert('방문 날짜를 선택해주세요.');
    if (CmUtil.isEmpty(animalHospitalName)) return showAlert('병원 이름을 입력해주세요.');
    if (CmUtil.isEmpty(animalMedication)) return showAlert('처방약을 입력해주세요.');

    const submitData = new FormData();
    submitData.append('animalHospitalTreatmentId', editId);
    submitData.append('animalId', animalId);
    submitData.append('animalVisitDate', dayjs(animalVisitDate).format('YYYY-MM-DD'));
    submitData.append('animalHospitalName', animalHospitalName);
    submitData.append('animalMedication', animalMedication);
    submitData.append('animalTreatmentType', animalTreatmentType);
    submitData.append('animalTreatmentMemo', animalTreatmentMemo);
    
      try {
        if (isEditing) {
          await petFormHospitalUpdate({ data: submitData }).unwrap();
          setRecords(prev =>
            prev.map(r =>
              r.animalHospitalTreatmentId === editId
                ? { ...r, ...submitData }
                : r
            )
          );
          showAlert('수정이 완료되었습니다.');
        } else {
          const result = await petFormHospital(submitData).unwrap();
          setRecords(prev => [ { ...submitData, animalHospitalTreatmentId: result.animalHospitalTreatmentId }, ...prev ]);
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
          <Typography>{animalAdoptionDate}</Typography>
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
          component="label"
        >
          수정
          <input
            type="file"
            accept="image/*"
            hidden
           
          />
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
        <Combo groupId="Medical" value={animalTreatmentType} onChange={(val) => setAnimalTreatmentType(val)} />
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

          

          <Box mt={3} sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {records.slice(0, 5).map((record) => (
              <Card key={record.animalHospitalTreatmentId} sx={{ mb: 2, position: 'relative' }}>
                <CardContent>
                  <Typography variant="subtitle2">
                    {record.animalVisitDate} {record.animalHospitalName} | {record.animalMedication}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                    {record.animalMemo}
                  </Typography>
                  <Box position="absolute" top={8} right={8}>
                    <IconButton onClick={() => handleEdit(record)} color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(record.animalHospitalTreatmentId)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {records.length > 5 && (
            <Box textAlign="center" mt={1}>
              <Button variant="outlined">+ 더보기</Button>
            </Box>
          )}
        </Box>
      </Box>
  </Box>
);
};
export default Pet_Form_Hospital; 