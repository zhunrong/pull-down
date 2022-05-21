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

const getPageScrollTop = () =>
  document.documentElement.scrollTop || document.body.scrollTop;

export interface PullDownProps {
  bannerHeight?: number;
  bannerMaxHeight?: number;
  bannerContent?: ReactNode;
  onRefresh?: () => Promise<void>;
}

export const PullDown: FC<PropsWithChildren<PullDownProps>> = (props) => {
  const {
    children,
    bannerHeight = 50,
    bannerMaxHeight = 200,
    bannerContent,
    onRefresh,
  } = props;

  // 是否正在下拉动作
  const isPullingRef = useRef(false);
  // banner 高度正在恢复
  const isTransitionRef = useRef(false);
  // 正在调用 onRefresh
  const isRefreshingRef = useRef(false);
  // onRefresh 锁定，避免一直下拉，一直刷新
  const refreshLockRef = useRef(false);
  // banner 高度
  const bannerHeightRef = useRef(bannerHeight);
  // banner element
  const bannerRef = useRef<HTMLDivElement | null>(null);
  // root element
  const rootRef = useRef<HTMLDivElement | null>(null);
  // touch 开始 Y 坐标
  const touchStartRef = useRef(0);

  const handleTouchStart: TouchEventHandler = useCallback((event) => {
    const scrollTop = getPageScrollTop();
    // 页面滚动到顶部才能下拉动作
    if (scrollTop === 0) {
      isPullingRef.current = true;
      touchStartRef.current = event.touches[0].pageY;
    }
  }, []);

  // 恢复 banner 初始高度
  const recoverBannerHeight = useCallback(() => {
    Object.assign(bannerRef.current!.style, {
      transition: "height 0.35s",
      height: `${bannerHeight}px`,
    });
    bannerHeightRef.current = bannerHeight;
    isTransitionRef.current = true;
  }, [bannerHeight]);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      console.log("touchend");
      // 释放 onRefresh 锁定
      refreshLockRef.current = false;
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      const current = event.changedTouches[0].pageY;
      const movement = current - touchStartRef.current;
      // 正在刷新的时候暂时不恢复 banner 高度
      if (movement > 0 && !isRefreshingRef.current) {
        recoverBannerHeight();
      }
    },
    [recoverBannerHeight]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const current = event.touches[0].pageY;
      const movement = current - touchStartRef.current;
      // 阻止类似微信webview这种自带的下拉弹性效果
      if (movement >= 0 && event.cancelable && getPageScrollTop() === 0) {
        event.preventDefault();
      }
      // 不是拉下动作 or banner 高度正在恢复 or 刷新锁定，直接return
      // onRefresh 锁定，避免一直下拉，一直刷新
      if (
        !isPullingRef.current ||
        isTransitionRef.current ||
        refreshLockRef.current ||
        movement <= 0
      )
        return;

      const factor = 0.3;
      const bannerRealHeight = Math.min(
        bannerHeightRef.current + movement * factor,
        bannerMaxHeight
      );
      Object.assign(bannerRef.current!.style, {
        transition: "",
        height: `${bannerRealHeight}px`,
      });

      if (
        bannerRealHeight === bannerMaxHeight &&
        typeof onRefresh === "function" &&
        !isRefreshingRef.current
      ) {
        isRefreshingRef.current = true;
        refreshLockRef.current = true;
        // 执行刷新，完成后重置状态
        onRefresh().then(() => {
          isRefreshingRef.current = false;
          // 这个时候 touch 已经结束，需要自动恢复 banner 高度
          console.log("lock", refreshLockRef.current);
          if (!refreshLockRef.current) {
            recoverBannerHeight();
          }
        });
      }
    },
    [bannerMaxHeight, onRefresh, recoverBannerHeight]
  );

  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  const handleTransitionEnd = () => {
    isTransitionRef.current = false;
  };

  const bannerStyle: CSSProperties = {
    height: bannerHeightRef.current,
    willChange: "height",
  };

  return (
    <div ref={(el) => (rootRef.current = el)} onTouchStart={handleTouchStart}>
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
