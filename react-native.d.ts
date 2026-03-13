import * as React from 'react';
import { Key, Dispatch, SetStateAction } from 'react';
import { ScrollViewProps, NativeSyntheticEvent as NativeSyntheticEvent$1, NativeScrollEvent as NativeScrollEvent$1, ScrollView, StyleProp as StyleProp$1, ViewStyle as ViewStyle$1, ScrollViewComponent, ScrollResponderMixin, Insets as Insets$1, View } from 'react-native';

type AnimatedValue = number;

type LooseMeasureCallback = (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void;
interface LooseView {
    measure?: (callback: LooseMeasureCallback) => void;
}

type ListenerType = "activeStickyIndex" | "debugComputedScroll" | "debugRawScroll" | "extraData" | "footerSize" | "headerSize" | "lastItemKeys" | "lastPositionUpdate" | "maintainVisibleContentPosition" | "numColumns" | "numContainers" | "numContainersPooled" | "otherAxisSize" | "readyToRender" | "scrollAdjust" | "scrollAdjustPending" | "scrollAdjustUserOffset" | "scrollSize" | "snapToOffsets" | "stylePaddingTop" | "totalSize" | `containerColumn${number}` | `containerSpan${number}` | `containerItemData${number}` | `containerItemKey${number}` | `containerPosition${number}` | `containerSticky${number}`;
type LegendListListenerType = Extract<ListenerType, "activeStickyIndex" | "footerSize" | "headerSize" | "lastItemKeys" | "lastPositionUpdate" | "numContainers" | "numContainersPooled" | "otherAxisSize" | "readyToRender" | "snapToOffsets" | "totalSize">;
type ListenerTypeValueMap = {
    activeStickyIndex: number;
    animatedScrollY: any;
    debugComputedScroll: number;
    debugRawScroll: number;
    extraData: any;
    footerSize: number;
    headerSize: number;
    lastItemKeys: string[];
    lastPositionUpdate: number;
    maintainVisibleContentPosition: MaintainVisibleContentPositionNormalized;
    numColumns: number;
    numContainers: number;
    numContainersPooled: number;
    otherAxisSize: number;
    readyToRender: boolean;
    scrollAdjust: number;
    scrollAdjustPending: number;
    scrollAdjustUserOffset: number;
    scrollSize: {
        width: number;
        height: number;
    };
    snapToOffsets: number[];
    stylePaddingTop: number;
    totalSize: number;
} & {
    [K in ListenerType as K extends `containerItemKey${number}` ? K : never]: string;
} & {
    [K in ListenerType as K extends `containerItemData${number}` ? K : never]: any;
} & {
    [K in ListenerType as K extends `containerPosition${number}` ? K : never]: number;
} & {
    [K in ListenerType as K extends `containerColumn${number}` ? K : never]: number;
} & {
    [K in ListenerType as K extends `containerSpan${number}` ? K : never]: number;
} & {
    [K in ListenerType as K extends `containerSticky${number}` ? K : never]: boolean;
};
interface StateContext {
    animatedScrollY: AnimatedValue;
    columnWrapperStyle: ColumnWrapperStyle | undefined;
    contextNum: number;
    listeners: Map<ListenerType, Set<(value: any) => void>>;
    mapViewabilityCallbacks: Map<string, ViewabilityCallback>;
    mapViewabilityValues: Map<string, ViewToken>;
    mapViewabilityAmountCallbacks: Map<number, ViewabilityAmountCallback>;
    mapViewabilityAmountValues: Map<number, ViewAmountToken>;
    mapViewabilityConfigStates: Map<string, {
        viewableItems: ViewToken[];
        start: number;
        end: number;
        previousStart: number;
        previousEnd: number;
    }>;
    positionListeners: Map<string, Set<(value: any) => void>>;
    state: InternalState;
    values: Map<ListenerType, any>;
    viewRefs: Map<number, React.RefObject<LooseView | null>>;
}

declare class ScrollAdjustHandler {
    private appliedAdjust;
    private pendingAdjust;
    private ctx;
    constructor(ctx: StateContext);
    requestAdjust(add: number): void;
    getAdjust(): number;
    commitPendingAdjust(scrollTarget: ScrollTarget): void;
}

type BaseSharedValue<T = number> = {
    get: () => T;
};
type StylesAsSharedValue<Style> = {
    [key in keyof Style]: Style[key] | BaseSharedValue<Style[key]>;
};

interface Insets {
    top: number;
    left: number;
    bottom: number;
    right: number;
}
interface LayoutRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface NativeScrollEvent {
    contentOffset: {
        x: number;
        y: number;
    };
    contentSize: {
        width: number;
        height: number;
    };
    layoutMeasurement: {
        width: number;
        height: number;
    };
    contentInset: Insets;
    zoomScale: number;
}
interface NativeSyntheticEvent<T> {
    nativeEvent: T;
}
type ViewStyle = Record<string, unknown>;
type StyleProp<T> = T | T[] | null | undefined | false;
interface ScrollEventTargetLike {
    addEventListener(type: string, listener: (...args: any[]) => void): void;
    removeEventListener(type: string, listener: (...args: any[]) => void): void;
}
interface ScrollableNodeLike {
    scrollLeft?: number;
    scrollTop?: number;
}
interface LegendListScrollerRef {
    flashScrollIndicators(): void;
    getCurrentScrollOffset?(): number;
    getScrollEventTarget(): ScrollEventTargetLike | null;
    getScrollableNode(): ScrollableNodeLike | null;
    getScrollResponder(): unknown;
    scrollTo(options: {
        animated?: boolean;
        x?: number;
        y?: number;
    }): void;
    scrollToEnd(options?: {
        animated?: boolean;
    }): void;
}
type BaseScrollViewProps<TScrollView> = Omit<TScrollView, "contentOffset" | "maintainVisibleContentPosition" | "stickyHeaderIndices" | "removeClippedSubviews" | "children" | "onScroll">;
interface DataModeProps<ItemT, TItemType extends string | undefined> {
    /**
     * Array of items to render in the list.
     * @required when using data mode
     */
    data: ReadonlyArray<ItemT>;
    /**
     * Function or React component to render each item in the list.
     * Can be either:
     * - A function: (props: LegendListRenderItemProps<ItemT>) => ReactNode
     * - A React component: React.ComponentType<LegendListRenderItemProps<ItemT>>
     * @required when using data mode
     */
    renderItem: ((props: LegendListRenderItemProps<ItemT, TItemType>) => React.ReactNode) | React.ComponentType<LegendListRenderItemProps<ItemT, TItemType>>;
    children?: never;
}
interface ChildrenModeProps {
    /**
     * React children elements to render as list items.
     * Each child will be treated as an individual list item.
     * @required when using children mode
     */
    children: React.ReactNode;
    data?: never;
    renderItem?: never;
}
interface LegendListSpecificProps<ItemT, TItemType extends string | undefined> {
    /**
     * If true, aligns items at the end of the list.
     * @default false
     */
    alignItemsAtEnd?: boolean;
    /**
     * Keeps selected items mounted even when they scroll out of view.
     * @default undefined
     */
    alwaysRender?: AlwaysRenderConfig;
    /**
     * Style applied to each column's wrapper view.
     */
    columnWrapperStyle?: ColumnWrapperStyle;
    /**
     * Distance in pixels to pre-render items ahead of the visible area.
     * @default 250
     */
    drawDistance?: number;
    /**
     * Estimated size of each item in pixels, a hint for the first render. After some
     * items are rendered, the average size of rendered items will be used instead.
     * @default undefined
     */
    estimatedItemSize?: number;
    /**
     * Estimated size of the ScrollView in pixels, a hint for the first render to improve performance
     * @default undefined
     */
    estimatedListSize?: {
        height: number;
        width: number;
    };
    /**
     * Extra data to trigger re-rendering when changed.
     */
    extraData?: any;
    /**
     * Version token that forces the list to treat data as updated even when the array reference is stable.
     * Increment or change this when mutating the data array in place.
     */
    dataVersion?: Key;
    /**
     * In case you have distinct item sizes, you can provide a function to get the size of an item.
     * Use instead of FlatList's getItemLayout or FlashList overrideItemLayout if you want to have accurate initialScrollOffset, you should provide this function
     */
    getEstimatedItemSize?: (item: ItemT, index: number, type: TItemType) => number;
    /**
     * Customize layout for multi-column lists, such as allowing items to span multiple columns.
     * Similar to FlashList's overrideItemLayout.
     */
    overrideItemLayout?: (layout: {
        span?: number;
    }, item: ItemT, index: number, maxColumns: number, extraData?: any) => void;
    /**
     * Ratio of initial container pool size to data length (e.g., 0.5 for half).
     * @default 2
     */
    initialContainerPoolRatio?: number | undefined;
    /**
     * Initial scroll position in pixels.
     * @default 0
     */
    initialScrollOffset?: number;
    /**
     * Index to scroll to initially.
     * @default 0
     */
    initialScrollIndex?: number | {
        index: number;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    };
    /**
     * When true, the list initializes scrolled to the last item.
     * Overrides `initialScrollIndex` and `initialScrollOffset` when data is available.
     * @default false
     */
    initialScrollAtEnd?: boolean;
    /**
     * Component to render between items, receiving the leading item as prop.
     */
    ItemSeparatorComponent?: React.ComponentType<{
        leadingItem: ItemT;
    }>;
    /**
     * Function to extract a unique key for each item.
     */
    keyExtractor?: (item: ItemT, index: number) => string;
    /**
     * Component or element to render when the list is empty.
     */
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
    /**
     * Component or element to render below the list.
     */
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
    /**
     * Style for the footer component.
     */
    ListFooterComponentStyle?: StyleProp<ViewStyle> | undefined;
    /**
     * Component or element to render above the list.
     */
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
    /**
     * Style for the header component.
     */
    ListHeaderComponentStyle?: StyleProp<ViewStyle> | undefined;
    /**
     * If true, auto-scrolls to end when new items are added.
     * Use an options object to opt into specific triggers and control whether that scroll is animated.
     * @default false
     */
    maintainScrollAtEnd?: boolean | MaintainScrollAtEndOptions;
    /**
     * Distance threshold in percentage of screen size to trigger maintainScrollAtEnd.
     * @default 0.1
     */
    maintainScrollAtEndThreshold?: number;
    /**
     * Maintains visibility of content.
     * - scroll (default: true) stabilizes during size/layout changes while scrolling.
     * - data (default: false) stabilizes when the data array changes; passing true also sets the RN maintainVisibleContentPosition prop.
     * - shouldRestorePosition can opt out specific items from data-change anchoring.
     * - undefined (default) enables scroll stabilization but skips data-change anchoring.
     * - true enables both behaviors; false disables both.
     */
    maintainVisibleContentPosition?: boolean | MaintainVisibleContentPositionConfig<ItemT>;
    /**
     * Web only: when true, listens to window/body scrolling instead of rendering a scrollable list container.
     * @default false
     */
    useWindowScroll?: boolean;
    /**
     * Number of columns to render items in.
     * @default 1
     */
    numColumns?: number;
    /**
     * Called when scrolling reaches the end within onEndReachedThreshold.
     */
    onEndReached?: ((info: {
        distanceFromEnd: number;
    }) => void) | null | undefined;
    /**
     * How close to the end (in fractional units of visible length) to trigger onEndReached.
     * @default 0.5
     */
    onEndReachedThreshold?: number | null | undefined;
    /**
     * Called when an item's size changes.
     */
    onItemSizeChanged?: (info: {
        size: number;
        previous: number;
        index: number;
        itemKey: string;
        itemData: ItemT;
    }) => void;
    /**
     * Called when list layout metrics change.
     */
    onMetricsChange?: (metrics: LegendListMetrics) => void;
    /**
     * Function to call when the user pulls to refresh.
     */
    onRefresh?: () => void;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Called when scrolling reaches the start within onStartReachedThreshold.
     */
    onStartReached?: ((info: {
        distanceFromStart: number;
    }) => void) | null | undefined;
    /**
     * How close to the start (in fractional units of visible length) to trigger onStartReached.
     * @default 0.5
     */
    onStartReachedThreshold?: number | null | undefined;
    /**
     * Called when the sticky header changes.
     */
    onStickyHeaderChange?: (info: {
        index: number;
        item: any;
    }) => void;
    /**
     * Called when the viewability of items changes.
     */
    onViewableItemsChanged?: OnViewableItemsChanged<ItemT> | undefined;
    /**
     * Offset in pixels for the refresh indicator.
     * @default 0
     */
    progressViewOffset?: number;
    /**
     * If true, recycles item views for better performance.
     * @default false
     */
    recycleItems?: boolean;
    /**
     * Ref to the underlying ScrollView component.
     */
    refScrollView?: React.Ref<any>;
    /**
     * If true, shows a refresh indicator.
     * @default false
     */
    refreshing?: boolean;
    /**
     * Render custom ScrollView component.
     * Note: When using `stickyHeaderIndices`, you must provide an Animated ScrollView component.
     * @default (props) => <ScrollView {...props} />
     */
    renderScrollComponent?: (props: any) => React.ReactElement | null;
    /**
     * This will log a suggested estimatedItemSize.
     * @required
     * @default false
     */
    suggestEstimatedItemSize?: boolean;
    /**
     * Configuration for determining item viewability.
     */
    viewabilityConfig?: ViewabilityConfig;
    /**
     * Pairs of viewability configs and their callbacks for tracking visibility.
     */
    viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs<ItemT> | undefined;
    /**
     * If true, delays rendering until initial layout is complete.
     * @default false
     */
    waitForInitialLayout?: boolean;
    onLoad?: (info: {
        elapsedTimeInMs: number;
    }) => void;
    snapToIndices?: number[];
    /**
     * Array of child indices determining which children get docked to the top of the screen when scrolling.
     * For example, passing stickyHeaderIndices={[0]} will cause the first child to be fixed to the top of the scroll view.
     * Not supported in conjunction with horizontal={true}.
     * @default undefined
     */
    stickyHeaderIndices?: number[];
    /**
     * @deprecated Use stickyHeaderIndices instead for parity with React Native.
     */
    stickyIndices?: number[];
    /**
     * Configuration for sticky headers.
     * @default undefined
     */
    stickyHeaderConfig?: StickyHeaderConfig;
    getItemType?: (item: ItemT, index: number) => TItemType;
    getFixedItemSize?: (item: ItemT, index: number, type: TItemType) => number | undefined;
    itemsAreEqual?: (itemPrevious: ItemT, item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}
type LegendListPropsBase<ItemT, TScrollViewProps = Record<string, any>, TItemType extends string | undefined = string | undefined> = BaseScrollViewProps<TScrollViewProps> & LegendListSpecificProps<ItemT, TItemType> & (DataModeProps<ItemT, TItemType> | ChildrenModeProps);
type LegendListPropsInternal = LegendListSpecificProps<any, string | undefined> & DataModeProps<any, string | undefined>;
interface MaintainVisibleContentPositionConfig<ItemT = any> {
    data?: boolean;
    size?: boolean;
    shouldRestorePosition?: (item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}
interface MaintainVisibleContentPositionNormalized<ItemT = any> {
    data: boolean;
    size: boolean;
    shouldRestorePosition?: (item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}
interface StickyHeaderConfig {
    /**
     * Specifies how far from the top edge sticky headers should start sticking.
     * Useful for scenarios with a fixed navbar or header, where sticky elements pin below it..
     * @default 0
     */
    offset?: number;
    /**
     * Component to render as a backdrop behind the sticky header.
     * @default undefined
     */
    backdropComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
}
interface AlwaysRenderConfig {
    top?: number;
    bottom?: number;
    indices?: number[];
    keys?: string[];
}
interface MaintainScrollAtEndOnOptions {
    dataChange?: boolean;
    itemLayout?: boolean;
    layout?: boolean;
}
interface MaintainScrollAtEndOptions {
    /**
     * Whether maintainScrollAtEnd should animate when it scrolls to the end.
     */
    animated?: boolean;
    /**
     * Which events should keep the list pinned to the end.
     * - If omitted, object values default to all triggers.
     * - If provided, only the keys set to `true` are enabled.
     */
    on?: MaintainScrollAtEndOnOptions;
}
interface ColumnWrapperStyle {
    rowGap?: number;
    gap?: number;
    columnGap?: number;
}
interface LegendListMetrics {
    headerSize: number;
    footerSize: number;
}
interface ThresholdSnapshot {
    scrollPosition: number;
    contentSize?: number;
    dataLength?: number;
    atThreshold: boolean;
}
interface ScrollTarget {
    animated?: boolean;
    index?: number;
    isInitialScroll?: boolean;
    itemSize?: number;
    offset: number;
    precomputedWithViewOffset?: boolean;
    targetOffset?: number;
    viewOffset?: number;
    viewPosition?: number;
}
interface InternalState {
    activeStickyIndex: number | undefined;
    adjustingFromInitialMount?: number;
    animFrameCheckFinishedScroll?: any;
    averageSizes: Record<string, {
        num: number;
        avg: number;
    }>;
    columns: Array<number | undefined>;
    columnSpans: Array<number | undefined>;
    containerItemKeys: Map<string, number>;
    containerItemTypes: Map<number, string>;
    dataChangeEpoch: number;
    dataChangeNeedsScrollUpdate: boolean;
    didColumnsChange?: boolean;
    didDataChange?: boolean;
    didFinishInitialScroll?: boolean;
    didContainersLayout?: boolean;
    enableScrollForNextCalculateItemsInView: boolean;
    endBuffered: number;
    endNoBuffer: number;
    endReachedSnapshot: ThresholdSnapshot | undefined;
    firstFullyOnScreenIndex: number;
    hasScrolled?: boolean;
    idCache: string[];
    idsInView: string[];
    ignoreScrollFromMVCP?: {
        lt?: number;
        gt?: number;
    };
    ignoreScrollFromMVCPIgnored?: boolean;
    ignoreScrollFromMVCPTimeout?: any;
    indexByKey: Map<string, number>;
    initialAnchor?: InitialScrollAnchor;
    initialNativeScrollWatchdog?: {
        startScroll: number;
        targetOffset: number;
    };
    initialScrollLastDidFinish: boolean;
    initialScrollLastTarget: ScrollIndexWithOffsetAndContentOffset | undefined;
    initialScrollLastTargetUsesOffset: boolean;
    initialScrollPreviousDataLength: number;
    initialScrollRetryLastLength: number | undefined;
    initialScrollRetryWindowUntil: number;
    initialScroll: ScrollIndexWithOffsetAndContentOffset | undefined;
    initialScrollUsesOffset: boolean;
    isAtEnd: boolean;
    isAtStart: boolean;
    isEndReached: boolean | null;
    isFirst?: boolean;
    isStartReached: boolean | null;
    lastBatchingAction: number;
    lastLayout: LayoutRectangle | undefined;
    lastScrollAdjustForHistory?: number;
    lastScrollDelta: number;
    loadStartTime: number;
    maintainingScrollAtEnd?: boolean;
    minIndexSizeChanged: number | undefined;
    mvcpAnchorLock?: {
        id: string;
        position: number;
        quietPasses: number;
        expiresAt: number;
    };
    contentInsetOverride?: Partial<Insets> | null;
    nativeContentInset?: Insets;
    nativeMarginTop: number;
    needsOtherAxisSize?: boolean;
    otherAxisSize?: number;
    pendingNativeMVCPAdjust?: {
        amount: number;
        furthestProgressTowardAmount: number;
        manualApplied: number;
        startScroll: number;
    };
    pendingMaintainScrollAtEnd?: boolean;
    pendingTotalSize?: number;
    pendingScrollResolve?: (() => void) | undefined;
    positions: Array<number | undefined>;
    previousData?: readonly unknown[];
    queuedCalculateItemsInView: number | undefined;
    queuedMVCPRecalculate?: number;
    queuedInitialLayout?: boolean | undefined;
    refScroller: React.RefObject<LegendListScrollerRef | null>;
    scroll: number;
    scrollAdjustHandler: ScrollAdjustHandler;
    scrollForNextCalculateItemsInView: {
        top: number | null;
        bottom: number | null;
    } | undefined;
    scrollHistory: Array<{
        scroll: number;
        time: number;
    }>;
    scrollingTo?: ScrollTarget | undefined;
    scrollLastCalculate?: number;
    scrollLength: number;
    scrollPending: number;
    scrollPrev: number;
    scrollPrevTime: number;
    scrollProcessingEnabled: boolean;
    scrollTime: number;
    sizes: Map<string, number>;
    sizesKnown: Map<string, number>;
    startBuffered: number;
    startBufferedId?: string;
    startNoBuffer: number;
    startReachedSnapshotDataChangeEpoch: number | undefined;
    startReachedSnapshot: ThresholdSnapshot | undefined;
    stickyContainerPool: Set<number>;
    stickyContainers: Map<number, number>;
    timeouts: Set<number>;
    timeoutSetPaddingTop?: any;
    timeoutSizeMessage: any;
    timeoutCheckFinishedScrollFallback?: any;
    totalSize: number;
    triggerCalculateItemsInView?: (params?: {
        doMVCP?: boolean;
        dataChanged?: boolean;
        forceFullItemPositions?: boolean;
    }) => void;
    viewabilityConfigCallbackPairs: ViewabilityConfigCallbackPairs<any> | undefined;
    props: {
        alignItemsAtEnd: boolean;
        animatedProps: StylesAsSharedValue<Record<string, any>>;
        alwaysRender: AlwaysRenderConfig | undefined;
        alwaysRenderIndicesArr: number[];
        alwaysRenderIndicesSet: Set<number>;
        contentInset: Insets | undefined;
        data: readonly any[];
        dataVersion: Key | undefined;
        drawDistance: number;
        estimatedItemSize: number | undefined;
        getEstimatedItemSize: LegendListPropsInternal["getEstimatedItemSize"];
        getFixedItemSize: LegendListPropsInternal["getFixedItemSize"];
        getItemType: LegendListPropsInternal["getItemType"];
        horizontal: boolean;
        initialContainerPoolRatio: number;
        itemsAreEqual: LegendListPropsInternal["itemsAreEqual"];
        keyExtractor: LegendListPropsInternal["keyExtractor"];
        maintainScrollAtEnd: MaintainScrollAtEndNormalized | undefined;
        maintainScrollAtEndThreshold: number | undefined;
        maintainVisibleContentPosition: MaintainVisibleContentPositionNormalized;
        numColumns: number;
        onEndReached: LegendListPropsInternal["onEndReached"];
        onEndReachedThreshold: number | null | undefined;
        onItemSizeChanged: LegendListPropsInternal["onItemSizeChanged"];
        onLoad: LegendListPropsInternal["onLoad"];
        onScroll: LegendListPropsInternal["onScroll"];
        onStartReached: LegendListPropsInternal["onStartReached"];
        onStartReachedThreshold: number | null | undefined;
        onStickyHeaderChange: LegendListPropsInternal["onStickyHeaderChange"];
        overrideItemLayout: LegendListPropsInternal["overrideItemLayout"];
        recycleItems: boolean;
        renderItem: LegendListPropsInternal["renderItem"];
        scrollBuffer?: number;
        snapToIndices: number[] | undefined;
        positionComponentInternal: React.ComponentType<any> | undefined;
        stickyPositionComponentInternal: React.ComponentType<any> | undefined;
        stickyIndicesArr: number[];
        stickyIndicesSet: Set<number>;
        stylePaddingBottom: number | undefined;
        stylePaddingTop: number | undefined;
        suggestEstimatedItemSize: boolean;
        useWindowScroll: boolean;
    };
}
interface ViewableRange<T> {
    end: number;
    endBuffered: number;
    items: T[];
    start: number;
    startBuffered: number;
}
interface LegendListRenderItemProps<ItemT, TItemType extends string | number | undefined = string | number | undefined> {
    data: readonly ItemT[];
    extraData: any;
    index: number;
    item: ItemT;
    type: TItemType;
}
type LegendListState$1 = {
    activeStickyIndex: number;
    contentLength: number;
    data: readonly any[];
    elementAtIndex: (index: number) => any;
    end: number;
    endBuffered: number;
    isAtEnd: boolean;
    isAtStart: boolean;
    isEndReached: boolean;
    isStartReached: boolean;
    listen: <T extends LegendListListenerType>(listenerType: T, callback: (value: ListenerTypeValueMap[T]) => void) => () => void;
    listenToPosition: (key: string, callback: (value: number) => void) => () => void;
    positionAtIndex: (index: number) => number;
    positionByKey: (key: string) => number | undefined;
    scroll: number;
    scrollLength: number;
    scrollVelocity: number;
    sizeAtIndex: (index: number) => number;
    sizes: Map<string, number>;
    start: number;
    startBuffered: number;
};
type LegendListRef$1 = {
    /**
     * Displays the scroll indicators momentarily.
     */
    flashScrollIndicators(): void;
    /**
     * Returns the native ScrollView component reference.
     */
    getNativeScrollRef(): any;
    /**
     * Returns the scroll responder instance for handling scroll events.
     */
    getScrollableNode(): any;
    /**
     * Returns the ScrollResponderMixin for advanced scroll handling.
     */
    getScrollResponder(): any;
    /**
     * Returns the internal state of the scroll virtualization.
     */
    getState(): LegendListState$1;
    /**
     * Scrolls a specific index into view.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.index - The index to scroll to.
     */
    scrollIndexIntoView(params: {
        animated?: boolean | undefined;
        index: number;
    }): Promise<void>;
    /**
     * Scrolls a specific index into view.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.item - The item to scroll to.
     */
    scrollItemIntoView(params: {
        animated?: boolean | undefined;
        item: any;
    }): Promise<void>;
    /**
     * Scrolls to the end of the list.
     * @param options - Options for scrolling.
     * @param options.animated - If true, animates the scroll. Default: true.
     * @param options.viewOffset - Offset from the target position.
     */
    scrollToEnd(options?: {
        animated?: boolean | undefined;
        viewOffset?: number | undefined;
    }): Promise<void>;
    /**
     * Scrolls to a specific index in the list.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.index - The index to scroll to.
     * @param params.viewOffset - Offset from the target position.
     * @param params.viewPosition - Position of the item in the viewport (0 to 1).
     */
    scrollToIndex(params: {
        animated?: boolean | undefined;
        index: number;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    }): Promise<void>;
    /**
     * Scrolls to a specific item in the list.
     * @param params - Parameters for scrolling.
     * @param params.animated - If true, animates the scroll. Default: true.
     * @param params.item - The item to scroll to.
     * @param params.viewOffset - Offset from the target position.
     * @param params.viewPosition - Position of the item in the viewport (0 to 1).
     */
    scrollToItem(params: {
        animated?: boolean | undefined;
        item: any;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    }): Promise<void>;
    /**
     * Scrolls to a specific offset in pixels.
     * @param params - Parameters for scrolling.
     * @param params.offset - The pixel offset to scroll to.
     * @param params.animated - If true, animates the scroll. Default: true.
     */
    scrollToOffset(params: {
        offset: number;
        animated?: boolean | undefined;
    }): Promise<void>;
    /**
     * Sets or adds to the offset of the visible content anchor.
     * @param value - The offset to set or add.
     * @param animated - If true, uses Animated to animate the change.
     */
    setVisibleContentAnchorOffset(value: number | ((val: number) => number)): void;
    /**
     * Sets whether scroll processing is enabled.
     * @param enabled - If true, scroll processing is enabled.
     */
    setScrollProcessingEnabled(enabled: boolean): void;
    /**
     * Clears internal virtualization caches.
     * @param options - Cache clearing options.
     * @param options.mode - `sizes` clears measurement caches. `full` also clears key/position caches.
     */
    clearCaches(options?: {
        mode?: "sizes" | "full";
    }): void;
    /**
     * Reports an externally measured content inset. Pass null/undefined to clear.
     * Values are merged on top of props/animated/native insets.
     */
    reportContentInset(inset?: Partial<Insets> | null): void;
};
interface ViewToken<ItemT = any> {
    containerId: number;
    index: number;
    isViewable: boolean;
    item: ItemT;
    key: string;
}
interface ViewAmountToken<ItemT = any> extends ViewToken<ItemT> {
    percentOfScroller: number;
    percentVisible: number;
    scrollSize: number;
    size: number;
    sizeVisible: number;
}
interface ViewabilityConfigCallbackPair<ItemT = any> {
    onViewableItemsChanged?: OnViewableItemsChanged<ItemT>;
    viewabilityConfig: ViewabilityConfig;
}
type ViewabilityConfigCallbackPairs<ItemT> = ViewabilityConfigCallbackPair<ItemT>[];
type OnViewableItemsChanged<ItemT> = ((info: {
    viewableItems: Array<ViewToken<ItemT>>;
    changed: Array<ViewToken<ItemT>>;
}) => void) | null;
interface ViewabilityConfig {
    /**
     * A unique ID to identify this viewability config
     */
    id?: string;
    /**
     * Minimum amount of time (in milliseconds) that an item must be physically viewable before the
     * viewability callback will be fired. A high number means that scrolling through content without
     * stopping will not mark the content as viewable.
     */
    minimumViewTime?: number | undefined;
    /**
     * Percent of viewport that must be covered for a partially occluded item to count as
     * "viewable", 0-100. Fully visible items are always considered viewable. A value of 0 means
     * that a single pixel in the viewport makes the item viewable, and a value of 100 means that
     * an item must be either entirely visible or cover the entire viewport to count as viewable.
     */
    viewAreaCoveragePercentThreshold?: number | undefined;
    /**
     * Similar to `viewAreaCoveragePercentThreshold`, but considers the percent of the item that is visible,
     * rather than the fraction of the viewable area it covers.
     */
    itemVisiblePercentThreshold?: number | undefined;
    /**
     * Nothing is considered viewable until the user scrolls or `recordInteraction` is called after
     * render.
     */
    waitForInteraction?: boolean | undefined;
}
type ViewabilityCallback<ItemT = any> = (viewToken: ViewToken<ItemT>) => void;
type ViewabilityAmountCallback<ItemT = any> = (viewToken: ViewAmountToken<ItemT>) => void;
interface LegendListRecyclingState<T> {
    index: number;
    item: T;
    prevIndex: number | undefined;
    prevItem: T | undefined;
}
type TypedForwardRef = <T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;
declare const typedForwardRef: TypedForwardRef;
type TypedMemo = <T extends React.ComponentType<any>>(Component: T, propsAreEqual?: (prevProps: Readonly<React.ComponentProps<T>>, nextProps: Readonly<React.ComponentProps<T>>) => boolean) => T & {
    displayName?: string;
};
declare const typedMemo: TypedMemo;
interface ScrollIndexWithOffset {
    index: number;
    viewOffset?: number;
    viewPosition?: number;
}
interface ScrollIndexWithOffsetPosition extends ScrollIndexWithOffset {
    viewPosition?: number;
}
interface ScrollIndexWithOffsetAndContentOffset extends ScrollIndexWithOffsetPosition {
    contentOffset?: number;
}
interface InitialScrollAnchor extends ScrollIndexWithOffsetPosition {
    attempts?: number;
    lastDelta?: number;
    settledTicks?: number;
}
type GetRenderedItemResult<ItemT> = {
    index: number;
    item: ItemT;
    renderedItem: React.ReactNode;
};
type GetRenderedItem = (key: string) => GetRenderedItemResult<any> | null;

type LegendListPropsOverrides<ItemT, TItemType extends string | undefined> = Omit<LegendListPropsBase<ItemT, ScrollViewProps, TItemType>, "onScroll" | "refScrollView" | "renderScrollComponent" | "ListHeaderComponentStyle" | "ListFooterComponentStyle"> & {
    onScroll?: (event: NativeSyntheticEvent$1<NativeScrollEvent$1>) => void;
    refScrollView?: React.Ref<ScrollView>;
    renderScrollComponent?: (props: ScrollViewProps) => React.ReactElement<ScrollViewProps>;
    ListHeaderComponentStyle?: StyleProp$1<ViewStyle$1> | undefined;
    ListFooterComponentStyle?: StyleProp$1<ViewStyle$1> | undefined;
};
type LegendListProps<ItemT = any, TItemType extends string | undefined = string | undefined> = LegendListPropsOverrides<ItemT, TItemType>;
type LegendListRef = Omit<LegendListRef$1, "getNativeScrollRef" | "getScrollResponder" | "reportContentInset"> & {
    getNativeScrollRef(): React.ElementRef<typeof ScrollViewComponent>;
    getScrollResponder(): ScrollResponderMixin;
    reportContentInset(inset?: Partial<Insets$1> | null): void;
};
type LegendListState = Omit<LegendListState$1, "elementAtIndex"> & {
    elementAtIndex: (index: number) => View | null | undefined;
};
type LegendListComponent = <ItemT = any>(props: LegendListProps<ItemT> & React.RefAttributes<LegendListRef>) => React.ReactElement | null;

declare function useViewability<ItemT = any>(callback: ViewabilityCallback<ItemT>, configId?: string): void;
declare function useViewabilityAmount<ItemT = any>(callback: ViewabilityAmountCallback<ItemT>): void;
declare function useRecyclingEffect(effect: (info: LegendListRecyclingState<unknown>) => void | (() => void)): void;
declare function useRecyclingState<ItemT>(valueOrFun: ((info: LegendListRecyclingState<ItemT>) => ItemT) | ItemT): readonly [ItemT, Dispatch<SetStateAction<ItemT>>];
declare function useIsLastItem(): boolean;
declare function useListScrollSize(): {
    width: number;
    height: number;
};
declare function useSyncLayout(): () => void;

declare const LegendList: LegendListComponent;

export { type AlwaysRenderConfig, type BaseScrollViewProps, type ColumnWrapperStyle, type GetRenderedItem, type GetRenderedItemResult, type InitialScrollAnchor, type Insets, type InternalState, type LayoutRectangle, LegendList, type LegendListComponent, type LegendListMetrics, type LegendListProps, type LegendListPropsBase, type LegendListRecyclingState, type LegendListRef, type LegendListRenderItemProps, type LegendListScrollerRef, type LegendListState, type MaintainScrollAtEndOnOptions, type MaintainScrollAtEndOptions, type MaintainVisibleContentPositionConfig, type MaintainVisibleContentPositionNormalized, type NativeScrollEvent, type NativeSyntheticEvent, type OnViewableItemsChanged, type ScrollEventTargetLike, type ScrollIndexWithOffset, type ScrollIndexWithOffsetAndContentOffset, type ScrollIndexWithOffsetPosition, type ScrollTarget, type ScrollableNodeLike, type StickyHeaderConfig, type StyleProp, type ThresholdSnapshot, type TypedForwardRef, type TypedMemo, type ViewAmountToken, type ViewStyle, type ViewToken, type ViewabilityAmountCallback, type ViewabilityCallback, type ViewabilityConfig, type ViewabilityConfigCallbackPair, type ViewabilityConfigCallbackPairs, type ViewableRange, typedForwardRef, typedMemo, useIsLastItem, useListScrollSize, useRecyclingEffect, useRecyclingState, useSyncLayout, useViewability, useViewabilityAmount };
