import * as React from 'react';
import { Key, ComponentType, ReactNode, CSSProperties, Ref, ReactElement, JSXElementConstructor, RefAttributes, Dispatch, SetStateAction } from 'react';

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
    maintainVisibleContentPosition: MaintainVisibleContentPositionNormalized$1;
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
    columnWrapperStyle: ColumnWrapperStyle$1 | undefined;
    contextNum: number;
    listeners: Map<ListenerType, Set<(value: any) => void>>;
    mapViewabilityCallbacks: Map<string, ViewabilityCallback$1>;
    mapViewabilityValues: Map<string, ViewToken$1>;
    mapViewabilityAmountCallbacks: Map<number, ViewabilityAmountCallback$1>;
    mapViewabilityAmountValues: Map<number, ViewAmountToken$1>;
    mapViewabilityConfigStates: Map<string, {
        viewableItems: ViewToken$1[];
        start: number;
        end: number;
        previousStart: number;
        previousEnd: number;
    }>;
    positionListeners: Map<string, Set<(value: any) => void>>;
    state: InternalState$1;
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
    commitPendingAdjust(scrollTarget: ScrollTarget$1): void;
}

type BaseSharedValue<T = number> = {
    get: () => T;
};
type StylesAsSharedValue<Style> = {
    [key in keyof Style]: Style[key] | BaseSharedValue<Style[key]>;
};

interface Insets$1 {
    top: number;
    left: number;
    bottom: number;
    right: number;
}
interface LayoutRectangle$1 {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface NativeScrollEvent$1 {
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
    contentInset: Insets$1;
    zoomScale: number;
}
interface NativeSyntheticEvent$1<T> {
    nativeEvent: T;
}
type ViewStyle$1 = Record<string, unknown>;
type StyleProp$1<T> = T | T[] | null | undefined | false;
interface ScrollEventTargetLike$1 {
    addEventListener(type: string, listener: (...args: any[]) => void): void;
    removeEventListener(type: string, listener: (...args: any[]) => void): void;
}
interface ScrollableNodeLike$1 {
    scrollLeft?: number;
    scrollTop?: number;
}
interface LegendListScrollerRef$1 {
    flashScrollIndicators(): void;
    getCurrentScrollOffset?(): number;
    getScrollEventTarget(): ScrollEventTargetLike$1 | null;
    getScrollableNode(): ScrollableNodeLike$1 | null;
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
type BaseScrollViewProps$1<TScrollView> = Omit<TScrollView, "contentOffset" | "maintainVisibleContentPosition" | "stickyHeaderIndices" | "removeClippedSubviews" | "children" | "onScroll">;
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
    renderItem: ((props: LegendListRenderItemProps$1<ItemT, TItemType>) => React.ReactNode) | React.ComponentType<LegendListRenderItemProps$1<ItemT, TItemType>>;
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
    alwaysRender?: AlwaysRenderConfig$1;
    /**
     * Style applied to each column's wrapper view.
     */
    columnWrapperStyle?: ColumnWrapperStyle$1;
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
    ListFooterComponentStyle?: StyleProp$1<ViewStyle$1> | undefined;
    /**
     * Component or element to render above the list.
     */
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
    /**
     * Style for the header component.
     */
    ListHeaderComponentStyle?: StyleProp$1<ViewStyle$1> | undefined;
    /**
     * If true, auto-scrolls to end when new items are added.
     * Use an options object to opt into specific triggers and control whether that scroll is animated.
     * @default false
     */
    maintainScrollAtEnd?: boolean | MaintainScrollAtEndOptions$1;
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
    maintainVisibleContentPosition?: boolean | MaintainVisibleContentPositionConfig$1<ItemT>;
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
    onMetricsChange?: (metrics: LegendListMetrics$1) => void;
    /**
     * Function to call when the user pulls to refresh.
     */
    onRefresh?: () => void;
    onScroll?: (event: NativeSyntheticEvent$1<NativeScrollEvent$1>) => void;
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
    onViewableItemsChanged?: OnViewableItemsChanged$1<ItemT> | undefined;
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
    viewabilityConfig?: ViewabilityConfig$1;
    /**
     * Pairs of viewability configs and their callbacks for tracking visibility.
     */
    viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPairs$1<ItemT> | undefined;
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
    stickyHeaderConfig?: StickyHeaderConfig$1;
    getItemType?: (item: ItemT, index: number) => TItemType;
    getFixedItemSize?: (item: ItemT, index: number, type: TItemType) => number | undefined;
    itemsAreEqual?: (itemPrevious: ItemT, item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}
type LegendListPropsBase$1<ItemT, TScrollViewProps = Record<string, any>, TItemType extends string | undefined = string | undefined> = BaseScrollViewProps$1<TScrollViewProps> & LegendListSpecificProps<ItemT, TItemType> & (DataModeProps<ItemT, TItemType> | ChildrenModeProps);
type LegendListPropsInternal = LegendListSpecificProps<any, string | undefined> & DataModeProps<any, string | undefined>;
interface MaintainVisibleContentPositionConfig$1<ItemT = any> {
    data?: boolean;
    size?: boolean;
    shouldRestorePosition?: (item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}
interface MaintainVisibleContentPositionNormalized$1<ItemT = any> {
    data: boolean;
    size: boolean;
    shouldRestorePosition?: (item: ItemT, index: number, data: readonly ItemT[]) => boolean;
}
interface StickyHeaderConfig$1 {
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
interface AlwaysRenderConfig$1 {
    top?: number;
    bottom?: number;
    indices?: number[];
    keys?: string[];
}
interface MaintainScrollAtEndOnOptions$1 {
    dataChange?: boolean;
    itemLayout?: boolean;
    layout?: boolean;
}
interface MaintainScrollAtEndOptions$1 {
    /**
     * Whether maintainScrollAtEnd should animate when it scrolls to the end.
     */
    animated?: boolean;
    /**
     * Which events should keep the list pinned to the end.
     * - If omitted, object values default to all triggers.
     * - If provided, only the keys set to `true` are enabled.
     */
    on?: MaintainScrollAtEndOnOptions$1;
}
interface ColumnWrapperStyle$1 {
    rowGap?: number;
    gap?: number;
    columnGap?: number;
}
interface LegendListMetrics$1 {
    headerSize: number;
    footerSize: number;
}
interface ThresholdSnapshot$1 {
    scrollPosition: number;
    contentSize?: number;
    dataLength?: number;
    atThreshold: boolean;
}
interface ScrollTarget$1 {
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
type BootstrapInitialScrollSession = {
    frameHandle?: number;
    mountFrameCount: number;
    passCount: number;
    previousResolvedOffset?: number;
    scroll: number;
    seedContentOffset: number;
    targetIndexSeed?: number;
    visibleIndices?: readonly number[];
};
type InternalScrollTarget = ScrollTarget$1 & {
    waitForInitialScrollCompletionFrame?: boolean;
};
type InitialScrollSessionCompletion = {
    didDispatchNativeScroll?: boolean;
    didRetrySilentInitialScroll?: boolean;
    watchdog?: {
        startScroll: number;
        targetOffset: number;
    };
};
interface InternalInitialScrollTarget extends ScrollIndexWithOffsetAndContentOffset$1 {
    preserveForBottomPadding?: boolean;
    preserveForFooterLayout?: boolean;
}
type InternalInitialScrollSessionBase = {
    completion?: InitialScrollSessionCompletion;
    previousDataLength: number;
};
type OffsetInitialScrollSession = InternalInitialScrollSessionBase & {
    kind: "offset";
};
type BootstrapOwnedInitialScrollSession = InternalInitialScrollSessionBase & {
    bootstrap?: BootstrapInitialScrollSession;
    kind: "bootstrap";
};
type InternalInitialScrollSession = OffsetInitialScrollSession | BootstrapOwnedInitialScrollSession;
interface InternalState$1 {
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
    deferredPublicOnScrollEvent?: NativeSyntheticEvent$1<NativeScrollEvent$1>;
    didColumnsChange?: boolean;
    didDataChange?: boolean;
    didFinishInitialScroll?: boolean;
    didContainersLayout?: boolean;
    enableScrollForNextCalculateItemsInView: boolean;
    endBuffered: number;
    endNoBuffer: number;
    endReachedSnapshot: ThresholdSnapshot$1 | undefined;
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
    initialScrollSession?: InternalInitialScrollSession;
    initialScroll: InternalInitialScrollTarget | undefined;
    isAtEnd: boolean;
    isAtStart: boolean;
    isEndReached: boolean | null;
    isFirst?: boolean;
    isStartReached: boolean | null;
    lastBatchingAction: number;
    lastLayout: LayoutRectangle$1 | undefined;
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
    contentInsetOverride?: Partial<Insets$1> | null;
    nativeContentInset?: Insets$1;
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
    reprocessCurrentScroll?: () => void;
    refScroller: React.RefObject<LegendListScrollerRef$1 | null>;
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
    scrollingTo?: InternalScrollTarget | undefined;
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
    startReachedSnapshot: ThresholdSnapshot$1 | undefined;
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
    viewabilityConfigCallbackPairs: ViewabilityConfigCallbackPairs$1<any> | undefined;
    props: {
        alignItemsAtEnd: boolean;
        animatedProps: StylesAsSharedValue<Record<string, any>>;
        alwaysRender: AlwaysRenderConfig$1 | undefined;
        alwaysRenderIndicesArr: number[];
        alwaysRenderIndicesSet: Set<number>;
        contentInset: Insets$1 | undefined;
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
        maintainVisibleContentPosition: MaintainVisibleContentPositionNormalized$1;
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
interface ViewableRange$1<T> {
    end: number;
    endBuffered: number;
    items: T[];
    start: number;
    startBuffered: number;
}
interface LegendListRenderItemProps$1<ItemT, TItemType extends string | number | undefined = string | number | undefined> {
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
    reportContentInset(inset?: Partial<Insets$1> | null): void;
};
interface ViewToken$1<ItemT = any> {
    containerId: number;
    index: number;
    isViewable: boolean;
    item: ItemT;
    key: string;
}
interface ViewAmountToken$1<ItemT = any> extends ViewToken$1<ItemT> {
    percentOfScroller: number;
    percentVisible: number;
    scrollSize: number;
    size: number;
    sizeVisible: number;
}
interface ViewabilityConfigCallbackPair$1<ItemT = any> {
    onViewableItemsChanged?: OnViewableItemsChanged$1<ItemT>;
    viewabilityConfig: ViewabilityConfig$1;
}
type ViewabilityConfigCallbackPairs$1<ItemT> = ViewabilityConfigCallbackPair$1<ItemT>[];
type OnViewableItemsChanged$1<ItemT> = ((info: {
    viewableItems: Array<ViewToken$1<ItemT>>;
    changed: Array<ViewToken$1<ItemT>>;
}) => void) | null;
interface ViewabilityConfig$1 {
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
type ViewabilityCallback$1<ItemT = any> = (viewToken: ViewToken$1<ItemT>) => void;
type ViewabilityAmountCallback$1<ItemT = any> = (viewToken: ViewAmountToken$1<ItemT>) => void;
interface LegendListRecyclingState$1<T> {
    index: number;
    item: T;
    prevIndex: number | undefined;
    prevItem: T | undefined;
}
type TypedForwardRef$1 = <T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;
declare const typedForwardRef: TypedForwardRef$1;
type TypedMemo$1 = <T extends React.ComponentType<any>>(Component: T, propsAreEqual?: (prevProps: Readonly<React.ComponentProps<T>>, nextProps: Readonly<React.ComponentProps<T>>) => boolean) => T & {
    displayName?: string;
};
declare const typedMemo: TypedMemo$1;
interface ScrollIndexWithOffset$1 {
    index: number;
    viewOffset?: number;
    viewPosition?: number;
}
interface ScrollIndexWithOffsetPosition$1 extends ScrollIndexWithOffset$1 {
    viewPosition?: number;
}
interface ScrollIndexWithOffsetAndContentOffset$1 extends ScrollIndexWithOffsetPosition$1 {
    contentOffset?: number;
}
/** @deprecated Kept for backwards compatibility. Use `ScrollIndexWithOffsetPosition`. */
interface InitialScrollAnchor$1 extends ScrollIndexWithOffsetPosition$1 {
    attempts?: number;
    lastDelta?: number;
    settledTicks?: number;
}
type GetRenderedItemResult$1<ItemT> = {
    index: number;
    item: ItemT;
    renderedItem: React.ReactNode;
};
type GetRenderedItem$1 = (key: string) => GetRenderedItemResult$1<any> | null;

/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type Insets = Insets$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LayoutRectangle = LayoutRectangle$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type NativeScrollEvent = NativeScrollEvent$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type NativeSyntheticEvent<T> = NativeSyntheticEvent$1<T>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewStyle = ViewStyle$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type StyleProp<T> = StyleProp$1<T>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollEventTargetLike = ScrollEventTargetLike$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollableNodeLike = ScrollableNodeLike$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListScrollerRef = LegendListScrollerRef$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type BaseScrollViewProps<TScrollView> = BaseScrollViewProps$1<TScrollView>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListPropsBase<ItemT, TScrollViewProps = Record<string, any>, TItemType extends string | undefined = string | undefined> = LegendListPropsBase$1<ItemT, TScrollViewProps, TItemType>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type MaintainVisibleContentPositionConfig<ItemT = any> = MaintainVisibleContentPositionConfig$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type MaintainVisibleContentPositionNormalized<ItemT = any> = MaintainVisibleContentPositionNormalized$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type StickyHeaderConfig = StickyHeaderConfig$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type AlwaysRenderConfig = AlwaysRenderConfig$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type MaintainScrollAtEndOnOptions = MaintainScrollAtEndOnOptions$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type MaintainScrollAtEndOptions = MaintainScrollAtEndOptions$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ColumnWrapperStyle = ColumnWrapperStyle$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListMetrics = LegendListMetrics$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ThresholdSnapshot = ThresholdSnapshot$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollTarget = ScrollTarget$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type InternalState = InternalState$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewableRange<T> = ViewableRange$1<T>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListRenderItemProps<ItemT, TItemType extends string | number | undefined = string | number | undefined> = LegendListRenderItemProps$1<ItemT, TItemType>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListState = LegendListState$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListRef = LegendListRef$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewToken<ItemT = any> = ViewToken$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewAmountToken<ItemT = any> = ViewAmountToken$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewabilityConfigCallbackPair<ItemT = any> = ViewabilityConfigCallbackPair$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewabilityConfigCallbackPairs<ItemT> = ViewabilityConfigCallbackPairs$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type OnViewableItemsChanged<ItemT> = OnViewableItemsChanged$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewabilityConfig = ViewabilityConfig$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewabilityCallback<ItemT = any> = ViewabilityCallback$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ViewabilityAmountCallback<ItemT = any> = ViewabilityAmountCallback$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListRecyclingState<T> = LegendListRecyclingState$1<T>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type TypedForwardRef = TypedForwardRef$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type TypedMemo = TypedMemo$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollIndexWithOffset = ScrollIndexWithOffset$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollIndexWithOffsetPosition = ScrollIndexWithOffsetPosition$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollIndexWithOffsetAndContentOffset = ScrollIndexWithOffsetAndContentOffset$1;
/** @deprecated Use `ScrollIndexWithOffsetPosition`, or `@legendapp/list/react-native` / `@legendapp/list/react` for strict typing */
type InitialScrollAnchor = InitialScrollAnchor$1;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type GetRenderedItemResult<ItemT> = GetRenderedItemResult$1<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type GetRenderedItem = GetRenderedItem$1;
interface LooseAccessibilityActionEvent {
    nativeEvent?: {
        actionName?: string;
    };
}
type AccessibilityActionEvent = LooseAccessibilityActionEvent;
type LooseAccessibilityRole = string;
type AccessibilityRole = LooseAccessibilityRole;
interface LooseAccessibilityState {
    busy?: boolean;
    checked?: boolean | "mixed";
    disabled?: boolean;
    expanded?: boolean;
    selected?: boolean;
}
type AccessibilityState = LooseAccessibilityState;
interface LooseAccessibilityValue {
    max?: number;
    min?: number;
    now?: number;
    text?: string;
}
type AccessibilityValue = LooseAccessibilityValue;
type LooseColorValue = string | number;
type ColorValue = LooseColorValue;
interface LooseGestureResponderEvent {
    nativeEvent?: unknown;
}
type GestureResponderEvent = LooseGestureResponderEvent;
interface LoosePointerEvent {
    nativeEvent?: unknown;
}
type PointerEvent = LoosePointerEvent;
interface LooseRefreshControlProps {
    onRefresh?: () => void;
    progressViewOffset?: number;
    refreshing?: boolean;
}
type RefreshControlProps = LooseRefreshControlProps;
type LooseRole = string;
type Role = LooseRole;
interface PointProp {
    x: number;
    y: number;
}
interface LayoutChangeEvent {
    nativeEvent: {
        layout: LayoutRectangle;
    };
}
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
interface LooseScrollViewProps {
    StickyHeaderComponent?: ComponentType<unknown>;
    accessibilityActions?: Array<{
        label?: string;
        name: string;
    }>;
    accessibilityElementsHidden?: boolean;
    accessibilityHint?: string;
    accessibilityIgnoresInvertColors?: boolean;
    accessibilityLabel?: string;
    accessibilityLabelledBy?: string | string[];
    accessibilityLanguage?: string;
    accessibilityLargeContentTitle?: string;
    accessibilityLiveRegion?: "none" | "polite" | "assertive";
    accessibilityRespondsToUserInteraction?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityShowsLargeContentViewer?: boolean;
    accessibilityState?: AccessibilityState;
    accessibilityValue?: AccessibilityValue;
    accessibilityViewIsModal?: boolean;
    accessible?: boolean;
    alwaysBounceHorizontal?: boolean;
    alwaysBounceVertical?: boolean;
    "aria-busy"?: boolean;
    "aria-checked"?: boolean | "mixed";
    "aria-disabled"?: boolean;
    "aria-expanded"?: boolean;
    "aria-hidden"?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-live"?: "polite" | "assertive" | "off";
    "aria-modal"?: boolean;
    "aria-selected"?: boolean;
    "aria-valuemax"?: number;
    "aria-valuemin"?: number;
    "aria-valuenow"?: number;
    "aria-valuetext"?: string;
    automaticallyAdjustContentInsets?: boolean;
    automaticallyAdjustKeyboardInsets?: boolean;
    automaticallyAdjustsScrollIndicatorInsets?: boolean;
    bounces?: boolean;
    bouncesZoom?: boolean;
    canCancelContentTouches?: boolean;
    centerContent?: boolean;
    children?: ReactNode;
    collapsable?: boolean;
    collapsableChildren?: boolean;
    contentContainerStyle?: StyleProp<ViewStyle> | CSSProperties;
    contentInset?: Insets;
    contentInsetAdjustmentBehavior?: "always" | "never" | "automatic" | "scrollableAxes";
    contentOffset?: PointProp;
    decelerationRate?: number | "fast" | "normal";
    directionalLockEnabled?: boolean;
    disableIntervalMomentum?: boolean;
    disableScrollViewPanResponder?: boolean;
    endFillColor?: ColorValue;
    fadingEdgeLength?: number | {
        end?: number;
        start?: number;
    };
    focusable?: boolean;
    hasTVPreferredFocus?: boolean;
    hitSlop?: number | Insets;
    horizontal?: boolean;
    id?: string;
    importantForAccessibility?: "auto" | "yes" | "no" | "no-hide-descendants";
    indicatorStyle?: "default" | "black" | "white";
    innerViewRef?: Ref<unknown>;
    invertStickyHeaders?: boolean;
    isTVSelectable?: boolean;
    keyboardDismissMode?: "none" | "interactive" | "on-drag";
    keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled";
    maintainVisibleContentPosition?: {
        autoscrollToTopThreshold?: number;
        minIndexForVisible: number;
    };
    maximumZoomScale?: number;
    minimumZoomScale?: number;
    nativeID?: string;
    needsOffscreenAlphaCompositing?: boolean;
    nestedScrollEnabled?: boolean;
    onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
    onAccessibilityEscape?: () => void;
    onAccessibilityTap?: () => void;
    onBlur?: (event: unknown) => void;
    onContentSizeChange?: (width: number, height: number) => void;
    onFocus?: (event: unknown) => void;
    onLayout?: (event: LayoutChangeEvent) => void;
    onMagicTap?: () => void;
    onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onMoveShouldSetResponder?: (event: GestureResponderEvent) => boolean;
    onMoveShouldSetResponderCapture?: (event: GestureResponderEvent) => boolean;
    onPointerCancel?: (event: PointerEvent) => void;
    onPointerCancelCapture?: (event: PointerEvent) => void;
    onPointerDown?: (event: PointerEvent) => void;
    onPointerDownCapture?: (event: PointerEvent) => void;
    onPointerEnter?: (event: PointerEvent) => void;
    onPointerEnterCapture?: (event: PointerEvent) => void;
    onPointerLeave?: (event: PointerEvent) => void;
    onPointerLeaveCapture?: (event: PointerEvent) => void;
    onPointerMove?: (event: PointerEvent) => void;
    onPointerMoveCapture?: (event: PointerEvent) => void;
    onPointerUp?: (event: PointerEvent) => void;
    onPointerUpCapture?: (event: PointerEvent) => void;
    onResponderEnd?: (event: GestureResponderEvent) => void;
    onResponderGrant?: (event: GestureResponderEvent) => void;
    onResponderMove?: (event: GestureResponderEvent) => void;
    onResponderReject?: (event: GestureResponderEvent) => void;
    onResponderRelease?: (event: GestureResponderEvent) => void;
    onResponderStart?: (event: GestureResponderEvent) => void;
    onResponderTerminate?: (event: GestureResponderEvent) => void;
    onResponderTerminationRequest?: (event: GestureResponderEvent) => boolean;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollAnimationEnd?: () => void;
    onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollToTop?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onStartShouldSetResponder?: (event: GestureResponderEvent) => boolean;
    onStartShouldSetResponderCapture?: (event: GestureResponderEvent) => boolean;
    onTouchCancel?: (event: GestureResponderEvent) => void;
    onTouchEnd?: (event: GestureResponderEvent) => void;
    onTouchEndCapture?: (event: GestureResponderEvent) => void;
    onTouchMove?: (event: GestureResponderEvent) => void;
    onTouchStart?: (event: GestureResponderEvent) => void;
    overScrollMode?: "always" | "never" | "auto";
    pagingEnabled?: boolean;
    persistentScrollbar?: boolean;
    pinchGestureEnabled?: boolean;
    pointerEvents?: "none" | "box-none" | "box-only" | "auto";
    refreshControl?: ReactElement<RefreshControlProps, string | JSXElementConstructor<unknown>>;
    removeClippedSubviews?: boolean;
    renderToHardwareTextureAndroid?: boolean;
    role?: Role;
    screenReaderFocusable?: boolean;
    scrollEnabled?: boolean;
    scrollEventThrottle?: number;
    scrollIndicatorInsets?: Insets;
    scrollPerfTag?: string;
    scrollToOverflowEnabled?: boolean;
    scrollViewRef?: Ref<unknown>;
    scrollsToTop?: boolean;
    shouldRasterizeIOS?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    snapToAlignment?: "start" | "center" | "end";
    snapToEnd?: boolean;
    snapToInterval?: number;
    snapToOffsets?: number[];
    snapToStart?: boolean;
    stickyHeaderHiddenOnScroll?: boolean;
    stickyHeaderIndices?: number[];
    style?: StyleProp<ViewStyle> | CSSProperties;
    tabIndex?: 0 | -1;
    testID?: string;
    tvParallaxMagnification?: number;
    tvParallaxShiftDistanceX?: number;
    tvParallaxShiftDistanceY?: number;
    tvParallaxTiltAngle?: number;
    zoomScale?: number;
}
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type ScrollViewPropsLoose = LooseScrollViewProps;
type LegendListPropsLoose<ItemT = any> = Omit<LegendListPropsBase<ItemT, LooseScrollViewProps>, "ListHeaderComponentStyle" | "ListFooterComponentStyle"> & {
    ListHeaderComponentStyle?: StyleProp<ViewStyle> | CSSProperties | undefined;
    ListFooterComponentStyle?: StyleProp<ViewStyle> | CSSProperties | undefined;
};
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListProps<ItemT = any> = LegendListPropsLoose<ItemT>;
/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
type LegendListComponent = <ItemT = any>(props: LegendListProps<ItemT> & RefAttributes<LegendListRef>) => ReactElement | null;

declare function useViewability<ItemT = any>(callback: ViewabilityCallback$1<ItemT>, configId?: string): void;
declare function useViewabilityAmount<ItemT = any>(callback: ViewabilityAmountCallback$1<ItemT>): void;
declare function useRecyclingEffect(effect: (info: LegendListRecyclingState$1<unknown>) => void | (() => void)): void;
declare function useRecyclingState<ItemT>(valueOrFun: ((info: LegendListRecyclingState$1<ItemT>) => ItemT) | ItemT): readonly [ItemT, Dispatch<SetStateAction<ItemT>>];
declare function useIsLastItem(): boolean;
declare function useListScrollSize(): {
    width: number;
    height: number;
};
declare function useSyncLayout(): () => void;

/** @deprecated Use `@legendapp/list/react-native` or `@legendapp/list/react` for strict typing */
declare const LegendList: LegendListComponent;

export { type AccessibilityActionEvent, type AccessibilityRole, type AccessibilityState, type AccessibilityValue, type AlwaysRenderConfig, type BaseScrollViewProps, type ColorValue, type ColumnWrapperStyle, type GestureResponderEvent, type GetRenderedItem, type GetRenderedItemResult, type InitialScrollAnchor, type Insets, type InternalState, type LayoutChangeEvent, type LayoutRectangle, LegendList, type LegendListComponent, type LegendListMetrics, type LegendListProps, type LegendListPropsBase, type LegendListRecyclingState, type LegendListRef, type LegendListRenderItemProps, type LegendListScrollerRef, type LegendListState, type LooseAccessibilityActionEvent, type LooseAccessibilityRole, type LooseAccessibilityState, type LooseAccessibilityValue, type LooseColorValue, type LooseGestureResponderEvent, type LoosePointerEvent, type LooseRefreshControlProps, type LooseRole, type LooseScrollViewProps, type MaintainScrollAtEndOnOptions, type MaintainScrollAtEndOptions, type MaintainVisibleContentPositionConfig, type MaintainVisibleContentPositionNormalized, type NativeScrollEvent, type NativeSyntheticEvent, type OnViewableItemsChanged, type PointProp, type PointerEvent, type RefreshControlProps, type Role, type ScrollEventTargetLike, type ScrollIndexWithOffset, type ScrollIndexWithOffsetAndContentOffset, type ScrollIndexWithOffsetPosition, type ScrollTarget, type ScrollViewPropsLoose, type ScrollableNodeLike, type StickyHeaderConfig, type StyleProp, type ThresholdSnapshot, type TypedForwardRef, type TypedMemo, type ViewAmountToken, type ViewStyle, type ViewToken, type ViewabilityAmountCallback, type ViewabilityCallback, type ViewabilityConfig, type ViewabilityConfigCallbackPair, type ViewabilityConfigCallbackPairs, type ViewableRange, typedForwardRef, typedMemo, useIsLastItem, useListScrollSize, useRecyclingEffect, useRecyclingState, useSyncLayout, useViewability, useViewabilityAmount };
