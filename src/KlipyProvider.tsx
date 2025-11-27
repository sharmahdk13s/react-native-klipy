import React, { useEffect } from "react";
import { BackHandler, Keyboard, KeyboardEvent, Platform } from "react-native";
import MediaSelectorBottomSheet, {
  MediaSelectorVisibility,
} from "./MediaSelectorBottomSheet";
import {
  __setAndroidOpenHandler,
  addReactionListener,
  type KlipyReaction,
} from "./index";

type Props = {
  children: React.ReactNode;
};

const KlipyProvider: React.FC<Props> = ({ children }) => {
  const [visibility, setVisibility] =
    React.useState<MediaSelectorVisibility>("hidden");
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    __setAndroidOpenHandler(() => {
      setVisibility("partial");
    });

    const showSub = Keyboard.addListener(
      "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    const reactionSub = addReactionListener((reaction: KlipyReaction) => {
      if (
        (reaction.type === "gif" ||
          reaction.type === "clip" ||
          reaction.type === "sticker") &&
        reaction.value
      ) {
        // Auto-hide sheet when a media item is selected on Android
        setVisibility("hidden");
      }
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visibility !== "hidden") {
          setVisibility("hidden");
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      }
    );

    return () => {
      __setAndroidOpenHandler(null);
      showSub.remove();
      hideSub.remove();
      reactionSub.remove();
      backHandler.remove();
    };
  }, [visibility]);

  return (
    <>
      {children}
      <MediaSelectorBottomSheet
        visibility={visibility}
        keyboardHeight={keyboardHeight}
        onVisibilityChange={setVisibility}
      />
    </>
  );
};

export default KlipyProvider;
