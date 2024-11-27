import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import styled from "styled-components/native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const MainScreen = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null);
  const [hospitalData, setHospitalData] = useState<any[]>([]); // 병원 데이터 상태 추가
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const navigation = useNavigation();

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
      fetchHospitalData(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
      fetchAddressFromCoords(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
    } catch (error) {
      setErrorMsg("현재 위치를 가져오는 데 실패했습니다.");
    }
  };

  // NOTE: 병원 데이터 가져오기 함수
  const fetchHospitalData = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "http://hospital-main-api.minq.work/getHospitalInfoList",
        {
          params: {
            page: 1,
            size: 20,
            radius: 5000, // 5km 반경
            latitude: latitude, // 추가된 위도
            longitude: longitude, // 추가된 경도
          },
        }
      );

      console.log("응답 데이터:", response.data);

      // NOTE: 병원 정보가 있는 경우 처리
      const hospitals = response.data.data.content; // content에서 병원 정보를 가져옴
      if (hospitals.length > 0) {
        setHospitalData(hospitals);
      } else {
        Alert.alert("주변에 병원이 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching hospital data", error);
      setErrorMsg("병원 데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const fetchAddressFromCoords = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const [result] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (result) {
        const { region, city, district, street, name } = result;
        const fullAddress = [region, city, district, street, name]
          .filter(Boolean)
          .join(" ");
        setAddress(fullAddress);
      } else {
        setAddress("주소를 찾을 수 없습니다.");
      }
    } catch (error) {
      setErrorMsg("역 지오코딩 중 오류가 발생했습니다.");
    }
  };

  const handleSearch = useCallback(async () => {
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        fetchAddressFromCoords(latitude, longitude);
        setSearchQuery("");
      } else {
        Alert.alert("위치를 찾을 수 없습니다.");
      }
    } catch (error) {
      setErrorMsg("위치 검색 중 오류가 발생했습니다.");
    }
  }, [searchQuery]);

  const handleZoom = (factor: number) => {
    setMapRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * factor,
      longitudeDelta: prevRegion.longitudeDelta * factor,
    }));
  };

  useEffect(() => {
    locationPermissions();
  }, []);

  return (
    <SafeContainer>
      <Header />

      <Container>
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
          {hospitalData.map((hospital) => (
            <Marker
              key={hospital.hpid}
              coordinate={{
                latitude: hospital.wgs84Lat,
                longitude: hospital.wgs84Lon,
              }}
              title={hospital.dutyName}
              description={hospital.dutyAddr}
              onPress={() =>
                navigation.navigate("EmergencyRoomScreen", {
                  hospital,
                })
              }
            />
          ))}
        </MapV>

        {/* 병원 정보 리스트 출력 */}

        <SearchAddressContainer>
          <SearchBar>
            <SearchImageBackground
              source={require("../assets/search-bar.png")}
              resizeMode="stretch"
            >
              <SearchInputWrapper>
                <SearchIcon source={require("../assets/search-icon.png")} />
                <SearchInput
                  placeholder="위치 검색"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </SearchInputWrapper>
              <TouchableOpacity onPress={handleSearch}>
                <GearIcon source={require("../assets/gear-icon.png")} />
              </TouchableOpacity>
            </SearchImageBackground>
          </SearchBar>
          <AddressContainer>
            <AddressSizedBox>
              <AddressText>
                {address ? `주소: ${address}` : "위치를 선택하세요"}
              </AddressText>
              {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
            </AddressSizedBox>
          </AddressContainer>
        </SearchAddressContainer>

        <ZoomButtonContainer>
          <ZoomButton onPress={() => handleZoom(0.5)}>
            <FontAwesome name="plus" size={24} color="black" />
          </ZoomButton>
          <ZoomButton onPress={() => handleZoom(2)}>
            <FontAwesome name="minus" size={24} color="black" />
          </ZoomButton>
        </ZoomButtonContainer>
      </Container>

      <ButtonContainer show={showButtons}>
        {[
          { title: "응급실", screen: "EmergencyRoomScreen" },
          { title: "응급실조건검색", screen: "EmergencyConditionSearchScreen" },
        ].map((button) => (
          <ActionButton
            key={button.screen}
            onPress={() => navigation.navigate(button.screen)}
          >
            <ActionButtonText>{button.title}</ActionButtonText>
          </ActionButton>
        ))}
      </ButtonContainer>

      <ToggleButton onPress={() => setShowButtons(!showButtons)}>
        <FontAwesome
          name={showButtons ? "chevron-down" : "chevron-up"}
          size={24}
          color="black"
        />
      </ToggleButton>
    </SafeContainer>
  );
};

const SearchBar = styled(View)`
  width: 100%;
  align-items: center;
  margin-top: 20px;
`;

const SearchImageBackground = styled.ImageBackground`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 15px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  height: 40px;
  color: black;
`;

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #f5f5f5;
  justify-content: space-between;
`;

const Header = styled(View)`
  width: 100%;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AddressSizedBox = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MapV = styled(MapView)`
  width: 100%;
  height: 100%;
`;

const SearchAddressContainer = styled(View)`
  align-items: center;
  width: 100%;
  height: 180px;
  position: absolute;
  top: 10;
`;

const AddressContainer = styled(View)`
  margin-top: 10px;
  align-items: center;
`;

const SearchInputWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const SearchIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 10px;
`;

const GearIcon = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 40px;
`;

const AddressText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const ErrorText = styled(Text)`
  color: red;
`;

const ZoomButtonContainer = styled(View)`
  position: absolute;
  top: 80px;
  right: 10px;
  flex-direction: column;
`;

const ZoomButton = styled(TouchableOpacity)`
  background-color: #ffffff;
  border-radius: 50px;
  padding: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled(View)<{ show: boolean }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #f5f5f5;
  position: absolute;
  bottom: 0;
  padding: 10px;
  display: ${({ show }) => (show ? "flex" : "none")};
`;

const ActionButton = styled(TouchableOpacity)`
  background-color: #ff8520;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ActionButtonText = styled(Text)`
  color: white;
`;

const ToggleButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 70px;
  right: 10px;
  background-color: #ffffff;
  border-radius: 50px;
  padding: 10px;
`;

export default MainScreen;
