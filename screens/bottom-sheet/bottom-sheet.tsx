import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import FilterButton from "./FilterButton"; // 필터 버튼 컴포넌트
import EmergencyRoomList from "../emergencyList/EmergencyList"; // 긴급실 목록

// 필터 항목 타입 정의
interface Filter {
  iconName: string;
  id: number;
  name: string;
}

interface BottomSheetComponentProps {
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>; // 부모에서 받은 필터 선택 함수
}

const categories = [
  "내과",
  "소아과",
  "피부과",
  "이비인후과",
  "정형외과",
  "외과",
  "가정의학과",
  "신경외과",
  "마취통증과",
  "성형외과",
  "산부인과",
  "안과",
  "정신의학과",
  "흉부외과",
  "치과",
];

const nightOrHolidayOptions = ["야간진료", "24시간진료", "토요일진료", "일요일진료", "공휴일진료"];

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({ setSelectedFilters }) => {
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<string[]>([]);
  const [selectedNightFilters, setSelectedNightFilters] = useState<string[]>([]);
  const [showCategoryFilters, setShowCategoryFilters] = useState(false); // 진료과목 필터 보이기/숨기기
  const [showNightFilters, setShowNightFilters] = useState(false); // 야간/휴일 필터 보이기/숨기기

  // 진료과목 필터 핸들러
  const handleCategoryFilter = (category: string) => {
    setSelectedCategoryFilters((prevFilters) =>
      prevFilters.includes(category) ? prevFilters.filter((item) => item !== category) : [...prevFilters, category]
    );
  };

  // 야간/휴일 필터 핸들러
  const handleNightFilter = (nightOption: string) => {
    setSelectedNightFilters((prevFilters) =>
      prevFilters.includes(nightOption)
        ? prevFilters.filter((item) => item !== nightOption)
        : [...prevFilters, nightOption]
    );
  };

  // 부모 컴포넌트로 선택된 필터 전달
  useEffect(() => {
    const combinedFilters = [...selectedCategoryFilters, ...selectedNightFilters];
    setSelectedFilters(combinedFilters);
  }, [selectedCategoryFilters, selectedNightFilters, setSelectedFilters]);

  return (
    <BottomSheet index={0} snapPoints={["100%"]} animateOnMount={true} handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView style={styles.content}>
        {/* 전체 내용을 스크롤 가능하게 ScrollView로 감싸기 */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // 키보드가 있을 때 터치 이벤트 처리
          style={styles.scrollView} // scrollView 스타일 추가
        >
          {/* 진료과목 필터 */}
          <TouchableOpacity onPress={() => setShowCategoryFilters((prev) => !prev)}>
            <Text style={styles.sectionTitle}>진료과목</Text>
          </TouchableOpacity>
          {showCategoryFilters && (
            <View style={styles.filterButtons}>
              {categories.map((category) => (
                <FilterButton
                  key={category}
                  label={category}
                  onPress={() => handleCategoryFilter(category)}
                  selected={selectedCategoryFilters.includes(category)}
                  iconName="medical-services"
                />
              ))}
            </View>
          )}

          {/* 야간/휴일 필터 */}
          <TouchableOpacity onPress={() => setShowNightFilters((prev) => !prev)}>
            <Text style={styles.sectionTitle}>야간/휴일</Text>
          </TouchableOpacity>
          {showNightFilters && (
            <View style={styles.filterButtons}>
              {nightOrHolidayOptions.map((option) => (
                <FilterButton
                  key={option}
                  label={option}
                  onPress={() => handleNightFilter(option)}
                  selected={selectedNightFilters.includes(option)}
                  iconName="access-time"
                />
              ))}
            </View>
          )}

          {/* 스크롤 가능한 병원 목록 */}
          <EmergencyRoomList />
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  handleIndicator: {
    backgroundColor: "#ccc",
    width: 50,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007bff", // 클릭 가능한 텍스트 스타일링
  },
  filterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollView: {
    height: "100%", // 스크롤 뷰에 전체 높이 적용
  },
});

export default BottomSheetComponent;
