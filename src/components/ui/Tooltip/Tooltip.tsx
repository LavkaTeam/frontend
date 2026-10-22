import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import styles from './Tooltip.module.css';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

const GAP = 8;

/**
 * Bubble shown on hover and keyboard focus, in the style of the verification
 * status tooltip in the cabinet. Rendered in a portal and positioned from the
 * trigger, so scrolling or clipping containers (tables) do not cut it off.
 */
const Tooltip = ({ content, children }: TooltipProps) => {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  const show = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setPosition({ top: rect.bottom + GAP, left: rect.left + rect.width / 2 });
  }, []);
  const hide = useCallback(() => setPosition(null), []);

  // A bubble anchored to a moved trigger would float in the wrong place.
  useEffect(() => {
    if (!position) return undefined;

    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);

    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, [hide, position]);

  return (
    <span
      ref={triggerRef}
      className={styles.trigger}
      tabIndex={0}
      aria-describedby={position ? id : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {position
        ? createPortal(
            // Position follows the trigger, so it has to be set inline.
            <span
              id={id}
              role='tooltip'
              className={styles.bubble}
              style={{ top: position.top, left: position.left }}
            >
              <span className={styles.arrow} />
              {content}
            </span>,
            document.body,
          )
        : null}
    </span>
  );
};

export { Tooltip };
