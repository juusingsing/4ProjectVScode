import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';

// 사용자 정의 TextField 스타일
const StyledTextField = styled(TextField)({
  '& .MuiFilledInput-root': { // Filled TextField의 루트 엘리먼트
    backgroundColor: '#D9D9D9',
    borderRadius: '20px', // 여기에 borderRadius 적용
    overflow: 'hidden', // 내부 콘텐츠가 둥근 모서리를 넘지 않도록
    
    '&:hover': {
      backgroundColor: '#D9D9D9', // 호버 시에도 같은 색상 유지
    },
    '&.Mui-focused': {
      backgroundColor: '#D9D9D9', // 포커스 시에도 같은 색상 유지
    },
    '&:before': { // 기본 언더라인 제거
      borderBottom: 'none !important', // !important로 우선순위 높임
    },
    '&:after': { // 포커스 시 언더라인 제거
      borderBottom: 'none !important', // !important로 우선순위 높임
    },
    '& input:-webkit-autofill': {
      boxShadow: '0 0 0 1000px #D9D9D9 inset',
      WebkitTextFillColor: 'black',
      transition: 'background-color 5000s ease-in-out 0s',
    },
  },
  '& .MuiInputBase-input': { // 실제 input 요소
    padding: '12px 14px', // 내부 텍스트 패딩 조절
    // 필요에 따라 여기에 직접 borderRadius를 줄 수도 있습니다.
    // borderRadius: '20px', 
  },
  // Label이 hiddenLabel로 설정되었지만, 다른 Label 관련 스타일도 초기화
  '& .MuiInputLabel-root': {
    display: 'none',
  },
});

const UserTextField = ({ 
  type = 'text', 
  value, 
  onChange, 
  inputRef, 
  ...props // TextField에 전달할 추가 props
}) => {
  return (
    <StyledTextField
      variant="filled" // 라벨 없이 배경색을 쉽게 적용하기 위해 filled 사용
      type={type}
      value={value}
      onChange={onChange}
      inputRef={inputRef}
      disableUnderline={true} // 언더라인 확실히 제거
      hiddenLabel // 라벨 숨김 (시각적으로 라벨이 필요 없는 경우)
      InputProps={{ // InputProps를 사용하여 내부 Input 컴포넌트에 직접 prop 전달
        disableUnderline: true, // 한 번 더 언더라인 비활성화 확인
      }}
      {...props}
    />
  );
};

export default UserTextField;