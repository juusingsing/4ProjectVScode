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
  const [plantType, setPlantType] = useState('');
  const [plantPurchaseDate, setPlantPurchaseDate] = useState(null);
  const [sunlightPreference, setSunlightPreference] = useState('');
  const [plantGrowthStatus, setPlantGrowthStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [createPlant] = useCreatePlantMutation();
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
      setFiles([selectedFile]);
    } else {
      setImagePreview(null);
      setFiles([]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    formData.append('plantName', plantName);
    formData.append('plantType', plantType);
    if (plantPurchaseDate) {
      formData.append('plantPurchaseDate', dayjs(plantPurchaseDate).format('YYYY-MM-DD'));
    }
    formData.append('plantSunPreference', sunlightPreference);
    formData.append('plantGrowStatus', plantGrowthStatus);

    try {
      await createPlant(formData).unwrap();
      alert('등록 성공');
      setPlantName('');
      setPlantType('');
      setPlantPurchaseDate(null);
      setSunlightPreference('');
      setPlantGrowthStatus('');
      setImagePreview(null);
      setFiles([]);
    } catch (err) {
      alert('등록 실패');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-create-container">
        <div className="header-icon-container">
          <IconButton className="back-button" aria-label="back">
            &lt;
          </IconButton>
        </div>

        <Stack spacing={2} className="plant-form-stack">
          <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 3 }}>
            <Avatar
              src={imagePreview || DefaultImage}
              sx={{ width: 100, height: 100, margin: 'auto' }}
            />
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="imageUpload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
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
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 종류</Typography>
            <Combo groupId="PlantType"
              onSelectionChange={setPlantType}
              sx={{ width: '200px' }}
            />
          </Box>

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

          <Box className="form-row">
            <Typography className="label-text">햇빛/그늘 선호</Typography>
            <Combo
              groupId="SunType"
              onSelectionChange={setSunlightPreference}
              sx={{ width: '200px' }}
            />
          </Box>

          <Box className="form-row status-field">
            <Typography className="label-text">생육 상태</Typography>
            <TextField
              value={plantGrowthStatus}
              onChange={(e) => setPlantGrowthStatus(e.target.value)}
              multiline
              rows={3}
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
          </Box>

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