import React, { useState, useRef} from 'react';
import { useRegisterMutation, useUserMMutation } from '../../features/user/userApi';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, FormControl,  RadioGroup, Radio,   FormControlLabel} from '@mui/material';
import { useCmDialog } from '../../cm/CmDialogUtil';  
import { CmUtil } from '../../cm/CmUtil';

const Register = () => {
  const [usersId, setUsersId] = useState('');
  const [usersPassword, setUsersPassword] = useState('');
  const [usersName, setUsersName] = useState('');
  const [usersEmail, setUsersEmail] = useState('');

   const usersIdRef = useRef();
   const usersPasswordRef = useRef();
   const usersNameRef = useRef();
   const usersEmailRef = useRef();

  
  const { showAlert } = useCmDialog();
 
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  const {data, refetch}=useUserMMutation({
    usersId
  });

  

  const handleRegisterClick = async () => {


    if (CmUtil.isEmpty(usersName)) {
    showAlert('닉네임을 입력해주세요.');
    usersNameRef.current?.focus();
    return;
    }



    if (CmUtil.isEmpty(usersId)) {
      showAlert('아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }


    

    if (CmUtil.isEmpty(usersPassword)) {
      showAlert('비밀번호를 입력해주세요.');
      usersPasswordRef.current?.focus();
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
    if(isIdDuplicate===null){
      showAlert('아이디 중복체크를 해주세요.')
      return;
    }
    if(isIdDuplicate === true){
      showAlert('이미 사용중인 아이디 입니다. 다른 아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }
    try {
      const response = await register({ usersId, usersPassword, usersName, usersEmail}).unwrap();
      if (response.success) {
        showAlert("회원가입에 성공 하셨습니다. 로그인화면으로 이동합니다.",()=>{navigate('/user/login.do');});
      } else {
        showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      showAlert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } 
  };
  const [isIdDuplicate, setIsIdDuplicate] = useState(null);
  const handleIdDuplicate = async (usersId)=>{
    if (CmUtil.isEmpty(usersId)) {
      showAlert('아이디를 입력해주세요.');
      usersIdRef.current?.focus();
      return;
    }
    const res = await refetch();
    if(res?.data?.data?.exists){
        showAlert("이미 사용중인 아이디입니다.");
        setIsIdDuplicate(true);
    } else {
        showAlert("사용 가능한 아이디입니다.");
        setIsIdDuplicate(false);
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
      <Typography variant="h4" gutterBottom>회원가입</Typography>

       <TextField
        label="닉네임"
        fullWidth
        margin="normal"
        value={usersName}
        inputRef={usersNameRef}
        onChange={(e) => setUsersName(e.target.value)}
      />

      <TextField
        label="아이디"
        fullWidth
        margin="normal"
        value={usersId}
        inputRef={usersIdRef}
        onChange={(e) => setUsersId(e.target.value)}
      />
      <Button onClick={()=>handleIdDuplicate(usersId)} variant="contained"
        color="primary">중복체크</Button>

      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={usersPassword}
        inputRef={usersPasswordRef}
        onChange={(e) => setUsersPassword(e.target.value)}
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
        onClick={handleRegisterClick}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        회원가입
      </Button>
      <Button
        onClick={() => navigate('/user/login.do')}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >

        로그인
        </Button>
    </Box>
  );
};

export default Register;