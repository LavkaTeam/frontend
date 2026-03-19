import { useState, useEffect, useRef } from 'react';

import { updateUser } from '@/api/user';
import { uploadImage } from '@/api/images';
import { uploadDocument } from '@/api/files';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';

import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/Form';
import { EditPasswordIcon } from '@/components/ui/icons/EditPasswordIcon';
import { ChangePassword } from '@/components/ChangePassword/ChangePassword';
import { Toast } from '@/components/ui/Toast';
import { UploadFileIcon } from '@/components/ui/icons/UploadFileIcon';
import { ImageUploadModal } from '@/components/ImageUploadModal/ImageUploadModal';

import styles from './SellerProfile.module.css';

const SellerProfile = () => {
  const { data: user, error } = useUser();
  const { toasts, showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    registration_Number: '',
    liquor_License: '',
    liquor_License_File_Url: '',
    tax_ID: '',
    vat_Number: '',
    bank_Name: '',
    iban: '',
    bic: '',
    email: '',
    companyName: '',
    telephoneNumber: '',
    city: '',
    logoUrl: '',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const licenseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: `${user.name} ${user.lastName}`,
        registration_Number: user.registration_Number || '',
        liquor_License: user.liquor_License || '',
        liquor_License_File_Url: user.liquor_License_File_Url || '',
        tax_ID: user.tax_ID || '',
        vat_Number: user.vat_Number || '',
        bank_Name: user.bank_Name || '',
        iban: user.iban || '',
        bic: user.bic || '',
        email: user.email || '',
        companyName: user.companyName || '',
        telephoneNumber: user.telephoneNumber || '',
        city: '',
        logoUrl: user.logoUrl || '',
      });
    }
  }, [user]);

  if (error || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- ЗАВАНТАЖЕННЯ ЛІЦЕНЗІЇ ---
  const handleLicenseUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File is too large (max 10MB)', 'error');
      return;
    }

    try {
      setIsLoading(true);
      // Використовуємо нове API (поки що мок)
      const uploadedUrl = await uploadDocument(file);

      setFormData((prev) => ({
        ...prev,
        liquor_License_File_Url: uploadedUrl,
      }));
      showToast('License attached (Mock)', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to upload license', 'error');
    } finally {
      setIsLoading(false);
      if (licenseInputRef.current) licenseInputRef.current.value = '';
    }
  };

  // --- ЗАВАНТАЖЕННЯ ЛОГО ---
  const handleLogoUpload = async (file: Blob) => {
    try {
      setIsLoading(true);
      const uploadedUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, logoUrl: uploadedUrl }));

      try {
        await updateUser(user.id, { ...formData, logoUrl: uploadedUrl } as any);
        showToast('Logo updated successfully', 'success');
      } catch (e) {
        console.warn(e);
      }

      setIsLogoModalOpen(false);
    } catch (err) {
      showToast('Failed to upload logo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [name, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      await updateUser(user.id, {
        ...formData,
        name: name || '',
        lastName: lastName || '',
      } as any);

      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
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
            {/* ... Ті самі заголовки ... */}
            <p className={styles.subTitle}>Full name:</p>
            <p className={styles.subTitle}>Name company:</p>
            <p className={styles.subTitle}>Registration Number:</p>
            <p className={styles.subTitle}>Liquor License:</p>
            <p className={styles.subTitle}>Tax ID:</p>
            <p className={styles.subTitle}>VAT Number:</p>
            <p className={styles.subTitle}>Bank Name:</p>
            <p className={styles.subTitle}>IBAN:</p>
            <p className={styles.subTitle}>BIC:</p>
            <p className={styles.subTitle}>Email:</p>
            <p className={styles.subTitle}>Password:</p>
            <p className={styles.subTitle}>Phone number:</p>
          </div>

          <div className={styles.Inputs}>
            <InputField
              id='fullName'
              value={formData.fullName}
              onChange={handleChange}
              placeholder='Full name'
            />
            <InputField
              id='companyName'
              value={formData.companyName}
              onChange={handleChange}
              placeholder='Company name'
            />
            <InputField
              id='registration_Number'
              value={formData.registration_Number}
              onChange={handleChange}
              placeholder='Registration Number'
            />

            {/* --- БЛОК ЛІЦЕНЗІЇ --- */}
            <div className={styles.editBlock}>
              <InputField
                id='liquor_License'
                value={formData.liquor_License}
                onChange={handleChange}
                placeholder='Liquor License Number'
              />

              <input
                type='file'
                ref={licenseInputRef}
                style={{ display: 'none' }}
                onChange={handleLicenseUpload}
                accept='.pdf,.jpg,.jpeg,.png'
              />

              <div className={styles.actionWrapper}>
                {!formData.liquor_License_File_Url ? (
                  <div
                    className={styles.actionLink}
                    onClick={() => licenseInputRef.current?.click()}
                  >
                    <span>Upload your license...</span>
                    <UploadFileIcon />
                  </div>
                ) : (
                  <div className={styles.fileUploaded}>
                    <a
                      href={formData.liquor_License_File_Url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.fileName}
                    >
                      View License
                    </a>
                    <button
                      className={styles.removeBtn}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          liquor_License_File_Url: '',
                        }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <InputField
              id='tax_ID'
              value={formData.tax_ID}
              onChange={handleChange}
              placeholder='Tax ID'
            />
            <InputField
              id='vat_Number'
              value={formData.vat_Number}
              onChange={handleChange}
              placeholder='VAT Number'
            />
            <InputField
              id='bank_Name'
              value={formData.bank_Name}
              onChange={handleChange}
              placeholder='Bank Name'
            />
            <InputField
              id='iban'
              value={formData.iban}
              onChange={handleChange}
              placeholder='IBAN'
            />
            <InputField
              id='bic'
              value={formData.bic}
              onChange={handleChange}
              placeholder='BIC'
            />
            <InputField
              id='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
            />

            <div className={styles.editBlock}>
              <InputField id='password' type='text' value='••••••••' readOnly />

              <div className={styles.actionWrapper}>
                <div
                  className={styles.actionLink}
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  <span>Edit password...</span>
                  <EditPasswordIcon />
                </div>
              </div>
            </div>

            <InputField
              id='telephoneNumber'
              value={formData.telephoneNumber}
              onChange={handleChange}
              placeholder='Phone number'
            />
          </div>
        </div>

        <div className={styles.logoAndSave}>
          <div
            className={styles.actionLink}
            onClick={() => setIsLogoModalOpen(true)}
          >
            <span>{formData.logoUrl ? 'Edit Logo' : 'Upload Logo'}</span>
            <UploadFileIcon />
          </div>

          <div className={styles.button}>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <ChangePassword
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <ImageUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onUpload={handleLogoUpload}
        aspectRatio={1}
        title={formData.logoUrl ? 'Edit Logo' : 'Upload Logo'}
      />
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => {}} />
      ))}
    </div>
  );
};

export default SellerProfile;
