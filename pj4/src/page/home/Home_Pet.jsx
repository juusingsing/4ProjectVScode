import React, { useState } from 'react';
import { Box} from '@mui/material'; //Grid
import { Link } from 'react-router-dom';
import Test from '../../image/Pet_Test_Main.png';
import '../../css/home.css';

const Home_Pet = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { name: "동물", link: "/Home_Pet.do" },
    { name: "식물", link: "/Home_Plant.do" }
  ];

  return (
     <Box className="Home_Layout">
      <div style={{ position: "relative", display: "inline-block" }}>
        <img className="Test_Image" src={Test} alt="Test_Image" />
        <button className="Test_Button">테스트 시작</button>
      </div>
      <div className="Tab_Wrapper">
        {tabs.map((tab, index) => (
          <Link key={index} to={tab.link} onClick={() => setActiveTab(index)}>
            <button className={`Tab_Buttons ${activeTab === index ? "active" : ""}`}>
              {tab.name}
            </button>
          </Link>
        ))}
      </div>
      {/* <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
        {data?.data?.list?.map((item)=>(
          <Grid item lg={4} key={item.animalId}>

          </Grid>
        ))}
      </Grid> */}
    </Box>
  );
};

export default Home_Pet;