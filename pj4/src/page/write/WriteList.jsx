import { TextField, Button, Box, InputAdornment, IconButton } from "@mui/material"; 
import SearchIcon from '@mui/icons-material/Search'; // 돋보기 아이콘 임포트
import ClearIcon from '@mui/icons-material/Clear'; // X 아이콘 임포트
import {CmUtil} from '../../cm/CmUtil'; 
import React, { useEffect, useRef, useState } from 'react'; 
import {useNavigate, Link} from 'react-router-dom'; 
import {useWriteListQuery} from '../../features/write/writeApi'; 
import {DataGrid} from '@mui/x-data-grid'; 
import {Pagination, Typography} from '@mui/material'; 
import { useSelector } from 'react-redux'; 
import { useCmDialog } from '../../cm/CmDialogUtil'; 
import add from '../../image/add.png' ; 
import pet from '../../image/animalFootprintWhite.png'; 
import plant from '../../image/plantWhite.png'; 
import '../../css/writeList.css'; 
import ToggleCombo from '../../page/combo/ToggleCombo';

const WriteList = () => {
    // 검색 조건을 관리하는 상태
    const [search, setSearch] = useState({
        searchText: '', 
        startDate: CmUtil.addDate(CmUtil.getToday(), { months: -3 }), 
        endDate: CmUtil.getToday()
    });

    const user = useSelector((state) => state.user.user);
    const startDateRef = useRef(null); 
    const endDateRef = useRef(null);
    const searchTextRef = useRef(null);

    // 게시글 분류(동식물))를 관리하는 상태. 초기값 동물
    const [writingSortation, setwritingSortation] = useState('N01');
    const [writingCategory, setWritingCategory] =useState('C02');
    const [page, setPage ] = useState(1)
    const [sort, setSort] = useState({ field: 'create_dt', order: 'desc' }); 

    const { data, isLoading, refetch } = useWriteListQuery({
        ...search,
        page, 
        sortField: sort.field,
        sortOrder: sort.order,
        writingSortation: writingSortation ,
        writingCategory:writingCategory
    });

    // DataGrid의 정렬 모델이 변경될 때 호출되는 핸들러
    const handleSortChange = (model) => {
        const { field, sort: order } = model[0]; // 정렬 필드와 순서 추출
        const colDef = columns.find((col) => col.field === field);
        const sortField = colDef?.dbName || field;

        console.log('정렬 필드:', sortField, '| 정렬 방향:', order); 

        setSort({ field: sortField, order: order }); 
    };

    const { showAlert } = useCmDialog();

    const rowsWithId = (data?.data?.list || []).map((row) => ({
        ...row, 
        id: row.writingId, 
    }));

    // 검색 버튼 클릭 시 호출되는 핸들러
    const handleSearch = () => {
        const { startDate, endDate } = search; // 현재 검색 상태에서 시작일과 종료일 가져오기

        if (startDate && !CmUtil.isValidDate(startDate)) {
            showAlert("시작일 형식이 잘못되었습니다 (YYYY-MM-DD).");
            startDateRef.current?.focus(); // 해당 입력 필드로 포커스 이동
            return; // 함수 실행 중단
        }

        if (endDate && !CmUtil.isValidDate(endDate)) {
            showAlert("종료일 형식이 잘못되었습니다 (YYYY-MM-DD).");
            endDateRef.current?.focus();
            return;
        }

        // 날짜 범위 유효성 검사 (시작일이 종료일보다 늦지 않도록)
        if (!CmUtil.isDateRangeValid(startDate, endDate)) {
            showAlert("시작일은 종료일보다 빠르거나 같아야 합니다.");
            startDateRef.current?.focus();
            return;
        }

        setPage(1); // 검색 조건 변경 시 페이지를 1로 초기화
        refetch(); // RTK Query 데이터 다시 가져오기 (변경된 검색 조건으로)
    };

      // 검색어 지우기 핸들러
    const handleClearSearch = () => {
        setSearch({ ...search, searchText: '' });
        // 필요하다면 검색어도 초기화 후 바로 검색을 다시 실행할 수 있습니다.
        // handleSearch();
    };

    const navigate = useNavigate(); 

    useEffect(() => {
        refetch();
    }, [refetch, page, writingSortation, writingCategory]); // 의존성 배열: 이 값들이 변경될 때마다 이펙트 실행

    // DataGrid의 컬럼 정의
    const columns = [
        { field: 'rn', headerName: '번호', width: 90, sortable: false }, 
        { field: 'writingTitle', headerName: '제목', width: 300, dbName: 'writing_title' }, 
        { field: 'createId', headerName: '작성자', width: 150, dbName: 'create_id' }, 
        { field: 'writingViewCount', headerName: '조회수', width: 100, dbName: 'writing_view_count' }, 
        { field: 'createDt', headerName: '작성일', width: 180, dbName: 'create_dt' }, 
        {
            field: 'action',
            headerName: '상세보기', 
            width: 30, // 컬럼 너비
            
            renderCell: (params) => (
              
                <Button onClick={(e) => navigate(`/write/view.do?writingId=${params.row.writingId}`)}>보기</Button>
            ),
            sortable: false, // 정렬 불가
        },
    ];

     // ToggleCombo에서 값이 변경될 때 호출될 핸들러
    const handleWritingSortationChange = (newValue) => {
        setwritingSortation(newValue);
    };
    // 토글 버튼 상태를 관리하는 상태 (true: 동물(N01), false: 식물(N02))
    // const [isOn, setIsOn] = useState(true);

    // const handleToggle = () => {
    //     const newState = !isOn; // 현재 상태를 반전
    //     setIsOn(newState); // 토글 상태 업데이트
    //     // writingSortation 상태를 새로운 토글 상태에 맞춰 업데이트
    //     // true이면 'N01'(동물), false이면 'N02'(식물)로 설정
    //     setwritingSortation(newState ? "N01" : "N02" );
    // };

    // 탭 메뉴 활성 상태를 관리하는 상태. 초기값은 0번 인덱스 (첫 번째 탭)
    const [activeTab, setActiveTab] = useState(0);

    // 탭 메뉴의 데이터 (이름과 연결될 링크)
    const tabs = [
        { name: "일상", code: "C02"},
        { name: "정보", code: "C01"},
        { name: "질문", code: "C03"}
    ];
    
    return (
        <Box sx={{ maxWidth: 360, width: '100%', mx: 'auto', p: 3 }}>
            <Box className="write-top-section">
                <Typography variant="h4" >
                    커뮤니티
                </Typography>
                <Box className='write-top-section-button'>
                    {user &&
                        <Button onClick={() => navigate(`/write/create.do?sortation=${writingSortation}&category=${writingCategory}`)} className="write-add-button"
                            sx={{ p: 0, width: '38px', minWidth: '38px' }}>
                            <img src={add} alt="" className="write-add"></img>
                        </Button>}
                  <ToggleCombo onToggleChange={handleWritingSortationChange} defaultValue={writingSortation} />
                </Box>
            </Box>
            <Box className="tab_wrapper">
                {tabs.map((tab, index) => (
                        <button 
                        key={index}
                        className={`tab_buttons ${activeTab === index ? "active" : ""}`}
                        onClick ={() => {
                          setActiveTab(index);
                          setWritingCategory(tab.code);
                        }

                        }>
                            <div className="under_line">{tab.name}</div>
                        </button>
                ))}
            </Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <TextField
                    label="검색어"
                    inputRef={searchTextRef}
                    value={search.searchText}
                    onChange={(e) => setSearch({ ...search, searchText: e.target.value })}
                    onKeyDown={(e) =>{
                      if(e.key ==='Enter') handleSearch();
                    } }
                    fullWidth
                    InputProps ={{
                        endAdornment:(
                            <InputAdornment position="end">
                                {search.searchText&&(
                                    <IconButton onClick={handleClearSearch} edge="end" size="small">
                                        <ClearIcon/>
                                    </IconButton>
                            )}
                            <IconButton onClick={handleSearch} edge="end" size="small">
                                <SearchIcon></SearchIcon>
                            </IconButton>
    
                            </InputAdornment>
                        )
                    }}
                />

            </Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <TextField
                    label="시작일" 
                    type="date" 
                    value={search.startDate} 
                    inputRef={startDateRef} 
                    onChange={(e) => setSearch({ ...search, startDate: e.target.value })} 
                />
                <TextField
                    label="종료일" 
                    type="date" 
                    value={search.endDate} 
                    inputRef={endDateRef} 
                    onChange={(e) => setSearch({ ...search, endDate: e.target.value })} 
                />
            </Box>
            <DataGrid
                rows={rowsWithId}
                columns={columns}
                disableColumnFilter={true}
                disableColumnMenu={true}
                hideFooter={true}
                loading={isLoading}

                sortingMode = 'server'
                sortingOrder={['desc', 'asc']} 
                onSortModelChange={handleSortChange}
            />
            <Box sx={{mt:2, width:'100%',display:'flex',justifyContent:'center'}}> 
                <Pagination 
                    variant="outlined"
                    shape="rounded"
                    
                    count={data?.data?.totalPages || 1} 
                    page={page}
                    showFirstButton 
                    showLastButton 
                    onChange={(e,value) => setPage(value)}
                />
            </Box>
        </Box>
    );
};

export default WriteList;