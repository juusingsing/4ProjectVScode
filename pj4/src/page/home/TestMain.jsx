// src/pages/Test/TestMain.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import "../../css/testMain.css";
import back from "../../image/back.png";
import petImage from "../../image/testPetMain.png";
import plantImage from "../../image/testPlantMain.png";
import { useTestQuestionOptionMutation } from "../../features/test/testApi";

const TestMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fetchQuestionOption] = useTestQuestionOptionMutation();

  // URL 파라미터에서 tab 값(N01 또는 N02) 추출
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "N01"; // 기본값 N01

  const isAnimal = tab === "N01";
  const backgroundImage = isAnimal ? petImage : plantImage;
  const nextRoute = isAnimal ? "/test/petPage.do" : "/test/plantPage.do";

  const handleStart = async () => {
    try {
      const res = await fetchQuestionOption({ testQuestionType: tab }).unwrap();
      navigate(nextRoute, { state: { questionData: res.data } });
    } catch (err) {
      console.error("질문+보기 불러오기 실패", err);
    }
  };

  return (
    <div className="background-img" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <button className="back-test-button" onClick={() => navigate("/")}>
        <img src={back} alt="뒤로가기" />
      </button>
      <button className="test-button" onClick={handleStart}>
        <Typography sx={{ fontWeight: "900", fontSize: "26px", color: "#583403" }}>
          테스트 시작하기
        </Typography>
      </button>
    </div>
  );
};

export default TestMain;
