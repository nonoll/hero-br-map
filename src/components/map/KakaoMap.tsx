/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

const markerSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
const noop = (data?: any) => {};

export interface IKakaoMapParams {
  apiKey: string;
  mapStyle?: any;
  markerList?: any[];
  markerClick?: any;
  displayMarker?: any;
}

const KakaoMap = ({
  apiKey,
  mapStyle = { width: '100%', height: '400px' },
  markerList = [],
  markerClick = noop,
  displayMarker = null
}: IKakaoMapParams) => {
  const mapRef = React.createRef<HTMLDivElement>();
  const [isReady, setReady] = useState(false);
  const [map, setMap] = useState(null);
  const [mapClusterer, setMapClusterer] = useState<any>(null);
  const [mapMarker, setMapMarker] = useState<any[]>([]);

  const setMapDisplay = ({ marker, data, index, lat, lng }: any) => {
    if (!marker && !lat && !lng) {
      alert('위도/경도 정보가 없습니다.');
      return;
    }
    if (marker) {
      // @ts-ignore
      map.setLevel(4);
      // @ts-ignore
      map.setCenter(marker.getPosition());
      markerClick({ marker, data, index });
    } else {
      const kakaoMap = (window as any).kakao.maps;
      // @ts-ignore
      map.setLevel(4);
      // @ts-ignore
      map.setCenter(new kakaoMap.LatLng(parseFloat(lat), parseFloat(lng)));
      markerClick({ data, index });
    }
  }

  const handleMarkerClick = (marker: any, index: number) => {
    const data = markerList[index];
    return () => {
      if (map) {
        setMapDisplay({ marker, data, index });
      }
    }
  };

  useEffect(() => {
    if (displayMarker) {
      setMapDisplay({ ...displayMarker });
    }
  }, [displayMarker])

  useEffect(() => {
    mapMarker.forEach((marker, index) => {
      (window as any).kakao.maps.event.removeListener(marker, 'click', handleMarkerClick(marker, index));
      (window as any).kakao.maps.event.addListener(marker, 'click', handleMarkerClick(marker, index));
    });
  }, [mapMarker]);

  useEffect(() => {
    const hasData = Array.isArray(markerList) && (markerList || []).length;

    if (hasData && isReady && map) {
      const kakaoMap = (window as any).kakao.maps;
      const markerSize = new kakaoMap.Size(24, 35);
      const markerImage = new kakaoMap.MarkerImage(markerSrc, markerSize); 
      const markers: any[] = markerList.map(item => {
        const { name: title, lat, lng } = item;
        const position = new kakaoMap.LatLng(parseFloat(lat), parseFloat(lng));
        const marker = new kakaoMap.Marker({ map, position, title, image: markerImage });
        return marker;
      });
      mapClusterer.addMarkers(markers);

      setMapMarker(markers);
    }
  }, [markerList]);

  useEffect(() => {
    if (isReady) {
      const kakaoMap = (window as any).kakao.maps;
      const options = {
        center: new kakaoMap.LatLng(37.5642135, 127.0016985),
        level: 14
      };
      const map = new kakaoMap.Map(mapRef.current, options);
      const zoomControl = new kakaoMap.ZoomControl();
      map.addControl(zoomControl, kakaoMap.ControlPosition.RIGHT);

      const clusterer = new kakaoMap.MarkerClusterer({
        map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
        minLevel: 8 // 클러스터 할 최소 지도 레벨 
      });
      setMapClusterer(clusterer);

      setMap(map);
    }
  }, [isReady]);

  useEffect(() => {
    const hasKakaoMap = !!((window as any).kakao && (window as any).kakao.maps);
    if (!hasKakaoMap) {
      const script = document.createElement('script');
      script.onload = () => {
        (window as any).kakao.maps.load(() => setReady(true));
      };
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services,clusterer,drawing`;
      document.head.appendChild(script);
    } else {
      setReady(true);
    }
  }, [apiKey]);

  return (
    <div ref={mapRef} style={mapStyle}></div>
  );
};

export default KakaoMap;