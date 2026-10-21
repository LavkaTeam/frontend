import type { ReactNode } from 'react';

import styles from './AuthHeading.module.css';

interface FormHeaderProps {
  title: string;
  subtitle: ReactNode;
}

const FormHeader = ({ title, subtitle }: FormHeaderProps) => {
  return (
    <div className={styles.formHeader}>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
};

export { FormHeader };
