// FilterButton.tsx에서 아이콘을 추가하고 스타일을 수정
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface FilterButtonProps {
  label: string;
  onPress: () => void;
  selected: boolean;
  iconName: string; // 추가: 아이콘 이름 속성
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, onPress, selected, iconName }) => (
  <TouchableOpacity style={[styles.button, selected && styles.selected]} onPress={onPress}>
    <View style={styles.iconTextContainer}>
      <Icon name={iconName} size={20} color={selected ? "#ff8520" : "#555"} />
      {/* 아이콘 */}
      <Text style={[styles.buttonText, selected && styles.selectedText]}>{label}</Text>
      {/* 텍스트 */}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#F2F2F2", // 밝은 회색
    margin: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "30%", // 버튼을 한 줄에 3개 배치할 수 있는 너비
  },
  selected: {
    backgroundColor: "#58A6FF", // 선택된 상태의 색상
  },
  buttonText: {
    color: "#333",
  },
  selectedText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 14,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 10,
  },
});

export default FilterButton;
