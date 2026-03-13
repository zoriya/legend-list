import * as React from 'react';
import { useCallback, forwardRef } from 'react';
import { KeyboardChatScrollView } from 'react-native-keyboard-controller';
import { AnimatedLegendList } from '@legendapp/list/reanimated';

// src/integrations/keyboard-test.tsx
var typedForwardRef = forwardRef;
var KeyboardAvoidingLegendList = typedForwardRef(function KeyboardAvoidingLegendList2(props, forwardedRef) {
  const memoList = useCallback((listProps) => /* @__PURE__ */ React.createElement(KeyboardChatScrollView, { ...listProps }), []);
  return /* @__PURE__ */ React.createElement(AnimatedLegendList, { ref: forwardedRef, renderScrollComponent: memoList, ...props });
});

export { KeyboardAvoidingLegendList };
