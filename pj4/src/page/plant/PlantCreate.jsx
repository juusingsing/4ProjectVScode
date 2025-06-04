import React, { useState } from 'react';
import { Box } from '@mui/material';
import { FaChevronLeft, FaCalendarAlt, FaCamera } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../css/plant.css';
import DefaultImage from '../../image/default-plant.png'; // 기본 이미지 경로

const PlantCreate = () => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [sunlight, setSunlight] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [status, setStatus] = useState('');
  const [image,setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box className="plant-layout">

    {/* 이미지 영역 */}
      <div className="image-wrapper relative">
        <img
          src={image || DefaultImage}
          alt="plant"
          className="w-32 h-32 rounded-full object-cover"
        />

        {/* 카메라 아이콘 버튼 (라벨로 연결) */}
        <label
          htmlFor="imageUpload"
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer"
        >
          <FaCamera />
        </label>
      </div>

      {/* 실제 파일 업로드 input (숨김 처리) */}
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />


      {/* 입력 폼 */}
      <div className="form-section">
        <label>식물 이름</label>
        <input
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
        />

        <label>식물 종류</label>
        <select value={plantType} onChange={(e) => setPlantType(e.target.value)}>
          <option>관엽식물</option>
          <option>다육식물</option>
          <option>공기정화식물</option>
          <option>수경식물</option>
          <option>기타</option>
        </select>

        <label>식물 입수일</label>
        <div className="date-wrapper">
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
          <FaCalendarAlt className="calendar-icon" />
        </div>

        <label>햇빛/그늘 선호</label>
        <select value={sunlight} onChange={(e) => setSunlight(e.target.value)}>
          <option>햇빛 직사광선</option>
          <option>밝은 간접광</option>
          <option>반그늘</option>
          <option>그늘</option>
        </select>

        <label>생육상태</label>
        <textarea
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          rows={3}
        />
      </div>

      {/* 등록 버튼 */}
      <div className="submit-button-wrapper">
        <button className="submit-button">식물 등록</button>
      </div>

    </Box>
  );
};

export default PlantCreate;
