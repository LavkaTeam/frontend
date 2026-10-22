import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  // Several panels may stay open at once (default) or only one.
  allowMultiple?: boolean;
}

/**
 * Disclosure list following the WAI-ARIA accordion pattern: each header is a
 * button with aria-expanded / aria-controls, Enter and Space toggle it, and
 * ArrowUp / ArrowDown / Home / End move between the headers.
 */
const Accordion = ({ items, allowMultiple = true }: AccordionProps) => {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>([]);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (id: string) =>
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return allowMultiple ? [...current, id] : [id];
    });

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const lastIndex = items.length - 1;
    const nextIndex = {
      ArrowDown: index === lastIndex ? 0 : index + 1,
      ArrowUp: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    }[event.key];

    if (nextIndex === undefined) return;

    event.preventDefault();
    buttonsRef.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
          >
            <h3 className={styles.heading}>
              <button
                ref={(node) => {
                  buttonsRef.current[index] = node;
                }}
                id={buttonId}
                type='button'
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span>{item.title}</span>
                <span className={styles.icon} aria-hidden='true' />
              </button>
            </h3>
            <div
              id={panelId}
              role='region'
              aria-labelledby={buttonId}
              className={styles.panel}
              hidden={!isOpen}
            >
              <div className={styles.content}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { Accordion };
