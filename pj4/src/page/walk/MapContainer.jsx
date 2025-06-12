// MapContainer.jsx

import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const mapOptions = {
  draggable: true,
  zoomControl: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  gestureHandling: "greedy"
};

const MapContainer = React.memo(({ center, zoom, markerPosition, startLocation, endLocation, nearbyMarkers, onMapLoad }) => {
  const mapRef = useRef(null);

  // map instance 저장
  const handleLoad = (map) => {
    mapRef.current = map;
    if (onMapLoad) {
      onMapLoad(map); // 외부로 전달
    }
  };

  // center가 바뀔 때 지도에 직접 반영
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setCenter(center);
    }
  }, [center]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "300px" }}
      center={center} // 이건 초깃값, 실제 이동은 setCenter 사용
      zoom={zoom}
      options={mapOptions}
      onLoad={(map) => {handleLoad(map)}}
    >
      {/* 현재 위치 */}
      {markerPosition && (
        <Marker
          position={markerPosition}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "black",
            fillOpacity: 1,
            strokeColor: "black",
            strokeWeight: 1,
            scale: 6
          }}
        />
      )}

      {/* 시작/종료 위치 */}
      {startLocation && <Marker position={startLocation} label="시작 위치" />}
      {endLocation && <Marker position={endLocation} label="종료 위치" />}

      {/* 주변 마커 */}
      {nearbyMarkers.map((place, idx) => (
        <Marker
          key={idx}
          position={{ lat: place.lat, lng: place.lng }}
          label={place.name.length > 5 ? place.name.slice(0, 5) + "…" : place.name}
        //   icon={{
        //     url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        //   }}
        />
      ))}
    </GoogleMap>
  );
});

export default MapContainer;
