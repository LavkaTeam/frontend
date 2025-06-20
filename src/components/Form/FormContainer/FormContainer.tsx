import type { ReactNode } from 'react';

import styles from './FormContainer.module.css';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <div className={styles.formWrapper}>
      <div className={styles.formContainer}>{children}</div>
    </div>
  );
};

export { FormContainer };
