import React, { useState, useRef, useEffect } from 'react';
import { useLoginMutation } from '../../features/user/userApi';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';
import { CmUtil } from '../../cm/CmUtil';
import { clearUser } from '../../features/user/userSlice';
import { persistor } from '../../app/store';
import Background from '../../image/background.png';
import back from '../../image/back.png';


const Login = () => {
  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const { showAlert } = useCmDialog();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    persistor.purge();
    dispatch(clearUser());
  }, [dispatch]);
  const handleLoginClick = async () => {
    if (CmUtil.isEmpty(usersId)) {
      showAlert("ID를 입력해주세요.");
      usersIdRef.current?.focus();
      return;
    }

    if (CmUtil.isEmpty(usersPassword)) {
      showAlert("비밀번호를 입력해주세요.");
      usersPasswordRef.current?.focus();
      return;
    }
    try {
      const response = await login({ usersId, usersPassword }).unwrap();
      if (response.success) {
        console.log(response);
        showAlert("로그인 성공 홈으로 이동합니다.", () => {
          dispatch(setUser(response.data));
          navigate("/");
        });
      } else {
        showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      showAlert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };
  return (
    <Box
      sx={{
        maxWidth: "360px",
        width: "100%",
        height: "640px",
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        margin: "auto",
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover'
      }}>
      <Button
        onClick={() => navigate(-1)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '10px',
          height: '35px',
          minWidth: '0',
          width: '35px',
          marginLeft: "15px",
          marginBottom: "40px",
          '&:hover': {
            backgroundColor: '#363636'
          },
          backgroundColor: 'rgba(54, 54, 54, 0.4)'

        }}
      >
        <img src={back} alt="" sx={{ pl: '2px' }}></img>
      </Button>
      <Box
        sx={{
          backgroundColor: "rgba(34, 29, 29, 0.42)",
          width: "80%",
          height: "70%",
          display: 'flex',
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: '0 auto',
          gap: 5
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "white" }}>로그인</Typography>
        {/* 아이디 입력 필드 (TextField로 복구 및 스타일 적용) */}
        <Box sx={{width:"90%"}}>
          <Typography sx={{ color: "white", marginBottom:"5px"}}>아이디</Typography>
          <TextField
            fullWidth
            value={usersId}
            inputRef={usersIdRef}
            onChange={(e) => setUsersId(e.target.value)}
            variant="filled" // filled variant를 사용하여 배경색 제어 용이
            InputProps={{
              disableUnderline: true, // 기본 밑줄 제거
              sx: {
                height:"40px",
                backgroundColor: 'rgba(34, 29, 29, 0.6)', // 입력 필드 배경색
                borderBottom: "1px solid white", // 흰색 하단 테두리
                borderRadius: '4px 4px 0 0', // 상단만 둥근 모서리 (filled variant 기본)
                '&:hover': {
                  backgroundColor: 'rgba(34, 29, 29, 0.7)', // 호버 시 배경색 변경
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(34, 29, 29, 0.75)', // 포커스 시 배경색 변경
                  boxShadow: '0px 3px 6px rgba(0,0,0,0.15)', // 포커스 시 그림자 강화
                },
                // 자동 완성 배경색 오버라이드 (box-shadow 트릭)
                '& input:-webkit-autofill': {
                  boxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.6) !important',
                  WebkitBoxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.6) !important',
                  WebkitTextFillColor: 'white !important', // 자동 완성 시 텍스트 색상 흰색
                },
                '& input:-webkit-autofill:focus': {
                  boxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.75) !important', // 포커스 시 배경색 변경
                  WebkitBoxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.75) !important',
                },
              },
              inputProps: {
                style: {
                  padding: '12px', // 입력 텍스트 내부 패딩 (상하좌우)
                  color: 'white', // 텍스트 색상 흰색
                },
              },
            }}
          />
        </Box>
        <Box sx={{width:"90%"}}>
          <Typography sx={{ color: "white", marginBottom:"5px"}}>비밀번호</Typography>
          {/* 비밀번호 입력 필드 (TextField로 복구 및 스타일 적용) */}
          <TextField
            fullWidth
            type="password"
            value={usersPassword}
            inputRef={usersPasswordRef}
            onChange={(e) => setUsersPassword(e.target.value)}
            variant="filled" // filled variant를 사용하여 배경색 제어 용이
            InputProps={{
              disableUnderline: true, // 기본 밑줄 제거
              sx: {
                height:"40px",
                backgroundColor: 'rgba(34, 29, 29, 0.6)', // 입력 필드 배경색
                borderBottom: "1px solid white", // 흰색 하단 테두리
                borderRadius: '4px 4px 0 0', // 상단만 둥근 모서리 (filled variant 기본)
                '&:hover': {
                  backgroundColor: 'rgba(34, 29, 29, 0.7)', // 호버 시 배경색 변경
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(34, 29, 29, 0.75)', // 포커스 시 배경색 변경
                  boxShadow: '0px 3px 6px rgba(0,0,0,0.15)', // 포커스 시 그림자 강화
                },
                // 자동 완성 배경색 오버라이드 (box-shadow 트릭)
                '& input:-webkit-autofill': {
                  boxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.6) !important',
                  WebkitBoxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.6) !important',
                  WebkitTextFillColor: 'white !important', // 자동 완성 시 텍스트 색상 흰색
                },
                '& input:-webkit-autofill:focus': {
                  boxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.75) !important', // 포커스 시 배경색 변경
                  WebkitBoxShadow: 'inset 0 0 0 1000px rgba(34, 29, 29, 0.75) !important',
                },
              },
              inputProps: {
                style: {
                  padding: '12px', // 입력 텍스트 내부 패딩 (상하좌우)
                  color: 'white', // 텍스트 색상 흰색
                },
              },
            }}
          />
        </Box>
        <Button
          onClick={handleLoginClick}
          variant="contained"
          sx={{
            marginTop: 3,
            backgroundColor: '#4B6044',
            borderRadius: '10px',
            width: "150px"
          }}
        >
          로그인
        </Button>
      </Box>
      {/* 아래 추가: 링크 묶음 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2, marginBottom : 5}}>
        <Link to="/find/findId.do" style={{ textDecoration: 'none', color: '#555' }}>아이디 찾기</Link>
        <span>|</span>
        <Link to="/find/findPw.do" style={{ textDecoration: 'none', color: '#555' }}>비밀번호 찾기</Link>
        <span>|</span>
        <Link to="/user/join.do" style={{ textDecoration: 'none', color: '#555' }}>회원가입</Link>
      </Box>

    </Box>
  );
};

export default Login;
