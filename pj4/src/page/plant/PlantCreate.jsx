import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FaCamera } from 'react-icons/fa';
import DefaultImage from '../../image/default-plant.png';
import { useCreatePlantMutation } from '../../features/plant/plantApi';
import Combo from '../combo/combo';
import '../../css/plantCreate.css';

const PlantCreate = () => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');   // 선택된 식물종류
  const [plantPurchaseDate, setPlantPurchaseDate] = useState(null);
  const [sunlightPreference, setSunlightPreference] = useState('');   // 선택된 햇빛종류
  const [plantGrowthStatus, setPlantGrowthStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [createPlant] = useCreatePlantMutation();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('plantName', plantName);
    formData.append('plantType', plantType);
    if (plantPurchaseDate) {
      formData.append('plantPurchaseDate', dayjs(plantPurchaseDate).format('YYYY-MM-DD'));
    }
    formData.append('plantSunPreference', sunlightPreference);
    formData.append('plantGrowStatus', plantGrowthStatus);

    const fileInput = document.getElementById('imageUpload');
    if (fileInput.files.length > 0) {
      formData.append('files', fileInput.files[0]);
    }

    try {
      await createPlant(formData).unwrap();
      alert('등록 성공');
      navigate('/PlantSunlighting.do')
      setPlantName('');
      setPlantType('');
      setPlantPurchaseDate(null);
      setSunlightPreference('');
      setPlantGrowthStatus('');
      setImagePreview(null);
    } catch (err) {
      alert('등록 실패');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-create-container">
        {/* 뒤로가기 버튼 */}
        <div className="header-icon-container">
          <IconButton className="back-button" aria-label="back">
            &lt;
          </IconButton>
        </div>

        <Stack spacing={2} className="plant-form-stack">
          {/* 이미지 업로드 섹션 */}
          <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 3 }}>
            <Avatar
              src={imagePreview || DefaultImage}
              sx={{ width: 100, height: 100, margin: 'auto' }}
            />
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="imageUpload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  // 이미지에 맞게 카메라 아이콘 위치 조정
                  top: '65px',
                  left: 'calc(50% + 15px)',
                  backgroundColor: 'white',
                  boxShadow: 1,
                  width: 30,
                  height: 30,
                  '&:hover': { backgroundColor: '#e0e0e0' },
                }}
              >
                <FaCamera style={{ fontSize: '1rem' }} />
              </IconButton>
            </label>
          </Box>

          {/* 식물 이름 */}
          <Box className="form-row">
            <Typography className="label-text">식물 이름</Typography>
            <TextField
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              variant="outlined"
              size="small"
              className="input-field-wrapper"
              InputProps={{
                sx: {
                  borderRadius: '8px', // 이미지 에 맞게 모서리 둥글게
                  backgroundColor: '#f0f0f0',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
          </Box>

          {/* 식물 종류 */}
          <Box className="form-row">
            <Typography className="label-text">식물 종류</Typography>
            <Combo groupId="PlantType"
              onSelectionChange={setPlantType}
              sx={{ width: '200px' }}
            />
          </Box>

          {/* 식물 입수일 */}
          <Box className="form-row">
            <Typography className="label-text">식물 입수일</Typography>
            <DatePicker
              value={plantPurchaseDate}
              onChange={(newValue) => setPlantPurchaseDate(newValue)}
              inputFormat="YYYY-MM-DD"
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  className="input-field-wrapper"
                  InputProps={{
                    sx: {
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent',
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* 햇빛/그늘 선호 */}
          <Box className="form-row">
            <Typography className="label-text">햇빛/그늘 선호</Typography>
            <Combo
              groupId="SunType"
              onSelectionChange={setSunlightPreference}
              sx={{ width: '200px' }}
            />
          </Box>

          {/* 생육 상태 */}
          <Box className="form-row status-field">
            <Typography className="label-text">생육 상태</Typography>
            <TextField
              value={plantGrowthStatus}
              onChange={(e) => setPlantGrowthStatus(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              size="small"
              className="input-field-wrapper" // CSS 클래스 적용
              InputProps={{
                sx: {
                  borderRadius: '8px', // 이미지 에 맞게 모서리 둥글게
                  backgroundColor: '#f0f0f0', // 이미지 와 동일한 회색 배경
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // 테두리 제거
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // 호버 시 테두리 제거
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent', // 포커스 시 테두리 제거
                  },
                },
              }}
            />
          </Box>

          {/* 등록 버튼 */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="register-button"
            sx={{
              backgroundColor: '#4B6044',
              borderRadius: 20,
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            식물 등록
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantCreate;