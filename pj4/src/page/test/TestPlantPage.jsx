import React, { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import '../../css/testPage.css';

const TestPlantPage=()=>{
    const navigate=useNavigate();
    const {state} = useLocation();
    console.log('📦 location.state:', state);
    const questionData=state?.questionData|| [];
    
    const [currentIndex, setCurrentIndex]=useState(0);
    const [answers, setAnswers] = useState([]);

    if(questionData.length === 0){
        return <div>질문을 불러오는 중이에요...</div>;
    }
    const current =questionData[currentIndex];
    const options = current?.options||[];
    
    
    const handleOptionClick = (selectedOptionId)=>{
       const  newAnswers=[...answers, selectedOptionId];
        if(currentIndex === questionData.length -1){
            navigate("/test/plantResult.do", {state: {answers: newAnswers,testQuestionType:'N02'}});
        }else{
            setAnswers(newAnswers);
            setCurrentIndex(currentIndex +1);
        }
    };
return(
    <>
    <Box className='test-container'>
        <Box sx={{margin: '0px 30px 50px 30px'}}>
        <Typography className="question" 
        sx={{
            fontSize:'24px',
            fontWeight:'700',
            wordBreak: 'keep-all',
            whiteSpace: 'normal'
        }}>
            {current.question.testQuestionContent}
        </Typography>
        </Box>
      {options.map((opt) => (
        <button key={opt.testOptionId} 
        onClick={() => handleOptionClick(opt.testOptionId)}
        className="option"
        style={{wordBreak: 'keep-all',
            whiteSpace: 'normal'}}
        >
          {opt.testOptionContent}
        </button>
      ))}
    </Box>
    </>
)
}
export default TestPlantPage