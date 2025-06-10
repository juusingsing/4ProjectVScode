import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { 
    useImgSaveMutation,
    useImgLoadQuery,
 } from '../../features/img/imgApi';

import { 
    usePetWalkSaveMutation,
    usePetImgSaveMutation,
    usePetImgLoadQuery,
 } from '../../features/pet/petWalkApi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

const WalkTracker = () => {
  const [menuOpen, setMenuOpen] = useState(false); // 드롭다운 열림 여부
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행 여부
  const [saveFirst, setSaveFirst] = useState(false); // 저장먼저하려고
  const [time, setTime] = useState(0); // 경과 시간 (초 단위)
  const [formattedTime, setFormattedTime] = useState('00:00:00');
  const [selectedItem, setSelectedItem] = useState('동물 병원 찾기'); // 현재 선택된 항목
  const menuItems = ['동물 병원 찾기', '꽃집 찾기', '공원 찾기']; // 고정된 전체 항목
  const timerRef = useRef(null); // 타이머 ID 저장

  // 구글맵 관련 상태
  const [googleMaps, setGoogleMaps] = useState(null);
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(18); // 기본 줌 레벨
  const [markerPosition, setMarkerPosition] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null); // 위치 정확도 저장
  const [mapInstance, setMapInstance] = useState(null);

  const [nearbyMarkers, setNearbyMarkers] = useState([]);
  const locationRetryRef = useRef(null); // 위치 재요청 타이머 ID

  // 카메라 관련
  const [isUploading, setIsUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imgSave] = usePetImgSaveMutation();
  const { data: images = [], refetch } = usePetImgLoadQuery();

  const [petWalkSave] = usePetWalkSaveMutation();


  // 공통 버튼 스타일
  const buttonBaseStyle = {
    backgroundColor: '#6a8f6b',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    height: '32px',
    width: '120px',
    textAlign: 'left',
  };

  // 타이머 작동 로직
  useEffect(() => {
    clearInterval(timerRef.current);
    if (isRunning) {
        timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // 초(seconds)가 변할 때마다 formattedTime 업데이트
  useEffect(() => {
    setFormattedTime(formatTime(time));
  }, [time]);

  // 타이머 시작시 시작위치저장
  useEffect(() => {
    if (isRunning && markerPosition) {
        setStartLocation(markerPosition);
    }
  }, [isRunning, markerPosition]);

  // 타이머 종료시 종료위치저장
  useEffect(() => {
    if (!isRunning && markerPosition) {
        setEndLocation(markerPosition);
    }
  }, [isRunning, markerPosition, saveFirst]);

  // 산책종료시 시작/종료 위치 보이기
  useEffect(() => {
  if (mapInstance && startLocation && endLocation) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(startLocation);
        bounds.extend(endLocation);
        mapInstance.fitBounds(bounds); // 두 위치를 포함하도록 줌 자동 조정
    }
  }, [mapInstance, startLocation, endLocation]);


  // 시:분:초 형식으로 변환
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleWalkAction = async (action) => {
    console.log(action);

    if(action === '종료'){
        alert("walksave실행완료");
        console.log(formatTime(time));

        try{
            const formData = new FormData();
            formData.append('animalId', 1);   // << 동물아이디 변수 넘기면됨
            formData.append('walkTime', formatTime(time));

            const result = await petWalkSave(formData).unwrap();
            console.log('산책정보 저장 성공', result);
            setTime(0);
            setSaveFirst(!saveFirst);
            

        
        } catch (error) {
            console.error('산책정보 저장 실패:', error);
                if (error.data) {
                console.error('서버 응답:', error.data);
                }
            alert('산책정보 저장 중 오류가 발생했습니다.');
        }
    }

  }

  // 드롭다운 항목 클릭 시 선택 항목 변경
  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
    setMenuOpen(false); // 선택 후 드롭다운 닫기

    if (center && window.Android?.getNearbyPlaces) {
        const { lat, lng } = center;
        const typeMap = {
        '동물 병원 찾기': 'veterinary_care',
        '꽃집 찾기': 'florist',
        '공원 찾기': 'park'
        };
        const placeType = typeMap[item];
        try {
        window.Android.getNearbyPlaces(lat, lng, 5000, placeType); // 1000 = 반경 1km
        } catch (e) {
        console.error("getNearbyPlaces 호출 실패:", e);
        }
    }
  };

  //주변건물찾기
  useEffect(() => {
    window.onNearbyPlaces = (placesJson) => {
        try {
        const data = JSON.parse(placesJson);
        if (data.status === 'OK') {
            const newMarkers = data.results.map(place => ({
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            name: place.name
            }));
            setNearbyMarkers(newMarkers);
        } else {
            console.warn("Places API 실패:", data.status);
            setNearbyMarkers([]);
        }
        } catch (e) {
        console.error("onNearbyPlaces 파싱 오류:", e);
        setNearbyMarkers([]);
        }
    };
    }, []);

  // 현재 선택된 항목을 제외한 드롭다운 메뉴 구성
  const dropdownItems = menuItems.filter(item => item !== selectedItem);

  // 위치 요청 함수
  const requestLocation = () => {
    if (window.Android?.receiveMessage) {
      window.Android.receiveMessage(JSON.stringify({ type: "GET_LOCATION" }));
    }
  };

  // 처음 렌더링 시 실행
    useEffect(() => {
        firstMapping();
        return () => {
            if (locationRetryRef.current) {
            clearInterval(locationRetryRef.current);
            }
        };
    }, []);

    const firstMapping = () => {

        window.onLocationReceived = (locationJson) => {
            try {
            const result = JSON.parse(locationJson);
            if (!result.error && result.lat && result.lng) {
                const pos = { lat: result.lat, lng: result.lng };
                setCenter(pos);
                setMarkerPosition(pos);
                setZoom(10); // 다른 값으로 임시 변경
                setTimeout(() => setZoom(18), 100); // 다시 18로 설정
                setAccuracy(result.accuracy || null);

                if (locationRetryRef.current) {
                clearInterval(locationRetryRef.current);
                locationRetryRef.current = null;
                }
            } else {
                alert("위치 정보를 가져올 수 없습니다. GPS를 확인해주세요.");
                setAccuracy(null);
            }
            } catch (e) {
            console.error("콜백 파싱 오류", e);
            setAccuracy(null);
            }
        };

        requestLocation();

        const maxRetry = 10;
        let retryCount = 0;

        locationRetryRef.current = setInterval(() => {
            if (retryCount >= maxRetry) {
                clearInterval(locationRetryRef.current);
                alert('위치 정보를 가져올 수 없습니다. GPS 상태를 확인해주세요.');
                return;
            }
            retryCount++;
            requestLocation();
        }, 2000);
    };

    // 버튼 클릭 핸들러 예시
    const onClickCurrentLocation = () => {
        if (!mapInstance || !markerPosition) {
            console.warn('Map or markerPosition is not ready');
            return;
        }

        mapInstance.panTo(markerPosition);
        setZoom(10); // 다른 값으로 임시 변경
        setTimeout(() => setZoom(18), 100); // 다시 18로 설정
        // firstMapping();
    };


    // 카메라기능
    useEffect(() => {
        // Android에서 사진을 받는 함수 등록
        window.onCameraImageReceived = (base64Image) => {
            setImageSrc(base64Image);
            uploadImageToServer(base64Image);  // 서버로 업로드
        };

        refetch(); // 초기 이미지 목록 로드

            // 컴포넌트 언마운트 시 함수 해제 (메모리 누수 방지)
        return () => {
            window.onCameraImageReceived = null;
        };

    }, []);
    

    // 카메라 열기 함수
    const openCamera = () => {
        // 안드로이드 WebView의 JavaScript 인터페이스가 있을 경우에만 호출
        if (window.Android && typeof window.Android.openCamera === 'function') {
            window.Android.openCamera(); // 안드로이드 함수 호출
        } else {
            alert('Android 인터페이스를 사용할 수 없습니다.');
        }
    };

    // 서버로 Base64 이미지 업로드
    const uploadImageToServer = async (base64Image) => {
        if (isUploading) return; // ✅ 중복 방지
        setIsUploading(true);

        try {
            // base64 → Blob
            const blob = base64ToBlob(base64Image);

            // Blob → File 객체로 변환 (선택 사항)
            const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('files', file); // 서버에서 "files"라는 key로 받을 것
            formData.append('postFileCategory', "WAL"); //  << 산책 카테고리
            formData.append('postFileKey', 1); //  << 고유 동물아이디 OR WALKID 변수 넘기면됨

            const result = await imgSave(formData).unwrap();
            console.log('이미지 업로드 성공:', result);

            // ✅ 업로드 성공 후 서버에서 이미지 목록 다시 가져오기
            refetch();
            
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
                if (error.data) {
                console.error('서버 응답:', error.data);
                }
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false); // ✅ 업로드 상태 해제
        }
    };

    // Base64 → Blob 변환 함수
    const base64ToBlob = (base64Data, contentType = 'image/jpeg/jpg') => {
    const byteCharacters = atob(base64Data.split(',')[1]); // 헤더 제거 후 디코딩
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
    };


  return (
    <>
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '20px' }}>{'←'}</button>
        <h2 style={{ flex: 1, textAlign: 'center', margin: 0 }}>산책 기록</h2>
        <button onClick={openCamera} style={{ background: 'none', border: 'none', fontSize: '20px' }}>📷</button>
      </div>

      {/* 드롭다운 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

        {/* ⬅️ 내 위치로 이동 버튼 */}
        <button
            onClick={onClickCurrentLocation}
            style={{
            backgroundColor: '#6a8f6b',
            color: 'white',
            padding: '1px 5px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            height: '32px',
            width: '60px',
            textAlign: 'center',
            }}
        >
            📍내위치
        </button>


        <div style={{ position: 'relative' }}>
          {/* 현재 선택된 항목 버튼 */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={buttonBaseStyle}>
            {selectedItem}
          </button>

          {/* 드롭다운 메뉴 */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '120px',
              maxHeight: menuOpen ? '300px' : '0px',
              opacity: menuOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              backgroundColor: '#6a8f6b',
              borderRadius: '8px',
              padding: menuOpen ? '4px 0' : '0',
              boxShadow: menuOpen ? '0px 2px 5px rgba(0,0,0,0.1)' : 'none',
              zIndex: 10
            }}
          >
            {dropdownItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item)}
                style={buttonBaseStyle}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div>
        <div style={{ width: '100%', height: '300px' }}>
          {center ? (
            <LoadScript googleMapsApiKey="AIzaSyBkqvUbxVClcx6PG5TGNx035c9_SZWt_-w">
              <GoogleMap
                center={center}
                zoom={zoom}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                onLoad={(map) => {
                    setMapInstance(map);
                    setGoogleMaps(window.google.maps); // ✅ 안전하게 저장
                }}
                options={{
                    draggable: true,                   // 단, 한 손가락 이동만 허용 (이 설정은 WebView에 좌우됨)
                    zoomControl: false,   //우측 하단에 보이는 지도 확대/축소 버튼 UI를 비활성화함.
                    scrollwheel: false,   //데스크톱에서 마우스 휠로 줌 조정하는 기능을 비활성화함
                    disableDoubleClickZoom: true,   // 더블클릭으로 줌   true = 더블클릭으로줌X
                    gestureHandling: "greedy"  // ← 핵심: 한 손가락으로 이동 가능하게 만듦
                }}
              >
                {/* 현재내위치 */}
                {markerPosition && googleMaps && (
                    <Marker
                        position={markerPosition}
                        icon={{
                        path: googleMaps.SymbolPath.CIRCLE,
                        fillColor: 'black',
                        fillOpacity: 1,
                        strokeColor: 'black',
                        strokeWeight: 1,
                        scale: 6,
                        }}
                    />
                )}
                {/* 시작위치 */}
                {startLocation && (
                    <Marker
                        position={startLocation}
                        label="시작 위치"
                    />
                )}
                {/* 종료위치 */}
                {endLocation && (
                    <Marker
                        position={endLocation}
                        label="종료 위치"
                    />
                )}
                {/* 주변건물찾기 */}
                {nearbyMarkers.map((place, idx) => (
                    <Marker
                        key={idx}
                        position={{ lat: place.lat, lng: place.lng }}
                        label={place.name.length > 5 ? place.name.slice(0, 5) + "…" : place.name}
                        icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        path: googleMaps.SymbolPath.CIRCLE,
                        fillColor: 'black',
                        fillOpacity: 1,
                        strokeColor: 'black',
                        strokeWeight: 1,
                        scale: 6,
                        }}
                    />
                ))}
              </GoogleMap>
            </LoadScript>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>📍 내 위치를 찾는 중...</div>
          )}
        </div>
      </div>

      {/* 위치 정확도 표시 */}
      <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px', color: '#555' }}>
        위치 정확도: {accuracy !== null ? `${accuracy} m` : '-'}
      </div>

      {/* 시작/종료 버튼 */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => {
            const action = isRunning ? '종료' : '시작';
            console.log(`${action} 버튼 클릭`);
            handleWalkAction(action); // 예: 백엔드 전송 등
            setIsRunning(!isRunning)
        
        }}
          style={{
            backgroundColor: '#6a8f6b',
            color: 'white',
            padding: '10px 40px',
            fontSize: '18px',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          {isRunning ? '종료' : '시작'}
        </button>
      </div>

      {/* 스톱워치 */}
      <div style={{ textAlign: 'center', fontSize: '28px', fontFamily: 'monospace' }}>
        {formattedTime}
      </div>
    </div>

    <div style={{ width: '300px', padding: '20px 0', border: '1px solid red' }}>
        <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}  // 한 번에 하나씩 슬라이드
        >
        {images.map((image, index) => (
            <SwiperSlide key={index}> 

            <img
                // src={`http://192.168.0.32:8081${image.postFilePath.replace(/\\/g, '/')}`}
                src={`http://192.168.0.32:8081${image.postFilePath}`}
                alt={`img-${index}`}
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
            </SwiperSlide>
            
        ))}
        </Swiper>
    </div>

    </>


  );
};

export default WalkTracker;
