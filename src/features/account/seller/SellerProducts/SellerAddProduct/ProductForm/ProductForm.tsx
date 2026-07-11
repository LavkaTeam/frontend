import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';

import { DropdownField, type DropdownOption } from '@/components/ui/DropdownField';
import { Input } from '@/components/ui/Input';
import type { CategoryTreeItem } from '@/types/productCard';
import type {
  ProductFormData,
  ProductWholesaleTierFormValue,
} from '@/schemas/productSchema';

import styles from './ProductForm.module.css';

interface ProductFormProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  categoryTree: CategoryTreeItem[];
  onFieldChange: (
    field: keyof ProductFormData,
    value: string | string[],
  ) => void;
  onTagsChange: (tags: string[]) => void;
  onAddWholesaleTier: () => void;
  onWholesaleTierChange: (
    tierId: string,
    field: keyof Pick<ProductWholesaleTierFormValue, 'minQuantity' | 'price'>,
    value: string,
  ) => void;
  onRemoveWholesaleTier: (tierId: string) => void;
  isSubmitting: boolean;
}

const CloseIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10'></circle>
    <line x1='15' y1='9' x2='9' y2='15'></line>
    <line x1='9' y1='9' x2='15' y2='15'></line>
  </svg>
);

const TrashIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M3 6h18'></path>
    <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
    <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
    <line x1='10' y1='11' x2='10' y2='17'></line>
    <line x1='14' y1='11' x2='14' y2='17'></line>
  </svg>
);

const formatLabel = (value: string) =>
  value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

const formatDiscountHint = (basePrice: string, tierPrice: string) => {
  const base = Number(basePrice);
  const tier = Number(tierPrice);

  if (
    !Number.isFinite(base) ||
    !Number.isFinite(tier) ||
    base <= 0 ||
    tier <= 0
  ) {
    return null;
  }

  const discount = ((base - tier) / base) * 100;
  if (discount <= 0) return null;

  return `${discount.toFixed(discount % 1 === 0 ? 0 : 1)}% off base price`;
};

const AnimatedBlock = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  if (!isOpen && !shouldRender) {
    return null;
  }

  return (
    <div
      className={`${styles.animatedBlock} ${
        isOpen ? styles.animatedBlockOpen : styles.animatedBlockClosed
      }`}
      onTransitionEnd={(event) => {
        if (
          !isOpen &&
          event.target === event.currentTarget &&
          event.propertyName === 'grid-template-rows'
        ) {
          setShouldRender(false);
        }
      }}
    >
      <div className={styles.animatedBlockInner}>{children}</div>
    </div>
  );
};

export const ProductForm = ({
  formData,
  errors,
  categoryTree,
  onFieldChange,
  onTagsChange,
  onAddWholesaleTier,
  onWholesaleTierChange,
  onRemoveWholesaleTier,
  isSubmitting,
}: ProductFormProps) => {
  const [tagInput, setTagInput] = useState('');
  const [showDiscountPrice, setShowDiscountPrice] = useState(
    formData.discountPrice.trim() !== '',
  );
  const [showWholesalePricing, setShowWholesalePricing] = useState(
    formData.wholesalePrices.length > 0,
  );

  useEffect(() => {
    if (formData.discountPrice.trim() !== '') setShowDiscountPrice(true);
  }, [formData.discountPrice]);

  useEffect(() => {
    if (formData.wholesalePrices.length > 0) setShowWholesalePricing(true);
  }, [formData.wholesalePrices.length]);

  const currentSubcategories = useMemo(() => {
    return (
      categoryTree.find((item) => item.category === formData.category)
        ?.subcategories || []
    );
  }, [categoryTree, formData.category]);

  const categoryOptions = useMemo<DropdownOption[]>(
    () =>
      categoryTree.map((item) => ({
        value: item.category,
        label: formatLabel(item.category),
      })),
    [categoryTree],
  );

  const subcategoryOptions = useMemo<DropdownOption[]>(
    () =>
      currentSubcategories.map((subcategory) => ({
        value: subcategory,
        label: formatLabel(subcategory),
      })),
    [currentSubcategories],
  );

  const addTag = (tagValue: string) => {
    const normalizedTag = tagValue.trim().replace(/,$/, '');
    if (!normalizedTag || formData.tags.includes(normalizedTag)) {
      setTagInput('');
      return;
    }

    onTagsChange([...formData.tags, normalizedTag]);
    setTagInput('');
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(tagInput);
      return;
    }

    if (
      event.key === 'Backspace' &&
      tagInput === '' &&
      formData.tags.length > 0
    ) {
      onTagsChange(formData.tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(formData.tags.filter((_, index) => index !== indexToRemove));
  };

  const renderField = (
    label: string,
    field: keyof ProductFormData,
    props?: InputHTMLAttributes<HTMLInputElement>,
    className?: string,
  ) => (
    <div className={`${styles.formGroup} ${className || ''}`.trim()}>
      <label className={styles.label}>{label}</label>
      <Input
        {...props}
        name={field}
        value={String(formData[field] ?? '')}
        onChange={(event) => onFieldChange(field, event.target.value)}
        disabled={isSubmitting}
        error={Boolean(errors[field])}
      />
      {errors[field] ? (
        <span className={styles.errorText}>{errors[field]}</span>
      ) : null}
    </div>
  );

  return (
    <div className={styles.formShell}>
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>
          <p className={styles.sectionDescription}>
            Core identity and catalog grouping for this product.
          </p>
        </div>

        <div className={styles.formGrid}>
          {renderField('Product Name', 'name', {
            placeholder: 'Craft Beer IPA 0.33L',
          })}
          {renderField('Producer', 'producer', {
            placeholder: 'Brand or manufacturer',
          })}

          <DropdownField
            className={styles.formGroup}
            label='Category'
            value={formData.category}
            placeholder='Select category'
            options={categoryOptions}
            error={errors.category}
            disabled={isSubmitting}
            onSelect={(value) => {
              onFieldChange('category', value);
              onFieldChange('subcategory', '');
            }}
          />

          <DropdownField
            className={styles.formGroup}
            label='Subcategory'
            value={formData.subcategory}
            placeholder='Select subcategory'
            options={subcategoryOptions}
            error={errors.subcategory}
            disabled={isSubmitting || subcategoryOptions.length === 0}
            onSelect={(value) => onFieldChange('subcategory', value)}
          />
        </div>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Pricing & Inventory</h3>
          <p className={styles.sectionDescription}>
            Build the product price structure and decide which extra pricing
            modes this SKU needs.
          </p>
        </div>

        <div className={styles.primaryPricingGrid}>
          {renderField('Base Price ($)', 'price', {
            type: 'number',
            min: '0.01',
            step: '0.01',
            placeholder: '100.00',
          })}
          {renderField('Quantity in Stock', 'quantity', {
            type: 'number',
            min: '0',
            step: '1',
            placeholder: '500',
          })}
          {renderField('Minimum Order Quantity', 'minimumOrderQuantity', {
            type: 'number',
            min: '1',
            step: '1',
            placeholder: '1',
          })}
          {renderField(
            'Tax Rate (%)',
            'taxRate',
            {
              type: 'number',
              min: '0',
              max: '100',
              step: '0.01',
              placeholder: '20',
            },
            styles.primaryGridField,
          )}
        </div>

        <div className={styles.pricingTools}>
          {!showDiscountPrice ? (
            <button
              type='button'
              className={styles.optionToggle}
              onClick={() => setShowDiscountPrice(true)}
              disabled={isSubmitting}
            >
              + Add discount price
            </button>
          ) : null}

          {!showWholesalePricing ? (
            <button
              type='button'
              className={styles.optionToggle}
              onClick={() => {
                setShowWholesalePricing(true);
                onAddWholesaleTier();
              }}
              disabled={isSubmitting}
            >
              + Add wholesale pricing
            </button>
          ) : null}
        </div>

        <AnimatedBlock isOpen={showDiscountPrice}>
          <div className={styles.pricingCard}>
            <div className={styles.pricingCardHeader}>
              <div>
                <h4 className={styles.pricingCardTitle}>Discount Price</h4>
                <p className={styles.pricingCardText}>
                  Promotional price shown instead of the base retail price.
                </p>
              </div>
              <button
                type='button'
                className={styles.removeOptionButton}
                onClick={() => {
                  setShowDiscountPrice(false);
                  onFieldChange('discountPrice', '');
                }}
                disabled={isSubmitting}
              >
                Remove
              </button>
            </div>
            {renderField(
              'Discount Price ($)',
              'discountPrice',
              {
                type: 'number',
                min: '0.01',
                step: '0.01',
                placeholder: '90.00',
              },
              styles.lastFieldInCard,
            )}
          </div>
        </AnimatedBlock>

        <AnimatedBlock isOpen={showWholesalePricing}>
          <div className={styles.wholesalePanel}>
            <div className={styles.wholesalePanelHeader}>
              <div>
                <h4 className={styles.wholesaleTitle}>Wholesale Pricing</h4>
                <p className={styles.wholesaleDescription}>
                  Set price breaks for larger quantities. Each next tier should
                  start at a higher quantity and give a lower unit price.
                </p>
              </div>
              <div className={styles.wholesaleActions}>
                <button
                  type='button'
                  className={styles.removeOptionButton}
                  onClick={() => {
                    setShowWholesalePricing(false);
                    formData.wholesalePrices.forEach((tier) =>
                      onRemoveWholesaleTier(tier.id),
                    );
                  }}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className={styles.tierList}>
              {formData.wholesalePrices.map((tier, index) => {
                const discountHint = formatDiscountHint(
                  formData.price,
                  tier.price,
                );

                return (
                  <div key={tier.id} className={styles.tierCard}>
                    <div className={styles.tierCardGrid}>
                      <div className={styles.tierField}>
                        <span className={styles.tierLabel}>
                          Minimum quantity
                        </span>
                        <Input
                          type='number'
                          min='2'
                          step='1'
                          value={tier.minQuantity}
                          onChange={(event) =>
                            onWholesaleTierChange(
                              tier.id,
                              'minQuantity',
                              event.target.value,
                            )
                          }
                          disabled={isSubmitting}
                          error={Boolean(
                            errors[`wholesalePrices.${index}.minQuantity`],
                          )}
                        />
                        {errors[`wholesalePrices.${index}.minQuantity`] ? (
                          <span className={styles.errorText}>
                            {errors[`wholesalePrices.${index}.minQuantity`]}
                          </span>
                        ) : null}
                      </div>

                      <div className={styles.tierField}>
                        <span className={styles.tierLabel}>
                          Price per piece ($)
                        </span>
                        <Input
                          type='number'
                          min='0.01'
                          step='0.01'
                          value={tier.price}
                          onChange={(event) =>
                            onWholesaleTierChange(
                              tier.id,
                              'price',
                              event.target.value,
                            )
                          }
                          disabled={isSubmitting}
                          error={Boolean(
                            errors[`wholesalePrices.${index}.price`],
                          )}
                        />
                        {errors[`wholesalePrices.${index}.price`] ? (
                          <span className={styles.errorText}>
                            {errors[`wholesalePrices.${index}.price`]}
                          </span>
                        ) : null}
                      </div>

                      <div className={styles.tierSummary}>
                        <span className={styles.tierSummaryLabel}>
                          Tier preview
                        </span>
                        <span className={styles.tierSummaryText}>
                          {tier.minQuantity || '0'}+ pcs at $
                          {tier.price || '0.00'}
                        </span>
                        {discountHint ? (
                          <span className={styles.tierHint}>
                            {discountHint}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type='button'
                      className={styles.removeTierButton}
                      onClick={() => onRemoveWholesaleTier(tier.id)}
                      disabled={isSubmitting}
                      aria-label='Remove wholesale tier'
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.wholesaleFooter}>
              <button
                type='button'
                className={styles.inlineAction}
                onClick={onAddWholesaleTier}
                disabled={isSubmitting}
              >
                + Add tier
              </button>
            </div>
          </div>
        </AnimatedBlock>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Catalog Metadata</h3>
          <p className={styles.sectionDescription}>
            Internal codes, dimensions and product origin details.
          </p>
        </div>

        <div className={styles.formGrid}>
          {renderField('SKU', 'sku', {
            placeholder: 'WINE-001',
          })}
          {renderField('Barcode', 'barcode', {
            placeholder: '4820000000000',
          })}
          {renderField('Volume (L)', 'volume', {
            type: 'number',
            min: '0.01',
            step: '0.01',
            placeholder: '0.75',
          })}
          {renderField('Alcohol (%)', 'alcohol', {
            type: 'number',
            min: '0',
            max: '100',
            step: '0.01',
            placeholder: '12.5',
          })}
          {renderField('Weight (kg)', 'weight', {
            type: 'number',
            min: '0.01',
            step: '0.01',
            placeholder: '1.2',
          })}
          {renderField('Country of Origin', 'countryOfOrigin', {
            placeholder: 'Ukraine',
          })}
          {renderField('Material', 'material', {
            placeholder: 'Glass bottle',
          })}
          {renderField('Dimensions (cm)', 'dimensions', {
            placeholder: '30x8x8',
          })}
        </div>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Description & Tags</h3>
          <p className={styles.sectionDescription}>
            Add the sales copy and searchable tags buyers will see.
          </p>
        </div>

        <div className={`${styles.formGroup} ${styles.descriptionGroup}`.trim()}>
          <label className={styles.label}>Description</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={(event) =>
              onFieldChange('description', event.target.value)
            }
            className={`${styles.textarea} ${errors.description ? styles.textareaError : ''}`}
            disabled={isSubmitting}
            placeholder='Describe packaging, flavor profile, serving notes and key selling points.'
          />
          {errors.description ? (
            <span className={styles.errorText}>{errors.description}</span>
          ) : null}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tags</label>
          <div
            className={`${styles.tagsContainer} ${isSubmitting ? styles.disabled : ''} ${
              errors.tags ? styles.tagsContainerError : ''
            }`}
          >
            {formData.tags.map((tag, index) => (
              <div key={tag + index} className={styles.tagBadge}>
                <span className={styles.tagText}>{tag}</span>
                <button
                  type='button'
                  className={styles.tagRemoveBtn}
                  onClick={() => removeTag(index)}
                  disabled={isSubmitting}
                >
                  <CloseIcon />
                </button>
              </div>
            ))}

            <input
              type='text'
              className={styles.tagsInput}
              placeholder='Type a tag'
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => {
                if (tagInput.trim()) addTag(tagInput);
              }}
              disabled={isSubmitting}
            />

            <button
              type='button'
              className={styles.tagAddButton}
              onClick={() => addTag(tagInput)}
              disabled={isSubmitting || !tagInput.trim()}
            >
              Add tag
            </button>
          </div>

          {errors.tags ? (
            <span className={styles.errorText}>{errors.tags}</span>
          ) : null}
        </div>
      </section>
    </div>
  );
};
