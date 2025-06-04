import {useDiaryListQuery} from "../../features/diary/diaryApi";
import {Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import pet from '../../image/animalFootprintWhite.png';
import plant from '../../image/plantWhite.png';
import add from '../../image/add.png'
import '../../css/toggleSwitch.css';
import '../../css/diaryList.css';

const DiaryList=()=>{
    const [diaryType, setDiaryType]=useState({diaryType:'N02'})
    const typeRef=useRef(null);

    // const [sort,setSort]=useState({field: 'diaryDate', order:'desc'});

    const {data, isLoading, refetch}=useDiaryListQuery({
        diaryType: diaryType.diaryType,
        // sortField:sort.field,
        // sortOrder:sort.order,
    });

    const navigate=useNavigate();

    useEffect(()=>{
        refetch();
    },[diaryType, refetch]);

    // const columns=[
    //     {field:'img', headerName: '이미지', width: 200},
    //     {field:'title', headerName: '제목', width: 300, dbName:'diaryTitle',
    //         renderCell: (params) => {
    //             return (
    //                 <Button sx={{ textTransform: "none" }} onClick={(e) => navigate(`/diary/view.do?id=${params.row.diaryId}`)}>{params.row.diaryTitle}</Button>
    //             );
    //         },
    //     },
    //     {field:'date', headerName: '날짜', width: 200, dbName:'diaryDate'},
    // ]
    const [isOn, setIsOn] = useState(false);
  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    setDiaryType({diaryType:newState ? "N01" : "N02"});
    //true=동물=N01
    //false=식물=N02
  };
 

return(
    <>
    <Box sx={{ maxWidth: 800 }}>
        <Box className="diary-top-section">
        <Typography variant="h4" >
            일기 
          </Typography>
        <Box className='diary-top-section-button'> 
        <Button onClick={() => navigate('/diary/create.do')} className="diary-add-button"
            sx={{p:0, width:'38px', width: '38px', minWidth:'38px'}}>
            <img src={add} alt="" className="diary-add"></img>
        </Button>
        <div className={`toggle-container ${isOn ? 'on' : ''}`} onClick={handleToggle}>
            <div className="toggle-circle" />
            {<img src={isOn ? pet : plant} alt="toggle icon" className={`toggle-img ${isOn ? 'pet' : 'plant'}`} />}
        </div>
        </Box>
        </Box>
        <Box sx={{ maxWidth: 800 }}>
            {data?.data?.list?.map((item)=>(
                <Box className="diary-list">
                    <Typography noWrap className="diary-title" sx={{fontSize:'18px'}}>
                        {item.diaryTitle}
                    </Typography>
                    <Typography noWrap className="diary-date" sx={{fontSize:'12px;'}}>
                        {item.diaryDate?.substring(0, 10)}
                    </Typography>
                </Box>
                
            ))}
        </Box>
        
</Box>
</>
);
};
export default DiaryList