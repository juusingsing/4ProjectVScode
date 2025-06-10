import React, { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
    Avatar,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../css/plantCreate.css';
import { useUpdatePlantMutation, useDeletePlantMutation, useCreatePlantMutation } from '../../features/plant/plantApi';
import Combo from '../combo/combo';
const PlantUpdate = ({ mode = 'create', plantData }) => {
    const isEdit = mode === 'edit';
    const navigate = useNavigate();

    const [plantName, setPlantName] = useState(plantData?.plantName || '');
    const [plantType, setPlantType] = useState(plantData?.plantType || '');
    const [plantPurchaseDate, setPlantPurchaseDate] = useState(
        plantData?.plantPurchaseDate ? dayjs(plantData.plantPurchaseDate) : null
    );
    const [sunlightPreference, setSunlightPreference] = useState(plantData?.plantSunPreference || '');
    const [plantGrowthStatus, setPlantGrowthStatus] = useState(plantData?.plantGrowStatus || '');
    const [imagePreview, setImagePreview] = useState(plantData?.imageUrl || null);

    const [updatePlant] = useUpdatePlantMutation();
    const [deletePlant] = useDeletePlantMutation();
    const [createPlant] = useCreatePlantMutation(); // 'create' 모드용

    const handleImageChange = (event) => {
        const file = event.target.files[0];
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
        if (fileInput?.files?.length > 0) {
            formData.append('file', fileInput.files[0]);
        }

        try {
            if (isEdit) {
                await updatePlant({ id: plantData.id, data: formData }).unwrap();
                alert('수정 성공');
            } else {
                await createPlant(formData).unwrap();
                alert('등록 성공');
            }
            navigate('/PlantSunlighting.do');
        } catch (err) {
            alert(isEdit ? '수정 실패' : '등록 실패');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deletePlant(plantData.id).unwrap();
                alert('삭제 성공');
                navigate('/PlantSunlighting.do');
            } catch (err) {
                alert('삭제 실패');
            }
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="plant-create-container">
                {/* 뒤로가기 버튼 */}
                <div className="header-icon-container">
                    <IconButton className="back-button" aria-label="back" onClick={() => navigate(-1)}>
                        &lt;
                    </IconButton>
                </div>

                <Stack spacing={2} className="plant-form-stack">
                    {/* 이미지 업로드 섹션 */}
                    <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 3 }}>
                        <Avatar
                            src={imagePreview}
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
                                    borderRadius: '8px',
                                    backgroundColor: '#f0f0f0',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                },
                            }}
                        />
                    </Box>

                    {/* 식물 종류 */}
                    <Box className="form-row">
                        <Typography className="label-text">식물 종류</Typography>
                        <Combo
                            groupId="PlantType"
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
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
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
                            className="input-field-wrapper"
                            InputProps={{
                                sx: {
                                    borderRadius: '8px',
                                    backgroundColor: '#f0f0f0',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                                },
                            }}
                        />
                    </Box>

                    {/*수정 / 삭제 버튼 */}
                    <Button variant="contained" onClick={handleSubmit}>수정</Button>
                    <Button variant="outlined" onClick={handleDelete}>삭제</Button>

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
                    </Button>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};

export default PlantUpdate;
