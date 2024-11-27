import { Dimensions } from "react-native";

const { height: windowHeight } = Dimensions.get("window");

export const MIN_Y = 60;
export const MAX_Y = windowHeight - 160;
export const BOTTOM_SHEET_HEIGHT = windowHeight - MIN_Y;
