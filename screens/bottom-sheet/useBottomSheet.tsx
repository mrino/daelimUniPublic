import { useRef } from "react";
import { Animated, PanResponder, Dimensions } from "react-native";

const windowHeight = Dimensions.get("window").height;
export const MIN_Y = 60;
export const MAX_Y = windowHeight - 160;

export default function useBottomSheet() {
  const translateY = useRef(new Animated.Value(MAX_Y)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // translateY의 현재 값에 기반하여 새로운 Y 값을 계산
        const newY = Math.min(MAX_Y, Math.max(MIN_Y, gestureState.dy + MAX_Y));
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        // 패널 드래그 후의 로직
        if (gestureState.dy > 100) {
          Animated.spring(translateY, {
            toValue: MAX_Y,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue: MIN_Y,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return { translateY, panResponder };
}
