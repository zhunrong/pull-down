import {
  FC,
  PropsWithChildren,
  useRef,
  CSSProperties,
  TouchEventHandler,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

export interface PullDownProps {
  bannerHeight?: number;
  bannerMaxHeight?: number;
  bannerContent?: ReactNode;
}

export const PullDown: FC<PropsWithChildren<PullDownProps>> = (props) => {
  const {
    children,
    bannerHeight = 50,
    bannerMaxHeight = 200,
    bannerContent,
  } = props;

  const isPullingRef = useRef(false);
  const isTransitionRef = useRef(false);
  const bannerHeightRef = useRef(bannerHeight);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef(0);

  const handleTouchStart: TouchEventHandler = useCallback((event) => {
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop === 0) {
      isPullingRef.current = true;
      touchStartRef.current = 1;
      touchStartRef.current = event.touches[0].pageY;
    }
  }, []);

  const handleTouchEnd: TouchEventHandler = useCallback(
    (event) => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      const current = event.changedTouches[0].pageY;
      const movement = current - touchStartRef.current;
      if (movement > 0) {
        bannerRef.current!.style.transition = "height 0.5s";
        bannerRef.current!.style.height = `${bannerHeight}px`;
        bannerHeightRef.current = bannerHeight;
        isTransitionRef.current = true;
      }
    },
    [bannerHeight]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isPullingRef.current || isTransitionRef.current) return;
      const current = event.touches[0].pageY;
      const movement = current - touchStartRef.current;
      if (movement > 0) {
        bannerRef.current!.style.transition = "";
        bannerRef.current!.style.height = `${Math.min(
          bannerHeightRef.current + movement,
          bannerMaxHeight
        )}px`;
        if (event.cancelable) {
          event.preventDefault();
        }
        event.stopPropagation();
      }
    },
    [bannerMaxHeight]
  );

  useEffect(() => {
    rootRef.current!.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => {
      rootRef.current!.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchMove]);

  const handleTransitionEnd = () => {
    isTransitionRef.current = false;
  };

  const bannerStyle: CSSProperties = {
    height: bannerHeightRef.current,
  };

  return (
    <div
      ref={(el) => (rootRef.current = el)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={(el) => (bannerRef.current = el)}
        style={bannerStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {bannerContent}
      </div>
      <div>{children}</div>
    </div>
  );
};
