import React, { useState } from 'react';
import { Box} from '@mui/material'; //Grid
import { Link } from 'react-router-dom';
import Test from '../../image/Pet_Test_Main.png';
import '../../css/home.css';
import Footprint from '../../icon/Footprint_Icon.png'
import Planticon from '../../icon/Plant_Icon.png'

const Home_Pet = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { name: "동물", link: "/Home_Pet.do",  icon: <img src={Footprint} alt="동물 아이콘" style={{ verticalAlign: 'middle', marginLeft: '4px', height: '15px' }} />},
    { name: "식물", link: "/Home_Plant.do",  icon: <img src={Planticon} alt="식물 아이콘" style={{ verticalAlign: 'middle', marginLeft: '4px', height: '15px' }} />}
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
              <div className="Under_Line">{tab.name}{tab.icon}</div>
            </button>
          </Link>
        ))}
      </div>
       <div className="Home_Selectbox">
      <select name="정렬">
        <option value="name">이름 순</option>
        <option value="date">등록일 순</option>
      </select>
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