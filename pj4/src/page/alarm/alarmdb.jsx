import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import 'react-toastify/dist/ReactToastify.css';
import { useAlarmListQuery } from "../../features/alarm/alarmApi";


const Alarmdb = () => {
  // const [alarmId, setAlarmId] = useState(null);
  // const [year, setYear] = useState('');
  // const [month, setMonth] = useState('');
  // const [day, setDay] = useState('');
  // const [hour, setHour] = useState('');
  // const [min, setMin] = useState('');
  // const [alarmCycle, setAlarmCycle] = useState('');
  const { showAlert } = useCmDialog();
  const [formattedTime, setFormattedTime] = useState('');
  const { data, error, isLoading, refetch } = useAlarmListQuery({});

  const alarmSet = async () => {
     
    try {
      const response = await refetch();
      if (response.data && Array.isArray(response.data?.data) && response.data.success) {
        console.log('response:', response);

        const alarm = response.data.data[0]; // 첫 번째 알람 데이터
        const alarmId = parseInt(alarm.alarmId, 10);
        const year = 2000 + parseInt(alarm.year, 10);
        const month = alarm.month;
        const day = parseInt(alarm.day, 10);  // 05 -> 5
        const hour = parseInt(alarm.hour, 10);
        const min = parseInt(alarm.min);

          let cycleDays = 0;
          switch (alarm.alarmCycle) {
            case 'A01': cycleDays = 1; break;
            case 'A02': cycleDays = 2; break;
            case 'A03': cycleDays = 3; break;
            case 'A04': cycleDays = 5; break;
            case 'A05': cycleDays = 7; break;
            case 'A06': cycleDays = 14; break;
            default: cycleDays = 0; // 또는 null
          }
        const alarmCycle = cycleDays;


        // const alarmData = {
        //   type: "SET_ALARM",
        //   time: "2025-06-04T14:00:30",
        //   message: "물 주는 시간입니다!"
        // };

        const alarmData = {
          type: "SET_ALARM",
          alarmId : alarmId,      // 숫자
          year : year,            // 숫자
          month : month,          // 문자
          day : day,              // 숫자
          hour : hour,            // 숫자
          min : min,              // 숫자
          alarmCycle : alarmCycle,// 숫자
          message: "물 주는 시간입니다!"
        };

        const jsonString = JSON.stringify(alarmData);
        console.log("전달할 알람 JSON:", jsonString);

        // // 시간 포맷 변환
        //   const date = new Date(alarmData.time);
        //   const formatted = `${date.getFullYear()}.
        //                     ${String(date.getMonth() + 1).padStart(2, '0')}.
        //                     ${String(date.getDate()).padStart(2, '0')}
        //                     ${String(date.getHours()).padStart(2, '0')}:
        //                     ${String(date.getMinutes()).padStart(2, '0')}:
        //                     ${String(date.getSeconds()).padStart(2, '0')}`;
        //   setFormattedTime(formatted);

        // 시간 포맷 변환

          const formattedTime = year+month+day+hour+min+alarmCycle;
          setFormattedTime(formattedTime);

        try {
          if (window.Android && window.Android.AlarmSet) {
            window.Android.AlarmSet(jsonString);
          } else {
            console.warn("Android 인터페이스를 찾을 수 없습니다.");
          }
        } catch (e) {
          console.error("Android Alarm 호출 중 오류:", e);
          alert("Android Alarm 호출 중 오류:");
        }


      } else {
        showAlert('데이터조회실패1');
        console.log('응답 구조 이상:', response.data);
      }
    } catch (error) {
      showAlert('데이터조회실패2');
      console.error(error);
    }

    

  };



  return (
    <>
      
      <Typography variant="h6" gutterBottom>
        알람 시간: {formattedTime}
      </Typography>

      <button onClick={alarmSet}>
          알람 조회
      </button>

      <button onClick={() => {
          if (window.Android && window.Android.cancelAlarm) {
              window.Android.cancelAlarm();
          } else {
              alert("AndroidInterface is not available.");
          }
      }}>
          알람 취소
      </button>



    </>
  );
};

export default Alarmdb;
