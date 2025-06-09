import React, { useEffect, useRef, useState } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor"; 
import {
  useWriteViewQuery, 
  useWriteUpdateMutation, 
  useWriteDeleteMutation 
} from "../../features/write/writeApi";
import { CmUtil } from "../../cm/CmUtil"; 
import { useCmDialog } from "../../cm/CmDialogUtil"; 
import { useNavigate, useSearchParams } from "react-router-dom"; 
import { useDropzone } from "react-dropzone"; 
import { Box, TextField, Typography, List, ListItem, ListItemText, IconButton, Paper, Button} from '@mui/material'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import { useSelector } from "react-redux";
import Combo from"../combo/combo";
import ToggleCombo from '../../page/combo/ToggleCombo';
import back from '../../image/back.png';

const WriteUpdate = () => {
  const user = useSelector((state)=>state.user.user); 
  const editorRef = useRef(); 
  const titleRef = useRef(); 
  const [editor, setEditor] = useState(""); 
  const [title, setTitle] = useState(""); 

  const [searchParams] = useSearchParams(); 
  const id = searchParams.get('id'); 

  // RTK Query 뮤테이션 훅 초기화
  const [writeUpdate] = useWriteUpdateMutation(); 
  const [writeDelete] = useWriteDeleteMutation(); 

  // 게시글 상세 정보를 가져오기 위한 RTK Query 훅
  const {data } = useWriteViewQuery({writingId : id});

  const [writing, setWrite] = useState(null); 
  const [existingFiles, setExistingFiles] = useState([]); 
  const [remainingFileIds, setRemainingFileIds] = useState([]);
  const [writingSortation, setWritingSortation] = useState("");
  const [writingCategory, setWritingCategory] = useState("");


  useEffect(() => {
    if (data?.success) {
      console.log(data.data); 
      setWrite(data.data); 
      setTitle(data.data.writingTitle); 
      setEditor(data.data.writingContent); 
      setExistingFiles(data.data.postFiles || []); 
      // 기존 첨부 파일들의 ID를 추출하여 `remainingFileIds` 초기화
      setRemainingFileIds(data.data.postFiles?.map(file => file.postFileId) || []);
      setWritingSortation(data.data.writingSortation);
      setWritingCategory(data.data.writingCategory);
    }
  }, [data]); // `data`가 변경될 때마다 이펙트 실행

  useEffect(() => {
  console.log('writingSortation 변경됨:', writingSortation);
}, [writingSortation]);

useEffect(() => {
  console.log('writingCategory 변경됨:', writingCategory);
}, [writingCategory]);

  const {showAlert, showConfirm} = useCmDialog(); 
  const navigate = useNavigate(); 


  // 폼 제출(게시글 수정) 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

 
    const contentText = editorRef.current?.getContent({ format: 'text' });
    const contentHtml = editorRef.current?.getContent();
  
    // 제목 유효성 검사
    if (CmUtil.isEmpty(title)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus(); // 제목 필드로 포커스
      return;
    }
  
    // 제목 길이 검사
    if (!CmUtil.maxLength(title, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
      return;
    }
  
    // 내용 유효성 검사
    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => editorRef.current?.focus()); // 내용 필드로 포커스
      return;
    }
  
    // 내용 길이 검사
    if (!CmUtil.maxLength(contentText, 2000)) {
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.", () => editorRef.current?.focus());
      return;
    }
  

    const formData = new FormData();
    formData.append("writingId", id); // 게시글 ID 추가
    formData.append("writingTitle", title); // 수정된 제목 추가
    formData.append("writingContent", contentHtml); // 수정된 HTML 내용 추가
    formData.append("writingSortation",writingSortation);
    formData.append("writingCategory", writingCategory);

    // 유지할 파일 ID 목록을 콤마로 구분된 문자열로 변환하여 추가
    formData.append("remainingFileIds", remainingFileIds.join(","));
    
    // 새로 업로드된 파일들을 FormData에 추가
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 게시글 수정 API 호출 및 결과 처리
      const res = await writeUpdate(formData).unwrap(); // unwrap()을 사용하여 성공/실패 직접 처리
      if(res.success){
        showAlert("게시글 수정 성공! 게시판 목록으로 이동합니다.", ()=>navigate("/write/list.do"));
      } else {
        showAlert("게시글 수정 실패 했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error); // 에러 로깅
      showAlert("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  const [uploadedFiles, setUploadedFiles] = useState([]); // 새로 업로드할 파일 목록을 저장하는 state

  // Dropzone 훅 초기화 (파일 드래그 앤 드롭 영역 설정)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => { // 파일이 드롭되거나 선택되었을 때 실행될 콜백
      setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // 기존 파일과 새 파일 병합
    },
    multiple: true, 
    maxSize: 10 * 1024 * 1024, // 최대 파일 크기 (10MB)
  });

  // 새로 업로드된 파일 삭제 핸들러
  const handleRemoveFile = (indexToRemove)=>{
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index)=>index!==indexToRemove) // 해당 인덱스의 파일 제거
    );
  };

  // 기존 파일 삭제 핸들러 (existingFiles 목록에서 제거하고 remainingFileIds 업데이트)
  const handleRemoveExistingFile = (postFileId) => {
    setRemainingFileIds((prevIds) => prevIds.filter((id) => id !== postFileId)); // 해당 ID를 remainingFileIds에서 제거
  };
  
  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    // 삭제 확인 다이얼로그 표시
    showConfirm("정말 삭제하시겠습니까?", async () => { 
      try {

        const formData = new FormData();
        formData.append("writingId", id); //게시글 id를 FormData에 추가

        const res = await writeDelete(formData).unwrap(); // 게시글 삭제 API 호출
        if (res.success) {
          showAlert("게시글 삭제 성공! 게시판 목록으로 이동합니다.", () => navigate("/write/list.do"));
        } else {
          showAlert("게시글 삭제 실패했습니다.");
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error); // 에러 로깅
        showAlert("게시글 삭제 중 오류가 발생했습니다.");
      }
    });
  };

      // ToggleCombo에서 값이 변경될 때 호출될 핸들러
  const handleWritingSortationChange = (newValue) => {
    setWritingSortation(newValue);
  };

  return (
    <Box sx={{ maxWidth: 360, width: '100%', mx: 'auto', p: 3 }}>
       <Button
                  onClick={() => window.history.back()}
                  // variant="contained"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    borderRadius: '10px',
                    height: '35px',
                    minWidth: '0',
                    width: '35px',
                    '&:hover': {
                      backgroundColor: '#363636'
                    },
                    backgroundColor: 'rgba(54, 54, 54, 0.4)'
      
                  }}
                >
                  <img src={back} alt="" sx={{ pl: '2px' }}></img>
                </Button>
     <ToggleCombo onToggleChange={handleWritingSortationChange} defaultValue={writingSortation} />
    <Combo
      groupId="Community"
      defaultValue={writingCategory}
      onSelectionChange={setWritingCategory}
    />
    
      <Typography variant="h5" gutterBottom>
        게시글 수정
      </Typography>
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        {/* 제목 입력 필드 */}
        <Box mb={3}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="제목"
            variant="outlined"
            inputProps={{ maxLength: 100 }} 
            inputRef={titleRef} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </Box>
        {/* 내용(TinyMCE 에디터) 영역 */}
        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor
            value={editor} 
            setValue={setEditor} 
            ref={editorRef} 
            max={2000} 
          />
        </Box>
        {/* 기존 파일 목록 표시 (existingFiles가 있고, remainingFileIds에 해당 파일 ID가 포함된 경우만 표시) */}
        {existingFiles.length > 0 && ( // existingFiles가 있을 때만 표시
          <Box mb={3}>
            <Typography gutterBottom>기존 파일</Typography>
            <List>
              {existingFiles.map((file) => (
                // `remainingFileIds` 배열에 해당 파일의 ID가 포함되어 있을 때만 렌더링 (삭제되지 않은 파일)
                remainingFileIds.includes(file.postFileId) && (
                  <ListItem
                    key={file.postFileId}
                    secondaryAction={ // 리스트 아이템의 오른쪽 액션 버튼
                      <IconButton edge="end" onClick={() => handleRemoveExistingFile(file.postFileId)}>
                        <DeleteIcon color="error" /> 
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        // 파일 다운로드 링크
                        <a href={`${process.env.REACT_APP_API_BASE_URL}/api/file/imgDown.do?fileId=${file.postFileId}`} 
                          target="_blank" 
                          rel="noopener noreferrer">
                          {file.postFileName} {/* 파일 이름 표시 */}
                        </a>
                      }
                    />
                  </ListItem>
                )
              ))}
            </List>
          </Box>
        )}
        {/* 파일 업로드 영역 (Dropzone) */}
        <Box mb={3}>
          <Typography gutterBottom>파일 업로드</Typography>
          <Paper variant="outlined"
            sx={{ p: 3, textAlign: "center", borderStyle: "dashed" }}
            {...getRootProps()} 
          >
            <input {...getInputProps()} /> 
            <Typography variant="body2" color="textSecondary">
              파일을 드래그하거나 클릭하여 업로드하세요.
            </Typography>
          </Paper>

  
          {uploadedFiles.length > 0 && (
            <List>
              {uploadedFiles.map((file, index) => (
                <ListItem
                  key={index} // 고유 key (파일 이름과 인덱스 조합 가능)
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  {/* `file.name`으로 변경하여 실제 파일 이름이 보이도록 수정 */}
                  <ListItemText primary={file.name} /> 
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        {/* 액션 버튼들 (수정, 삭제, 목록) */}
        <Box display="flex" gap={1} mt={2}>
          {/* 현재 로그인된 사용자와 게시글 작성자가 동일할 때만 수정/삭제 버튼 표시 */}
          {user?.usersId === writing?.createId && (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" // 폼 제출 버튼
              >
                수정
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDelete} // 삭제 핸들러 호출
              >
                삭제
              </Button>
            </>
          )}
          {/* 목록으로 이동 버튼 */}
          <Button
            variant="contained" // Material-UI Button 컴포넌트의 variant prop 사용
            color="primary"
            onClick={()=>navigate('/write/list.do')} // 목록 페이지로 이동
          >
            목록
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default WriteUpdate;