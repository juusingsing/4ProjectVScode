import plant from '../../image/testPlantMain.png'
import back from '../../image/back.png';
import {
    Box,
  Typography,
  Button
} from "@mui/material";
import { useNavigate} from "react-router-dom";
import '../../css/testMain.css';
import { useTestQuestionOptionMutation } from '../../features/test/testApi';

const TestPetMain=()=>{
 const navigate = useNavigate();
  const [fetchQuestoinOption] = useTestQuestionOptionMutation();
 const handleStart = async () => {
   try {
         const res = await fetchQuestoinOption({ testQuestionType: 'N02' }).unwrap();
         navigate('/test/plantPage.do', { state: { questionData: res.data} });
          } catch (err) {
       console.error('질문+보기 불러오기 실패', err);
     }
   };
    return(
        <>
        <div className='background-img'
          style={{backgroundImage:`url(${plant})`,
          }}> 
        
        <button
            className='back-test-button'
            onClick={() => navigate(`/`)}
          >
            <img src={back} alt="" sx={{ pl: '2px' }}></img>
          </button>
        <button 
        className="test-button"
        onClick={() => navigate(`/testPet.do`)}
                >
                <Typography sx={{fontWeight:'900', fontSize:'26px', color:'#583403' }}>
                    테스트 시작하기
                </Typography>
                </button>
                </div>
        </>
    )
}
export default TestPetMain;