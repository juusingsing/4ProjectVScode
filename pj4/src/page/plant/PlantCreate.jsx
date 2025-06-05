import React, { useState } from 'react';
import { Box } from '@mui/material';
import { FaCamera } from 'react-icons/fa';
import '../../css/plant.css';
import DefaultImage from '../../image/default-plant.png';
import { useCreatePlantMutation } from '../../features/plant/plantApi';
import Combo from '../combo/combo';

const PlantCreate = () => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [sunlight, setSunlight] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [status, setStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [createPlant] = useCreatePlantMutation(); // 추가
  const [plantPurchaseDate, setPlantPurchaseDate] = useState('');


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
    formData.append('plantPurchaseDate', plantPurchaseDate);
  }
    formData.append('plantSunPreference', sunlight);
    formData.append('plantGrowStatus', status);

    const fileInput = document.getElementById('imageUpload');
    if (fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
    }

    try {
      const res = await createPlant(formData).unwrap();
      alert('등록 성공');
    } catch (err) {
      console.error('식물 등록 오류:', err);
      alert('등록 실패');
    }
  };

  return (
    <Box className="plant-layout">
      <div className="image-wrapper relative">
        <img
          src={imagePreview || DefaultImage}
          alt="plant"
          className="w-32 h-32 rounded-full object-cover"
        />
        <label
          htmlFor="imageUpload"
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
        >
          <FaCamera className="camera-icon" />
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="inline-form-row">
        <label>식물 이름</label>
        <input value={plantName} onChange={(e) => setPlantName(e.target.value)} />
      </div>
      <br />

      <div className="inline-form-row">
        <label>식물 종류</label>
        <Combo groupId="PlantType" />
      </div>


      <div className="inline-form-row">
        <label>식물 입수일</label>
        <input 
          type="date" 
          value={plantPurchaseDate} 
          onChange={(e) => setPlantPurchaseDate(e.target.value)} />
      </div>
      <br />

      <div className="inline-form-row">
        <label>햇빛/그늘 선호</label>
        <Combo groupId="SunType"/>
      </div>
      <br />

      <label>생육상태</label>
      <textarea
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        rows={3}
        className="w-full"
      />

      <div className="submit-button-wrapper">
        <button className="submit-button" onClick={handleSubmit}>
          식물 등록
        </button>
      </div>
    </Box>
  );
};

export default PlantCreate;
