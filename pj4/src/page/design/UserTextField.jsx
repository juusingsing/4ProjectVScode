import React from 'react';
import { TextField } from '@mui/material';

const UserTextField = ({ label, type = 'text', value, onChange, inputRef }) => {

return (
    <TextField
      label={label} // TextField의 label prop 활성화
      fullWidth
      margin="normal" // Material-UI의 기본 마진 (위/아래) 적용
      value={value}
      inputRef={inputRef}
      onChange={onChange}
      type={type}
      variant="filled" // filled variant 사용
      InputLabelProps={{
        sx: {
          color: "white", // 라벨 색상 흰색
          // filled variant의 라벨 기본 위치 (필요에 따라 조절)
          transform: 'translate(12px, 12px) scale(1)',
          '&.Mui-focused': { // 포커스 시 라벨 위치
            transform: 'translate(12px, -9px) scale(0.75)',
          },
          '&.MuiFormLabel-filled': { // 값이 채워졌을 때 라벨 위치
            transform: 'translate(12px, -9px) scale(0.75)',
          },
          '&.Mui-disabled': { // disabled 시 라벨 색상 유지 (선택 사항)
            color: 'white',
          },
        },
        shrink: true, // 라벨이 항상 축소된 상태로 상단에 표시되도록 강제
      }}
      InputProps={{
        disableUnderline: true, // Material-UI의 기본 밑줄 제거
        sx: {
          backgroundColor: 'rgba(34, 29, 29, 0.6)', // 입력 필드 배경색
          borderRadius: '4px 4px 0 0', // 상단만 둥근 모서리 (filled variant 기본)
          '&:hover': {
            backgroundColor: 'rgba(34, 29, 29, 0.7)', // 호버 시 배경색 변경
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(34, 29, 29, 0.75)', // 포커스 시 배경색 변경
            boxShadow: '0px 3px 6px rgba(0,0,0,0.15)', // 포커스 시 그림자 강화 (기존 그림자 유지)
          },
          // ===== 자동 완성 배경색 및 텍스트 색상, 그리고 밑줄 오버라이드 =====
          // box-shadow 트릭으로 불투명도 높여서 브라우저 기본 스타일 덮어씌움
          // 밑줄도 box-shadow로 추가하여 동일 레이어에서 렌더링되도록 함
          '& input:-webkit-autofill': {
            boxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 1) !important, inset 0 -1px 0 0 white !important', // 배경 (완전히 불투명) + 밑줄
            WebkitBoxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 1) !important, inset 0 -1px 0 0 white !important', // Webkit 브라우저용
            WebkitTextFillColor: 'white !important', // 자동 완성 시 텍스트 색상 흰색으로 강제
          },
          // 자동 완성 상태에서 포커스될 때의 배경색과 밑줄
          '& input:-webkit-autofill:focus': {
            boxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 1) !important, inset 0 -1px 0 0 white !important', // 배경 (완전히 불투명) + 밑줄
            WebkitBoxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 1) !important, inset 0 -1px 0 0 white !important',
          },
          // 일반 상태에서 밑줄을 box-shadow로 적용 (기존 투명도 유지)
          boxShadow: 'inset 0 -1px 0 0 white', // 일반 상태 밑줄
        },
        inputProps: {
          style: {
            padding: '12px', // 입력 텍스트 내부 패딩 (상하좌우)
            color: 'white', // 텍스트 색상 흰색
          },
        },
      }}
    />
  );
};

export default UserTextField;
