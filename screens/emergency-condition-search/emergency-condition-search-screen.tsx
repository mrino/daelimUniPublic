import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styled from "styled-components/native"; // styled-components 수정
import BottomSheet from "../bottom-sheet/bottom-sheet";

const EmergencyConditionSearchScreen = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const SafeContainer = styled(SafeAreaView)`
    flex: 1;
    justify-content: space-between;
  `;

  const HeaderText = styled(Text)`
    color: black;
    font-size: 24px;
    font-weight: bold;
    flex: 1;
    text-align: center;
  `;

  const Header = styled(View)`
    width: 100%;
    padding: 20px;
    background-color: #ff8520;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;

  const MapV = styled(MapView)`
    width: 100%;
    height: 100%;
  `;

  // 위치 권한 요청 및 초기 위치 설정
  const locationPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치에 대한 액세스 권한이 거부되었습니다.");
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setMapRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      setErrorMsg("현재 위치를 가져오는 데 실패했습니다.");
      console.error(error); // 에러 콘솔 출력
    }
  };

  useEffect(() => {
    locationPermissions();
  }, []);

  return (
    <SafeContainer>
      <Header>
        <HeaderText>응급실조건검색</HeaderText>
      </Header>
      <MapV region={mapRegion} showsUserLocation={true}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="현재 위치"
          />
        )}
      </MapV>
      {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}

      <BottomSheet></BottomSheet>
    </SafeContainer>
  );
};

export default EmergencyConditionSearchScreen;
