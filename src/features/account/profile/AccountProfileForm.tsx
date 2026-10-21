import { ChangePassword } from '@/components/ChangePassword/ChangePassword';
import { ImageUploadModal } from '@/components/ImageUploadModal/ImageUploadModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { UploadFileIcon } from '@/components/ui/icons/UploadFileIcon';
import type { UserResponse } from '@/types/user';

import { AddressModal } from './components/AddressModal';
import { VerificationGuide } from './components/VerificationGuide/VerificationGuide';
import {
  CompanyDetailsSection,
  DeliveryAddressesSection,
  PersonalDetailsSection,
} from './components/sections';
import { useAccountProfileForm } from './hooks/useAccountProfileForm';
import layoutStyles from './AccountProfileForm.module.css';
import sectionStyles from './components/sections/ProfileFormSections.module.css';

interface AccountProfileFormProps {
  user: UserResponse;
  title: string;
  description: string;
}

export const AccountProfileForm = ({
  user,
  title,
  description,
}: AccountProfileFormProps) => {
  const {
    verificationStatus,
    missingRequiredFields,
    showMissingFields,
    addressDraft,
    addressErrors,
    addressToDelete,
    formData,
    formErrors,
    isAddressModalOpen,
    isLogoModalOpen,
    isPasswordModalOpen,
    isProfileDirty,
    isSavingAddress,
    isSavingProfile,
    isViewingLicense,
    licenseFileName,
    licenseInputRef,
    licenseStatus,
    pendingLicenseFile,
    shippingAddresses,
    handleAddressFieldChange,
    handleAddressModalExited,
    handleCloseAddressModal,
    handleDeleteAddress,
    handleFieldBlur,
    handleFieldChange,
    handleLicenseUpload,
    handleLogoUpload,
    handleRequestDeleteAddress,
    handleSaveAddress,
    handleSaveProfile,
    handleStartAddAddress,
    handleStartEditAddress,
    handleViewLicense,
    setAddressToDelete,
    setIsLogoModalOpen,
    setIsPasswordModalOpen,
  } = useAccountProfileForm(user);

  return (
    <div className={layoutStyles.profileContent}>
      <div>
        <h2 className={layoutStyles.profileTitle}>{title}</h2>
        <p className={layoutStyles.profileDescription}>{description}</p>
      </div>

      <VerificationGuide
        status={verificationStatus}
        missingFields={missingRequiredFields}
        onShowMissingFields={showMissingFields}
      />

      <div className={layoutStyles.profileLayout}>
        <PersonalDetailsSection
          formData={formData}
          formErrors={formErrors}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
          onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
        />

        <div className={layoutStyles.lightDivider} />

        <CompanyDetailsSection
          formData={formData}
          formErrors={formErrors}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
          licenseInputRef={licenseInputRef}
          licenseFileName={licenseFileName}
          licenseStatus={licenseStatus}
          pendingLicenseFile={pendingLicenseFile}
          isViewingLicense={isViewingLicense}
          onLicenseUpload={handleLicenseUpload}
          onViewLicense={handleViewLicense}
        />

        <div className={sectionStyles.saveBar}>
          <button
            type='button'
            className={sectionStyles.textAction}
            onClick={() => setIsLogoModalOpen(true)}
          >
            <span>{formData.logoUrl ? 'Edit logo' : 'Upload logo'}</span>
            <UploadFileIcon />
          </button>

          <div className={sectionStyles.buttonWrap}>
            <Button
              onClick={handleSaveProfile}
              isLoading={isSavingProfile}
              disabled={!isProfileDirty}
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className={layoutStyles.divider} />

        <div className={layoutStyles.bottomSection}>
          <DeliveryAddressesSection
            addresses={shippingAddresses}
            onAddAddress={handleStartAddAddress}
            onEditAddress={handleStartEditAddress}
            onDeleteAddress={handleRequestDeleteAddress}
          />
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
        title='Upload Company Logo'
      />

      <AddressModal
        draft={addressDraft}
        errors={addressErrors}
        isOpen={isAddressModalOpen}
        isSaving={isSavingAddress}
        onChange={handleAddressFieldChange}
        onSave={handleSaveAddress}
        onRequestClose={handleCloseAddressModal}
        onExited={handleAddressModalExited}
      />

      <ConfirmModal
        isOpen={Boolean(addressToDelete)}
        title='Delete address'
        message={`Remove "${addressToDelete?.title || addressToDelete?.street || 'this address'}" from saved delivery addresses?`}
        confirmText='Delete'
        cancelText='Keep'
        onConfirm={handleDeleteAddress}
        onCancel={() => setAddressToDelete(null)}
        variant='danger'
      />
    </div>
  );
};
