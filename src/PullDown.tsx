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
  bannerBg?: ReactNode;
  bannerLoading?: ReactNode;
  onRefresh?: () => Promise<void>;
}

export const PullDown: FC<PropsWithChildren<PullDownProps>> = (props) => {
  const {
    children,
    bannerHeight = 50,
    bannerMaxHeight = 200,
    bannerBg,
    bannerLoading,
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
  // banner background element
  const bannerBgRef = useRef<HTMLDivElement | null>(null);
  // banner loading element
  const bannerLoadingRef = useRef<HTMLDivElement | null>(null);
  // root element
  const rootRef = useRef<HTMLDivElement | null>(null);
  // content element
  const contentRef = useRef<HTMLDivElement | null>(null);
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

  // 恢复 banner content 初始位置
  const recoverContentPosition = useCallback(() => {
    const transform = getComputedStyle(contentRef.current!)
      .transform.slice(7, -1)
      .split(", ");
    if (+transform[5] < 1) return;
    Object.assign(contentRef.current!.style, {
      transition: "transform 0.35s",
      transform: "translate3d(0, 0, 0)",
    });
    Object.assign(bannerBgRef.current!.style, {
      transition: "transform 0.35s",
      transform: `translate3d(-50%, 0, 0) scale(1)`,
    });
    Object.assign(bannerLoadingRef.current!.style, {
      transition: "transform 0.35s",
      transform: `translate3d(0, 0, 0)`,
    });
    isTransitionRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      // 释放 onRefresh 锁定
      refreshLockRef.current = false;
      if (!isPullingRef.current) return;
      isPullingRef.current = false;
      const current = event.changedTouches[0].pageY;
      const movement = current - touchStartRef.current;
      // 正在刷新的时候暂时不恢复 banner 高度
      if (movement > 0 && !isRefreshingRef.current) {
        recoverContentPosition();
      }
    },
    [recoverContentPosition]
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
      const maxOffset = bannerMaxHeight - bannerHeight;
      const offset = Math.min(movement * factor, maxOffset);
      const scale = (bannerHeight + offset) / bannerHeight;

      Object.assign(bannerBgRef.current!.style, {
        transition: "",
        transform: `translate3d(-50%, 0, 0) scale(${scale})`,
      });
      Object.assign(contentRef.current!.style, {
        transition: "",
        transform: `translate3d(0, ${offset}px, 0)`,
      });
      Object.assign(bannerLoadingRef.current!.style, {
        transition: "",
        transform: `translate3d(0, ${offset / 2}px, 0)`,
      });

      if (
        offset === maxOffset &&
        typeof onRefresh === "function" &&
        !isRefreshingRef.current
      ) {
        isRefreshingRef.current = true;
        refreshLockRef.current = true;
        // 执行刷新，完成后重置状态
        onRefresh().then(() => {
          isRefreshingRef.current = false;
          // 这个时候 touch 已经结束，需要自动恢复 banner 高度
          if (!refreshLockRef.current) {
            recoverContentPosition();
          }
        });
      }
    },
    [bannerMaxHeight, bannerHeight, onRefresh, recoverContentPosition]
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
    width: "100%",
    height: `${bannerHeight}px`,
    willChange: "height",
    position: "fixed",
    top: "0",
  };

  const contentStyle: CSSProperties = {
    position: "absolute",
    top: `${bannerHeight}px`,
    zIndex: 1,
    background: "#FFF",
    willChange: "transform",
    transform: "translate3d(0,0,0)",
  };

  return (
    <div
      ref={(el) => (rootRef.current = el)}
      style={{ position: "relative" }}
      onTouchStart={handleTouchStart}
    >
      <div style={bannerStyle}>
        <div
          ref={(el) => (bannerBgRef.current = el)}
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translate3d(-50%, 0, 0) scale(1)",
            transformOrigin: "center top",
          }}
        >
          {bannerBg}
        </div>
        <div
          ref={(el) => (bannerLoadingRef.current = el)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate3d(0, 0, 0)",
          }}
        >
          {bannerLoading}
        </div>
      </div>
      <div
        ref={(el) => (contentRef.current = el)}
        style={contentStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {children}
      </div>
    </div>
  );
};
