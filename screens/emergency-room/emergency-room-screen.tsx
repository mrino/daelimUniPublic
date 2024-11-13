import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";

interface Hospital {
  hpid: string;
  dutyName: string;
  dutyAddr: string;
  dutyTel1: string;
  dutyTel3: string;
  hvec: number;
  hvicc: number;
  wgs84Lat: number;
  wgs84Lon: number;
  dutyTime1c: string;
  dutyTime2c: string;
  dutyTime3c: string;
  dutyTime4c: string;
  dutyTime5c: string;
  dutyTime6c: string;
  dutyTime7c: string;
  dutyTime8c: string;
  dutyTime1s: string;
  dutyTime2s: string;
  dutyTime3s: string;
  dutyTime4s: string;
  dutyTime5s: string;
  dutyTime6s: string;
  dutyTime7s: string;
  dutyTime8s: string;
}

const EmergencyRoomScreen = () => {
  const route = useRoute();
  const { hospital } = route.params as { hospital: Hospital };

  const [mapRegion, setMapRegion] = useState({
    latitude: hospital?.wgs84Lat || 37.5665,
    longitude: hospital?.wgs84Lon || 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hospital) {
      setMapRegion({
        latitude: hospital.wgs84Lat,
        longitude: hospital.wgs84Lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setIsLoading(false);
    }
  }, [hospital]);

  if (isLoading || !hospital) {
    return (
      <SafeContainer>
        <ActivityIndicator size="large" color="#ff8520" />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header>
        <HeaderText>{hospital.dutyName}</HeaderText>
      </Header>

      <MapContainer>
        <MapV region={mapRegion} style={{ flex: 1 }}>
          <Marker
            coordinate={{
              latitude: hospital.wgs84Lat,
              longitude: hospital.wgs84Lon,
            }}
            title={hospital.dutyName}
            description={hospital.dutyAddr}
          />
        </MapV>
      </MapContainer>

      <EmergencyContainer>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <TableContainer>
            <TableRow>
              <RowLabel>병원 이름</RowLabel>
              <RowValue>{hospital.dutyName}</RowValue>
            </TableRow>

            <TableRow>
              <RowLabel>주소</RowLabel>
              <RowValue>{hospital.dutyAddr}</RowValue>
            </TableRow>

            <TableRow>
              <RowLabel>대표번호</RowLabel>
              <RowValue>{hospital.dutyTel1}</RowValue>
            </TableRow>
            <TableRow>
              <RowLabel>응급실번호</RowLabel>
              <RowValue>{hospital.dutyTel3}</RowValue>
            </TableRow>

            <TableRow>
              <RowLabel>일반 병상 수</RowLabel>
              <RowValue>{hospital.hvec}</RowValue>
            </TableRow>

            <TableRow>
              <RowLabel>중환자실 수용 여부</RowLabel>
              <RowValue>{hospital.hvicc ? "가능" : "불가능"}</RowValue>
            </TableRow>

            <TableColumn>
              <TableRow>
                <RowLabel>월</RowLabel>
                <RowValue>{hospital.dutyTime1s}</RowValue>
                <RowValue>{hospital.dutyTime1c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>화</RowLabel>
                <RowValue>{hospital.dutyTime2s}</RowValue>
                <RowValue>{hospital.dutyTime2c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>수</RowLabel>
                <RowValue>{hospital.dutyTime3s}</RowValue>
                <RowValue>{hospital.dutyTime3c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>목</RowLabel>
                <RowValue>{hospital.dutyTime4s}</RowValue>
                <RowValue>{hospital.dutyTime4c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>금</RowLabel>
                <RowValue>{hospital.dutyTime5s}</RowValue>
                <RowValue>{hospital.dutyTime5c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>토</RowLabel>
                <RowValue>{hospital.dutyTime6s}</RowValue>
                <RowValue>{hospital.dutyTime6c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>일</RowLabel>
                <RowValue>{hospital.dutyTime7s}</RowValue>
                <RowValue>{hospital.dutyTime7c}</RowValue>
              </TableRow>
              <TableRow>
                <RowLabel>공휴일</RowLabel>
                <RowValue>{hospital.dutyTime8s}</RowValue>
                <RowValue>{hospital.dutyTime8c}</RowValue>
              </TableRow>
            </TableColumn>
          </TableContainer>
        </ScrollView>
      </EmergencyContainer>
    </SafeContainer>
  );
};

export default EmergencyRoomScreen;

// Styled Components
const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled(View)`
  padding: 20px;
  background-color: #ff8520;
  align-items: center;
`;

const HeaderText = styled(Text)`
  color: black;
  font-size: 24px;
  font-weight: bold;
`;

const MapContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 50%;
`;

const MapV = styled(MapView)`
  width: 100%;
  height: 100%;
`;

const EmergencyContainer = styled(View)`
  width: 100%;
  height: 50%;
  padding: 20px;
  background-color: #ff8520;
  align-items: center;
`;

const TableContainer = styled(View)`
  width: 100%;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const TableRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const TableColumn = styled(View)`
  flex-direction: column;
  justify-content: space-between;
  padding-vertical: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const RowLabel = styled(Text)`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  text-align: left;
`;

const RowValue = styled(Text)`
  font-size: 18px;
  color: #666;
  text-align: right;
`;
