import { useTestResultQuery } from "../../features/test/testApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TestPetResult=()=>{
    const {state} = useLocation();
    const navigate = useNavigate();
const optionIds = state?.answers || [];
const testQuestionType = state?.testQuestionType || 'N01'; 
    const {data, isLoading, error,isSuccess} =useTestResultQuery({
        optionIds,
        testQuestionType
    });
    const [result, setResult]=useState(null)
    

    useEffect(()=>{
        if(isSuccess){
            setResult(data?.data);
        }
    }, [isSuccess, data]);
    console.log(optionIds)
    if (isLoading) return <div>로딩 중...</div>;
if (error) return <div>에러 발생! 😭</div>;
    return(
        <>
        <div>
      {result && (
        <>
          <h2>{result.testResultName}</h2>
          <p>{result.testResultContent}</p>
          <p>추천: {result.testResultRecommend}</p>
          {result.postFile?.postFilePath && (
            <img src={result.postFile.postFilePath} alt="결과 이미지" />
          )}
        </>
      )}
    </div>
        </>
    )
}
export default TestPetResult;