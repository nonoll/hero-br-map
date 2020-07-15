import React, { useState, useEffect } from 'react';
import shortid from 'shortid';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import KakaoMap from '../components/map/KakaoMap';
import StickyHeadTable from '../components/list/StickyHeadTable';

const { REACT_APP_KEY_KAKAO, REACT_APP_GOOGLE_SHEET_ID_PATTERN, REACT_APP_GOOGLE_SHEET_API, REACT_APP_DOMESTIC_SHEET_ID } = process.env as any;

const KAKAO_MAP_API_KEY = REACT_APP_KEY_KAKAO as string;
const DOMESTIC_SHEET_API = REACT_APP_GOOGLE_SHEET_API.replace(REACT_APP_GOOGLE_SHEET_ID_PATTERN, REACT_APP_DOMESTIC_SHEET_ID) as string;

const useStyles = makeStyles({
  root: {
    minWidth: 275
  },
  title: {
    fontSize: 14
  }
});

const callFetch = async (uri: string) => {
  const fetchOption = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };
  const data = await fetch(uri, fetchOption);
  const response = await data.json();
  return response;
}

const MapContainer = () => {
  const [selected, setSelected] = useState<any>(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [markerList, setMakerList] = useState<any[]>([]);
  const [displayMarker, setDisplayMarker] = useState<any>(null);

  const handleMarkerClick = (item: any) => {
    const { marker, data, index } = item;
    console.log('Main handleMarkerClick', marker, data, index);
    setSelected(data);
  }

  const handleRowClick = (e: any, row: any) => {
    if (!parseFloat(row.lat) || !parseFloat(row.lng)) {
      alert('위도/경도 정보가 없습니다.');
      return;
    }
    setDisplayMarker({ ...row, data: row });
  }

  const fetchData = async () => {
    const response = await callFetch(DOMESTIC_SHEET_API);
    let entry: any[] = [ [] ];
    let entryIndex = 0;
    response.feed.entry.forEach((v: any, i: number) => {
      if (i !== 0 && i % 9 === 0) {
        entry.push([]);
        entryIndex++;
      }
      entry[entryIndex].push(v);
    });
    const getInputValue = (data: any) => {
      data = data ? data['gs$cell'].inputValue : '';
      if (!data || data === '-') {
        return '';
      }
      return data;
    };
    const list: any[] = entry.map((list, index) => {
      let [number, name, type1, type2, address, lat, lng, detailLink, etc] = list;
      return {
        index,
        key: shortid(),
        number: parseInt(getInputValue(number), 10),
        name: getInputValue(name),
        type1: getInputValue(type1),
        type2: getInputValue(type2),
        address: getInputValue(address),
        lat: getInputValue(lat),
        lng: getInputValue(lng),
        detailLink: getInputValue(detailLink),
        etc: getInputValue(etc)
      };
    });
    list.shift();
    setMakerList(list);
    setDataSource(list);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const classes = useStyles();

  return (
    <div style={{ padding: '16px' }}>
      {selected &&
        <Card className={classes.root} variant="outlined">
          <CardContent style={{ paddingBottom: 16 }}>
            <Typography className={classes.title} color="textSecondary" gutterBottom>{selected.address}</Typography>
            <Typography component="h2">{selected.name}</Typography>
          </CardContent>
        </Card>
      }

      <div style={{ padding: '16px 0 0 0'}}>
        <KakaoMap 
          apiKey={KAKAO_MAP_API_KEY}
          markerList={markerList}
          markerClick={handleMarkerClick}
          displayMarker={displayMarker}
        />
      </div>

      {(dataSource && dataSource.length) && 
        <div style={{ padding: '16px 0 0 0'}}>
          <StickyHeadTable 
            rows={dataSource}
            handleRowClick={handleRowClick}
          />
        </div>
      }
    </div>
  );
};

export default MapContainer;