import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import AnimalIcon from "../../icon/Footprint_Icon.png";
import PlantIcon from "../../icon/Plant_Icon.png";

const TabCombo = ({ onChange, defaultValue }) => {
  const [activeTab, setActiveTab] = useState("N01");

  useEffect(() => {
    if (defaultValue) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue]);

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    if (onChange) {
      onChange(tabValue);
    }
  };

  const tabs = [
    // 다시 'value'를 "N01"과 "N02"로 변경했습니다.
    { value: "N01", label: "동물", icon: AnimalIcon },
    { value: "N02", label: "식물", icon: PlantIcon },
  ];

  return (
    <Box sx={{display:"flex", width:"100%"}}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          className={`tab-combo-button ${
            activeTab === tab.value ? "active" : ""
          }`}
          onClick={() => handleTabClick(tab.value)}
          sx={{
            bgcolor:"#526B5C",
            color:"white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width:"100%",
            height: "50px",
            borderRadius:"0px"
          }}
        >
          <Typography variant="button" sx={{ fontSize: "1rem" }}>
            {tab.label}
          </Typography>
          <img
            src={tab.icon}
            alt={`${tab.label} 아이콘`}
            style={{
              height: "15px",
              marginRight: "6px",
              filter:
                activeTab === tab.value ? "brightness(0) invert(1)" : "none",
            }}
          />
        </Button>
      ))}
    </Box>
  );
};

export default TabCombo;
