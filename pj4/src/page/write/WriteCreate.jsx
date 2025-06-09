import React, { useRef, useState, useEffect } from "react";
import CmTinyMCEEditor from "../../cm/CmTinyMCEEditor";
import { useWriteCreateMutation } from "../../features/write/writeApi";
import { CmUtil } from "../../cm/CmUtil";
import { useCmDialog } from "../../cm/CmDialogUtil";
import { useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import Combo from "../combo/combo";
import back from "../../image/back.png";
import ToggleCombo from "../../page/combo/ToggleCombo";
import image from "../../image/imageAdd.png";
import imgDelete from "../../image/imageDelete.png";

const WriteCreate = () => {
  const user = useSelector((state) => state.user.user);
  const editorRef = useRef();
  const writingTitleRef = useRef();
  const [editor, setEditor] = useState("");
  const [Title, setWritingTitle] = useState("");
  const [writingSortation, setWritingSortation] = useState(""); // 선택된 게시판 종류
  const [writingCategory, setWritingCategory] = useState(""); // 선택된 카테고리
  const [writeCreate] = useWriteCreateMutation();
  const { showAlert } = useCmDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const [files, setFiles] = useState([]);
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  // ToggleCombo에서 값이 변경될 때 호출될 핸들러
  const handleWritingSortationChange = (newValue) => {
    setWritingSortation(newValue);
  };

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const handleFileDelete = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortationParam = params.get("sortation");
    const categoryParam = params.get("category");

    if (sortationParam) {
      setWritingSortation(sortationParam);
    }
    if (categoryParam) {
      setWritingCategory(categoryParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentText = editorRef.current?.getContent({ format: "text" });
    const contentHtml = editorRef.current?.getContent();

    // 제목이 비어있는지 체크
    if (CmUtil.isEmpty(Title)) {
      showAlert("제목을 입력해주세요.");
      writingTitleRef.current?.focus();
      return;
    }

    // 제목 길이 체크
    if (!CmUtil.maxLength(Title, 100)) {
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
      showAlert("내용은 최대 2000자까지 입력할 수 있습니다.", () =>
        editorRef.current?.focus()
      );
      return;
    }

    const formData = new FormData();
    formData.append("writingTitle", Title);
    formData.append("writingContent", contentHtml);
    formData.append("writingSortation", writingSortation); // WRITING_SORTATION 추가
    formData.append("writingCategory", writingCategory); // WRITING_CATEGORY 추가
    formData.append("writingViewCount", 0);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await writeCreate(formData).unwrap();
    if (res.success) {
      showAlert("게시글 생성 성공! 게시판 목록으로 이동합니다.", () =>
        navigate("/write/list.do")
      );
    } else {
      showAlert("게시글 생성 실패 했습니다.");
    }
  };


  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: (acceptedFiles) => {
  //     setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  //   },
  //   multiple: true,
  //   maxSize: 10 * 1024 * 1024,
  // });

  // const handleRemoveFile = (indexToRemove) => {
  //   setUploadedFiles((prevFiles) =>
  //     prevFiles.filter((_, index) => index !== indexToRemove)
  //   );
  // };

  return (
    <Box sx={{ maxWidth: 360, width: "100%", mx: "auto", p: 3 }}>
      <Button
        onClick={() => window.history.back()}
        // variant="contained"
        sx={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "10px",
          height: "35px",
          minWidth: "0",
          width: "35px",
          "&:hover": {
            backgroundColor: "#363636",
          },
          backgroundColor: "rgba(54, 54, 54, 0.4)",
        }}
      >
        <img src={back} alt="" sx={{ pl: "2px" }}></img>
      </Button>
      {/* onSelectionChange prop을 통해 Combo에서 선택된 값을 받아 writingSortation 상태에 업데이트 */}
      <ToggleCombo
        onToggleChange={handleWritingSortationChange}
        defaultValue={writingSortation}
      />
      <Combo
        groupId="Community"
        onSelectionChange={setWritingCategory}
        defaultValue={writingCategory}
      />

      <Typography variant="h5" gutterBottom>
        게시글 작성
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        <Box mb={3}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="제목"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            inputRef={writingTitleRef}
            value={Title}
            onChange={(e) => setWritingTitle(e.target.value)}
          />
        </Box>

        {/* 사진 리스트 */}
        <Box
          m={2}
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto", //가로 스크롤
            gap: 2,
            padding: 1,
            "&::-webkit-scrollbar": {
              height: "1px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "4px",
            },
          }}
        >
          {/* 이미지 미리보기 리스트 */}
          {files.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                minWidth: 140,
                height: 140,
                borderRadius: "5px",
                overflow: "hidden",
                backgroundColor: "#ccc",
                scrollSnapAlign: "start",
                flexShrink: 0,
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <IconButton
                onClick={() => handleFileDelete(index)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 0,
                  "&:hover": {
                    backgroundColor: "rgba(255, 100, 100, 0.8)",
                  },
                }}
              >
                <img
                  src={imgDelete}
                  alt="삭제"
                  style={{ width: 20, height: 20 }}
                />
              </IconButton>
            </Box>
          ))}

          {/* 사진 추가 버튼 */}
          <label htmlFor="fileInput">
            <Button
              component="span"
              sx={{
                minWidth: 0,
                width: 140,
                height: 140,
                borderRadius: "5px",
                backgroundColor: "rgba(54, 54, 54, 0.2)",
                "&:hover": { backgroundColor: "#363636" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={image} alt="add" />
            </Button>
          </label>

          <input
            id="fileInput"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
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

        <Box display="flex" gap={1} mt={2}>
          {user && (
            <Button type="submit" variant="contained" color="primary">
              등록
            </Button>
          )}
          {/* <button
            variant="contained"
            color="primary"
            onClick={() => navigate("/write/list/do")}
          >
            목록
          </button> */}
        </Box>
      </Box>
    </Box>
  );
};
export default WriteCreate;

{
  /* <Box mb={3}>
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
</Box> */
}
