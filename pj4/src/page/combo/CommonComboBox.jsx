// CommonComboBox.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// CommonComboBox는 이제 Material-UI Select 컴포넌트를 렌더링합니다.
// sx prop을 받아와서 Select에 적용할 수 있도록 합니다.
const CommonComboBox = ({ options, value, onChange, placeholder = '선택하세요', disabled = false, sx, label }) => {
  // label prop을 추가하여 InputLabel에 사용
  const id = `common-select-${Math.random().toString(36).substr(2, 9)}`; // 고유 ID 생성 (필요에 따라)
  console.log("콤보 선택된value : " + value);

  return (
    
    <FormControl fullWidth disabled={disabled}>
      {/* placeholder가 있을 경우 InputLabel로 사용
      {placeholder && <InputLabel id={id}>{placeholder}</InputLabel>} */}
      <Select
        labelId={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label} // InputLabel과 연결
        sx={sx} // 여기서 Combo 컴포넌트로부터 전달받은 sx prop을 Select에 적용
      >
        {/* '전체' 또는 플레이스홀더를 위한 빈 옵션 */}
        <MenuItem value="">
         <em>{placeholder}</em> {/* 폰트 스타일링을 위해 em 태그 사용 가능 */}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CommonComboBox;