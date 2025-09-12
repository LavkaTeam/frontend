import styles from './BuyerProfile.module.css';
import { useUser } from '@/hooks/useUser';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/Form';
import { EditPasswordIcon } from '@/components/ui/icons/EditPasswordIcon';
import ChangePassword from '../ChangePassword/ChangePassword';
import { updateUser } from '@/api/user';
import { useToast } from '@/hooks/useToast';
import Toast from '../Toast/Toast';

const BuyerProfile = () => {
  const { data: user, error } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    telephoneNumber: '',
    city: '',
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showToast } = useToast();

  // Оновлюємо форму при зміні даних користувача
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: `${user.name} ${user.lastName}`,
        email: user.email || '',
        companyName: user.companyName || '',
        telephoneNumber: user.telephoneNumber || '',
        city: '',
      });
    }
  }, [user]);

  if (error || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [name, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const userData = {
        name: name || '',
        lastName: lastName || '',
        email: formData.email,
        companyName: formData.companyName,
        telephoneNumber: formData.telephoneNumber,
        registration_Number: user.registration_Number || '',
        liquor_License: user.liquor_License || '',
        tax_ID: user.tax_ID || '',
        vat_Number: user.vat_Number || '',
        bank_Name: user.bank_Name || '',
        iban: user.iban || '',
        bic: user.bic || '',
      };

      // Викликаємо API без збереження результату
      await updateUser(user.id, userData);

      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      console.error('Failed to update profile:', err);

      let errorMessage = 'Failed to update profile';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.profileContent}>
      <h2 className={styles.profileTitle}>
        Hello, you are in your customer account
      </h2>
      <p className={styles.profileDescription}>
        Here you will find all information about your orders and be able to
        update your personal details
      </p>

      <div className={styles.profileInfo}>
        <div className={styles.infoContent}>
          <div className={styles.subTitles}>
            <p className={styles.subTitle}>Full name:</p>
            <p className={styles.subTitle}>Email:</p>
            <p className={styles.subTitle}>Password:</p>
            <p className={styles.subTitle}>Name company:</p>
            <p className={styles.subTitle}>Phone number:</p>
            <p className={styles.subTitle}>City:</p>
          </div>
          <div className={styles.Inputs}>
            <InputField
              id='fullName'
              value={formData.fullName}
              onChange={handleChange}
              placeholder='Full name'
            />
            <InputField
              id='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
            />
            <div className={styles.passwordBlock}>
              <InputField id='text' type='password' value='••••••••' readOnly />
              <div
                className={styles.editPassword}
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <span className={styles.editPasswordText}>
                  Edit password...
                </span>
                <EditPasswordIcon />
              </div>
            </div>
            <InputField
              id='companyName'
              value={formData.companyName}
              onChange={handleChange}
              placeholder='Company name'
            />
            <InputField
              id='telephoneNumber'
              value={formData.telephoneNumber}
              onChange={handleChange}
              placeholder='Phone number'
            />
            <InputField
              id='city'
              value={formData.city}
              onChange={handleChange}
              placeholder='London'
            />
          </div>
        </div>
        <div className={styles.button}>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Рендер сповіщення */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      ))}
    </div>
  );
};

export default BuyerProfile;
