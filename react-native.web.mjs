import * as React3 from 'react';
import React3__default, { forwardRef, useReducer, useEffect, createContext, useRef, useState, useMemo, useCallback, useImperativeHandle, useLayoutEffect, useContext } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import * as ReactDOM from 'react-dom';
import { flushSync } from 'react-dom';

// src/components/LegendList.tsx
forwardRef(function AnimatedView2(props, ref) {
  return /* @__PURE__ */ React3.createElement("div", { ref, ...props });
});
var View = forwardRef(function View2(props, ref) {
  return /* @__PURE__ */ React3.createElement("div", { ref, ...props });
});
var Text = View;

// src/state/getContentInsetEnd.ts
function getContentInsetEnd(state) {
  var _a3;
  const { props } = state;
  const horizontal = props.horizontal;
  const contentInset = props.contentInset;
  const baseInset = contentInset != null ? contentInset : state.nativeContentInset;
  const overrideInset = (_a3 = state.contentInsetOverride) != null ? _a3 : void 0;
  if (overrideInset) {
    const mergedInset = { bottom: 0, right: 0, ...baseInset, ...overrideInset };
    return (horizontal ? mergedInset.right : mergedInset.bottom) || 0;
  }
  if (baseInset) {
    return (horizontal ? baseInset.right : baseInset.bottom) || 0;
  }
  return 0;
}

// src/state/getContentSize.ts
function getContentSize(ctx) {
  var _a3;
  const { values, state } = ctx;
  const stylePaddingTop = values.get("stylePaddingTop") || 0;
  const stylePaddingBottom = state.props.stylePaddingBottom || 0;
  const headerSize = values.get("headerSize") || 0;
  const footerSize = values.get("footerSize") || 0;
  const contentInsetBottom = getContentInsetEnd(state);
  const totalSize = (_a3 = state.pendingTotalSize) != null ? _a3 : values.get("totalSize");
  return headerSize + footerSize + totalSize + stylePaddingTop + stylePaddingBottom + (contentInsetBottom || 0);
}

// src/platform/Animated.tsx
var createAnimatedValue = (value) => value;

// src/state/state.tsx
var ContextState = React3.createContext(null);
var contextNum = 0;
function StateProvider({ children }) {
  const [value] = React3.useState(() => ({
    animatedScrollY: createAnimatedValue(0),
    columnWrapperStyle: void 0,
    contextNum: contextNum++,
    listeners: /* @__PURE__ */ new Map(),
    mapViewabilityAmountCallbacks: /* @__PURE__ */ new Map(),
    mapViewabilityAmountValues: /* @__PURE__ */ new Map(),
    mapViewabilityCallbacks: /* @__PURE__ */ new Map(),
    mapViewabilityConfigStates: /* @__PURE__ */ new Map(),
    mapViewabilityValues: /* @__PURE__ */ new Map(),
    positionListeners: /* @__PURE__ */ new Map(),
    state: void 0,
    values: /* @__PURE__ */ new Map([
      ["stylePaddingTop", 0],
      ["headerSize", 0],
      ["numContainers", 0],
      ["activeStickyIndex", -1],
      ["totalSize", 0],
      ["scrollAdjustPending", 0]
    ]),
    viewRefs: /* @__PURE__ */ new Map()
  }));
  return /* @__PURE__ */ React3.createElement(ContextState.Provider, { value }, children);
}
function useStateContext() {
  return React3.useContext(ContextState);
}
function createSelectorFunctionsArr(ctx, signalNames) {
  let lastValues = [];
  let lastSignalValues = [];
  return {
    get: () => {
      const currentValues = [];
      let hasChanged = false;
      for (let i = 0; i < signalNames.length; i++) {
        const value = peek$(ctx, signalNames[i]);
        currentValues.push(value);
        if (value !== lastSignalValues[i]) {
          hasChanged = true;
        }
      }
      lastSignalValues = currentValues;
      if (hasChanged) {
        lastValues = currentValues;
      }
      return lastValues;
    },
    subscribe: (cb) => {
      const listeners = [];
      for (const signalName of signalNames) {
        listeners.push(listen$(ctx, signalName, cb));
      }
      return () => {
        for (const listener of listeners) {
          listener();
        }
      };
    }
  };
}
function listen$(ctx, signalName, cb) {
  const { listeners } = ctx;
  let setListeners = listeners.get(signalName);
  if (!setListeners) {
    setListeners = /* @__PURE__ */ new Set();
    listeners.set(signalName, setListeners);
  }
  setListeners.add(cb);
  return () => setListeners.delete(cb);
}
function peek$(ctx, signalName) {
  const { values } = ctx;
  return values.get(signalName);
}
function set$(ctx, signalName, value) {
  const { listeners, values } = ctx;
  if (values.get(signalName) !== value) {
    values.set(signalName, value);
    const setListeners = listeners.get(signalName);
    if (setListeners) {
      for (const listener of setListeners) {
        listener(value);
      }
    }
  }
}
function listenPosition$(ctx, key, cb) {
  const { positionListeners } = ctx;
  let setListeners = positionListeners.get(key);
  if (!setListeners) {
    setListeners = /* @__PURE__ */ new Set();
    positionListeners.set(key, setListeners);
  }
  setListeners.add(cb);
  return () => setListeners.delete(cb);
}
function notifyPosition$(ctx, key, value) {
  const { positionListeners } = ctx;
  const setListeners = positionListeners.get(key);
  if (setListeners) {
    for (const listener of setListeners) {
      listener(value);
    }
  }
}
function useArr$(signalNames) {
  const ctx = React3.useContext(ContextState);
  const { subscribe, get } = React3.useMemo(() => createSelectorFunctionsArr(ctx, signalNames), [ctx, signalNames]);
  const value = useSyncExternalStore(subscribe, get);
  return value;
}
function useSelector$(signalName, selector) {
  const ctx = React3.useContext(ContextState);
  const { subscribe, get } = React3.useMemo(() => createSelectorFunctionsArr(ctx, [signalName]), [ctx, signalName]);
  const value = useSyncExternalStore(subscribe, () => selector(get()[0]));
  return value;
}

// src/components/DebugView.tsx
var DebugRow = ({ children }) => {
  return /* @__PURE__ */ React3.createElement(View, { style: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" } }, children);
};
React3.memo(function DebugView2({ state }) {
  const ctx = useStateContext();
  const [totalSize = 0, scrollAdjust = 0, rawScroll = 0, scroll = 0, _numContainers = 0, _numContainersPooled = 0] = useArr$([
    "totalSize",
    "scrollAdjust",
    "debugRawScroll",
    "debugComputedScroll",
    "numContainers",
    "numContainersPooled"
  ]);
  const contentSize = getContentSize(ctx);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  useInterval(() => {
    forceUpdate();
  }, 100);
  return /* @__PURE__ */ React3.createElement(
    View,
    {
      pointerEvents: "none",
      style: {
        // height: 100,
        backgroundColor: "#FFFFFFCC",
        borderRadius: 4,
        padding: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        position: "absolute",
        right: 0,
        top: 0
      }
    },
    /* @__PURE__ */ React3.createElement(DebugRow, null, /* @__PURE__ */ React3.createElement(Text, null, "TotalSize:"), /* @__PURE__ */ React3.createElement(Text, null, totalSize.toFixed(2))),
    /* @__PURE__ */ React3.createElement(DebugRow, null, /* @__PURE__ */ React3.createElement(Text, null, "ContentSize:"), /* @__PURE__ */ React3.createElement(Text, null, contentSize.toFixed(2))),
    /* @__PURE__ */ React3.createElement(DebugRow, null, /* @__PURE__ */ React3.createElement(Text, null, "At end:"), /* @__PURE__ */ React3.createElement(Text, null, String(state.isAtEnd))),
    /* @__PURE__ */ React3.createElement(DebugRow, null, /* @__PURE__ */ React3.createElement(Text, null, "ScrollAdjust:"), /* @__PURE__ */ React3.createElement(Text, null, scrollAdjust.toFixed(2))),
    /* @__PURE__ */ React3.createElement(DebugRow, null, /* @__PURE__ */ React3.createElement(Text, null, "RawScroll: "), /* @__PURE__ */ React3.createElement(Text, null, rawScroll.toFixed(2))),
    /* @__PURE__ */ React3.createElement(DebugRow, null, /* @__PURE__ */ React3.createElement(Text, null, "ComputedScroll: "), /* @__PURE__ */ React3.createElement(Text, null, scroll.toFixed(2)))
  );
});
function useInterval(callback, delay) {
  useEffect(() => {
    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [delay]);
}

// src/utils/devEnvironment.ts
var metroDev = typeof __DEV__ !== "undefined" ? __DEV__ : void 0;
var _a;
var envMode = typeof process !== "undefined" && typeof process.env === "object" && process.env ? (_a = process.env.NODE_ENV) != null ? _a : process.env.MODE : void 0;
var processDev = typeof envMode === "string" ? envMode.toLowerCase() !== "production" : void 0;
var _a2;
var IS_DEV = (_a2 = processDev != null ? processDev : metroDev) != null ? _a2 : false;

// src/constants.ts
var POSITION_OUT_OF_VIEW = -1e7;
var ENABLE_DEVMODE = IS_DEV && false;
var ENABLE_DEBUG_VIEW = IS_DEV && false;
var typedForwardRef = React3.forwardRef;
var typedMemo = React3.memo;

// src/utils/helpers.ts
function isFunction(obj) {
  return typeof obj === "function";
}
function isArray(obj) {
  return Array.isArray(obj);
}
var warned = /* @__PURE__ */ new Set();
function warnDevOnce(id, text) {
  if (IS_DEV && !warned.has(id)) {
    warned.add(id);
    console.warn(`[legend-list] ${text}`);
  }
}
function roundSize(size) {
  return Math.floor(size * 8) / 8;
}
function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
function comparatorDefault(a, b) {
  return a - b;
}
function getPadding(s, type) {
  var _a3, _b, _c;
  return (_c = (_b = (_a3 = s[`padding${type}`]) != null ? _a3 : s.paddingVertical) != null ? _b : s.padding) != null ? _c : 0;
}
function extractPadding(style, contentContainerStyle, type) {
  return getPadding(style, type) + getPadding(contentContainerStyle, type);
}
function findContainerId(ctx, key) {
  var _a3, _b;
  const directMatch = (_b = (_a3 = ctx.state) == null ? void 0 : _a3.containerItemKeys) == null ? void 0 : _b.get(key);
  if (directMatch !== void 0) {
    return directMatch;
  }
  const numContainers = peek$(ctx, "numContainers");
  for (let i = 0; i < numContainers; i++) {
    const itemKey = peek$(ctx, `containerItemKey${i}`);
    if (itemKey === key) {
      return i;
    }
  }
  return -1;
}
var getComponent = (Component) => {
  if (React3.isValidElement(Component)) {
    return Component;
  }
  if (Component) {
    return /* @__PURE__ */ React3.createElement(Component, null);
  }
  return null;
};

// src/components/PositionView.tsx
var isRNWeb = typeof document !== "undefined" && !!document.getElementById("react-native-stylesheet");
var baseCss = {
  contain: "paint layout style",
  ...isRNWeb ? {
    display: "flex",
    flexDirection: "column"
  } : {}
};
var PositionViewState = typedMemo(function PositionViewState2({
  id,
  horizontal,
  style,
  refView,
  stickyHeaderConfig,
  ...props
}) {
  const [position = POSITION_OUT_OF_VIEW] = useArr$([`containerPosition${id}`]);
  const composed = isArray(style) ? Object.assign({}, ...style) : style;
  const combinedStyle = horizontal ? { ...baseCss, ...composed, left: position } : { ...baseCss, ...composed, top: position };
  const {
    animatedScrollY: _animatedScrollY,
    index,
    onLayout: _onLayout,
    onLayoutChange: _onLayoutChange,
    stickyHeaderConfig: _stickyHeaderConfig,
    ...webProps
  } = props;
  return /* @__PURE__ */ React3.createElement("div", { "data-index": index, ref: refView, ...webProps, style: combinedStyle });
});
var PositionViewSticky = typedMemo(function PositionViewSticky2({
  id,
  horizontal,
  style,
  refView,
  index,
  animatedScrollY: _animatedScrollY,
  stickyHeaderConfig,
  onLayout: _onLayout,
  onLayoutChange: _onLayoutChange,
  children,
  ...webProps
}) {
  const [position = POSITION_OUT_OF_VIEW, activeStickyIndex] = useArr$([
    `containerPosition${id}`,
    "activeStickyIndex"
  ]);
  const composed = React3.useMemo(
    () => {
      var _a3;
      return (_a3 = isArray(style) ? Object.assign({}, ...style) : style) != null ? _a3 : {};
    },
    [style]
  );
  const viewStyle = React3.useMemo(() => {
    var _a3;
    const styleBase = { ...baseCss, ...composed };
    delete styleBase.transform;
    const offset = (_a3 = stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.offset) != null ? _a3 : 0;
    const isActive = activeStickyIndex === index;
    styleBase.position = isActive ? "sticky" : "absolute";
    styleBase.zIndex = index + 1e3;
    if (horizontal) {
      styleBase.left = isActive ? offset : position;
    } else {
      styleBase.top = isActive ? offset : position;
    }
    return styleBase;
  }, [composed, horizontal, position, index, activeStickyIndex, stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.offset]);
  const renderStickyHeaderBackdrop = React3.useMemo(() => {
    if (!(stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent)) {
      return null;
    }
    return getComponent(stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent);
  }, [stickyHeaderConfig == null ? void 0 : stickyHeaderConfig.backdropComponent]);
  return /* @__PURE__ */ React3.createElement(
    "div",
    {
      "data-index": index,
      ref: refView,
      style: viewStyle,
      ...webProps
    },
    /* @__PURE__ */ React3.createElement(
      "div",
      {
        style: {
          inset: 0,
          pointerEvents: "none",
          position: "absolute"
        }
      },
      renderStickyHeaderBackdrop
    ),
    children
  );
});
var PositionView = PositionViewState;

// src/constants-platform.ts
var IsNewArchitecture = true;
function useInit(cb) {
  useState(() => cb());
}

// src/state/ContextContainer.ts
var ContextContainer = createContext(null);
function useContextContainer() {
  return useContext(ContextContainer);
}
function useViewability(callback, configId) {
  const ctx = useStateContext();
  const containerContext = useContextContainer();
  useInit(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    const key = containerId + (configId != null ? configId : "");
    const value = ctx.mapViewabilityValues.get(key);
    if (value) {
      callback(value);
    }
  });
  useEffect(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    const key = containerId + (configId != null ? configId : "");
    ctx.mapViewabilityCallbacks.set(key, callback);
    return () => {
      ctx.mapViewabilityCallbacks.delete(key);
    };
  }, [ctx, callback, configId, containerContext]);
}
function useViewabilityAmount(callback) {
  const ctx = useStateContext();
  const containerContext = useContextContainer();
  useInit(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    const value = ctx.mapViewabilityAmountValues.get(containerId);
    if (value) {
      callback(value);
    }
  });
  useEffect(() => {
    if (!containerContext) {
      return;
    }
    const { containerId } = containerContext;
    ctx.mapViewabilityAmountCallbacks.set(containerId, callback);
    return () => {
      ctx.mapViewabilityAmountCallbacks.delete(containerId);
    };
  }, [ctx, callback, containerContext]);
}
function useRecyclingEffect(effect) {
  const containerContext = useContextContainer();
  const prevValues = useRef({
    prevIndex: void 0,
    prevItem: void 0
  });
  useEffect(() => {
    if (!containerContext) {
      return;
    }
    const { index, value } = containerContext;
    let ret;
    if (prevValues.current.prevIndex !== void 0 && prevValues.current.prevItem !== void 0) {
      ret = effect({
        index,
        item: value,
        prevIndex: prevValues.current.prevIndex,
        prevItem: prevValues.current.prevItem
      });
    }
    prevValues.current = {
      prevIndex: index,
      prevItem: value
    };
    return ret;
  }, [effect, containerContext]);
}
function useRecyclingState(valueOrFun) {
  var _a3, _b;
  const containerContext = useContextContainer();
  const computeValue = (ctx) => {
    if (isFunction(valueOrFun)) {
      const initializer = valueOrFun;
      return ctx ? initializer({
        index: ctx.index,
        item: ctx.value,
        prevIndex: void 0,
        prevItem: void 0
      }) : initializer();
    }
    return valueOrFun;
  };
  const [stateValue, setStateValue] = useState(() => {
    return computeValue(containerContext);
  });
  const prevItemKeyRef = useRef((_a3 = containerContext == null ? void 0 : containerContext.itemKey) != null ? _a3 : null);
  const currentItemKey = (_b = containerContext == null ? void 0 : containerContext.itemKey) != null ? _b : null;
  if (currentItemKey !== null && prevItemKeyRef.current !== currentItemKey) {
    prevItemKeyRef.current = currentItemKey;
    setStateValue(computeValue(containerContext));
  }
  const triggerLayout = containerContext == null ? void 0 : containerContext.triggerLayout;
  const setState = useCallback(
    (newState) => {
      if (!triggerLayout) {
        return;
      }
      setStateValue((prevValue) => {
        return isFunction(newState) ? newState(prevValue) : newState;
      });
      triggerLayout();
    },
    [triggerLayout]
  );
  return [stateValue, setState];
}
function useIsLastItem() {
  const containerContext = useContextContainer();
  const isLast = useSelector$("lastItemKeys", (lastItemKeys) => {
    if (containerContext) {
      const { itemKey } = containerContext;
      if (!isNullOrUndefined(itemKey)) {
        return (lastItemKeys == null ? void 0 : lastItemKeys.includes(itemKey)) || false;
      }
    }
    return false;
  });
  return isLast;
}
function useListScrollSize() {
  const [scrollSize] = useArr$(["scrollSize"]);
  return scrollSize;
}
var noop = () => {
};
function useSyncLayout() {
  const containerContext = useContextContainer();
  if (containerContext) {
    const { triggerLayout: syncLayout } = containerContext;
    return syncLayout;
  } else {
    return noop;
  }
}

// src/components/Separator.tsx
function Separator({ ItemSeparatorComponent, leadingItem }) {
  const isLastItem = useIsLastItem();
  return isLastItem ? null : /* @__PURE__ */ React3.createElement(ItemSeparatorComponent, { leadingItem });
}

// src/hooks/createResizeObserver.ts
var globalResizeObserver = null;
function getGlobalResizeObserver() {
  if (!globalResizeObserver) {
    globalResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callbacks = callbackMap.get(entry.target);
        if (callbacks) {
          for (const callback of callbacks) {
            callback(entry);
          }
        }
      }
    });
  }
  return globalResizeObserver;
}
var callbackMap = /* @__PURE__ */ new WeakMap();
function createResizeObserver(element, callback) {
  if (typeof ResizeObserver === "undefined") {
    return () => {
    };
  }
  if (!element) {
    return () => {
    };
  }
  const observer = getGlobalResizeObserver();
  let callbacks = callbackMap.get(element);
  if (!callbacks) {
    callbacks = /* @__PURE__ */ new Set();
    callbackMap.set(element, callbacks);
    observer.observe(element);
  }
  callbacks.add(callback);
  return () => {
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        callbackMap.delete(element);
        observer.unobserve(element);
      }
    }
  };
}

// src/hooks/useOnLayoutSync.tsx
function useOnLayoutSync({
  ref,
  onLayoutProp,
  onLayoutChange,
  webLayoutResync
}, deps) {
  useLayoutEffect(() => {
    var _a3, _b;
    const current = ref.current;
    const scrollableNode = (_b = (_a3 = current == null ? void 0 : current.getScrollableNode) == null ? void 0 : _a3.call(current)) != null ? _b : null;
    const element = scrollableNode || current;
    if (!element) {
      return;
    }
    const emit = (layout, fromLayoutEffect) => {
      if (layout.height === 0 && layout.width === 0) {
        return;
      }
      onLayoutChange(layout, fromLayoutEffect);
      onLayoutProp == null ? void 0 : onLayoutProp({ nativeEvent: { layout } });
    };
    const rect = element.getBoundingClientRect();
    emit(toLayout(rect), true);
    let prevRect = rect;
    return createResizeObserver(element, (entry) => {
      var _a4;
      const target = entry.target instanceof HTMLElement ? entry.target : void 0;
      const rectObserved = (_a4 = entry.contentRect) != null ? _a4 : target == null ? void 0 : target.getBoundingClientRect();
      const didSizeChange = rectObserved.width !== prevRect.width || rectObserved.height !== prevRect.height;
      const shouldResyncLayout = !!(webLayoutResync == null ? void 0 : webLayoutResync());
      if (didSizeChange || shouldResyncLayout) {
        prevRect = rectObserved;
        emit(toLayout(rectObserved), false);
      }
    });
  }, deps || []);
  return {};
}
function toLayout(rect) {
  if (!rect) {
    return { height: 0, width: 0, x: 0, y: 0 };
  }
  return {
    height: rect.height,
    width: rect.width,
    x: rect.left,
    y: rect.top
  };
}

// src/platform/Platform.ts
var Platform = {
  // Widen the type to avoid unreachable-branch lints in cross-platform code that compares against other OSes
  OS: "web"
};

// src/utils/hasActiveMVCPAnchorLock.ts
function hasActiveMVCPAnchorLock(state) {
  const lock = state.mvcpAnchorLock;
  if (!lock) {
    return false;
  }
  if (Date.now() > lock.expiresAt) {
    state.mvcpAnchorLock = void 0;
    return false;
  }
  return true;
}

// src/utils/isInMVCPActiveMode.ts
function isInMVCPActiveMode(state) {
  return state.dataChangeNeedsScrollUpdate || hasActiveMVCPAnchorLock(state);
}

// src/components/Container.tsx
var Container = typedMemo(function Container2({
  id,
  recycleItems,
  horizontal,
  getRenderedItem: getRenderedItem2,
  updateItemSize: updateItemSize2,
  ItemSeparatorComponent,
  stickyHeaderConfig
}) {
  const ctx = useStateContext();
  const { columnWrapperStyle, animatedScrollY } = ctx;
  const positionComponentInternal = ctx.state.props.positionComponentInternal;
  const stickyPositionComponentInternal = ctx.state.props.stickyPositionComponentInternal;
  const [column = 0, span = 1, data, itemKey, numColumns = 1, extraData, isSticky] = useArr$([
    `containerColumn${id}`,
    `containerSpan${id}`,
    `containerItemData${id}`,
    `containerItemKey${id}`,
    "numColumns",
    "extraData",
    `containerSticky${id}`
  ]);
  const itemLayoutRef = useRef({
    didLayout: false,
    horizontal,
    itemKey,
    pendingShrinkToken: 0,
    updateItemSize: updateItemSize2
  });
  itemLayoutRef.current.horizontal = horizontal;
  itemLayoutRef.current.itemKey = itemKey;
  itemLayoutRef.current.updateItemSize = updateItemSize2;
  const ref = useRef(null);
  const [layoutRenderCount, forceLayoutRender] = useState(0);
  const resolvedColumn = column > 0 ? column : 1;
  const resolvedSpan = Math.min(Math.max(span || 1, 1), numColumns);
  const otherAxisPos = numColumns > 1 ? `${(resolvedColumn - 1) / numColumns * 100}%` : 0;
  const otherAxisSize = numColumns > 1 ? `${resolvedSpan / numColumns * 100}%` : void 0;
  const style = useMemo(() => {
    let paddingStyles;
    if (columnWrapperStyle) {
      const { columnGap, rowGap, gap } = columnWrapperStyle;
      if (horizontal) {
        paddingStyles = {
          paddingBottom: numColumns > 1 ? (rowGap || gap || 0) / 2 : void 0,
          paddingRight: columnGap || gap || void 0,
          paddingTop: numColumns > 1 ? (rowGap || gap || 0) / 2 : void 0
        };
      } else {
        paddingStyles = {
          paddingBottom: rowGap || gap || void 0,
          paddingLeft: numColumns > 1 ? (columnGap || gap || 0) / 2 : void 0,
          paddingRight: numColumns > 1 ? (columnGap || gap || 0) / 2 : void 0
        };
      }
    }
    return horizontal ? {
      flexDirection: ItemSeparatorComponent ? "row" : void 0,
      height: otherAxisSize,
      left: 0,
      position: "absolute",
      top: otherAxisPos,
      ...paddingStyles || {}
    } : {
      left: otherAxisPos,
      position: "absolute",
      right: numColumns > 1 ? null : 0,
      top: 0,
      width: otherAxisSize,
      ...paddingStyles || {}
    };
  }, [horizontal, otherAxisPos, otherAxisSize, columnWrapperStyle, numColumns]);
  const renderedItemInfo = useMemo(
    () => itemKey !== void 0 ? getRenderedItem2(itemKey) : null,
    [itemKey, data, extraData]
  );
  const { index, renderedItem } = renderedItemInfo || {};
  const contextValue = useMemo(() => {
    ctx.viewRefs.set(id, ref);
    return {
      containerId: id,
      index,
      itemKey,
      triggerLayout: () => {
        forceLayoutRender((v) => v + 1);
      },
      value: data
    };
  }, [id, itemKey, index, data]);
  const onLayoutChange = useCallback((rectangle) => {
    const {
      horizontal: currentHorizontal,
      itemKey: currentItemKey,
      updateItemSize: updateItemSizeFn,
      lastSize,
      pendingShrinkToken
    } = itemLayoutRef.current;
    if (isNullOrUndefined(currentItemKey)) {
      return;
    }
    itemLayoutRef.current.didLayout = true;
    let layout = rectangle;
    const axis = currentHorizontal ? "width" : "height";
    const size = roundSize(rectangle[axis]);
    const prevSize = lastSize ? roundSize(lastSize[axis]) : void 0;
    const doUpdate = () => {
      itemLayoutRef.current.lastSize = layout;
      updateItemSizeFn(currentItemKey, layout);
      itemLayoutRef.current.didLayout = true;
    };
    const shouldDeferWebShrinkLayoutUpdate = !isInMVCPActiveMode(ctx.state) && prevSize !== void 0 && size + 1 < prevSize;
    if (shouldDeferWebShrinkLayoutUpdate) {
      const token = pendingShrinkToken + 1;
      itemLayoutRef.current.pendingShrinkToken = token;
      requestAnimationFrame(() => {
        var _a4;
        if (itemLayoutRef.current.pendingShrinkToken !== token) {
          return;
        }
        const element = ref.current;
        const rect = (_a4 = element == null ? void 0 : element.getBoundingClientRect) == null ? void 0 : _a4.call(element);
        if (rect) {
          layout = { height: rect.height, width: rect.width };
        }
        doUpdate();
      });
      return;
    }
    {
      doUpdate();
    }
  }, []);
  const { onLayout } = useOnLayoutSync(
    {
      onLayoutChange,
      ref,
      webLayoutResync: () => isInMVCPActiveMode(ctx.state)
    },
    [itemKey, layoutRenderCount]
  );
  const PositionComponent = isSticky ? stickyPositionComponentInternal ? stickyPositionComponentInternal : PositionViewSticky : positionComponentInternal ? positionComponentInternal : PositionView;
  return /* @__PURE__ */ React3.createElement(
    PositionComponent,
    {
      animatedScrollY: isSticky ? animatedScrollY : void 0,
      horizontal,
      id,
      index,
      key: recycleItems ? void 0 : itemKey,
      onLayout,
      refView: ref,
      stickyHeaderConfig,
      style
    },
    /* @__PURE__ */ React3.createElement(ContextContainer.Provider, { value: contextValue }, renderedItem, renderedItemInfo && ItemSeparatorComponent && /* @__PURE__ */ React3.createElement(Separator, { ItemSeparatorComponent, leadingItem: renderedItemInfo.item }))
  );
});

// src/utils/reordering.ts
var mapFn = (element) => {
  const indexStr = element.getAttribute("data-index");
  if (indexStr === null) {
    return [element, null];
  }
  const index = Number.parseInt(indexStr, 10);
  return [element, Number.isNaN(index) ? null : index];
};
function sortDOMElements(container) {
  const elements = Array.from(container.children);
  if (elements.length <= 1) return elements;
  const items = elements.map(mapFn);
  items.sort((a, b) => {
    const aKey = a[1];
    const bKey = b[1];
    if (aKey === null) {
      return 1;
    }
    if (bKey === null) {
      return -1;
    }
    return aKey - bKey;
  });
  const targetPositions = /* @__PURE__ */ new Map();
  items.forEach((item, index) => {
    targetPositions.set(item[0], index);
  });
  const currentPositions = elements.map((el) => targetPositions.get(el));
  const lis = findLIS(currentPositions);
  const stableIndices = new Set(lis);
  for (let targetPos = 0; targetPos < items.length; targetPos++) {
    const element = items[targetPos][0];
    const currentPos = elements.indexOf(element);
    if (!stableIndices.has(currentPos)) {
      let nextStableElement = null;
      for (let i = targetPos + 1; i < items.length; i++) {
        const nextEl = items[i][0];
        const nextCurrentPos = elements.indexOf(nextEl);
        if (stableIndices.has(nextCurrentPos)) {
          nextStableElement = nextEl;
          break;
        }
      }
      if (nextStableElement) {
        container.insertBefore(element, nextStableElement);
      } else {
        container.appendChild(element);
      }
    }
  }
}
function findLIS(arr) {
  const n = arr.length;
  const tails = [];
  const predecessors = new Array(n).fill(-1);
  const indices = [];
  for (let i = 0; i < n; i++) {
    const num = arr[i];
    let left = 0, right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[indices[mid]] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    if (left === tails.length) {
      tails.push(num);
      indices.push(i);
    } else {
      tails[left] = num;
      indices[left] = i;
    }
    if (left > 0) {
      predecessors[i] = indices[left - 1];
    }
  }
  const result = [];
  let k = indices[indices.length - 1];
  while (k !== -1) {
    result.unshift(k);
    k = predecessors[k];
  }
  return result;
}

// src/hooks/useDOMOrder.ts
function useDOMOrder(ref) {
  const ctx = useStateContext();
  const debounceRef = useRef(void 0);
  useEffect(() => {
    const unsubscribe = listen$(ctx, "lastPositionUpdate", () => {
      if (debounceRef.current !== void 0) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const parent = ref.current;
        if (parent) {
          sortDOMElements(parent);
        }
        debounceRef.current = void 0;
      }, 500);
    });
    return () => {
      unsubscribe();
      if (debounceRef.current !== void 0) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [ctx]);
}

// src/components/Containers.tsx
var ContainersInner = typedMemo(function ContainersInner2({ horizontal, numColumns, children }) {
  const ref = useRef(null);
  const ctx = useStateContext();
  const columnWrapperStyle = ctx.columnWrapperStyle;
  const [totalSize, otherAxisSize] = useArr$(["totalSize", "otherAxisSize"]);
  useDOMOrder(ref);
  const style = horizontal ? { minHeight: otherAxisSize, position: "relative", width: totalSize } : { height: totalSize, minWidth: otherAxisSize, position: "relative" };
  if (columnWrapperStyle) {
    const { columnGap, rowGap, gap, ...rest } = columnWrapperStyle;
    if (numColumns > 1) {
      const gapX = columnGap || gap || 0;
      const gapY = rowGap || gap || 0;
      if (horizontal) {
        if (gapY) {
          style.marginTop = style.marginBottom = -gapY / 2;
        }
        if (gapX) {
          style.marginRight = -gapX / 2;
        }
      } else {
        if (gapX) {
          style.marginLeft = style.marginRight = -gapX / 2;
        }
        if (gapY) {
          style.marginBottom = -gapY / 2;
        }
      }
    }
    if (Object.keys(rest).length > 0) {
      return /* @__PURE__ */ React3.createElement("div", { ref, style }, /* @__PURE__ */ React3.createElement("div", { style: { minHeight: "100%", position: "relative", ...rest } }, children));
    }
  }
  return /* @__PURE__ */ React3.createElement("div", { ref, style }, children);
});
var Containers = typedMemo(function Containers2({
  horizontal,
  recycleItems,
  ItemSeparatorComponent,
  waitForInitialLayout,
  updateItemSize: updateItemSize2,
  getRenderedItem: getRenderedItem2,
  stickyHeaderConfig
}) {
  const [numContainers, numColumns] = useArr$(["numContainersPooled", "numColumns"]);
  const containers = [];
  for (let i = 0; i < numContainers; i++) {
    containers.push(
      /* @__PURE__ */ React3.createElement(
        Container,
        {
          getRenderedItem: getRenderedItem2,
          horizontal,
          ItemSeparatorComponent,
          id: i,
          key: i,
          recycleItems,
          stickyHeaderConfig,
          updateItemSize: updateItemSize2
        }
      )
    );
  }
  return /* @__PURE__ */ React3.createElement(ContainersInner, { horizontal, numColumns, waitForInitialLayout }, containers);
});

// src/platform/StyleSheet.tsx
function flattenStyles(styles) {
  if (isArray(styles)) {
    return Object.assign({}, ...styles.filter(Boolean));
  }
  return styles;
}
var StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => flattenStyles(style)
};
function useRafCoalescer(callback) {
  const callbackRef = useRef(callback);
  const rafIdRef = useRef(void 0);
  callbackRef.current = callback;
  const coalescer = useMemo(
    () => ({
      cancel() {
        if (rafIdRef.current !== void 0) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = void 0;
        }
      },
      flush() {
        coalescer.cancel();
        callbackRef.current();
      },
      schedule() {
        if (rafIdRef.current !== void 0) {
          return false;
        }
        const rafId = requestAnimationFrame(() => {
          if (rafIdRef.current !== rafId) {
            return;
          }
          rafIdRef.current = void 0;
          callbackRef.current();
        });
        rafIdRef.current = rafId;
        return true;
      }
    }),
    []
  );
  useEffect(
    () => () => {
      coalescer.cancel();
    },
    [coalescer]
  );
  return coalescer;
}

// src/components/webScrollUtils.ts
function getDocumentScrollerNode() {
  if (typeof document === "undefined") {
    return null;
  }
  return document.scrollingElement || document.documentElement || document.body;
}
function getWindowScrollPosition() {
  var _a3, _b, _c, _d;
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }
  return {
    x: (_b = (_a3 = window.scrollX) != null ? _a3 : window.pageXOffset) != null ? _b : 0,
    y: (_d = (_c = window.scrollY) != null ? _c : window.pageYOffset) != null ? _d : 0
  };
}
function getElementDocumentPosition(element, scroll) {
  var _a3, _b;
  const rect = element == null ? void 0 : element.getBoundingClientRect();
  return {
    left: ((_a3 = rect == null ? void 0 : rect.left) != null ? _a3 : 0) + scroll.x,
    top: ((_b = rect == null ? void 0 : rect.top) != null ? _b : 0) + scroll.y
  };
}
function getContentSize2(content) {
  var _a3, _b;
  return {
    height: (_a3 = content == null ? void 0 : content.scrollHeight) != null ? _a3 : 0,
    width: (_b = content == null ? void 0 : content.scrollWidth) != null ? _b : 0
  };
}
function getScrollContentSize(scrollElement, contentElement, isWindowScroll) {
  return getContentSize2(isWindowScroll ? contentElement : scrollElement);
}
function getLayoutMeasurement(scrollElement, isWindowScroll, horizontal) {
  var _a3, _b, _c, _d, _e, _f;
  if (isWindowScroll && typeof window !== "undefined") {
    const rect = scrollElement == null ? void 0 : scrollElement.getBoundingClientRect();
    return {
      // In window-scroll mode, use viewport size on the scroll axis.
      height: horizontal ? (_b = (_a3 = rect == null ? void 0 : rect.height) != null ? _a3 : scrollElement == null ? void 0 : scrollElement.clientHeight) != null ? _b : window.innerHeight : window.innerHeight,
      // Keep the cross-axis size list-relative to avoid inflating container measurements.
      width: horizontal ? window.innerWidth : (_d = (_c = rect == null ? void 0 : rect.width) != null ? _c : scrollElement == null ? void 0 : scrollElement.clientWidth) != null ? _d : window.innerWidth
    };
  }
  return {
    height: (_e = scrollElement == null ? void 0 : scrollElement.clientHeight) != null ? _e : 0,
    width: (_f = scrollElement == null ? void 0 : scrollElement.clientWidth) != null ? _f : 0
  };
}
function clampOffset(offset, maxOffset) {
  return Math.max(0, Math.min(offset, maxOffset));
}
function getAxisSize(size, horizontal) {
  return horizontal ? size.width : size.height;
}
function getMaxOffset(contentSize, layoutMeasurement, horizontal) {
  return Math.max(0, getAxisSize(contentSize, horizontal) - getAxisSize(layoutMeasurement, horizontal));
}
function resolveScrollableNode(scrollElement, isWindowScroll) {
  return isWindowScroll ? getDocumentScrollerNode() || scrollElement : scrollElement;
}
function resolveScrollEventTarget(scrollElement, isWindowScroll) {
  return isWindowScroll && typeof window !== "undefined" ? window : scrollElement;
}
function getLayoutRectangle(element, isWindowScroll, horizontal) {
  const rect = element.getBoundingClientRect();
  const scroll = getWindowScrollPosition();
  return {
    height: isWindowScroll && typeof window !== "undefined" && !horizontal ? window.innerHeight : rect.height,
    width: isWindowScroll && typeof window !== "undefined" && horizontal ? window.innerWidth : rect.width,
    x: isWindowScroll ? rect.left + scroll.x : rect.left,
    y: isWindowScroll ? rect.top + scroll.y : rect.top
  };
}
function resolveWindowScrollTarget({ clampedOffset, horizontal, listPos, scroll }) {
  return {
    left: horizontal ? listPos.left + clampedOffset : scroll.x,
    top: horizontal ? scroll.y : listPos.top + clampedOffset
  };
}

// src/components/ListComponentScrollView.tsx
var ListComponentScrollView = forwardRef(function ListComponentScrollView2({
  children,
  style,
  contentContainerStyle,
  horizontal = false,
  contentOffset,
  maintainVisibleContentPosition,
  onScroll: onScroll2,
  onMomentumScrollEnd: _onMomentumScrollEnd,
  showsHorizontalScrollIndicator = true,
  showsVerticalScrollIndicator = true,
  refreshControl,
  useWindowScroll = false,
  onLayout,
  ...props
}, ref) {
  const ctx = useStateContext();
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const isWindowScroll = useWindowScroll;
  const getScrollTarget = useCallback(
    () => resolveScrollEventTarget(scrollRef.current, isWindowScroll),
    [isWindowScroll]
  );
  const getMaxScrollOffset = useCallback(() => {
    const scrollElement = scrollRef.current;
    const contentSize = getScrollContentSize(scrollElement, contentRef.current, isWindowScroll);
    const layoutMeasurement = getLayoutMeasurement(scrollElement, isWindowScroll, horizontal);
    return getMaxOffset(contentSize, layoutMeasurement, horizontal);
  }, [horizontal, isWindowScroll]);
  const getCurrentScrollOffset = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (isWindowScroll) {
      const maxOffset = getMaxScrollOffset();
      const scroll = getWindowScrollPosition();
      const listPos = getElementDocumentPosition(scrollElement, scroll);
      const rawOffset = horizontal ? scroll.x - listPos.left : scroll.y - listPos.top;
      return clampOffset(rawOffset, maxOffset);
    }
    if (!scrollElement) {
      return 0;
    }
    return horizontal ? scrollElement.scrollLeft : scrollElement.scrollTop;
  }, [getMaxScrollOffset, horizontal, isWindowScroll]);
  const scrollToLocalOffset = useCallback(
    (offset, animated) => {
      const scrollElement = scrollRef.current;
      const target = getScrollTarget();
      if (!target || typeof target.scrollTo !== "function") {
        return;
      }
      const maxOffset = getMaxScrollOffset();
      const clampedOffset = clampOffset(offset, maxOffset);
      const behavior = animated ? "smooth" : "auto";
      const options = { behavior };
      if (isWindowScroll) {
        const scroll = getWindowScrollPosition();
        const listPos = getElementDocumentPosition(scrollElement, scroll);
        const { left, top } = resolveWindowScrollTarget({
          clampedOffset,
          horizontal,
          listPos,
          scroll
        });
        options.left = left;
        options.top = top;
      } else if (horizontal) {
        options.left = clampedOffset;
      } else {
        options.top = clampedOffset;
      }
      target.scrollTo(options);
    },
    [getMaxScrollOffset, getScrollTarget, horizontal, isWindowScroll]
  );
  useImperativeHandle(ref, () => {
    const api = {
      getBoundingClientRect: () => {
        var _a3;
        return (_a3 = scrollRef.current) == null ? void 0 : _a3.getBoundingClientRect();
      },
      getContentNode: () => contentRef.current,
      getCurrentScrollOffset,
      getScrollableNode: () => resolveScrollableNode(scrollRef.current, isWindowScroll),
      getScrollEventTarget: () => getScrollTarget(),
      getScrollResponder: () => resolveScrollableNode(scrollRef.current, isWindowScroll),
      isWindowScroll: () => isWindowScroll,
      scrollBy: (x, y) => {
        const target = getScrollTarget();
        if (!target || typeof target.scrollBy !== "function") {
          return;
        }
        target.scrollBy({ behavior: "auto", left: x, top: y });
      },
      scrollTo: (options) => {
        const { x = 0, y = 0, animated = true } = options;
        scrollToLocalOffset(horizontal ? x : y, animated);
      },
      scrollToEnd: (options = {}) => {
        const { animated = true } = options;
        const endOffset = getMaxScrollOffset();
        scrollToLocalOffset(endOffset, animated);
      },
      scrollToOffset: (params) => {
        const { offset, animated = true } = params;
        scrollToLocalOffset(offset, animated);
      }
    };
    return api;
  }, [getCurrentScrollOffset, getMaxScrollOffset, getScrollTarget, horizontal, isWindowScroll, scrollToLocalOffset]);
  const emitScroll = useCallback(() => {
    if (!onScroll2 || !scrollRef.current) {
      return;
    }
    const contentSize = getContentSize2(contentRef.current);
    const layoutMeasurement = getLayoutMeasurement(scrollRef.current, isWindowScroll, horizontal);
    const offset = getCurrentScrollOffset();
    const scrollEvent = {
      nativeEvent: {
        contentOffset: {
          x: horizontal ? offset : 0,
          y: horizontal ? 0 : offset
        },
        contentSize: {
          height: contentSize.height,
          width: contentSize.width
        },
        layoutMeasurement: {
          height: layoutMeasurement.height,
          width: layoutMeasurement.width
        }
      }
    };
    onScroll2(scrollEvent);
  }, [getCurrentScrollOffset, horizontal, isWindowScroll, onScroll2]);
  const scrollEventCoalescer = useRafCoalescer(emitScroll);
  const handleScroll = useCallback(
    (_event) => {
      var _a3;
      if (!onScroll2) {
        return;
      }
      const scrollingTo = (_a3 = ctx.state) == null ? void 0 : _a3.scrollingTo;
      if (scrollingTo && !scrollingTo.animated) {
        scrollEventCoalescer.flush();
      } else {
        scrollEventCoalescer.schedule();
      }
    },
    [onScroll2, scrollEventCoalescer]
  );
  useLayoutEffect(() => {
    const target = getScrollTarget();
    if (!target) return;
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", handleScroll);
      scrollEventCoalescer.cancel();
    };
  }, [getScrollTarget, handleScroll, scrollEventCoalescer]);
  useEffect(() => {
    const doScroll = () => {
      if (contentOffset) {
        scrollToLocalOffset(horizontal ? contentOffset.x || 0 : contentOffset.y || 0, false);
      }
    };
    doScroll();
    requestAnimationFrame(doScroll);
  }, [contentOffset == null ? void 0 : contentOffset.x, contentOffset == null ? void 0 : contentOffset.y, horizontal, scrollToLocalOffset]);
  useLayoutEffect(() => {
    if (!onLayout || !scrollRef.current) return;
    const element = scrollRef.current;
    const fireLayout = () => {
      onLayout({
        nativeEvent: {
          layout: getLayoutRectangle(element, isWindowScroll, horizontal)
        }
      });
    };
    fireLayout();
    const resizeObserver = new ResizeObserver(() => {
      fireLayout();
    });
    resizeObserver.observe(element);
    const onWindowResize = () => {
      fireLayout();
    };
    if (isWindowScroll && typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener("resize", onWindowResize);
    }
    return () => {
      resizeObserver.disconnect();
      if (isWindowScroll && typeof window !== "undefined" && typeof window.removeEventListener === "function") {
        window.removeEventListener("resize", onWindowResize);
      }
    };
  }, [isWindowScroll, onLayout]);
  const scrollViewStyle = {
    ...isWindowScroll ? {} : {
      overflow: "auto",
      overflowX: horizontal ? "auto" : showsHorizontalScrollIndicator ? "auto" : "hidden",
      overflowY: horizontal ? showsVerticalScrollIndicator ? "auto" : "hidden" : "auto",
      WebkitOverflowScrolling: "touch"
      // iOS momentum scrolling
    },
    ...StyleSheet.flatten(style)
  };
  const contentStyle = {
    display: horizontal ? "flex" : "block",
    flexDirection: horizontal ? "row" : void 0,
    minHeight: horizontal ? void 0 : "100%",
    minWidth: horizontal ? "100%" : void 0,
    ...StyleSheet.flatten(contentContainerStyle)
  };
  const {
    contentInset: _contentInset,
    scrollEventThrottle: _scrollEventThrottle,
    ScrollComponent: _ScrollComponent,
    useWindowScroll: _useWindowScroll,
    ...webProps
  } = props;
  return /* @__PURE__ */ React3.createElement("div", { ref: scrollRef, ...webProps, style: scrollViewStyle }, refreshControl, /* @__PURE__ */ React3.createElement("div", { ref: contentRef, style: contentStyle }, children));
});
function useValueListener$(key, callback) {
  const ctx = useStateContext();
  useLayoutEffect(() => {
    const unsubscribe = listen$(ctx, key, (value) => {
      callback(value);
    });
    return unsubscribe;
  }, [callback, ctx, key]);
}

// src/components/ScrollAdjust.tsx
function ScrollAdjust() {
  const ctx = useStateContext();
  const lastScrollOffsetRef = React3.useRef(0);
  const resetPaddingRafRef = React3.useRef(void 0);
  const callback = React3.useCallback(() => {
    var _a3;
    const scrollAdjust = peek$(ctx, "scrollAdjust");
    const scrollAdjustUserOffset = peek$(ctx, "scrollAdjustUserOffset");
    const scrollOffset = (scrollAdjust || 0) + (scrollAdjustUserOffset || 0);
    const scrollView = (_a3 = ctx.state) == null ? void 0 : _a3.refScroller.current;
    if (scrollView && scrollOffset !== lastScrollOffsetRef.current) {
      const scrollDelta = scrollOffset - lastScrollOffsetRef.current;
      if (scrollDelta !== 0) {
        const contentNode = scrollView.getContentNode();
        const prevScroll = scrollView.getCurrentScrollOffset();
        const el = scrollView.getScrollableNode();
        if (!contentNode) {
          scrollView.scrollBy(0, scrollDelta);
          lastScrollOffsetRef.current = scrollOffset;
          return;
        }
        const totalSize = contentNode.scrollHeight;
        const viewportSize = el.clientHeight;
        const nextScroll = prevScroll + scrollDelta;
        if (scrollDelta > 0 && !ctx.state.adjustingFromInitialMount && totalSize < nextScroll + viewportSize) {
          const paddingBottom = ctx.state.props.stylePaddingBottom || 0;
          const pad = (nextScroll + viewportSize - totalSize) * 2;
          contentNode.style.paddingBottom = `${pad}px`;
          void contentNode.offsetHeight;
          scrollView.scrollBy(0, scrollDelta);
          if (resetPaddingRafRef.current !== void 0) {
            cancelAnimationFrame(resetPaddingRafRef.current);
          }
          resetPaddingRafRef.current = requestAnimationFrame(() => {
            resetPaddingRafRef.current = void 0;
            contentNode.style.paddingBottom = paddingBottom ? `${paddingBottom}px` : "0";
          });
        } else {
          scrollView.scrollBy(0, scrollDelta);
        }
      }
      lastScrollOffsetRef.current = scrollOffset;
    }
  }, [ctx]);
  useValueListener$("scrollAdjust", callback);
  useValueListener$("scrollAdjustUserOffset", callback);
  return null;
}
function SnapWrapper({ ScrollComponent, ...props }) {
  const [snapToOffsets] = useArr$(["snapToOffsets"]);
  return /* @__PURE__ */ React3.createElement(ScrollComponent, { ...props, snapToOffsets });
}
var LayoutView = ({ onLayoutChange, refView, children, ...rest }) => {
  const ref = refView != null ? refView : useRef(null);
  useOnLayoutSync({ onLayoutChange, ref });
  return /* @__PURE__ */ React3.createElement("div", { ...rest, ref }, children);
};

// src/components/ListComponent.tsx
var ListComponent = typedMemo(function ListComponent2({
  canRender,
  style,
  contentContainerStyle,
  horizontal,
  initialContentOffset,
  recycleItems,
  ItemSeparatorComponent,
  alignItemsAtEnd: _alignItemsAtEnd,
  waitForInitialLayout,
  onScroll: onScroll2,
  onLayout,
  ListHeaderComponent,
  ListHeaderComponentStyle,
  ListFooterComponent,
  ListFooterComponentStyle,
  ListEmptyComponent,
  getRenderedItem: getRenderedItem2,
  updateItemSize: updateItemSize2,
  refScrollView,
  renderScrollComponent,
  onLayoutFooter,
  scrollAdjustHandler,
  snapToIndices,
  stickyHeaderConfig,
  stickyHeaderIndices,
  useWindowScroll = false,
  ...rest
}) {
  const ctx = useStateContext();
  const maintainVisibleContentPosition = ctx.state.props.maintainVisibleContentPosition;
  const ScrollComponent = renderScrollComponent ? useMemo(
    () => React3.forwardRef(
      (props, ref) => renderScrollComponent({ ...props, ref })
    ),
    [renderScrollComponent]
  ) : ListComponentScrollView;
  const SnapOrScroll = snapToIndices ? SnapWrapper : ScrollComponent;
  useLayoutEffect(() => {
    if (!ListHeaderComponent) {
      set$(ctx, "headerSize", 0);
    }
    if (!ListFooterComponent) {
      set$(ctx, "footerSize", 0);
    }
  }, [ListHeaderComponent, ListFooterComponent, ctx]);
  const onLayoutHeader = useCallback(
    (rect) => {
      const size = rect[horizontal ? "width" : "height"];
      set$(ctx, "headerSize", size);
    },
    [ctx, horizontal]
  );
  const onLayoutFooterInternal = useCallback(
    (rect, fromLayoutEffect) => {
      const size = rect[horizontal ? "width" : "height"];
      set$(ctx, "footerSize", size);
      onLayoutFooter == null ? void 0 : onLayoutFooter(rect, fromLayoutEffect);
    },
    [ctx, horizontal, onLayoutFooter]
  );
  return /* @__PURE__ */ React3.createElement(
    SnapOrScroll,
    {
      ...rest,
      ...ScrollComponent === ListComponentScrollView ? { useWindowScroll } : {},
      contentContainerStyle: [
        contentContainerStyle,
        horizontal ? {
          height: "100%"
        } : {}
      ],
      contentOffset: initialContentOffset ? horizontal ? { x: initialContentOffset, y: 0 } : { x: 0, y: initialContentOffset } : void 0,
      horizontal,
      maintainVisibleContentPosition: maintainVisibleContentPosition.size || maintainVisibleContentPosition.data ? { minIndexForVisible: 0 } : void 0,
      onLayout,
      onScroll: onScroll2,
      ref: refScrollView,
      ScrollComponent: snapToIndices ? ScrollComponent : void 0,
      style
    },
    /* @__PURE__ */ React3.createElement(ScrollAdjust, null),
    ListHeaderComponent && /* @__PURE__ */ React3.createElement(LayoutView, { onLayoutChange: onLayoutHeader, style: ListHeaderComponentStyle }, getComponent(ListHeaderComponent)),
    ListEmptyComponent && getComponent(ListEmptyComponent),
    canRender && !ListEmptyComponent && /* @__PURE__ */ React3.createElement(
      Containers,
      {
        getRenderedItem: getRenderedItem2,
        horizontal,
        ItemSeparatorComponent,
        recycleItems,
        stickyHeaderConfig,
        updateItemSize: updateItemSize2,
        waitForInitialLayout
      }
    ),
    ListFooterComponent && /* @__PURE__ */ React3.createElement(LayoutView, { onLayoutChange: onLayoutFooterInternal, style: ListFooterComponentStyle }, getComponent(ListFooterComponent)),
    IS_DEV && ENABLE_DEVMODE
  );
});

// src/core/calculateOffsetForIndex.ts
function calculateOffsetForIndex(ctx, index) {
  const state = ctx.state;
  return index !== void 0 ? state.positions[index] || 0 : 0;
}

// src/core/getTopOffsetAdjustment.ts
function getTopOffsetAdjustment(ctx) {
  return (peek$(ctx, "stylePaddingTop") || 0) + (peek$(ctx, "headerSize") || 0);
}

// src/utils/getId.ts
function getId(state, index) {
  const { data, keyExtractor } = state.props;
  if (!data) {
    return "";
  }
  const ret = index < data.length ? keyExtractor ? keyExtractor(data[index], index) : index : null;
  const id = ret;
  state.idCache[index] = id;
  return id;
}

// src/core/addTotalSize.ts
function addTotalSize(ctx, key, add) {
  const state = ctx.state;
  const prevTotalSize = state.totalSize;
  let totalSize = state.totalSize;
  if (key === null) {
    totalSize = add;
    if (state.timeoutSetPaddingTop) {
      clearTimeout(state.timeoutSetPaddingTop);
      state.timeoutSetPaddingTop = void 0;
    }
  } else {
    totalSize += add;
  }
  if (prevTotalSize !== totalSize) {
    {
      state.pendingTotalSize = void 0;
      state.totalSize = totalSize;
      set$(ctx, "totalSize", totalSize);
    }
  }
}

// src/core/setSize.ts
function setSize(ctx, itemKey, size) {
  const state = ctx.state;
  const { sizes } = state;
  const previousSize = sizes.get(itemKey);
  const diff = previousSize !== void 0 ? size - previousSize : size;
  if (diff !== 0) {
    addTotalSize(ctx, itemKey, diff);
  }
  sizes.set(itemKey, size);
}

// src/utils/getItemSize.ts
function getItemSize(ctx, key, index, data, useAverageSize, preferCachedSize) {
  var _a3, _b;
  const state = ctx.state;
  const {
    sizesKnown,
    sizes,
    averageSizes,
    props: { estimatedItemSize, getEstimatedItemSize, getFixedItemSize, getItemType },
    scrollingTo
  } = state;
  const sizeKnown = sizesKnown.get(key);
  if (sizeKnown !== void 0) {
    return sizeKnown;
  }
  let size;
  if (preferCachedSize) {
    const cachedSize = sizes.get(key);
    if (cachedSize !== void 0) {
      return cachedSize;
    }
  }
  const itemType = getItemType ? (_a3 = getItemType(data, index)) != null ? _a3 : "" : "";
  if (getFixedItemSize) {
    size = getFixedItemSize(data, index, itemType);
    if (size !== void 0) {
      sizesKnown.set(key, size);
    }
  }
  if (size === void 0 && useAverageSize && sizeKnown === void 0 && !scrollingTo) {
    const averageSizeForType = (_b = averageSizes[itemType]) == null ? void 0 : _b.avg;
    if (averageSizeForType !== void 0) {
      size = roundSize(averageSizeForType);
    }
  }
  if (size === void 0) {
    size = sizes.get(key);
    if (size !== void 0) {
      return size;
    }
  }
  if (size === void 0) {
    size = getEstimatedItemSize ? getEstimatedItemSize(data, index, itemType) : estimatedItemSize;
  }
  setSize(ctx, key, size);
  return size;
}

// src/core/calculateOffsetWithOffsetPosition.ts
function calculateOffsetWithOffsetPosition(ctx, offsetParam, params) {
  var _a3;
  const state = ctx.state;
  const { index, viewOffset, viewPosition } = params;
  let offset = offsetParam;
  if (viewOffset) {
    offset -= viewOffset;
  }
  if (index !== void 0) {
    const topOffsetAdjustment = getTopOffsetAdjustment(ctx);
    if (topOffsetAdjustment) {
      offset += topOffsetAdjustment;
    }
  }
  if (viewPosition !== void 0 && index !== void 0) {
    const dataLength = state.props.data.length;
    if (dataLength === 0) {
      return offset;
    }
    const isOutOfBounds = index < 0 || index >= dataLength;
    const fallbackEstimatedSize = (_a3 = state.props.estimatedItemSize) != null ? _a3 : 0;
    const itemSize = isOutOfBounds ? fallbackEstimatedSize : getItemSize(ctx, getId(state, index), index, state.props.data[index]);
    const trailingInset = getContentInsetEnd(state);
    offset -= viewPosition * (state.scrollLength - trailingInset - itemSize);
    if (!isOutOfBounds && index === state.props.data.length - 1) {
      const footerSize = peek$(ctx, "footerSize") || 0;
      offset += footerSize;
    }
  }
  return offset;
}

// src/core/clampScrollOffset.ts
function clampScrollOffset(ctx, offset, scrollTarget) {
  const state = ctx.state;
  const contentSize = getContentSize(ctx);
  let clampedOffset = offset;
  if (Number.isFinite(contentSize) && Number.isFinite(state.scrollLength) && (Platform.OS !== "android")) {
    const baseMaxOffset = Math.max(0, contentSize - state.scrollLength);
    const viewOffset = scrollTarget == null ? void 0 : scrollTarget.viewOffset;
    const extraEndOffset = typeof viewOffset === "number" && viewOffset < 0 ? -viewOffset : 0;
    const maxOffset = baseMaxOffset + extraEndOffset;
    clampedOffset = Math.min(offset, maxOffset);
  }
  clampedOffset = Math.max(0, clampedOffset);
  return clampedOffset;
}

// src/utils/checkThreshold.ts
var HYSTERESIS_MULTIPLIER = 1.3;
var checkThreshold = (distance, atThreshold, threshold, wasReached, snapshot, context, onReached, setSnapshot, allowReentryOnChange) => {
  const absDistance = Math.abs(distance);
  const within = atThreshold || threshold > 0 && absDistance <= threshold;
  const updateSnapshot = () => {
    setSnapshot({
      atThreshold,
      contentSize: context.contentSize,
      dataLength: context.dataLength,
      scrollPosition: context.scrollPosition
    });
  };
  if (!wasReached) {
    if (!within) {
      return false;
    }
    onReached(distance);
    updateSnapshot();
    return true;
  }
  const reset = !atThreshold && threshold > 0 && absDistance >= threshold * HYSTERESIS_MULTIPLIER || !atThreshold && threshold <= 0 && absDistance > 0;
  if (reset) {
    setSnapshot(void 0);
    return false;
  }
  if (within) {
    const changed = !snapshot || snapshot.atThreshold !== atThreshold || snapshot.contentSize !== context.contentSize || snapshot.dataLength !== context.dataLength;
    if (changed) {
      if (allowReentryOnChange) {
        onReached(distance);
      }
      updateSnapshot();
    }
  }
  return true;
};

// src/utils/checkAtBottom.ts
function checkAtBottom(ctx) {
  var _a3;
  const state = ctx.state;
  if (!state || state.initialScroll) {
    return;
  }
  const {
    queuedInitialLayout,
    scrollLength,
    scroll,
    maintainingScrollAtEnd,
    props: { maintainScrollAtEndThreshold, onEndReachedThreshold }
  } = state;
  if (state.initialScroll) {
    return;
  }
  const contentSize = getContentSize(ctx);
  if (contentSize > 0 && queuedInitialLayout && !maintainingScrollAtEnd) {
    const insetEnd = getContentInsetEnd(state);
    const distanceFromEnd = contentSize - scroll - scrollLength - insetEnd;
    const isContentLess = contentSize < scrollLength;
    state.isAtEnd = isContentLess || distanceFromEnd < scrollLength * maintainScrollAtEndThreshold;
    state.isEndReached = checkThreshold(
      distanceFromEnd,
      isContentLess,
      onEndReachedThreshold * scrollLength,
      state.isEndReached,
      state.endReachedSnapshot,
      {
        contentSize,
        dataLength: (_a3 = state.props.data) == null ? void 0 : _a3.length,
        scrollPosition: scroll
      },
      (distance) => {
        var _a4, _b;
        return (_b = (_a4 = state.props).onEndReached) == null ? void 0 : _b.call(_a4, { distanceFromEnd: distance });
      },
      (snapshot) => {
        state.endReachedSnapshot = snapshot;
      },
      true
    );
  }
}

// src/utils/checkAtTop.ts
function checkAtTop(ctx) {
  const state = ctx == null ? void 0 : ctx.state;
  if (!state || state.initialScroll || state.scrollingTo) {
    return;
  }
  const {
    dataChangeEpoch,
    isStartReached,
    props: { data, onStartReachedThreshold },
    scroll,
    scrollLength,
    startReachedSnapshot,
    startReachedSnapshotDataChangeEpoch,
    totalSize
  } = state;
  const dataLength = data.length;
  const threshold = onStartReachedThreshold * scrollLength;
  const dataChanged = startReachedSnapshotDataChangeEpoch !== dataChangeEpoch;
  const withinThreshold = threshold > 0 && Math.abs(scroll) <= threshold;
  const allowReentryOnDataChange = !!isStartReached && withinThreshold && !!dataChanged && !isInMVCPActiveMode(state);
  if (isStartReached && threshold > 0 && scroll > threshold && startReachedSnapshot && (dataChanged || startReachedSnapshot.contentSize !== totalSize || startReachedSnapshot.dataLength !== dataLength)) {
    state.isStartReached = false;
    state.startReachedSnapshot = void 0;
    state.startReachedSnapshotDataChangeEpoch = void 0;
  }
  state.isAtStart = scroll <= 0;
  if (isStartReached && withinThreshold && dataChanged && !allowReentryOnDataChange) {
    return;
  }
  state.isStartReached = checkThreshold(
    scroll,
    false,
    threshold,
    state.isStartReached,
    allowReentryOnDataChange ? void 0 : startReachedSnapshot,
    {
      contentSize: totalSize,
      dataLength,
      scrollPosition: scroll
    },
    (distance) => {
      var _a3, _b;
      return (_b = (_a3 = state.props).onStartReached) == null ? void 0 : _b.call(_a3, { distanceFromStart: distance });
    },
    (snapshot) => {
      state.startReachedSnapshot = snapshot;
      state.startReachedSnapshotDataChangeEpoch = snapshot ? dataChangeEpoch : void 0;
    },
    allowReentryOnDataChange
  );
}

// src/utils/checkThresholds.ts
function checkThresholds(ctx) {
  checkAtBottom(ctx);
  checkAtTop(ctx);
}

// src/utils/setInitialRenderState.ts
function setInitialRenderState(ctx, {
  didLayout,
  didInitialScroll
}) {
  const { state } = ctx;
  const {
    loadStartTime,
    props: { onLoad }
  } = state;
  if (didLayout) {
    state.didContainersLayout = true;
  }
  if (didInitialScroll) {
    state.didFinishInitialScroll = true;
  }
  const isReadyToRender = Boolean(state.didContainersLayout && state.didFinishInitialScroll);
  if (isReadyToRender && !peek$(ctx, "readyToRender")) {
    set$(ctx, "readyToRender", true);
    if (onLoad) {
      onLoad({ elapsedTimeInMs: Date.now() - loadStartTime });
    }
  }
}

// src/core/finishScrollTo.ts
function finishScrollTo(ctx) {
  var _a3, _b;
  const state = ctx.state;
  if (state == null ? void 0 : state.scrollingTo) {
    const resolvePendingScroll = state.pendingScrollResolve;
    state.pendingScrollResolve = void 0;
    const scrollingTo = state.scrollingTo;
    state.scrollHistory.length = 0;
    state.initialScroll = void 0;
    state.initialScrollUsesOffset = false;
    state.initialAnchor = void 0;
    state.initialNativeScrollWatchdog = void 0;
    state.scrollingTo = void 0;
    if (state.pendingTotalSize !== void 0) {
      addTotalSize(ctx, null, state.pendingTotalSize);
    }
    if ((_a3 = state.props) == null ? void 0 : _a3.data) {
      (_b = state.triggerCalculateItemsInView) == null ? void 0 : _b.call(state, { forceFullItemPositions: true });
    }
    {
      state.scrollAdjustHandler.commitPendingAdjust(scrollingTo);
    }
    setInitialRenderState(ctx, { didInitialScroll: true });
    checkThresholds(ctx);
    resolvePendingScroll == null ? void 0 : resolvePendingScroll();
  }
}

// src/core/doScrollTo.ts
var SCROLL_END_IDLE_MS = 80;
var SCROLL_END_MAX_MS = 1500;
var SMOOTH_SCROLL_DURATION_MS = 320;
var SCROLL_END_TARGET_EPSILON = 1;
function doScrollTo(ctx, params) {
  const state = ctx.state;
  const { animated, horizontal, offset } = params;
  const scroller = state.refScroller.current;
  const node = scroller == null ? void 0 : scroller.getScrollableNode();
  if (!scroller || !node) {
    return;
  }
  const isAnimated = !!animated;
  const isHorizontal = !!horizontal;
  const left = isHorizontal ? offset : 0;
  const top = isHorizontal ? 0 : offset;
  scroller.scrollTo({ animated: isAnimated, x: left, y: top });
  if (isAnimated) {
    const target = scroller.getScrollEventTarget();
    listenForScrollEnd(ctx, {
      readOffset: () => scroller.getCurrentScrollOffset(),
      target,
      targetOffset: offset
    });
  } else {
    state.scroll = offset;
    setTimeout(() => {
      finishScrollTo(ctx);
    }, 100);
  }
}
function listenForScrollEnd(ctx, params) {
  const { readOffset, target, targetOffset } = params;
  if (!target) {
    finishScrollTo(ctx);
    return;
  }
  const supportsScrollEnd = "onscrollend" in target;
  let idleTimeout;
  let settled = false;
  const targetToken = ctx.state.scrollingTo;
  const maxTimeout = setTimeout(() => finish("max"), SCROLL_END_MAX_MS);
  const cleanup = () => {
    target.removeEventListener("scroll", onScroll2);
    if (supportsScrollEnd) {
      target.removeEventListener("scrollend", onScrollEnd);
    }
    if (idleTimeout) {
      clearTimeout(idleTimeout);
    }
    clearTimeout(maxTimeout);
  };
  const finish = (reason) => {
    if (settled) return;
    if (targetToken !== ctx.state.scrollingTo) {
      settled = true;
      cleanup();
      return;
    }
    const currentOffset = readOffset();
    const isNearTarget = Math.abs(currentOffset - targetOffset) <= SCROLL_END_TARGET_EPSILON;
    if (reason === "scrollend" && !isNearTarget) {
      return;
    }
    settled = true;
    cleanup();
    finishScrollTo(ctx);
  };
  const onScroll2 = () => {
    if (idleTimeout) {
      clearTimeout(idleTimeout);
    }
    idleTimeout = setTimeout(() => finish("idle"), SCROLL_END_IDLE_MS);
  };
  const onScrollEnd = () => finish("scrollend");
  target.addEventListener("scroll", onScroll2);
  if (supportsScrollEnd) {
    target.addEventListener("scrollend", onScrollEnd);
  } else {
    idleTimeout = setTimeout(() => finish("idle"), SMOOTH_SCROLL_DURATION_MS);
  }
}

// src/core/scrollTo.ts
var WATCHDOG_OFFSET_EPSILON = 1;
function scrollTo(ctx, params) {
  var _a3, _b;
  const state = ctx.state;
  const { noScrollingTo, forceScroll, ...scrollTarget } = params;
  const { animated, isInitialScroll, offset: scrollTargetOffset, precomputedWithViewOffset } = scrollTarget;
  const {
    props: { horizontal }
  } = state;
  if (state.animFrameCheckFinishedScroll) {
    cancelAnimationFrame(ctx.state.animFrameCheckFinishedScroll);
  }
  if (state.timeoutCheckFinishedScrollFallback) {
    clearTimeout(ctx.state.timeoutCheckFinishedScrollFallback);
  }
  let offset = precomputedWithViewOffset ? scrollTargetOffset : calculateOffsetWithOffsetPosition(ctx, scrollTargetOffset, scrollTarget);
  offset = clampScrollOffset(ctx, offset, scrollTarget);
  state.scrollHistory.length = 0;
  if (!noScrollingTo) {
    state.scrollingTo = {
      ...scrollTarget,
      targetOffset: offset
    };
  }
  state.scrollPending = offset;
  const shouldWatchInitialNativeScroll = !state.didFinishInitialScroll && (isInitialScroll || !!state.initialNativeScrollWatchdog) && offset > WATCHDOG_OFFSET_EPSILON;
  const shouldClearInitialNativeScrollWatchdog = !state.didFinishInitialScroll && !!state.initialNativeScrollWatchdog && offset <= WATCHDOG_OFFSET_EPSILON;
  if (shouldWatchInitialNativeScroll) {
    state.hasScrolled = false;
    state.initialNativeScrollWatchdog = {
      startScroll: (_b = (_a3 = state.initialNativeScrollWatchdog) == null ? void 0 : _a3.startScroll) != null ? _b : state.scroll,
      targetOffset: offset
    };
  } else if (shouldClearInitialNativeScrollWatchdog) {
    state.initialNativeScrollWatchdog = void 0;
  }
  if (forceScroll || !isInitialScroll || Platform.OS === "android") {
    doScrollTo(ctx, { animated, horizontal, offset });
  } else {
    state.scroll = offset;
  }
}

// src/core/doMaintainScrollAtEnd.ts
function doMaintainScrollAtEnd(ctx) {
  const state = ctx.state;
  const {
    didContainersLayout,
    isAtEnd,
    pendingNativeMVCPAdjust,
    refScroller,
    props: { maintainScrollAtEnd }
  } = state;
  const shouldMaintainScrollAtEnd = !!(isAtEnd && maintainScrollAtEnd && didContainersLayout);
  if (pendingNativeMVCPAdjust) {
    state.pendingMaintainScrollAtEnd = shouldMaintainScrollAtEnd;
    return false;
  }
  state.pendingMaintainScrollAtEnd = false;
  if (shouldMaintainScrollAtEnd) {
    const contentSize = getContentSize(ctx);
    if (contentSize < state.scrollLength) {
      state.scroll = 0;
    }
    requestAnimationFrame(() => {
      var _a3;
      if (state.isAtEnd) {
        state.maintainingScrollAtEnd = true;
        (_a3 = refScroller.current) == null ? void 0 : _a3.scrollToEnd({
          animated: maintainScrollAtEnd.animated
        });
        setTimeout(
          () => {
            state.maintainingScrollAtEnd = false;
          },
          maintainScrollAtEnd.animated ? 500 : 0
        );
      }
    });
    return true;
  }
  return false;
}

// src/core/mvcp.ts
var MVCP_POSITION_EPSILON = 0.1;
var MVCP_ANCHOR_LOCK_TTL_MS = 300;
var MVCP_ANCHOR_LOCK_QUIET_PASSES_TO_RELEASE = 2;
var NATIVE_END_CLAMP_EPSILON = 1;
function resolveAnchorLock(state, enableMVCPAnchorLock, mvcpData, now) {
  if (!enableMVCPAnchorLock) {
    state.mvcpAnchorLock = void 0;
    return void 0;
  }
  const lock = state.mvcpAnchorLock;
  if (!lock) {
    return void 0;
  }
  const isExpired = now > lock.expiresAt;
  const isMissing = state.indexByKey.get(lock.id) === void 0;
  if (isExpired || isMissing || !mvcpData) {
    state.mvcpAnchorLock = void 0;
    return void 0;
  }
  return lock;
}
function updateAnchorLock(state, params) {
  {
    const { anchorId, anchorPosition, dataChanged, now, positionDiff } = params;
    const enableMVCPAnchorLock = !!dataChanged || !!state.mvcpAnchorLock;
    const mvcpData = state.props.maintainVisibleContentPosition.data;
    if (!enableMVCPAnchorLock || !mvcpData || state.scrollingTo || !anchorId || anchorPosition === void 0) {
      return;
    }
    const existingLock = state.mvcpAnchorLock;
    const quietPasses = !dataChanged && Math.abs(positionDiff) <= MVCP_POSITION_EPSILON && (existingLock == null ? void 0 : existingLock.id) === anchorId ? existingLock.quietPasses + 1 : 0;
    if (!dataChanged && quietPasses >= MVCP_ANCHOR_LOCK_QUIET_PASSES_TO_RELEASE) {
      state.mvcpAnchorLock = void 0;
      return;
    }
    state.mvcpAnchorLock = {
      expiresAt: now + MVCP_ANCHOR_LOCK_TTL_MS,
      id: anchorId,
      position: anchorPosition,
      quietPasses
    };
  }
}
function shouldQueueNativeMVCPAdjust(dataChanged, state, positionDiff, prevTotalSize, prevScroll, scrollTarget) {
  {
    return false;
  }
}
function getPredictedNativeClamp(state, unresolvedAmount, totalSize) {
  if (Math.abs(unresolvedAmount) <= MVCP_POSITION_EPSILON) {
    return 0;
  }
  const maxScroll = Math.max(0, totalSize - state.scrollLength);
  const clampDelta = maxScroll - state.scroll;
  if (unresolvedAmount < 0) {
    return Math.max(unresolvedAmount, Math.min(0, clampDelta));
  }
  if (unresolvedAmount > 0) {
    return Math.min(unresolvedAmount, Math.max(0, clampDelta));
  }
  return 0;
}
function getProgressTowardAmount(targetDelta, nativeDelta) {
  return targetDelta < 0 ? -nativeDelta : nativeDelta;
}
function settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta) {
  const state = ctx.state;
  state.pendingNativeMVCPAdjust = void 0;
  const remaining = remainingAfterManual - nativeDelta;
  if (Math.abs(remaining) > MVCP_POSITION_EPSILON) {
    requestAdjust(ctx, remaining);
  }
}
function maybeApplyPredictedNativeMVCPAdjust(ctx) {
  const state = ctx.state;
  const pending = state.pendingNativeMVCPAdjust;
  if (!pending || Math.abs(pending.manualApplied) > MVCP_POSITION_EPSILON) {
    return;
  }
  const totalSize = getContentSize(ctx);
  const predictedNativeClamp = getPredictedNativeClamp(state, pending.amount, totalSize);
  if (Math.abs(predictedNativeClamp) <= MVCP_POSITION_EPSILON) {
    return;
  }
  const manualDesired = pending.amount - predictedNativeClamp;
  if (Math.abs(manualDesired) <= MVCP_POSITION_EPSILON) {
    return;
  }
  pending.manualApplied = manualDesired;
  requestAdjust(ctx, manualDesired);
  pending.furthestProgressTowardAmount = 0;
}
function resolvePendingNativeMVCPAdjust(ctx, newScroll) {
  const state = ctx.state;
  const pending = state.pendingNativeMVCPAdjust;
  if (!pending) {
    return false;
  }
  const remainingAfterManual = pending.amount - pending.manualApplied;
  const nativeDelta = newScroll - (pending.startScroll + pending.manualApplied);
  const isWrongDirection = remainingAfterManual < 0 && nativeDelta > MVCP_POSITION_EPSILON || remainingAfterManual > 0 && nativeDelta < -MVCP_POSITION_EPSILON;
  const progressTowardAmount = getProgressTowardAmount(remainingAfterManual, nativeDelta);
  if (Math.abs(remainingAfterManual) <= MVCP_POSITION_EPSILON) {
    state.pendingNativeMVCPAdjust = void 0;
    return true;
  }
  if (isWrongDirection) {
    state.pendingNativeMVCPAdjust = void 0;
    return false;
  }
  if (progressTowardAmount + MVCP_POSITION_EPSILON >= Math.abs(remainingAfterManual)) {
    settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta);
    return true;
  }
  const expectedNativeClampScroll = Math.max(0, getContentSize(ctx) - state.scrollLength);
  const distanceToClamp = Math.abs(newScroll - expectedNativeClampScroll);
  const isAtExpectedNativeClamp = distanceToClamp <= NATIVE_END_CLAMP_EPSILON;
  if (isAtExpectedNativeClamp) {
    settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta);
    return true;
  }
  if (state.pendingMaintainScrollAtEnd && state.isAtEnd && progressTowardAmount > MVCP_POSITION_EPSILON) {
    settlePendingNativeMVCPAdjust(ctx, remainingAfterManual, nativeDelta);
    return true;
  }
  if (progressTowardAmount > pending.furthestProgressTowardAmount + MVCP_POSITION_EPSILON) {
    pending.furthestProgressTowardAmount = progressTowardAmount;
    return false;
  }
  if (pending.furthestProgressTowardAmount > MVCP_POSITION_EPSILON && progressTowardAmount < pending.furthestProgressTowardAmount - MVCP_POSITION_EPSILON) {
    state.pendingNativeMVCPAdjust = void 0;
    return false;
  }
  return false;
}
function prepareMVCP(ctx, dataChanged) {
  const state = ctx.state;
  const { idsInView, positions, props } = state;
  const {
    maintainVisibleContentPosition: { data: mvcpData, size: mvcpScroll, shouldRestorePosition }
  } = props;
  const now = Date.now();
  const enableMVCPAnchorLock = (!!dataChanged || !!state.mvcpAnchorLock);
  const scrollingTo = state.scrollingTo;
  const anchorLock = resolveAnchorLock(state, enableMVCPAnchorLock, mvcpData, now) ;
  let prevPosition;
  let targetId;
  const idsInViewWithPositions = [];
  const scrollTarget = scrollingTo == null ? void 0 : scrollingTo.index;
  const scrollingToViewPosition = scrollingTo == null ? void 0 : scrollingTo.viewPosition;
  const isEndAnchoredScrollTarget = scrollTarget !== void 0 && state.props.data.length > 0 && scrollTarget >= state.props.data.length - 1 && (scrollingToViewPosition != null ? scrollingToViewPosition : 0) > 0;
  const shouldMVCP = dataChanged ? mvcpData : mvcpScroll;
  const indexByKey = state.indexByKey;
  const prevScroll = state.scroll;
  getContentSize(ctx);
  if (shouldMVCP) {
    if (anchorLock && scrollTarget === void 0) {
      targetId = anchorLock.id;
      prevPosition = anchorLock.position;
    } else if (scrollTarget !== void 0) {
      targetId = getId(state, scrollTarget);
    } else if (idsInView.length > 0 && state.didContainersLayout && !dataChanged) {
      targetId = idsInView.find((id) => indexByKey.get(id) !== void 0);
    }
    if (dataChanged && idsInView.length > 0 && state.didContainersLayout) {
      for (let i = 0; i < idsInView.length; i++) {
        const id = idsInView[i];
        const index = indexByKey.get(id);
        if (index !== void 0) {
          const position = positions[index];
          if (position !== void 0) {
            idsInViewWithPositions.push({ id, position });
          }
        }
      }
    }
    if (targetId !== void 0 && prevPosition === void 0) {
      const targetIndex = indexByKey.get(targetId);
      if (targetIndex !== void 0) {
        prevPosition = positions[targetIndex];
      }
    }
    return () => {
      let positionDiff = 0;
      let anchorIdForLock = anchorLock == null ? void 0 : anchorLock.id;
      let anchorPositionForLock;
      let skipTargetAnchor = false;
      const data = state.props.data;
      const shouldValidateLockedAnchor = dataChanged && mvcpData && scrollTarget === void 0 && targetId !== void 0 && (anchorLock == null ? void 0 : anchorLock.id) === targetId && shouldRestorePosition !== void 0;
      if (shouldValidateLockedAnchor && targetId !== void 0) {
        const index = indexByKey.get(targetId);
        if (index !== void 0) {
          const item = data[index];
          skipTargetAnchor = item === void 0 || !shouldRestorePosition(item, index, data);
          if (skipTargetAnchor && (anchorLock == null ? void 0 : anchorLock.id) === targetId) {
            state.mvcpAnchorLock = void 0;
          }
        }
      }
      const shouldUseFallbackVisibleAnchor = dataChanged && mvcpData && scrollTarget === void 0 && (() => {
        if (targetId === void 0 || skipTargetAnchor) {
          return true;
        }
        const targetIndex = indexByKey.get(targetId);
        return targetIndex === void 0 || positions[targetIndex] === void 0;
      })();
      if (shouldUseFallbackVisibleAnchor) {
        for (let i = 0; i < idsInViewWithPositions.length; i++) {
          const { id, position } = idsInViewWithPositions[i];
          const index = indexByKey.get(id);
          if (index !== void 0 && shouldRestorePosition) {
            const item = data[index];
            if (item === void 0 || !shouldRestorePosition(item, index, data)) {
              continue;
            }
          }
          const newPosition = index !== void 0 ? positions[index] : void 0;
          if (newPosition !== void 0) {
            positionDiff = newPosition - position;
            anchorIdForLock = id;
            anchorPositionForLock = newPosition;
            break;
          }
        }
      }
      if (!skipTargetAnchor && targetId !== void 0 && prevPosition !== void 0) {
        const targetIndex = indexByKey.get(targetId);
        const newPosition = targetIndex !== void 0 ? positions[targetIndex] : void 0;
        if (newPosition !== void 0) {
          const totalSize = getContentSize(ctx);
          let diff = newPosition - prevPosition;
          if (diff !== 0 && isEndAnchoredScrollTarget && state.scroll + state.scrollLength > totalSize) {
            if (diff > 0) {
              diff = Math.max(0, totalSize - state.scroll - state.scrollLength);
            } else {
              diff = 0;
            }
          }
          positionDiff = diff;
          anchorIdForLock = targetId;
          anchorPositionForLock = newPosition;
        }
      }
      if (scrollingToViewPosition && scrollingToViewPosition > 0) {
        const newSize = getItemSize(ctx, targetId, scrollTarget, state.props.data[scrollTarget]);
        const prevSize = scrollingTo == null ? void 0 : scrollingTo.itemSize;
        if (newSize !== void 0 && prevSize !== void 0 && newSize !== prevSize) {
          const diff = newSize - prevSize;
          if (diff !== 0) {
            positionDiff += diff * scrollingToViewPosition;
            scrollingTo.itemSize = newSize;
          }
        }
      }
      updateAnchorLock(state, {
        anchorId: anchorIdForLock,
        anchorPosition: anchorPositionForLock,
        dataChanged,
        now,
        positionDiff
      });
      if (shouldQueueNativeMVCPAdjust()) {
        state.pendingNativeMVCPAdjust = {
          amount: positionDiff,
          furthestProgressTowardAmount: 0,
          manualApplied: 0,
          startScroll: prevScroll
        };
        maybeApplyPredictedNativeMVCPAdjust(ctx);
        return;
      }
      if (Math.abs(positionDiff) > MVCP_POSITION_EPSILON) {
        requestAdjust(ctx, positionDiff);
      }
    };
  }
}

// src/core/updateScroll.ts
function updateScroll(ctx, newScroll, forceUpdate) {
  var _a3;
  const state = ctx.state;
  const { ignoreScrollFromMVCP, lastScrollAdjustForHistory, scrollAdjustHandler, scrollHistory, scrollingTo } = state;
  const prevScroll = state.scroll;
  state.hasScrolled = true;
  state.lastBatchingAction = Date.now();
  const currentTime = Date.now();
  const adjust = scrollAdjustHandler.getAdjust();
  const adjustChanged = lastScrollAdjustForHistory !== void 0 && Math.abs(adjust - lastScrollAdjustForHistory) > 0.1;
  if (adjustChanged) {
    scrollHistory.length = 0;
  }
  state.lastScrollAdjustForHistory = adjust;
  if (scrollingTo === void 0 && !(scrollHistory.length === 0 && newScroll === state.scroll)) {
    if (!adjustChanged) {
      scrollHistory.push({ scroll: newScroll, time: currentTime });
    }
  }
  if (scrollHistory.length > 5) {
    scrollHistory.shift();
  }
  if (ignoreScrollFromMVCP && !scrollingTo) {
    const { lt, gt } = ignoreScrollFromMVCP;
    if (lt && newScroll < lt || gt && newScroll > gt) {
      state.ignoreScrollFromMVCPIgnored = true;
      return;
    }
  }
  state.scrollPrev = prevScroll;
  state.scrollPrevTime = state.scrollTime;
  state.scroll = newScroll;
  state.scrollTime = currentTime;
  const scrollDelta = Math.abs(newScroll - prevScroll);
  const didResolvePendingNativeMVCPAdjust = resolvePendingNativeMVCPAdjust(ctx, newScroll);
  const scrollLength = state.scrollLength;
  const lastCalculated = state.scrollLastCalculate;
  const useAggressiveItemRecalculation = isInMVCPActiveMode(state);
  const shouldUpdate = useAggressiveItemRecalculation || didResolvePendingNativeMVCPAdjust || forceUpdate || lastCalculated === void 0 || Math.abs(state.scroll - lastCalculated) > 2;
  if (shouldUpdate) {
    state.scrollLastCalculate = state.scroll;
    state.ignoreScrollFromMVCPIgnored = false;
    state.lastScrollDelta = scrollDelta;
    const runCalculateItems = () => {
      var _a4;
      (_a4 = state.triggerCalculateItemsInView) == null ? void 0 : _a4.call(state, { doMVCP: scrollingTo !== void 0 });
      checkThresholds(ctx);
    };
    if (scrollLength > 0 && scrollingTo === void 0 && scrollDelta > scrollLength) {
      flushSync(runCalculateItems);
    } else {
      runCalculateItems();
    }
    const shouldMaintainScrollAtEndAfterPendingSettle = !!state.pendingMaintainScrollAtEnd || !!((_a3 = state.props.maintainScrollAtEnd) == null ? void 0 : _a3.onDataChange);
    if (didResolvePendingNativeMVCPAdjust && shouldMaintainScrollAtEndAfterPendingSettle) {
      state.pendingMaintainScrollAtEnd = false;
      doMaintainScrollAtEnd(ctx);
    }
    state.dataChangeNeedsScrollUpdate = false;
    state.lastScrollDelta = 0;
  }
}

// src/utils/requestAdjust.ts
function requestAdjust(ctx, positionDiff, dataChanged) {
  const state = ctx.state;
  if (Math.abs(positionDiff) > 0.1) {
    const doit = () => {
      {
        state.scrollAdjustHandler.requestAdjust(positionDiff);
        if (state.adjustingFromInitialMount) {
          state.adjustingFromInitialMount--;
        }
      }
    };
    state.scroll += positionDiff;
    state.scrollForNextCalculateItemsInView = void 0;
    const readyToRender = peek$(ctx, "readyToRender");
    if (readyToRender) {
      doit();
    } else {
      state.adjustingFromInitialMount = (state.adjustingFromInitialMount || 0) + 1;
      requestAnimationFrame(doit);
    }
  }
}

// src/core/prepareColumnStartState.ts
function prepareColumnStartState(ctx, startIndex, useAverageSize) {
  var _a3;
  const state = ctx.state;
  const numColumns = peek$(ctx, "numColumns");
  let rowStartIndex = startIndex;
  const columnAtStart = state.columns[startIndex];
  if (columnAtStart !== 1) {
    rowStartIndex = findRowStartIndex(state, numColumns, startIndex);
  }
  let currentRowTop = 0;
  const column = state.columns[rowStartIndex];
  if (rowStartIndex > 0) {
    const prevIndex = rowStartIndex - 1;
    const prevPosition = (_a3 = state.positions[prevIndex]) != null ? _a3 : 0;
    const prevRowStart = findRowStartIndex(state, numColumns, prevIndex);
    const prevRowHeight = calculateRowMaxSize(ctx, prevRowStart, prevIndex, useAverageSize);
    currentRowTop = prevPosition + prevRowHeight;
  }
  return {
    column,
    currentRowTop,
    startIndex: rowStartIndex
  };
}
function findRowStartIndex(state, numColumns, index) {
  if (numColumns <= 1) {
    return Math.max(0, index);
  }
  let rowStart = Math.max(0, index);
  while (rowStart > 0) {
    const columnForIndex = state.columns[rowStart];
    if (columnForIndex === 1) {
      break;
    }
    rowStart--;
  }
  return rowStart;
}
function calculateRowMaxSize(ctx, startIndex, endIndex, useAverageSize) {
  const state = ctx.state;
  if (endIndex < startIndex) {
    return 0;
  }
  const { data } = state.props;
  if (!data) {
    return 0;
  }
  let maxSize = 0;
  for (let i = startIndex; i <= endIndex; i++) {
    if (i < 0 || i >= data.length) {
      continue;
    }
    const id = state.idCache[i];
    const size = getItemSize(ctx, id, i, data[i], useAverageSize);
    if (size > maxSize) {
      maxSize = size;
    }
  }
  return maxSize;
}

// src/core/updateTotalSize.ts
function updateTotalSize(ctx) {
  var _a3, _b;
  const state = ctx.state;
  const {
    positions,
    props: { data }
  } = state;
  const numColumns = (_a3 = peek$(ctx, "numColumns")) != null ? _a3 : 1;
  if (data.length === 0) {
    addTotalSize(ctx, null, 0);
  } else {
    const lastIndex = data.length - 1;
    const lastId = getId(state, lastIndex);
    const lastPosition = positions[lastIndex];
    if (lastId !== void 0 && lastPosition !== void 0) {
      if (numColumns > 1) {
        let rowStart = lastIndex;
        while (rowStart > 0) {
          const column = state.columns[rowStart];
          if (column === 1 || column === void 0) {
            break;
          }
          rowStart -= 1;
        }
        let maxSize = 0;
        for (let i = rowStart; i <= lastIndex; i++) {
          const rowId = (_b = state.idCache[i]) != null ? _b : getId(state, i);
          const size = getItemSize(ctx, rowId, i, data[i]);
          if (size > maxSize) {
            maxSize = size;
          }
        }
        addTotalSize(ctx, null, lastPosition + maxSize);
      } else {
        const lastSize = getItemSize(ctx, lastId, lastIndex, data[lastIndex]);
        if (lastSize !== void 0) {
          const totalSize = lastPosition + lastSize;
          addTotalSize(ctx, null, totalSize);
        }
      }
    }
  }
}

// src/utils/getScrollVelocity.ts
var getScrollVelocity = (state) => {
  const { scrollHistory } = state;
  const newestIndex = scrollHistory.length - 1;
  if (newestIndex < 1) {
    return 0;
  }
  const newest = scrollHistory[newestIndex];
  const now = Date.now();
  let direction = 0;
  for (let i = newestIndex; i > 0; i--) {
    const delta = scrollHistory[i].scroll - scrollHistory[i - 1].scroll;
    if (delta !== 0) {
      direction = Math.sign(delta);
      break;
    }
  }
  if (direction === 0) {
    return 0;
  }
  let oldest = newest;
  for (let i = newestIndex - 1; i >= 0; i--) {
    const current = scrollHistory[i];
    const next = scrollHistory[i + 1];
    const delta = next.scroll - current.scroll;
    const deltaSign = Math.sign(delta);
    if (deltaSign !== 0 && deltaSign !== direction) {
      break;
    }
    if (now - current.time > 1e3) {
      break;
    }
    oldest = current;
  }
  const scrollDiff = newest.scroll - oldest.scroll;
  const timeDiff = newest.time - oldest.time;
  return timeDiff > 0 ? scrollDiff / timeDiff : 0;
};

// src/utils/updateSnapToOffsets.ts
function updateSnapToOffsets(ctx) {
  const state = ctx.state;
  const {
    props: { snapToIndices }
  } = state;
  const snapToOffsets = Array(snapToIndices.length);
  for (let i = 0; i < snapToIndices.length; i++) {
    const idx = snapToIndices[i];
    getId(state, idx);
    snapToOffsets[i] = state.positions[idx];
  }
  set$(ctx, "snapToOffsets", snapToOffsets);
}

// src/core/updateItemPositions.ts
function updateItemPositions(ctx, dataChanged, { startIndex, scrollBottomBuffered, forceFullUpdate = false, doMVCP } = {
  doMVCP: false,
  forceFullUpdate: false,
  scrollBottomBuffered: -1,
  startIndex: 0
}) {
  var _a3, _b, _c, _d, _e;
  const state = ctx.state;
  const hasPositionListeners = ctx.positionListeners.size > 0;
  const {
    columns,
    columnSpans,
    indexByKey,
    positions,
    idCache,
    sizesKnown,
    props: { data, getEstimatedItemSize, overrideItemLayout, snapToIndices },
    scrollingTo
  } = state;
  const dataLength = data.length;
  const numColumns = (_a3 = peek$(ctx, "numColumns")) != null ? _a3 : 1;
  const hasColumns = numColumns > 1;
  const indexByKeyForChecking = IS_DEV ? /* @__PURE__ */ new Map() : void 0;
  const extraData = peek$(ctx, "extraData");
  const layoutConfig = overrideItemLayout ? { span: 1 } : void 0;
  const lastScrollDelta = state.lastScrollDelta;
  const velocity = getScrollVelocity(state);
  const shouldOptimize = !forceFullUpdate && !dataChanged && (Math.abs(velocity) > 0 || state.scrollLength > 0 && lastScrollDelta > state.scrollLength);
  const maxVisibleArea = scrollBottomBuffered + 1e3;
  const useAverageSize = !getEstimatedItemSize;
  const preferCachedSize = !doMVCP || dataChanged || state.scrollAdjustHandler.getAdjust() !== 0 || ((_b = peek$(ctx, "scrollAdjustPending")) != null ? _b : 0) !== 0;
  let currentRowTop = 0;
  let column = 1;
  let maxSizeInRow = 0;
  if (dataChanged) {
    columnSpans.length = 0;
  }
  if (!hasColumns) {
    if (columns.length) {
      columns.length = 0;
    }
    if (columnSpans.length) {
      columnSpans.length = 0;
    }
  }
  if (startIndex > 0) {
    if (hasColumns) {
      const { startIndex: processedStartIndex, currentRowTop: initialRowTop } = prepareColumnStartState(
        ctx,
        startIndex,
        useAverageSize
      );
      startIndex = processedStartIndex;
      currentRowTop = initialRowTop;
    } else if (startIndex < dataLength) {
      const prevIndex = startIndex - 1;
      const prevId = getId(state, prevIndex);
      const prevPosition = (_c = positions[prevIndex]) != null ? _c : 0;
      const prevSize = (_d = sizesKnown.get(prevId)) != null ? _d : getItemSize(ctx, prevId, prevIndex, data[prevIndex], useAverageSize, preferCachedSize);
      currentRowTop = prevPosition + prevSize;
    }
  }
  const needsIndexByKey = dataChanged || indexByKey.size === 0;
  const canOverrideSpan = hasColumns && !!overrideItemLayout && !!layoutConfig;
  let didBreakEarly = false;
  let breakAt;
  for (let i = startIndex; i < dataLength; i++) {
    if (shouldOptimize && breakAt !== void 0 && i > breakAt) {
      didBreakEarly = true;
      break;
    }
    if (shouldOptimize && breakAt === void 0 && !scrollingTo && !dataChanged && currentRowTop > maxVisibleArea) {
      const itemsPerRow = hasColumns ? numColumns : 1;
      breakAt = i + itemsPerRow + 10;
    }
    const id = (_e = idCache[i]) != null ? _e : getId(state, i);
    let span = 1;
    if (canOverrideSpan) {
      layoutConfig.span = 1;
      overrideItemLayout(layoutConfig, data[i], i, numColumns, extraData);
      const requestedSpan = layoutConfig.span;
      if (requestedSpan !== void 0 && Number.isFinite(requestedSpan)) {
        span = Math.max(1, Math.min(numColumns, Math.round(requestedSpan)));
      }
    }
    if (hasColumns && column + span - 1 > numColumns) {
      currentRowTop += maxSizeInRow;
      column = 1;
      maxSizeInRow = 0;
    }
    const knownSize = sizesKnown.get(id);
    const size = knownSize !== void 0 ? knownSize : getItemSize(ctx, id, i, data[i], useAverageSize, preferCachedSize);
    if (IS_DEV && needsIndexByKey) {
      if (indexByKeyForChecking.has(id)) {
        console.error(
          `[legend-list] Error: Detected overlapping key (${id}) which causes missing items and gaps and other terrrible things. Check that keyExtractor returns unique values.`
        );
      }
      indexByKeyForChecking.set(id, i);
    }
    if (currentRowTop !== positions[i]) {
      positions[i] = currentRowTop;
      if (hasPositionListeners) {
        notifyPosition$(ctx, id, currentRowTop);
      }
    }
    if (needsIndexByKey) {
      indexByKey.set(id, i);
    }
    if (!hasColumns) {
      currentRowTop += size;
    } else {
      columns[i] = column;
      columnSpans[i] = span;
      if (size > maxSizeInRow) {
        maxSizeInRow = size;
      }
      column += span;
      if (column > numColumns) {
        currentRowTop += maxSizeInRow;
        column = 1;
        maxSizeInRow = 0;
      }
    }
  }
  if (!didBreakEarly) {
    updateTotalSize(ctx);
  }
  if (snapToIndices) {
    updateSnapToOffsets(ctx);
  }
}

// src/core/viewability.ts
function ensureViewabilityState(ctx, configId) {
  let map = ctx.mapViewabilityConfigStates;
  if (!map) {
    map = /* @__PURE__ */ new Map();
    ctx.mapViewabilityConfigStates = map;
  }
  let state = map.get(configId);
  if (!state) {
    state = { end: -1, previousEnd: -1, previousStart: -1, start: -1, viewableItems: [] };
    map.set(configId, state);
  }
  return state;
}
function setupViewability(props) {
  let { viewabilityConfig, viewabilityConfigCallbackPairs, onViewableItemsChanged } = props;
  if (viewabilityConfig || onViewableItemsChanged) {
    viewabilityConfigCallbackPairs = [
      ...viewabilityConfigCallbackPairs || [],
      {
        onViewableItemsChanged,
        viewabilityConfig: viewabilityConfig || {
          viewAreaCoveragePercentThreshold: 0
        }
      }
    ];
  }
  return viewabilityConfigCallbackPairs;
}
function updateViewableItems(state, ctx, viewabilityConfigCallbackPairs, scrollSize, start, end) {
  const {
    timeouts,
    props: { data }
  } = state;
  for (const viewabilityConfigCallbackPair of viewabilityConfigCallbackPairs) {
    const viewabilityState = ensureViewabilityState(ctx, viewabilityConfigCallbackPair.viewabilityConfig.id);
    viewabilityState.start = start;
    viewabilityState.end = end;
    if (viewabilityConfigCallbackPair.viewabilityConfig.minimumViewTime) {
      const timer = setTimeout(() => {
        timeouts.delete(timer);
        updateViewableItemsWithConfig(data, viewabilityConfigCallbackPair, state, ctx, scrollSize);
      }, viewabilityConfigCallbackPair.viewabilityConfig.minimumViewTime);
      timeouts.add(timer);
    } else {
      updateViewableItemsWithConfig(data, viewabilityConfigCallbackPair, state, ctx, scrollSize);
    }
  }
}
function updateViewableItemsWithConfig(data, viewabilityConfigCallbackPair, state, ctx, scrollSize) {
  const { viewabilityConfig, onViewableItemsChanged } = viewabilityConfigCallbackPair;
  const configId = viewabilityConfig.id;
  const viewabilityState = ensureViewabilityState(ctx, configId);
  const { viewableItems: previousViewableItems, start, end } = viewabilityState;
  const viewabilityTokens = /* @__PURE__ */ new Map();
  for (const [containerId, value] of ctx.mapViewabilityAmountValues) {
    viewabilityTokens.set(
      containerId,
      computeViewability(
        state,
        ctx,
        viewabilityConfig,
        containerId,
        value.key,
        scrollSize,
        value.item,
        value.index
      )
    );
  }
  const changed = [];
  if (previousViewableItems) {
    for (const viewToken of previousViewableItems) {
      const containerId = findContainerId(ctx, viewToken.key);
      if (!checkIsViewable(
        state,
        ctx,
        viewabilityConfig,
        containerId,
        viewToken.key,
        scrollSize,
        viewToken.item,
        viewToken.index
      )) {
        viewToken.isViewable = false;
        changed.push(viewToken);
      }
    }
  }
  const viewableItems = [];
  for (let i = start; i <= end; i++) {
    const item = data[i];
    if (item) {
      const key = getId(state, i);
      const containerId = findContainerId(ctx, key);
      if (checkIsViewable(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, i)) {
        const viewToken = {
          containerId,
          index: i,
          isViewable: true,
          item,
          key
        };
        viewableItems.push(viewToken);
        if (!(previousViewableItems == null ? void 0 : previousViewableItems.find((v) => v.key === viewToken.key))) {
          changed.push(viewToken);
        }
      }
    }
  }
  Object.assign(viewabilityState, {
    previousEnd: end,
    previousStart: start,
    viewableItems
  });
  if (changed.length > 0) {
    viewabilityState.viewableItems = viewableItems;
    for (let i = 0; i < changed.length; i++) {
      const change = changed[i];
      maybeUpdateViewabilityCallback(ctx, configId, change.containerId, change);
    }
    if (onViewableItemsChanged) {
      onViewableItemsChanged({ changed, viewableItems });
    }
  }
  for (const [containerId, value] of ctx.mapViewabilityAmountValues) {
    if (value.sizeVisible < 0) {
      ctx.mapViewabilityAmountValues.delete(containerId);
    }
  }
}
function shallowEqual(prev, next) {
  if (!prev) return false;
  const keys = Object.keys(next);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (prev[k] !== next[k]) return false;
  }
  return true;
}
function computeViewability(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, index) {
  const { sizes, scroll: scrollState } = state;
  const topPad = (peek$(ctx, "stylePaddingTop") || 0) + (peek$(ctx, "headerSize") || 0);
  const { itemVisiblePercentThreshold, viewAreaCoveragePercentThreshold } = viewabilityConfig;
  const viewAreaMode = viewAreaCoveragePercentThreshold != null;
  const viewablePercentThreshold = viewAreaMode ? viewAreaCoveragePercentThreshold : itemVisiblePercentThreshold;
  const scroll = scrollState - topPad;
  const position = state.positions[index];
  const size = sizes.get(key) || 0;
  if (position === void 0) {
    const value2 = {
      containerId,
      index,
      isViewable: false,
      item,
      key,
      percentOfScroller: 0,
      percentVisible: 0,
      scrollSize,
      size,
      sizeVisible: -1
    };
    const prev2 = ctx.mapViewabilityAmountValues.get(containerId);
    if (!shallowEqual(prev2, value2)) {
      ctx.mapViewabilityAmountValues.set(containerId, value2);
      const cb = ctx.mapViewabilityAmountCallbacks.get(containerId);
      if (cb) {
        cb(value2);
      }
    }
    return value2;
  }
  const top = position - scroll;
  const bottom = top + size;
  const isEntirelyVisible = top >= 0 && bottom <= scrollSize && bottom > top;
  const sizeVisible = isEntirelyVisible ? size : Math.min(bottom, scrollSize) - Math.max(top, 0);
  const percentVisible = size ? isEntirelyVisible ? 100 : 100 * (sizeVisible / size) : 0;
  const percentOfScroller = size ? 100 * (sizeVisible / scrollSize) : 0;
  const percent = isEntirelyVisible ? 100 : viewAreaMode ? percentOfScroller : percentVisible;
  const isViewable = percent >= viewablePercentThreshold;
  const value = {
    containerId,
    index,
    isViewable,
    item,
    key,
    percentOfScroller,
    percentVisible,
    scrollSize,
    size,
    sizeVisible
  };
  const prev = ctx.mapViewabilityAmountValues.get(containerId);
  if (!shallowEqual(prev, value)) {
    ctx.mapViewabilityAmountValues.set(containerId, value);
    const cb = ctx.mapViewabilityAmountCallbacks.get(containerId);
    if (cb) {
      cb(value);
    }
  }
  return value;
}
function checkIsViewable(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, index) {
  let value = ctx.mapViewabilityAmountValues.get(containerId);
  if (!value || value.key !== key) {
    value = computeViewability(state, ctx, viewabilityConfig, containerId, key, scrollSize, item, index);
  }
  return value.isViewable;
}
function maybeUpdateViewabilityCallback(ctx, configId, containerId, viewToken) {
  const key = containerId + configId;
  ctx.mapViewabilityValues.set(key, viewToken);
  const cb = ctx.mapViewabilityCallbacks.get(key);
  cb == null ? void 0 : cb(viewToken);
}
var unstableBatchedUpdates = ReactDOM.unstable_batchedUpdates;
var batchedUpdates = typeof unstableBatchedUpdates === "function" ? unstableBatchedUpdates : (fn) => fn();

// src/utils/checkAllSizesKnown.ts
function isNullOrUndefined2(value) {
  return value === null || value === void 0;
}
function checkAllSizesKnown(state) {
  const { startBuffered, endBuffered, sizesKnown } = state;
  if (!isNullOrUndefined2(endBuffered) && !isNullOrUndefined2(startBuffered) && startBuffered >= 0 && endBuffered >= 0) {
    let areAllKnown = true;
    for (let i = startBuffered; areAllKnown && i <= endBuffered; i++) {
      const key = getId(state, i);
      areAllKnown && (areAllKnown = sizesKnown.has(key));
    }
    return areAllKnown;
  }
  return false;
}

// src/utils/findAvailableContainers.ts
function findAvailableContainers(ctx, numNeeded, startBuffered, endBuffered, pendingRemoval, requiredItemTypes, needNewContainers) {
  const numContainers = peek$(ctx, "numContainers");
  const state = ctx.state;
  const { stickyContainerPool, containerItemTypes } = state;
  const result = [];
  const availableContainers = [];
  const pendingRemovalSet = new Set(pendingRemoval);
  let pendingRemovalChanged = false;
  const stickyIndicesSet = state.props.stickyIndicesSet;
  const stickyItemIndices = (needNewContainers == null ? void 0 : needNewContainers.filter((index) => stickyIndicesSet.has(index))) || [];
  const canReuseContainer = (containerIndex, requiredType) => {
    if (!requiredType) return true;
    const existingType = containerItemTypes.get(containerIndex);
    if (!existingType) return true;
    return existingType === requiredType;
  };
  const neededTypes = requiredItemTypes ? [...requiredItemTypes] : [];
  let typeIndex = 0;
  for (let i = 0; i < stickyItemIndices.length; i++) {
    const requiredType = neededTypes[typeIndex];
    let foundContainer = false;
    for (const containerIndex of stickyContainerPool) {
      const key = peek$(ctx, `containerItemKey${containerIndex}`);
      const isPendingRemoval = pendingRemovalSet.has(containerIndex);
      if ((key === void 0 || isPendingRemoval) && canReuseContainer(containerIndex, requiredType) && !result.includes(containerIndex)) {
        result.push(containerIndex);
        if (isPendingRemoval && pendingRemovalSet.delete(containerIndex)) {
          pendingRemovalChanged = true;
        }
        foundContainer = true;
        if (requiredItemTypes) typeIndex++;
        break;
      }
    }
    if (!foundContainer) {
      const newContainerIndex = numContainers + result.filter((index) => index >= numContainers).length;
      result.push(newContainerIndex);
      stickyContainerPool.add(newContainerIndex);
      if (requiredItemTypes) typeIndex++;
    }
  }
  for (let u = 0; u < numContainers && result.length < numNeeded; u++) {
    if (stickyContainerPool.has(u)) {
      continue;
    }
    const key = peek$(ctx, `containerItemKey${u}`);
    const requiredType = neededTypes[typeIndex];
    const isPending = key !== void 0 && pendingRemovalSet.has(u);
    const canUse = key === void 0 || isPending && canReuseContainer(u, requiredType);
    if (canUse) {
      if (isPending) {
        pendingRemovalSet.delete(u);
        pendingRemovalChanged = true;
      }
      result.push(u);
      if (requiredItemTypes) {
        typeIndex++;
      }
    }
  }
  for (let u = 0; u < numContainers && result.length < numNeeded; u++) {
    if (stickyContainerPool.has(u)) {
      continue;
    }
    const key = peek$(ctx, `containerItemKey${u}`);
    if (key === void 0) continue;
    const index = state.indexByKey.get(key);
    const isOutOfView = index < startBuffered || index > endBuffered;
    if (isOutOfView) {
      const distance = index < startBuffered ? startBuffered - index : index - endBuffered;
      if (!requiredItemTypes || typeIndex < neededTypes.length && canReuseContainer(u, neededTypes[typeIndex])) {
        availableContainers.push({ distance, index: u });
      }
    }
  }
  const remaining = numNeeded - result.length;
  if (remaining > 0) {
    if (availableContainers.length > 0) {
      if (availableContainers.length > remaining) {
        availableContainers.sort(comparatorByDistance);
        availableContainers.length = remaining;
      }
      for (const container of availableContainers) {
        result.push(container.index);
        if (requiredItemTypes) {
          typeIndex++;
        }
      }
    }
    const stillNeeded = numNeeded - result.length;
    if (stillNeeded > 0) {
      for (let i = 0; i < stillNeeded; i++) {
        result.push(numContainers + i);
      }
      if (IS_DEV && numContainers + stillNeeded > peek$(ctx, "numContainersPooled")) {
        console.warn(
          "[legend-list] No unused container available, so creating one on demand. This can be a minor performance issue and is likely caused by the estimatedItemSize being too large. Consider decreasing estimatedItemSize or increasing initialContainerPoolRatio.",
          {
            debugInfo: {
              numContainers,
              numContainersPooled: peek$(ctx, "numContainersPooled"),
              numNeeded,
              stillNeeded
            }
          }
        );
      }
    }
  }
  if (pendingRemovalChanged) {
    pendingRemoval.length = 0;
    for (const value of pendingRemovalSet) {
      pendingRemoval.push(value);
    }
  }
  return result.sort(comparatorDefault);
}
function comparatorByDistance(a, b) {
  return b.distance - a.distance;
}

// src/core/scrollToIndex.ts
function scrollToIndex(ctx, {
  index,
  viewOffset = 0,
  animated = true,
  forceScroll,
  isInitialScroll,
  viewPosition
}) {
  const state = ctx.state;
  const { data } = state.props;
  if (index >= data.length) {
    index = data.length - 1;
  } else if (index < 0) {
    index = 0;
  }
  const firstIndexOffset = calculateOffsetForIndex(ctx, index);
  const isLast = index === data.length - 1;
  if (isLast && viewPosition === void 0) {
    viewPosition = 1;
  }
  state.scrollForNextCalculateItemsInView = void 0;
  const targetId = getId(state, index);
  const itemSize = getItemSize(ctx, targetId, index, state.props.data[index]);
  scrollTo(ctx, {
    animated,
    forceScroll,
    index,
    isInitialScroll,
    itemSize,
    offset: firstIndexOffset,
    viewOffset,
    viewPosition: viewPosition != null ? viewPosition : 0
  });
}

// src/utils/performInitialScroll.ts
function performInitialScroll(ctx, params) {
  var _a3;
  const { forceScroll, initialScrollUsesOffset, resolvedOffset, target } = params;
  if (initialScrollUsesOffset || resolvedOffset !== void 0) {
    scrollTo(ctx, {
      animated: false,
      forceScroll,
      index: initialScrollUsesOffset ? void 0 : target.index,
      isInitialScroll: true,
      offset: (_a3 = resolvedOffset != null ? resolvedOffset : target.contentOffset) != null ? _a3 : 0,
      precomputedWithViewOffset: resolvedOffset !== void 0
    });
    return;
  }
  if (target.index === void 0) {
    return;
  }
  scrollToIndex(ctx, {
    ...target,
    animated: false,
    forceScroll,
    isInitialScroll: true
  });
}

// src/utils/setDidLayout.ts
function setDidLayout(ctx) {
  const state = ctx.state;
  const { initialScroll } = state;
  state.queuedInitialLayout = true;
  checkAtBottom(ctx);
  if (initialScroll) {
    const runScroll = () => {
      var _a3, _b;
      const target = state.initialScroll;
      if (!target) {
        return;
      }
      const activeInitialTargetOffset = ((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll) ? (_b = state.scrollingTo.targetOffset) != null ? _b : state.scrollingTo.offset : void 0;
      const desiredInitialTargetOffset = state.initialScrollUsesOffset ? target.contentOffset : activeInitialTargetOffset;
      const isAlreadyAtDesiredInitialTarget = desiredInitialTargetOffset !== void 0 && Math.abs(state.scroll - desiredInitialTargetOffset) <= 1 && Math.abs(state.scrollPending - desiredInitialTargetOffset) <= 1;
      if (!isAlreadyAtDesiredInitialTarget) {
        performInitialScroll(ctx, {
          forceScroll: true,
          initialScrollUsesOffset: state.initialScrollUsesOffset,
          // Offset-based initial scrolls do not need item lookup, so they can run even before data exists.
          // Re-run on the next frame to pick up measured viewport size without waiting for index resolution.
          target
        });
      }
    };
    runScroll();
    requestAnimationFrame(runScroll);
  }
  setInitialRenderState(ctx, { didLayout: true });
}

// src/core/calculateItemsInView.ts
function findCurrentStickyIndex(stickyArray, scroll, state) {
  const positions = state.positions;
  for (let i = stickyArray.length - 1; i >= 0; i--) {
    const stickyIndex = stickyArray[i];
    const stickyPos = positions[stickyIndex];
    if (stickyPos !== void 0 && scroll >= stickyPos) {
      return i;
    }
  }
  return -1;
}
function getActiveStickyIndices(ctx, stickyHeaderIndices) {
  const state = ctx.state;
  return new Set(
    Array.from(state.stickyContainerPool).map((i) => peek$(ctx, `containerItemKey${i}`)).map((key) => key ? state.indexByKey.get(key) : void 0).filter((idx) => idx !== void 0 && stickyHeaderIndices.has(idx))
  );
}
function handleStickyActivation(ctx, stickyHeaderIndices, stickyArray, currentStickyIdx, needNewContainers, needNewContainersSet, startBuffered, endBuffered) {
  var _a3;
  const state = ctx.state;
  const activeIndices = getActiveStickyIndices(ctx, stickyHeaderIndices);
  set$(ctx, "activeStickyIndex", currentStickyIdx >= 0 ? stickyArray[currentStickyIdx] : -1);
  for (let offset = 0; offset <= 1; offset++) {
    const idx = currentStickyIdx - offset;
    if (idx < 0 || activeIndices.has(stickyArray[idx])) continue;
    const stickyIndex = stickyArray[idx];
    const stickyId = (_a3 = state.idCache[stickyIndex]) != null ? _a3 : getId(state, stickyIndex);
    if (stickyId && !state.containerItemKeys.has(stickyId) && (stickyIndex < startBuffered || stickyIndex > endBuffered) && !needNewContainersSet.has(stickyIndex)) {
      needNewContainersSet.add(stickyIndex);
      needNewContainers.push(stickyIndex);
    }
  }
}
function handleStickyRecycling(ctx, stickyArray, scroll, drawDistance, currentStickyIdx, pendingRemoval, alwaysRenderIndicesSet) {
  var _a3, _b;
  const state = ctx.state;
  for (const containerIndex of state.stickyContainerPool) {
    const itemKey = peek$(ctx, `containerItemKey${containerIndex}`);
    const itemIndex = itemKey ? state.indexByKey.get(itemKey) : void 0;
    if (itemIndex === void 0) continue;
    if (alwaysRenderIndicesSet.has(itemIndex)) continue;
    const arrayIdx = stickyArray.indexOf(itemIndex);
    if (arrayIdx === -1) {
      state.stickyContainerPool.delete(containerIndex);
      set$(ctx, `containerSticky${containerIndex}`, false);
      continue;
    }
    const isRecentSticky = arrayIdx >= currentStickyIdx - 1 && arrayIdx <= currentStickyIdx + 1;
    if (isRecentSticky) continue;
    const nextIndex = stickyArray[arrayIdx + 1];
    let shouldRecycle = false;
    if (nextIndex) {
      const nextPos = state.positions[nextIndex];
      shouldRecycle = nextPos !== void 0 && scroll > nextPos + drawDistance * 2;
    } else {
      const currentId = (_a3 = state.idCache[itemIndex]) != null ? _a3 : getId(state, itemIndex);
      if (currentId) {
        const currentPos = state.positions[itemIndex];
        const currentSize = (_b = state.sizes.get(currentId)) != null ? _b : getItemSize(ctx, currentId, itemIndex, state.props.data[itemIndex]);
        shouldRecycle = currentPos !== void 0 && scroll > currentPos + currentSize + drawDistance * 3;
      }
    }
    if (shouldRecycle) {
      pendingRemoval.push(containerIndex);
    }
  }
}
function calculateItemsInView(ctx, params = {}) {
  const state = ctx.state;
  batchedUpdates(() => {
    var _a3, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const {
      columns,
      columnSpans,
      containerItemKeys,
      enableScrollForNextCalculateItemsInView,
      idCache,
      indexByKey,
      initialScroll,
      minIndexSizeChanged,
      positions,
      props: {
        alwaysRenderIndicesArr,
        alwaysRenderIndicesSet,
        drawDistance,
        getItemType,
        itemsAreEqual,
        keyExtractor,
        onStickyHeaderChange
      },
      scrollForNextCalculateItemsInView,
      scrollLength,
      sizes,
      startBufferedId: startBufferedIdOrig,
      viewabilityConfigCallbackPairs
    } = state;
    const { data } = state.props;
    const stickyIndicesArr = state.props.stickyIndicesArr || [];
    const stickyIndicesSet = state.props.stickyIndicesSet || /* @__PURE__ */ new Set();
    const alwaysRenderArr = alwaysRenderIndicesArr || [];
    const alwaysRenderSet = alwaysRenderIndicesSet || /* @__PURE__ */ new Set();
    const { dataChanged, doMVCP, forceFullItemPositions } = params;
    const prevNumContainers = peek$(ctx, "numContainers");
    if (!data || scrollLength === 0 || !prevNumContainers) {
      return;
    }
    let totalSize = getContentSize(ctx);
    const topPad = peek$(ctx, "stylePaddingTop") + peek$(ctx, "headerSize");
    const numColumns = peek$(ctx, "numColumns");
    const speed = getScrollVelocity(state);
    const scrollExtra = 0;
    const { queuedInitialLayout } = state;
    let { scroll: scrollState } = state;
    if (!queuedInitialLayout && initialScroll) {
      const updatedOffset = state.initialScrollUsesOffset ? (_a3 = initialScroll.contentOffset) != null ? _a3 : 0 : calculateOffsetWithOffsetPosition(
        ctx,
        calculateOffsetForIndex(ctx, initialScroll.index),
        initialScroll
      );
      scrollState = updatedOffset;
    }
    const scrollAdjustPending = (_b = peek$(ctx, "scrollAdjustPending")) != null ? _b : 0;
    const scrollAdjustPad = scrollAdjustPending - topPad;
    let scroll = Math.round(scrollState + scrollExtra + scrollAdjustPad);
    if (scroll + scrollLength > totalSize) {
      scroll = Math.max(0, totalSize - scrollLength);
    }
    const previousStickyIndex = peek$(ctx, "activeStickyIndex");
    const currentStickyIdx = stickyIndicesArr.length > 0 ? findCurrentStickyIndex(stickyIndicesArr, scroll, state) : -1;
    const nextActiveStickyIndex = currentStickyIdx >= 0 ? stickyIndicesArr[currentStickyIdx] : -1;
    if (currentStickyIdx >= 0 || previousStickyIndex >= 0) {
      set$(ctx, "activeStickyIndex", nextActiveStickyIndex);
    }
    let scrollBufferTop = drawDistance;
    let scrollBufferBottom = drawDistance;
    if (speed > 0 || speed === 0 && scroll < Math.max(50, drawDistance)) {
      scrollBufferTop = drawDistance * 0.5;
      scrollBufferBottom = drawDistance * 1.5;
    } else {
      scrollBufferTop = drawDistance * 1.5;
      scrollBufferBottom = drawDistance * 0.5;
    }
    const scrollTopBuffered = scroll - scrollBufferTop;
    const scrollBottom = scroll + scrollLength + (scroll < 0 ? -scroll : 0);
    const scrollBottomBuffered = scrollBottom + scrollBufferBottom;
    if (!dataChanged && !forceFullItemPositions && scrollForNextCalculateItemsInView) {
      const { top, bottom } = scrollForNextCalculateItemsInView;
      if (top === null && bottom === null) {
        state.scrollForNextCalculateItemsInView = void 0;
      } else if ((top === null || scrollTopBuffered > top) && (bottom === null || scrollBottomBuffered < bottom)) {
        if (!isInMVCPActiveMode(state)) {
          return;
        }
      }
    }
    const checkMVCP = doMVCP ? prepareMVCP(ctx, dataChanged) : void 0;
    if (dataChanged) {
      indexByKey.clear();
      idCache.length = 0;
      positions.length = 0;
      columns.length = 0;
      columnSpans.length = 0;
    }
    const startIndex = forceFullItemPositions || dataChanged ? 0 : (_c = minIndexSizeChanged != null ? minIndexSizeChanged : state.startBuffered) != null ? _c : 0;
    updateItemPositions(ctx, dataChanged, {
      doMVCP,
      forceFullUpdate: !!forceFullItemPositions,
      scrollBottomBuffered,
      startIndex
    });
    totalSize = getContentSize(ctx);
    if (minIndexSizeChanged !== void 0) {
      state.minIndexSizeChanged = void 0;
    }
    checkMVCP == null ? void 0 : checkMVCP();
    let startNoBuffer = null;
    let startBuffered = null;
    let startBufferedId = null;
    let endNoBuffer = null;
    let endBuffered = null;
    let loopStart = !dataChanged && startBufferedIdOrig ? indexByKey.get(startBufferedIdOrig) || 0 : 0;
    for (let i = loopStart; i >= 0; i--) {
      const id = (_d = idCache[i]) != null ? _d : getId(state, i);
      const top = positions[i];
      const size = (_e = sizes.get(id)) != null ? _e : getItemSize(ctx, id, i, data[i]);
      const bottom = top + size;
      if (bottom > scroll - scrollBufferTop) {
        loopStart = i;
      } else {
        break;
      }
    }
    if (numColumns > 1) {
      while (loopStart > 0) {
        const loopColumn = columns[loopStart];
        if (loopColumn === 1 || loopColumn === void 0) {
          break;
        }
        loopStart -= 1;
      }
    }
    let foundEnd = false;
    let nextTop;
    let nextBottom;
    let maxIndexRendered = 0;
    for (let i = 0; i < prevNumContainers; i++) {
      const key = peek$(ctx, `containerItemKey${i}`);
      if (key !== void 0) {
        const index = indexByKey.get(key);
        maxIndexRendered = Math.max(maxIndexRendered, index);
      }
    }
    let firstFullyOnScreenIndex;
    const dataLength = data.length;
    for (let i = Math.max(0, loopStart); i < dataLength && (!foundEnd || i <= maxIndexRendered); i++) {
      const id = (_f = idCache[i]) != null ? _f : getId(state, i);
      const size = (_g = sizes.get(id)) != null ? _g : getItemSize(ctx, id, i, data[i]);
      const top = positions[i];
      if (!foundEnd) {
        if (startNoBuffer === null && top + size > scroll) {
          startNoBuffer = i;
        }
        if (firstFullyOnScreenIndex === void 0 && top >= scroll - 10 && top <= scrollBottom) {
          firstFullyOnScreenIndex = i;
        }
        if (startBuffered === null && top + size > scrollTopBuffered) {
          startBuffered = i;
          startBufferedId = id;
          if (scrollTopBuffered < 0) {
            nextTop = null;
          } else {
            nextTop = top;
          }
        }
        if (startNoBuffer !== null) {
          if (top <= scrollBottom) {
            endNoBuffer = i;
          }
          if (top <= scrollBottomBuffered) {
            endBuffered = i;
            if (scrollBottomBuffered > totalSize) {
              nextBottom = null;
            } else {
              nextBottom = top + size;
            }
          } else {
            foundEnd = true;
          }
        }
      }
    }
    const idsInView = [];
    const firstVisibleAnchorIndex = firstFullyOnScreenIndex != null ? firstFullyOnScreenIndex : startNoBuffer;
    if (firstVisibleAnchorIndex !== null && firstVisibleAnchorIndex !== void 0 && endNoBuffer !== null) {
      for (let i = firstVisibleAnchorIndex; i <= endNoBuffer; i++) {
        const id = (_h = idCache[i]) != null ? _h : getId(state, i);
        idsInView.push(id);
      }
    }
    Object.assign(state, {
      endBuffered,
      endNoBuffer,
      firstFullyOnScreenIndex,
      idsInView,
      startBuffered,
      startBufferedId,
      startNoBuffer
    });
    if (enableScrollForNextCalculateItemsInView && nextTop !== void 0 && nextBottom !== void 0) {
      state.scrollForNextCalculateItemsInView = isNullOrUndefined(nextTop) && isNullOrUndefined(nextBottom) ? void 0 : {
        bottom: nextBottom,
        top: nextTop
      };
    }
    let numContainers = prevNumContainers;
    const pendingRemoval = [];
    if (dataChanged) {
      for (let i = 0; i < numContainers; i++) {
        const itemKey = peek$(ctx, `containerItemKey${i}`);
        if (!keyExtractor || itemKey && indexByKey.get(itemKey) === void 0) {
          pendingRemoval.push(i);
        }
      }
    }
    if (startBuffered !== null && endBuffered !== null) {
      const needNewContainers = [];
      const needNewContainersSet = /* @__PURE__ */ new Set();
      for (let i = startBuffered; i <= endBuffered; i++) {
        const id = (_i = idCache[i]) != null ? _i : getId(state, i);
        if (!containerItemKeys.has(id)) {
          needNewContainersSet.add(i);
          needNewContainers.push(i);
        }
      }
      if (alwaysRenderArr.length > 0) {
        for (const index of alwaysRenderArr) {
          if (index < 0 || index >= dataLength) continue;
          const id = (_j = idCache[index]) != null ? _j : getId(state, index);
          if (id && !containerItemKeys.has(id) && !needNewContainersSet.has(index)) {
            needNewContainersSet.add(index);
            needNewContainers.push(index);
          }
        }
      }
      if (stickyIndicesArr.length > 0) {
        handleStickyActivation(
          ctx,
          stickyIndicesSet,
          stickyIndicesArr,
          currentStickyIdx,
          needNewContainers,
          needNewContainersSet,
          startBuffered,
          endBuffered
        );
      } else if (previousStickyIndex !== -1) {
        set$(ctx, "activeStickyIndex", -1);
      }
      if (needNewContainers.length > 0) {
        const requiredItemTypes = getItemType ? needNewContainers.map((i) => {
          const itemType = getItemType(data[i], i);
          return itemType !== void 0 ? String(itemType) : "";
        }) : void 0;
        const availableContainers = findAvailableContainers(
          ctx,
          needNewContainers.length,
          startBuffered,
          endBuffered,
          pendingRemoval,
          requiredItemTypes,
          needNewContainers
        );
        for (let idx = 0; idx < needNewContainers.length; idx++) {
          const i = needNewContainers[idx];
          const containerIndex = availableContainers[idx];
          const id = (_k = idCache[i]) != null ? _k : getId(state, i);
          const oldKey = peek$(ctx, `containerItemKey${containerIndex}`);
          if (oldKey && oldKey !== id) {
            containerItemKeys.delete(oldKey);
          }
          set$(ctx, `containerItemKey${containerIndex}`, id);
          set$(ctx, `containerItemData${containerIndex}`, data[i]);
          if (requiredItemTypes) {
            state.containerItemTypes.set(containerIndex, requiredItemTypes[idx]);
          }
          containerItemKeys.set(id, containerIndex);
          const containerSticky = `containerSticky${containerIndex}`;
          const isSticky = stickyIndicesSet.has(i);
          const isAlwaysRender = alwaysRenderSet.has(i);
          if (isSticky) {
            set$(ctx, containerSticky, true);
            state.stickyContainerPool.add(containerIndex);
          } else {
            if (peek$(ctx, containerSticky)) {
              set$(ctx, containerSticky, false);
            }
            if (isAlwaysRender) {
              state.stickyContainerPool.add(containerIndex);
            } else if (state.stickyContainerPool.has(containerIndex)) {
              state.stickyContainerPool.delete(containerIndex);
            }
          }
          if (containerIndex >= numContainers) {
            numContainers = containerIndex + 1;
          }
        }
        if (numContainers !== prevNumContainers) {
          set$(ctx, "numContainers", numContainers);
          if (numContainers > peek$(ctx, "numContainersPooled")) {
            set$(ctx, "numContainersPooled", Math.ceil(numContainers * 1.5));
          }
        }
      }
      if (alwaysRenderArr.length > 0) {
        for (const index of alwaysRenderArr) {
          if (index < 0 || index >= dataLength) continue;
          const id = (_l = idCache[index]) != null ? _l : getId(state, index);
          const containerIndex = containerItemKeys.get(id);
          if (containerIndex !== void 0) {
            state.stickyContainerPool.add(containerIndex);
          }
        }
      }
    }
    if (state.stickyContainerPool.size > 0) {
      handleStickyRecycling(
        ctx,
        stickyIndicesArr,
        scroll,
        drawDistance,
        currentStickyIdx,
        pendingRemoval,
        alwaysRenderSet
      );
    }
    let didChangePositions = false;
    for (let i = 0; i < numContainers; i++) {
      const itemKey = peek$(ctx, `containerItemKey${i}`);
      if (pendingRemoval.includes(i)) {
        if (itemKey !== void 0) {
          containerItemKeys.delete(itemKey);
        }
        state.containerItemTypes.delete(i);
        if (state.stickyContainerPool.has(i)) {
          set$(ctx, `containerSticky${i}`, false);
          state.stickyContainerPool.delete(i);
        }
        set$(ctx, `containerItemKey${i}`, void 0);
        set$(ctx, `containerItemData${i}`, void 0);
        set$(ctx, `containerPosition${i}`, POSITION_OUT_OF_VIEW);
        set$(ctx, `containerColumn${i}`, -1);
        set$(ctx, `containerSpan${i}`, 1);
      } else {
        const itemIndex = indexByKey.get(itemKey);
        const item = data[itemIndex];
        if (item !== void 0) {
          const positionValue = positions[itemIndex];
          if (positionValue === void 0) {
            set$(ctx, `containerPosition${i}`, POSITION_OUT_OF_VIEW);
          } else {
            const position = (positionValue || 0) - scrollAdjustPending;
            const column = columns[itemIndex] || 1;
            const span = columnSpans[itemIndex] || 1;
            const prevPos = peek$(ctx, `containerPosition${i}`);
            const prevColumn = peek$(ctx, `containerColumn${i}`);
            const prevSpan = peek$(ctx, `containerSpan${i}`);
            const prevData = peek$(ctx, `containerItemData${i}`);
            if (position > POSITION_OUT_OF_VIEW && position !== prevPos) {
              set$(ctx, `containerPosition${i}`, position);
              didChangePositions = true;
            }
            if (column >= 0 && column !== prevColumn) {
              set$(ctx, `containerColumn${i}`, column);
            }
            if (span !== prevSpan) {
              set$(ctx, `containerSpan${i}`, span);
            }
            if (prevData !== item && (itemsAreEqual ? !itemsAreEqual(prevData, item, itemIndex, data) : true)) {
              set$(ctx, `containerItemData${i}`, item);
            }
          }
        }
      }
    }
    if (didChangePositions) {
      set$(ctx, "lastPositionUpdate", Date.now());
    }
    if (!queuedInitialLayout && endBuffered !== null) {
      if (checkAllSizesKnown(state)) {
        setDidLayout(ctx);
      }
    }
    if (viewabilityConfigCallbackPairs) {
      updateViewableItems(state, ctx, viewabilityConfigCallbackPairs, scrollLength, startNoBuffer, endNoBuffer);
    }
    if (onStickyHeaderChange && stickyIndicesArr.length > 0 && nextActiveStickyIndex !== void 0 && nextActiveStickyIndex !== previousStickyIndex) {
      const item = data[nextActiveStickyIndex];
      if (item !== void 0) {
        onStickyHeaderChange({ index: nextActiveStickyIndex, item });
      }
    }
  });
}

// src/core/checkActualChange.ts
function checkActualChange(state, dataProp, previousData) {
  if (!previousData || !dataProp || dataProp.length !== previousData.length) {
    return true;
  }
  const {
    idCache,
    props: { keyExtractor }
  } = state;
  for (let i = 0; i < dataProp.length; i++) {
    if (dataProp[i] !== previousData[i]) {
      return true;
    }
    if (keyExtractor ? idCache[i] !== keyExtractor(previousData[i], i) : dataProp[i] !== previousData[i]) {
      return true;
    }
  }
  return false;
}

// src/core/checkFinishedScroll.ts
var INITIAL_SCROLL_MIN_TARGET_OFFSET = 1;
var INITIAL_SCROLL_MAX_FALLBACK_CHECKS = 20;
var INITIAL_SCROLL_ZERO_TARGET_EPSILON = 1;
function checkFinishedScroll(ctx) {
  ctx.state.animFrameCheckFinishedScroll = requestAnimationFrame(() => checkFinishedScrollFrame(ctx));
}
function checkFinishedScrollFrame(ctx) {
  var _a3;
  const scrollingTo = ctx.state.scrollingTo;
  if (scrollingTo) {
    const { state } = ctx;
    state.animFrameCheckFinishedScroll = void 0;
    const scroll = state.scrollPending;
    const adjust = state.scrollAdjustHandler.getAdjust();
    const clampedTargetOffset = (_a3 = scrollingTo.targetOffset) != null ? _a3 : clampScrollOffset(ctx, scrollingTo.offset - (scrollingTo.viewOffset || 0), scrollingTo);
    const maxOffset = clampScrollOffset(ctx, scroll, scrollingTo);
    const diff1 = Math.abs(scroll - clampedTargetOffset);
    const diff2 = Math.abs(diff1 - adjust);
    const isNotOverscrolled = Math.abs(scroll - maxOffset) < 1;
    const isAtTarget = diff1 < 1 || !scrollingTo.animated && diff2 < 1;
    if (isNotOverscrolled && isAtTarget) {
      finishScrollTo(ctx);
    }
  }
}
function checkFinishedScrollFallback(ctx) {
  const state = ctx.state;
  const scrollingTo = state.scrollingTo;
  const shouldFinishInitialZeroTarget = shouldFinishInitialZeroTargetScroll(ctx);
  const slowTimeout = (scrollingTo == null ? void 0 : scrollingTo.isInitialScroll) && !shouldFinishInitialZeroTarget || !state.didContainersLayout;
  state.timeoutCheckFinishedScrollFallback = setTimeout(
    () => {
      let numChecks = 0;
      const checkHasScrolled = () => {
        var _a3, _b;
        state.timeoutCheckFinishedScrollFallback = void 0;
        const isStillScrollingTo = state.scrollingTo;
        if (isStillScrollingTo) {
          numChecks++;
          const isNativeInitialPending = isNativeInitialNonZeroTarget(state) && !state.hasScrolled;
          const maxChecks = isNativeInitialPending ? INITIAL_SCROLL_MAX_FALLBACK_CHECKS : 5;
          const shouldFinishZeroTarget = shouldFinishInitialZeroTargetScroll(ctx);
          if (shouldFinishZeroTarget || state.hasScrolled || numChecks > maxChecks) {
            finishScrollTo(ctx);
          } else if (isNativeInitialPending && numChecks <= maxChecks) {
            const targetOffset = (_b = (_a3 = state.initialNativeScrollWatchdog) == null ? void 0 : _a3.targetOffset) != null ? _b : state.scrollPending;
            const scroller = state.refScroller.current;
            if (scroller) {
              scroller.scrollTo({
                animated: false,
                x: state.props.horizontal ? targetOffset : 0,
                y: state.props.horizontal ? 0 : targetOffset
              });
            }
            state.timeoutCheckFinishedScrollFallback = setTimeout(checkHasScrolled, 100);
          } else {
            state.timeoutCheckFinishedScrollFallback = setTimeout(checkHasScrolled, 100);
          }
        }
      };
      checkHasScrolled();
    },
    slowTimeout ? 500 : 100
  );
}
function isNativeInitialNonZeroTarget(state) {
  return !state.didFinishInitialScroll && !!state.initialNativeScrollWatchdog && state.initialNativeScrollWatchdog.targetOffset > INITIAL_SCROLL_MIN_TARGET_OFFSET;
}
function shouldFinishInitialZeroTargetScroll(ctx) {
  var _a3;
  const { state } = ctx;
  return !!((_a3 = state.scrollingTo) == null ? void 0 : _a3.isInitialScroll) && state.props.data.length > 0 && getContentSize(ctx) <= state.scrollLength && state.scrollPending <= INITIAL_SCROLL_ZERO_TARGET_EPSILON;
}

// src/utils/updateAveragesOnDataChange.ts
function updateAveragesOnDataChange(state, oldData, newData) {
  var _a3;
  const {
    averageSizes,
    sizesKnown,
    indexByKey,
    props: { itemsAreEqual, getItemType, keyExtractor }
  } = state;
  if (!itemsAreEqual || !oldData.length || !newData.length) {
    for (const key in averageSizes) {
      delete averageSizes[key];
    }
    return;
  }
  const itemTypesToPreserve = {};
  const newDataLength = newData.length;
  const oldDataLength = oldData.length;
  for (let newIndex = 0; newIndex < newDataLength; newIndex++) {
    const newItem = newData[newIndex];
    const id = keyExtractor ? keyExtractor(newItem, newIndex) : String(newIndex);
    const oldIndex = indexByKey.get(id);
    if (oldIndex !== void 0 && oldIndex < oldDataLength) {
      const knownSize = sizesKnown.get(id);
      if (knownSize === void 0) continue;
      const oldItem = oldData[oldIndex];
      const areEqual = itemsAreEqual(oldItem, newItem, newIndex, newData);
      if (areEqual) {
        const itemType = getItemType ? (_a3 = getItemType(newItem, newIndex)) != null ? _a3 : "" : "";
        let typeData = itemTypesToPreserve[itemType];
        if (!typeData) {
          typeData = itemTypesToPreserve[itemType] = { count: 0, totalSize: 0 };
        }
        typeData.totalSize += knownSize;
        typeData.count++;
      }
    }
  }
  for (const key in averageSizes) {
    delete averageSizes[key];
  }
  for (const itemType in itemTypesToPreserve) {
    const { totalSize, count } = itemTypesToPreserve[itemType];
    if (count > 0) {
      averageSizes[itemType] = {
        avg: totalSize / count,
        num: count
      };
    }
  }
}

// src/core/checkResetContainers.ts
function checkResetContainers(ctx, dataProp) {
  const state = ctx.state;
  const { previousData } = state;
  if (previousData) {
    updateAveragesOnDataChange(state, previousData, dataProp);
  }
  const { maintainScrollAtEnd } = state.props;
  calculateItemsInView(ctx, { dataChanged: true, doMVCP: true });
  const shouldMaintainScrollAtEnd = maintainScrollAtEnd == null ? void 0 : maintainScrollAtEnd.onDataChange;
  const didMaintainScrollAtEnd = shouldMaintainScrollAtEnd && doMaintainScrollAtEnd(ctx);
  if (!didMaintainScrollAtEnd && previousData && dataProp.length > previousData.length) {
    state.isEndReached = false;
  }
  if (!didMaintainScrollAtEnd) {
    checkThresholds(ctx);
  }
  delete state.previousData;
}

// src/core/doInitialAllocateContainers.ts
function doInitialAllocateContainers(ctx) {
  var _a3, _b, _c;
  const state = ctx.state;
  const {
    scrollLength,
    props: {
      data,
      drawDistance,
      getEstimatedItemSize,
      getFixedItemSize,
      getItemType,
      numColumns,
      estimatedItemSize
    }
  } = state;
  const hasContainers = peek$(ctx, "numContainers");
  if (scrollLength > 0 && data.length > 0 && !hasContainers) {
    let averageItemSize;
    if (getFixedItemSize || getEstimatedItemSize) {
      let totalSize = 0;
      const num = Math.min(20, data.length);
      for (let i = 0; i < num; i++) {
        const item = data[i];
        if (item !== void 0) {
          const itemType = (_a3 = getItemType == null ? void 0 : getItemType(item, i)) != null ? _a3 : "";
          totalSize += (_c = (_b = getFixedItemSize == null ? void 0 : getFixedItemSize(item, i, itemType)) != null ? _b : getEstimatedItemSize == null ? void 0 : getEstimatedItemSize(item, i, itemType)) != null ? _c : estimatedItemSize;
        }
      }
      averageItemSize = totalSize / num;
    } else {
      averageItemSize = estimatedItemSize;
    }
    const numContainers = Math.ceil((scrollLength + drawDistance * 2) / averageItemSize * numColumns);
    for (let i = 0; i < numContainers; i++) {
      set$(ctx, `containerPosition${i}`, POSITION_OUT_OF_VIEW);
      set$(ctx, `containerColumn${i}`, -1);
      set$(ctx, `containerSpan${i}`, 1);
    }
    set$(ctx, "numContainers", numContainers);
    set$(ctx, "numContainersPooled", numContainers * state.props.initialContainerPoolRatio);
    if (state.lastLayout) {
      if (state.initialScroll) {
        requestAnimationFrame(() => {
          calculateItemsInView(ctx, { dataChanged: true, doMVCP: true });
        });
      } else {
        calculateItemsInView(ctx, { dataChanged: true, doMVCP: true });
      }
    }
    return true;
  }
}

// src/platform/getWindowSize.ts
function getWindowSize() {
  if (typeof window === "undefined") {
    return { height: 0, width: 0 };
  }
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
}

// src/core/handleLayout.ts
function handleLayout(ctx, layoutParam, setCanRender) {
  const state = ctx.state;
  const { maintainScrollAtEnd, useWindowScroll } = state.props;
  const scrollAxis = state.props.horizontal ? "width" : "height";
  const otherAxis = state.props.horizontal ? "height" : "width";
  let layout = layoutParam;
  if (useWindowScroll) {
    const windowScrollAxisLength = getWindowSize()[scrollAxis];
    layout = windowScrollAxisLength > 0 ? { ...layoutParam, [scrollAxis]: windowScrollAxisLength } : layoutParam;
  }
  const measuredLength = layout[scrollAxis];
  const previousLength = state.scrollLength;
  const scrollLength = measuredLength > 0 ? measuredLength : previousLength;
  const otherAxisSize = layout[otherAxis];
  const needsCalculate = !state.lastLayout || scrollLength > state.scrollLength || state.lastLayout.x !== layout.x || state.lastLayout.y !== layout.y;
  state.lastLayout = layout;
  const prevOtherAxisSize = state.otherAxisSize;
  const didChange = scrollLength !== state.scrollLength || otherAxisSize !== prevOtherAxisSize;
  if (didChange) {
    state.scrollLength = scrollLength;
    state.otherAxisSize = otherAxisSize;
    state.lastBatchingAction = Date.now();
    state.scrollForNextCalculateItemsInView = void 0;
    if (scrollLength > 0) {
      doInitialAllocateContainers(ctx);
    }
    if (needsCalculate) {
      calculateItemsInView(ctx, { doMVCP: true });
    }
    if (didChange || otherAxisSize !== prevOtherAxisSize) {
      set$(ctx, "scrollSize", { height: layout.height, width: layout.width });
    }
    if (maintainScrollAtEnd == null ? void 0 : maintainScrollAtEnd.onLayout) {
      doMaintainScrollAtEnd(ctx);
    }
    checkThresholds(ctx);
    if (state) {
      state.needsOtherAxisSize = otherAxisSize - (state.props.stylePaddingTop || 0) < 10;
    }
    if (IS_DEV && measuredLength === 0) {
      warnDevOnce(
        "height0",
        `List ${state.props.horizontal ? "width" : "height"} is 0. You may need to set a style or \`flex: \` for the list, because children are absolutely positioned.`
      );
    }
  }
  setCanRender(true);
}

// src/core/onScroll.ts
var INITIAL_SCROLL_PROGRESS_EPSILON = 1;
function didObserveInitialScrollProgress(newScroll, watchdog) {
  const previousDistance = Math.abs(watchdog.startScroll - watchdog.targetOffset);
  const nextDistance = Math.abs(newScroll - watchdog.targetOffset);
  return nextDistance <= INITIAL_SCROLL_PROGRESS_EPSILON || nextDistance + INITIAL_SCROLL_PROGRESS_EPSILON < previousDistance;
}
function onScroll(ctx, event) {
  var _a3, _b, _c, _d;
  const state = ctx.state;
  const {
    scrollProcessingEnabled,
    props: { onScroll: onScrollProp }
  } = state;
  if (scrollProcessingEnabled === false) {
    return;
  }
  if (((_b = (_a3 = event.nativeEvent) == null ? void 0 : _a3.contentSize) == null ? void 0 : _b.height) === 0 && ((_c = event.nativeEvent.contentSize) == null ? void 0 : _c.width) === 0) {
    return;
  }
  let insetChanged = false;
  if ((_d = event.nativeEvent) == null ? void 0 : _d.contentInset) {
    const { contentInset } = event.nativeEvent;
    const prevInset = state.nativeContentInset;
    if (!prevInset || prevInset.top !== contentInset.top || prevInset.bottom !== contentInset.bottom || prevInset.left !== contentInset.left || prevInset.right !== contentInset.right) {
      state.nativeContentInset = contentInset;
      insetChanged = true;
    }
  }
  let newScroll = event.nativeEvent.contentOffset[state.props.horizontal ? "x" : "y"];
  if (state.scrollingTo && state.scrollingTo.offset >= newScroll) {
    const maxOffset = clampScrollOffset(ctx, newScroll, state.scrollingTo);
    if (newScroll !== maxOffset && Math.abs(newScroll - maxOffset) > 1) {
      newScroll = maxOffset;
      scrollTo(ctx, {
        forceScroll: true,
        isInitialScroll: true,
        noScrollingTo: true,
        offset: newScroll
      });
      return;
    }
  }
  state.scrollPending = newScroll;
  const initialNativeScrollWatchdog = state.initialNativeScrollWatchdog;
  const didInitialScrollProgress = !!initialNativeScrollWatchdog && didObserveInitialScrollProgress(newScroll, initialNativeScrollWatchdog);
  if (didInitialScrollProgress) {
    state.initialNativeScrollWatchdog = void 0;
  }
  updateScroll(ctx, newScroll, insetChanged);
  if (initialNativeScrollWatchdog && !didInitialScrollProgress) {
    state.hasScrolled = false;
    state.initialNativeScrollWatchdog = initialNativeScrollWatchdog;
  }
  if (state.scrollingTo) {
    checkFinishedScroll(ctx);
  }
  onScrollProp == null ? void 0 : onScrollProp(event);
}

// src/core/ScrollAdjustHandler.ts
var ScrollAdjustHandler = class {
  constructor(ctx) {
    this.appliedAdjust = 0;
    this.pendingAdjust = 0;
    this.ctx = ctx;
  }
  requestAdjust(add) {
    const scrollingTo = this.ctx.state.scrollingTo;
    if ((scrollingTo == null ? void 0 : scrollingTo.animated) && !scrollingTo.isInitialScroll) {
      this.pendingAdjust += add;
      set$(this.ctx, "scrollAdjustPending", this.pendingAdjust);
    } else {
      this.appliedAdjust += add;
      set$(this.ctx, "scrollAdjust", this.appliedAdjust);
    }
    if (this.ctx.state.scrollingTo) {
      checkFinishedScroll(this.ctx);
    }
  }
  getAdjust() {
    return this.appliedAdjust;
  }
  commitPendingAdjust(scrollTarget) {
    {
      const state = this.ctx.state;
      const pending = this.pendingAdjust;
      this.pendingAdjust = 0;
      if (pending !== 0) {
        let targetScroll;
        if ((scrollTarget == null ? void 0 : scrollTarget.index) !== void 0) {
          const currentOffset = calculateOffsetForIndex(this.ctx, scrollTarget.index);
          targetScroll = calculateOffsetWithOffsetPosition(this.ctx, currentOffset, scrollTarget);
          targetScroll = clampScrollOffset(this.ctx, targetScroll, scrollTarget);
        } else {
          targetScroll = clampScrollOffset(this.ctx, state.scroll + pending);
        }
        const adjustment = targetScroll - state.scroll;
        if (Math.abs(adjustment) > 0.1 || Math.abs(pending) > 0.1) {
          this.appliedAdjust += adjustment;
          state.scroll = targetScroll;
          state.scrollForNextCalculateItemsInView = void 0;
          set$(this.ctx, "scrollAdjust", this.appliedAdjust);
        }
        set$(this.ctx, "scrollAdjustPending", 0);
        calculateItemsInView(this.ctx);
      }
    }
  }
};

// src/core/updateItemSize.ts
function runOrScheduleMVCPRecalculate(ctx) {
  const state = ctx.state;
  {
    if (!state.mvcpAnchorLock) {
      if (state.queuedMVCPRecalculate !== void 0) {
        cancelAnimationFrame(state.queuedMVCPRecalculate);
        state.queuedMVCPRecalculate = void 0;
      }
      calculateItemsInView(ctx, { doMVCP: true });
      return;
    }
    if (state.queuedMVCPRecalculate !== void 0) {
      return;
    }
    state.queuedMVCPRecalculate = requestAnimationFrame(() => {
      state.queuedMVCPRecalculate = void 0;
      calculateItemsInView(ctx, { doMVCP: true });
    });
  }
}
function updateItemSize(ctx, itemKey, sizeObj) {
  var _a3;
  const state = ctx.state;
  const {
    didContainersLayout,
    sizesKnown,
    props: {
      getFixedItemSize,
      getItemType,
      horizontal,
      suggestEstimatedItemSize,
      onItemSizeChanged,
      data,
      maintainScrollAtEnd
    }
  } = state;
  if (!data) return;
  const index = state.indexByKey.get(itemKey);
  if (getFixedItemSize) {
    if (index === void 0) {
      return;
    }
    const itemData = state.props.data[index];
    if (itemData === void 0) {
      return;
    }
    const type = getItemType ? (_a3 = getItemType(itemData, index)) != null ? _a3 : "" : "";
    const size2 = getFixedItemSize(itemData, index, type);
    if (size2 !== void 0 && size2 === sizesKnown.get(itemKey)) {
      return;
    }
  }
  let needsRecalculate = !didContainersLayout;
  let shouldMaintainScrollAtEnd = false;
  let minIndexSizeChanged;
  let maxOtherAxisSize = peek$(ctx, "otherAxisSize") || 0;
  const prevSizeKnown = state.sizesKnown.get(itemKey);
  const diff = updateOneItemSize(ctx, itemKey, sizeObj);
  const size = roundSize(horizontal ? sizeObj.width : sizeObj.height);
  if (diff !== 0) {
    minIndexSizeChanged = minIndexSizeChanged !== void 0 ? Math.min(minIndexSizeChanged, index) : index;
    const { startBuffered, endBuffered } = state;
    needsRecalculate || (needsRecalculate = index >= startBuffered && index <= endBuffered);
    if (!needsRecalculate && state.containerItemKeys.has(itemKey)) {
      needsRecalculate = true;
    }
    if (state.needsOtherAxisSize) {
      const otherAxisSize = horizontal ? sizeObj.height : sizeObj.width;
      maxOtherAxisSize = Math.max(maxOtherAxisSize, otherAxisSize);
    }
    if (prevSizeKnown !== void 0 && Math.abs(prevSizeKnown - size) > 5) {
      shouldMaintainScrollAtEnd = true;
    }
    onItemSizeChanged == null ? void 0 : onItemSizeChanged({
      index,
      itemData: state.props.data[index],
      itemKey,
      previous: size - diff,
      size
    });
  }
  if (minIndexSizeChanged !== void 0) {
    state.minIndexSizeChanged = state.minIndexSizeChanged !== void 0 ? Math.min(state.minIndexSizeChanged, minIndexSizeChanged) : minIndexSizeChanged;
  }
  if (IS_DEV && suggestEstimatedItemSize && minIndexSizeChanged !== void 0) {
    if (state.timeoutSizeMessage) clearTimeout(state.timeoutSizeMessage);
    state.timeoutSizeMessage = setTimeout(() => {
      var _a4;
      state.timeoutSizeMessage = void 0;
      const num = state.sizesKnown.size;
      const avg = (_a4 = state.averageSizes[""]) == null ? void 0 : _a4.avg;
      console.warn(
        `[legend-list] Based on the ${num} items rendered so far, the optimal estimated size is ${avg}.`
      );
    }, 1e3);
  }
  const cur = peek$(ctx, "otherAxisSize");
  if (!cur || maxOtherAxisSize > cur) {
    set$(ctx, "otherAxisSize", maxOtherAxisSize);
  }
  if (didContainersLayout || checkAllSizesKnown(state)) {
    if (needsRecalculate) {
      state.scrollForNextCalculateItemsInView = void 0;
      runOrScheduleMVCPRecalculate(ctx);
    }
    if (shouldMaintainScrollAtEnd) {
      if (maintainScrollAtEnd == null ? void 0 : maintainScrollAtEnd.onItemLayout) {
        doMaintainScrollAtEnd(ctx);
      }
    }
  }
}
function updateOneItemSize(ctx, itemKey, sizeObj) {
  var _a3;
  const state = ctx.state;
  const {
    indexByKey,
    sizesKnown,
    averageSizes,
    props: { data, horizontal, getEstimatedItemSize, getItemType, getFixedItemSize }
  } = state;
  if (!data) return 0;
  const index = indexByKey.get(itemKey);
  const prevSize = getItemSize(ctx, itemKey, index, data[index]);
  const rawSize = horizontal ? sizeObj.width : sizeObj.height;
  const size = Math.round(rawSize) ;
  const prevSizeKnown = sizesKnown.get(itemKey);
  sizesKnown.set(itemKey, size);
  if (!getEstimatedItemSize && !getFixedItemSize && size > 0) {
    const itemType = getItemType ? (_a3 = getItemType(data[index], index)) != null ? _a3 : "" : "";
    let averages = averageSizes[itemType];
    if (!averages) {
      averages = averageSizes[itemType] = { avg: 0, num: 0 };
    }
    if (averages.num === 0) {
      averages.avg = size;
      averages.num++;
    } else if (prevSizeKnown !== void 0 && prevSizeKnown > 0) {
      averages.avg += (size - prevSizeKnown) / averages.num;
    } else {
      averages.avg = (averages.avg * averages.num + size) / (averages.num + 1);
      averages.num++;
    }
  }
  if (!prevSize || Math.abs(prevSize - size) > 0.1) {
    setSize(ctx, itemKey, size);
    return size - prevSize;
  }
  return 0;
}
function useWrapIfItem(fn) {
  return useMemo(
    () => fn ? (arg1, arg2, arg3) => arg1 !== void 0 && arg2 !== void 0 ? fn(arg1, arg2, arg3) : void 0 : void 0,
    [fn]
  );
}
var useCombinedRef = (...refs) => {
  const callback = useCallback((element) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }
      if (isFunction(ref)) {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  }, refs);
  return callback;
};

// src/platform/RefreshControl.tsx
function RefreshControl(_props) {
  return null;
}

// src/platform/useStickyScrollHandler.ts
function useStickyScrollHandler(_stickyHeaderIndices, _horizontal, _ctx, onScroll2) {
  return onScroll2;
}

// src/utils/createColumnWrapperStyle.ts
function createColumnWrapperStyle(contentContainerStyle) {
  const { gap, columnGap, rowGap } = contentContainerStyle;
  if (gap || columnGap || rowGap) {
    contentContainerStyle.gap = void 0;
    contentContainerStyle.columnGap = void 0;
    contentContainerStyle.rowGap = void 0;
    return {
      columnGap,
      gap,
      rowGap
    };
  }
}

// src/utils/createImperativeHandle.ts
function createImperativeHandle(ctx) {
  const state = ctx.state;
  const IMPERATIVE_SCROLL_SETTLE_MAX_WAIT_MS = 800;
  const IMPERATIVE_SCROLL_SETTLE_STABLE_FRAMES = 2;
  let imperativeScrollToken = 0;
  const isSettlingAfterDataChange = () => !!state.didDataChange || !!state.didColumnsChange || state.queuedMVCPRecalculate !== void 0 || state.ignoreScrollFromMVCP !== void 0 || hasActiveMVCPAnchorLock(state);
  const runWhenSettled = (token, run) => {
    const startedAt = Date.now();
    let stableFrames = 0;
    const check = () => {
      if (token !== imperativeScrollToken) {
        return;
      }
      if (isSettlingAfterDataChange()) {
        stableFrames = 0;
      } else {
        stableFrames += 1;
      }
      const timedOut = Date.now() - startedAt >= IMPERATIVE_SCROLL_SETTLE_MAX_WAIT_MS;
      if (stableFrames >= IMPERATIVE_SCROLL_SETTLE_STABLE_FRAMES || timedOut) {
        run();
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  };
  const runScrollWithPromise = (run) => new Promise((resolve) => {
    var _a3;
    const token = ++imperativeScrollToken;
    (_a3 = state.pendingScrollResolve) == null ? void 0 : _a3.call(state);
    state.pendingScrollResolve = resolve;
    const runNow = () => {
      if (token !== imperativeScrollToken) {
        return;
      }
      const didStartScroll = run();
      if (!didStartScroll || !state.scrollingTo) {
        if (state.pendingScrollResolve === resolve) {
          state.pendingScrollResolve = void 0;
        }
        resolve();
      }
    };
    if (isSettlingAfterDataChange()) {
      runWhenSettled(token, runNow);
      return;
    }
    runNow();
  });
  const scrollIndexIntoView = (options) => {
    if (state) {
      const { index, ...rest } = options;
      const { startNoBuffer, endNoBuffer } = state;
      if (index < startNoBuffer || index > endNoBuffer) {
        const viewPosition = index < startNoBuffer ? 0 : 1;
        scrollToIndex(ctx, {
          ...rest,
          index,
          viewPosition
        });
        return true;
      }
    }
    return false;
  };
  const refScroller = state.refScroller;
  const clearCaches = (options) => {
    var _a3, _b;
    const mode = (_a3 = options == null ? void 0 : options.mode) != null ? _a3 : "sizes";
    state.sizes.clear();
    state.sizesKnown.clear();
    for (const key in state.averageSizes) {
      delete state.averageSizes[key];
    }
    state.minIndexSizeChanged = 0;
    state.scrollForNextCalculateItemsInView = void 0;
    state.pendingTotalSize = void 0;
    state.totalSize = 0;
    set$(ctx, "totalSize", 0);
    if (mode === "full") {
      state.indexByKey.clear();
      state.idCache.length = 0;
      state.positions.length = 0;
      state.columns.length = 0;
      state.columnSpans.length = 0;
    }
    (_b = state.triggerCalculateItemsInView) == null ? void 0 : _b.call(state, { forceFullItemPositions: true });
  };
  return {
    clearCaches,
    flashScrollIndicators: () => refScroller.current.flashScrollIndicators(),
    getNativeScrollRef: () => refScroller.current,
    getScrollableNode: () => refScroller.current.getScrollableNode(),
    getScrollResponder: () => refScroller.current.getScrollResponder(),
    getState: () => ({
      activeStickyIndex: peek$(ctx, "activeStickyIndex"),
      contentLength: getContentSize(ctx),
      data: state.props.data,
      elementAtIndex: (index) => {
        var _a3;
        return (_a3 = ctx.viewRefs.get(findContainerId(ctx, getId(state, index)))) == null ? void 0 : _a3.current;
      },
      end: state.endNoBuffer,
      endBuffered: state.endBuffered,
      isAtEnd: state.isAtEnd,
      isAtStart: state.isAtStart,
      isEndReached: state.isEndReached,
      isStartReached: state.isStartReached,
      listen: (signalName, cb) => listen$(ctx, signalName, cb),
      listenToPosition: (key, cb) => listenPosition$(ctx, key, cb),
      positionAtIndex: (index) => state.positions[index],
      positionByKey: (key) => {
        const index = state.indexByKey.get(key);
        return index === void 0 ? void 0 : state.positions[index];
      },
      scroll: state.scroll,
      scrollLength: state.scrollLength,
      scrollVelocity: getScrollVelocity(state),
      sizeAtIndex: (index) => state.sizesKnown.get(getId(state, index)),
      sizes: state.sizesKnown,
      start: state.startNoBuffer,
      startBuffered: state.startBuffered
    }),
    reportContentInset: (inset) => {
      state.contentInsetOverride = inset != null ? inset : void 0;
      updateScroll(ctx, state.scroll, true);
    },
    scrollIndexIntoView: (options) => runScrollWithPromise(() => scrollIndexIntoView(options)),
    scrollItemIntoView: ({ item, ...props }) => runScrollWithPromise(() => {
      const data = state.props.data;
      const index = data.indexOf(item);
      if (index !== -1) {
        scrollIndexIntoView({ index, ...props });
        return true;
      }
      return false;
    }),
    scrollToEnd: (options) => runScrollWithPromise(() => {
      const data = state.props.data;
      const stylePaddingBottom = state.props.stylePaddingBottom;
      const index = data.length - 1;
      if (index !== -1) {
        const paddingBottom = stylePaddingBottom || 0;
        const footerSize = peek$(ctx, "footerSize") || 0;
        scrollToIndex(ctx, {
          ...options,
          index,
          viewOffset: -paddingBottom - footerSize + ((options == null ? void 0 : options.viewOffset) || 0),
          viewPosition: 1
        });
        return true;
      }
      return false;
    }),
    scrollToIndex: (params) => runScrollWithPromise(() => {
      scrollToIndex(ctx, params);
      return true;
    }),
    scrollToItem: ({ item, ...props }) => runScrollWithPromise(() => {
      const data = state.props.data;
      const index = data.indexOf(item);
      if (index !== -1) {
        scrollToIndex(ctx, { index, ...props });
        return true;
      }
      return false;
    }),
    scrollToOffset: (params) => runScrollWithPromise(() => {
      scrollTo(ctx, params);
      return true;
    }),
    setScrollProcessingEnabled: (enabled) => {
      state.scrollProcessingEnabled = enabled;
    },
    setVisibleContentAnchorOffset: (value) => {
      const val = isFunction(value) ? value(peek$(ctx, "scrollAdjustUserOffset") || 0) : value;
      set$(ctx, "scrollAdjustUserOffset", val);
    }
  };
}

// src/utils/getAlwaysRenderIndices.ts
var sortAsc = (a, b) => a - b;
var toCount = (value) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
var addIndex = (result, dataLength, index) => {
  if (index >= 0 && index < dataLength) {
    result.add(index);
  }
};
function getAlwaysRenderIndices(config, data, keyExtractor) {
  var _a3, _b;
  if (!config || data.length === 0) {
    return [];
  }
  const result = /* @__PURE__ */ new Set();
  const dataLength = data.length;
  const topCount = toCount(config.top);
  if (topCount > 0) {
    for (let i = 0; i < Math.min(topCount, dataLength); i++) {
      addIndex(result, dataLength, i);
    }
  }
  const bottomCount = toCount(config.bottom);
  if (bottomCount > 0) {
    for (let i = Math.max(0, dataLength - bottomCount); i < dataLength; i++) {
      addIndex(result, dataLength, i);
    }
  }
  if ((_a3 = config.indices) == null ? void 0 : _a3.length) {
    for (const index of config.indices) {
      if (!Number.isFinite(index)) continue;
      addIndex(result, dataLength, Math.floor(index));
    }
  }
  if ((_b = config.keys) == null ? void 0 : _b.length) {
    const keys = new Set(config.keys);
    for (let i = 0; i < dataLength && keys.size > 0; i++) {
      const key = keyExtractor(data[i], i);
      if (keys.has(key)) {
        addIndex(result, dataLength, i);
        keys.delete(key);
      }
    }
  }
  const indices = Array.from(result);
  indices.sort(sortAsc);
  return indices;
}
function getRenderedItem(ctx, key) {
  var _a3;
  const state = ctx.state;
  if (!state) {
    return null;
  }
  const {
    indexByKey,
    props: { data, getItemType, renderItem }
  } = state;
  const index = indexByKey.get(key);
  if (index === void 0) {
    return null;
  }
  let renderedItem = null;
  const extraData = peek$(ctx, "extraData");
  const item = data[index];
  if (renderItem && !isNullOrUndefined(item)) {
    const itemProps = {
      data,
      extraData,
      index,
      item,
      type: getItemType ? (_a3 = getItemType(item, index)) != null ? _a3 : "" : ""
    };
    renderedItem = isFunction(renderItem) ? renderItem(itemProps) : React3__default.createElement(renderItem, itemProps);
  }
  return { index, item: data[index], renderedItem };
}

// src/utils/normalizeMaintainScrollAtEnd.ts
function normalizeMaintainScrollAtEndOn(on, hasExplicitOn) {
  var _a3, _b, _c;
  return {
    animated: false,
    onDataChange: hasExplicitOn ? (_a3 = on == null ? void 0 : on.dataChange) != null ? _a3 : false : true,
    onItemLayout: hasExplicitOn ? (_b = on == null ? void 0 : on.itemLayout) != null ? _b : false : true,
    onLayout: hasExplicitOn ? (_c = on == null ? void 0 : on.layout) != null ? _c : false : true
  };
}
function normalizeMaintainScrollAtEnd(value) {
  var _a3;
  if (!value) {
    return void 0;
  }
  if (value === true) {
    return {
      ...normalizeMaintainScrollAtEndOn(void 0, false),
      animated: false
    };
  }
  const normalizedTriggers = normalizeMaintainScrollAtEndOn(value.on, "on" in value);
  return {
    ...normalizedTriggers,
    animated: (_a3 = value.animated) != null ? _a3 : false
  };
}

// src/utils/normalizeMaintainVisibleContentPosition.ts
function normalizeMaintainVisibleContentPosition(value) {
  var _a3, _b;
  if (value === true) {
    return { data: true, size: true };
  }
  if (value && typeof value === "object") {
    return {
      data: (_a3 = value.data) != null ? _a3 : false,
      shouldRestorePosition: value.shouldRestorePosition,
      size: (_b = value.size) != null ? _b : true
    };
  }
  if (value === false) {
    return { data: false, size: false };
  }
  return { data: false, size: true };
}

// src/utils/setPaddingTop.ts
function setPaddingTop(ctx, { stylePaddingTop }) {
  const state = ctx.state;
  if (stylePaddingTop !== void 0) {
    const prevStylePaddingTop = peek$(ctx, "stylePaddingTop") || 0;
    if (stylePaddingTop < prevStylePaddingTop) {
      let prevTotalSize = peek$(ctx, "totalSize") || 0;
      set$(ctx, "totalSize", prevTotalSize + prevStylePaddingTop);
      state.timeoutSetPaddingTop = setTimeout(() => {
        prevTotalSize = peek$(ctx, "totalSize") || 0;
        set$(ctx, "totalSize", prevTotalSize - prevStylePaddingTop);
      }, 16);
    }
    set$(ctx, "stylePaddingTop", stylePaddingTop);
  }
}
function useThrottleDebounce(mode) {
  const timeoutRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const lastArgsRef = useRef(null);
  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const execute = useCallback(
    (callback, delay, ...args) => {
      {
        const now = Date.now();
        lastArgsRef.current = args;
        if (now - lastCallTimeRef.current >= delay) {
          lastCallTimeRef.current = now;
          callback(...args);
          clearTimeoutRef();
        } else {
          clearTimeoutRef();
          timeoutRef.current = setTimeout(
            () => {
              if (lastArgsRef.current) {
                lastCallTimeRef.current = Date.now();
                callback(...lastArgsRef.current);
                timeoutRef.current = null;
                lastArgsRef.current = null;
              }
            },
            delay - (now - lastCallTimeRef.current)
          );
        }
      }
    },
    [mode]
  );
  return execute;
}

// src/utils/throttledOnScroll.ts
function useThrottledOnScroll(originalHandler, scrollEventThrottle) {
  const throttle = useThrottleDebounce("throttle");
  return (event) => throttle(originalHandler, scrollEventThrottle, { nativeEvent: event.nativeEvent });
}

// src/components/LegendList.tsx
var LegendList = typedMemo(
  // biome-ignore lint/nursery/noShadow: const function name shadowing is intentional
  typedForwardRef(function LegendList2(props, forwardedRef) {
    const { children, data: dataProp, renderItem: renderItemProp, ...restProps } = props;
    const isChildrenMode = children !== void 0 && dataProp === void 0;
    const processedProps = isChildrenMode ? {
      ...restProps,
      childrenMode: true,
      data: (isArray(children) ? children : React3.Children.toArray(children)).flat(1),
      renderItem: ({ item }) => item
    } : {
      ...restProps,
      data: dataProp || [],
      renderItem: renderItemProp
    };
    return /* @__PURE__ */ React3.createElement(StateProvider, null, /* @__PURE__ */ React3.createElement(LegendListInner, { ...processedProps, ref: forwardedRef }));
  })
);
var LegendListInner = typedForwardRef(function LegendListInner2(props, forwardedRef) {
  var _a3, _b, _c, _d, _e, _f, _g, _h;
  const {
    alignItemsAtEnd = false,
    alwaysRender,
    columnWrapperStyle,
    contentContainerStyle: contentContainerStyleProp,
    contentInset,
    data: dataProp = [],
    dataVersion,
    drawDistance = 250,
    estimatedItemSize = 100,
    estimatedListSize,
    extraData,
    getEstimatedItemSize,
    getFixedItemSize,
    getItemType,
    horizontal,
    initialContainerPoolRatio = 2,
    initialScrollAtEnd = false,
    initialScrollIndex: initialScrollIndexProp,
    initialScrollOffset: initialScrollOffsetProp,
    itemsAreEqual,
    keyExtractor: keyExtractorProp,
    ListEmptyComponent,
    ListHeaderComponent,
    maintainScrollAtEnd = false,
    maintainScrollAtEndThreshold = 0.1,
    maintainVisibleContentPosition: maintainVisibleContentPositionProp,
    numColumns: numColumnsProp = 1,
    overrideItemLayout,
    onEndReached,
    onEndReachedThreshold = 0.5,
    onItemSizeChanged,
    onMetricsChange,
    onLayout: onLayoutProp,
    onLoad,
    onMomentumScrollEnd,
    onRefresh,
    onScroll: onScrollProp,
    onStartReached,
    onStartReachedThreshold = 0.5,
    onStickyHeaderChange,
    onViewableItemsChanged,
    progressViewOffset,
    recycleItems = false,
    refreshControl,
    refreshing,
    refScrollView,
    renderScrollComponent,
    renderItem,
    scrollEventThrottle,
    snapToIndices,
    stickyHeaderIndices: stickyHeaderIndicesProp,
    stickyIndices: stickyIndicesDeprecated,
    // TODOV3: Remove from v3 release
    style: styleProp,
    suggestEstimatedItemSize,
    useWindowScroll = false,
    viewabilityConfig,
    viewabilityConfigCallbackPairs,
    waitForInitialLayout = true,
    ...rest
  } = props;
  const animatedPropsInternal = props.animatedPropsInternal;
  const positionComponentInternal = props.positionComponentInternal;
  const stickyPositionComponentInternal = props.stickyPositionComponentInternal;
  const {
    childrenMode,
    positionComponentInternal: _positionComponentInternal,
    stickyPositionComponentInternal: _stickyPositionComponentInternal,
    ...restProps
  } = rest;
  const contentContainerStyleBase = StyleSheet.flatten(contentContainerStyleProp);
  const shouldFlexGrow = alignItemsAtEnd && (horizontal ? (contentContainerStyleBase == null ? void 0 : contentContainerStyleBase.minWidth) == null : (contentContainerStyleBase == null ? void 0 : contentContainerStyleBase.minHeight) == null);
  const contentContainerStyle = {
    ...contentContainerStyleBase,
    ...alignItemsAtEnd ? {
      display: "flex",
      flexDirection: horizontal ? "row" : "column",
      ...shouldFlexGrow ? { flexGrow: 1 } : {},
      justifyContent: "flex-end"
    } : {}
  };
  const style = { ...StyleSheet.flatten(styleProp) };
  const stylePaddingTopState = extractPadding(style, contentContainerStyle, "Top");
  const stylePaddingBottomState = extractPadding(style, contentContainerStyle, "Bottom");
  const maintainScrollAtEndConfig = normalizeMaintainScrollAtEnd(maintainScrollAtEnd);
  const maintainVisibleContentPositionConfig = normalizeMaintainVisibleContentPosition(
    maintainVisibleContentPositionProp
  );
  const hasInitialScrollIndex = initialScrollIndexProp !== void 0 && initialScrollIndexProp !== null;
  const hasInitialScrollOffset = initialScrollOffsetProp !== void 0 && initialScrollOffsetProp !== null;
  const initialScrollUsesOffsetOnly = !initialScrollAtEnd && !hasInitialScrollIndex && hasInitialScrollOffset;
  const initialScrollProp = initialScrollAtEnd ? { index: Math.max(0, dataProp.length - 1), viewOffset: -stylePaddingBottomState, viewPosition: 1 } : hasInitialScrollIndex ? typeof initialScrollIndexProp === "object" ? {
    index: (_a3 = initialScrollIndexProp.index) != null ? _a3 : 0,
    viewOffset: (_b = initialScrollIndexProp.viewOffset) != null ? _b : initialScrollIndexProp.viewPosition === 1 ? -stylePaddingBottomState : 0,
    viewPosition: (_c = initialScrollIndexProp.viewPosition) != null ? _c : 0
  } : {
    index: initialScrollIndexProp != null ? initialScrollIndexProp : 0,
    viewOffset: initialScrollOffsetProp != null ? initialScrollOffsetProp : 0
  } : initialScrollUsesOffsetOnly ? {
    contentOffset: initialScrollOffsetProp != null ? initialScrollOffsetProp : 0,
    index: 0,
    viewOffset: 0
  } : void 0;
  const [canRender, setCanRender] = React3.useState(!IsNewArchitecture);
  const ctx = useStateContext();
  ctx.columnWrapperStyle = columnWrapperStyle || (contentContainerStyle ? createColumnWrapperStyle(contentContainerStyle) : void 0);
  const refScroller = useRef(null);
  const combinedRef = useCombinedRef(refScroller, refScrollView);
  const keyExtractor = keyExtractorProp != null ? keyExtractorProp : ((_item, index) => index.toString());
  const stickyHeaderIndices = stickyHeaderIndicesProp != null ? stickyHeaderIndicesProp : stickyIndicesDeprecated;
  const alwaysRenderIndices = useMemo(() => {
    const indices = getAlwaysRenderIndices(alwaysRender, dataProp, keyExtractor);
    return { arr: indices, set: new Set(indices) };
  }, [
    alwaysRender == null ? void 0 : alwaysRender.top,
    alwaysRender == null ? void 0 : alwaysRender.bottom,
    (_d = alwaysRender == null ? void 0 : alwaysRender.indices) == null ? void 0 : _d.join(","),
    (_e = alwaysRender == null ? void 0 : alwaysRender.keys) == null ? void 0 : _e.join(","),
    dataProp,
    dataVersion,
    keyExtractor
  ]);
  if (IS_DEV && stickyIndicesDeprecated && !stickyHeaderIndicesProp) {
    warnDevOnce(
      "stickyIndices",
      "stickyIndices has been renamed to stickyHeaderIndices. Please update your props to use stickyHeaderIndices."
    );
  }
  if (IS_DEV && useWindowScroll && renderScrollComponent) {
    warnDevOnce(
      "useWindowScrollRenderScrollComponent",
      "useWindowScroll is not supported when renderScrollComponent is provided."
    );
  }
  const useWindowScrollResolved = !!useWindowScroll && !renderScrollComponent;
  const refState = useRef(void 0);
  const hasOverrideItemLayout = !!overrideItemLayout;
  const prevHasOverrideItemLayout = useRef(hasOverrideItemLayout);
  if (!refState.current) {
    if (!ctx.state) {
      const initialScrollLength = (estimatedListSize != null ? estimatedListSize : { height: 0, width: 0 } )[horizontal ? "width" : "height"];
      ctx.state = {
        activeStickyIndex: -1,
        averageSizes: {},
        columnSpans: [],
        columns: [],
        containerItemKeys: /* @__PURE__ */ new Map(),
        containerItemTypes: /* @__PURE__ */ new Map(),
        contentInsetOverride: void 0,
        dataChangeEpoch: 0,
        dataChangeNeedsScrollUpdate: false,
        didColumnsChange: false,
        didDataChange: false,
        enableScrollForNextCalculateItemsInView: true,
        endBuffered: -1,
        endNoBuffer: -1,
        endReachedSnapshot: void 0,
        firstFullyOnScreenIndex: -1,
        idCache: [],
        idsInView: [],
        indexByKey: /* @__PURE__ */ new Map(),
        initialAnchor: !initialScrollUsesOffsetOnly && (initialScrollProp == null ? void 0 : initialScrollProp.index) !== void 0 && (initialScrollProp == null ? void 0 : initialScrollProp.viewPosition) !== void 0 ? {
          attempts: 0,
          index: initialScrollProp.index,
          settledTicks: 0,
          viewOffset: (_f = initialScrollProp.viewOffset) != null ? _f : 0,
          viewPosition: initialScrollProp.viewPosition
        } : void 0,
        initialNativeScrollWatchdog: void 0,
        initialScroll: initialScrollProp,
        initialScrollLastDidFinish: false,
        initialScrollLastTarget: initialScrollProp,
        initialScrollLastTargetUsesOffset: initialScrollUsesOffsetOnly,
        initialScrollPreviousDataLength: dataProp.length,
        initialScrollRetryLastLength: void 0,
        initialScrollRetryWindowUntil: 0,
        initialScrollUsesOffset: initialScrollUsesOffsetOnly,
        isAtEnd: false,
        isAtStart: false,
        isEndReached: null,
        isFirst: true,
        isStartReached: null,
        lastBatchingAction: Date.now(),
        lastLayout: void 0,
        lastScrollDelta: 0,
        loadStartTime: Date.now(),
        minIndexSizeChanged: 0,
        nativeContentInset: void 0,
        nativeMarginTop: 0,
        pendingNativeMVCPAdjust: void 0,
        positions: [],
        props: {},
        queuedCalculateItemsInView: 0,
        refScroller: { current: null },
        scroll: 0,
        scrollAdjustHandler: new ScrollAdjustHandler(ctx),
        scrollForNextCalculateItemsInView: void 0,
        scrollHistory: [],
        scrollLength: initialScrollLength,
        scrollPending: 0,
        scrollPrev: 0,
        scrollPrevTime: 0,
        scrollProcessingEnabled: true,
        scrollTime: 0,
        sizes: /* @__PURE__ */ new Map(),
        sizesKnown: /* @__PURE__ */ new Map(),
        startBuffered: -1,
        startNoBuffer: -1,
        startReachedSnapshot: void 0,
        startReachedSnapshotDataChangeEpoch: void 0,
        stickyContainerPool: /* @__PURE__ */ new Set(),
        stickyContainers: /* @__PURE__ */ new Map(),
        timeoutSizeMessage: 0,
        timeouts: /* @__PURE__ */ new Set(),
        totalSize: 0,
        viewabilityConfigCallbackPairs: void 0
      };
      const internalState = ctx.state;
      internalState.triggerCalculateItemsInView = (params) => calculateItemsInView(ctx, params);
      set$(ctx, "maintainVisibleContentPosition", maintainVisibleContentPositionConfig);
      set$(ctx, "extraData", extraData);
    }
    refState.current = ctx.state;
  }
  const state = refState.current;
  const isFirstLocal = state.isFirst;
  state.didColumnsChange = numColumnsProp !== state.props.numColumns;
  const didDataReferenceChangeLocal = state.props.data !== dataProp;
  const didDataVersionChangeLocal = state.props.dataVersion !== dataVersion;
  const didDataChangeLocal = didDataVersionChangeLocal || didDataReferenceChangeLocal && checkActualChange(state, dataProp, state.props.data);
  if (didDataChangeLocal) {
    state.dataChangeEpoch += 1;
    state.dataChangeNeedsScrollUpdate = true;
    state.didDataChange = true;
    state.previousData = state.props.data;
  }
  const throttleScrollFn = scrollEventThrottle && onScrollProp ? useThrottledOnScroll(onScrollProp, scrollEventThrottle) : onScrollProp;
  state.props = {
    alignItemsAtEnd,
    alwaysRender,
    alwaysRenderIndicesArr: alwaysRenderIndices.arr,
    alwaysRenderIndicesSet: alwaysRenderIndices.set,
    animatedProps: animatedPropsInternal,
    contentInset,
    data: dataProp,
    dataVersion,
    drawDistance,
    estimatedItemSize,
    getEstimatedItemSize: useWrapIfItem(getEstimatedItemSize),
    getFixedItemSize: useWrapIfItem(getFixedItemSize),
    getItemType: useWrapIfItem(getItemType),
    horizontal: !!horizontal,
    initialContainerPoolRatio,
    itemsAreEqual,
    keyExtractor: useWrapIfItem(keyExtractor),
    maintainScrollAtEnd: maintainScrollAtEndConfig,
    maintainScrollAtEndThreshold,
    maintainVisibleContentPosition: maintainVisibleContentPositionConfig,
    numColumns: numColumnsProp,
    onEndReached,
    onEndReachedThreshold,
    onItemSizeChanged,
    onLoad,
    onScroll: throttleScrollFn,
    onStartReached,
    onStartReachedThreshold,
    onStickyHeaderChange,
    overrideItemLayout,
    positionComponentInternal,
    recycleItems: !!recycleItems,
    renderItem,
    snapToIndices,
    stickyIndicesArr: stickyHeaderIndices != null ? stickyHeaderIndices : [],
    stickyIndicesSet: useMemo(() => new Set(stickyHeaderIndices != null ? stickyHeaderIndices : []), [stickyHeaderIndices == null ? void 0 : stickyHeaderIndices.join(",")]),
    stickyPositionComponentInternal,
    stylePaddingBottom: stylePaddingBottomState,
    stylePaddingTop: stylePaddingTopState,
    suggestEstimatedItemSize: !!suggestEstimatedItemSize,
    useWindowScroll: useWindowScrollResolved
  };
  state.refScroller = refScroller;
  const memoizedLastItemKeys = useMemo(() => {
    if (!dataProp.length) return [];
    return Array.from(
      { length: Math.min(numColumnsProp, dataProp.length) },
      (_, i) => getId(state, dataProp.length - 1 - i)
    );
  }, [dataProp, dataVersion, numColumnsProp]);
  const initializeStateVars = (shouldAdjustPadding) => {
    set$(ctx, "lastItemKeys", memoizedLastItemKeys);
    set$(ctx, "numColumns", numColumnsProp);
    const prevPaddingTop = peek$(ctx, "stylePaddingTop");
    setPaddingTop(ctx, { stylePaddingTop: stylePaddingTopState });
    refState.current.props.stylePaddingBottom = stylePaddingBottomState;
    let paddingDiff = stylePaddingTopState - prevPaddingTop;
    if (shouldAdjustPadding && maintainVisibleContentPositionConfig.size && paddingDiff && prevPaddingTop !== void 0 && Platform.OS === "ios") ;
  };
  if (isFirstLocal) {
    initializeStateVars(false);
    updateItemPositions(
      ctx,
      /*dataChanged*/
      true
    );
  }
  const resolveInitialScrollOffset = useCallback((initialScroll) => {
    var _a4;
    if (state.initialScrollUsesOffset) {
      return clampScrollOffset(ctx, (_a4 = initialScroll.contentOffset) != null ? _a4 : 0);
    }
    const baseOffset = initialScroll.index !== void 0 ? calculateOffsetForIndex(ctx, initialScroll.index) : 0;
    const resolvedOffset = calculateOffsetWithOffsetPosition(ctx, baseOffset, initialScroll);
    return clampScrollOffset(ctx, resolvedOffset, initialScroll);
  }, []);
  const finishInitialScrollWithoutScroll = useCallback(() => {
    refState.current.initialAnchor = void 0;
    refState.current.initialScroll = void 0;
    state.initialAnchor = void 0;
    state.initialScroll = void 0;
    state.initialScrollUsesOffset = false;
    state.initialScrollLastTarget = void 0;
    state.initialScrollLastTargetUsesOffset = false;
    setInitialRenderState(ctx, { didInitialScroll: true });
  }, []);
  const setActiveInitialScrollTarget = useCallback(
    (target, options) => {
      const usesOffset = !!(options == null ? void 0 : options.usesOffset);
      state.initialScrollUsesOffset = usesOffset;
      state.initialScrollLastTarget = target;
      state.initialScrollLastTargetUsesOffset = usesOffset;
      refState.current.initialScroll = target;
      state.initialScroll = target;
      if ((options == null ? void 0 : options.resetDidFinish) && state.didFinishInitialScroll) {
        state.didFinishInitialScroll = false;
      }
      if (!(options == null ? void 0 : options.syncAnchor)) {
        return;
      }
    },
    []
  );
  const shouldFinishInitialScrollAtOrigin = useCallback(
    (initialScroll, offset) => {
      var _a4, _b2, _c2;
      if (offset !== 0 || initialScrollAtEnd) {
        return false;
      }
      if (state.initialScrollUsesOffset) {
        return Math.abs((_a4 = initialScroll.contentOffset) != null ? _a4 : 0) <= 1;
      }
      return initialScroll.index === 0 && ((_b2 = initialScroll.viewPosition) != null ? _b2 : 0) === 0 && Math.abs((_c2 = initialScroll.viewOffset) != null ? _c2 : 0) <= 1;
    },
    [initialScrollAtEnd]
  );
  const shouldFinishEmptyInitialScrollAtEnd = useCallback(
    (initialScroll, offset) => {
      return dataProp.length === 0 && initialScrollAtEnd && offset === 0 && initialScroll.viewPosition === 1;
    },
    [dataProp.length, initialScrollAtEnd]
  );
  const shouldRearmFinishedEmptyInitialScrollAtEnd = useCallback(
    (initialScroll) => {
      var _a4;
      return !!(state.didFinishInitialScroll && dataProp.length > 0 && initialScroll && !state.initialScrollUsesOffset && initialScroll.index === 0 && initialScroll.viewPosition === 1 && ((_a4 = initialScroll.contentOffset) != null ? _a4 : 0) === 0);
    },
    [dataProp.length]
  );
  const initialContentOffset = useMemo(() => {
    let value;
    const { initialScroll, initialAnchor } = refState.current;
    if (initialScroll) {
      if (!state.initialScrollUsesOffset && !IsNewArchitecture) ;
      if (initialScroll.contentOffset !== void 0) {
        value = initialScroll.contentOffset;
      } else {
        const clampedOffset = resolveInitialScrollOffset(initialScroll);
        const updatedInitialScroll = { ...initialScroll, contentOffset: clampedOffset };
        setActiveInitialScrollTarget(updatedInitialScroll, {
          usesOffset: state.initialScrollUsesOffset
        });
        value = clampedOffset;
      }
    } else {
      refState.current.initialAnchor = void 0;
      value = 0;
    }
    const hasPendingDataDependentInitialScroll = !!initialScroll && dataProp.length === 0 && !shouldFinishInitialScrollAtOrigin(initialScroll, value) && !shouldFinishEmptyInitialScrollAtEnd(initialScroll, value);
    if (!value && !hasPendingDataDependentInitialScroll) {
      if (initialScroll && shouldFinishInitialScrollAtOrigin(initialScroll, value)) {
        finishInitialScrollWithoutScroll();
      } else {
        setInitialRenderState(ctx, { didInitialScroll: true });
      }
    }
    return value;
  }, []);
  if (isFirstLocal || didDataChangeLocal || numColumnsProp !== peek$(ctx, "numColumns")) {
    refState.current.lastBatchingAction = Date.now();
    if (!keyExtractorProp && !isFirstLocal && didDataChangeLocal) {
      IS_DEV && !childrenMode && warnDevOnce(
        "keyExtractor",
        "Changing data without a keyExtractor can cause slow performance and resetting scroll. If your list data can change you should use a keyExtractor with a unique id for best performance and behavior."
      );
      refState.current.sizes.clear();
      refState.current.positions.length = 0;
      refState.current.totalSize = 0;
      set$(ctx, "totalSize", 0);
    }
  }
  const doInitialScroll = useCallback((options) => {
    var _a4, _b2;
    const allowPostFinishRetry = !!(options == null ? void 0 : options.allowPostFinishRetry);
    const { didFinishInitialScroll, queuedInitialLayout, scrollingTo } = state;
    const initialScroll = (_a4 = state.initialScroll) != null ? _a4 : allowPostFinishRetry ? state.initialScrollLastTarget : void 0;
    const isInitialScrollInProgress = !!(scrollingTo == null ? void 0 : scrollingTo.isInitialScroll);
    const needsContainerLayoutForInitialScroll = !state.initialScrollUsesOffset;
    const shouldWaitForInitialLayout = waitForInitialLayout && needsContainerLayoutForInitialScroll && !queuedInitialLayout && !allowPostFinishRetry && !isInitialScrollInProgress;
    if (!initialScroll || shouldWaitForInitialLayout || didFinishInitialScroll && !allowPostFinishRetry || scrollingTo && !isInitialScrollInProgress) {
      return;
    }
    if (allowPostFinishRetry && state.initialScrollLastTargetUsesOffset) {
      return;
    }
    const didMoveAwayFromInitialTarget = allowPostFinishRetry && initialScroll.contentOffset !== void 0 && Math.abs(state.scroll - initialScroll.contentOffset) > 1;
    if (didMoveAwayFromInitialTarget) {
      state.initialScrollRetryWindowUntil = 0;
      return;
    }
    const offset = resolveInitialScrollOffset(initialScroll);
    const activeInitialTargetOffset = isInitialScrollInProgress ? (_b2 = scrollingTo.targetOffset) != null ? _b2 : scrollingTo.offset : void 0;
    const didOffsetChange = initialScroll.contentOffset === void 0 || Math.abs(initialScroll.contentOffset - offset) > 1;
    const didActiveInitialTargetChange = activeInitialTargetOffset !== void 0 && Math.abs(activeInitialTargetOffset - offset) > 1;
    if (!didOffsetChange && (allowPostFinishRetry || isInitialScrollInProgress && !didActiveInitialTargetChange)) {
      return;
    }
    if (didOffsetChange) {
      const updatedInitialScroll = { ...initialScroll, contentOffset: offset };
      if (!state.initialScrollUsesOffset) {
        state.initialScrollLastTarget = updatedInitialScroll;
        state.initialScrollLastTargetUsesOffset = false;
        if (state.initialScroll) {
          refState.current.initialScroll = updatedInitialScroll;
          state.initialScroll = updatedInitialScroll;
        }
      }
    }
    const hasMeasuredScrollLayout = !!state.lastLayout && state.scrollLength > 0;
    const shouldForceNativeInitialScroll = state.initialScrollUsesOffset && hasMeasuredScrollLayout || allowPostFinishRetry || !!queuedInitialLayout || isInitialScrollInProgress && didOffsetChange;
    performInitialScroll(ctx, {
      forceScroll: shouldForceNativeInitialScroll,
      initialScrollUsesOffset: state.initialScrollUsesOffset,
      resolvedOffset: offset,
      target: initialScroll
    });
  }, []);
  useLayoutEffect(() => {
    var _a4;
    const previousDataLength = state.initialScrollPreviousDataLength;
    state.initialScrollPreviousDataLength = dataProp.length;
    if (previousDataLength !== 0 || dataProp.length === 0 || !state.initialScroll || !state.queuedInitialLayout) {
      return;
    }
    if (initialScrollAtEnd) {
      const lastIndex = Math.max(0, dataProp.length - 1);
      const initialScroll = state.initialScroll;
      const shouldRearm = shouldRearmFinishedEmptyInitialScrollAtEnd(initialScroll);
      if (state.didFinishInitialScroll && !shouldRearm) {
        return;
      }
      if (initialScroll && !state.initialScrollUsesOffset && initialScroll.index === lastIndex && initialScroll.viewPosition === 1 && !shouldRearm) {
        return;
      }
      const updatedInitialScroll = {
        contentOffset: void 0,
        index: lastIndex,
        viewOffset: (_a4 = initialScroll == null ? void 0 : initialScroll.viewOffset) != null ? _a4 : -stylePaddingBottomState,
        viewPosition: 1
      };
      setActiveInitialScrollTarget(updatedInitialScroll, {
        resetDidFinish: shouldRearm,
        syncAnchor: true
      });
      doInitialScroll();
      return;
    }
    if (state.didFinishInitialScroll) {
      return;
    }
    doInitialScroll();
  }, [
    dataProp.length,
    doInitialScroll,
    initialScrollAtEnd,
    shouldRearmFinishedEmptyInitialScrollAtEnd,
    stylePaddingBottomState
  ]);
  useLayoutEffect(() => {
    var _a4;
    if (!initialScrollAtEnd) {
      return;
    }
    const lastIndex = Math.max(0, dataProp.length - 1);
    const initialScroll = state.initialScroll;
    const shouldRearm = shouldRearmFinishedEmptyInitialScrollAtEnd(initialScroll);
    if (state.didFinishInitialScroll && !shouldRearm) {
      return;
    }
    if (shouldRearm) {
      state.didFinishInitialScroll = false;
    }
    if (initialScroll && !state.initialScrollUsesOffset && initialScroll.index === lastIndex && initialScroll.viewPosition === 1 && !shouldRearm) {
      return;
    }
    const updatedInitialScroll = {
      contentOffset: void 0,
      index: lastIndex,
      viewOffset: (_a4 = initialScroll == null ? void 0 : initialScroll.viewOffset) != null ? _a4 : -stylePaddingBottomState,
      viewPosition: 1
    };
    setActiveInitialScrollTarget(updatedInitialScroll, {
      resetDidFinish: shouldRearm,
      syncAnchor: true
    });
    doInitialScroll();
  }, [
    dataProp.length,
    doInitialScroll,
    initialScrollAtEnd,
    shouldRearmFinishedEmptyInitialScrollAtEnd,
    stylePaddingBottomState
  ]);
  const onLayoutFooter = useCallback(
    (layout) => {
      var _a4;
      if (!initialScrollAtEnd) {
        return;
      }
      const { initialScroll } = state;
      if (!initialScroll) {
        return;
      }
      const lastIndex = Math.max(0, dataProp.length - 1);
      if (initialScroll.index !== lastIndex || initialScroll.viewPosition !== 1) {
        return;
      }
      const footerSize = layout[horizontal ? "width" : "height"];
      const viewOffset = -stylePaddingBottomState - footerSize;
      if (initialScroll.viewOffset !== viewOffset) {
        const previousTargetOffset = (_a4 = initialScroll.contentOffset) != null ? _a4 : resolveInitialScrollOffset(initialScroll);
        const didMoveAwayFromFinishedInitialTarget = state.didFinishInitialScroll && Math.abs(state.scroll - previousTargetOffset) > 1;
        if (didMoveAwayFromFinishedInitialTarget) {
          return;
        }
        const updatedInitialScroll = { ...initialScroll, viewOffset };
        setActiveInitialScrollTarget(updatedInitialScroll, {
          resetDidFinish: true
        });
        doInitialScroll();
      }
    },
    [
      dataProp.length,
      doInitialScroll,
      horizontal,
      initialScrollAtEnd,
      resolveInitialScrollOffset,
      stylePaddingBottomState
    ]
  );
  const onLayoutChange = useCallback((layout) => {
    var _a4;
    handleLayout(ctx, layout, setCanRender);
    const SCROLL_LENGTH_RETRY_WINDOW_MS = 600;
    const now = Date.now();
    const didFinishInitialScroll = !!state.didFinishInitialScroll;
    if (didFinishInitialScroll && !state.initialScrollLastDidFinish) {
      state.initialScrollRetryWindowUntil = now + SCROLL_LENGTH_RETRY_WINDOW_MS;
    }
    state.initialScrollLastDidFinish = didFinishInitialScroll;
    const previousScrollLength = state.initialScrollRetryLastLength;
    const currentScrollLength = state.scrollLength;
    const didScrollLengthChange = previousScrollLength === void 0 || Math.abs(currentScrollLength - previousScrollLength) > 1;
    if (didScrollLengthChange) {
      state.initialScrollRetryLastLength = currentScrollLength;
    }
    if (didFinishInitialScroll && didScrollLengthChange && now <= state.initialScrollRetryWindowUntil && !state.initialScrollLastTargetUsesOffset && ((_a4 = state.initialScrollLastTarget) == null ? void 0 : _a4.index) !== void 0) {
      doInitialScroll({ allowPostFinishRetry: true });
      return;
    }
    doInitialScroll();
  }, []);
  const { onLayout } = useOnLayoutSync({
    onLayoutChange,
    onLayoutProp,
    ref: refScroller
    // the type of ScrollView doesn't include measure?
  });
  useLayoutEffect(() => {
    if (snapToIndices) {
      updateSnapToOffsets(ctx);
    }
  }, [snapToIndices]);
  useLayoutEffect(() => {
    const {
      didColumnsChange,
      didDataChange,
      isFirst,
      props: { data }
    } = state;
    const didAllocateContainers = data.length > 0 && doInitialAllocateContainers(ctx);
    if (!didAllocateContainers && !isFirst && (didDataChange || didColumnsChange)) {
      checkResetContainers(ctx, data);
    }
    state.didColumnsChange = false;
    state.didDataChange = false;
    state.isFirst = false;
  }, [dataProp, dataVersion, numColumnsProp]);
  useLayoutEffect(() => {
    var _a4;
    set$(ctx, "extraData", extraData);
    const didToggleOverride = prevHasOverrideItemLayout.current !== hasOverrideItemLayout;
    prevHasOverrideItemLayout.current = hasOverrideItemLayout;
    if ((hasOverrideItemLayout || didToggleOverride) && numColumnsProp > 1) {
      (_a4 = state.triggerCalculateItemsInView) == null ? void 0 : _a4.call(state, { forceFullItemPositions: true });
    }
  }, [extraData, hasOverrideItemLayout, numColumnsProp]);
  useLayoutEffect(
    () => initializeStateVars(true),
    [dataVersion, memoizedLastItemKeys.join(","), numColumnsProp, stylePaddingBottomState, stylePaddingTopState]
  );
  useEffect(() => {
    if (!onMetricsChange) {
      return;
    }
    let lastMetrics;
    const emitMetrics = () => {
      const metrics = {
        footerSize: peek$(ctx, "footerSize") || 0,
        headerSize: peek$(ctx, "headerSize") || 0
      };
      if (!lastMetrics || metrics.headerSize !== lastMetrics.headerSize || metrics.footerSize !== lastMetrics.footerSize) {
        lastMetrics = metrics;
        onMetricsChange(metrics);
      }
    };
    emitMetrics();
    const unsubscribe = [listen$(ctx, "headerSize", emitMetrics), listen$(ctx, "footerSize", emitMetrics)];
    return () => {
      for (const unsub of unsubscribe) {
        unsub();
      }
    };
  }, [ctx, onMetricsChange]);
  useEffect(() => {
    const viewability = setupViewability({
      onViewableItemsChanged,
      viewabilityConfig,
      viewabilityConfigCallbackPairs
    });
    state.viewabilityConfigCallbackPairs = viewability;
    state.enableScrollForNextCalculateItemsInView = !viewability;
  }, [viewabilityConfig, viewabilityConfigCallbackPairs, onViewableItemsChanged]);
  useImperativeHandle(forwardedRef, () => createImperativeHandle(ctx), []);
  {
    useEffect(doInitialScroll, []);
  }
  const fns = useMemo(
    () => ({
      getRenderedItem: (key) => getRenderedItem(ctx, key),
      onMomentumScrollEnd: (event) => {
        checkFinishedScrollFallback(ctx);
        if (onMomentumScrollEnd) {
          onMomentumScrollEnd(event);
        }
      },
      onScroll: (event) => onScroll(ctx, event),
      updateItemSize: (itemKey, sizeObj) => updateItemSize(ctx, itemKey, sizeObj)
    }),
    []
  );
  const onScrollHandler = useStickyScrollHandler(stickyHeaderIndices, horizontal, ctx, fns.onScroll);
  const refreshControlElement = refreshControl;
  return /* @__PURE__ */ React3.createElement(React3.Fragment, null, /* @__PURE__ */ React3.createElement(
    ListComponent,
    {
      ...restProps,
      alignItemsAtEnd,
      canRender,
      contentContainerStyle,
      contentInset,
      getRenderedItem: fns.getRenderedItem,
      horizontal,
      initialContentOffset,
      ListEmptyComponent: dataProp.length === 0 ? ListEmptyComponent : void 0,
      ListHeaderComponent,
      onLayout,
      onLayoutFooter,
      onMomentumScrollEnd: fns.onMomentumScrollEnd,
      onScroll: onScrollHandler,
      recycleItems,
      refreshControl: refreshControlElement ? stylePaddingTopState > 0 ? React3.cloneElement(refreshControlElement, {
        progressViewOffset: ((_g = refreshControlElement.props.progressViewOffset) != null ? _g : 0) + stylePaddingTopState
      }) : refreshControlElement : onRefresh && /* @__PURE__ */ React3.createElement(
        RefreshControl,
        {
          onRefresh,
          progressViewOffset: (progressViewOffset || 0) + stylePaddingTopState,
          refreshing: !!refreshing
        }
      ),
      refScrollView: combinedRef,
      renderScrollComponent,
      scrollAdjustHandler: (_h = refState.current) == null ? void 0 : _h.scrollAdjustHandler,
      scrollEventThrottle: 0,
      snapToIndices,
      stickyHeaderIndices,
      style,
      updateItemSize: fns.updateItemSize,
      useWindowScroll: useWindowScrollResolved,
      waitForInitialLayout
    }
  ), IS_DEV && ENABLE_DEBUG_VIEW);
});

// src/entrypoints/shared.ts
var LegendListRuntime = LegendList;
var internal = {
  getComponent,
  IsNewArchitecture,
  POSITION_OUT_OF_VIEW,
  peek$,
  useArr$,
  useCombinedRef,
  useStateContext
};

// src/react.ts
var LegendList3 = LegendListRuntime;
var internal2 = internal;

export { LegendList3 as LegendList, internal2 as internal, typedForwardRef, typedMemo, useIsLastItem, useListScrollSize, useRecyclingEffect, useRecyclingState, useSyncLayout, useViewability, useViewabilityAmount };
