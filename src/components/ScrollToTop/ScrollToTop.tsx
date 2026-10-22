import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Frames to follow an #anchor target, about one second: the page may still
// be loading (lazy chunk, skeletons replaced by data) and shift it.
const MAX_HASH_FRAMES = 60;

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }

    let frame = 0;
    let frames = 0;
    let userScrolled = false;
    const stop = () => {
      userScrolled = true;
    };
    const userEvents = ['wheel', 'touchstart', 'keydown'] as const;
    userEvents.forEach((name) =>
      window.addEventListener(name, stop, { passive: true }),
    );

    // Keeps "/#discover" in place until the page settles, unless the user
    // starts scrolling themselves.
    const follow = () => {
      if (userScrolled) return;

      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        const margin =
          parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        if (Math.abs(target.getBoundingClientRect().top - margin) > 2) {
          target.scrollIntoView({ block: 'start' });
        }
      }

      frames += 1;
      if (frames < MAX_HASH_FRAMES) {
        frame = window.requestAnimationFrame(follow);
      }
    };

    follow();

    return () => {
      window.cancelAnimationFrame(frame);
      userEvents.forEach((name) => window.removeEventListener(name, stop));
    };
  }, [pathname, hash]);

  return null;
};

export { ScrollToTop };
