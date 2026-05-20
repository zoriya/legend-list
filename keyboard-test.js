'use strict';

var React = require('react');
var reactNativeKeyboardController = require('react-native-keyboard-controller');
var keyboardChat = require('@legendapp/list/keyboard-chat');
var reactNative = require('@legendapp/list/react-native');
var reanimated = require('@legendapp/list/reanimated');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

// src/integrations/keyboard-test.tsx
var { typedForwardRef, useCombinedRef } = reactNative.internal;
var KeyboardAvoidingLegendList = typedForwardRef(function KeyboardAvoidingLegendList2(props, forwardedRef) {
  const { contentInsetEndAdjustment, ...rest } = props;
  const refLegendList = React.useRef(null);
  const combinedRef = useCombinedRef(forwardedRef, refLegendList);
  const onContentInsetChange = React.useCallback((insets) => {
    var _a;
    (_a = refLegendList.current) == null ? void 0 : _a.reportContentInset(insets);
  }, []);
  const memoList = React.useCallback(
    (listProps) => /* @__PURE__ */ React__namespace.createElement(
      reactNativeKeyboardController.KeyboardChatScrollView,
      {
        ...listProps,
        extraContentPadding: contentInsetEndAdjustment,
        onContentInsetChange
      }
    ),
    [contentInsetEndAdjustment, onContentInsetChange]
  );
  return /* @__PURE__ */ React__namespace.createElement(reanimated.AnimatedLegendList, { ref: combinedRef, renderScrollComponent: memoList, ...rest });
});

Object.defineProperty(exports, "useKeyboardScrollToEnd", {
  enumerable: true,
  get: function () { return keyboardChat.useKeyboardScrollToEnd; }
});
exports.KeyboardAvoidingLegendList = KeyboardAvoidingLegendList;
