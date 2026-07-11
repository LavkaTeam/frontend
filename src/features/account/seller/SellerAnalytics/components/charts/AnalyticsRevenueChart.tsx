import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { useOnClickOutside } from '@/hooks/useOnClickOutside';

import type { RevenueBarDatum } from '../../model/analytics.utils';
import {
  formatCurrency,
  formatTrendValue,
  getChartPeakValue,
  getRevenueDelta,
} from '../../model/analytics.utils';
import styles from '../../SellerAnalytics.module.css';

interface AnalyticsRevenueChartProps {
  bars: RevenueBarDatum[];
  year: number;
  options: Array<{ value: string; label: string }>;
  totalRevenue: number;
  onYearChange: (year: number) => void;
}

const AnalyticsRevenueChart = ({
  bars,
  year,
  options,
  totalRevenue,
  onYearChange,
}: AnalyticsRevenueChartProps) => {
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const [hoveredBarKey, setHoveredBarKey] = useState<RevenueBarDatum['key'] | null>(
    null,
  );
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipBar, setTooltipBar] = useState<RevenueBarDatum | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chartBarsRef = useRef<HTMLDivElement>(null);
  const tooltipHideTimeoutRef = useRef<number | null>(null);
  const tooltipShowFrameRef = useRef<number | null>(null);
  const peak = useMemo(() => getChartPeakValue(bars), [bars]);
  const selectedOption =
    options.find((option) => option.value === String(year)) || options[0];
  const hoveredBarIndex = tooltipBar
    ? bars.findIndex((bar) => bar.key === tooltipBar.key)
    : -1;
  const hoveredDelta = tooltipBar
    ? getRevenueDelta(tooltipBar.currentValue, tooltipBar.previousValue)
    : null;
  const [tooltipPosition, setTooltipPosition] = useState<{ left: number; top: number } | null>(
    null,
  );

  useOnClickOutside(dropdownRef, () => setIsYearMenuOpen(false));

  useEffect(() => {
    return () => {
      if (tooltipHideTimeoutRef.current !== null) {
        window.clearTimeout(tooltipHideTimeoutRef.current);
      }
      if (tooltipShowFrameRef.current !== null) {
        window.cancelAnimationFrame(tooltipShowFrameRef.current);
      }
    };
  }, []);

  const showTooltip = (
    bar: RevenueBarDatum,
    position: { left: number; top: number },
  ) => {
    if (tooltipHideTimeoutRef.current !== null) {
      window.clearTimeout(tooltipHideTimeoutRef.current);
      tooltipHideTimeoutRef.current = null;
    }

    if (tooltipShowFrameRef.current !== null) {
      window.cancelAnimationFrame(tooltipShowFrameRef.current);
      tooltipShowFrameRef.current = null;
    }

    setHoveredBarKey(bar.key);
    setTooltipBar(bar);
    setTooltipPosition(position);
    setIsTooltipVisible(false);

    tooltipShowFrameRef.current = window.requestAnimationFrame(() => {
      tooltipShowFrameRef.current = window.requestAnimationFrame(() => {
        setIsTooltipVisible(true);
        tooltipShowFrameRef.current = null;
      });
    });
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);

    if (tooltipHideTimeoutRef.current !== null) {
      window.clearTimeout(tooltipHideTimeoutRef.current);
    }

    tooltipHideTimeoutRef.current = window.setTimeout(() => {
      setHoveredBarKey(null);
      setTooltipBar(null);
      setTooltipPosition(null);
      tooltipHideTimeoutRef.current = null;
    }, 220);
  };

  return (
    <section className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartInfoBlock}>
          <div className={styles.chartTitleBlock}>
            <p className={styles.chartLabel}>Total Revenue</p>
            <p className={styles.chartTotal}>{formatCurrency(totalRevenue)}</p>
          </div>

          <div className={styles.chartLegend}>
            <span className={styles.chartLegendItem}>
              <span
                className={`${styles.chartLegendDot} ${styles.chartLegendDotCurrent}`}
              />
              {year}
            </span>
            <span className={styles.chartLegendItem}>
              <span
                className={`${styles.chartLegendDot} ${styles.chartLegendDotPrevious}`}
              />
              {year - 1}
            </span>
            <span className={styles.chartLegendHint}>Hover bars to compare months</span>
          </div>
        </div>

        <div className={styles.chartYearDropdown} ref={dropdownRef}>
          <button
            type='button'
            className={styles.chartYearButton}
            onClick={() => setIsYearMenuOpen((previous) => !previous)}
            aria-haspopup='listbox'
            aria-expanded={isYearMenuOpen}
          >
            <span>{selectedOption?.label || String(year)}</span>
            <svg
              className={`${styles.chartYearIcon} ${
                isYearMenuOpen ? styles.chartYearIconOpen : ''
              }`}
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              aria-hidden='true'
            >
              <path
                d='M6 9L12 15L18 9'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>

          {isYearMenuOpen ? (
            <div className={styles.chartYearMenu} role='listbox'>
              {options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  className={`${styles.chartYearOption} ${
                    option.value === String(year)
                      ? styles.chartYearOptionActive
                      : ''
                  }`}
                  onClick={() => {
                    onYearChange(Number(option.value));
                    setIsYearMenuOpen(false);
                  }}
                  role='option'
                  aria-selected={option.value === String(year)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div
        ref={chartBarsRef}
        className={styles.chartBars}
        onMouseLeave={hideTooltip}
      >
        {tooltipBar && hoveredBarIndex >= 0 && tooltipPosition ? (
          <div
            className={`${styles.chartTooltip} ${
              isTooltipVisible ? styles.chartTooltipVisible : ''
            }`}
            style={
              {
                left: tooltipPosition.left,
                top: tooltipPosition.top,
              } as CSSProperties
            }
          >
            <p className={styles.chartTooltipTitle}>{tooltipBar.fullLabel}</p>
            <div className={styles.chartTooltipRow}>
              <span>{year}</span>
              <strong>{formatCurrency(tooltipBar.currentValue)}</strong>
            </div>
            <div className={styles.chartTooltipRow}>
              <span>{year - 1}</span>
              <strong>{formatCurrency(tooltipBar.previousValue)}</strong>
            </div>
            <div className={styles.chartTooltipDelta}>
              <span>
                {hoveredDelta && hoveredDelta.difference >= 0 ? '+' : ''}
                {hoveredDelta ? formatCurrency(hoveredDelta.difference) : '$0.00'}
              </span>
              <span>
                {hoveredDelta?.percentage !== undefined
                  ? `${hoveredDelta.percentage >= 0 ? '+' : '-'}${formatTrendValue(
                      hoveredDelta.percentage,
                    )}`
                  : 'New month'}
              </span>
            </div>
          </div>
        ) : null}

        {bars.map((bar) => (
          <div
            key={bar.key}
            className={`${styles.chartColumn} ${
              hoveredBarKey === bar.key ? styles.chartColumnActive : ''
            }`}
            onMouseEnter={(event) => {
              const chartRect = chartBarsRef.current?.getBoundingClientRect();
              const columnRect = event.currentTarget.getBoundingClientRect();
              const barGroupRect =
                event.currentTarget
                  .querySelector<HTMLElement>(`.${styles.chartColumnBars}`)
                  ?.getBoundingClientRect() || columnRect;

              if (!chartRect) return;

              const tooltipWidth = 212;
              const preferredLeft =
                barGroupRect.right - chartRect.left + 18;
              const fallbackLeft =
                barGroupRect.left - chartRect.left - tooltipWidth - 18;
              const left =
                preferredLeft + tooltipWidth <= chartRect.width
                  ? preferredLeft
                  : Math.max(8, fallbackLeft);
              const top = Math.max(
                12,
                barGroupRect.top - chartRect.top + 24,
              );

              showTooltip(bar, { left, top });
            }}
          >
            <div className={styles.chartColumnBars}>
              <div
                className={`${styles.chartBar} ${styles.chartBarPrevious}`}
                style={
                  {
                    '--bar-height': `${(bar.previousValue / peak) * 100}%`,
                  } as CSSProperties
                }
                aria-label={`${bar.label} previous year ${formatCurrency(bar.previousValue)}`}
              />
              <div
                className={`${styles.chartBar} ${styles.chartBarCurrent}`}
                style={
                  {
                    '--bar-height': `${(bar.currentValue / peak) * 100}%`,
                  } as CSSProperties
                }
                aria-label={`${bar.label} current year ${formatCurrency(bar.currentValue)}`}
              />
            </div>
            <span className={styles.chartColumnLabel}>{bar.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export { AnalyticsRevenueChart };
