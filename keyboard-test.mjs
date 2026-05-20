import * as React from 'react';
import { useRef, useCallback } from 'react';
import { KeyboardChatScrollView } from 'react-native-keyboard-controller';
export { useKeyboardScrollToEnd } from '@legendapp/list/keyboard-chat';
import { internal } from '@legendapp/list/react-native';
import { AnimatedLegendList } from '@legendapp/list/reanimated';

// src/integrations/keyboard-test.tsx
var { typedForwardRef, useCombinedRef } = internal;
var KeyboardAvoidingLegendList = typedForwardRef(function KeyboardAvoidingLegendList2(props, forwardedRef) {
  const { contentInsetEndAdjustment, ...rest } = props;
  const refLegendList = useRef(null);
  const combinedRef = useCombinedRef(forwardedRef, refLegendList);
  const onContentInsetChange = useCallback((insets) => {
    var _a;
    (_a = refLegendList.current) == null ? void 0 : _a.reportContentInset(insets);
  }, []);
  const memoList = useCallback(
    (listProps) => /* @__PURE__ */ React.createElement(
      KeyboardChatScrollView,
      {
        ...listProps,
        extraContentPadding: contentInsetEndAdjustment,
        onContentInsetChange
      }
    ),
    [contentInsetEndAdjustment, onContentInsetChange]
  );
  return /* @__PURE__ */ React.createElement(AnimatedLegendList, { ref: combinedRef, renderScrollComponent: memoList, ...rest });
});

export { KeyboardAvoidingLegendList };
