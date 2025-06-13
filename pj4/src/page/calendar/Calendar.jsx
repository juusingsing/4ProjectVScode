import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Box, Typography } from "@mui/material";
import 'react-calendar/dist/Calendar.css';
import '../../css/calendar.css';
import pet from '../../image/animalFootPrintBrown.png';
import plant from '../../image/plantGreen.png'
import { useCalendarDotQuery, useCalendarLogQuery } from '../../features/calendar/calendarApi';

const CalendarComponent = () => {
  const [value, setValue] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date()); // 보이는 달 저장
  const usersId = useSelector((state) => state.user.usersId);
  // 화면에 보이는 달 기준으로만 클릭 가능
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return (
        date.getMonth() !== activeStartDate.getMonth() ||
        date.getFullYear() !== activeStartDate.getFullYear()
      );
    }
    return false;
  };

  const { data, isLoading, refetch } = useCalendarDotQuery({
    year: activeStartDate.getFullYear(),
    month: activeStartDate.getMonth() + 1,
  });
  useEffect(() => {
    refetch();
  }, [activeStartDate]);

  // 로그
  const [filterType, setFilterType] = useState('all'); // pet / plant
  const [filterName, setFilterName] = useState('all'); // 멍멍이, 냥이, 몬스테라 등
  const [nameList, setNameList] = useState([]);
  const { data: logData, isLoading: isLogLoading, refetch: refetchLog } = useCalendarLogQuery({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    day: value.getDate(),
  });

  //로그 동/식물 이름 리스트
  useEffect(() => {
    if (filterType === "animal" || filterType === 'plant') {
      fetch(`/api/calendar/${filterType}s`)
        .then(res => {
          if (!res.ok) {
            throw new Error("API 오류 발생!");
          }
          return res.json();
        })
        .then(data => {
          setNameList(data);
        })
        .catch(err => {
          console.error("fetch 에러:", err);
          setNameList([]); // 안전 처리
        });
    }
  }, [filterType]);

  useEffect(() => {
    setFilterName("all");
  }, [filterType, value]);


  // 현재 선택된 날짜의 로그
  const logs = logData || [];

  // 선택된 조건(filterType, filterName)에 따라 로그 필터링
  const filteredLogs = logs.filter((log) => {
    if (filterType === 'all') return true;
    if (log.type !== filterType) return false;
    if (filterName === 'all') return true;
    return log.name === filterName;
  });
const categoryToUrl={
  병원진료: (id)=>`/pet/petFormHospital.do?animalId=${id}`,
  훈련: (id) => `/animaltraining.do?animalId=${id}`,

  물주기: (id) => `/plantwatering.do?plantId=${id}`,
  병충해: (id) => `/plantpest.do?plantId=${id}`,
  분갈이: (id) => `/plantrepotting.do?plantId=${id}`,
  일조량: (id) => `/plantsunlight.do?plantId=${id}`
}
const navigate = useNavigate();
const handleLogClick = (log)=>{
  const urlBuilder = categoryToUrl[log.category];
  if(!urlBuilder) return;

  const url = urlBuilder(log.id);
  navigate(url);
  console.log('달력:',log) 

}

  return (
    <>
      <Calendar
        // 날짜 선택 시 실행
        onChange={setValue}
        // 현재 선택된 날짜
        value={value}
        // 사용자가 달(月)을 넘길 때 실행 (현재 보이는 달 저장)
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        // 현재 보이는 달 외 날짜 비활성화
        tileDisabled={tileDisabled}
        // 일요일부터 시작하도록 설정
        calendarType="US"
        // 날짜 숫자만 표시 (ex. '1', '2', '3'...)
        formatDay={(locale, date) => String(date.getDate())}

        // 날짜별 활동 점 표시
        tileContent={({ date, view }) => {
          if (view !== 'month' || !data) return null;


          const key = date.toLocaleDateString('sv-SE');
          const todayKey = new Date().toLocaleDateString('sv-SE');
          const isToday = key === todayKey;
          const filteredData = data?.filter(d => d.logDate === key) || [];
          const animalCount = filteredData.find(d => d.type === 'animal')?.totalCount || 0;
          const plantCount = filteredData.find(d => d.type === 'plant')?.totalCount || 0;

          const renderDots = (count, colorClass) => {
            const visible = Math.min(count, 3);
            const remaining = count - visible;

            return (
              <div className="dot-line">
                {Array.from({ length: visible }).map((_, i) => (
                  <div className={`log-dot ${colorClass}`} key={i} />
                ))}
                {remaining > 0 && <span className="dot-count">+{remaining}</span>}
              </div>
            );
          };

          return (
            <div className="dot-wrapper-vertical">
              {isToday && (
                <div style={{ marginBottom: '-4px', marginLeft: '30px', fontSize: '6px', color: 'gray', }}>오늘</div>
              )}
              {renderDots(animalCount, 'animal-dot')}
              {renderDots(plantCount, 'plant-dot')}

            </div>
          );
        }}
      />

      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '320px',
        height: '30px',
        justifyContent: 'space-between',
        margin: '30px 20px 20px 20px'
      }}>
        <Typography
          sx={{
            display: 'flex',
            fontWeight: '500',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
          {value.toLocaleDateString('ko-KR').replace(/\.$/, '')} 기록
        </Typography>


        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1, height: '25px' }}>
          <Box sx={{ display: "flex", height: '20px' }}>
            <div>
              {filterType !== 'all' && (
                <select
                  name="정렬"
                  value={filterName}
                  style={{ padding: "3px", borderRadius: "5px" }}
                  onChange={(e) => setFilterName(e.target.value)}
                >
                  <option value="all">전체</option>
                  {Array.from(new Set(
                    (logs || [])
                      .filter((log) => filterType === 'all' || log.type === filterType)
                      .map((log) => log.name)
                  )).map((name, i) => (
                    <option key={i} value={name}>{name}</option>
                  ))}
                </select>
              )}
            </div>
          </Box>
          <Box sx={{ display: "flex", height: '20px' }}>
            <div>
              <select
                name="정렬"
                value={filterType}
                style={{ padding: "3px", borderRadius: "5px" }}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="animal">동물</option>
                <option value="plant">식물</option>
              </select>
            </div>
          </Box>
        </Box>
      </Box>
      <Box>
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log, i) => {
            const isSameAsPrev = i > 0 && log.name === filteredLogs[i - 1].name;
            const isSameAsNext = i < filteredLogs.length - 1 && log.name === filteredLogs[i + 1].name;

            return (
              <div key={i} className='log-list'>

                <img
                  className='log-icon'
                  src={log.type === 'animal' ? pet : plant}
                  alt={log.type}
                  style={{ width: '30px', height: '30px' }}
                />
                <div
                  className={`log-icon-wrap ${isSameAsPrev ? 'top-line' : ''} ${isSameAsNext ? 'bottom-line' : ''}`}
                >
                </div>
                <div className='log-content' onClick={()=>handleLogClick(log)}>
                  <span>{log.name} {log.category} {log.category === '산책' && log.time ? `시간: ${log.time}` : ''}</span>
                </div>
              </div>
            );
          })
        ) : (
          <li>
            {filterName !== 'all'
              ? `${filterName}에 해당하는 기록이 없습니다.`
              : `기록이 없습니다.`}
          </li>
        )}
      </Box>
    </>
  );
};

export default CalendarComponent;