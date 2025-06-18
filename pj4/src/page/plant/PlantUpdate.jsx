import React, { useState, useEffect } from "react";
import { useCmDialog } from "../../cm/CmDialogUtil";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { FaCamera } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../css/plantCreate.css";
//훅
import {
  useUpdatePlantMutation,
  useDeletePlantMutation,
  useCreatePlantMutation,
  usePlantInfoQuery,
} from "../../features/plant/plantApi";
import Combo from "../combo/combo";
import DefaultImage from "../../image/default-plant.png";

const PlantUpdate = ({ mode = "create" }) => {
  const [searchParams] = useSearchParams();
  const plantId = searchParams.get("plantId"); // 식물아이디 plantId parm에 저장
  const isEdit = mode === "edit" || !!plantId;

  const navigate = useNavigate();

  const {
    data: fetchedPlantData,
    isSuccess,
  } = usePlantInfoQuery(plantId, {
    skip: !isEdit || !plantId,
  });

  const [plantName, setPlantName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [plantPurchaseDate, setPlantPurchaseDate] = useState(null);
  const [sunlightPreference, setSunlightPreference] = useState("");
  const [plantGrowthStatus, setPlantGrowthStatus] = useState("");
  const [imagePreview, setImagePreview] = useState(DefaultImage);
  const [fileInput, setFileInput] = useState("");

  const { showAlert } = useCmDialog();

  const [updatePlant] = useUpdatePlantMutation();
  const [deletePlant] = useDeletePlantMutation();
  const [createPlant] = useCreatePlantMutation();

  useEffect(() => {
    if (isEdit && isSuccess && fetchedPlantData?.data?.length > 0) {
      const plant = fetchedPlantData.data[0];

      setPlantName(plant.plantName || "");
      setPlantType(plant.plantType || "");
      setPlantPurchaseDate(
        plant.plantPurchaseDate ? dayjs(plant.plantPurchaseDate) : null
      );
      setSunlightPreference(plant.plantSunPreference || "");
      setPlantGrowthStatus(plant.plantGrowStatus || "");
      setImagePreview(null); // 이미지 기본 처리

      // DB에서 이미지 URL로 미리보기 세팅
      if (plant.fileId) {
        setImagePreview(
          `${process.env.REACT_APP_API_BASE_URL}/file/imgDown.do?fileId=${plant.fileId}`
        );
      } else {
        setImagePreview(DefaultImage);
      }
    }
  }, [isEdit, isSuccess, fetchedPlantData]);



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFileInput(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("plantId", plantId);
    formData.append("plantName", plantName);
    formData.append("plantType", plantType);
    if (plantPurchaseDate) {
      formData.append(
        "plantPurchaseDate",
        dayjs(plantPurchaseDate).format("YYYY-MM-DD")
      );
    }
    formData.append("plantSunPreference", sunlightPreference);
    formData.append("plantGrowStatus", plantGrowthStatus);

    // const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      formData.append("files", fileInput);
    }

    try {
      if (isEdit) {
        await updatePlant(formData).unwrap();
        showAlert("수정 성공");
        navigate(-1);
      } else {
        const result = await createPlant(formData).unwrap();
        showAlert("등록 성공");
        navigate(`/PlantUpdate/${result.plantId}`);
        return;
      }
      navigate("/PlantSunlighting.do");
    } catch (err) {
      showAlert(isEdit ? "수정 실패" : "등록 실패");
    }
  };

  const handleDelete = async () => {
    console.log(plantId);
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deletePlant({ plantId: plantId }).unwrap();
        showAlert("삭제 성공");
        navigate("/home.do?tab=N02");
      } catch {
        showAlert("삭제 실패");
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="plant-create-container">
        <div className="header-icon-container">
          <IconButton
            className="back-button"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            &lt;
          </IconButton>
        </div>

        <Stack spacing={2} className="plant-form-stack">
          <Box
            sx={{ textAlign: "center", position: "relative", marginBottom: 3 }}
          >
            <Avatar
              src={imagePreview}
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="imageUpload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  top: "65px",
                  left: "calc(50% + 15px)",
                  backgroundColor: "white",
                  boxShadow: 1,
                  width: 30,
                  height: 30,
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <FaCamera style={{ fontSize: "1rem" }} />
              </IconButton>
            </label>
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 이름</Typography>
            <TextField
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              variant="outlined"
              size="small"
              className="input-field-wrapper"
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 종류</Typography>
            <Combo
              groupId="PlantType"
              defaultValue={plantType} //기본값이 아니라 상태 변수 사용
              onSelectionChange = {setPlantType}
              sx={{ width: "200px" }}
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">식물 입수일</Typography>
            <DatePicker
              value={plantPurchaseDate}
              onChange={(newValue) => setPlantPurchaseDate(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  variant: "outlined",
                  size: "small",
                  className: "input-field-wrapper",
                },
              }}
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">햇빛/그늘 선호</Typography>
            <Combo
              groupId="SunType"
              defaultValue={sunlightPreference} //기본값이 아니라 상태 변수 사용
              onSelectionChange={setSunlightPreference}
              sx={{ width: "200px" }}
            />
          </Box>

          <Box className="form-row">
            <Typography className="label-text">성장 상태</Typography>
            <TextField
              value={plantGrowthStatus}
              onChange={(e) => setPlantGrowthStatus(e.target.value)}
              variant="outlined"
              size="small"
              className="input-field-wrapper"
            />
          </Box>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            {isEdit && <Button onClick={handleDelete}>삭제</Button>}
            <Button onClick={handleSubmit}>수정</Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default PlantUpdate;
