import { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/Input';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  formData: {
    name: string;
    category: string;
    price: string;
    description: string;
    tags: string[];
  };
  errors: Record<string, string>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onTagsChange: (tags: string[]) => void;
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

export const ProductForm = ({
  formData,
  errors,
  onChange,
  onTagsChange,
  isSubmitting,
}: ProductFormProps) => {
  const [tagInput, setTagInput] = useState('');

  // Додавання тегу
  const addTag = (tagString: string) => {
    const newTag = tagString.trim().replace(/,$/, ''); // Забираємо зайві пробіли і коми
    if (newTag && !formData.tags.includes(newTag)) {
      onTagsChange([...formData.tags, newTag]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    } else if (
      e.key === 'Backspace' &&
      tagInput === '' &&
      formData.tags.length > 0
    ) {
      const newTags = [...formData.tags];
      newTags.pop();
      onTagsChange(newTags);
    }
  };

  // Зберігаємо тег, коли юзер клікає поза інпутом (наприклад, йде до іншого поля)
  const handleTagBlur = () => {
    if (tagInput.trim() !== '') {
      addTag(tagInput);
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(formData.tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Product Name</label>
        <Input
          name='name'
          value={formData.name}
          onChange={onChange}
          disabled={isSubmitting}
          style={{ borderColor: errors.name ? '#dc2626' : undefined }}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Category</label>
        <Input
          name='category'
          value={formData.category}
          onChange={onChange}
          disabled={isSubmitting}
          style={{ borderColor: errors.category ? '#dc2626' : undefined }}
        />
        {errors.category && (
          <span className={styles.errorText}>{errors.category}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Price</label>
        <Input
          name='price'
          type='number'
          value={formData.price}
          onChange={onChange}
          disabled={isSubmitting}
          style={{ borderColor: errors.price ? '#dc2626' : undefined }}
        />
        {errors.price && (
          <span className={styles.errorText}>{errors.price}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          name='description'
          value={formData.description}
          onChange={onChange}
          className={styles.textarea}
          disabled={isSubmitting}
          style={{ borderColor: errors.description ? '#dc2626' : undefined }}
        />
        {errors.description && (
          <span className={styles.errorText}>{errors.description}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Tags</label>
        <div
          className={`${styles.tagsContainer} ${isSubmitting ? styles.disabled : ''}`}
          style={{ borderColor: errors.tags ? '#dc2626' : undefined }}
        >
          {formData.tags.map((tag, index) => (
            <div key={index} className={styles.tagBadge}>
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
            placeholder={
              formData.tags.length === 0 ? 'Type a tag and press Enter...' : ''
            }
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={handleTagBlur}
            disabled={isSubmitting}
          />
        </div>

        {/* НОВА ПІДКАЗКА ДЛЯ ЮЗЕРА */}
        {tagInput.trim().length > 0 && (
          <span className={styles.tagHint}>
            Press <strong>Enter</strong> to add "{tagInput.trim()}"
          </span>
        )}

        {errors.tags && <span className={styles.errorText}>{errors.tags}</span>}
      </div>
    </div>
  );
};
