import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styled from "styled-components";
import EmergencyRoomList from "../emergencyList/EmergencyList";

interface BottomSheetProps {
  onClose?: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ onClose }) => {
  const windowHeight = Dimensions.get("window").height;
  const HEADER_HEIGHT = 50;
  const HALF_POSITION = windowHeight / 2; // 화면 절반 높이
  const translateY = useRef(
    new Animated.Value(windowHeight - HEADER_HEIGHT)
  ).current;
  const [isHalfOpen, setIsHalfOpen] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        const newTranslateY = Math.max(
          HALF_POSITION,
          gestureState.dy + windowHeight - HEADER_HEIGHT
        );
        translateY.setValue(newTranslateY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.spring(translateY, {
            toValue: windowHeight - HEADER_HEIGHT, // 헤더만 보이게
            useNativeDriver: true,
          }).start(() => setIsHalfOpen(false));
        } else {
          Animated.spring(translateY, {
            toValue: HALF_POSITION, // 절반 위치로 올리기
            useNativeDriver: true,
          }).start(() => setIsHalfOpen(true));
        }
      },
    })
  ).current;

  const toggleBottomSheet = () => {
    if (isHalfOpen) {
      // 현재 절반 위치에 있으므로, 원래 위치로 내리기
      Animated.spring(translateY, {
        toValue: windowHeight - HEADER_HEIGHT,
        useNativeDriver: true,
      }).start(() => setIsHalfOpen(false));
    } else {
      // 현재 원래 위치에 있으므로, 절반 위치로 올리기
      Animated.spring(translateY, {
        toValue: HALF_POSITION,
        useNativeDriver: true,
      }).start(() => setIsHalfOpen(true));
    }
  };

  const ActionButton = styled(TouchableOpacity)`
    width: 30%;
    height: 60px;
    margin-bottom: 10px;
    background-color: #ff8520;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
  `;

  const ButtonContainer = styled(View)`
    padding: 10px;
    background-color: #f5f5f5;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    position: absolute;
    left: 0;
    right: 0;
  `;

  const Container = styled(View)`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 10%;
  `;

  return (
    <Animated.View
      style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      {/* 클릭하여 BottomSheet를 토글하는 머리 부분 */}
      <TouchableOpacity style={styles.header} onPress={toggleBottomSheet}>
        <Text style={styles.headerText}>목록보기</Text>
      </TouchableOpacity>

      {/* BottomSheet의 내용 */}
      <View style={styles.content}>
        <ButtonContainer>
          <ActionButton></ActionButton>
          <ActionButton></ActionButton>
          <ActionButton></ActionButton>
        </ButtonContainer>
        <Container>
          <EmergencyRoomList />
        </Container>
      </View>

      <Container>
        <EmergencyRoomList />
      </Container>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: Dimensions.get("window").height,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 16,
    color: "#555",
  },
  content: {
    padding: 16,
  },
});

export default BottomSheet;
