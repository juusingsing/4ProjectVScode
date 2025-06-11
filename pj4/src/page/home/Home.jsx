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
  const [activeTab, setActiveTab] = useState("N01");

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
  // 현재 활성화된 탭에 따라 심리테스트 링크 연결
  const currentTestLink = `/test/main.do?tab=${activeTab}`;

  const handleTabChange = (selectedTabValue) => {
    setActiveTab(selectedTabValue);
    // URL 쿼리 파라미터도 업데이트하여 새로고침 시에도 상태 유지
    window.history.pushState(null, "", `/home.do?tab=${selectedTabValue}`);
  };

  const [sortBy, setSortBy] = useState(""); // 선택된 정렬 기준 상태

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSortBy(selectedValue);
    // 여기에 선택된 정렬 기준(selectedValue)에 따라 데이터를 정렬하는 로직을 추가합니다.
    console.log(`선택된 정렬 기준: ${selectedValue}`);

    // 예시: 실제 데이터 정렬 로직 (이 부분은 사용자의 데이터 구조에 맞게 수정해야 합니다.)
    // if (selectedValue === 'name') {
    //   // 이름 순으로 데이터 정렬
    //   console.log('이름 순으로 정렬합니다.');
    // } else if (selectedValue === 'date') {
    //   // 등록일 순으로 데이터 정렬
    //   console.log('등록일 순으로 정렬합니다.');
    // }
  };

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
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          mt: 1,
          px: 1,
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
              boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "70px",
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
            <Typography sx={{ fontSize: "15px" }}>{item.name}</Typography>
          </Box>
        ))}

        {/* '+' 추가 버튼 */}
        <Link
          to={activeTab === "N01" ? "/pet/petForm.do" : "/PlantCreate.do"}
          style={{ textDecoration: "none" }}
        >
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
            <Typography
              variant="h4"
              sx={{ color: "#2ecc71", fontSize: "3rem" }}
            >
              +
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeTab === "N01" ? "동물 추가" : "식물 추가"}
            </Typography>
          </Box>
        </Link>
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
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        {/* 정렬 셀렉트 박스 */}
        <div style={{ marginTop: "10px" }}>
          <select
            name="정렬"
            style={{ padding: "5px", borderRadius: "5px" }}
            onChange={handleChange} // onChange 이벤트 핸들러 추가
            value={sortBy} // 현재 선택된 값 표시
          >
            {/* 첫 번째 옵션은 선택되지 않은 상태로 두거나, "선택하세요"와 같은 문구로 시작할 수 있습니다. */}
            {/* <option value="">정렬 기준 선택</option> */}
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
