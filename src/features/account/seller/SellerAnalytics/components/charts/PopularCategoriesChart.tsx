import { useState } from 'react';

import type { AnalyticsCategoryRevenueViewModel } from '../../model/analytics.utils';

import styles from './PopularCategoriesChart.module.css';

interface PopularCategoriesChartProps {
  items: AnalyticsCategoryRevenueViewModel[];
}

const getSlicePath = (startAngle: number, endAngle: number) => {
  const pointAt = (angle: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: 50 + 46 * Math.cos(radians),
      y: 50 + 46 * Math.sin(radians),
    };
  };
  const start = pointAt(startAngle);
  const end = pointAt(endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M 50 50 L ${start.x} ${start.y} A 46 46 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
};

const PopularCategoriesChart = ({
  items,
}: PopularCategoriesChartProps) => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const topCategory = items[0];
  const hoveredCategory = items.find((item) => item.id === hoveredCategoryId);
  const displayedCategory = hoveredCategory || topCategory;
  let currentAngle = 0;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Popular Categories</h3>
        </div>
      </div>

      {items.length > 0 ? (
        <div className={styles.content}>
          <div className={styles.chartWrap}>
            <div
              className={`${styles.chart} ${
                hoveredCategory ? styles.chartHoverActive : ''
              }`}
            >
              <svg
                className={styles.chartSlices}
                viewBox='0 0 100 100'
                role='img'
                aria-label='Category popularity share'
              >
                {items.map((item) => {
                  const startAngle = currentAngle;
                  const endAngle = startAngle + (item.value / total) * 360;
                  currentAngle = endAngle;
                  const isHovered = item.id === hoveredCategoryId;

                  return items.length === 1 ? (
                    <circle
                      key={item.id}
                      className={`${styles.chartSlice} ${
                        isHovered ? styles.chartSliceActive : ''
                      }`}
                      cx='50'
                      cy='50'
                      r='46'
                      fill={item.color}
                      onMouseEnter={() => setHoveredCategoryId(item.id)}
                      onMouseLeave={() => setHoveredCategoryId(null)}
                    />
                  ) : (
                    <path
                      key={item.id}
                      className={`${styles.chartSlice} ${
                        isHovered ? styles.chartSliceActive : ''
                      }`}
                      d={getSlicePath(startAngle, endAngle)}
                      fill={item.color}
                      onMouseEnter={() => setHoveredCategoryId(item.id)}
                      onMouseLeave={() => setHoveredCategoryId(null)}
                    />
                  );
                })}
              </svg>
              <div className={styles.chartCenter}>
                <span className={styles.centerLabel}>{displayedCategory.label}</span>
                <strong className={styles.centerValue}>
                  {displayedCategory.percentage.toFixed(1)}%
                </strong>
              </div>
            </div>
          </div>

          <div className={styles.legend}>
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.legendRow} ${
                  item.id === hoveredCategoryId ? styles.legendRowActive : ''
                }`}
                onMouseEnter={() => setHoveredCategoryId(item.id)}
                onMouseLeave={() => setHoveredCategoryId(null)}
              >
                <div className={styles.legendMain}>
                  <span
                    className={styles.legendDot}
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={styles.legendLabel}>{item.label}</span>
                </div>
                <span className={styles.legendPercent}>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h4>No category revenue yet</h4>
          <p>
            Category breakdown will appear here once completed sales are
            available.
          </p>
        </div>
      )}
    </section>
  );
};

export { PopularCategoriesChart };
