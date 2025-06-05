


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

const WriteUpdate = () => {
  const user = useSelector((state)=>state.user.user);
  const editorRef = useRef();
  const titleRef = useRef();
  const [editor, setEditor] = useState("");
  const [title, setTitle] = useState("");


  const [writeUpdate] = useWriteUpdateMutation();
  const [writeDelete] = useWriteDeleteMutation();
  const {data } = useWriteViewQuery({writeId : id});
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [write, setWrite] = useState(null);

  const [existingFiles, setExistingFiles] = useState("");
  const [remainingFileIds, setRemainingFileIds] = useState("");

    useEffect(() => {
    if (data?.success) {
        console.log(data.data);
        setWrite(data.data);
        setTitle(data.data.title);
        setEditor(data.data.content);
        setExistingFiles(data.data.postFiles || []);
        setRemainingFileIds(data.data.postFiles?.map(file => file.fileId) || []);
    }
    }, [data]);

  const {showAlert, showConfirm} = useCmDialog();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentText = editorRef.current?.getContent({ format: 'text' });
    const contentHtml = editorRef.current?.getContent();
  
    // 제목이 비어있는지 체크
    if (CmUtil.isEmpty(title)) {
      showAlert("제목을 입력해주세요.");
      titleRef.current?.focus();
      return;
    }
  
    // 제목 길이 체크
    if (!CmUtil.maxLength(title, 100)) {
      showAlert("제목은 최대 100자까지 입력할 수 있습니다.");
      titleRef.current?.focus();
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
   formData.append("title", title);
   formData.append("content", contentHtml);
   formData.append("viewCount", 0);

   formData.append("remainingFileIds", remainingFileIds.join(","));
   
   uploadedFiles.forEach((file) => {
   formData.append("files", file);
    });

   const res = await writeUpdate(formData).unwrap();
   if(res.success){
    showAlert("게시글 수정 성공! 게시판 목록으로 이동합니다.", ()=>navigate("/write/list.do"));

   } else {
    showAlert("게시글 수정 실패 했습니다.");
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

    const handleRemoveExistingFile = (fileId) => {
        setRemainingFileIds((prevIds) => prevIds.filter((id) => id !== fileId));
    };
    
    const handleDelete = async () => {
        showConfirm("정말 삭제하시겠습니까?", async () => {
            const res = await writeDelete({ writeId: id }).unwrap();
            if (res.success) {
                showAlert("게시글 삭제 성공! 게시판 목록으로 이동합니다.", () => navigate("/write/list.do"));
            } else {
                showAlert("게시글 삭제 실패했습니다.");
            }
        });
    };

   

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
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
            inputRef={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
         {existingFiles && (
                <Box mb={3}>
                  <Typography gutterBottom>기존 파일</Typography>
                  <List>
                    {existingFiles.map((file) => (
                      remainingFileIds.includes(file.fileId) && (
                        <ListItem
                          key={file.fileId}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => handleRemoveExistingFile(file.fileId)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          }
                        >
                            <ListItemText
                                primary={
                                <a href={`${process.env.REACT_APP_API_BASE_URL}/api/file/down.do?fileId=${file.fileId}`} 
                                target="_blank" 
                                rel="noopener noreferrer">
                                {file.fileName}</a>
                                }
                            />
                        </ListItem>
                      )
                    ))}
                  </List>
                </Box>
                )}
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
             {user?.userId === write?.createId && (
                        <>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit"
                        >
                          수정
                        </Button>

                        <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={handleDelete}
                        >
                          삭제
                        </Button>
                        </>
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
  export default WriteUpdate;