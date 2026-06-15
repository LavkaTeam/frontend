import { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import styles from './PriceRange.module.css';

interface PriceRangeProps {
  selectedMin: string;
  selectedMax: string;
  onChange: (min: string, max: string) => void;
  minLimit?: number;
  maxLimit?: number;
  disabled?: boolean;
}

const STEP = 0.01;
const DEFAULT_MIN = 0;
const DEFAULT_MAX = 10000;

const PriceRange = ({
  selectedMin,
  selectedMax,
  onChange,
  minLimit = DEFAULT_MIN,
  maxLimit = DEFAULT_MAX,
  disabled = false,
}: PriceRangeProps) => {
  const isRangeDisabled = minLimit === maxLimit;
  const isComponentDisabled = disabled || isRangeDisabled;

  // Selected State (Applied values) - mapped to numbers for slider and strings for inputs
  const appliedMin = selectedMin ? Number(selectedMin) : minLimit;
  const appliedMax = selectedMax ? Number(selectedMax) : maxLimit;

  // Draft State (Input and Slider state)
  const [minDraft, setMinDraft] = useState<string>(String(appliedMin));
  const [maxDraft, setMaxDraft] = useState<string>(String(appliedMax));
  
  // We also keep numeric state for the slider to keep it smooth and reactive
  const [sliderValues, setSliderValues] = useState<[number, number]>([appliedMin, appliedMax]);

  // Sync Draft State with Selected State when Selected State or Limits change
  useEffect(() => {
    const newMin = selectedMin ? Number(selectedMin) : minLimit;
    const newMax = selectedMax ? Number(selectedMax) : maxLimit;
    
    setMinDraft(String(newMin));
    setMaxDraft(String(newMax));
    setSliderValues([newMin, newMax]);
  }, [selectedMin, selectedMax, minLimit, maxLimit]);

  const commitChanges = (min: number, max: number) => {
    // Clamp to limits
    const clampedMin = Math.max(minLimit, Math.min(maxLimit, min));
    const clampedMax = Math.max(minLimit, Math.min(maxLimit, max));
    
    // Sort to prevent overlap
    const finalMin = Math.min(clampedMin, clampedMax);
    const finalMax = Math.max(clampedMin, clampedMax);

    onChange(String(finalMin), String(finalMax));
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinDraft(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDraft(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const min = Number(minDraft) || minLimit;
      const max = Number(maxDraft) || maxLimit;
      commitChanges(min, max);
    }
  };

  const handleInputBlur = () => {
    const min = Number(minDraft) || minLimit;
    const max = Number(maxDraft) || maxLimit;
    commitChanges(min, max);
  };

  const handleSliderChange = (newValues: number[]) => {
    const [min, max] = newValues as [number, number];
    setSliderValues([min, max]);
    setMinDraft(String(min));
    setMaxDraft(String(max));
  };

  const handleSliderFinalChange = (newValues: number[]) => {
    const [min, max] = newValues as [number, number];
    commitChanges(min, max);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputsRow}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Min</label>
          <div className={styles.inputWrapper}>
            <span className={styles.currency}>$</span>
            <input
              type='number'
              value={minDraft}
              onChange={handleMinInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              className={styles.priceInput}
              placeholder={String(minLimit)}
              disabled={isComponentDisabled}
            />
          </div>
        </div>

        <div className={styles.dividerLine} />

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Max</label>
          <div className={styles.inputWrapper}>
            <span className={styles.currency}>$</span>
            <input
              type='number'
              value={maxDraft}
              onChange={handleMaxInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              className={styles.priceInput}
              placeholder={String(maxLimit)}
              disabled={isComponentDisabled}
            />
          </div>
        </div>
      </div>

       <div className={styles.sliderWrapper} style={{ opacity: isComponentDisabled ? 0.5 : 1 }}>
        {isRangeDisabled ? (
          <div className={styles.staticTrackWrapper}>
            <div className={styles.staticTrack} />
            <div className={styles.staticThumb} />
          </div>
        ) : (
          <Range
            values={sliderValues}
            step={STEP}
            min={minLimit}
            max={maxLimit < minLimit ? minLimit + 1 : maxLimit}
            onChange={handleSliderChange}
            onFinalChange={handleSliderFinalChange}
            disabled={disabled}
            renderTrack={({ props: trackProps, children }) => {
              const safeMax = maxLimit < minLimit ? minLimit + 1 : maxLimit;

              return (
                <div
                  onMouseDown={trackProps.onMouseDown}
                  onTouchStart={trackProps.onTouchStart}
                  className={styles.trackOuter}
                  style={trackProps.style}
                >
                  <div
                    ref={trackProps.ref}
                    className={styles.trackInner}
                    style={{
                      background: getTrackBackground({
                        values: sliderValues,
                        colors: [
                          'var(--color-gray-200)',
                          disabled ? 'var(--color-gray-400)' : '#AF261F',
                          'var(--color-gray-200)',
                        ],
                        min: minLimit,
                        max: safeMax,
                      }),
                    }}
                  >
                    {children}
                  </div>
                </div>
              );
            }}
            renderThumb={({ props: thumbProps, isDragged, index }) => (
              <div
                {...thumbProps}
                key={thumbProps.key}
                className={styles.thumb}
                aria-label={index === 0 ? 'Min price' : 'Max price'}
              >
                <div
                  className={`${styles.thumbDot} ${isDragged ? styles.thumbDotActive : ''}`}
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export { PriceRange };
