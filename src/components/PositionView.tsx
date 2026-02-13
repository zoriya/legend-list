import type { CSSProperties } from "react";
import * as React from "react";

import { POSITION_OUT_OF_VIEW } from "@/constants";
import type { LayoutRectangle } from "@/platform/platform-types";
import { useArr$ } from "@/state/state";
import { typedMemo, type StickyHeaderConfig } from "@/types";
import { isArray } from "@/utils/helpers";
import { getComponent } from "@/utils/getComponent";

interface ExtraPropsFromRN {
    animatedScrollY: any;
    onLayout: any;
}

interface PositionViewStateProps {
    id: number;
    index: number;
    horizontal: boolean;
    style: CSSProperties;
    refView: React.RefObject<HTMLDivElement>;
    onLayoutChange: (rectangle: LayoutRectangle, fromLayoutEffect: boolean) => void;
    children: React.ReactNode;
    stickyHeaderConfig?: StickyHeaderConfig;
}

const isRNWeb = typeof document !== "undefined" && !!document.getElementById("react-native-stylesheet");
const baseCss: CSSProperties = {
    contain: "paint layout style",
    ...(isRNWeb
        ? {
              display: "flex",
              flexDirection: "column",
          }
        : {}),
};

// biome-ignore lint/nursery/noShadow: const function name shadowing is intentional
const PositionViewState = typedMemo(function PositionViewState({
    id,
    horizontal,
    style,
    refView,
    stickyHeaderConfig,
    ...props
}: PositionViewStateProps) {
    const [position = POSITION_OUT_OF_VIEW] = useArr$([`containerPosition${id}`]);

    // Merge to a single CSSProperties object and avoid RN-style transform arrays
    const composed: CSSProperties = isArray(style)
        ? (Object.assign({}, ...style) as CSSProperties)
        : (style as unknown as CSSProperties);
    const combinedStyle: CSSProperties = horizontal
        ? ({ ...baseCss, ...composed, left: position } as CSSProperties)
        : ({ ...baseCss, ...composed, top: position } as CSSProperties);

    // biome-ignore lint/correctness/noUnusedVariables: Spreading out invalid DOM props
    const { animatedScrollY, onLayout, index, ...webProps } = props as PositionViewStateProps & ExtraPropsFromRN;

    return <div ref={refView} {...(webProps as any)} style={combinedStyle as any} />;
});

// biome-ignore lint/nursery/noShadow: const function name shadowing is intentional
export const PositionViewSticky = typedMemo(function PositionViewSticky({
    id,
    horizontal,
    style,
    refView,
    index,
    animatedScrollY: _animatedScrollY,
    stickyHeaderConfig,
    children,
    ...rest
}: {
    id: number;
    horizontal: boolean;
    style: CSSProperties;
    refView: React.RefObject<HTMLDivElement>;
    onLayoutChange: (rectangle: LayoutRectangle, fromLayoutEffect: boolean) => void;
    index: number;
    animatedScrollY?: unknown;
    stickyHeaderConfig?: StickyHeaderConfig;
    children: React.ReactNode;
}) {
    const [position = POSITION_OUT_OF_VIEW, activeStickyIndex] = useArr$([
        `containerPosition${id}`,
        "activeStickyIndex",
    ]);

    const composed = React.useMemo(
        () =>
            (isArray(style) ? (Object.assign({}, ...style) as CSSProperties) : (style as unknown as CSSProperties)) ??
            {},
        [style],
    );

    const viewStyle = React.useMemo(() => {
        const styleBase: CSSProperties = { ...baseCss, ...composed };
        delete styleBase.transform;

        const offset = stickyHeaderConfig?.offset ?? 0;
        const isActive = activeStickyIndex === index;
        styleBase.position = isActive ? "sticky" : "absolute";
        styleBase.zIndex = index + 1000;

        if (horizontal) {
            styleBase.left = isActive ? offset : position;
        } else {
            styleBase.top = isActive ? offset : position;
        }

        return styleBase;
    }, [composed, horizontal, position, index, activeStickyIndex, stickyHeaderConfig?.offset]);

    const renderStickyHeaderBackdrop = React.useMemo(() => {
        if (!stickyHeaderConfig?.backdropComponent) {
            return null;
        }

        return getComponent(stickyHeaderConfig?.backdropComponent);
    }, [stickyHeaderConfig?.backdropComponent]);
    return (
        <div ref={refView} style={viewStyle as any} {...rest}>
            <div
                style={{
                    inset: 0,
                    pointerEvents: "none",
                    position: "absolute",
                }}
            >
                {renderStickyHeaderBackdrop}
            </div>
            {children}
        </div>
    );
});

export const PositionView = PositionViewState;
