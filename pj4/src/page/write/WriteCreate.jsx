


import React, { useRef, useState } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import { useWriteCreateMutation } from "../../features/write/writeApi";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Box, TextField, Typography, List, ListItem, ListItemText, IconButton, Paper, Button, FormControl, MenuItem, Select, InputLabel} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from "react-redux";
import Combo from"../../page/combo/combo";

const WriteCreate = () => {
 
  const user = useSelector((state)=>state.user.user);
  const editorRef = useRef();
  const writingTitleRef = useRef();
  const [editor, setEditor] = useState("");
  const [writingTitle, setWritingTitle] = useState("");
  const [writingSortation, setWritingSortation] = useState(''); // 선택된 게시판 종류
  const [writingCategory, setWritingCategory] = useState('');  // 선택된 카테고리
  const [writeCreate] = useWriteCreateMutation();
  const {showAlert} = useCmDialog();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentText = editorRef.current?.getContent({ format: 'text' });
    const contentHtml = editorRef.current?.getContent();
  
    // 제목이 비어있는지 체크
    if (CmUtil.isEmpty(writingTitle)) {
      showAlert("제목을 입력해주세요.");
      writingTitleRef.current?.focus();
      return;
    }
  
    // 제목 길이 체크
    if (!CmUtil.maxLength(writingTitle, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      writingTitleRef.current?.focus();
      return;
    }
  
    // 내용이 비어있는지 체크
    if (CmUtil.isEmpty(contentText)) {
      showAlert("내용을 입력해주세요.", () => editorRef.current?.focus());
      return;
    }
  
    // 내용 길이 체크
    if (!CmUtil.maxLength(contentText, 2000)) {
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.", () => editorRef.current?.focus());
      return;

      
    }
 
   
   const formData = new FormData();
   formData.append("writingTitle", writingTitle);
   formData.append("writingContent", contentHtml);
   formData.append("writingSortation", writingSortation); // WRITING_SORTATION 추가
   formData.append("writingCategory", writingCategory);   // WRITING_CATEGORY 추가
   formData.append("writingViewCount", 0);
   
   uploadedFiles.forEach((file) => {
   formData.append("files", file);
    });

   const res = await writeCreate(formData).unwrap();
   if(res.success){
    showAlert("게시글 생성 성공! 게시판 목록으로 이동합니다.", ()=>navigate("/write/list.do"));

   } else {
    showAlert("게시글 생성 실패 했습니다.");
   }
   };

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
    });

    const handleRemoveFile = (indexToRemove)=>{
        setUploadedFiles((prevFiles) =>
         prevFiles.filter((_, index)=>index!==indexToRemove)
     );
    };

   

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            {/* onSelectionChange prop을 통해 Combo에서 선택된 값을 받아 writingSortation 상태에 업데이트 */}
            <Combo
                groupId="EntityType" 
                onSelectionChange={setWritingSortation}
            />
            {/* onSelectionChange prop을 통해 Combo에서 선택된 값을 받아 writingCategory 상태에 업데이트 */}
            <Combo
                groupId="Community" 
                onSelectionChange={setWritingCategory}
            />

      <Typography variant="h5" gutterBottom>
        게시글 작성
      </Typography>
      <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <Box mb={3}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="제목"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            inputRef={writingTitleRef}
            value={writingTitle}
            onChange={(e) => setWritingTitle(e.target.value)}
          />
        </Box>
        <Box mb={3}>
          <Typography gutterBottom>내용</Typography>
          <CmTinyMCEEditor
            value={editor}
            setValue={setEditor}
            ref={editorRef}
            max={2000}
          />
        </Box>
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
            key={index}
            secondaryAction={
            <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
            <DeleteIcon color="error" />
            </IconButton>
            }
            >
            <ListItemText primary={file.name} />
            </ListItem>
           ))}
        </List>
        )}
        </Box>
        <Box display="flex" gap={1} mt={2}>
            {user && (
                <Button
                type="submit"
                variant="contained"
                color="primary"
                >
                등록
                </Button>
            )}
            <button
            variant="contained"
            color="primary"
            onClick={()=>navigate('/write/list/do')}
            >
            목록
            </button>
        </Box>
                
      </Box>
    </Box>
  );
};
  export default WriteCreate;