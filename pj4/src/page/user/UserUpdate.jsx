import React, { useState, useEffect, useRef } from 'react';
import { useUserUpdateMutation, useViewQuery } from '../../features/user/userApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import back from '../../image/backWhite.png';

const UserUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const [usersConfirmPassword, setUsersConfirmPassword] = useState('');
  const [usersName, setUsersName] = useState('');
  const [usersEmail, setUsersEmail] = useState('');
  const [usersFileId, setUsersFileId] = useState(0);

  // 단일 프로필 이미지 관리를 위한 상태:
  const [selectedNewFile, setSelectedNewFile] = useState(null); // 사용자가 새로 선택한 단일 File 객체
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // 프로필 이미지 미리보기를 위한 URL

  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const usersConfirmPasswordRef = useRef();
  const usersNameRef = useRef();
  const usersEmailRef = useRef();
  const usersFileInputRef = useRef();

  const { showAlert } = useCmDialog();

  const [userUpdate, { isLoading: isUpdating }] = useUserUpdateMutation();
  const { data, isSuccess, isFetching } = useViewQuery({ usersId: user?.usersId });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      setUsersId(info.usersId);
      setUsersName(info.usersName);
      setUsersEmail(info.usersEmail);
      if (info.usersFileId && info.usersFileId !== 0) {
        setImagePreviewUrl(`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${info.usersFileId}`);
      } else {
        setImagePreviewUrl(null);
      }
    }
  }, [isSuccess, data]);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedNewFile(file); // 실제 파일 객체 저장
      setImagePreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    } else {
      // 파일 선택 취소 시
      setSelectedNewFile(null);
      // 기존 usersFileId가 있다면 기존 이미지로 복원, 없으면 null
      if (usersFileId && usersFileId !== 0) {
        setImagePreviewUrl(`${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${usersFileId}`);
      } else {
        setImagePreviewUrl(null);
      }
    }
  };

  // 프로필 이미지 제거 핸들러
  const handleRemoveProfileImage = () => {
    setSelectedNewFile(null); // 새로 선택된 파일 제거
    setUsersFileId(0); // 기존 파일 ID를 0으로 설정하여 백엔드에 삭제 요청 신호
    setImagePreviewUrl(null); // 미리보기 이미지 제거
    // 파일 input의 값도 초기화하여 동일한 파일을 다시 선택할 수 있도록 함
    if (usersFileInputRef.current) {
      usersFileInputRef.current.value = '';
    }
  };

  const handleUpdateClick = async () => {
    if (CmUtil.isEmpty(usersId)) {
      showAlert('아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersName)) {
      showAlert('이름을 입력해주세요.');
      usersNameRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersEmail)) {
      showAlert('이메일을 입력해주세요.');
      usersEmailRef.current?.focus();
      return;
    }

    if (!CmUtil.isEmail(usersEmail)) {
      showAlert('유효한 이메일 형식이 아닙니다.');
      usersEmailRef.current?.focus();
      return;
    }
    // --- 비밀번호 유효성 검사 (필수 입력 및 확인 일치) ---
    if (CmUtil.isEmpty(usersPassword)) { // 비밀번호 필수 입력 검사
      showAlert('비밀번호를 입력해주세요.');
      usersPasswordRef.current?.focus();
      return;
    }
    if (CmUtil.isEmpty(usersConfirmPassword)) { // 비밀번호 확인 필수 입력 검사
      showAlert('비밀번호 확인을 입력해주세요.');
      usersConfirmPasswordRef.current?.focus();
      return;
    }
    if (usersPassword !== usersConfirmPassword) { // 비밀번호와 확인 일치 검사
      showAlert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      usersPasswordRef.current?.focus();
      return;
    }

    const formData = new FormData();
    formData.append('usersId', usersId);
    // 비밀번호는 이제 항상 전송됩니다.
    formData.append('usersPassword', usersPassword); // if 조건 제거
    formData.append('usersName', usersName);
    formData.append('usersEmail', usersEmail);
    if (selectedNewFile) {
      formData.append('files', selectedNewFile);
    } else if (usersFileId === 0 && data?.data?.usersFileId !== 0) {
      formData.append('remainingFileIds', '0');
    }
    try {
      const response = await userUpdate(formData).unwrap();
      if (response.success) {
        showAlert("회원정보 수정에 성공 하셨습니다. 홈화면으로 이동합니다.", () => navigate('/'));
      } else {
        showAlert(response.message || '회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert(error.data?.message || '회원정보 수정에 실패했습니다. 서버 오류 또는 네트워크 문제.');
    }
  };

 const LabeledTextFieldRow = ({ label, value, onChange, inputRef, disabled = false, type = 'text' }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // 세로 중앙 정렬
                backgroundColor: "rgba(217, 217, 217, 0.21)", // 전체 행의 배경색
                paddingX: "5px",
                paddingY: "5px",
                borderRadius: '20px', // 전체 행의 둥근 모서리
                width: '80%', // 부모 Box의 전체 너비 사용
            }}
        >
            <Typography variant="subtitle1" color="text.secondary" sx={{width:"100px"}}> {/* 라벨 */}
                {label}
            </Typography>
            <TextField
                value={value}
                onChange={onChange}
                inputRef={inputRef}
                disabled={disabled}
                type={type}
                variant="outlined" // 'outlined' variant 사용
                sx={{
                  width:"50px",
                  height:"20px",
                    '& .MuiOutlinedInput-root': { // 실제 입력 영역과 테두리 부분 스타일링
                        backgroundColor: "white", // 입력 필드 내부 기본 배경색 (활성화 시)
                        borderRadius: '20px', // 입력 필드의 둥근 모서리
                        '& fieldset': { // outlined variant의 기본 테두리 제거 (투명하게)
                            borderColor: 'transparent',
                            height:"20px"
                        },
                        '&:hover fieldset': {
                            borderColor: 'transparent',
                             height:"20px"
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent',
                             height:"20px"
                        },
                        '&.Mui-focused': { // 포커스 시 배경색 변경
                            backgroundColor: "rgba(255, 255, 255, 0.8)", // 포커스 시 약간 투명한 흰색
                             height:"20px"
                        },
                        // disabled 상태일 때의 배경색과 텍스트 색상
                        '&.Mui-disabled': {
                            backgroundColor: 'transparent', // 부모 Box의 배경색과 같도록 투명하게 설정
                            WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)', // 텍스트 색상 유지 (웹킷 브라우저)
                            color: 'rgba(0, 0, 0, 0.87)', // 텍스트 색상 유지 (기타 브라우저)
                             height:"20px"
                        },
                    },
                    // TextField의 기본 라벨은 사용하지 않으므로 숨김
                    '& .MuiInputLabel-root': {
                        display: 'none',
                         height:"20px"
                    },
                    // 원래 disabled 상태 텍스트 색상 조절 (위 Mui-disabled 규칙과 중복될 수 있으나, 안전을 위해 남김)
                    '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                        color: 'rgba(0, 0, 0, 0.87)',
                         height:"20px"
                    },
                }}
            />
        </Box>
    );
};


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '640px',
        maxWidth: '360px',
        width: '100%',
        margin: '0 auto'
      }}
    >
      {/* 상단 배경색 영역 */}
      <Box
        sx={{
          width: '100%',
          height: '140px',
          backgroundColor: '#385C4F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative', // 자식 요소 absolute 위치 지정을 위해
        }}
      >
        {/* 헤더 섹션: 뒤로가기 버튼과 중앙 정렬된 마이페이지 제목 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center', // 세로 중앙 정렬
            width: '100%',
            mb: 3, // 헤더와 아래 콘텐츠 간의 간격 추가 (선택 사항)
            position: 'absolute', // 상단 Box에 절대 위치
            top: 10,
            justifyContent: 'space-between', // 요소를 양 끝으로 분산
          }}
        >
          {/* 뒤로가기 버튼 - 왼쪽 끝 */}
          <Button
            onClick={() => navigate(-1)}
            sx={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "10px",
              height: "30px",
              minWidth: "0",
              width: "30px",
              "&:hover": {
                backgroundColor: "#363636",
              },
            }}
          >
            {/* img 태그에 style 속성을 직접 적용 */}
            <img src={back} alt="뒤로가기" style={{ height: "20px" }}></img>
          </Button>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 0, color: "white" }}>
              마이페이지
            </Typography>
          </Box>
          <Box sx={{ width: '30px', flexShrink: 0 }} />
        </Box>

        {/* 프로필 이미지 섹션 */}
        <Box sx={{ position: 'relative', mb: 3 }}>
          <Avatar
            src={imagePreviewUrl}
            alt="Profile Preview"
            sx={{ width: 100, height: 100, mt: 10 }}
          />
          <input
            type="file"
            hidden
            ref={usersFileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            onClick={() => usersFileInputRef.current.click()}
          >
            <PhotoCameraIcon />
          </IconButton>
          {imagePreviewUrl && (
            <IconButton
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'error.dark',
                },
              }}
              onClick={handleRemoveProfileImage}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {/* TextField들을 감싸는 Box에 gap을 적용하여 간격 제어 */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems:"center",
          gap: '15px',
          mt: 6
        }}>
        <LabeledTextFieldRow
          label="닉네임"
          value={usersName}
          inputRef={usersNameRef}
          onChange={(e) => setUsersName(e.target.value)}
        />

        <LabeledTextFieldRow
          sx={{backgroundColor:"transparents"}}
          label="아이디"
          value={usersId}
          disabled
          inputRef={usersIdRef}
        />

        <LabeledTextFieldRow
          label="이메일"
          type="email"
          disabled
          value={usersEmail}
        />

        <LabeledTextFieldRow
          label="비밀번호"
          type="password"
          value={usersPassword}
          inputRef={usersPasswordRef}
          onChange={(e) => setUsersPassword(e.target.value)}
        />

        <LabeledTextFieldRow
          label="비밀번호 확인"
          type="password"
          value={usersConfirmPassword}
          inputRef={usersConfirmPasswordRef}
          onChange={(e) => setUsersConfirmPassword(e.target.value)}
        />
      </Box>
      <Button
        onClick={handleUpdateClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        저장
      </Button>

      <Button
        onClick={() => navigate('/')}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        홈
      </Button>
    </Box>
  );
};

export default UserUpdate
