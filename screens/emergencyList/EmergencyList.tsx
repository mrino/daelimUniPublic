import React, { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator, Linking, Button, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";

const hApiUrl = "http://hospital-main-api.minq.work/getEmergencyHospitalList";
const ApiKey = Constants?.expoConfig?.extra?.API_KEY;

// 데이터 인터페이스
interface EmergencyRoomData {
  dutyName: string; // 병원 이름
  hvec: string | null; // 응급실 여부를 나타내는 필드 (null일 경우 응급실이 아님)
  dutyTel3: string | null; // 응급실 전화번호
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled(View)``;
const DutyImg = styled(Image)`
  width: 50px;
  height: 50px;
`;
const DustName = styled(Text)`
  font-size: 16;
`;
const DutyTel = styled(Text)`
  font-size: 14;
`;
const DutyTelBtn = styled(TouchableOpacity)`
  font-size: 14;
`;

// 데이터 가져오기 함수
const fetchEmergencyRoomData = async (page: number): Promise<EmergencyRoomData[]> => {
  try {
    // API 호출
    const response = await axios.get<{
      resultCode: number;
      message: string;
      data: { content: EmergencyRoomData[] };
    }>(`${hApiUrl}?page=${page}&size=20`);
    console.log(`${hApiUrl}?page=${page}&size=20`);

    // 응답 데이터가 존재하는지 확인하고 필터링
    if (response.data && response.data.data && response.data.data.content) {
      return response.data.data.content
        .filter((item) => item.hvec !== null) // hvec이 null이 아니어야 응급실로 간주
        .map((item) => ({
          dutyName: item.dutyName, // 병원 이름
          hvec: item.hvec, // 응급실 여부
          dutyTel3: item.dutyTel3 || "전화번호 없음",
        }));
    } else {
      console.error("응답 데이터의 'content'가 없습니다.");
      return []; // 응답이 없으면 빈 배열 반환
    }
  } catch (error) {
    console.error("Error fetching data", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

const fetchPlaceImage = async (placeName: string): Promise<string | null> => {
  const googleApiKey = ApiKey; // API 키 설정
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${placeName}&key=${googleApiKey}`;

  try {
    const response = await axios.get(searchUrl);
    if (response.data.results && response.data.results.length > 0) {
      const placeId = response.data.results[0].place_id;
      const photoReference = response.data.results[0].photos
        ? response.data.results[0].photos[0].photo_reference
        : null;

      if (photoReference) {
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleApiKey}`;
        //console.log(photoUrl);
        return photoUrl;
      }
    }
  } catch (error) {
    console.error("Error fetching place image:", error);
  }
  return null;
};

const EmergencyRoomList = () => {
  const [data, setData] = useState<EmergencyRoomData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<{ [key: string]: string | null }>({});
  const [page, setPage] = useState<number>(1); // 현재 페이지 상태
  const navigation = useNavigation();

  const loadData = async () => {
    const emergencyRooms = await fetchEmergencyRoomData(page);
    setData((prevData) => [...prevData, ...emergencyRooms]);

    // 각 병원에 대해 이미지를 가져옴
    const imagePromises = emergencyRooms.map(async (item) => {
      const imageUrl = await fetchPlaceImage(item.dutyName);
      return { [item.dutyName]: imageUrl };
    });

    // 모든 이미지 데이터를 받아온 후 상태 업데이트
    const imageData = await Promise.all(imagePromises);
    const imageMap = imageData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    setImages(imageMap);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    console.log(page);
  }, [page]);

  const handleEndReached = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1); // 페이지를 증가시켜서 추가 데이터를 로드
    }
  };

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color="#0000ff" />; // 초기 로딩 중 표시
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <Container>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 30 }}>
            {images[item.dutyName] ? <DutyImg source={{ uri: images[item.dutyName] }} /> : <Text>이미지 없음</Text>}
            <TextContainer>
              <DustName>{item.dutyName}</DustName>
              <DutyTelBtn onPress={() => Linking.openURL(`tel:${item.dutyTel3}`)}>
                <DutyTel>{item.dutyTel3}</DutyTel>
              </DutyTelBtn>
            </TextContainer>
            <TouchableOpacity onPress={() => navigation.navigate("EmergencyRoomScreen", { hospital: item })}>
              <Text>병원 세부 정보 보기</Text>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={handleEndReached} // 리스트 끝에 도달하면 handleEndReached 실행
        onEndReachedThreshold={0.1} // 리스트 끝에서 10% 남았을 때 데이터를 추가로 불러옴
      />
    </Container>
  );
};

export default EmergencyRoomList;
