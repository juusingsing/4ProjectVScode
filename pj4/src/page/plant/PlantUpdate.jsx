import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import '../../css/plantCreate.css';
import {
    useUpdatePlantMutation,
    useDeletePlantMutation,
    useCreatePlantMutation,
    usePlantInfoQuery
} from '../../features/plant/plantApi';
import Combo from '../combo/combo';
import DefaultImage from '../../image/default-plant.png';

const PlantUpdate = ({ mode = 'create' }) => {
    const { plantId } = useParams();
    const isEdit = mode === 'edit' || !!plantId;

    const navigate = useNavigate();

    const { data: fetchedPlantData, isLoading, isSuccess, isError, error } = usePlantInfoQuery(plantId, {
        skip: !isEdit || !plantId,
    });

    const [plantName, setPlantName] = useState('');
    const [plantType, setPlantType] = useState('');
    const [plantPurchaseDate, setPlantPurchaseDate] = useState(null);
    const [sunlightPreference, setSunlightPreference] = useState('');
    const [plantGrowthStatus, setPlantGrowthStatus] = useState('');
    const [imagePreview, setImagePreview] = useState(DefaultImage);

    const [updatePlant] = useUpdatePlantMutation();
    const [deletePlant] = useDeletePlantMutation();
    const [createPlant] = useCreatePlantMutation();

     useEffect(() => {
        console.log('plantType:', plantType);
  console.log('sunlightPreference:', sunlightPreference);
  if (isEdit && isSuccess && fetchedPlantData?.data?.length > 0) {
    const plant = fetchedPlantData.data[0];
    console.log('🌱 받아온 식물 데이터:', plant);

    setPlantName(plant.plantName || '');
    setPlantType(plant.plantType || '');
    setPlantPurchaseDate(plant.plantPurchaseDate ? dayjs(plant.plantPurchaseDate) : null);
    setSunlightPreference(plant.plantSunPreference || '');
    setPlantGrowthStatus(plant.plantGrowStatus || '');
    setImagePreview(null); // 이미지 기본 처리
  }
}, [isEdit, isSuccess, fetchedPlantData]);


  
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
                await updatePlant({ plantId, data: formData }).unwrap();
                alert('수정 성공');
            } else {
                const result = await createPlant(formData).unwrap();
                alert('등록 성공');
                navigate(`/PlantUpdate/${result.plantId}`);
                return;
            }
            navigate('/PlantSunlighting.do');
        } catch (err) {
            alert(isEdit ? '수정 실패' : '등록 실패');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await deletePlant(plantId).unwrap();
                alert('삭제 성공');
                navigate('/PlantSunlighting.do');
            } catch {
                alert('삭제 실패');
            }
        }
    };

    if (isEdit && isLoading) {
        return <Typography>식물 정보를 불러오는 중입니다...</Typography>;
    }
    if (isEdit && isError && !fetchedPlantData) {
        return <Typography>식물 정보를 불러오는 데 실패했습니다.</Typography>;
    }
    if (isEdit && !plantId) {
        return <Typography>수정할 식물의 ID가 필요합니다.</Typography>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="plant-create-container">
                <div className="header-icon-container">
                    <IconButton className="back-button" aria-label="back" onClick={() => navigate(-1)}>
                        &lt;
                    </IconButton>
                </div>

                <Stack spacing={2} className="plant-form-stack">
                    <Box sx={{ textAlign: 'center', position: 'relative', marginBottom: 3 }}>
                        <Avatar src={imagePreview} sx={{ width: 100, height: 100, margin: 'auto' }} />
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

                    <Box className="form-row">
                        <Typography className="label-text">식물 이름</Typography>
                        <TextField
                            value={plantName}
                            onChange={(e) => setPlantName(e.target.value)}
                            variant="outlined"
                            size="small"
                            className="input-field-wrapper"
                        />
                    </Box>

                    <Box className="form-row">
                        <Typography className="label-text">식물 종류</Typography>
                        <Combo
                            groupId="PlantType"
                            value="P01"
                            onSelectionChange={setPlantType}
                            sx={{ width: '200px' }}
                        />
                    </Box>

                    <Box className="form-row">
                        <Typography className="label-text">식물 입수일</Typography>
                        <DatePicker
                            value={plantPurchaseDate}
                            onChange={(newValue) => setPlantPurchaseDate(newValue)}
                            format="YYYY-MM-DD"
                            slotProps={{
                                textField: {
                                    variant: 'outlined',
                                    size: 'small',
                                    className: 'input-field-wrapper',
                                },
                            }}
                        />
                    </Box>

                    <Box className="form-row">
                        <Typography className="label-text">햇빛/그늘 선호</Typography>
                        <Combo
                            groupId="SunType"
                            value={sunlightPreference}
                            onSelectionChange={setSunlightPreference}
                            sx={{ width: '200px' }}
                        />
                    </Box>

                    <Box className="form-row">
                        <Typography className="label-text">성장 상태</Typography>
                        <TextField
                            value={plantGrowthStatus}
                            onChange={(e) => setPlantGrowthStatus(e.target.value)}
                            variant="outlined"
                            size="small"
                            className="input-field-wrapper"
                        />
                    </Box>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                        {isEdit && (
                            <Button variant="outlined" color="error" onClick={handleDelete}>
                                삭제
                            </Button>
                        )}
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            {isEdit ? '수정' : '등록'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </LocalizationProvider>
    );
};

export default PlantUpdate;
