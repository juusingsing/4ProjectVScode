import React, { useState, useEffect } from "react";
import {
  Box
  // Button,
  // TextField,
  // Typography,
} from '@mui/material';
import CommonComboBox from './CommonComboBox';
import {
    // useComboCreateMutation,
    // useComboDeleteMutation,
    // useComboListQuery,
    useComboListByGroupQuery,
 } from '../../features/combo/combo';

const Combo = ({ groupId, onSelectionChange }) => {
  const { data, isLoading, error } = useComboListByGroupQuery(groupId);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState('');
 
  // ✅ 불러온 데이터로 items 설정
   useEffect(() => {
    console.log(`groupId(${groupId}) 응답:`, data);
    if (Array.isArray(data?.data)) {
      const formattedItems = data.data.map(item => ({
        value: item.codeId,
        label: item.codeName,
      }));
      setItems(formattedItems);
    }
  }, [data, groupId]); // ✅ groupId 변경에도 반응


  // ✅ CommonComboBox에서 값이 변경될 때 호출될 함수
  const handleComboBoxChange = (newValue) => {
    setSelected(newValue); // 자신의 상태 업데이트
    // 선택된 값을 부모 컴포넌트 (WriteCreate)로 전달
    if (onSelectionChange) {
      onSelectionChange(newValue);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* CommonComboBox에 options, value, onChange prop을 전달 */}
      <CommonComboBox
        options={items}
        value={selected} // 현재 선택된 값
        onChange={handleComboBoxChange} // 값이 변경될 때 호출될 함수
        placeholder="선택하세요" // 기본 플레이스홀더
        disabled={isLoading} // 데이터 로딩 중에는 비활성화
      />
    </Box>
  );
};

export default Combo;




 // const [inputValue, setInputValue] = useState('');
  // const [inputLabel, setInputLabel] = useState('');
  // const [comboCreate] = useComboCreateMutation();
  // const [comboDelete] = useComboDeleteMutation();
  // const { data, isLoading, error } = useComboListQuery();





  // {/* <Typography variant="h6">항목 추가</Typography>
  //     <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
  //       <TextField
  //         label="Value"
  //         value={inputValue}
  //         onChange={(e) => setInputValue(e.target.value)}
  //         size="small"
  //       />
  //       <TextField
  //         label="Label"
  //         value={inputLabel}
  //         onChange={(e) => setInputLabel(e.target.value)}
  //         size="small"
  //       />
  //       <Button variant="contained" onClick={handleAddItem}>
  //         추가
  //       </Button>
  //     </Box> */}





    // 컬럼에 추가
  // const handleAddItem = async () => {
  //   const trimmedValue = inputValue.trim();
  //   const trimmedLabel = inputLabel.trim();

  //   if (!trimmedValue || !trimmedLabel) {
  //     alert("Value와 Label을 모두 입력해주세요.");
  //     return;
  //   }

  //   // 중복 검사: 같은 value가 이미 있으면 추가하지 않음
  //   const isDuplicate = items.some(item => item.value === trimmedValue);
  //   if (isDuplicate) {
  //       alert(`이미 존재하는 value입니다: ${trimmedValue}`);
  //       return;
  //   }

  //   // ✅ DB 저장 시도
  //     try {
  //       const formData = {
  //         value: trimmedValue,
  //         label: trimmedLabel,
  //       };

  //       const result = await comboCreate(formData).unwrap(); // RTK Query 호출

  //       console.log('서버 응답:', result); // 성공 시 결과 확인
        
  //       // 성공했을 때만 state에 추가
  //       setItems(prev => [...prev, { value: trimmedValue, label: trimmedLabel }]);
  //       setInputValue('');
  //       setInputLabel('');
  //   } catch (error) {
  //       console.error('저장 실패:', error);
  //       if (error.data) {
  //           console.error('서버 응답 데이터:', error.data);
  //       }
  //       if (error.status) {
  //           console.error('HTTP 상태 코드:', error.status);
  //       }
  //       alert('DB 저장 중 오류가 발생했습니다.');
  //       }
  // };


  //  선택컬럼삭제하는
  // const handleDeleteItem = async () => {
  //   if (!selected) {
  //       alert("삭제할 항목을 선택해주세요.");
  //       return;
  //   }

  //   try {
  //       const itemToDelete = items.find(item => item.value === selected);
  //       if (!itemToDelete) {
  //       alert("해당 항목을 찾을 수 없습니다.");
  //       return;
  //       }

  //       await comboDelete({ label: itemToDelete.label }).unwrap();
  //       setItems(prev => prev.filter(item => item.value !== selected));
  //       setSelected('');
  //       alert('삭제 성공');
  //   } catch (error) {
  //       console.error('삭제 실패:', error);
  //       alert('삭제 중 오류가 발생했습니다.');
  //   }
  // };


  // {/* 선택 박스 */}
  //     <CommonComboBox 
  //     options={items} 
  //     value={selected} 
  //     onChange={setSelected} />


  // {/* <Button variant="outlined" color="error" onClick={handleDeleteItem}>
  //       삭제
  //     </Button>   */}
      
  //     {/* <Typography variant="body1" sx={{ mt: 2 }}>
  //       선택된 값: {selected || '없음'}
  //     </Typography> */}












  
