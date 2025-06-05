

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import { useWriteViewQuery } from '../../features/write/writeApi'; 
import CmComment from '../../cm/CmComment';

const WriteView = () =>{
     const [searchParams] = useSearchParams();
      const writingId = searchParams.get('writingId'); 
      
      const user = useSelector((state) => state.user.user); // 로그인된 사용자 정보
      const { data, isLoading, error, isSuccess, refetch } = useWriteViewQuery({ writingId: writingId });
    
      const [write, setBoard] = useState(null);
      const navigate = useNavigate();
    
      useEffect(() => {
        if (isSuccess) {
          setBoard(data?.data);
        }
      }, [isSuccess, data]);
    return (
        <Box
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            my: 4,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">게시글을 불러오는 데 실패했습니다.</Alert>
          ) : write ? (
            <>
              <Typography variant="h4" gutterBottom>
                {write.title}
              </Typography>
    
              <Box display="flex" justifyContent="space-between" color="text.secondary" fontSize={14}>
                <span>작성자: {write.createId}</span>
                <span>{write.createDt}</span>
              </Box>
    
              <Divider sx={{ my: 2 }} />
    
              <Paper elevation={2} sx={{ p: 2, minHeight: '200px', maxHeight: '500px', overflow: 'auto' }}>
                <div dangerouslySetInnerHTML={{ __html: write.content }} />
              </Paper>
    
              {write.postFiles && write.postFiles.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    첨부파일
                  </Typography>
                  {write.postFiles.map((file) => (
                    <Typography key={file.fileId}>
                      <a
                        href={`${process.env.REACT_APP_API_BASE_URL}/file/down.do?fileId=${file.fileId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.fileName}
                      </a>
                    </Typography>
                  ))}
                </Box>
              )}
              <Box display="flex" gap={1} mt={2}>
                {user?.usersId === write?.createId && (
                  
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/write/update.do?id=${write.writingId}`, { state: { reset: true } })}
                    >
                      수정
                    </Button>
                  
                )}
    
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/write/list.do')}
                >
                  목록으로
                </Button>
              </Box>
              <CmComment
                comments={data?.data?.comments || []}
                user={user}
                writingId={write.writingId}
                refetchComments={refetch}  
              />
            </>
          ) : null}
        </Box>
      );
}

export default WriteView;