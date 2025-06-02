import {
  Box,
  TextField,
  Typography,
  Button
} from "@mui/material";
import React, { useState } from "react";

import back from '../../image/back.png';
import pet from '../../image/animalFootprintWhite.png';
import plant from '../../image/plantWhite.png';
import image from '../../image/imageAdd.png'
import '../../css/toggleSwitch.css';
const DiaryCreate = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => setIsOn(prev => !prev);

  return (
    <>
      <Box sx={{ maxWidth: 800}}>
        <Box mt={3} mb={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            // variant="contained"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              borderRadius: '10px',
              height: '35px',
              minWidth: '0',
              width: '35px',
              '&:hover': {
                backgroundColor: '#363636'
              },
              backgroundColor: 'rgba(54, 54, 54, 0.4)'

            }}
          >
            <img src={back} alt="" sx={{ pl: '2px' }}></img>
          </Button>
          <Typography variant="h5" gutterBottom >
            일기 작성
          </Typography>
          <div className={`toggle-container ${isOn ? 'on' : ''}`} onClick={handleToggle}>
            <div className="toggle-circle" />
            {<img src={isOn ? pet : plant} alt="toggle icon" className={`toggle-img ${isOn ? 'pet' : 'plant'}`} />}
          </div>
        </Box>
        <Box component="form">
          <Box mr={1.5} gap={1} sx={{ display: 'flex', flexDirection: 'row' , justifyContent: 'end' }}>
            <Typography variant="h9" alignContent={"center"}>
              제목
            </Typography>
            <TextField

              variant="outlined"
              inputProps={{ maxLength: 100, style: { textAlign: 'center' } }}
              InputProps={{
                sx: {
                  textAlign: 'center',
                  height: '35px',
                  width: '280px',
                  borderRadius: '15px'
                }
              }}
            />
          </Box>
          <Box mt={1} mr={1.5} gap={1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
            <Typography variant="h9" alignContent={"center"}>날짜</Typography>
            <TextField
              type="date"
              InputLabelProps={{ shrink: true }}
              className='textField'
              InputProps={{
                sx: {
                  height: '35px',
                  borderRadius: '15px',
                  paddingTop:'0px'
                }
              }}
            />
          </Box>
          <Box m={2}>
            <Button
                  // variant="contained"
                  sx={{
                    display: 'flex', 
                    justifyContent:'center',
                    borderRadius: '5px',
                    height:'140px',
                    minWidth:'0',
                    width: '140px',
                    '&:hover': {
                      backgroundColor: '#363636'
                    },
                    backgroundColor: 'rgba(54, 54, 54, 0.2)'
                    
                  }}
                  >
                  <img src={image} alt=""></img>
                </Button>
          </Box>
          <Box m={3} >
            <Typography gutterBottom>내용</Typography>
            <TextField
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 1300, style: { textAlign: 'center' }}}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px'
                }
              }}
            />
          </Box>
          <Box display="flex" gap={1} mt={2} justifyContent={"center"}>

            <Button
              variant="contained"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                borderRadius: '20px',
                height: '38px',
                width: '170px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#3B4C34'
                },
                backgroundColor: '#4B6044'
              }}
            >
              <Typography sx={{ letterSpacing: 3, fontSize: 16, fontWeight: 400 }}>
                저장
              </Typography>
            </Button>

          </Box>
        </Box>
      </Box>
    </>
  );
};
export default DiaryCreate