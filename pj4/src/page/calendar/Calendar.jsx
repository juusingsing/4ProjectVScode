import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Box, Typography } from "@mui/material";
import 'react-calendar/dist/Calendar.css';
import '../../css/calendar.css';
import pet from '../../image/animalFootPrintBrown.png';
import plant from '../../image/plantGreen.png'

const CalendarComponent = () => {
  const [value, setValue] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date()); // 보이는 달 저장

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
// 점 예시
  const dummyActivityMap = {
    '2025-06-11': { animal: 4, plant: 2 },
    '2025-06-12': { animal: 1, plant: 5 },
    '2025-06-15': { animal: 3, plant: 0 },
  };
// 로그 예시
const [filterType, setFilterType] = useState('all'); // pet / plant
const [filterName, setFilterName] = useState('all'); // 멍멍이, 냥이, 몬스테라 등
const dummyLogs = {
  '2025-06-11': [
    { type: 'pet', name: '멍멍이', text: '산책 다녀옴' },
    { type: 'pet', name: '냥이', text: '사료 먹음' },
    { type: 'plant', name: '몬스테라', text: '물 줌' },
  ],
  '2025-06-12': [
    { type: 'plant', name: '튤립', text: '햇빛 쬐어줌' },
  ],
};

// 현재 선택된 날짜의 로그
const logs = dummyLogs[value.toISOString().split('T')[0]] || [];

// 선택된 조건(filterType, filterName)에 따라 로그 필터링
const filteredLogs = logs.filter((log) => {
  if (filterType === 'all') return true;
  if (log.type !== filterType) return false;
  if (filterName === 'all') return true;
  return log.name === filterName;
});



  const handleChange = (event) => {
    const selectedValue = event.target.value;

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
          if (view !== 'month') return null;

          const key = date.toISOString().split('T')[0];
          const data = dummyActivityMap[key] || { animal: 0, plant: 0 };

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
              {renderDots(data.animal, 'animal-dot')}
              {renderDots(data.plant, 'plant-dot')}
            </div>
          );
        }}
      />

      <Box sx={{
        display:'flex',
        flexDirection:'row',
        width:'320px',
        height:'30px',
        justifyContent:'space-between',
        margin:'30px 20px 20px 20px'
      }}>
      <Typography 
      sx={{
        display:'flex',
        fontWeight:'500',
        flexDirection:'column', 
        justifyContent:'center'
      }}>
        {value.toLocaleDateString('ko-KR').replace(/\.$/, '')} 기록
        </Typography>


      <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center',gap:1, height:'25px'}}>
      <Box sx={{ display: "flex",height:'20px'}}>
        {/* 정렬 셀렉트 박스 */}
        <div>
          {filterType !== 'all' && (
          <select
            name="정렬"
            style={{ padding: "3px", borderRadius: "5px" }}
            onChange={(e) => setFilterName(e.target.value)} // onChange 이벤트 핸들러 추가
          >
            {/* 첫 번째 옵션은 선택되지 않은 상태로 두거나, "선택하세요"와 같은 문구로 시작할 수 있습니다. */}
            {/* <option value="">정렬 기준 선택</option> */}
            <option value="all">전체</option>
            {Array.from(new Set(
      (dummyLogs[value.toISOString().split('T')[0]] || [])
        .filter((log) => log.type === filterType)
        .map((log) => log.name)
    )).map((name, i) => (
      <option key={i} value={name}>{name}</option>
    ))}
          </select>
          )}
        </div>
      </Box>
      <Box sx={{display: "flex",height:'20px'}}>
        {/* 정렬 셀렉트 박스 */}
        <div>
          <select
            name="정렬"
            style={{ padding: "3px", borderRadius: "5px" }}
            onChange={(e) => setFilterType(e.target.value)} // onChange 이벤트 핸들러 추가
          >
            {/* <option value="">정렬 기준 선택</option> */}
            <option value="pet">전체</option>
            <option value="pet">동물</option>
            <option value="plant">식물</option>
          </select>
        </div>
      </Box>
      </Box>
      </Box>
      <ul>
  {filteredLogs.length > 0 ? (
    filteredLogs.map((log, i) => (
      <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <img 
          src={log.type === 'pet' ? pet : plant} 
          alt={log.type} 
          style={{ width: '20px', height: '20px', marginRight: '8px' }}
        />
        <span>{log.name} - {log.text}</span>
      </li>
    ))
  ) : (
    <li>기록이 없습니다</li>
  )}
</ul>
    </>
  );
};

export default CalendarComponent;