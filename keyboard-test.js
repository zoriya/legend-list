'use strict';

var React = require('react');
var reactNativeKeyboardController = require('react-native-keyboard-controller');
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
var typedForwardRef = React.forwardRef;
var KeyboardAvoidingLegendList = typedForwardRef(function KeyboardAvoidingLegendList2(props, forwardedRef) {
  const memoList = React.useCallback((listProps) => /* @__PURE__ */ React__namespace.createElement(reactNativeKeyboardController.KeyboardChatScrollView, { ...listProps }), []);
  return /* @__PURE__ */ React__namespace.createElement(reanimated.AnimatedLegendList, { ref: forwardedRef, renderScrollComponent: memoList, ...props });
});

exports.KeyboardAvoidingLegendList = KeyboardAvoidingLegendList;
