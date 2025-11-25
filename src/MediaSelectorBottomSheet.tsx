import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  PanResponder,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MediaSelectorView from "./MediaSelectorView";

export type MediaSelectorVisibility = "hidden" | "partial" | "full";

export type MediaSelectorBottomSheetProps = {
  visibility: MediaSelectorVisibility;
  keyboardHeight: number;
  /**
   * Optional explicit close handler. If not provided, the sheet will
   * fall back to calling onVisibilityChange("hidden") when the scrim
   * is tapped.
   */
  onRequestClose?: () => void;
  /**
   * Notifies caller when the sheet wants to change its visibility
   * (e.g. user taps the handle to expand/collapse or taps on scrim).
   */
  onVisibilityChange?: (visibility: MediaSelectorVisibility) => void;
};

const MediaSelectorBottomSheet: React.FC<MediaSelectorBottomSheetProps> = ({
  visibility,
  keyboardHeight,
  onRequestClose,
  onVisibilityChange,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const topInset = insets.top || StatusBar.currentHeight || 0;

  if (Platform.OS !== "android") {
    return null;
  }

  const dragResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt, gestureState) => {
          // Any small vertical movement on the handle should engage the drag
          return Math.abs(gestureState.dy) > 2;
        },
        onPanResponderRelease: (_evt, gestureState) => {
          if (!onVisibilityChange) {
            return;
          }
          const { dy } = gestureState;
          const threshold = 10;

          // Drag up: try to expand to full from partial.
          if (dy < -threshold && visibility === "partial") {
            onVisibilityChange("full");
            return;
          }

          // Drag down: collapse from full -> partial, or partial -> hidden.
          if (dy > threshold) {
            if (visibility === "full") {
              onVisibilityChange("partial");
            } else if (visibility === "partial") {
              onVisibilityChange("hidden");
            }
          }
        },
      }),
    [visibility, onVisibilityChange]
  );

  const isVisible = visibility !== "hidden";

  if (!isVisible) {
    return null;
  }

  const HEADER_MARGIN = 56; // Reserve space for host app header / search bar

  const baseHeight = keyboardHeight > 0 ? keyboardHeight : windowHeight * 0.35;
  let fullHeight: number;

  if (keyboardHeight > 0) {
    const maxFullHeight =
      windowHeight - keyboardHeight - topInset - HEADER_MARGIN;

    // Ensure the sheet grows larger than the partial state but never
    // pushes its top content under the app's header area.
    const minFullHeight = Math.max(baseHeight, windowHeight * 0.3);

    fullHeight = Math.max(minFullHeight, Math.min(maxFullHeight, windowHeight));
  } else {
    fullHeight = Math.max(windowHeight * 0.7, baseHeight);
  }

  const sheetHeight = visibility === "partial" ? baseHeight : fullHeight;

  const handleClose = () => {
    if (onRequestClose) {
      onRequestClose();
      return;
    }
    onVisibilityChange?.("hidden");
  };

  const handleToggleHeight = () => {
    if (!onVisibilityChange) {
      return;
    }
    if (visibility === "full") {
      onVisibilityChange("partial");
    } else if (visibility === "partial") {
      onVisibilityChange("full");
    }
  };

  return (
    <View
      style={[
        styles.overlay,
        keyboardHeight > 0 ? { bottom: keyboardHeight } : null,
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.scrim}
        activeOpacity={1}
        onPress={handleClose}
      />
      <View style={[styles.sheetContainer, { height: sheetHeight }]}>
        <TouchableOpacity
          style={styles.handleContainer}
          activeOpacity={0.8}
          onPress={handleToggleHeight}
        >
          <View style={styles.handle} {...dragResponder.panHandlers} />
        </TouchableOpacity>
        <MediaSelectorView style={styles.mediaSelector} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetContainer: {
    width: "100%",
    backgroundColor: "#000",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
  },
  mediaSelector: {
    flex: 1,
  },
});

export default MediaSelectorBottomSheet;
