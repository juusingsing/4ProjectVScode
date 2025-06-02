import React, { useState, useEffect, useRef } from 'react';
import { useUserUpdateMutation, useUserDeleteMutation, useViewQuery } from '../../features/user/userApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const UserUpdate = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const [usersName, setUsersName] = useState('');
  const [usersEmail, setUsersEmail] = useState('');

  const usersIdRef = useRef();
  const usersPasswordRef = useRef();
  const usersNameRef = useRef();
  const usersEmailRef = useRef();

  const { showAlert } = useCmDialog();

  const [userUpdate] = useUserUpdateMutation();
  const [userDelete] = useUserDeleteMutation();
  const { data, isSuccess } = useViewQuery({ usersId: user?.usersId });

  useEffect(() => {
    if (isSuccess && data?.data) {
      const info = data.data;
      setUsersId(info.usersId);
      setUsersName(info.usersName);
      usersEmail(info.usersEmail);
    }
  }, [isSuccess, data]);

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
   
    const response = await userUpdate({ usersId, usersPassword, usersName, usersEmail }).unwrap();
    try {
      if (response.success) {
        showAlert("회원정보 수정에 성공 하셨습니다. 홈화면으로 이동합니다.", () => navigate('/'));
      } else {
        showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
    } 
  };

  const handleDeleteClick = async () => {
    try {
      const response = await userDelete({ usersId }).unwrap();
      if (response.success) {
        showAlert("회원탈퇴에 성공 하셨습니다. 로그인화면으로 이동합니다.", () => navigate('/user/login.do'));
      
      } else {
        showAlert('회원탈퇴에에 실패했습니다.');
      }
    } catch (error) {
      showAlert('회원탈퇴에에 실패했습니다.');
    } 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      <Typography variant="h4" gutterBottom>회원정보 수정</Typography>

      <TextField
        label="아이디"
        value={usersId}
        disabled
        fullWidth
        inputRef={usersIdRef}
        margin="normal"
      />

      <TextField
        label="새 비밀번호 (변경 시 입력)"
        type="password"
        fullWidth
        margin="normal"
        value={usersPassword}
        inputRef={usersPasswordRef}
        onChange={(e) => setUsersPassword(e.target.value)}
      />

      <TextField
        label="이름"
        fullWidth
        margin="normal"
        value={usersName}
        inputRef={usersNameRef}
        onChange={(e) => setUsersName(e.target.value)}
      />

      <TextField
        label="이메일"
        type="email"
        fullWidth
        margin="normal"
        value={usersEmail}
        inputRef={usersEmailRef}
        onChange={(e) => setUsersEmail(e.target.value)}
      />

      <Button
        onClick={handleUpdateClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원 정보 수정
      </Button>
     
      <Button
        onClick={handleDeleteClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원 탈퇴
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
