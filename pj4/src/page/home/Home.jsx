// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation, Link } from "react-router-dom"; // Link 컴포넌트 추가 임포트

// TabCombo 컴포넌트 임포트
import TabCombo from "../../page/combo/TabCombo"; // 경로 확인 필요

// 이미지 임포트
import PetTestMain from "../../image/petTestMain.png";
import PlantTestMain from "../../image/plantTestMain.png";

const Home = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("N01"); // 기본값 "N01" (동물)

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");

    if (tabParam === "N02") {
      setActiveTab("N02");
    } else {
      setActiveTab("N01"); // 기본값 또는 'N01'일 때
    }
  }, [location.search]);

  // 현재 활성화된 탭에 따라 테스트 이미지 결정
  const currentTestImage = activeTab === "N01" ? PetTestMain : PlantTestMain;

  // TODO: 동물/식물 심리테스트 링크 설정
  // 이 부분은 실제 라우팅 경로에 맞게 변경해주세요.
const currentTestLink = `/test/main.do?tab=${activeTab}`;

  const handleTabChange = (selectedTabValue) => {
    setActiveTab(selectedTabValue);
    // URL 쿼리 파라미터도 업데이트하여 새로고침 시에도 상태 유지
    window.history.pushState(null, "", `/home?tab=${selectedTabValue}`);
  };

  // TODO: 실제로는 API 호출을 통해 동물/식물 목록 데이터를 가져와야 합니다.
  const animalList = [
    {
      id: 1,
      name: "고양이",
      imageUrl: "https://via.placeholder.com/100x90/FFD700/FFFFFF?text=Cat",
    },
    {
      id: 2,
      name: "강아지",
      imageUrl: "https://via.placeholder.com/100x90/87CEEB/FFFFFF?text=Dog",
    },
    {
      id: 3,
      name: "햄스터",
      imageUrl: "https://via.placeholder.com/100x90/DA70D6/FFFFFF?text=Hamster",
    },
    {
      id: 4,
      name: "페럿",
      imageUrl: "https://via.placeholder.com/100x90/3CB371/FFFFFF?text=Ferret",
    },
    {
      id: 5,
      name: "앵무새",
      imageUrl: "https://via.placeholder.com/100x90/FFA500/FFFFFF?text=Parrot",
    },
    {
      id: 6,
      name: "토끼",
      imageUrl: "https://via.placeholder.com/100x90/EE82EE/FFFFFF?text=Rabbit",
    },
  ];

  const plantList = [
    {
      id: 101,
      name: "몬스테라",
      imageUrl:
        "https://via.placeholder.com/100x90/2E8B57/FFFFFF?text=Monstera",
    },
    {
      id: 102,
      name: "스투키",
      imageUrl: "https://via.placeholder.com/100x90/6B8E23/FFFFFF?text=Stucky",
    },
    {
      id: 103,
      name: "아레카야자",
      imageUrl: "https://via.placeholder.com/100x90/7CFC00/FFFFFF?text=Areca",
    },
    {
      id: 104,
      name: "산세베리아",
      imageUrl: "https://via.placeholder.com/100x90/32CD32/FFFFFF?text=Sanse",
    },
    {
      id: 105,
      name: "아이비",
      imageUrl: "https://via.placeholder.com/100x90/ADFF2F/FFFFFF?text=Ivy",
    },
    {
      id: 106,
      name: "다육이",
      imageUrl:
        "https://via.placeholder.com/100x90/9ACD32/FFFFFF?text=Succulent",
    },
  ];

  // 목록 아이템을 렌더링하는 함수 (변경 없음)
  const renderItems = (items) => {
    if (!items || items.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 4 }}
        >
          목록이 없습니다.
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          mt: 2,
          px: 2,
          pb: 8,
        }}
      >
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              textAlign: "center",
              pb: 1,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "90px",
                bgcolor: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></Box>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {item.name}
            </Typography>
          </Box>
        ))}
        {/* '+' 추가 버튼 */}
        <Box
          sx={{
            border: "1px dashed #ccc",
            borderRadius: "8px",
            height: "110px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            bgcolor: "#f9f9f9",
            "&:hover": { bgcolor: "#f0f0f0" },
            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h4" sx={{ color: "#2ecc71", fontSize: "3rem" }}>
            +
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {activeTab === "N01" ? "동물 추가" : "식물 추가"}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 360, width: "100%", mx: "auto" }}>
      {/* 테스트 이미지 및 버튼 섹션 */}
      <div
        style={{
          backgroundImage: `url(${currentTestImage})`, // 동적으로 배경 이미지 설정
          backgroundSize: "cover", // div를 꽉 채우도록
          backgroundPosition: "center", // 이미지 중앙 정렬
          width: "360px",
          height: "215px",
        }}
      >
        <Link to={currentTestLink} style={{ textDecoration: "none" }}>
          <button
            className="Test_Button"
            style={{
              padding: "5px 20px",
              backgroundColor: "white",
              color: "#583403",
              fontWeight: "bold",
              border: "2px solid #583403",
              borderRadius: "10px",
              cursor: "pointer",
              marginTop: "170px",
              marginLeft: "10px",
            }}
          >
            테스트 시작
          </button>
        </Link>
      </div>

      {/* TabCombo 컴포넌트 삽입 */}
      <Box>
        <TabCombo onChange={handleTabChange} defaultValue={activeTab} />
      </Box>
      <Box sx={{width:"100%",display:"flex", justifyContent:"flex-end"}}>
        {/* 정렬 셀렉트 박스 */}
        <div className="Home_Selectbox">
          <select name="정렬">
            <option value="name">이름 순</option>
            <option value="date">등록일 순</option>
          </select>
        </div>
      </Box>
      {/* 조건부 렌더링: 동물 또는 식물 목록 표시 */}
      {activeTab === "N01" ? renderItems(animalList) : renderItems(plantList)}
    </Box>
  );
};

export default Home;
